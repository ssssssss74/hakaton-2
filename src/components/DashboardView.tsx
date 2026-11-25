import React, { useState } from 'react';
import {
  ArrowRight,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Presentation,
  Box,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { STEP_DEFINITIONS, resolveActiveCaseMeta } from '../data/caseData';
import { ComputedMetrics, NavView, SimulationState } from '../types/simulation';
import { VISUAL_ASSETS } from '../assets/visuals';

interface DashboardViewProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onStartInvestigation: (step?: number) => void;
  onNavigate: (view: NavView) => void;
  onActivateCase: (caseId: string, navigateToInvestigation?: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  metrics,
  onStartInvestigation,
  onNavigate,
  onActivateCase,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [sceneImgFailed, setSceneImgFailed] = useState(false);
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);

  const completedSteps = [
    state.step1Completed,
    state.step2Completed,
    state.step3Completed,
    state.step4Completed,
    state.step5Completed,
    state.step6Completed,
  ].filter(Boolean).length;

  const kpiCards = [
    {
      label: 'Protsessual aniqlik',
      value: `${metrics.proceduralAccuracy}%`,
      percent: metrics.proceduralAccuracy,
      sub: 'JPK normalariga muvofiqlik',
      barColor: 'bg-[#1D4ED8]',
      textColor: 'text-[#0F172A]',
    },
    {
      label: 'Muddatlarga rioya',
      value: `${metrics.deadlineCompliance}%`,
      percent: metrics.deadlineCompliance,
      sub: `Sarflandi: ${state.hoursUsed} / ${state.totalHoursBudget} soat`,
      barColor: metrics.isOverdue ? 'bg-[#DC2626]' : 'bg-[#059669]',
      textColor: metrics.isOverdue ? 'text-[#DC2626]' : 'text-[#0F172A]',
    },
    {
      label: 'Dalillar mustahkamligi',
      value: `${metrics.evidenceStrength}%`,
      percent: metrics.evidenceStrength,
      sub: `Doskada: ${state.pinnedClueIds.length} ta dalil`,
      barColor: 'bg-[#D97706]',
      textColor: 'text-[#0F172A]',
    },
    {
      label: 'Sudga bexato o‘tish ulushi',
      value: `${metrics.cleanCourtRate}%`,
      percent: metrics.cleanCourtRate,
      sub: `Halollik indeksi: ${state.ethicsIndex}%`,
      barColor: 'bg-[#0F172A]',
      textColor: 'text-[#1D4ED8]',
    },
  ];

  return (
    <div className="space-y-7">
      {/* Editorial Forensic Command Hero Banner (Single Dominant Focal Anchor) */}
      <section className="relative rounded-2xl overflow-hidden bg-[#0B1221] text-white border border-slate-800 shadow-lg">
        {!heroImgFailed ? (
          <img
            src={VISUAL_ASSETS.forensicCommand}
            alt="Huquqni muhofaza qilish akademiyasi tergov markazi"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1221] via-[#132242] to-[#1E293B]" />
        )}
        {/* Measured Contrast Scrim (>= 4.5:1 text legibility) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221]/95 via-[#0B1221]/82 to-[#0B1221]/45" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300/95 font-medium">
              <span>Huquqni muhofaza qilish akademiyasi</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-slate-300">Virtual tergov laboratoriyasi</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="font-mono text-slate-300 tabular-nums">{activeCase.caseNumber}</span>
              {!activeCase.isDefaultCase && (
                <button
                  type="button"
                  onClick={() => onActivateCase('case-168', false)}
                  className="ml-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-[11px] text-amber-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Asosiy kazusga qaytish</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              102 Navbatchilik qismi va Faol ish yurituvi
            </h1>

            <p className="text-sm text-slate-200/90 leading-relaxed max-w-xl">
              102 tezkor xabaridan boshlab 3D hodisa joyini ko‘zdan kechirish, raqamli dalillar tahlili,
              AI-so‘roq va virtual sud hukmigacha bo‘lgan yaxlit jinoyat-protsessual poligon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onStartInvestigation(state.currentStep)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-600 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <span>
                {completedSteps === 0
                  ? 'Tergov ishini boshlash'
                  : `${state.currentStep}-bosqichdan davom ettirish`}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('presentation')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-200 bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer backdrop-blur-xs"
            >
              <Presentation className="w-4 h-4 shrink-0" />
              <span>Taqdimot Plansheti</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Column Executive KPI Strip with Visual Meters */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="surface-card rounded-xl p-5 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
              <span className={`text-xl font-bold font-mono tabular-nums ${kpi.textColor}`}>
                {kpi.value}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${kpi.barColor}`}
                  style={{ width: `${Math.max(4, Math.min(100, kpi.percent))}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                {kpi.sub}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Active 102 Dispatch Dossier + 3D Forensic Room Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Active 102 Dispatch Card */}
        <section className="lg:col-span-8 surface-card rounded-2xl p-6 lg:p-7 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-mono tabular-nums">
                <span className="font-semibold text-[#DC2626]">Shoshilinch 102 xabari</span>
                <span aria-hidden="true">·</span>
                <span>Ish: {activeCase.caseNumber}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {activeCase.receivedDate}, {activeCase.receivedTime}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-500">
                {activeCase.district}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0F172A] leading-snug">
                {activeCase.title}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeCase.summary102}
              </p>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-500">
                  Jabrlanuvchi / murojaat qiluvchining 102 operatoriga bergan dastlabki bayonoti
                </div>
                <p className="mt-1.5 text-sm text-slate-800 italic leading-relaxed">
                  {activeCase.victimStatement}
                </p>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <dt className="text-slate-500">Jabrlanuvchi</dt>
              <dd className="mt-1 font-semibold text-[#0F172A]">{activeCase.victimName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Zarar / Ob’ekt</dt>
              <dd className="mt-1 font-mono font-semibold text-[#DC2626] tabular-nums">
                {activeCase.damageAmount}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Dastlabki toifa</dt>
              <dd className="mt-1 font-semibold text-[#0F172A]">{activeCase.shortCategory}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Protsessual holat</dt>
              <dd className="mt-1 font-semibold text-[#1D4ED8] font-mono tabular-nums">
                {completedSteps} / 6 bosqich
              </dd>
            </div>
          </dl>
        </section>

        {/* Right: 3D Crime Scene Visual Spotlight */}
        <section className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-[#0B1221] text-white border border-slate-800 flex flex-col justify-end min-h-[300px] shadow-md group">
          {!sceneImgFailed ? (
            <img
              src={VISUAL_ASSETS.crimeSceneLab}
              alt="3D hodisa joyi kriminalistika stoli va dalil raqamlari"
              referrerPolicy="no-referrer"
              onError={() => setSceneImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/75 to-transparent" />

          <div className="relative z-10 p-6 space-y-3">
            <div className="text-xs font-mono text-amber-300">
              Interaktiv WebGL · 5 ta sud ekspertizasi
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              3D Hodisa joyini ko‘zdan kechirish
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              W, A, S, D tugmalari bilan xona bo‘ylab erkin yuring, <span className="font-mono text-amber-200">3D xona</span> muhitida 5 ta dalilni fonar bilan tekshiring va rasmiy ekspertiza xulosasini oching.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('crime_scene_3d')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0B1221] bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4 shrink-0" />
              <span>3D Xonaga kirish</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </section>
      </div>

      {/* 6-Step Investigation Route Map & Academy Case Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-7 surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Tergov bosqichlari xaritasi (102 dan Sudgacha)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Barcha 6 bosqich erkin ko‘rish va taqdimot uchun ochiq
              </p>
            </div>
            <span className="text-xs font-mono font-semibold tabular-nums text-[#1D4ED8]">
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
              const isCurrent = step.id === state.currentStep;

              return (
                <div
                  key={step.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                          : isCurrent
                            ? 'bg-[#1D4ED8] text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0F172A] truncate">
                        {step.fullTitle}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isCompleted
                          ? 'Yakunlangan'
                          : isCurrent
                            ? 'Joriy faol bosqich'
                            : 'Kirish uchun ochiq'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartInvestigation(step.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#1D4ED8] hover:bg-blue-50 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    <span>{isCompleted ? 'Ko‘rish' : 'Kirish'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-5 surface-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Akademiya kazuslar banki
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  O‘quv mashg‘ulotlari uchun tasdiqlangan ishlar
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap cursor-pointer"
              >
                + Yangi kazus
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {state.customCases.map((c) => {
                const isSelectedCase = activeCase.id === c.id;
                return (
                  <div key={c.id} className="py-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono tabular-nums">
                      <span className="font-semibold text-[#1D4ED8]">{c.caseNumber}</span>
                      <span>{c.difficulty}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#0F172A] leading-snug">
                      {c.title}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {c.summary102}
                    </div>
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {c.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => onActivateCase(c.id, true)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isSelectedCase
                            ? 'bg-emerald-50 text-[#059669] border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-blue-50 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white'
                        }`}
                      >
                        <span>{isSelectedCase ? 'Faol — davom etish →' : 'Tergovga olish →'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Scale className="w-4 h-4 text-[#1D4ED8]" />
              <span>Xato narxi tizimi faol</span>
            </span>
            {metrics.redViolationsCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#DC2626]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{metrics.redViolationsCount} ta qizil xato</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#059669]">
                <ShieldCheck className="w-4 h-4" />
                <span>Buzilishlar yo‘q</span>
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
