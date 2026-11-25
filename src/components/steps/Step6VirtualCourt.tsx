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
  Printer,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { ComputedMetrics, NavView, SimulationState } from '../../types/simulation';
import { CASE_02_KNIFE_NOTE, PROSECUTOR_CHECKLIST } from '../../data/caseData';
import { playGavelSound } from '../../utils/audioEffects';
import { VISUAL_ASSETS } from '../../assets/visuals';
import { PrintableProtocolCertificate } from '../PrintableProtocolCertificate';

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
  const [courtImgFailed, setCourtImgFailed] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [journalFilter, setJournalFilter] = useState<'all' | 'green' | 'issues'>('all');
  const { courtSession } = state;

  const isKnifeNoteCase =
    state.pinnedClueIds.includes('Dalil_Pichoq') || state.pinnedClueIds.includes('Dalil_Xat');
  const prosecutorChecklist = isKnifeNoteCase
    ? CASE_02_KNIFE_NOTE.prosecutorChecklist
    : PROSECUTOR_CHECKLIST;

  // Dynamic Proof Strength Meter (0-100%)
  const chainBroken = state.step1ChoiceId === 'informal_call';
  const proofLevel = Math.max(
    18,
    Math.min(
      100,
      Math.round(
        metrics.evidenceStrength * 0.5 +
          metrics.proceduralAccuracy * 0.35 +
          (state.alibiConfronted ? 15 : 0) -
          (chainBroken ? 25 : 0)
      )
    )
  );

  const greenCount = state.timeline.filter((e) => e.status === 'green').length;
  const yellowCount = state.timeline.filter((e) => e.status === 'yellow').length;
  const redCount = state.timeline.filter((e) => e.status === 'red').length;
  const filteredTimeline = state.timeline.filter((ev) => {
    if (journalFilter === 'green') return ev.status === 'green';
    if (journalFilter === 'issues') return ev.status === 'red' || ev.status === 'yellow';
    return true;
  });

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
      {/* Cinematic Virtual Courtroom Header Banner */}
      <section className="rounded-2xl overflow-hidden bg-[#091224] border border-cyan-500/30 shadow-2xl">
        <div className="relative bg-[#070E1C] text-slate-100 border-b border-cyan-500/20 overflow-hidden">
          {!courtImgFailed ? (
            <img
              src={VISUAL_ASSETS.courtroomGavel}
              alt="Virtual sud zali va sudya bolg‘achasi"
              referrerPolicy="no-referrer"
              onError={() => setCourtImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#172544] to-[#0B1221]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070E1C]/96 via-[#070E1C]/86 to-[#070E1C]/65" />

          <div className="relative z-10 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 transition-transform ${
                  gavelRippling ? 'scale-125 -rotate-12 bg-amber-400/40' : ''
                }`}
              >
                <Gavel className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-amber-300">
                  6-bosqich · Kinematografik Virtual Sud Zali · O‘zR JPK 416 / 419-moddalar
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
                  Virtual Sud Majlisi — Prokuror, Sudya va Himoyachi Tortishuvi
                </h2>
                <p className="text-xs text-slate-200 mt-0.5 max-w-2xl">
                  3 tomonlama protsessual muhokama: Prokuror dalillar bazasi, Sudya isbotlanganlik darajasi va Himoyachining JPK 95¹ e’tirozi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Rasmiy Bayonnoma va QR-Sertifikatni PDF / Chop etish</span>
              </button>
              <button
                type="button"
                onClick={triggerGavelSound}
                title="Sudya bolg‘achasi zarbasi ovozini tinglash"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-400/45 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-amber-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                <span>Bolg‘acha zarbasi</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-COLUMN CINEMATIC COURTROOM STAGE */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* LEFT COLUMN: PROKUROR (4-BANDLI CHECKLIST) */}
          <div className="bg-[#0D172B] border border-cyan-500/25 rounded-xl p-4 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-100">
                    Davlat ayblovchisi (Prokuror)
                  </span>
                </div>
                <span className="font-mono text-[10px] text-cyan-300">JPK 384-modda</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                4 bandli prokuror nazorati tekshiruv ro‘yxati va ayblov xulosasining sudga tayyorlik holati:
              </p>

              <div className="space-y-2">
                {prosecutorChecklist.slice(0, 4).map((item, idx) => {
                  const checked = state.prosecutorReview.checklist.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                        checked
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                          : 'bg-[#070E1C] border-slate-800 text-slate-200'
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          checked
                            ? 'bg-emerald-500/25 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium leading-snug">{item.label}</div>
                        <div className="text-[10px] font-mono text-slate-300 mt-0.5">
                          {checked ? 'Tasdiqlangan · JPK 384-modda' : 'Tekshirilmoqda · JPK 379–384'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Prokuror tasdig‘i:</span>
              <span
                className={`font-mono font-semibold ${
                  state.prosecutorReview.status === 'approved'
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}
              >
                {state.prosecutorReview.status === 'approved'
                  ? 'Tasdiqlangan'
                  : 'Sud muhokamasida'}
              </span>
            </div>
          </div>

          {/* CENTER COLUMN: SUDYA + PROOF LEVEL METER + VERDICT STAMP */}
          <div className="bg-[#0F1B33] border border-amber-400/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-100">
                    Sud raisi (AI-Sudya)
                  </span>
                </div>
                <span className="font-mono text-[10px] text-amber-300">Chilonzor tuman sudi</span>
              </div>

              {/* Dalillar Isbotlanganlik Darajasi (0-100%) */}
              <div className="bg-[#070E1C] border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Dalillar Isbotlanganlik Darajasi
                  </span>
                  <span
                    className={`font-mono text-base font-bold tabular-nums ${
                      proofLevel >= 75
                        ? 'text-emerald-300'
                        : proofLevel >= 50
                          ? 'text-amber-300'
                          : 'text-red-400'
                    }`}
                  >
                    {proofLevel}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      proofLevel >= 75
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                        : proofLevel >= 50
                          ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                          : 'bg-gradient-to-r from-red-600 to-red-400'
                    }`}
                    style={{ width: `${proofLevel}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-300">
                  {chainBroken
                    ? 'Diqqat: 1-bosqichdagi xato sababli dalillar zanjiriga JPK 95¹ xavfi tushgan.'
                    : 'Raqamli dalillar (SHA-256) va ekspertiza xulosalari isbot bazasini mustahkamlaydi.'}
                </div>
              </div>

              {/* Hearing Start / Defense Form / Verdict with Stamp */}
              {!courtSession.challengeLoaded ? (
                <div className="py-5 text-center space-y-3 bg-[#070E1C] border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Sud majlisini ochish uchun quyidagi tugmani bosing — Himoyachi sizning 1–5-bosqichlardagi harakatlaringiz asosida JPK 95¹ e’tirozini taqdim etadi.
                  </p>
                  <button
                    type="button"
                    disabled={isLoadingChallenge}
                    onClick={onStartCourtHearing}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-600 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isLoadingChallenge ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Himoyachi materiallarni o‘rganmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-4 h-4" />
                        <span>Sud majlisini boshlash</span>
                      </>
                    )}
                  </button>
                </div>
              ) : !courtSession.verdictIssued ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <label
                    htmlFor="defense-textarea"
                    className="block text-xs font-semibold text-slate-200"
                  >
                    Tergovchining suddagi raddiya nutqi:
                  </label>
                  <textarea
                    id="defense-textarea"
                    rows={4}
                    value={defenseText}
                    onChange={(e) => setDefenseText(e.target.value)}
                    placeholder="Hurmatli sud raisi, barcha raqamli dalillar JPK 81 va 204²-moddalar asosida SHA-256 xesh bilan muhrlangan..."
                    className="w-full rounded-xl bg-[#070E1C] border border-cyan-500/35 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDefenseText(
                          isKnifeNoteCase
                            ? 'Hurmatli sud raisi! Smart-Lock #4821 elektron kirish jurnali (21:14–21:38) va restoran kassa kamerasi (21:22) yozuvlari O‘zR JPK 204²-moddaga muvofiq SHA-256 nazorat xeshi bilan rasmiylashtirilgan, Dalil_Pichoq (№ 2026/11-418) va Dalil_Xat (№ 2026/11-419) xulosalari gumonlanuvchi aybini to‘liq tasdiqlaydi. JK 97-modda 1-qismi bo‘yicha ayblovni tasdiqlashingizni so‘rayman.'
                            : 'Hurmatli sud raisi! Tergov jarayonida to‘plangan raqamli dalillar zanjiri uzluksiz: 19-noyabr soat 14:15 da 42 500 000 so‘m 8600****9104 kartasiga o‘tgan, IP 185.139.137.44, IMEI 354892104491820 va ATM #412 kamerasi JPK 81 va 204²-moddalari asosida SHA-256 bilan tasdiqlangan. JK 168-modda 3-qismi bo‘yicha ayblovni tasdiqlashingizni so‘rayman.'
                        )
                      }
                      className="text-xs font-semibold text-cyan-300 hover:underline cursor-pointer"
                    >
                      Namuna raddiyani to‘ldirish
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingVerdict || defenseText.trim().length < 15}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingVerdict ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Hukm tayyorlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Raddiya va Hukm</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {/* Animated Official Court Stamp */}
                  <div className="flex justify-center py-1">
                    <div
                      className={`animate-stamp-drop inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-mono text-xs font-bold tracking-wider uppercase ${
                        courtSession.verdict === 'approved'
                          ? 'border-emerald-400 text-emerald-300 bg-emerald-950/60 shadow-lg shadow-emerald-950/60'
                          : 'border-red-400 text-red-300 bg-red-950/60 shadow-lg shadow-red-950/60'
                      }`}
                    >
                      {courtSession.verdict === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>AYBLOV TASDIQLANDI</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>JPK 416/419: QAYTA TERGOVGA QAYTARILDI</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      courtSession.verdict === 'approved'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                        : 'bg-red-950/40 border-red-500/50 text-red-100'
                    }`}
                  >
                    <div className="font-bold text-sm">{courtSession.verdictTitle}</div>
                    <p className="leading-relaxed text-slate-100">{courtSession.judgeReasoning}</p>
                    <div className="pt-1.5 border-t border-white/10 text-[11px] text-slate-200">
                      Tavsiya: {courtSession.improvementAdvice}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: HIMOYACHI (JPK 95¹ E'TIROZI) */}
          <div className="bg-[#0D172B] border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-100">
                    Himoyachi (AI-Advokat)
                  </span>
                </div>
                <span className="font-mono text-[10px] text-amber-300">
                  {courtSession.jpkRef || 'JPK 95¹, 204²'}
                </span>
              </div>

              {courtSession.challengeLoaded ? (
                <div className="space-y-3">
                  <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 space-y-1.5">
                    <div className="text-[11px] font-mono text-amber-300">
                      Nishon nuqta: {courtSession.targetPoint}
                    </div>
                    <p className="text-xs text-slate-100 leading-relaxed">
                      «{courtSession.advocateArgument}»
                    </p>
                  </div>

                  {courtSession.studentDefense && (
                    <div className="bg-[#070E1C] border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                      <div className="font-semibold text-cyan-300">Tergovchi raddiyasi:</div>
                      <p className="text-slate-200 leading-relaxed line-clamp-5">
                        {courtSession.studentDefense}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#070E1C] border border-slate-800 rounded-xl p-4 text-xs text-slate-200 space-y-2 leading-relaxed">
                  <div className="font-semibold text-amber-300">
                    Himoya tomoni JPK 95¹-modda e’tirozini tayyorlamoqda
                  </div>
                  <p className="text-slate-300">
                    Sud majlisi boshlangach, advokat raqamli dalillarning SHA-256 butunligi, 72 soatlik muddat yoki himoya huquqi (PF-257) bo‘yicha keskin raddiya kiritadi.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">JPK 95¹ xavfi:</span>
              <span className={`font-mono font-semibold ${chainBroken ? 'text-red-400' : 'text-emerald-300'}`}>
                {chainBroken ? 'Yuqori (Zanjir uzilgan)' : 'Nazorat ostida'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final 4 Scorecard Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Protsessual aniqlik', value: metrics.proceduralAccuracy, color: 'bg-[#1D4ED8]' },
          { label: 'Muddatlarga rioya', value: metrics.deadlineCompliance, color: 'bg-[#059669]' },
          { label: 'Dalillar mustahkamligi', value: metrics.evidenceStrength, color: 'bg-[#D97706]' },
          { label: 'Sudga bexato o‘tish ulushi', value: metrics.cleanCourtRate, color: 'bg-[#0F172A]' },
        ].map((metric) => (
          <div key={metric.label} className="surface-card rounded-xl p-5 space-y-2.5">
            <div className="text-xs font-medium text-slate-600">{metric.label}</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
              {metric.value}%
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${metric.color}`}
                style={{ width: `${Math.max(4, Math.min(100, metric.value))}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Qarorlar jurnali va Xatolar xaritasi — Chronological Timeline Debriefing */}
      <section className="surface-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Qarorlar jurnali va «Xatolar xaritasi» — Xronologik tahlil
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              102 xabaridan sud majlisigacha qabul qilingan barcha qarorlar, vaqt va JPK moddalariga muvofiqlik xaritasi
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-700 rounded-xl whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF / Chop etish</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('leaderboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B1221] hover:bg-slate-800 rounded-xl whitespace-nowrap cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Reyting jadvalida o‘rnimni ko‘rish</span>
            </button>
          </div>
        </div>

        {/* Debriefing Summary & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
            <span className="text-[#059669] font-semibold">To‘g‘ri: {greenCount}</span>
            <span className="text-[#D97706] font-semibold">Ogohlantirish: {yellowCount}</span>
            <span className="text-[#DC2626] font-semibold">JPK buzilishi: {redCount}</span>
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setJournalFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                journalFilter === 'all'
                  ? 'bg-[#0B1221] text-white'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Barchasi ({state.timeline.length})
            </button>
            <button
              type="button"
              onClick={() => setJournalFilter('green')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                journalFilter === 'green'
                  ? 'bg-[#059669] text-white'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              To‘g‘ri ({greenCount})
            </button>
            <button
              type="button"
              onClick={() => setJournalFilter('issues')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                journalFilter === 'issues'
                  ? 'bg-[#DC2626] text-white'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Xatolar ({yellowCount + redCount})
            </button>
          </div>
        </div>

        {filteredTimeline.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center">
            {state.timeline.length === 0
              ? 'Hali harakatlar qayd etilmagan.'
              : 'Tanlangan filtr bo‘yicha yozuvlar topilmadi.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTimeline.map((ev) => (
              <div
                key={ev.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {ev.status === 'green' && (
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    )}
                    {ev.status === 'yellow' && (
                      <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                    )}
                    {ev.status === 'red' && (
                      <XCircle className="w-4 h-4 text-[#DC2626]" />
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
                        ? 'text-[#059669]'
                        : ev.status === 'yellow'
                          ? 'text-[#D97706]'
                          : 'text-[#DC2626]'
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

      {/* Printable Official Protocol & HMQA Certificate Modal */}
      {showPrintModal && (
        <PrintableProtocolCertificate
          state={state}
          metrics={metrics}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
