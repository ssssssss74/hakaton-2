import React, { useState } from 'react';
import { STEP_DEFINITIONS } from '../data/caseData';
import { ComputedMetrics, DecisionFormState, NavView, SimulationState } from '../types/simulation';
import { Step1Dispatch } from './steps/Step1Dispatch';
import { Step2EvidenceBoard } from './steps/Step2EvidenceBoard';
import { Step3RequestsAndDecision } from './steps/Step3RequestsAndDecision';
import { Step4Interrogation } from './steps/Step4Interrogation';
import { Step5ProsecutorReview } from './steps/Step5ProsecutorReview';
import { Step6VirtualCourt } from './steps/Step6VirtualCourt';
import {
  Scale,
  Check,
  ArrowRight,
  Presentation,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AIExpertAssistantModal } from './AIExpertAssistantModal';

interface InvestigationWorkspaceProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  isSendingInterrogation: boolean;
  isLoadingCourtChallenge: boolean;
  isLoadingCourtVerdict: boolean;
  onSelectStep: (stepId: number) => void;
  onSelectStep1Decision: (optionId: string) => void;
  onToggleEvidenceClue: (clueId: string) => void;
  onCompleteStep2: () => void;
  onSolveDfir: (caseId: 'case1' | 'case2', artifact: string) => void;
  onSendAgencyRequest: (reqId: string) => void;
  onUpdateDecisionForm: (patch: Partial<DecisionFormState>) => void;
  onRunJpkAudit: () => void;
  onSendInterrogationQuestion: (q: string) => Promise<void>;
  onOpenEthics: () => void;
  onAnswerEthics: (choiceId: string) => void;
  onCompleteStep4: () => void;
  onToggleProsecutorChecklist: (id: string) => void;
  onSubmitToProsecutor: () => void;
  onRemediateProsecutorIssues: () => void;
  onProceedProsecutorWithRisk: () => void;
  onStartCourtHearing: () => Promise<void>;
  onSubmitCourtDefense: (defense: string) => Promise<void>;
  onNavigate: (view: NavView) => void;
  onSelectEngine: (engine: 'gemini' | 'claude') => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  state,
  metrics,
  isSendingInterrogation,
  isLoadingCourtChallenge,
  isLoadingCourtVerdict,
  onSelectStep,
  onSelectStep1Decision,
  onToggleEvidenceClue,
  onCompleteStep2,
  onSolveDfir,
  onSendAgencyRequest,
  onUpdateDecisionForm,
  onRunJpkAudit,
  onSendInterrogationQuestion,
  onOpenEthics,
  onAnswerEthics,
  onCompleteStep4,
  onToggleProsecutorChecklist,
  onSubmitToProsecutor,
  onRemediateProsecutorIssues,
  onProceedProsecutorWithRisk,
  onStartCourtHearing,
  onSubmitCourtDefense,
  onNavigate,
  onSelectEngine,
}) => {
  const currentStep = state.currentStep;
  const [showAiModal, setShowAiModal] = useState(false);
  const [showJournalDrawer, setShowJournalDrawer] = useState(false);

  const completedCount = [
    state.step1Completed,
    state.step2Completed,
    state.step3Completed,
    state.step4Completed,
    state.step5Completed,
    state.step6Completed,
  ].filter(Boolean).length;

  const progressPct = Math.round((completedCount / 6) * 100);

  const nextStepHandler = () => {
    if (currentStep < 6) {
      onSelectStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive AI Legal Advisor Command Strip */}
      <div className="bg-[#0B1221] text-white px-5 py-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 text-amber-300 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-amber-300">
              E-Tergov AI · Prokuror va JPK maslahatchisi
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Joriy tergov bosqichi va to‘plangan dalillar bo‘yicha real vaqtda huquqiy audit xulosasini oling.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('presentation')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>Planshet</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-600 text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>AI Ekspert Tahlili</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showAiModal && (
        <AIExpertAssistantModal
          state={state}
          onClose={() => setShowAiModal(false)}
          onSelectEngine={onSelectEngine}
        />
      )}

      {/* Top Stepper — Elevated 6-Step Connected Rail (All Steps Open) */}
      <div className="surface-card rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-[#0F172A]">Protsessual marshrut</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Barcha 6 bosqich erkin o‘tish uchun ochiq</span>
          </div>
          <div className="flex items-center gap-3 font-mono tabular-nums text-slate-600">
            <button
              type="button"
              onClick={() => setShowJournalDrawer((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-sans font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                showJournalDrawer
                  ? 'bg-[#0B1221] border-[#0B1221] text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Qarorlar jurnali ({state.timeline.length})</span>
              {showJournalDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <span>Bajarildi: {completedCount}/6 ({progressPct}%)</span>
          </div>
        </div>

        {/* Live Collapsible Qarorlar jurnali (Debriefing) */}
        {showJournalDrawer && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#0F172A]">
                  Qarorlar jurnali va protsessual xronologiya (Jonli nazorat)
                </div>
                <div className="text-[11px] text-slate-500">
                  Har bir tergov harakati vaqti, JPK moddasi va ball ta’siri bilan qayd etiladi
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                <span className="text-[#059669] font-semibold">
                  To‘g‘ri: {state.timeline.filter((t) => t.status === 'green').length}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[#D97706] font-semibold">
                  Ogohlantirish: {state.timeline.filter((t) => t.status === 'yellow').length}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[#DC2626] font-semibold">
                  Xato: {state.timeline.filter((t) => t.status === 'red').length}
                </span>
              </div>
            </div>

            {state.timeline.length === 0 ? (
              <div className="text-xs text-slate-500 py-2">
                Hali qarorlar qayd etilmagan. 1-bosqichdan tergov harakatini bajaring.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-200/80 pr-1">
                {state.timeline.map((ev) => (
                  <div
                    key={ev.id}
                    className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      {ev.status === 'green' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                      )}
                      {ev.status === 'yellow' && (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                      )}
                      {ev.status === 'red' && (
                        <XCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-[#0F172A] truncate">{ev.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {ev.step}-bosqich · {ev.timestampSim} · {ev.jpkRef}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`font-mono font-semibold tabular-nums shrink-0 ${
                        ev.status === 'green'
                          ? 'text-[#059669]'
                          : ev.status === 'yellow'
                            ? 'text-[#D97706]'
                            : 'text-[#DC2626]'
                      }`}
                    >
                      {ev.scoreDelta >= 0 ? `+${ev.scoreDelta}` : ev.scoreDelta} ball
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Visual Progress Line */}
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1D4ED8] to-[#059669] transition-all duration-300"
            style={{ width: `${Math.max(8, progressPct)}%` }}
          />
        </div>

        <div className="overflow-x-auto pb-0.5">
          <div className="grid grid-cols-6 min-w-[720px] gap-2">
            {STEP_DEFINITIONS.map((step) => {
              const isCurrent = step.id === currentStep;
              const isCompleted =
                (step.id === 1 && state.step1Completed) ||
                (step.id === 2 && state.step2Completed) ||
                (step.id === 3 && state.step3Completed) ||
                (step.id === 4 && state.step4Completed) ||
                (step.id === 5 && state.step5Completed) ||
                (step.id === 6 && state.step6Completed);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#0B1221] border-[#0B1221] text-white shadow-sm'
                      : isCompleted
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-50'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[#1D4ED8] text-white'
                        : isCompleted
                          ? 'bg-[#059669] text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {isCompleted && !isCurrent ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{step.shortLabel}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isCurrent
                          ? 'text-slate-300'
                          : isCompleted
                            ? 'text-emerald-700'
                            : 'text-slate-500'
                      }`}
                    >
                      {isCurrent ? 'Faol bosqich' : isCompleted ? 'Yakunlandi' : 'Ochiq'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Step Content */}
      {currentStep === 1 && (
        <Step1Dispatch
          state={state}
          onSelectDecision={onSelectStep1Decision}
          onNextStep={nextStepHandler}
        />
      )}

      {currentStep === 2 && (
        <Step2EvidenceBoard
          state={state}
          onToggleClue={onToggleEvidenceClue}
          onCompleteStep2={onCompleteStep2}
          onSolveDfir={onSolveDfir}
          onNextStep={nextStepHandler}
        />
      )}

      {currentStep === 3 && (
        <Step3RequestsAndDecision
          state={state}
          onSendAgencyRequest={onSendAgencyRequest}
          onUpdateDecisionForm={onUpdateDecisionForm}
          onRunJpkAudit={onRunJpkAudit}
          onNextStep={nextStepHandler}
        />
      )}

      {currentStep === 4 && (
        <Step4Interrogation
          state={state}
          isSending={isSendingInterrogation}
          onSendQuestion={onSendInterrogationQuestion}
          onOpenEthics={onOpenEthics}
          onAnswerEthics={onAnswerEthics}
          onCompleteStep4={onCompleteStep4}
          onNextStep={nextStepHandler}
        />
      )}

      {currentStep === 5 && (
        <Step5ProsecutorReview
          state={state}
          metrics={metrics}
          onToggleChecklist={onToggleProsecutorChecklist}
          onSubmitToProsecutor={onSubmitToProsecutor}
          onRemediateIssues={onRemediateProsecutorIssues}
          onProceedWithRisk={onProceedProsecutorWithRisk}
          onNextStep={nextStepHandler}
        />
      )}

      {currentStep === 6 && (
        <Step6VirtualCourt
          state={state}
          metrics={metrics}
          isLoadingChallenge={isLoadingCourtChallenge}
          isLoadingVerdict={isLoadingCourtVerdict}
          onStartCourtHearing={onStartCourtHearing}
          onSubmitDefense={onSubmitCourtDefense}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
