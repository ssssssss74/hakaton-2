import React, { useState } from 'react';
import {
  Shield,
  Clock,
  Award,
  RotateCcw,
  Radio,
  Briefcase,
  Trophy,
  BarChart3,
  Menu,
  X,
  Presentation,
  Box,
  ChevronRight,
} from 'lucide-react';
import { ComputedMetrics, NavView, SimulationState } from '../types/simulation';

interface LayoutProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onNavigate: (view: NavView) => void;
  onResetDemo: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{
  id: NavView;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'dashboard',
    label: '102 Navbatchilik',
    sublabel: 'Bosh sahifa va faol ish',
    icon: Radio,
  },
  {
    id: 'investigation',
    label: 'Tergov jarayoni',
    sublabel: '102 → Sud (6 bosqich)',
    icon: Briefcase,
  },
  {
    id: 'crime_scene_3d',
    label: '3D Hodisa joyi',
    sublabel: 'WASD virtual ko‘zdan kechirish',
    icon: Box,
  },
  {
    id: 'presentation',
    label: 'Taqdimot Plansheti',
    sublabel: 'Statistika va 3 daqiqalik demo',
    icon: Presentation,
  },
  {
    id: 'leaderboard',
    label: 'Reyting va Duel',
    sublabel: 'Talabalar jadvali',
    icon: Trophy,
  },
  {
    id: 'analytics',
    label: 'O‘qituvchi paneli',
    sublabel: 'Tahlil va kazus yaratish',
    icon: BarChart3,
  },
];

export const Layout: React.FC<LayoutProps> = ({
  state,
  metrics,
  onNavigate,
  onResetDemo,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const timerColor = metrics.isOverdue
    ? 'text-red-400'
    : metrics.hoursRemaining <= 20
      ? 'text-amber-400'
      : 'text-emerald-400';

  const hoursPercent = Math.max(
    0,
    Math.min(100, Math.round((metrics.hoursRemaining / state.totalHoursBudget) * 100))
  );

  const completedStepsCount = [
    state.step1Completed,
    state.step2Completed,
    state.step3Completed,
    state.step4Completed,
    state.step5Completed,
    state.step6Completed,
  ].filter(Boolean).length;

  const handleSelectNav = (view: NavView) => {
    onNavigate(view);
    setMobileNavOpen(false);
  };

  const TELEMETRY_NODES = [
    { label: 'E-Tergov API: Faol', tone: 'bg-emerald-400' },
    { label: 'IIV Daktilo-Baza: Ulangan', tone: 'bg-emerald-400' },
    { label: 'Markaziy Bank Antifrod: Sinxron', tone: 'bg-cyan-400' },
    { label: 'Lex.uz JK/JPK: 2026', tone: 'bg-emerald-400' },
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-100 overflow-x-hidden">
      {/* Cyber-Forensics Neon Top Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 shrink-0 no-print" />

      {/* Persistent Cyber-Forensics Command Center Header */}
      <header className="no-print sticky top-0 z-30 bg-[#070E1C]/92 backdrop-blur-md text-slate-100 border-b border-cyan-500/20 shadow-lg shadow-slate-950/50">
        {/* Top Row: Brand + Operational Controls */}
        <div className="min-h-[60px] px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-3">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              aria-label="Menyuni ochish"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('dashboard')}
              className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none group"
            >
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/25 via-blue-600/40 to-emerald-500/25 border border-cyan-400/45 flex items-center justify-center shrink-0 shadow-sm group-hover:border-emerald-400 transition-colors">
                <Shield className="w-4 h-4 text-cyan-300" />
              </span>
              <div className="leading-tight">
                <div className="text-sm sm:text-base font-bold tracking-tight text-slate-100">
                  E-Tergov Lab · HMQA
                </div>
                <div className="text-[10px] font-mono text-cyan-300/90 hidden sm:block">
                  Kiber-Kriminalistika Boshqaruv Markazi
                </div>
              </div>
            </button>
          </div>

          {/* Right: Operational Telemetry & Controls */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Procedural Timer */}
            <div className="hidden sm:flex items-center gap-2.5 text-xs border-r border-slate-800 pr-3 lg:pr-4">
              <Clock className={`w-4 h-4 shrink-0 ${timerColor}`} />
              <div className="leading-tight space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-300 whitespace-nowrap">Protsessual muddat</span>
                  <span className={`font-mono font-semibold tabular-nums whitespace-nowrap ${timerColor}`}>
                    {metrics.isOverdue
                      ? `+${Math.abs(metrics.hoursRemaining)} soat o‘tdi`
                      : `${metrics.hoursRemaining}/${state.totalHoursBudget} soat`}
                  </span>
                </div>
                <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metrics.isOverdue
                        ? 'bg-red-500'
                        : metrics.hoursRemaining <= 20
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                    style={{ width: `${metrics.isOverdue ? 100 : hoursPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Student Rank + Score */}
            <div className="hidden md:flex items-center gap-2.5 text-xs border-r border-slate-800 pr-3 lg:pr-4">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="leading-tight">
                <div className="text-amber-300 font-semibold whitespace-nowrap">
                  {metrics.rankTitle}
                </div>
                <div className="text-slate-200 font-mono tabular-nums whitespace-nowrap">
                  Ball: {metrics.totalScore} · Etika: {state.ethicsIndex}%
                </div>
              </div>
            </div>

            {/* Presentation Tablet Button */}
            <button
              type="button"
              onClick={() => handleSelectNav('presentation')}
              className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                state.activeView === 'presentation'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-300 shadow-md shadow-amber-500/20'
                  : 'text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Taqdimot Plansheti</span>
              <span className="sm:hidden">Planshet</span>
            </button>

            {/* Reset Demo Button */}
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">Qayta boshlash</span>
            </button>
          </div>
        </div>

        {/* Live Simulator Telemetry Strip */}
        <div className="bg-[#050A14]/90 border-t border-cyan-500/15 px-3 sm:px-4 lg:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {TELEMETRY_NODES.map((node) => (
              <span key={node.label} className="inline-flex items-center gap-1.5 text-slate-200 whitespace-nowrap">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${node.tone} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${node.tone}`} />
                </span>
                <span>{node.label}</span>
              </span>
            ))}
          </div>
          <span className="text-cyan-300 hidden xl:inline whitespace-nowrap">
            HMQA «Kiberxavfsizlikni huquqiy ta’minlash» · Jonli himoya tizimi
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Executive Left Sidebar Navigation (Desktop) */}
        <aside className="no-print hidden lg:flex w-64 shrink-0 flex-col bg-[#0A1324]/95 backdrop-blur-md text-slate-200 border-r border-cyan-500/20">
          {/* Cadet Identity Card */}
          <div className="p-4 border-b border-cyan-500/15 bg-[#070E1C]/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-display font-bold text-xs text-amber-300 shrink-0">
                {state.studentName
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-100 truncate">
                  {state.studentName}
                </div>
                <div className="text-[11px] text-slate-300 font-mono tabular-nums truncate">
                  {state.studentGroup} · {state.currentStep}/6-bosqich
                </div>
              </div>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 p-3 space-y-1" aria-label="Asosiy menyu">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = state.activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNav(item.id)}
                  className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1D4ED8] to-cyan-700/90 border-cyan-400/50 text-white shadow-md shadow-cyan-950/50'
                      : 'border-transparent text-slate-200 hover:bg-slate-800/70 hover:border-cyan-500/20 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-cyan-200'
                        : item.id === 'presentation'
                          ? 'text-amber-400'
                          : 'text-slate-300 group-hover:text-cyan-300'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium whitespace-nowrap truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive ? 'text-cyan-100' : 'text-slate-300'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-200 shrink-0" />}
                </button>
              );
            })}
          </nav>

          {/* Compact Case Progress Summary */}
          <div className="p-4 border-t border-cyan-500/15 bg-[#070E1C]/80 text-xs space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-200">
                <span>Protsessual aniqlik</span>
                <span className="font-mono font-semibold tabular-nums text-cyan-300">
                  {metrics.proceduralAccuracy}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${metrics.proceduralAccuracy}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono tabular-nums pt-1 border-t border-slate-800/80">
              <span>Yakunlandi</span>
              <span className="text-slate-100">{completedStepsCount} / 6 bosqich</span>
            </div>
            <div className="text-[11px] text-slate-300 leading-snug">
              Huquqni muhofaza qilish akademiyasi
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="relative z-50 w-72 max-w-[85vw] bg-[#0E172A] text-slate-100 flex flex-col h-full border-r border-slate-800">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-sm">Navigatsiya</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 border-b border-slate-800 text-xs space-y-1 bg-[#0B1221]/60">
                <div className="font-semibold text-amber-300">{metrics.rankTitle}</div>
                <div className="font-mono text-slate-300 tabular-nums">
                  Ball: {metrics.totalScore} · Qoldi: {metrics.hoursRemaining} soat
                </div>
              </div>
              <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = state.activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#1D4ED8] text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.sublabel}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content Viewport */}
        <main
          className={
            state.activeView === 'crime_scene_3d'
              ? 'flex-1 min-w-0 p-3 sm:p-4 lg:p-6 w-full'
              : state.activeView === 'presentation'
                ? 'flex-1 min-w-0 p-3 sm:p-5 lg:p-6 max-w-[1440px] mx-auto w-full'
                : 'flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1320px] mx-auto w-full'
          }
        >
          {children}
        </main>
      </div>

      {/* Reset Demo Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Simulyatsiyani qayta boshlaysizmi?
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Barcha saqlangan tergov bosqichlari, protsessual ballar, so‘roq tarixi va
              vaqt ko‘rsatkichlari tozalanadi hamda kazus 102 xabaridan boshlab qayta
              tiklanadi.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Ha, qayta boshlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
