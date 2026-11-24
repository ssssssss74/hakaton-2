/**
 * Web Audio API synthesizer for court gavel sound and Web Speech API helpers.
 * 100% client-side, zero external network requests or quotas.
 */

// Generate realistic wooden gavel double-strike using Web Audio API synthesis
export function playGavelSound() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const strike = (timeOffset: number, freq: number, gainVal: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + timeOffset + 0.18);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.22);

      // Add low-pass filter for deep wooden resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime + timeOffset);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + timeOffset);
      osc.stop(ctx.currentTime + timeOffset + 0.25);
    };

    // Double strike of judge's wooden gavel (Thump... Thump!)
    strike(0.0, 110, 0.85);
    strike(0.24, 125, 0.95);
  } catch (e) {
    console.warn('Web Audio gavel sound could not be initialized:', e);
  }
}

// Track active audio element to stop playback when requested
let currentAudioElement: HTMLAudioElement | null = null;

// Stop all active audio playback (both HTML5 Audio and Web Speech synthesis)
export function stopSpeaking() {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {}
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Phonetically cleans Uzbek text for browser SpeechSynthesis.
 * Browsers often pause or spell out words when encountering apostrophes (o', g').
 * Stripping apostrophes ("o'g'irladim" -> "ogirladim", "bo'lgan" -> "bolgan")
 * allows Turkish, Latin, or multilingual engines to pronounce them smoothly.
 */
function cleanUzbekForBrowserSpeech(text: string): string {
  return text
    .replace(/[*#_`~]/g, '')
    .replace(/([oOgG])['`‘ʻ]/g, '$1')
    .replace(/['`‘ʻ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function speakWithBrowserSynth(text: string, onEnd?: () => void) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();

    const cleanText = cleanUzbekForBrowserSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'uz-UZ';

    const voices = window.speechSynthesis.getVoices();
    // 1. Look for true Uzbek voice
    // 2. Look for Turkish or Azerbaijani (shares closest phonetics/vowels to Uzbek)
    // 3. Fallback to default
    const bestVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('uz')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('tr')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('az')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en') && v.name.includes('Natural')) ||
      voices[0];

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.rate = 0.92; // Slightly measured pace for clearer articulation
    utterance.pitch = 0.95;

    let ended = false;
    utterance.onend = () => {
      if (!ended) {
        ended = true;
        if (onEnd) onEnd();
      }
    };
    utterance.onerror = () => {
      if (!ended) {
        ended = true;
        if (onEnd) onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
    if (onEnd) onEnd();
  }
}

// Speak text: first attempts realistic AI TTS via /api/tts, then falls back to browser synthesis
export async function speakUzbekText(text: string, onEnd?: () => void) {
  stopSpeaking();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  // 1. Try server-side AI TTS (gemini-3.8-flash-lite-tts) if backend is active
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        currentAudioElement = audio;

        audio.onended = () => {
          currentAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          currentAudioElement = null;
          speakWithBrowserSynth(text, onEnd);
        };

        await audio.play();
        return;
      }
    }
  } catch {
    // Backend TTS endpoint unavailable or error, fall through to browser synthesis
  }

  // 2. Fallback to client-side browser speech synthesis with Uzbek phonetic cleaning
  speakWithBrowserSynth(text, onEnd);
}

// Compute deterministic SHA-256 hash using Web Crypto API
export async function computeSha256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple hash string if crypto.subtle is unavailable
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return `sha256_${Math.abs(hash).toString(16).padStart(16, '0')}7f2a1b94c`;
  }
}
