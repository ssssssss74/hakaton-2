import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Clock,
  ArrowRight,
  Building2,
  Printer,
  FileText,
} from 'lucide-react';
import {
  AGENCY_REQUESTS,
  INVESTIGATIVE_ACTIONS,
  JK_OPTIONS,
  JPK_BASIS_OPTIONS,
  MANDATORY_REQUISITES,
  resolveActiveCaseMeta,
} from '../../data/caseData';
import { DecisionFormState, SimulationState } from '../../types/simulation';
import { OfficialDocumentModal } from '../OfficialDocumentModal';

interface Step3Props {
  state: SimulationState;
  onSendAgencyRequest: (reqId: string) => void;
  onUpdateDecisionForm: (patch: Partial<DecisionFormState>) => void;
  onRunJpkAudit: () => void;
  onNextStep: () => void;
}

export const Step3RequestsAndDecision: React.FC<Step3Props> = ({
  state,
  onSendAgencyRequest,
  onUpdateDecisionForm,
  onRunJpkAudit,
  onNextStep,
}) => {
  const { decisionForm } = state;
  const [showDocModal, setShowDocModal] = useState(false);
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);

  const toggleRequisite = (id: string) => {
    const exists = decisionForm.mandatoryRequisites.includes(id);
    const updated = exists
      ? decisionForm.mandatoryRequisites.filter((r) => r !== id)
      : [...decisionForm.mandatoryRequisites, id];
    onUpdateDecisionForm({ mandatoryRequisites: updated, audited: false });
  };

  const toggleAction = (id: string) => {
    const exists = decisionForm.investigativeActions.includes(id);
    const updated = exists
      ? decisionForm.investigativeActions.filter((a) => a !== id)
      : [...decisionForm.investigativeActions, id];
    onUpdateDecisionForm({ investigativeActions: updated, audited: false });
  };

  return (
    <div className="space-y-6">
      {/* Part 1: Inter-Agency Electronic Requests */}
      <section className="surface-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              3-bosqich: Idoralararo elektron so‘rovlar moduli
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tegishli idoralarga rasmiy elektron so‘rov yuboring. Har bir so‘rov protsessual vaqtni sarflaydi va rasmiy javob xati qaytaradi.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-600">
            Yuborildi: {state.sentRequestIds.length} / {AGENCY_REQUESTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENCY_REQUESTS.map((req, idx) => {
            const isSent = state.sentRequestIds.includes(req.id);
            return (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                  isSent
                    ? 'bg-[#DFF0E8] border-teal-500/60'
                    : 'bg-[#F5F7F6] border-[#C6D1CC] hover:border-teal-600/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>{req.agency}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono tabular-nums text-slate-600 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{req.hoursCost} soat</span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{req.shortTitle}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                {!isSent ? (
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onSendAgencyRequest(req.id)}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Elektron so‘rov yuborish</span>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="pt-3 border-t border-teal-500/30 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-teal-900 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-700" />
                        <span>Rasmiy javob keldi</span>
                      </span>
                      <span className="font-mono">{req.responseCode}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{req.responseSummary}</p>
                    <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                      {req.responseFacts.map((fact, fIdx) => (
                        <li key={fIdx}>{fact}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Part 2: Procedural Document Constructor + JPK Audit */}
      <section className="surface-card rounded-2xl p-6 space-y-5">
        <div className="pb-3 border-b border-slate-100 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Protsessual hujjat konstruktori: «Jinoyat ishi qo‘zg‘atish to‘g‘risida qaror»
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ish {activeCase.caseNumber} ({activeCase.shortCategory}) bo‘yicha majburiy rekvizitlar, JK kvalifikatsiyasi va JPK asosini to‘ldiring.
            </p>
          </div>
          <span className="font-mono text-[11px] font-semibold text-teal-900 bg-[#DCE7E3] border border-[#B2C7C0] px-2.5 py-1 rounded-lg">
            {activeCase.caseNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Article & Basis selectors */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="jk-select"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                1. Jinoyat kodeksi bo‘yicha kvalifikatsiya (JK)
              </label>
              <select
                id="jk-select"
                value={decisionForm.jkArticle}
                onChange={(e) =>
                  onUpdateDecisionForm({ jkArticle: e.target.value, audited: false })
                }
                className="w-full rounded-xl border border-[#C2CFC9] bg-[#F5F7F6] px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="">— Moddani tanlang —</option>
                {JK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="jpk-select"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                2. Jinoyat-protsessual asos (JPK)
              </label>
              <select
                id="jpk-select"
                value={decisionForm.jpkBasis}
                onChange={(e) =>
                  onUpdateDecisionForm({ jpkBasis: e.target.value, audited: false })
                }
                className="w-full rounded-xl border border-[#C2CFC9] bg-[#F5F7F6] px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="">— Protsessual asosni tanlang —</option>
                {JPK_BASIS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                3. Rejalashtirilgan dastlabki tergov harakatlari
              </div>
              <div className="space-y-2">
                {INVESTIGATIVE_ACTIONS.map((act) => {
                  const checked = decisionForm.investigativeActions.includes(act.id);
                  return (
                    <label
                      key={act.id}
                      className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAction(act.id)}
                        className="mt-0.5 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span>{act.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Mandatory Requisites */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                4. Qarorning majburiy protsessual rekvizitlari (JPK 331-modda)
              </div>
              <div className="space-y-2 border border-[#C6D1CC] rounded-xl p-3 bg-[#E9EEEC]">
                {MANDATORY_REQUISITES.map((req) => {
                  const checked = decisionForm.mandatoryRequisites.includes(req.id);
                  return (
                    <label
                      key={req.id}
                      className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer p-1.5 rounded-lg hover:bg-[#F4F6F5] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRequisite(req.id)}
                        className="mt-0.5 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span>{req.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Audit Button & Results */}
            <div className="pt-1 space-y-3">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onRunJpkAudit}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#134E4A] hover:bg-[#0F3F3C] rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>JPK auditidan o‘tkazish</span>
              </motion.button>

              <AnimatePresence>
                {decisionForm.audited && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      decisionForm.auditPassed
                        ? 'bg-[#DCF0E7] border-teal-500/60 text-teal-950'
                        : 'bg-red-50/90 border-red-300 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      {decisionForm.auditPassed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-teal-700" />
                          <span>JPK auditi muvaffaqiyatli o‘tdi!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>Auditda kamchiliklar aniqlandi</span>
                        </>
                      )}
                    </div>

                    {decisionForm.auditPassed ? (
                      <p className="leading-relaxed">
                        Jinoyat ishi ({activeCase.caseNumber}) {activeCase.expectedJkLabel} bilan to‘g‘ri qo‘zg‘atildi,
                        barcha majburiy rekvizitlar tasdiqlandi va nusxasi prokurorga yuborishga tayyor.
                      </p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1">
                        {decisionForm.auditIssues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {decisionForm.audited && decisionForm.auditPassed && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowDocModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Rasmiy Qaror blankasini ko‘rish (Gerbli PDF)</span>
                </motion.button>
              )}

              {state.step3Completed && (
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onNextStep}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <span>4-bosqich: AI-So‘roq va «Svetofor» moduli</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Official Document Modal */}
      {showDocModal && (
        <OfficialDocumentModal
          type="decision"
          state={state}
          onClose={() => setShowDocModal(false)}
        />
      )}
    </div>
  );
};
