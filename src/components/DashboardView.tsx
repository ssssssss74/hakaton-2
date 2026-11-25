import React from 'react';
import {
  ArrowRight,
  Clock,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  Presentation,
} from 'lucide-react';
import { ACTIVE_CASE, STEP_DEFINITIONS } from '../data/caseData';
import { ComputedMetrics, NavView, SimulationState } from '../types/simulation';

interface DashboardViewProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onStartInvestigation: (step?: number) => void;
  onNavigate: (view: NavView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  metrics,
  onStartInvestigation,
  onNavigate,
}) => {
  const completedSteps = [
    state.step1Completed,
    state.step2Completed,
    state.step3Completed,
    state.step4Completed,
    state.step5Completed,
    state.step6Completed,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Page Title & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <div className="text-xs font-medium text-slate-500">
            Huquqni muhofaza qilish akademiyasi · Virtual tergov laboratoriyasi
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            102 Navbatchilik qismi va Faol ish yurituvi
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onStartInvestigation(state.currentStep)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>
            {completedSteps === 0
              ? "Tergov ishini boshlash"
              : `${state.currentStep}-bosqichdan davom ettirish`}
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Presentation Pitch Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Taqdimot & Hakamlar Rejimi</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/30 text-blue-200">1 ta Planshetda</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              Butun platforma slaydlari va 2 daqiqalik nutq tezislari
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              6 bosqich, Dual AI, Antigravity va akademik ta'sirni interaktiv planshetda namoyish qiling.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('presentation')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Planshetni Ochish</span>
        </button>
      </div>

      {/* Primary Focal Anchor: Active 102 Dispatch Card */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono tabular-nums">
            <span className="font-semibold text-[#EF4444]">Shoshilinch 102 xabari</span>
            <span aria-hidden="true">·</span>
            <span>Ish raqami: {ACTIVE_CASE.caseNumber}</span>
            <span aria-hidden="true">·</span>
            <span>
              {ACTIVE_CASE.receivedDate}, {ACTIVE_CASE.receivedTime}
            </span>
          </div>
          <div className="text-xs font-medium text-slate-600">
            {ACTIVE_CASE.district}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] leading-snug">
              {ACTIVE_CASE.title}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ACTIVE_CASE.summary102}
            </p>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-600">
                Jabrlanuvchining 102 operatoriga bergan dastlabki bayonoti
              </div>
              <p className="mt-1.5 text-sm text-slate-800 italic leading-relaxed">
                {ACTIVE_CASE.victimStatement}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="text-xs font-semibold text-slate-500">Ish pasporti</div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Jabrlanuvchi:</dt>
                <dd className="font-medium text-right text-[#0F172A]">Karimov J.B.</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Moddiy zarar:</dt>
                <dd className="font-mono font-semibold text-[#EF4444] tabular-nums">
                  {ACTIVE_CASE.damageAmount}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Dastlabki toifa:</dt>
                <dd className="font-medium text-right text-[#0F172A]">JK 168 / 169-modda</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Muddat limiti:</dt>
                <dd className="font-mono font-medium tabular-nums text-[#0F172A]">
                  {ACTIVE_CASE.proceduralDeadlineHours} soat (JPK)
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Holati:</dt>
                <dd className="font-medium text-[#1D4ED8]">
                  {completedSteps}/6 bosqich yakunlangan
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Protsessual aniqlik</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.proceduralAccuracy}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            JPK normalariga muvofiqlik
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Muddatlarga rioya</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.deadlineCompliance}%
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            Sarflandi: {state.hoursUsed} soat
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Dalillar mustahkamligi</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.evidenceStrength}%
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            Doskada: {state.pinnedClueIds.length} ta dalil
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Sudga bexato o‘tish ulushi</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {metrics.cleanCourtRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Halollik indeksi: {state.ethicsIndex}%
          </div>
        </div>
      </section>

      {/* 6-Step Investigation Route Overview & Instructor Custom Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0F172A]">
              Tergov bosqichlari xaritasi (102 dan Sudgacha)
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {completedSteps} / 6 bajarildi
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {STEP_DEFINITIONS.map((step) => {
              const isCompleted =
                (step.id === 1 && state.step1Completed) ||
                (step.id === 2 && state.step2Completed) ||
                (step.id === 3 && state.step3Completed) ||
                (step.id === 4 && state.step4Completed) ||
                (step.id === 5 && state.step5Completed) ||
                (step.id === 6 && state.step6Completed);
              const isUnlocked = step.id <= state.maxUnlockedStep;

              return (
                <div
                  key={step.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-md text-xs font-mono font-semibold flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                          : isUnlocked
                            ? 'bg-blue-50 text-[#1D4ED8] border border-blue-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#0F172A] truncate">
                        {step.fullTitle}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isCompleted
                          ? 'Yakunlangan'
                          : isUnlocked
                            ? 'Bajarish uchun ochiq'
                            : 'Oldingi bosqichdan so‘ng ochiladi'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => onStartInvestigation(step.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                      isUnlocked
                        ? 'text-[#1D4ED8] hover:bg-blue-50 cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? "Ko'rish" : isUnlocked ? 'Kirish' : 'Yopiq'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F172A]">
                Akademiya kazuslar banki
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('analytics')}
                className="text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer"
              >
                Yangi kazus qo‘shish
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {state.customCases.map((c) => (
                <div key={c.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono tabular-nums">
                    <span>{c.caseNumber}</span>
                    <span>{c.difficulty}</span>
                  </div>
                  <div className="text-sm font-semibold text-[#0F172A] leading-snug">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {c.summary102}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#1D4ED8]" />
              <span>Xato narxi tizimi faol</span>
            </span>
            {metrics.redViolationsCount > 0 ? (
              <span className="inline-flex items-center gap-1 font-medium text-[#EF4444]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{metrics.redViolationsCount} ta qizil xato</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-[#10B981]">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Buzilishlar yo‘q</span>
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
