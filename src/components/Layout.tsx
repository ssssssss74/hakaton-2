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
    id: 'leaderboard',
    label: 'Reyting va Duel',
    sublabel: 'Talabalar jadvali',
    icon: Trophy,
  },
  {
    id: 'analytics',
    label: "O'qituvchi paneli",
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
    ? 'text-[#EF4444]'
    : metrics.hoursRemaining <= 20
      ? 'text-[#F59E0B]'
      : 'text-[#10B981]';

  const handleSelectNav = (view: NavView) => {
    onNavigate(view);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Persistent Deep Navy Top Header Bar */}
      <header className="sticky top-0 z-30 h-16 bg-[#0F172A] text-white border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Menyuni ochish"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => handleSelectNav('dashboard')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none"
          >
            <span className="w-8 h-8 rounded-lg bg-[#1D4ED8] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </span>
            <span className="text-base font-bold tracking-tight text-white">
              E-Tergov Lab | HMQA
            </span>
          </button>
        </div>

        {/* Center/Right Operational Strip */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          {/* Procedural Timer */}
          <div className="hidden sm:flex items-center gap-2 text-xs border-r border-slate-700 pr-4 lg:pr-6">
            <Clock className={`w-4 h-4 shrink-0 ${timerColor}`} />
            <div className="leading-tight">
              <div className="text-slate-400 whitespace-nowrap">Protsessual muddat taymeri</div>
              <div className={`font-mono font-semibold tabular-nums whitespace-nowrap ${timerColor}`}>
                {metrics.isOverdue
                  ? `Muddat o'tdi (+${Math.abs(metrics.hoursRemaining)} soat)`
                  : `Qoldi: ${metrics.hoursRemaining} / ${state.totalHoursBudget} soat`}
              </div>
            </div>
          </div>

          {/* Student Rank + Score */}
          <div className="hidden md:flex items-center gap-2.5 text-xs border-r border-slate-700 pr-4 lg:pr-6">
            <Award className="w-4 h-4 text-[#D97706] shrink-0" />
            <div className="leading-tight">
              <div className="text-[#F59E0B] font-semibold whitespace-nowrap">
                {metrics.rankTitle}
              </div>
              <div className="text-slate-300 font-mono tabular-nums whitespace-nowrap">
                Ball: {metrics.totalScore} · Etika: {state.ethicsIndex}%
              </div>
            </div>
          </div>

          {/* Reset Demo Button */}
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#1E293B] hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Demodan qayta boshlash</span>
            <span className="sm:hidden">Qayta boshlash</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#1E293B] text-slate-200 border-r border-slate-800">
          <div className="p-4 border-b border-slate-800/80">
            <div className="text-xs text-slate-400">Talaba profili</div>
            <div className="mt-1 text-sm font-semibold text-white truncate">
              {state.studentName}
            </div>
            <div className="mt-0.5 text-xs text-slate-400 font-mono tabular-nums">
              Guruh: {state.studentGroup} · Bosqich: {state.currentStep}/6
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1" aria-label="Asosiy menyu">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = state.activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium whitespace-nowrap truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Compact Case Progress Summary */}
          <div className="p-4 border-t border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Protsessual aniqlik</span>
              <span className="font-mono font-semibold tabular-nums text-white">
                {metrics.proceduralAccuracy}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-300"
                style={{ width: `${metrics.proceduralAccuracy}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-slate-400 pt-1">
              <span>Huquqni muhofaza qilish akademiyasi</span>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="relative z-50 w-72 max-w-[85vw] bg-[#1E293B] text-slate-100 flex flex-col h-full">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-sm">Navigatsiya</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded text-slate-300 hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 border-b border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-[#F59E0B]">{metrics.rankTitle}</div>
                <div className="font-mono text-slate-300 tabular-nums">
                  Ball: {metrics.totalScore} · Qoldi: {metrics.hoursRemaining} soat
                </div>
              </div>
              <nav className="p-3 space-y-1 flex-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = state.activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left ${
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
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Reset Demo Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-md w-full p-6 shadow-xl">
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
                className="px-4 py-2 text-sm font-medium text-white bg-[#EF4444] hover:bg-red-600 rounded-lg cursor-pointer"
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
