import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react';
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
  ArrowLeft,
  Presentation,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Radio,
  Search,
  FileCheck2,
  MessageSquare,
  ShieldCheck,
  Gavel,
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

const STEP_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Radio,
  2: Search,
  3: FileCheck2,
  4: MessageSquare,
  5: ShieldCheck,
  6: Gavel,
};

const STEP_TRANSITION_VARIANTS = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 28 : -28,
    scale: 0.992,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -24 : 24,
    scale: 0.994,
  }),
};

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
  const prevStepRef = useRef<number>(currentStep);
  const direction = currentStep >= prevStepRef.current ? 1 : -1;

  useEffect(() => {
    prevStepRef.current = currentStep;
  }, [currentStep]);

  // Smooth keyboard step navigation (Alt + ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowRight' && currentStep < 6) {
        e.preventDefault();
        onSelectStep(currentStep + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        e.preventDefault();
        onSelectStep(currentStep - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentStep, onSelectStep]);

  const completedCount = [
    state.step1Completed,
    state.step2Completed,
    state.step3Completed,
    state.step4Completed,
    state.step5Completed,
    state.step6Completed,
  ].filter(Boolean).length;

  const progressPct = Math.round((completedCount / 6) * 100);
  const activeStepDef = STEP_DEFINITIONS.find((s) => s.id === currentStep) ?? STEP_DEFINITIONS[0];

  const handleSelectStepSmooth = (stepId: number) => {
    if (stepId === currentStep) return;
    onSelectStep(stepId);
  };

  const prevStepHandler = () => {
    if (currentStep > 1) {
      onSelectStep(currentStep - 1);
    }
  };

  const nextStepHandler = () => {
    if (currentStep < 6) {
      onSelectStep(currentStep + 1);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-5">
        {/* Calm Mist-Sage AI Legal Advisor Strip */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-r from-[#DCE7E3] via-[#E6ECE9] to-[#EBF0EE] text-slate-900 px-5 py-3.5 rounded-2xl border border-[#BACAC3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-teal-900">
                E-Tergov AI · Prokuror va JPK maslahatchisi
              </div>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                Joriy tergov bosqichi va to‘plangan dalillar bo‘yicha real vaqtda huquqiy audit xulosasini oling.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => onNavigate('presentation')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F2F4F3] hover:bg-[#E2EAE6] border border-[#BBCAC3] text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5 text-teal-700" />
              <span>Planshet</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span>AI Ekspert Tahlili</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {showAiModal && (
          <AIExpertAssistantModal
            state={state}
            onClose={() => setShowAiModal(false)}
            onSelectEngine={onSelectEngine}
          />
        )}

        {/* Fluid Antigravity-Style 6-Step Connected Motion Rail */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="surface-card rounded-2xl p-4 sm:p-5 space-y-4"
        >
          {/* Top Bar: Route Context + Live Journal + Progress */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-bold text-slate-900">Protsessual marshrut</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-teal-800 font-medium">
                0{currentStep}. {activeStepDef.shortLabel}
              </span>
              <span aria-hidden="true" className="text-slate-400 hidden md:inline">·</span>
              <span className="text-slate-500 hidden md:inline">
                Barcha 6 bosqich erkin o‘tish uchun ochiq
              </span>
            </div>

            <div className="flex items-center gap-2.5 font-mono tabular-nums text-slate-600">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setShowJournalDrawer((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-sans font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  showJournalDrawer
                    ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xs'
                    : 'bg-[#E9EEEC] hover:bg-[#DDE7E3] border-[#C2CFC9] text-slate-800'
                }`}
              >
                <ClipboardList
                  className={`w-3.5 h-3.5 ${showJournalDrawer ? 'text-teal-100' : 'text-teal-700'}`}
                />
                <span>Qarorlar jurnali ({state.timeline.length})</span>
                {showJournalDrawer ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </motion.button>

              <span className="text-slate-700 font-semibold">
                Bajarildi: {completedCount}/6 ({progressPct}%)
              </span>

              <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-[#CAD4CF]">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  disabled={currentStep <= 1}
                  onClick={prevStepHandler}
                  aria-label="Oldingi bosqich"
                  className="p-1.5 rounded-lg bg-[#E9EEEC] hover:bg-[#D8E4DF] border border-[#C2CFC9] text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  disabled={currentStep >= 6}
                  onClick={nextStepHandler}
                  aria-label="Keyingi bosqich"
                  className="p-1.5 rounded-lg bg-[#E9EEEC] hover:bg-[#D8E4DF] border border-[#C2CFC9] text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Smooth Animated Qarorlar Jurnali Drawer */}
          <AnimatePresence initial={false}>
            {showJournalDrawer && (
              <motion.div
                key="journal-drawer"
                initial={{ opacity: 0, y: -10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-[#C4D0CB] bg-[#EAEFEE] p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#CFDAD5]">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Qarorlar jurnali va protsessual xronologiya (Jonli nazorat)
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Har bir tergov harakati vaqti, JPK moddasi va ball ta’siri bilan qayd etiladi
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                    <span className="text-emerald-700 font-semibold">
                      To‘g‘ri: {state.timeline.filter((t) => t.status === 'green').length}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-amber-700 font-semibold">
                      Ogohlantirish: {state.timeline.filter((t) => t.status === 'yellow').length}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-red-700 font-semibold">
                      Xato: {state.timeline.filter((t) => t.status === 'red').length}
                    </span>
                  </div>
                </div>

                {state.timeline.length === 0 ? (
                  <div className="text-xs text-slate-600 py-2">
                    Hali qarorlar qayd etilmagan. 1-bosqichdan tergov harakatini bajaring.
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto divide-y divide-[#D4DDD9] pr-1">
                    {state.timeline.map((ev) => (
                      <div
                        key={ev.id}
                        className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          {ev.status === 'green' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          )}
                          {ev.status === 'yellow' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          )}
                          {ev.status === 'red' && (
                            <XCircle className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">{ev.title}</div>
                            <div className="text-[11px] text-slate-600 font-mono tabular-nums">
                              {ev.step}-bosqich · {ev.timestampSim} · {ev.jpkRef}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`font-mono font-semibold tabular-nums shrink-0 ${
                            ev.status === 'green'
                              ? 'text-emerald-700'
                              : ev.status === 'yellow'
                                ? 'text-amber-700'
                                : 'text-red-700'
                          }`}
                        >
                          {ev.scoreDelta >= 0 ? `+${ev.scoreDelta}` : ev.scoreDelta} ball
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dual-Layer Smooth Spring Progress Track */}
          <div className="relative h-1.5 w-full bg-[#DCE3E0] rounded-full overflow-hidden">
            {/* Active step position ghost track */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-teal-600/25 rounded-full"
              initial={false}
              animate={{ width: `${Math.round((currentStep / 6) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            />
            {/* Completed progress fill */}
            <motion.div
              className="relative h-full bg-gradient-to-r from-[#0F766E] via-teal-600 to-emerald-600 rounded-full"
              initial={false}
              animate={{ width: `${Math.max(10, progressPct)}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            />
          </div>

          {/* 6-Step Fluid Floating Pill Rail with Shared-Element Spring Glide */}
          <LayoutGroup id="investigation-6-steps">
            <div className="overflow-x-auto pb-1">
              <div className="grid grid-cols-6 min-w-[760px] gap-2 p-1.5 rounded-2xl bg-[#E5EBE8] border border-[#C6D1CC]">
                {STEP_DEFINITIONS.map((step) => {
                  const isCurrent = step.id === currentStep;
                  const isCompleted =
                    (step.id === 1 && state.step1Completed) ||
                    (step.id === 2 && state.step2Completed) ||
                    (step.id === 3 && state.step3Completed) ||
                    (step.id === 4 && state.step4Completed) ||
                    (step.id === 5 && state.step5Completed) ||
                    (step.id === 6 && state.step6Completed);
                  const StepIcon = STEP_ICONS[step.id] ?? Radio;

                  return (
                    <motion.button
                      key={step.id}
                      type="button"
                      onClick={() => handleSelectStepSmooth(step.id)}
                      whileHover={isCurrent ? undefined : { y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                            ? 'text-teal-950 hover:bg-[#DCE7E2]'
                            : 'text-slate-700 hover:bg-[#EFF2F0]'
                      }`}
                    >
                      {/* Shared-Element Gliding Active Surface */}
                      {isCurrent && (
                        <motion.div
                          layoutId="investigationActiveStepBg"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 32,
                            mass: 0.78,
                          }}
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0F766E] via-[#0F6E67] to-[#115E59] shadow-[0_10px_24px_-10px_rgba(15,118,110,0.65)] border border-teal-600/50"
                        />
                      )}

                      {/* Subtle Completed Surface */}
                      {!isCurrent && isCompleted && (
                        <div className="absolute inset-0 rounded-xl bg-[#D8E7E1]/85 border border-[#A5C6BA]" />
                      )}

                      {/* Step Number / Check Badge */}
                      <motion.span
                        layout
                        className={`relative z-10 w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                          isCurrent
                            ? 'bg-white/18 text-white border border-white/25'
                            : isCompleted
                              ? 'bg-[#0F766E] text-white'
                              : 'bg-[#F2F4F3] border border-[#C6D1CC] text-slate-700'
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </motion.span>
                        ) : (
                          <span>0{step.id}</span>
                        )}
                      </motion.span>

                      {/* Step Title & Compact State */}
                      <div className="relative z-10 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <StepIcon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCurrent
                                ? 'text-teal-100'
                                : isCompleted
                                  ? 'text-teal-700'
                                  : 'text-slate-500'
                            }`}
                          />
                          <span className="text-xs font-semibold truncate">{step.shortLabel}</span>
                        </div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isCurrent
                              ? 'text-teal-100/90'
                              : isCompleted
                                ? 'text-teal-800 font-medium'
                                : 'text-slate-500'
                          }`}
                        >
                          {isCurrent ? 'Faol bosqich' : isCompleted ? 'Yakunlandi' : 'Ochiq'}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </LayoutGroup>
        </motion.section>

        {/* Smooth Directional Transition Stage for Active Step Content */}
        <div className="relative min-h-[420px]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={STEP_TRANSITION_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.26,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Smooth Step Navigation Footer */}
        <div className="surface-card rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <motion.button
            whileHover={currentStep > 1 ? { x: -2 } : undefined}
            whileTap={currentStep > 1 ? { scale: 0.98 } : undefined}
            type="button"
            disabled={currentStep <= 1}
            onClick={prevStepHandler}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8EEEC] hover:bg-[#DAE5E0] border border-[#C2CFC9] text-xs font-semibold text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-800" />
            <span>
              {currentStep > 1
                ? `0${currentStep - 1}. ${STEP_DEFINITIONS[currentStep - 2].shortLabel}`
                : 'Boshlang‘ich bosqich'}
            </span>
          </motion.button>

          <div className="flex items-center gap-1.5" aria-label="Bosqich ko‘rsatkichi">
            {STEP_DEFINITIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStepSmooth(s.id)}
                aria-label={`${s.id}-bosqich: ${s.shortLabel}`}
                className="p-1 cursor-pointer focus-visible:outline-none"
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`block h-2 rounded-full transition-colors ${
                    s.id === currentStep
                      ? 'w-7 bg-[#0F766E]'
                      : 'w-2 bg-[#B9C7C1] hover:bg-teal-600/60'
                  }`}
                />
              </button>
            ))}
          </div>

          <motion.button
            whileHover={currentStep < 6 ? { x: 2 } : undefined}
            whileTap={currentStep < 6 ? { scale: 0.98 } : undefined}
            type="button"
            disabled={currentStep >= 6}
            onClick={nextStepHandler}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <span>
              {currentStep < 6
                ? `0${currentStep + 1}. ${STEP_DEFINITIONS[currentStep].shortLabel}`
                : 'Yakuniy bosqich'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </MotionConfig>
  );
};
