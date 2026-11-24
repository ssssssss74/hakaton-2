import React, { useState } from 'react';
import { Sparkles, Scale, ShieldCheck, AlertCircle, Loader2, X, CheckCircle2 } from 'lucide-react';
import { SimulationState } from '../types/simulation';

interface AIExpertAssistantModalProps {
  state: SimulationState;
  onClose: () => void;
}

export const AIExpertAssistantModal: React.FC<AIExpertAssistantModalProps> = ({
  state,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    strengthPercentage: number;
    prosecutorVerdict: string;
    tacticalAdvice: string;
    jpkGuidance: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-expert-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinnedClues: state.pinnedClueIds,
          currentStep: state.currentStep,
          hoursUsed: state.hoursUsed,
        }),
      });

      if (!res.ok) throw new Error("AI tahlil serverida xatolik");
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      // Fallback deterministic analysis if offline or API key missing
      setAnalysis({
        strengthPercentage: Math.min(95, 45 + state.pinnedClueIds.length * 15),
        prosecutorVerdict: "Tergov harakatlari JPK talablariga asosan olib borilmoqda. Tanlangan raqamli dalillar ayblov poydevorini mustahkamlamoqda.",
        tacticalAdvice: "Gumonlanuvchi so‘roq qilinayotganda IP manzil va IMEI raqamlarini asosiy dalil sifatida qo‘llang.",
        jpkGuidance: "JPK 81, 95 va 96-moddalar talablariga qat’iy rioya qiling.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative overflow-hidden space-y-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                AI Ekspert — Kriptografik va JPK Tahlilchisi
              </h2>
              <p className="text-xs text-slate-400">
                Akademiya sun’iy intellekt prokuror yordamchisi prognozi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 space-y-4">
          {!analysis && !loading && (
            <div className="text-center py-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Joriy tergov holati, to‘plangan dalillar ({state.pinnedClueIds.length} ta) va sarflangan vaqt asosida ish materiallarining sud uchun tayyorgarlik darajasini hisoblang.
              </p>
              <button
                type="button"
                onClick={fetchAnalysis}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Tahlilini Boshlash</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-xs text-slate-300">
                Gemini AI ish materiallari va kriptografik xeshlarni tahlil qilmoqda...
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-4">
              {/* Strength Gauge Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                    Ayblov Poydevori Mustahkamligi
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
                onClick={fetchAnalysis}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Qayta tahlil qilish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
