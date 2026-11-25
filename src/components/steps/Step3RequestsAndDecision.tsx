import React, { useState } from 'react';
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
          {AGENCY_REQUESTS.map((req) => {
            const isSent = state.sentRequestIds.includes(req.id);
            return (
              <div
                key={req.id}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                  isSent
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-[#E2E8F0]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>{req.agency}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono tabular-nums text-slate-500 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{req.hoursCost} soat</span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">{req.shortTitle}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                {!isSent ? (
                  <button
                    type="button"
                    onClick={() => onSendAgencyRequest(req.id)}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Elektron so‘rov yuborish</span>
                  </button>
                ) : (
                  <div className="pt-3 border-t border-emerald-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-emerald-800 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        <span>Rasmiy javob keldi</span>
                      </span>
                      <span className="font-mono">{req.responseCode}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{req.responseSummary}</p>
                    <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                      {req.responseFacts.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Part 2: Procedural Document Constructor + JPK Audit */}
      <section className="surface-card rounded-2xl p-6 space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#0F172A]">
            Protsessual hujjat konstruktori: «Jinoyat ishi qo‘zg‘atish to‘g‘risida qaror»
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Qaror loyihasining barcha majburiy rekvizitlari, JK kvalifikatsiyasi va JPK asosini to‘ldirib, avtomatik JPK auditidan o‘tkazing.
          </p>
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
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
                        className="mt-0.5 rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
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
              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                {MANDATORY_REQUISITES.map((req) => {
                  const checked = decisionForm.mandatoryRequisites.includes(req.id);
                  return (
                    <label
                      key={req.id}
                      className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer p-1.5 rounded hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRequisite(req.id)}
                        className="mt-0.5 rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>{req.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Audit Button & Results */}
            <div className="pt-1 space-y-3">
              <button
                type="button"
                onClick={onRunJpkAudit}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>JPK auditidan o‘tkazish</span>
              </button>

              {decisionForm.audited && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    decisionForm.auditPassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {decisionForm.auditPassed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        <span>JPK auditi muvaffaqiyatli o‘tdi!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                        <span>Auditda kamchiliklar aniqlandi</span>
                      </>
                    )}
                  </div>

                  {decisionForm.auditPassed ? (
                    <p className="leading-relaxed">
                      Jinoyat ishi JK 168-modda 3-qismi bilan to‘g‘ri qo‘zg‘atildi,
                      barcha majburiy rekvizitlar tasdiqlandi va nusxasi prokurorga
                      yuborishga tayyor.
                    </p>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      {decisionForm.auditIssues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {decisionForm.audited && decisionForm.auditPassed && (
                <button
                  type="button"
                  onClick={() => setShowDocModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#D97706]" />
                  <span>Rasmiy Qaror blankasini ko‘rish (Gerbli PDF)</span>
                </button>
              )}

              {state.step3Completed && (
                <button
                  type="button"
                  onClick={onNextStep}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                >
                  <span>4-bosqich: AI-So‘roq va «Svetofor» moduli</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
