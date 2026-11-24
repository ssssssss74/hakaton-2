import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/tts', async (req, res) => {
    // Return useFallback: true so client uses browser SpeechSynthesis seamlessly without throwing API errors
    return res.status(200).json({ useFallback: true });
  });

  app.post('/api/interrogate', async (req, res) => {
    const {
      question,
      history = [],
      twistActive = false,
      pinnedClues = [],
    } = req.body as {
      question: string;
      history: Array<{ role: string; text: string }>;
      twistActive: boolean;
      pinnedClues: string[];
    };

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: "Savol matni kiritilmagan." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API kaliti topilmadi",
        useFallback: true,
      });
    }

    try {
      const historyText = history
        .slice(-6)
        .map((m) => `${m.role === 'investigator' ? 'Tergovchi' : 'Gumonlanuvchi'}: ${m.text}`)
        .join('\n');

      const systemPrompt = `Siz O'zbekiston Respublikasi Huquqni muhofaza qilish akademiyasining virtual tergov simulyatorida ikki vazifani bajarasiz:
1) Gumonlanuvchi Dilshod Tursunov (28 yosh, bank kartasidan 42 500 000 so'm mablag'ni firibgarlik yo'li bilan o'zlashtirishda gumon qilinmoqda). U o'zini oqlashga urinadi.
${twistActive ? "MUHIM BURILISH: Gumonlanuvchi soat 14:15 da Yunusobod tumanida emas, Sergeli tumanida mashina ustaxonasida bo'lganini aytib, alibi da'vo qilmoqda. Agar tergovchi Chilonzor/Yunusobod tayanch stansiyasi billingi, IMEI 354892104491820, IP manzil 185.139.137.44 yoki 8600****9104 tranzit kartasini aniq dalil sifatida keltirsa, u dovdirab qoladi va qisman tan ola boshlaydi." : "U dastlab hech qanday phishing havola yubormaganini va kartani tanishiga berganini aytadi."}
2) JPK (Jinoyat-protsessual kodeksi) bo'yicha "Svetofor" murabbiyi sifatida tergovchining savolini baholaysiz:
- "green" (+10 ball): Ochiq, xolis, qonuniy, fakt va dalillarga asoslangan savol.
- "yellow" (+3 ball): Biroz umumiy, takroriy yoki yetarlicha aniqlashtirilmagan savol.
- "red" (-10 ball): Yo'naltiruvchi (javobni majburlab singdiruvchi), bosim o'tkazuvchi, tahdidli, haqoratli yoki gumonlanuvchining himoya huquqini buzadigan savol.

Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin. Javoblar qisqa, aniq va tabiiy bo'lsin.`;

      const userPrompt = `Tergovchi tomonidan dalillar doskasida belgilangan dalillar soni: ${pinnedClues.length}.
Oldingi suhbat:
${historyText || "Suhbat endi boshlandi."}

Tergovchining yangi savoli: "${question}"

JSON shaklida javob qaytaring.`;

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
              trafficLight: {
                type: Type.STRING,
                description: 'green, yellow, or red',
              },
              scoreDelta: {
                type: Type.INTEGER,
                description: '10 for green, 3 for yellow, -10 for red',
              },
              coachTitle: {
                type: Type.STRING,
                description: 'Short Uzbek evaluation title',
              },
              coachExplanation: {
                type: Type.STRING,
                description: 'Concise 1-2 sentence Uzbek explanation of procedural quality',
              },
              jpkReference: {
                type: Type.STRING,
                description: 'Relevant JPK article reference in Uzbek, e.g. JPK 96-modda',
              },
              suspectReply: {
                type: Type.STRING,
                description: 'Realistic 2-3 sentence Uzbek reply from the suspect',
              },
              alibiContradicted: {
                type: Type.BOOLEAN,
                description: 'True if investigator confronted the alibi with digital evidence (billing, IP, IMEI, card)',
              },
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
  });

  app.post('/api/court/challenge', async (req, res) => {
    const { violations = [], summary = '' } = req.body as {
      violations: Array<{ title: string; detail: string; jpkRef: string }>;
      summary: string;
    };

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
        contents: `Tergov jarayonidagi holat: ${summary}
Aniqlangan zaif nuqtalar yoki xatolar: ${JSON.stringify(violations)}

Siz sud majlisidagi himoyachi (AI-Advokat) sifatida tergovchining eng zaif protsessual nuqtasiga qaratilgan keskin, asosli 1 ta e'tiroz nutqi tayyorlang (3-4 gap). Barcha matn adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`,
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
      console.error('Gemini court challenge error:', err);
      return res.status(502).json({
        error: "AI-Advokat xizmati vaqtincha band.",
        useFallback: true,
      });
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
    } = req.body as {
      defenseStatement: string;
      advocateArgument: string;
      criticalMistakesCount: number;
      evidenceComplete: boolean;
      ethicsPassed: boolean;
      totalScore: number;
    };

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
        contents: `Siz virtual jinoyat ishlari bo'yicha sud raisi (AI-Sudya) siz.
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

Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING, description: 'approved or returned' },
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
      console.error('Gemini court verdict error:', err);
      return res.status(502).json({
        error: "AI-Sudya xizmati bilan bog'lanishda xatolik.",
        useFallback: true,
      });
    }
  });

  app.post('/api/ai-expert-analysis', async (req, res) => {
    const { pinnedClues = [], currentStep = 1, hoursUsed = 0 } = req.body as {
      pinnedClues: string[];
      currentStep: number;
      hoursUsed: number;
    };

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
        contents: `Siz O'zbekiston Respublikasi Huquqni muhofaza qilish akademiyasining sun'iy intellekt tergov yordamchisisiz.
 Joriy tergov bosqichi: ${currentStep}-bosqich
 Sarflangan vaqt: ${hoursUsed} soat
 Tanlangan/doskaga mahkamlangan dalillar soni: ${pinnedClues.length} ta (${pinnedClues.join(', ')})

 Jinoyat tafsilotlari: 42 500 000 so'm kiberfiribgarlik (JK 168-modda 3-qismi "b" bandi).

 Iltimos, tergovchiga professional, huquqiy va taktik maslahat bering:
 1) Ayblov poydevori qanchalik mustahkam (foizda)?
 2) Qanday kamchiliklar yoki qo'shimcha tergov harakatlari kerak?
 3) JPK bo'yicha tavsiya.

 Barcha matnlar 100% adabiy o'zbek tilida (lotin yozuvida) bo'lsin.`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengthPercentage: { type: Type.INTEGER, description: 'Percentage from 0 to 100' },
              prosecutorVerdict: { type: Type.STRING, description: 'Short professional Uzbek analysis' },
              tacticalAdvice: { type: Type.STRING, description: 'Concrete recommendation for next step' },
              jpkGuidance: { type: Type.STRING, description: 'Relevant JPK article advice' },
            },
            required: ['strengthPercentage', 'prosecutorVerdict', 'tacticalAdvice', 'jpkGuidance'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return res.json({ ...parsed, source: 'gemini' });
    } catch (err) {
      console.warn('AI expert analysis error:', err);
      return res.status(502).json({
        error: "AI tahlil xizmati xatosi",
        useFallback: true,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
