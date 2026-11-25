import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Send,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  Scale,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Info,
  Wand2,
  Copy,
  Check,
} from 'lucide-react';
import {
  ETHICS_DILEMMA,
  resolveActiveCaseMeta,
} from '../../data/caseData';
import { SimulationState } from '../../types/simulation';
import { speakUzbekText, stopSpeaking } from '../../utils/audioEffects';
import { SuspectBiometricScanner } from '../SuspectBiometricScanner';

interface Step4InterrogationProps {
  state: SimulationState;
  isSending: boolean;
  onSendQuestion: (question: string) => Promise<void>;
  onOpenEthics: () => void;
  onAnswerEthics: (choiceId: string) => void;
  onCompleteStep4: () => void;
  onNextStep: () => void;
}

export const Step4Interrogation: React.FC<Step4InterrogationProps> = ({
  state,
  isSending,
  onSendQuestion,
  onOpenEthics,
  onAnswerEthics,
  onCompleteStep4,
  onNextStep,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showVoiceInfo, setShowVoiceInfo] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [demoSampleIdx, setDemoSampleIdx] = useState(0);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);

  const DEMO_INTERROGATION_SAMPLES = [
    'Soat 14:15 da IP 185.139.137.44, @orion_verify_bot va IMEI 354892104491820 Yunusobod BS-TSH-104 stansiyasida qayd etilganini hamda ATM #412 kamerasini qanday izohlaysiz?',
    'Soat 21:22 da restoran kassa kamerasida boshqa shaxs to‘lov qilgani, 21:14–21:38 da esa Smart-Lock #4821 orqali 47-xonadonga kirilganini qanday izohlaysiz?',
  ];

  const handleFillDemoQuestion = () => {
    const pool = activeCase.isKnifeNote
      ? [DEMO_INTERROGATION_SAMPLES[1], ...activeCase.quickQuestions]
      : activeCase.isDefaultCase
        ? DEMO_INTERROGATION_SAMPLES
        : activeCase.quickQuestions;
    setInputText(pool[demoSampleIdx % pool.length]);
    setDemoSampleIdx((prev) => prev + 1);
  };

  const handleCopyTranscript = async () => {
    const header = [
      `SO‘ROQ BAYONNOMASI — ${activeCase.caseNumber}`,
      `Ish: ${activeCase.title}`,
      `Tergovchi: ${state.studentName} (${state.studentGroup})`,
      `Gumonlanuvchi: ${activeCase.suspectName}`,
      '--------------------------------------------------',
    ].join('\n');

    const lines = state.interrogationMessages.map((m) => {
      const speaker =
        m.role === 'system'
          ? '[TIZIM]'
          : m.role === 'investigator'
            ? `[${m.timestamp}] TERGOVCHI`
            : `[${m.timestamp}] GUMONLANUVCHI (${activeCase.suspectName})`;
      const evalLine = m.evaluation
        ? `\n   -> Svetofor: ${m.evaluation.coachTitle} (${m.evaluation.jpkReference}, ${m.evaluation.scoreDelta >= 0 ? `+${m.evaluation.scoreDelta}` : m.evaluation.scoreDelta} ball)`
        : '';
      return `${speaker}: ${m.text}${evalLine}`;
    });

    try {
      await navigator.clipboard.writeText(`${header}\n${lines.join('\n\n')}`);
      setCopiedTranscript(true);
      window.setTimeout(() => setCopiedTranscript(false), 2500);
    } catch {
      setCopiedTranscript(false);
    }
  };

  const investigatorQuestionsCount = state.interrogationMessages.filter(
    (m) => m.role === 'investigator'
  ).length;

  const lastEvalMsg = state.interrogationMessages
    .slice()
    .reverse()
    .find((m) => m.evaluation?.trafficLight);
  const lastTrafficLight = lastEvalMsg?.evaluation?.trafficLight || null;

  // Cleanup any playing audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Auto-speak new suspect responses if audio is enabled
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const lastMsg = state.interrogationMessages[state.interrogationMessages.length - 1];
    if (isAudioEnabled && lastMsg && lastMsg.role === 'suspect') {
      setActiveSpeakingId(lastMsg.id);
      speakUzbekText(lastMsg.text, () => setActiveSpeakingId(null));
    }
  }, [state.interrogationMessages.length, isAudioEnabled]);

  const handleToggleSpeechRecognition = async () => {
    try {
      setMicError(null);

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setMicError(
          'Brauzeringizda ovozli kiritish qo‘llab-quvvatlanmaydi. Matn maydoni yoki tayyor demo savol tugmalaridan foydalaning.'
        );
        return;
      }

      if (isListening) {
        try {
          recognitionRef.current?.stop();
        } catch {
          // Ignore stop errors
        }
        setIsListening(false);
        return;
      }

    // Pre-request microphone access via getUserMedia to trigger browser permission popup
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close audio track immediately after permission grant
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (permErr: any) {
      console.warn('Microphone permission error:', permErr);
      setMicError(
        "Mikrofondan foydalanishga ruxsat berilmadi yoki bloklangan. Iltimos, brauzer qidiruv qatoridagi qulf/sozlamalar belgisini bosib, mikrofonga ruxsat bering (yoki Shared havolani to'liq ekranda oching)."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'uz-UZ';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error event:', e);
        setIsListening(false);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setMicError(
            "Mikrofon xavfsizlik sozlamalari tufayli cheklandi. Brauzerda mikrofonga ruxsat bering yoki sahifani yangilab, Shared havolada sinab ko'ring."
          );
        } else if (e.error === 'no-speech') {
          setMicError("Hech qanday ovoz eshitilmadi. Iltimos, mikrofonga yaqinroq gapiring.");
        } else if (e.error === 'network') {
          setMicError("Ovozni aniqlash tarmog'i bilan bog'lanishda xatolik yuz berdi. Internet aloqasini tekshiring.");
        } else {
          setMicError(`Mikrofon xatosi: ${e.error || 'Nomaʼlum xatolik'}.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Speech recognition init error:', err);
      setIsListening(false);
      setMicError(
        'Mikrofon ulanmadi. Xavotir olmang — tayyor «Demo savol» tugmalari orqali so‘roqni uzluksiz davom ettiring.'
      );
    }
    } catch {
      setIsListening(false);
      setMicError('Mikrofon ishga tushmadi. Tayyor demo savol tugmalaridan foydalaning.');
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (activeSpeakingId === msgId) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      setActiveSpeakingId(msgId);
      speakUzbekText(text, () => setActiveSpeakingId(null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;
    setInputText('');
    await onSendQuestion(trimmed);
  };

  const canFinishStep = investigatorQuestionsCount >= 3 && state.ethicsState.answered;

  return (
    <div className="space-y-6">
      {/* Dynamic Plot Twist Alert Banner */}
      {state.twistTriggered && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-amber-950 text-sm">
                Kutilmagan burilish: Gumonlanuvchi yangi alibi ilgari surdi!
              </div>
              <p className="text-amber-900 leading-relaxed">
                {activeCase.isKnifeNote ? (
                  <>
                    {activeCase.suspectName} soat 21:00–22:00 da restoranda bo‘lganini da’vo qilmoqda.{' '}
                    <span className="font-mono font-semibold">Smart-Lock #4821 (21:14–21:38)</span>,{' '}
                    <span className="font-mono font-semibold">restoran kamerasi (21:22)</span> hamda{' '}
                    <span className="font-semibold">№ 2026/11-418 / № 2026/11-419</span> ekspertizalar bilan alibini fosh eting!
                  </>
                ) : activeCase.isDefaultCase ? (
                  <>
                    D.Tursunov kutilmaganda soat 14:15 da Yunusobodda emas, Sergeli tumanidagi avtoustaxonada bo‘lganini da’vo qilmoqda. 2-bosqichdagi{' '}
                    <span className="font-mono font-semibold">IMEI 354892104491820</span>,{' '}
                    <span className="font-mono font-semibold">IP 185.139.137.44</span> va{' '}
                    <span className="font-semibold">Yunusobod BS-TSH-104</span> tayanch stansiyasi billingi bilan uni fosh eting!
                  </>
                ) : (
                  <>
                    {activeCase.suspectName} ish bo‘yicha yangi alibi ilgari surmoqda. To‘plangan raqamli loglar, ekspertiza va hujjatli dalillar asosida qarama-qarshiliklarni fosh eting!
                  </>
                )}
              </p>
            </div>
          </div>
          {state.alibiConfronted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Alibi rad etildi</span>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Interrogation Chat Console */}
        <div className="xl:col-span-8 surface-card rounded-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C0CEC8] flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#D7E4DF] via-[#E2EAE6] to-[#EAEFED] text-slate-900">
            <div>
              <div className="text-[11px] font-mono font-semibold text-teal-800">
                4-bosqich · Audio-vizual so‘roq xonasi · {activeCase.caseNumber}
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                AI-So‘roq — Gumonlanuvchi {activeCase.suspectName}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleCopyTranscript}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#B8C7C0] bg-[#F2F4F3] hover:bg-[#E2EAE6] text-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                title="So‘roq bayonnomasini nusxalash"
              >
                {copiedTranscript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                    <span className="text-teal-800">Nusxalandi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-teal-700" />
                    <span>Bayonnomani nusxalash</span>
                  </>
                )}
              </motion.button>
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    if (isAudioEnabled) stopSpeaking();
                    setIsAudioEnabled(!isAudioEnabled);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isAudioEnabled
                      ? 'bg-[#0F766E] border-[#0F766E] text-white'
                      : 'bg-[#E9EEEC] border-[#C2CFC9] text-slate-600'
                  }`}
                  title={isAudioEnabled ? "Gumonlanuvchi javoblarini ovozda o'qishni o'chirish" : "Ovozda o'qishni yoqish"}
                >
                  {isAudioEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ovoz: Yoqilgan</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Ovoz: O‘chirilgan</span>
                    </>
                  )}
                </motion.button>
              </div>

              <button
                type="button"
                onClick={() => setShowVoiceInfo(!showVoiceInfo)}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  showVoiceInfo
                    ? 'bg-amber-400 border-amber-500 text-slate-900'
                    : 'bg-[#F2F4F3] border-[#B8C7C0] text-slate-700 hover:bg-[#E2EAE6]'
                }`}
                title="Ovoz sifati va aksent haqida ma'lumot"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              <div className="text-xs font-mono tabular-nums text-slate-700 font-semibold pl-1">
                Savollar: {investigatorQuestionsCount}/3+
              </div>
            </div>
          </div>

          {/* Voice explanation help note */}
          <AnimatePresence>
            {showVoiceInfo && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="bg-[#E4EFEA] border-b border-[#B9CEC5] px-6 py-3 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <Info className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900">
                    Nega brauzer ovozi o‘zbekcha so‘zlarni aksent bilan o‘qiydi?
                  </div>
                <p className="leading-relaxed text-slate-600">
                  Windows va macOS kompyuterlarida sukut bo‘yicha rasmiy o‘zbek tili ovoz paketi (uz-UZ) o‘rnatilmagan bo‘ladi.
                  Shuning uchun brauzerning ichki sintezatori matnni eng yaqin turkiy/ingliz fonetikasida talaffuz qiladi.
                  Agar bu sizga xalaqit bersa, yuqoridagi <strong>«Ovoz: O‘chirilgan»</strong> tugmasini bosib, tergovni to‘liq matnli rejimda olib borishingiz mumkin.
                </p>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Feed */}
          <div className="p-5 space-y-4 max-h-[470px] overflow-y-auto bg-[#E9EEEC]">
            {state.interrogationMessages.map((msg) => {
              if (msg.role === 'system') {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-center text-xs text-slate-600 py-1.5 px-4 bg-[#F4F6F5] border border-[#C6D1CC] rounded-lg"
                  >
                    {msg.text}
                  </motion.div>
                );
              }

              const isInvestigator = msg.role === 'investigator';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col ${isInvestigator ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl p-4 text-sm leading-relaxed border ${
                      isInvestigator
                        ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-xs'
                        : 'bg-[#F5F7F6] text-slate-900 border-[#C6D1CC]'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-4 text-[11px] mb-1.5 ${
                        isInvestigator ? 'text-teal-100' : 'text-slate-600'
                      }`}
                    >
                      <span className="font-semibold">
                        {isInvestigator ? 'Tergovchi (Siz)' : `Gumonlanuvchi: ${activeCase.suspectName}`}
                      </span>
                      <div className="flex items-center gap-2">
                        {!isInvestigator && (
                          <button
                            type="button"
                            title="Ovozda eshitish"
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            className="p-1 rounded hover:bg-[#E2EAE6] text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${activeSpeakingId === msg.id ? 'text-teal-700 animate-pulse' : ''}`} />
                          </button>
                        )}
                        <span className="font-mono tabular-nums">{msg.timestamp}</span>
                      </div>
                    </div>
                    <p>{msg.text}</p>
                  </div>

                  {/* Svetofor Coach Evaluation */}
                  {isInvestigator && msg.evaluation && (
                    <div
                      className={`mt-2 max-w-[88%] rounded-lg border px-3.5 py-2.5 text-xs ${
                        msg.evaluation.trafficLight === 'green'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : msg.evaluation.trafficLight === 'yellow'
                            ? 'bg-amber-50 border-amber-200 text-amber-950'
                            : 'bg-red-50 border-red-200 text-red-950'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          {msg.evaluation.trafficLight === 'green' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          )}
                          {msg.evaluation.trafficLight === 'yellow' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                          )}
                          {msg.evaluation.trafficLight === 'red' && (
                            <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                          )}
                          <span>{msg.evaluation.coachTitle}</span>
                        </span>
                        <span className="font-mono tabular-nums">
                          {msg.evaluation.jpkReference} ·{' '}
                          {msg.evaluation.scoreDelta >= 0
                            ? `+${msg.evaluation.scoreDelta}`
                            : msg.evaluation.scoreDelta}{' '}
                          ball
                        </span>
                      </div>
                      <p className="mt-1 opacity-90 leading-relaxed">
                        {msg.evaluation.coachExplanation}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-600 pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                <span>Gumonlanuvchi javob tayyorlamoqda va Svetofor tahlil qilmoqda...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick-Suggest Questions */}
          <div className="px-5 pt-3 pb-2 border-t border-[#C6D1CC] bg-[#F2F4F3] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] font-semibold text-slate-600">
                Tavsiya etilgan tergov savollari (bosib yuborish):
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => onSendQuestion(DEMO_INTERROGATION_SAMPLES[0])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DDEAE5] hover:bg-[#CEE1DA] border border-[#AFC8BF] text-teal-950 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <Wand2 className="w-3 h-3 text-teal-800" />
                  <span>Demo savol (1-kazus)</span>
                </button>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => onSendQuestion(DEMO_INTERROGATION_SAMPLES[1])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <Wand2 className="w-3 h-3 text-[#D97706]" />
                  <span>Demo savol (2-kazus: 21:22)</span>
                </button>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleFillDemoQuestion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <span>Matnga kiritish</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeCase.quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isSending}
                  onClick={() => onSendQuestion(q)}
                  className="text-left text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {idx + 1}. {q.length > 74 ? `${q.slice(0, 74)}...` : q}
                </button>
              ))}
            </div>
          </div>

          {/* Live Microphone Recording Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center justify-between text-xs text-red-900 animate-pulse">
              <span className="flex items-center gap-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span>Mikrofon faol: O‘zbek tilida savolingizni ayting...</span>
              </span>
              <button
                type="button"
                onClick={handleToggleSpeechRecognition}
                className="text-red-700 underline font-medium cursor-pointer"
              >
                To‘xtatish
              </button>
            </div>
          )}

          {/* Microphone Error Notification */}
          {micError && (
            <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-300 flex items-start justify-between gap-3 text-xs text-amber-950">
              <div className="space-y-0.5">
                <span className="font-semibold">{micError}</span>
                <p className="text-[11px] text-amber-800">
                  Maslahat: Yuqoridagi tayyor savollardan birini bosib ham so‘roqni davom ettirishingiz mumkin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMicError(null)}
                className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer shrink-0"
              >
                Yopish
              </button>
            </div>
          )}

          {/* Free-text Input with Microphone Speech-to-Text */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-[#C6D1CC] bg-[#F2F4F3] flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleSpeechRecognition}
              title={isListening ? 'Ovoz yozishni to‘xtatish' : 'Ovozli so‘roq (Mikrofon)'}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-[#E6ECE9] hover:bg-[#DAE4DF] border-[#C2CFC9] text-slate-800'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-teal-800" />}
              <span className="hidden sm:inline">{isListening ? 'To‘xtatish' : 'Ovozli so‘roq'}</span>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSending}
              placeholder={isListening ? "Tinglanmoqda... gapiring..." : "O'zbek tilida savolingizni yozing yoki mikrofonga bosing..."}
              className="flex-1 rounded-xl border border-[#C2CFC9] bg-[#F6F8F7] px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Yuborish</span>
            </motion.button>
          </form>
        </div>

        {/* Right Side Panel: Suspect Biometric Scanner + Svetofor Guide + Ethics Card */}
        <div className="xl:col-span-4 space-y-5">
          <SuspectBiometricScanner
            twistActive={state.twistTriggered}
            alibiConfronted={state.alibiConfronted}
            questionsCount={investigatorQuestionsCount}
            lastTrafficLight={lastTrafficLight || null}
            isSpeaking={Boolean(activeSpeakingId) || isSending}
          />

          {/* Svetofor Legend */}
          <div className="surface-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-teal-800" />
              <span>«Svetofor» real-vaqt indikatori</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="font-semibold text-emerald-900">
                  Yashil — To‘g‘ri taktika (+10 ball)
                </div>
                <div className="text-emerald-800 mt-0.5">
                  Ochiq, qonuniy, fakt va raqamli dalillarga tayangan savol.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="font-semibold text-amber-900">
                  Sariq — Aniqlashtirish kerak (+3 ball)
                </div>
                <div className="text-amber-800 mt-0.5">
                  Haddan tashqari umumiy, takroriy yoki dalilsiz savol.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="font-semibold text-red-900">
                  Qizil — JPK xavfi! (-10 ball)
                </div>
                <div className="text-red-800 mt-0.5">
                  Bosim, tahdid, yo‘naltiruvchi yoki himoya huquqini buzuvchi savol.
                </div>
              </div>
            </div>
          </div>

          {/* PF-257 Ethics Status Card */}
          <div className="surface-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <Scale className="w-4 h-4 text-[#D97706]" />
                <span>Etika dilemmasi (PF-257)</span>
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums text-slate-700">
                Indeks: {state.ethicsIndex}%
              </span>
            </div>

            {!state.ethicsState.answered ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  So‘roq bosqichini yakunlashdan avval inson huquqlari va kasbiy etika
                  vaziyatida qonuniy qaror qabul qilishingiz zarur.
                </p>
                <button
                  type="button"
                  onClick={onOpenEthics}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#D97706] hover:bg-amber-700 rounded-lg cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Etika sinovini ochish</span>
                </button>
              </div>
            ) : (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  state.ethicsState.lawful
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <div className="font-semibold">
                  {state.ethicsState.lawful
                    ? 'Qonuniy va halol qaror qabul qilindi'
                    : 'Etika va JPK 48-modda buzilishi qayd etildi'}
                </div>
                <p className="mt-1 leading-relaxed opacity-90">
                  {state.ethicsState.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Finish Step 4 */}
          <div className="surface-card rounded-2xl p-5 space-y-3">
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Kamida 3 ta so‘roq savoli:</span>
                <span className="font-mono font-semibold tabular-nums">
                  {Math.min(3, investigatorQuestionsCount)}/3
                </span>
              </div>
              <div className="flex justify-between">
                <span>PF-257 Etika qarori:</span>
                <span className="font-semibold">
                  {state.ethicsState.answered ? 'Bajarildi' : 'Kutilmoqda'}
                </span>
              </div>
            </div>

            {!state.step4Completed ? (
              <motion.button
                whileTap={canFinishStep ? { scale: 0.98 } : undefined}
                type="button"
                disabled={!canFinishStep}
                onClick={onCompleteStep4}
                className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors ${
                  canFinishStep
                    ? 'bg-[#0F766E] hover:bg-[#115E59] text-white cursor-pointer shadow-xs'
                    : 'bg-[#DCE3E0] text-slate-500 cursor-not-allowed'
                }`}
              >
                So‘roq bayonnomasini yakunlash
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onNextStep}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white cursor-pointer shadow-xs"
              >
                <span>5-bosqich: Prokuror nazorati</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* PF-257 Ethical Dilemma Modal */}
      <AnimatePresence>
        {state.ethicsDilemmaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F2F4F3] border border-[#C6D1CC] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#CFD8D4]">
                <div>
                  <div className="text-xs font-semibold text-amber-700">
                    {ETHICS_DILEMMA.codeRef}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {ETHICS_DILEMMA.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed bg-[#E9EEEC] border border-[#C6D1CC] rounded-xl p-4">
                {ETHICS_DILEMMA.scenario}
              </p>

              <div className="space-y-3">
                {ETHICS_DILEMMA.options.map((opt) => (
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    key={opt.id}
                    type="button"
                    onClick={() => onAnswerEthics(opt.id)}
                    className="w-full text-left p-4 rounded-xl bg-[#F5F7F6] border border-[#C6D1CC] hover:border-[#0F766E] hover:bg-[#E7F0EC] transition-colors cursor-pointer"
                  >
                    <div className="text-sm font-semibold text-slate-900">{opt.title}</div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {opt.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
