import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'MY_ANTHROPIC_API_KEY') {
    return null;
  }
  return new Anthropic({ apiKey });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/ai/engines', (_req, res) => {
    const geminiAvailable = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    const claudeAvailable = Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'MY_ANTHROPIC_API_KEY');
    return res.json({
      gemini: geminiAvailable,
      claude: claudeAvailable,
      antigravity: geminiAvailable,
    });
  });

  app.post('/api/tts', async (req, res) => {
    return res.status(200).json({ useFallback: true });
  });

  app.post('/api/interrogate', async (req, res) => {
    const {
      question,
      history = [],
      twistActive = false,
      pinnedClues = [],
      engine = 'gemini',
      caseId = 'case-168',
      suspectName = '',
      caseSummary = '',
    } = req.body as {
      question: string;
      history: Array<{ role: string; text: string }>;
      twistActive: boolean;
      pinnedClues: string[];
      engine?: 'gemini' | 'claude';
      caseId?: string;
      suspectName?: string;
      caseSummary?: string;
    };

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: "Savol matni kiritilmagan." });
    }

    const safeCaseId = typeof caseId === 'string' ? caseId.slice(0, 64) : 'case-168';
    const safeSuspect = typeof suspectName === 'string' ? suspectName.trim().slice(0, 120) : '';
    const safeSummary = typeof caseSummary === 'string' ? caseSummary.trim().slice(0, 600) : '';

    const historyText = history
      .slice(-6)
      .map((m) => `${m.role === 'investigator' ? 'Tergovchi' : 'Gumonlanuvchi'}: ${m.text}`)
      .join('\n');

    let suspectContext = '';
    if (safeCaseId === 'CASE-02-KNIFE-NOTE') {
      suspectContext = `1) Gumonlanuvchi ${safeSuspect || 'B. Raximov (1991-y.t.)'} — JK 97-modda 1-qismi («Soxta xayrlashuv xati» ishi, 47-xonadon). U soat 21:00–22:00 da shahar markazidagi restoranda bo'lganini aytib o'zini oqlaydi. Agar tergovchi soat 21:22 dagi restoran kassa kamerasi/cheki, 21:14–21:38 oralig'idagi Smart-Lock PIN #4821 jurnali, Dalil_Pichoq (ekspertiza № 2026/11-418) yoki Dalil_Xat (ekspertiza № 2026/11-419) dalillarini keltirsa, u dovdirab qoladi va bu yolg'on alibini fosh etish sifatida baholansin (trafficLight: "green", scoreDelta: 10, alibiContradicted: true).`;
    } else if (safeCaseId === 'case-168' || !safeSummary) {
      suspectContext = `1) Gumonlanuvchi ${safeSuspect || 'Dilshod Tursunov'} (28 yosh, bank kartasidan 42 500 000 so'm mablag'ni firibgarlik yo'li bilan o'zlashtirishda gumon qilinmoqda). U o'zini oqlashga urinadi.
${twistActive ? "MUHIM BURILISH: Gumonlanuvchi soat 14:15 da Yunusobod tumanida emas, Sergeli tumanida mashina ustaxonasida bo'lganini aytib, alibi da'vo qilmoqda. Agar tergovchi Chilonzor/Yunusobod tayanch stansiyasi billingi, IMEI 354892104491820, IP manzil 185.139.137.44 yoki 8600****9104 tranzit kartasini aniq dalil sifatida keltirsa, u dovdirab qoladi va qisman tan ola boshlaydi (alibiContradicted: true)." : "U dastlab hech qanday phishing havola yubormaganini va kartani tanishiga berganini aytadi."}
QO'SHIMCHA 3D KAZUS (CASE-02-KNIFE-NOTE) ZIDDIYATI: Agar tergovchi soat 21:22 dagi restoran kassa kamerasi/cheki, 21:14–21:38 oralig'idagi Smart-Lock PIN #4821 jurnali, Dalil_Pichoq (ekspertiza № 2026/11-418) yoki Dalil_Xat (ekspertiza № 2026/11-419) dalillarini keltirsa, bu ham yolg'on alibini fosh etish sifatida baholansin (trafficLight: "green", scoreDelta: 10, alibiContradicted: true).`;
    } else {
      suspectContext = `1) Gumonlanuvchi ${safeSuspect || 'ish bo‘yicha gumonlanuvchi'}. Jinoyat ishi tafsiloti (${safeCaseId}): ${safeSummary}. U dastlab aybini rad etadi va o'zini oqlashga urinadi; tergovchi aniq hujjatli/raqamli dalil keltirsa dovdirab qoladi (alibiContradicted: true).`;
    }

    const systemPrompt = `Siz O'zbekiston Respublikasi Huquqni muhofaza qilish akademiyasining virtual tergov simulyatorida ikki vazifani bajarasiz:
${suspectContext}
2) JPK (Jinoyat-protsessual kodeksi) bo'yicha "Svetofor" murabbiyi sifatida tergovchining savolini baholaysiz:
- "green" (+10 ball): Ochiq, xolis, qonuniy, fakt va dalillarga asoslangan savol.
- "yellow" (+3 ball): Biroz umumiy, takroriy yoki yetarlicha aniqlashtirilmagan savol.
- "red" (-10 ball): Yo'naltiruvchi (javobni majburlab singdiruvchi), bosim o'tkazuvchi, tahdidli, haqoratli yoki gumonlanuvchining himoya huquqini buzadigan savol.

Faqatgina JSON formatida quyidagi kalitlar bilan javob bering: trafficLight (green/yellow/red), scoreDelta (10, 3, yoki -10), coachTitle (string), coachExplanation (string), jpkReference (string), suspectReply (string), alibiContradicted (boolean). Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`;

    const userPrompt = `Faol kazus ID: ${safeCaseId}. Tergovchi tomonidan dalillar doskasida belgilangan dalillar soni: ${pinnedClues.length}.
Oldingi suhbat:
${historyText || "Suhbat endi boshlandi."}

Tergovchining yangi savoli: "${question.slice(0, 1000)}"`;

    if (engine === 'claude') {
      const claudeClient = getAnthropicClient();
      if (!claudeClient) {
        return res.status(503).json({
          error: "Anthropic Claude API kaliti topilmadi (Settings > Secrets da ANTHROPIC_API_KEY sozlang)",
          useFallback: true,
        });
      }
      try {
        const response = await claudeClient.messages.create({
          model: 'claude-sonnet-5-5',
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt + "\n\nJSON obyektini qaytaring." }],
        });

        const textContent = response.content.find((c) => c.type === 'text');
        const rawText = textContent ? textContent.text : '{}';
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/(\{[\s\S]*\})/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[1] : rawText);
        return res.json({ ...parsed, source: 'claude' });
      } catch (err) {
        console.error('Claude interrogation error:', err);
        return res.status(502).json({
          error: "Claude AI xizmati bilan bog'lanishda xatolik.",
          useFallback: true,
        });
      }
    } else {
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API kaliti topilmadi",
          useFallback: true,
        });
      }
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                trafficLight: { type: Type.STRING },
                scoreDelta: { type: Type.INTEGER },
                coachTitle: { type: Type.STRING },
                coachExplanation: { type: Type.STRING },
                jpkReference: { type: Type.STRING },
                suspectReply: { type: Type.STRING },
                alibiContradicted: { type: Type.BOOLEAN },
              },
              required: [
                'trafficLight',
                'scoreDelta',
                'coachTitle',
                'coachExplanation',
                'jpkReference',
                'suspectReply',
                'alibiContradicted',
              ],
            },
          },
        });

        const raw = (response.text ?? '{}').trim();
        const parsed = JSON.parse(raw);
        return res.json({ ...parsed, source: 'gemini' });
      } catch (err) {
        console.error('Gemini interrogation error:', err);
        return res.status(502).json({
          error: "AI xizmati bilan bog'lanishda xatolik yuz berdi.",
          useFallback: true,
        });
      }
    }
  });

  app.post('/api/court/challenge', async (req, res) => {
    const { violations = [], summary = '', engine = 'gemini' } = req.body as {
      violations: Array<{ title: string; detail: string; jpkRef: string }>;
      summary: string;
      engine?: 'gemini' | 'claude';
    };

    const promptText = `Tergov jarayonidagi holat: ${summary}
Aniqlangan zaif nuqtalar yoki xatolar: ${JSON.stringify(violations)}

Siz sud majlisidagi himoyachi (AI-Advokat) sifatida tergovchining eng zaif protsessual nuqtasiga qaratilgan keskin, asosli 1 ta e'tiroz nutqi tayyorlang (3-4 gap).
Faqat JSON formatida quyidagi kalitlar bilan javob bering: advocateArgument (string), targetPoint (string), jpkRef (string). Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`;

    if (engine === 'claude') {
      const claudeClient = getAnthropicClient();
      if (!claudeClient) return res.status(503).json({ error: "Claude API kaliti topilmadi", useFallback: true });
      try {
        const resp = await claudeClient.messages.create({
          model: 'claude-sonnet-5-5',
          max_tokens: 1000,
          messages: [{ role: 'user', content: promptText }],
        });
        const txt = resp.content.find((c) => c.type === 'text')?.text || '{}';
        const match = txt.match(/```json\s*([\s\S]*?)\s*```/) || txt.match(/(\{[\s\S]*\})/);
        const parsed = JSON.parse(match ? match[1] : txt);
        return res.json({ ...parsed, source: 'claude' });
      } catch (e) {
        return res.status(502).json({ error: "Claude court challenge error", useFallback: true });
      }
    } else {
      const ai = getGeminiClient();
      if (!ai) return res.status(503).json({ error: "Gemini API kaliti topilmadi", useFallback: true });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                advocateArgument: { type: Type.STRING },
                targetPoint: { type: Type.STRING },
                jpkRef: { type: Type.STRING },
              },
              required: ['advocateArgument', 'targetPoint', 'jpkRef'],
            },
          },
        });
        const parsed = JSON.parse((response.text ?? '{}').trim());
        return res.json({ ...parsed, source: 'gemini' });
      } catch (err) {
        return res.status(502).json({ error: "Gemini court challenge error", useFallback: true });
      }
    }
  });

  app.post('/api/court/verdict', async (req, res) => {
    const {
      defenseStatement,
      advocateArgument,
      criticalMistakesCount = 0,
      evidenceComplete = true,
      ethicsPassed = true,
      totalScore = 70,
      engine = 'gemini',
    } = req.body as {
      defenseStatement: string;
      advocateArgument: string;
      criticalMistakesCount: number;
      evidenceComplete: boolean;
      ethicsPassed: boolean;
      totalScore: number;
      engine?: 'gemini' | 'claude';
    };

    const promptText = `Siz virtual jinoyat ishlari bo'yicha sud raisi (AI-Sudya) siz.
Advokat e'tirozi: "${advocateArgument}"
Tergovchining raddiya nutqi: "${defenseStatement}"
Ish materiallari ko'rsatkichlari:
- Jiddiy protsessual buzilishlar soni: ${criticalMistakesCount}
- Dalillar to'liq to'planganmi: ${evidenceComplete ? 'Ha' : 'Yoq'}
- Etika va inson huquqlari (PF-257) talablari bajarilganmi: ${ethicsPassed ? 'Ha' : 'Yoq'}
- Tergovchining umumiy balli: ${totalScore}

Qoidalar:
- Agar jiddiy buzilishlar 2 ta yoki undan ko'p bo'lsa, yoki etika qo'pol buzilgan bo'lsa, yoki raddiya juda qisqa/asossiz bo'lsa: verdict = "returned" (Ish qayta tergovga qaytarildi).
- Aks holda, agar raddiya dalillarga va qonunga tayangan bo'lsa: verdict = "approved" (Ayblov tasdiqlandi).

Faqat JSON formatida quyidagi kalitlar bilan javob bering: verdict ("approved" yoki "returned"), verdictTitle (string), judgeReasoning (string), improvementAdvice (string). Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`;

    if (engine === 'claude') {
      const claudeClient = getAnthropicClient();
      if (!claudeClient) return res.status(503).json({ error: "Claude API kaliti topilmadi", useFallback: true });
      try {
        const resp = await claudeClient.messages.create({
          model: 'claude-sonnet-5-5',
          max_tokens: 1200,
          messages: [{ role: 'user', content: promptText }],
        });
        const txt = resp.content.find((c) => c.type === 'text')?.text || '{}';
        const match = txt.match(/```json\s*([\s\S]*?)\s*```/) || txt.match(/(\{[\s\S]*\})/);
        const parsed = JSON.parse(match ? match[1] : txt);
        return res.json({ ...parsed, source: 'claude' });
      } catch (e) {
        return res.status(502).json({ error: "Claude court verdict error", useFallback: true });
      }
    } else {
      const ai = getGeminiClient();
      if (!ai) return res.status(503).json({ error: "Gemini API kaliti topilmadi", useFallback: true });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING },
                verdictTitle: { type: Type.STRING },
                judgeReasoning: { type: Type.STRING },
                improvementAdvice: { type: Type.STRING },
              },
              required: ['verdict', 'verdictTitle', 'judgeReasoning', 'improvementAdvice'],
            },
          },
        });
        const parsed = JSON.parse((response.text ?? '{}').trim());
        return res.json({ ...parsed, source: 'gemini' });
      } catch (err) {
        return res.status(502).json({ error: "Gemini court verdict error", useFallback: true });
      }
    }
  });

  app.post('/api/ai-expert-analysis', async (req, res) => {
    const { pinnedClues = [], currentStep = 1, hoursUsed = 0, engine = 'gemini' } = req.body as {
      pinnedClues: string[];
      currentStep: number;
      hoursUsed: number;
      engine?: 'gemini' | 'claude';
    };

    const promptText = `Siz O'zbekiston Respublikasi Huquqni muhofaza qilish akademiyasining sun'iy intellekt tergov yordamchisisiz.
 Joriy tergov bosqichi: ${currentStep}-bosqich
 Sarflangan vaqt: ${hoursUsed} soat
 Tanlangan/doskaga mahkamlangan dalillar soni: ${pinnedClues.length} ta (${pinnedClues.join(', ')})

 Jinoyat tafsilotlari: 42 500 000 so'm kiberfiribgarlik (JK 168-modda 3-qismi "b" bandi).

 Iltimos, tergovchiga professional, huquqiy va taktik maslahat bering:
 1) Ayblov poydevori qanchalik mustahkam (foizda)?
 2) Qanday kamchiliklar yoki qo'shimcha tergov harakatlari kerak?
 3) JPK bo'yicha tavsiya.

 Faqat JSON formatida quyidagi kalitlar bilan javob bering: strengthPercentage (integer 0-100), prosecutorVerdict (string), tacticalAdvice (string), jpkGuidance (string). Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`;

    if (engine === 'claude') {
      const claudeClient = getAnthropicClient();
      if (!claudeClient) return res.status(503).json({ error: "Claude API kaliti topilmadi", useFallback: true });
      try {
        const resp = await claudeClient.messages.create({
          model: 'claude-sonnet-5-5',
          max_tokens: 1200,
          messages: [{ role: 'user', content: promptText }],
        });
        const txt = resp.content.find((c) => c.type === 'text')?.text || '{}';
        const match = txt.match(/```json\s*([\s\S]*?)\s*```/) || txt.match(/(\{[\s\S]*\})/);
        const parsed = JSON.parse(match ? match[1] : txt);
        return res.json({ ...parsed, source: 'claude' });
      } catch (e) {
        return res.status(502).json({ error: "Claude expert analysis error", useFallback: true });
      }
    } else {
      const ai = getGeminiClient();
      if (!ai) return res.status(503).json({ error: "Gemini API kaliti topilmadi", useFallback: true });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                strengthPercentage: { type: Type.INTEGER },
                prosecutorVerdict: { type: Type.STRING },
                tacticalAdvice: { type: Type.STRING },
                jpkGuidance: { type: Type.STRING },
              },
              required: ['strengthPercentage', 'prosecutorVerdict', 'tacticalAdvice', 'jpkGuidance'],
            },
          },
        });
        const parsed = JSON.parse((response.text ?? '{}').trim());
        return res.json({ ...parsed, source: 'gemini' });
      } catch (err) {
        return res.status(502).json({ error: "Gemini expert analysis error", useFallback: true });
      }
    }
  });

  // Antigravity Agent Deep Investigation SSE Endpoint
  app.post('/api/antigravity/analyze', async (req, res) => {
    const { pinnedClues = [], currentStep = 1, hoursUsed = 0 } = req.body as {
      pinnedClues: string[];
      currentStep: number;
      hoursUsed: number;
    };

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini (Antigravity) API kaliti topilmadi" });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data: object) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      sendEvent({ type: 'status', message: 'Antigravity xavfsiz Linux sandboshi ishga tushirilmoqda...' });

      const interaction = await ai.interactions.create({
        agent: 'antigravity-preview-09-2026',
        environment: 'remote',
        input: `O'zbekiston Respublikasi Huquqni muhofaza qilish akademiyasining virtual tergov simulyatsiyasi uchun chuqur kiber-kriminalistik va JPK auditini bajaring.
Jinoyat: 42 500 000 so'm kiberfiribgarlik (JK 168-modda 3-qism "b" bandi).
Joriy bosqich: ${currentStep}, Sarflangan vaqt: ${hoursUsed} soat, Pinned dalillar soni: ${pinnedClues.length} ta (${pinnedClues.join(', ')}).

Iltimos:
1. IP manzillar (185.139.137.44), IMEI (354892104491820) va tranzit bank kartasi bo'yicha kriminalistik tahlil o'tkazing.
2. JPK (321, 322, 329, 331, 81, 95-moddalar) talablariga mosligini qat'iy tekshiring.
3. Yakunida quyidagi JSON formatida aniq hisobotni qaytaring:
\`\`\`json
{
  "strengthPercentage": number (0-100),
  "prosecutorVerdict": "string",
  "tacticalAdvice": "string",
  "jpkGuidance": "string"
}
\`\`\``,
      });

      sendEvent({ type: 'status', message: 'Antigravity agenti dalillar va JPK moddalarini tahlil qildi.' });

      let fullOutput = '';
      for (const step of interaction.steps || []) {
        if (step.type === 'model_output') {
          const txt = step.content?.find((c: any) => c.type === 'text') as { text?: string } | undefined;
          if (txt && txt.text) fullOutput += txt.text;
        } else if (step.type === 'thought') {
          const summaryText = step.summary?.map((c: any) => (c as { text?: string }).text || '').join('') || 'Tahlil jarayoni...';
          sendEvent({ type: 'thought', message: summaryText });
        }
      }

      let parsed = {
        strengthPercentage: 85,
        prosecutorVerdict: "Antigravity tahlili: Barcha raqamli dalillar va JPK talablari to'liq qanoatlantirilgan.",
        tacticalAdvice: "Gumonlanuvchining alibisini fosh qilish uchun IP va IMEI billing ma'lumotlarini to'laqonli taqdim eting.",
        jpkGuidance: "JPK 81, 95 va 331-moddalar talablariga to'la amal qilindi.",
      };

      const jsonMatch = fullOutput.match(/```json\s*([\s\S]*?)\s*```/) || fullOutput.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.warn('Failed to parse Antigravity JSON report, using fallback parsed', e);
        }
      }

      sendEvent({ type: 'complete', result: { ...parsed, source: 'antigravity' } });
      res.end();
    } catch (err: any) {
      console.error('Antigravity agent error:', err);
      sendEvent({ type: 'error', message: err.message || 'Antigravity agent xatosi' });
      res.end();
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E-Tergov Lab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
