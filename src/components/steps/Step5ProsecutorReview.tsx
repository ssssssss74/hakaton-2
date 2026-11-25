import React, { useState } from 'react';
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
    state.pinnedClueIds.includes('Dalil_Pichoq') || state.pinnedClueIds.includes('Dalil_Xat');
  const activeChecklist = isKnifeNoteCase
    ? CASE_02_KNIFE_NOTE.prosecutorChecklist
    : PROSECUTOR_CHECKLIST;
  const allChecked = activeChecklist.every((item) => prosecutorReview.checklist.includes(item.id));

  return (
    <div className="space-y-6">
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
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={prosecutorReview.submitted}
                    onChange={() => onToggleChecklist(item.id)}
                    className="mt-0.5 rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>

          {!prosecutorReview.submitted && (
            <button
              type="button"
              disabled={!allChecked}
              onClick={onSubmitToProsecutor}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                allChecked
                  ? 'bg-[#1D4ED8] hover:bg-blue-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>Virtual Prokurorga yuborish (JPK 381-modda)</span>
            </button>
          )}
        </div>

        {/* Right: Virtual Prosecutor Audit Output */}
        <div className="lg:col-span-6 surface-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1D4ED8]" />
              <h3 className="text-base font-bold text-[#0F172A]">
                Virtual Prokuror nazorati xulosasi
              </h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
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
            <div className="space-y-4">
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
                  <button
                    type="button"
                    onClick={onRemediateIssues}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Kamchiliklarni tuzatish (+4 soat)</span>
                  </button>
                  <button
                    type="button"
                    onClick={onProceedWithRisk}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#EF4444] bg-white border border-red-300 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <span>Tavakkal bilan sudga yuborish</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 space-y-3">
                  {prosecutorReview.remediated && (
                    <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      Qo‘shimcha protsessual bayonnoma tuzildi (+4 soat). Kamchiliklar qisman bartaraf etilib, ish sudga yo‘naltirildi.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDocModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#D97706]" />
                    <span>Rasmiy Ayblov xulosasi blankasi (Gerbli PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNextStep}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg cursor-pointer"
                  >
                    <span>6-bosqich: Virtual Sud Majlisi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mini Summary Metrics */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                <span>Qolgan muddat: {metrics.hoursRemaining} soat</span>
                <span>Joriy ball: {metrics.totalScore}</span>
              </div>
            </div>
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
