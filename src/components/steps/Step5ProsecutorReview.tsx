import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSignature,
  Wrench,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { CASE_02_KNIFE_NOTE, EVIDENCE_CLUES, PROSECUTOR_CHECKLIST } from '../../data/caseData';
import { FORENSIC_EVIDENCE_CATALOG } from '../../scene/evidenceCatalog';
import { ComputedMetrics, SimulationState } from '../../types/simulation';
import { OfficialDocumentModal } from '../OfficialDocumentModal';
import { VISUAL_ASSETS } from '../../assets/visuals';
import { EPoligonLogo } from '../EPoligonLogo';

interface Step5ProsecutorReviewProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onToggleChecklist: (id: string) => void;
  onSubmitToProsecutor: () => void;
  onRemediateIssues: () => void;
  onProceedWithRisk: () => void;
  onNextStep: () => void;
}

export const Step5ProsecutorReview: React.FC<Step5ProsecutorReviewProps> = ({
  state,
  metrics,
  onToggleChecklist,
  onSubmitToProsecutor,
  onRemediateIssues,
  onProceedWithRisk,
  onNextStep,
}) => {
  const [showDocModal, setShowDocModal] = useState(false);
  const { prosecutorReview } = state;
  const pinnedEvidence = EVIDENCE_CLUES.filter((c) => state.pinnedClueIds.includes(c.id));
  const pinned3DEvidence = Object.values(FORENSIC_EVIDENCE_CATALOG).filter(
    (ev) => state.pinnedClueIds.includes(ev.id) && !pinnedEvidence.some((p) => p.id === ev.cluePinId)
  );
  const isKnifeNoteCase =
    state.activeCaseId === 'CASE-02-KNIFE-NOTE' ||
    state.pinnedClueIds.includes('Dalil_Pichoq') ||
    state.pinnedClueIds.includes('Dalil_Xat');
  const activeChecklist = isKnifeNoteCase
    ? CASE_02_KNIFE_NOTE.prosecutorChecklist
    : PROSECUTOR_CHECKLIST;
  const allChecked = activeChecklist.every((item) => prosecutorReview.checklist.includes(item.id));
  const totalEvidenceCount = pinnedEvidence.length + pinned3DEvidence.length;
  const checklistPct = Math.round((prosecutorReview.checklist.length / Math.max(1, activeChecklist.length)) * 100);
  const readinessScore = Math.min(
    100,
    Math.round(
      (Math.min(totalEvidenceCount, 4) / 4) * 45 +
        (checklistPct / 100) * 45 +
        (prosecutorReview.submitted ? 10 : 0)
    )
  );
  const ringCircumference = 2 * Math.PI * 36;
  const ringOffset = ringCircumference * (1 - readinessScore / 100);

  return (
    <div className="space-y-6">
      {/* Visual Virtual Prosecutor Supervision Desk Stage */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl overflow-hidden border border-[#1C4742] bg-[#0B2021] text-white shadow-lg"
      >
        <img
          src={VISUAL_ASSETS.prosecutorDesk}
          alt="Virtual Prokuror nazorati xonasi"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#081A1B]/95 via-[#0B2324]/85 to-[#0B2021]/65" />

        <div className="relative z-10 p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-300">
              <EPoligonLogo size="xs" className="rounded-lg border border-emerald-400/40" />
              <span>5-BOSQICH · VIRTUAL PROKUROR NAZORATI (JPK 379–384-M)</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white leading-tight">
              Ayblov xulosasi auditi va Sudga ruxsat muhrini olish
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-teal-100">
              <span className="px-2.5 py-1 rounded-lg bg-[#091819]/80 border border-teal-500/35">
                Dalillar: {totalEvidenceCount} ta biriktirilgan
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#091819]/80 border border-teal-500/35">
                Chek-list: {prosecutorReview.checklist.length}/{activeChecklist.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#091819]/80 border border-teal-500/35">
                Qolgan muddat: {metrics.hoursRemaining} soat
              </span>
            </div>
          </div>

          {/* Animated SVG Circular Readiness Gauge + Live Official Stamp */}
          <div className="flex items-center gap-5 shrink-0 bg-[#071516]/85 border border-teal-500/35 rounded-2xl px-5 py-3.5 backdrop-blur-xs">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg viewBox="0 0 88 88" className="w-20 h-20 -rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke="#1E3A38"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke={
                    prosecutorReview.submitted && prosecutorReview.status === 'rejected'
                      ? '#EF4444'
                      : '#34D399'
                  }
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <span className="absolute font-mono text-base font-bold text-white tabular-nums">
                {readinessScore}%
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-teal-300">
                Ish tayyorgarligi
              </div>
              {prosecutorReview.submitted ? (
                <motion.div
                  initial={{ scale: 1.35, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  className={`inline-block px-3 py-1 rounded-md border-2 font-mono text-xs font-extrabold tracking-wider uppercase ${
                    prosecutorReview.status === 'approved'
                      ? 'border-emerald-400 text-emerald-300 bg-emerald-950/60'
                      : prosecutorReview.status === 'warning'
                        ? 'border-amber-400 text-amber-300 bg-amber-950/60'
                        : 'border-red-400 text-red-300 bg-red-950/60'
                  }`}
                >
                  {prosecutorReview.status === 'approved'
                    ? 'TASDIQLANDI'
                    : prosecutorReview.status === 'warning'
                      ? 'SHARTLI RUXSAT'
                      : 'KAMCHILIK BOR'}
                </motion.div>
              ) : (
                <div className="text-xs font-semibold text-slate-300">
                  Audit kutilmoqda
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Indictment Summary & Checklist */}
        <div className="lg:col-span-6 surface-card rounded-2xl p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A]">
              5-bosqich: Ayblov xulosasi loyihasi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              To‘plangan dalillar va protsessual talablarni tasdiqlab, jinoyat ishini Virtual Prokuror nazoratiga yuboring.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">
              Ayblov xulosasiga kiritilgan dalillar ({pinnedEvidence.length + pinned3DEvidence.length} ta)
            </div>
            {pinnedEvidence.length + pinned3DEvidence.length === 0 ? (
              <div className="text-xs text-[#EF4444] bg-red-50 border border-red-200 rounded-lg p-3">
                Dalillar doskasida birorta dalil mahkamlanmagan!
              </div>
            ) : (
              <ul className="space-y-2">
                {pinnedEvidence.map((ev) => (
                  <li
                    key={ev.id}
                    className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="font-semibold text-[#0F172A]">{ev.title}</div>
                    <div className="text-slate-500 mt-0.5">
                      {ev.sourceLabel} · {ev.jpkNote}
                    </div>
                  </li>
                ))}
                {pinned3DEvidence.map((ev) => (
                  <li
                    key={ev.id}
                    className="text-xs p-3 rounded-lg bg-amber-50/70 border border-amber-200"
                  >
                    <div className="font-semibold text-[#0F172A]">
                      3D Dalil: {ev.title} ({ev.expertiseReport?.reportNumber ?? ev.id})
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      {ev.category} · {ev.jpkRef}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-600">
              {isKnifeNoteCase
                ? 'Prokuror nazorati ro‘yxati — CASE-02-KNIFE-NOTE (JPK 95¹, 137, 172, 184, 203–204², 384)'
                : 'Ayblov xulosasini tasdiqlash nazorat ro‘yxati (JPK 379-modda)'}
            </div>
            {activeChecklist.map((item) => {
              const checked = prosecutorReview.checklist.includes(item.id);
              return (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#C6D1CC] bg-[#F5F7F6] hover:bg-[#EAF1EE] text-xs text-slate-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={prosecutorReview.submitted}
                        onChange={() => onToggleChecklist(item.id)}
                        className="mt-0.5 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>

              {!prosecutorReview.submitted && (
                <motion.button
                  whileTap={allChecked ? { scale: 0.98 } : undefined}
                  type="button"
                  disabled={!allChecked}
                  onClick={onSubmitToProsecutor}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                    allChecked
                      ? 'bg-[#0F766E] hover:bg-[#115E59] text-white cursor-pointer shadow-xs'
                      : 'bg-[#DCE3E0] text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Virtual Prokurorga yuborish (JPK 381-modda)</span>
                </motion.button>
              )}
            </div>

            {/* Right: Virtual Prosecutor Audit Output */}
            <div className="lg:col-span-6 surface-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#CFD8D4]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-800" />
                  <h3 className="text-base font-bold text-slate-900">
                    Virtual Prokuror nazorati xulosasi
                  </h3>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-600">
                  1–4 bosqichlar auditi
                </span>
              </div>

          {!prosecutorReview.submitted ? (
            <div className="py-10 text-center space-y-2 text-slate-500">
              <p className="text-sm font-medium text-slate-700">
                Prokuror tekshiruvi hali boshlanmagan
              </p>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Chap tomondagi nazorat ro‘yxatini tasdiqlab ishni yuborganingizda, Virtual
                Prokuror 1–4-bosqichlardagi barcha harakatlaringizni JPK mezonlari bo‘yicha
                audit qiladi.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Verdict Header */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  prosecutorReview.status === 'approved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : prosecutorReview.status === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                {prosecutorReview.status === 'approved' && (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                )}
                {prosecutorReview.status === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                )}
                {prosecutorReview.status === 'rejected' && (
                  <XCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <div className="text-sm font-bold">
                    {prosecutorReview.status === 'approved'
                      ? "Ayblov xulosasi Prokuror tomonidan tasdiqlandi!"
                      : prosecutorReview.status === 'warning'
                        ? "Shartli e'tirozlar bilan qayd etildi"
                        : "Jiddiy protsessual kamchiliklar aniqlandi («Xato narxi»)"}
                  </div>
                  <p className="leading-relaxed opacity-90">
                    {prosecutorReview.status === 'approved'
                      ? "Barcha bosqichlarda JPK talablari, muddatlar va dalillar zanjiri to‘liq ta’minlangan. Ishni sudga yuborishga ruxsat berildi."
                      : "Quyidagi kamchiliklar sud majlisida himoyachi tomonidan e'tiroz sifatida ko'tarilishi mumkin. Ularni qo'shimcha tergov harakati (+4 soat) bilan tuzatishingiz yoki tavakkal bilan sudga chiqishingiz mumkin."}
                  </p>
                </div>
              </div>

              {/* Flagged Mistakes List */}
              {prosecutorReview.flags.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Aniqlangan protsessual xatolar ({prosecutorReview.flags.length} ta):
                  </div>
                  {prosecutorReview.flags.map((flag) => (
                    <div
                      key={flag.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                        flag.severity === 'red'
                          ? 'bg-red-50/70 border-red-200 text-red-950'
                          : 'bg-amber-50/70 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-semibold">
                        <span>{flag.title}</span>
                        <span className="font-mono text-[11px] shrink-0">{flag.jpkRef}</span>
                      </div>
                      <p className="opacity-90 leading-relaxed">{flag.explanation}</p>
                      <div className="font-mono text-[11px] font-semibold">
                        Xato narxi: {flag.penaltyText}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions after Prosecutor Audit */}
              {prosecutorReview.flags.length > 0 &&
              !prosecutorReview.remediated &&
              !prosecutorReview.proceededWithRisk ? (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onRemediateIssues}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#134E4A] hover:bg-[#0F3F3C] rounded-xl cursor-pointer shadow-xs"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Kamchiliklarni tuzatish (+4 soat)</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onProceedWithRisk}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-700 bg-[#F5F7F6] border border-red-300 hover:bg-red-50 rounded-xl cursor-pointer"
                  >
                    <span>Tavakkal bilan sudga yuborish</span>
                  </motion.button>
                </div>
              ) : (
                <div className="pt-2 space-y-3">
                  {prosecutorReview.remediated && (
                    <div className="text-xs text-teal-900 bg-[#DCF0E7] border border-teal-500/50 rounded-xl p-3">
                      Qo‘shimcha protsessual bayonnoma tuzildi (+4 soat). Kamchiliklar qisman bartaraf etilib, ish sudga yo‘naltirildi.
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowDocModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Rasmiy Ayblov xulosasi blankasi (Gerbli PDF)</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onNextStep}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl cursor-pointer shadow-xs"
                  >
                    <span>6-bosqich: Virtual Sud Majlisi</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* Mini Summary Metrics */}
              <div className="pt-3 border-t border-[#CFD8D4] flex items-center justify-between text-xs text-slate-600 font-mono tabular-nums">
                <span>Qolgan muddat: {metrics.hoursRemaining} soat</span>
                <span>Joriy ball: {metrics.totalScore}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Official Indictment Document Modal */}
      {showDocModal && (
        <OfficialDocumentModal
          type="indictment"
          state={state}
          onClose={() => setShowDocModal(false)}
        />
      )}
    </div>
  );
};
