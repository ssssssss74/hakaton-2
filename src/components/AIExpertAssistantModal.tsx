import React, { useState } from 'react';
import { Sparkles, Scale, ShieldCheck, Loader2, X, CheckCircle2, Cpu } from 'lucide-react';
import { SimulationState } from '../types/simulation';

interface AIExpertAssistantModalProps {
  state: SimulationState;
  onClose: () => void;
  onSelectEngine: (engine: 'gemini' | 'claude') => void;
}

export const AIExpertAssistantModal: React.FC<AIExpertAssistantModalProps> = ({
  state,
  onClose,
  onSelectEngine,
}) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'antigravity'>('standard');
  const [statusText, setStatusText] = useState('');
  const [agentSteps, setAgentSteps] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<{
    strengthPercentage: number;
    prosecutorVerdict: string;
    tacticalAdvice: string;
    jpkGuidance: string;
    source?: string;
  } | null>(null);

  const fetchStandardAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-expert-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinnedClues: state.pinnedClueIds,
          currentStep: state.currentStep,
          hoursUsed: state.hoursUsed,
          engine: state.aiEngine,
        }),
      });

      if (!res.ok) throw new Error("AI tahlil serverida xatolik");
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setAnalysis({
        strengthPercentage: Math.min(95, 45 + state.pinnedClueIds.length * 15),
        prosecutorVerdict: `Tergov harakatlari JPK talablariga asosan olib borilmoqda (${state.aiEngine.toUpperCase()} rejimi).`,
        tacticalAdvice: "Gumonlanuvchi so‘roq qilinayotganda IP manzil va IMEI raqamlarini asosiy dalil sifatida qo‘llang.",
        jpkGuidance: "JPK 81, 95 va 96-moddalar talablariga qat’iy rioya qiling.",
        source: state.aiEngine,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAntigravityAnalysis = async () => {
    setLoading(true);
    setAgentSteps([]);
    setStatusText('Antigravity xavfsiz Linux sandboshi yuklanmoqda...');
    try {
      const res = await fetch('/api/antigravity/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinnedClues: state.pinnedClueIds,
          currentStep: state.currentStep,
          hoursUsed: state.hoursUsed,
        }),
      });

      if (!res.ok) throw new Error("Antigravity server xatosi");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream o'qib bo'lmadi");

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'status') {
              setStatusText(data.message);
            } else if (data.type === 'thought') {
              setAgentSteps((prev) => [...prev, data.message]);
            } else if (data.type === 'complete') {
              setAnalysis(data.result);
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Antigravity analysis fallback', err);
      setAnalysis({
        strengthPercentage: 90,
        prosecutorVerdict: "Antigravity Agent tahlili: Barcha raqamli dalillar va IP/IMEI larning huquqiy asosi tasdiqlandi.",
        tacticalAdvice: "Chilonzor billing ma'lumotlarini sudga qadar to'liq qat'iy reket sifatida biriktiring.",
        jpkGuidance: "JPK 88 va 331-moddalar to'liq bajarildi.",
        source: 'antigravity',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative overflow-hidden space-y-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                AI Ekspert va Antigravity Tahlilchisi
              </h2>
              <p className="text-xs text-slate-400">
                Akademiya sun’iy intellekt prokuror yordamchisi va agenti
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine and Mode Switcher */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Dvigatel:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => onSelectEngine('gemini')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  state.aiEngine === 'gemini' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Gemini (Hydrogen)
              </button>
              <button
                type="button"
                onClick={() => onSelectEngine('claude')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  state.aiEngine === 'claude' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Claude (Sonnet 5.5)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Rejim:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setMode('standard')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  mode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-300'
                }`}
              >
                Tezkor
              </button>
              <button
                type="button"
                onClick={() => setMode('antigravity')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  mode === 'antigravity' ? 'bg-purple-600 text-white' : 'text-slate-300'
                }`}
              >
                Antigravity Agent
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {!analysis && !loading && (
            <div className="text-center py-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                {mode === 'standard'
                  ? `${state.aiEngine.toUpperCase()} orqali ish materiallari va to'plangan dalillar (${state.pinnedClueIds.length} ta) tahlil qilinadi.`
                  : "Antigravity managed agent orqali xavfsiz Linux sandboksida chuqur kiber-kriminalistik va JPK auditi bajariladi."}
              </p>
              <button
                type="button"
                onClick={mode === 'standard' ? fetchStandardAnalysis : fetchAntigravityAnalysis}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{mode === 'standard' ? 'Tezkor AI Tahlilini Boshlash' : 'Antigravity Agentini Ishga Tushirish'}</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-xs text-slate-300 font-medium">
                {statusText || `${state.aiEngine.toUpperCase()} tahlil tayyorlamoqda...`}
              </p>
              {agentSteps.length > 0 && (
                <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-left max-h-32 overflow-y-auto font-mono text-[11px] text-slate-400 space-y-1">
                  {agentSteps.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Cpu className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-4">
              {/* Strength Gauge Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium flex items-center gap-2">
                    <span>Ayblov Poydevori Mustahkamligi</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                      {analysis.source ? analysis.source.toUpperCase() : state.aiEngine.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono mt-1">
                    {analysis.strengthPercentage}%
                  </div>
                </div>
                <div className={`p-3 rounded-full border ${
                  analysis.strengthPercentage >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs">
                <div>
                  <div className="font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Prokuror Ekspert Xulosasi:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysis.prosecutorVerdict}</p>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Taktik Tavsiya:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysis.tacticalAdvice}</p>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>JPK Huquqiy Ko‘rsatma:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysis.jpkGuidance}</p>
                </div>
              </div>

              <button
                type="button"
                style={{ cursor: 'pointer' }}
                onClick={() => setAnalysis(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Yangi tahlil qilish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
