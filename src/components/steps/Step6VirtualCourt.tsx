import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Send,
  Trophy,
  Volume2,
} from 'lucide-react';
import { ComputedMetrics, NavView, SimulationState } from '../../types/simulation';
import { playGavelSound } from '../../utils/audioEffects';

interface Step6VirtualCourtProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  isLoadingChallenge: boolean;
  isLoadingVerdict: boolean;
  onStartCourtHearing: () => Promise<void>;
  onSubmitDefense: (defense: string) => Promise<void>;
  onNavigate: (view: NavView) => void;
}

export const Step6VirtualCourt: React.FC<Step6VirtualCourtProps> = ({
  state,
  metrics,
  isLoadingChallenge,
  isLoadingVerdict,
  onStartCourtHearing,
  onSubmitDefense,
  onNavigate,
}) => {
  const [defenseText, setDefenseText] = useState(state.courtSession.studentDefense || '');
  const [gavelRippling, setGavelRippling] = useState(false);
  const { courtSession } = state;

  // Automatically play judicial gavel strike sound when verdict is issued
  useEffect(() => {
    if (courtSession.verdictIssued) {
      playGavelSound();
      setGavelRippling(true);
      const timer = setTimeout(() => setGavelRippling(false), 800);
      return () => clearTimeout(timer);
    }
  }, [courtSession.verdictIssued]);

  const triggerGavelSound = () => {
    playGavelSound();
    setGavelRippling(true);
    setTimeout(() => setGavelRippling(false), 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defenseText.trim() || isLoadingVerdict) return;
    await onSubmitDefense(defenseText.trim());
  };

  return (
    <div className="space-y-6">
      {/* Virtual Courtroom Section */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg bg-blue-50 transition-all ${gavelRippling ? 'scale-125 bg-amber-100 rotate-[-30deg]' : ''}`}>
              <Gavel className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                6-bosqich: Virtual Sud Majlisi
              </h2>
              <p className="text-xs text-slate-500">
                AI-Advokat tergovingizdagi eng zaif nuqtaga e’tiroz bildiradi. Siz dalillar bilan raddiya berasiz va AI-Sudya yakuniy hukm chiqaradi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={triggerGavelSound}
            title="Sudya bolg‘achasi zarbasi ovozini tinglash"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Gavel className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Bolg‘acha zarbasi (Ovoz)</span>
          </button>
        </div>

        {!courtSession.challengeLoaded ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
              Jinoyat ishlari bo‘yicha Chilonzor tuman sudi majlisi ochilishga tayyor.
              Boshlash tugmasini bosing — AI-Advokat sizning 1–5-bosqichlardagi haqiqiy
              harakatlaringiz asosida e’tiroz tayyorlaydi.
            </p>
            <button
              type="button"
              disabled={isLoadingChallenge}
              onClick={onStartCourtHearing}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoadingChallenge ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI-Advokat materiallarni o‘rganmoqda...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Sud majlisini boshlash</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* AI-Advokat Challenge Card */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-amber-950">
                  AI-Advokat e’tirozi (Himoya tomoni)
                </span>
                <span className="font-mono text-amber-900">
                  Nishon: {courtSession.targetPoint} · {courtSession.jpkRef}
                </span>
              </div>
              <p className="text-sm text-slate-900 leading-relaxed">
                «{courtSession.advocateArgument}»
              </p>
            </div>

            {/* Investigator Defense Input */}
            {!courtSession.verdictIssued ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label
                  htmlFor="defense-textarea"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Tergovchining suddagi raddiya nutqi (dalillar va JPK moddalariga tayaning):
                </label>
                <textarea
                  id="defense-textarea"
                  rows={4}
                  value={defenseText}
                  onChange={(e) => setDefenseText(e.target.value)}
                  placeholder="Masalan: Hurmatli sud raisi, barcha raqamli dalillar — bank ko'chirmasi, IMEI 354892104491820 billingi, Yunusobod BS-TSH-104 stansiyasi va ATM #412 videokuzatuv yozuvi JPK 81-modda talablariga muvofiq rasmiylashtirilgan..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDefenseText(
                        "Hurmatli sud raisi! Tergov jarayonida to'plangan raqamli dalillar zanjiri to'liq va uzluksiz: 19-noyabr soat 14:15 da 42 500 000 so'm aynan D.Tursunov nomidagi 8600****9104 kartasiga o'tgan, IMEI 354892104491820 qurilmasi Yunusobod BS-TSH-104 stansiyasida qayd etilgan hamda ATM #412 kamerasi uning shaxsini tasdiqlagan. Barcha harakatlar JPK 81 va 95-moddalari asosida bajarilgan, JK 168-modda 3-qismi bo'yicha ayblovni tasdiqlashingizni so'rayman."
                      )
                    }
                    className="text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Namuna raddiya matnini kiritish
                  </button>

                  <button
                    type="submit"
                    disabled={isLoadingVerdict || defenseText.trim().length < 15}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingVerdict ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI-Sudya hukm tayyorlamoqda...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Raddiyani taqdim etish va Hukmni olish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900 mb-1">
                    Sizning suddagi raddiyangiz:
                  </div>
                  <p className="leading-relaxed">{courtSession.studentDefense}</p>
                </div>

                {/* Final AI-Sudya Verdict with Gavel shockwave animation */}
                <div
                  className={`p-5 rounded-xl border space-y-2 transition-all ${
                    gavelRippling ? 'scale-[1.02] shadow-xl ring-4 ring-amber-400' : ''
                  } ${
                    courtSession.verdict === 'approved'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-red-50 border-red-300 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-base font-bold">
                    {courtSession.verdict === 'approved' ? (
                      <CheckCircle2 className="w-6 h-6 text-[#10B981] shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[#EF4444] shrink-0" />
                    )}
                    <span>AI-Sudya qarori: {courtSession.verdictTitle}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{courtSession.judgeReasoning}</p>
                  <div className="pt-2 border-t border-black/10 text-xs font-medium">
                    Akademik tavsiya: {courtSession.improvementAdvice}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Final 4 KPIs Scorecard */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs text-slate-500">Protsessual aniqlik</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.proceduralAccuracy}%
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs text-slate-500">Muddatlarga rioya</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.deadlineCompliance}%
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs text-slate-500">Dalillar mustahkamligi</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.evidenceStrength}%
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs text-slate-500">Sudga bexato o‘tish ulushi</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-[#1D4ED8]">
            {metrics.cleanCourtRate}%
          </div>
        </div>
      </section>

      {/* Xatolar xaritasi — Chronological Timeline Debriefing */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              «Xatolar xaritasi» — Xronologik protsessual tahlil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              102 xabaridan sud majlisigacha qabul qilingan barcha qarorlar va JPK moddalariga muvofiqlik xaritasi
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('leaderboard')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg whitespace-nowrap cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Reyting jadvalida o‘rnimni ko‘rish</span>
          </button>
        </div>

        {state.timeline.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center">
            Hali harakatlar qayd etilmagan.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {state.timeline.map((ev) => (
              <div
                key={ev.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {ev.status === 'green' && (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    )}
                    {ev.status === 'yellow' && (
                      <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    )}
                    {ev.status === 'red' && (
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {ev.step}-bosqich ({ev.stepLabel}) · {ev.timestampSim} · {ev.jpkRef}
                    </div>
                    <div className="text-sm font-semibold text-[#0F172A]">{ev.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ev.detail}</p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 font-mono text-xs tabular-nums space-y-0.5">
                  <div
                    className={`font-semibold ${
                      ev.status === 'green'
                        ? 'text-[#10B981]'
                        : ev.status === 'yellow'
                          ? 'text-[#D97706]'
                          : 'text-[#EF4444]'
                    }`}
                  >
                    {ev.status === 'green'
                      ? 'To‘g‘ri'
                      : ev.status === 'yellow'
                        ? 'Ogohlantirish'
                        : 'JPK buzilishi'}{' '}
                    ({ev.scoreDelta >= 0 ? `+${ev.scoreDelta}` : ev.scoreDelta} ball)
                  </div>
                  {ev.hoursSpent > 0 && (
                    <div className="text-slate-500">Sarflandi: {ev.hoursSpent} soat</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
