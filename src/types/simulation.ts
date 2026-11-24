export type NavView = 'dashboard' | 'investigation' | 'leaderboard' | 'analytics';

export type TrafficLight = 'green' | 'yellow' | 'red';

export type RankTitle =
  | 'Stajyor'
  | 'Tergovchi'
  | 'Katta tergovchi'
  | "O'ta muhim ishlar bo'yicha tergovchi";

export interface TimelineEvent {
  id: string;
  step: number;
  stepLabel: string;
  timestampSim: string;
  title: string;
  detail: string;
  status: TrafficLight;
  jpkRef: string;
  scoreDelta: number;
  hoursSpent: number;
  isViolation?: boolean;
}

export interface EvidenceClue {
  id: string;
  sourceTab: 'bank' | 'chat' | 'billing';
  sourceLabel: string;
  title: string;
  detail: string;
  isCritical: boolean;
  jpkNote: string;
}

export interface AgencyRequestDef {
  id: string;
  agency: string;
  shortTitle: string;
  description: string;
  hoursCost: number;
  responseCode: string;
  responseSummary: string;
  responseFacts: string[];
  recommended: boolean;
}

export interface DecisionFormState {
  jkArticle: string;
  jpkBasis: string;
  suspectStatus: string;
  mandatoryRequisites: string[];
  investigativeActions: string[];
  audited: boolean;
  auditPassed: boolean;
  auditIssues: string[];
}

export interface InterrogationMessage {
  id: string;
  role: 'investigator' | 'suspect' | 'system';
  text: string;
  timestamp: string;
  evaluation?: {
    trafficLight: TrafficLight;
    scoreDelta: number;
    coachTitle: string;
    coachExplanation: string;
    jpkReference: string;
  };
}

export interface EthicsChoiceState {
  answered: boolean;
  choiceId: string | null;
  lawful: boolean | null;
  explanation: string;
}

export interface ProsecutorReviewState {
  checklist: string[];
  submitted: boolean;
  status: 'pending' | 'approved' | 'warning' | 'rejected';
  flags: Array<{
    id: string;
    severity: 'red' | 'yellow';
    title: string;
    jpkRef: string;
    explanation: string;
    penaltyText: string;
  }>;
  remediated: boolean;
  proceededWithRisk: boolean;
}

export interface CourtSessionState {
  challengeLoaded: boolean;
  advocateArgument: string;
  targetPoint: string;
  jpkRef: string;
  studentDefense: string;
  verdictIssued: boolean;
  verdict: 'approved' | 'returned' | null;
  verdictTitle: string;
  judgeReasoning: string;
  improvementAdvice: string;
}

export interface CustomCase {
  id: string;
  caseNumber: string;
  title: string;
  category: string;
  summary102: string;
  difficulty: "Boshlang'ich" | "O'rta" | 'Murakkab';
  createdAt: string;
}

export interface StudentLeaderboardEntry {
  id: string;
  name: string;
  group: string;
  rankTitle: RankTitle;
  proceduralAccuracy: number;
  deadlineCompliance: number;
  evidenceStrength: number;
  cleanCourtRate: number;
  totalScore: number;
  casesCompleted: number;
  isCurrentUser?: boolean;
}

export interface SimulationState {
  studentName: string;
  studentGroup: string;
  activeView: NavView;
  currentStep: number;
  maxUnlockedStep: number;
  totalHoursBudget: number;
  hoursUsed: number;
  baseScore: number;
  ethicsIndex: number;
  step1ChoiceId: string | null;
  step1Completed: boolean;
  pinnedClueIds: string[];
  step2Completed: boolean;
  sentRequestIds: string[];
  decisionForm: DecisionFormState;
  step3Completed: boolean;
  interrogationMessages: InterrogationMessage[];
  twistTriggered: boolean;
  alibiConfronted: boolean;
  ethicsDilemmaOpen: boolean;
  ethicsState: EthicsChoiceState;
  step4Completed: boolean;
  prosecutorReview: ProsecutorReviewState;
  step5Completed: boolean;
  courtSession: CourtSessionState;
  step6Completed: boolean;
  timeline: TimelineEvent[];
  customCases: CustomCase[];
  duelJoined: boolean;
}

export interface ComputedMetrics {
  totalScore: number;
  rankTitle: RankTitle;
  proceduralAccuracy: number;
  deadlineCompliance: number;
  evidenceStrength: number;
  cleanCourtRate: number;
  hoursRemaining: number;
  isOverdue: boolean;
  redViolationsCount: number;
  yellowWarningsCount: number;
}
