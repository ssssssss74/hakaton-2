/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { InvestigationWorkspace } from './components/InvestigationWorkspace';
import { LeaderboardView } from './components/LeaderboardView';
import { InstructorAnalyticsView } from './components/InstructorAnalyticsView';
import { PresentationTabletView } from './components/PresentationTabletView';
import { ThreeDSceneViewer } from './components/ThreeDSceneViewer';
import {
  computeMetrics,
  formatSimTime,
  evaluateInterrogationFallback,
  buildFallbackCourtChallenge,
  evaluateFallbackVerdict,
} from './utils/scoring';
import {
  AGENCY_REQUESTS,
  EVIDENCE_CLUES,
  STEP1_OPTIONS,
  createInitialState,
  resolveActiveCaseMeta,
} from './data/caseData';
import { CustomCase, DecisionFormState, SimulationState } from './types/simulation';

const STORAGE_KEY = 'e_tergov_lab_sim_state_v1';

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 2200
): Promise<Response> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('Offline mode: using instant local simulator');
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Static/offline host detected: switching to local engine');
    }
    return res;
  } finally {
    window.clearTimeout(timer);
  }
}

export default function App() {
  const [state, setState] = useState<SimulationState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SimulationState>;
        return { ...createInitialState(), ...parsed, maxUnlockedStep: 6 };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return createInitialState();
  });

  const [isSendingInterrogation, setIsSendingInterrogation] = useState(false);
  const [isLoadingCourtChallenge, setIsLoadingCourtChallenge] = useState(false);
  const [isLoadingCourtVerdict, setIsLoadingCourtVerdict] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  const metrics = computeMetrics(state);

  const handleResetDemo = () => {
    const fresh = createInitialState();
    setState(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleNavigate = (view: SimulationState['activeView']) => {
    setState((prev) => ({ ...prev, activeView: view }));
  };

  const handleSetAiEngine = (engine: 'gemini' | 'claude') => {
    setState((prev) => ({ ...prev, aiEngine: engine }));
  };

  const handleStartInvestigation = (step = 1) => {
    setState((prev) => ({
      ...prev,
      activeView: 'investigation',
      currentStep: step,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, step),
    }));
  };

  const handleActivateCase = (caseId: string, navigateToInvestigation = true) => {
    setState((prev) => {
      const fresh = createInitialState(caseId, prev.customCases);
      return {
        ...fresh,
        studentName: prev.studentName,
        studentGroup: prev.studentGroup,
        aiEngine: prev.aiEngine,
        duelJoined: prev.duelJoined,
        activeView: navigateToInvestigation ? 'investigation' : 'dashboard',
        currentStep: 1,
        maxUnlockedStep: 6,
      };
    });
  };

  // Step 1 Actions
  const handleSelectStep1Decision = (optionId: string) => {
    const opt = STEP1_OPTIONS.find((o) => o.id === optionId);
    if (!opt) return;

    const newHours = state.hoursUsed + opt.hoursSpent;
    const simTime = formatSimTime(newHours);

    const newEvent = {
      id: `ev-${Date.now()}`,
      step: 1,
      stepLabel: '102 Xabari',
      timestampSim: simTime,
      title: `Dastlabki qaror: ${opt.title}`,
      detail: opt.description,
      status: opt.status,
      jpkRef: opt.jpkRef,
      scoreDelta: opt.scoreDelta,
      hoursSpent: opt.hoursSpent,
    };

    setState((prev) => ({
      ...prev,
      step1ChoiceId: optionId,
      step1Completed: true,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, 2),
      hoursUsed: newHours,
      timeline: [newEvent, ...prev.timeline],
    }));
  };

  // Step 2 Actions
  const handleToggleEvidenceClue = (clueId: string) => {
    setState((prev) => {
      const pinned = prev.pinnedClueIds.includes(clueId);
      const updated = pinned
        ? prev.pinnedClueIds.filter((id) => id !== clueId)
        : [...prev.pinnedClueIds, clueId];
      return { ...prev, pinnedClueIds: updated };
    });
  };

  const handleCompleteStep2 = () => {
    const simTime = formatSimTime(state.hoursUsed);
    const criticalPinned = EVIDENCE_CLUES.filter(
      (c) => c.isCritical && state.pinnedClueIds.includes(c.id)
    ).length;

    const scoreDelta = criticalPinned === 3 ? 15 : criticalPinned >= 2 ? 8 : -5;
    const status = criticalPinned === 3 ? 'green' : criticalPinned >= 2 ? 'yellow' : 'red';

    const newEvent = {
      id: `ev-${Date.now()}`,
      step: 2,
      stepLabel: 'Dalillar doskasi',
      timestampSim: simTime,
      title: 'Dalillar doskasi rasmiylashtirildi',
      detail: `Talaba ${state.pinnedClueIds.length} ta dalil tanladi (shundan ${criticalPinned}/3 tasi hal qiluvchi dalillar).`,
      status: status as any,
      jpkRef: 'JPK 81, 95-moddalar',
      scoreDelta,
      hoursSpent: 3,
    };

    setState((prev) => ({
      ...prev,
      step2Completed: true,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, 3),
      hoursUsed: prev.hoursUsed + 3,
      timeline: [newEvent, ...prev.timeline],
    }));
  };

  const handleSolveDfir = (caseId: 'case1' | 'case2', artifact: string) => {
    setState((prev) => {
      const existing = prev.solvedDfirCases || [];
      if (existing.includes(caseId)) return prev;
      const simTime = formatSimTime(prev.hoursUsed);
      const dfirEvent = {
        id: `ev-dfir-${caseId}-${Date.now()}`,
        step: 2,
        stepLabel: 'Mini-DFIR tekshiruvi',
        timestampSim: simTime,
        title:
          caseId === 'case1'
            ? `Raqamli artefakt topildi: ${artifact}`
            : `Alibi ziddiyati artefakti topildi: ${artifact}`,
        detail:
          caseId === 'case1'
            ? 'Talaba Kiber-izlar grafi va № 2026/11-420 ekspertiza asosida proksi IP manzilini mustaqil aniqladi (+10 bonus ball).'
            : 'Talaba Smart-Lock #4821 va restoran kamerasi (21:22) ziddiyatini mustaqil fosh qildi (+10 bonus ball).',
        status: 'green' as const,
        jpkRef: 'O‘zR JPK 95¹, 204²-moddalar',
        scoreDelta: 10,
        hoursSpent: 0,
      };
      return {
        ...prev,
        solvedDfirCases: [...existing, caseId],
        timeline: [dfirEvent, ...prev.timeline],
      };
    });
  };

  // Step 3 Actions
  const handleSendAgencyRequest = (reqId: string) => {
    const req = AGENCY_REQUESTS.find((r) => r.id === reqId);
    if (!req || state.sentRequestIds.includes(reqId)) return;

    const newHours = state.hoursUsed + req.hoursCost;
    const simTime = formatSimTime(newHours);

    const newEvent = {
      id: `ev-${Date.now()}`,
      step: 3,
      stepLabel: 'Idoralararo so‘rov',
      timestampSim: simTime,
      title: `Rasmiy so‘rov: ${req.agency}`,
      detail: `${req.shortTitle} — ${req.responseSummary}`,
      status: req.recommended ? ('green' as const) : ('yellow' as const),
      jpkRef: 'JPK 88-modda',
      scoreDelta: req.recommended ? 10 : 2,
      hoursSpent: req.hoursCost,
    };

    setState((prev) => ({
      ...prev,
      sentRequestIds: [...prev.sentRequestIds, reqId],
      hoursUsed: newHours,
      timeline: [newEvent, ...prev.timeline],
    }));
  };

  const handleUpdateDecisionForm = (patch: Partial<DecisionFormState>) => {
    setState((prev) => ({
      ...prev,
      decisionForm: { ...prev.decisionForm, ...patch },
    }));
  };

  const handleRunJpkAudit = () => {
    const { jkArticle, jpkBasis, mandatoryRequisites } = state.decisionForm;
    const activeMeta = resolveActiveCaseMeta(state.activeCaseId, state.customCases);
    const issues: string[] = [];

    if (jkArticle !== activeMeta.expectedJkValue) {
      issues.push(
        `JK kvalifikatsiyasi xato tanlandi (${activeMeta.expectedJkLabel} o‘rniga boshqa modda ko‘rsatilgan).`
      );
    }
    if (jpkBasis !== 'JPK_321_322') {
      issues.push("JPK asoslari noto'g'ri tanlandi.");
    }
    if (mandatoryRequisites.length < 4) {
      issues.push("Ayrim majburiy rekvizitlar (JPK 331-modda) belgilanmagan.");
    }

    const passed = issues.length === 0;
    const simTime = formatSimTime(state.hoursUsed);

    const newEvent = {
      id: `ev-${Date.now()}`,
      step: 3,
      stepLabel: 'Jinoyat ishi qo‘zg‘atish',
      timestampSim: simTime,
      title: passed ? 'JPK auditi muvaffaqiyatli o‘tdi' : 'JPK auditida kamchiliklar topildi',
      detail: passed
        ? "Jinoyat ishi qonuniy va asosli ravishda qo'zg'atildi."
        : issues.join(' '),
      status: passed ? ('green' as const) : ('red' as const),
      jpkRef: 'JPK 321, 331-moddalar',
      scoreDelta: passed ? 15 : -10,
      hoursSpent: 2,
    };

    setState((prev) => ({
      ...prev,
      decisionForm: {
        ...prev.decisionForm,
        audited: true,
        auditPassed: passed,
        auditIssues: issues,
      },
      step3Completed: passed,
      maxUnlockedStep: passed ? Math.max(prev.maxUnlockedStep, 4) : prev.maxUnlockedStep,
      hoursUsed: prev.hoursUsed + 2,
      timeline: [newEvent, ...prev.timeline],
    }));
  };

  // Step 4 Actions
  const handleSendInterrogationQuestion = async (question: string) => {
    setIsSendingInterrogation(true);
    const simTime = formatSimTime(state.hoursUsed);

    const investigatorMsg = {
      id: `msg-${Date.now()}`,
      role: 'investigator' as const,
      text: question,
      timestamp: simTime.slice(11, 16),
    };

    const activeMeta = resolveActiveCaseMeta(state.activeCaseId, state.customCases);

    try {
      const response = await fetchWithTimeout('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: state.interrogationMessages,
          twistActive: state.twistTriggered || state.interrogationMessages.length >= 4,
          pinnedClues: state.pinnedClueIds,
          engine: state.aiEngine,
          caseId: activeMeta.id,
          suspectName: activeMeta.suspectName,
          caseSummary: activeMeta.summary102,
        }),
      });

      if (!response.ok) {
        throw new Error('Server interrogation error');
      }

      const data = await response.json();

      const evaluation = {
        trafficLight: data.trafficLight,
        scoreDelta: data.scoreDelta,
        coachTitle: data.coachTitle,
        coachExplanation: data.coachExplanation,
        jpkReference: data.jpkReference,
      };

      const suspectMsg = {
        id: `msg-suspect-${Date.now()}`,
        role: 'suspect' as const,
        text: data.suspectReply,
        timestamp: simTime.slice(11, 16),
      };

      const updatedMsgs = [
        ...state.interrogationMessages,
        { ...investigatorMsg, evaluation },
        suspectMsg,
      ];

      const newTwist = state.twistTriggered || updatedMsgs.filter((m) => m.role === 'investigator').length >= 2;
      const alibiHit = state.alibiConfronted || data.alibiContradicted;

      const timelineEvent = {
        id: `ev-${Date.now()}`,
        step: 4,
        stepLabel: 'AI-So‘roq',
        timestampSim: simTime,
        title: `So'roq taktikasi: ${data.coachTitle}`,
        detail: `Savol: "${question.slice(0, 50)}..." — ${data.coachExplanation}`,
        status: data.trafficLight,
        jpkRef: data.jpkReference,
        scoreDelta: data.scoreDelta,
        hoursSpent: 1,
      };

      setState((prev) => ({
        ...prev,
        interrogationMessages: updatedMsgs,
        twistTriggered: prev.twistTriggered || newTwist,
        alibiConfronted: alibiHit,
        hoursUsed: prev.hoursUsed + 1,
        timeline: [timelineEvent, ...prev.timeline],
      }));
    } catch (err) {
      console.warn('Using fallback interrogation evaluation due to network/API error', err);
      const fallback = evaluateInterrogationFallback(
        question,
        state.twistTriggered || state.interrogationMessages.length >= 4
      );

      const evaluation = {
        trafficLight: fallback.trafficLight,
        scoreDelta: fallback.scoreDelta,
        coachTitle: fallback.coachTitle,
        coachExplanation: fallback.coachExplanation,
        jpkReference: fallback.jpkReference,
      };

      const suspectMsg = {
        id: `msg-suspect-${Date.now()}`,
        role: 'suspect' as const,
        text: fallback.suspectReply,
        timestamp: simTime.slice(11, 16),
      };

      const updatedMsgs = [
        ...state.interrogationMessages,
        { ...investigatorMsg, evaluation },
        suspectMsg,
      ];

      const newTwist = state.twistTriggered || updatedMsgs.filter((m) => m.role === 'investigator').length >= 2;
      const alibiHit = state.alibiConfronted || fallback.alibiContradicted;

      const timelineEvent = {
        id: `ev-${Date.now()}`,
        step: 4,
        stepLabel: 'AI-So‘roq',
        timestampSim: simTime,
        title: `So'roq taktikasi: ${fallback.coachTitle}`,
        detail: `Savol: "${question.slice(0, 50)}..." — ${fallback.coachExplanation}`,
        status: fallback.trafficLight,
        jpkRef: fallback.jpkReference,
        scoreDelta: fallback.scoreDelta,
        hoursSpent: 1,
      };

      setState((prev) => ({
        ...prev,
        interrogationMessages: updatedMsgs,
        twistTriggered: prev.twistTriggered || newTwist,
        alibiConfronted: alibiHit,
        hoursUsed: prev.hoursUsed + 1,
        timeline: [timelineEvent, ...prev.timeline],
      }));
    } finally {
      setIsSendingInterrogation(false);
    }
  };

  const handleOpenEthics = () => {
    setState((prev) => ({ ...prev, ethicsDilemmaOpen: true }));
  };

  const handleAnswerEthics = (choiceId: string) => {
    const isLawful = choiceId === 'ethics_lawful';
    const scoreDelta = isLawful ? 15 : -25;
    const ethicsDelta = isLawful ? 10 : -35;
    const simTime = formatSimTime(state.hoursUsed);

    const newEvent = {
      id: `ev-${Date.now()}`,
      step: 4,
      stepLabel: 'Etika dilemmasi (PF-257)',
      timestampSim: simTime,
      title: isLawful ? 'Qonuniy etika qarori qabul qilindi' : 'Etika va JPK 48-modda buzilishi',
      detail: isLawful
        ? 'Himoyachi ishtirokini ta’minlab, advokatsiz so‘roqdan voz kechildi.'
        : 'Himoyachi ishtirokisiz ko‘rsatma olishga urinish qayd etildi.',
      status: isLawful ? ('green' as const) : ('red' as const),
      jpkRef: 'PF-257, JPK 48-modda',
      scoreDelta,
      hoursSpent: 1,
    };

    setState((prev) => ({
      ...prev,
      ethicsDilemmaOpen: false,
      ethicsIndex: Math.max(0, Math.min(100, prev.ethicsIndex + ethicsDelta)),
      ethicsState: {
        answered: true,
        choiceId,
        lawful: isLawful,
        explanation: isLawful
          ? "Namuna! Himoya huquqi to'liq ta'minlandi."
          : "Xato! Advokatsiz olingan iqrornoma yuridik kuchga ega emas.",
      },
      hoursUsed: prev.hoursUsed + 1,
      timeline: [newEvent, ...prev.timeline],
    }));
  };

  const handleCompleteStep4 = () => {
    setState((prev) => ({
      ...prev,
      step4Completed: true,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, 5),
    }));
  };

  // Step 5 Actions
  const handleToggleProsecutorChecklist = (id: string) => {
    setState((prev) => {
      const exists = prev.prosecutorReview.checklist.includes(id);
      const updated = exists
        ? prev.prosecutorReview.checklist.filter((i) => i !== id)
        : [...prev.prosecutorReview.checklist, id];
      return {
        ...prev,
        prosecutorReview: { ...prev.prosecutorReview, checklist: updated },
      };
    });
  };

  const handleSubmitToProsecutor = () => {
    const redCount = state.timeline.filter((t) => t.status === 'red').length;
    const ethicsFailed = state.ethicsState.answered && state.ethicsState.lawful === false;

    const flags: Array<{
      id: string;
      severity: 'red' | 'yellow';
      title: string;
      jpkRef: string;
      explanation: string;
      penaltyText: string;
    }> = [];

    if (redCount > 0) {
      flags.push({
        id: 'flag-red',
        severity: 'red',
        title: `${redCount} ta jiddiy protsessual xato yoki JPK buzilishi aniqlandi`,
        jpkRef: 'JPK 95, 331-moddalar',
        explanation: "Tergov davomida yo'l qo'yilgan xatolar ayblov xulosasini zaiflashtiradi.",
        penaltyText: "-20 ball va sudda raddiya xavfi",
      });
    }

    if (ethicsFailed) {
      flags.push({
        id: 'flag-ethics',
        severity: 'red',
        title: 'PF-257 talablari va himoya huquqi buzilgan',
        jpkRef: 'PF-257, JPK 48-modda',
        explanation: "Himoyachi ishtirokisiz harakatlar sudda ishning qayta tergovga qaytarilishiga sabab bo'ladi.",
        penaltyText: "-30 ball va sud qaytaruvi ehtimoli",
      });
    }

    const overdue = state.totalHoursBudget - state.hoursUsed < 0;
    if (overdue) {
      flags.push({
        id: 'flag-overdue',
        severity: 'yellow',
        title: 'Protsessual muddat chegarasi buzilgan',
        jpkRef: 'JPK 329, 351-moddalar',
        explanation: "Tergov harakatlari belgilangan 72 soatlik chegaradan oshib ketgan.",
        penaltyText: "Muddat rioyasi KPI pasayadi",
      });
    }

    const status = flags.some((f) => f.severity === 'red')
      ? ('rejected' as const)
      : flags.length > 0
        ? ('warning' as const)
        : ('approved' as const);
    const simTime = formatSimTime(state.hoursUsed);

    const newEvent = {
      id: `ev-${Date.now()}`,
      step: 5,
      stepLabel: 'Prokuror nazorati',
      timestampSim: simTime,
      title:
        status === 'approved'
          ? 'Prokuror ayblov xulosasini tasdiqladi'
          : 'Prokuror e’tirozlar bildirdi',
      detail:
        status === 'approved'
          ? "Barcha bosqichlar JPK talablariga muvofiq bajarilgani tasdiqlandi."
          : `Virtual Prokuror auditi davomida ${flags.length} ta kamchilik qayd etildi.`,
      status: status === 'approved' ? ('green' as const) : ('red' as const),
      jpkRef: 'JPK 381-modda',
      scoreDelta: status === 'approved' ? 15 : -15,
      hoursSpent: 2,
    };

    setState((prev) => ({
      ...prev,
      step5Completed: status === 'approved',
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, 6),
      hoursUsed: prev.hoursUsed + 2,
      prosecutorReview: {
        ...prev.prosecutorReview,
        submitted: true,
        status,
        flags,
      },
      timeline: [newEvent, ...prev.timeline],
    }));
  };

  const handleRemediateProsecutorIssues = () => {
    const simTime = formatSimTime(state.hoursUsed);
    const remediationEvent = {
      id: `ev-${Date.now()}`,
      step: 5,
      stepLabel: 'Qo‘shimcha tergov',
      timestampSim: simTime,
      title: 'Protsessual kamchiliklar qo‘shimcha bayonnoma bilan tuzatildi',
      detail: 'Aniqlangan kamchiliklar yuzasidan qo‘shimcha tergov harakati bajarildi va prokuror tasdig‘i olindi.',
      status: 'green' as const,
      jpkRef: 'JPK 382-modda',
      scoreDelta: 10,
      hoursSpent: 4,
    };

    setState((prev) => ({
      ...prev,
      step5Completed: true,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, 6),
      hoursUsed: prev.hoursUsed + 4,
      prosecutorReview: {
        ...prev.prosecutorReview,
        remediated: true,
        status: 'approved',
      },
      timeline: [remediationEvent, ...prev.timeline],
    }));
  };

  const handleProceedProsecutorWithRisk = () => {
    setState((prev) => ({
      ...prev,
      step5Completed: true,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, 6),
      prosecutorReview: {
        ...prev.prosecutorReview,
        proceededWithRisk: true,
      },
    }));
  };

  // Step 6 Actions
  const handleStartCourtHearing = async () => {
    setIsLoadingCourtChallenge(true);
    try {
      const response = await fetchWithTimeout('/api/court/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violations: state.prosecutorReview.flags,
          summary: ACTIVE_CASE_SUMMARY_TEXT(state),
          engine: state.aiEngine,
        }),
      });

      if (!response.ok) {
        throw new Error('Server court challenge error');
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        courtSession: {
          ...prev.courtSession,
          challengeLoaded: true,
          advocateArgument: data.advocateArgument,
          targetPoint: data.targetPoint,
          jpkRef: data.jpkRef,
        },
      }));
    } catch (err) {
      console.warn('Using fallback court challenge', err);
      const fallback = buildFallbackCourtChallenge(state);
      setState((prev) => ({
        ...prev,
        courtSession: {
          ...prev.courtSession,
          challengeLoaded: true,
          advocateArgument: fallback.advocateArgument,
          targetPoint: fallback.targetPoint,
          jpkRef: fallback.jpkRef,
        },
      }));
    } finally {
      setIsLoadingCourtChallenge(false);
    }
  };

  const handleSubmitCourtDefense = async (defense: string) => {
    setIsLoadingCourtVerdict(true);
    const criticalMistakes = state.timeline.filter((t) => t.status === 'red').length;
    const evidenceComplete = state.pinnedClueIds.length >= 3;
    const ethicsPassed = !state.ethicsState.answered || state.ethicsState.lawful !== false;
    const currentScore = metrics.totalScore;

    try {
      const response = await fetchWithTimeout('/api/court/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defenseStatement: defense,
          advocateArgument: state.courtSession.advocateArgument,
          criticalMistakesCount: criticalMistakes,
          evidenceComplete,
          ethicsPassed,
          totalScore: currentScore,
          engine: state.aiEngine,
        }),
      });

      if (!response.ok) {
        throw new Error('Server court verdict error');
      }

      const data = await response.json();
      const simTime = formatSimTime(state.hoursUsed);
      const courtEvent = {
        id: `ev-${Date.now()}`,
        step: 6,
        stepLabel: 'Virtual Sud',
        timestampSim: simTime,
        title: data.verdict === 'approved' ? 'Sud ayblovni tasdiqladi' : 'Sud ishni qayta tergovga qaytardi',
        detail: data.judgeReasoning,
        status: data.verdict === 'approved' ? ('green' as const) : ('red' as const),
        jpkRef: 'JPK 416, 419-moddalar',
        scoreDelta: data.verdict === 'approved' ? 25 : -20,
        hoursSpent: 2,
      };

      setState((prev) => ({
        ...prev,
        step6Completed: true,
        hoursUsed: prev.hoursUsed + 2,
        courtSession: {
          ...prev.courtSession,
          studentDefense: defense,
          verdictIssued: true,
          verdict: data.verdict,
          verdictTitle: data.verdictTitle,
          judgeReasoning: data.judgeReasoning,
          improvementAdvice: data.improvementAdvice,
        },
        timeline: [courtEvent, ...prev.timeline],
      }));
    } catch (err) {
      console.warn('Using fallback court verdict evaluation', err);
      const fallback = evaluateFallbackVerdict(state, defense);
      const simTime = formatSimTime(state.hoursUsed);
      const courtEvent = {
        id: `ev-${Date.now()}`,
        step: 6,
        stepLabel: 'Virtual Sud',
        timestampSim: simTime,
        title: fallback.verdict === 'approved' ? 'Sud ayblovni tasdiqladi' : 'Sud ishni qayta tergovga qaytardi',
        detail: fallback.judgeReasoning,
        status: fallback.verdict === 'approved' ? ('green' as const) : ('red' as const),
        jpkRef: 'JPK 416, 419-moddalar',
        scoreDelta: fallback.verdict === 'approved' ? 25 : -20,
        hoursSpent: 2,
      };

      setState((prev) => ({
        ...prev,
        step6Completed: true,
        hoursUsed: prev.hoursUsed + 2,
        courtSession: {
          ...prev.courtSession,
          studentDefense: defense,
          verdictIssued: true,
          verdict: fallback.verdict,
          verdictTitle: fallback.verdictTitle,
          judgeReasoning: fallback.judgeReasoning,
          improvementAdvice: fallback.improvementAdvice,
        },
        timeline: [courtEvent, ...prev.timeline],
      }));
    } finally {
      setIsLoadingCourtVerdict(false);
    }
  };

  const handleAddCustomCase = (newCase: CustomCase) => {
    setState((prev) => ({
      ...prev,
      customCases: [newCase, ...prev.customCases],
    }));
  };

  const handleJoinDuel = () => {
    setState((prev) => ({ ...prev, duelJoined: true }));
  };

  const handleRecordDuelVictory = () => {
    const simTime = formatSimTime(state.hoursUsed);
    const duelEvent = {
      id: `ev-${Date.now()}`,
      step: 3,
      stepLabel: 'Tergov dueli',
      timestampSim: simTime,
      title: 'Haftalik tergov duelida g‘alaba qozonildi',
      detail: 'HMQA chempioni bilan bo‘lgan tezkor tergov duelida g‘alaba qozonildi va reyting oshirildi.',
      status: 'green' as const,
      jpkRef: 'HMQA Duel ligasi',
      scoreDelta: 10,
      hoursSpent: 0,
    };

    setState((prev) => ({
      ...prev,
      duelJoined: true,
      baseScore: prev.baseScore + 10,
      timeline: [duelEvent, ...prev.timeline],
    }));
  };

  return (
    <Layout state={state} metrics={metrics} onNavigate={handleNavigate} onResetDemo={handleResetDemo}>
      {state.activeView === 'dashboard' && (
        <DashboardView
          state={state}
          metrics={metrics}
          onStartInvestigation={handleStartInvestigation}
          onNavigate={handleNavigate}
          onActivateCase={handleActivateCase}
        />
      )}

      {state.activeView === 'investigation' && (
        <InvestigationWorkspace
          state={state}
          metrics={metrics}
          isSendingInterrogation={isSendingInterrogation}
          isLoadingCourtChallenge={isLoadingCourtChallenge}
          isLoadingCourtVerdict={isLoadingCourtVerdict}
          onSelectStep={(step) =>
            setState((prev) => ({
              ...prev,
              currentStep: step,
              maxUnlockedStep: Math.max(prev.maxUnlockedStep, step),
            }))
          }
          onSelectStep1Decision={handleSelectStep1Decision}
          onToggleEvidenceClue={handleToggleEvidenceClue}
          onCompleteStep2={handleCompleteStep2}
          onSolveDfir={handleSolveDfir}
          onSendAgencyRequest={handleSendAgencyRequest}
          onUpdateDecisionForm={handleUpdateDecisionForm}
          onRunJpkAudit={handleRunJpkAudit}
          onSendInterrogationQuestion={handleSendInterrogationQuestion}
          onOpenEthics={handleOpenEthics}
          onAnswerEthics={handleAnswerEthics}
          onCompleteStep4={handleCompleteStep4}
          onToggleProsecutorChecklist={handleToggleProsecutorChecklist}
          onSubmitToProsecutor={handleSubmitToProsecutor}
          onRemediateProsecutorIssues={handleRemediateProsecutorIssues}
          onProceedProsecutorWithRisk={handleProceedProsecutorWithRisk}
          onStartCourtHearing={handleStartCourtHearing}
          onSubmitCourtDefense={handleSubmitCourtDefense}
          onNavigate={handleNavigate}
          onSelectEngine={handleSetAiEngine}
        />
      )}

      {state.activeView === 'crime_scene_3d' && (
        <ThreeDSceneViewer
          fullViewport
          pinnedClues={state.pinnedClueIds}
          onTogglePinClue={handleToggleEvidenceClue}
          chainBroken={state.step1ChoiceId === 'informal_call'}
          investigatorName={state.studentName}
        />
      )}

      {state.activeView === 'leaderboard' && (
        <LeaderboardView
          state={state}
          metrics={metrics}
          onJoinDuel={handleJoinDuel}
          onRecordDuelVictory={handleRecordDuelVictory}
        />
      )}

      {state.activeView === 'presentation' && (
        <PresentationTabletView
          state={state}
          onNavigate={handleNavigate}
          onStartInvestigation={handleStartInvestigation}
        />
      )}

      {state.activeView === 'analytics' && (
        <InstructorAnalyticsView
          state={state}
          onAddCustomCase={handleAddCustomCase}
          onActivateCase={handleActivateCase}
        />
      )}
    </Layout>
  );
}

function ACTIVE_CASE_SUMMARY_TEXT(state: SimulationState): string {
  const meta = resolveActiveCaseMeta(state.activeCaseId, state.customCases);
  return `${meta.caseNumber} — ${meta.title} (${meta.shortCategory}). Gumonlanuvchi: ${meta.suspectName}. Pin qilingan dalillar soni: ${state.pinnedClueIds.length}.`;
}
