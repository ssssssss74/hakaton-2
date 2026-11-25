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
import { PWAInstallButton, OfflineIndicator } from './PWAInstallButton';
import { EPoligonLogo } from './EPoligonLogo';

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
    ? 'text-red-700'
    : metrics.hoursRemaining <= 20
      ? 'text-amber-700'
      : 'text-teal-800';

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
    { label: 'E-Tergov API: Faol', tone: 'bg-teal-600' },
    { label: 'IIV Daktilo-Baza: Ulangan', tone: 'bg-emerald-600' },
    { label: 'Markaziy Bank Antifrod: Sinxron', tone: 'bg-cyan-700' },
    { label: 'Lex.uz JK/JPK: 2026', tone: 'bg-teal-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-800 overflow-x-hidden bg-[#E3E7E5]">
      {/* Calm Teal-Sage Top Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-teal-700 via-emerald-600 to-slate-500 shrink-0 no-print" />

      {/* Soft Matte Neutral-Gray Header */}
      <header className="no-print sticky top-0 z-30 bg-[#ECEFEB]/95 backdrop-blur-md text-slate-800 border-b border-[#C6D1CC] shadow-xs">
        {/* Top Row: Brand + Operational Controls */}
        <div className="min-h-[60px] px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-3">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-[#DFE6E3] hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
              aria-label="Menyuni ochish"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => handleSelectNav('dashboard')}
              className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none group"
            >
              <EPoligonLogo size="sm" className="group-hover:border-teal-700 transition-colors" />
              <div className="leading-tight">
                <div className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                  E-Poligon · HMQA
                </div>
                <div className="text-[10px] font-mono text-teal-800 hidden sm:block">
                  Kiber-Kriminalistika Boshqaruv Markazi
                </div>
              </div>
            </button>
          </div>

          {/* Right: Operational Telemetry & Controls */}
          <div className="flex items-center gap-2.5 lg:gap-3.5 shrink-0">
            {/* Procedural Timer */}
            <div className="hidden sm:flex items-center gap-2.5 text-xs border-r border-[#C6D1CC] pr-3 lg:pr-4">
              <Clock className={`w-4 h-4 shrink-0 ${timerColor}`} />
              <div className="leading-tight space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600 whitespace-nowrap">Protsessual muddat</span>
                  <span className={`font-mono font-semibold tabular-nums whitespace-nowrap ${timerColor}`}>
                    {metrics.isOverdue
                      ? `+${Math.abs(metrics.hoursRemaining)} soat o‘tdi`
                      : `${metrics.hoursRemaining}/${state.totalHoursBudget} soat`}
                  </span>
                </div>
                <div className="h-1.5 w-32 bg-[#D3DBD7] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metrics.isOverdue
                        ? 'bg-red-600'
                        : metrics.hoursRemaining <= 20
                          ? 'bg-amber-600'
                          : 'bg-teal-700'
                    }`}
                    style={{ width: `${metrics.isOverdue ? 100 : hoursPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Student Rank + Score */}
            <div className="hidden md:flex items-center gap-2.5 text-xs border-r border-[#C6D1CC] pr-3 lg:pr-4">
              <Award className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="leading-tight">
                <div className="text-amber-800 font-semibold whitespace-nowrap">
                  {metrics.rankTitle}
                </div>
                <div className="text-slate-600 font-mono tabular-nums whitespace-nowrap">
                  Ball: {metrics.totalScore} · Etika: {state.ethicsIndex}%
                </div>
              </div>
            </div>

            {/* In-App PWA Local Install Button */}
            <PWAInstallButton />

            {/* Presentation Tablet Button */}
            <button
              type="button"
              onClick={() => handleSelectNav('presentation')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 shadow-xs ${
                state.activeView === 'presentation'
                  ? 'bg-[#0F766E] text-white border border-teal-800 shadow-sm'
                  : 'text-teal-900 bg-[#DCE7E3] hover:bg-[#CEE0DA] border border-[#AFC6BE]'
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
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 bg-[#F2F4F3] hover:bg-[#E4E9E7] border border-[#C6D1CC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">Qayta boshlash</span>
            </button>
          </div>
        </div>

        {/* Live Simulator Telemetry Strip */}
        <div className="bg-[#E1E7E4] border-t border-[#C6D1CC] px-3 sm:px-4 lg:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-700">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {TELEMETRY_NODES.map((node) => (
              <span key={node.label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${node.tone} opacity-60`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${node.tone}`} />
                </span>
                <span>{node.label}</span>
              </span>
            ))}
          </div>
          <span className="text-teal-900 hidden xl:inline whitespace-nowrap font-semibold">
            HMQA «Kiberxavfsizlikni huquqiy ta’minlash» · Lokal & Bulutli himoya tizimi
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Soft Matte Gray Sidebar Navigation (Desktop) */}
        <aside className="no-print hidden lg:flex w-64 shrink-0 flex-col bg-[#ECEFEB] border-r border-[#C6D1CC]">
          {/* Cadet Identity Card */}
          <div className="p-4 border-b border-[#D0D9D5] bg-[#E4EAE7]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D3E2DC] border border-[#A8C2B8] flex items-center justify-center font-display font-bold text-xs text-teal-900 shrink-0">
                {state.studentName
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {state.studentName}
                </div>
                <div className="text-[11px] text-slate-600 font-mono tabular-nums truncate">
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
                      ? 'bg-[#0F766E] border-teal-800 text-white shadow-xs'
                      : 'border-transparent text-slate-700 hover:bg-[#DFE6E3] hover:text-slate-950'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-teal-100'
                        : item.id === 'presentation'
                          ? 'text-amber-700'
                          : 'text-slate-500 group-hover:text-teal-800'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium whitespace-nowrap truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive ? 'text-teal-100/90' : 'text-slate-500'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-100 shrink-0" />}
                </button>
              );
            })}
          </nav>

          {/* Compact Case Progress Summary */}
          <div className="p-4 border-t border-[#D0D9D5] bg-[#E4EAE7] text-xs space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span>Protsessual aniqlik</span>
                <span className="font-mono font-semibold tabular-nums text-teal-800">
                  {metrics.proceduralAccuracy}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#CED7D3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-700 to-emerald-600 transition-all duration-300"
                  style={{ width: `${metrics.proceduralAccuracy}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono tabular-nums pt-1 border-t border-[#CBD5D0]">
              <span>Yakunlandi</span>
              <span className="text-slate-900 font-semibold">{completedStepsCount} / 6 bosqich</span>
            </div>
            <div className="text-[11px] text-slate-600 leading-snug">
              Huquqni muhofaza qilish akademiyasi
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="relative z-50 w-72 max-w-[85vw] bg-[#ECEFEB] text-slate-900 flex flex-col h-full border-r border-[#C6D1CC]">
              <div className="p-4 border-b border-[#D0D9D5] flex items-center justify-between bg-[#E4EAE7]">
                <span className="font-semibold text-sm">Navigatsiya</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded text-slate-700 hover:bg-[#D5DFDB] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 border-b border-[#D0D9D5] text-xs space-y-1 bg-[#E7ECEA]">
                <div className="font-semibold text-amber-800">{metrics.rankTitle}</div>
                <div className="font-mono text-slate-600 tabular-nums">
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
                          ? 'bg-[#0F766E] text-white'
                          : 'text-slate-700 hover:bg-[#DFE6E3]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-teal-100' : 'text-slate-500'}`}>
                          {item.sublabel}
                        </div>
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

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Reset Demo Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F2F4F3] border border-[#C6D1CC] rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
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
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-[#E6EAE8] border border-[#C6D1CC] rounded-lg hover:bg-[#DAE1DE] cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg cursor-pointer"
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
