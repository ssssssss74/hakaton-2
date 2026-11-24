import React from 'react';
import { STEP_DEFINITIONS } from '../data/caseData';
import { ComputedMetrics, DecisionFormState, SimulationState } from '../types/simulation';
import { Step1Dispatch } from './steps/Step1Dispatch';
import { Step2EvidenceBoard } from './steps/Step2EvidenceBoard';
import { Step3RequestsAndDecision } from './steps/Step3RequestsAndDecision';
import { Step4Interrogation } from './steps/Step4Interrogation';
import { Step5ProsecutorReview } from './steps/Step5ProsecutorReview';
import { Step6VirtualCourt } from './steps/Step6VirtualCourt';
import { NavView } from '../types/simulation';
import { Sparkles } from 'lucide-react';
import { AIExpertAssistantModal } from './AIExpertAssistantModal';
import { useState } from 'react';

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
}) => {
  const currentStep = state.currentStep;
  const [showAiModal, setShowAiModal] = useState(false);

  const nextStepHandler = () => {
    if (currentStep < 6) {
      onSelectStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Expert Assistant Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-4 rounded-xl shadow-lg border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              E-Tergov AI — Kriptografik va JPK Yordamchisi
            </h3>
            <p className="text-[11px] text-slate-300">
              Joriy tergov holatingiz bo‘yicha sun’iy intellekt prokuror ekspert xulosasini oling.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/40 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Ekspert Tahlili</span>
        </button>
      </div>

      {showAiModal && (
        <AIExpertAssistantModal state={state} onClose={() => setShowAiModal(false)} />
      )}

      {/* Top Stepper */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {STEP_DEFINITIONS.map((step) => {
            const isCurrent = step.id === currentStep;
            const isUnlocked = step.id <= state.maxUnlockedStep;
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
                disabled={!isUnlocked}
                onClick={() => onSelectStep(step.id)}
                className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50 border border-blue-200 text-[#1D4ED8]'
                    : isCompleted
                      ? 'bg-emerald-50/50 border border-emerald-200 text-emerald-900'
                      : isUnlocked
                        ? 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800'
                        : 'bg-slate-50 border border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-mono font-semibold flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-[#1D4ED8] text-white'
                      : isCompleted
                        ? 'bg-[#10B981] text-white'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {step.id}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{step.shortLabel}</div>
                </div>
              </button>
            );
          })}
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
