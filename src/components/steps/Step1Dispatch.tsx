import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { ACTIVE_CASE, STEP1_OPTIONS } from '../../data/caseData';
import { SimulationState } from '../../types/simulation';

interface Step1DispatchProps {
  state: SimulationState;
  onSelectDecision: (optionId: string) => void;
  onNextStep: () => void;
}

export const Step1Dispatch: React.FC<Step1DispatchProps> = ({
  state,
  onSelectDecision,
  onNextStep,
}) => {
  const chosenOption = STEP1_OPTIONS.find((o) => o.id === state.step1ChoiceId);

  return (
    <div className="space-y-6">
      {/* 102 Call Summary */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="bg-[#0B1221] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono text-amber-300">
              1-bosqich · 102 Tezkor navbatchilik xabari
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              102 Xabari va Dastlabki protsessual qaror
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-300">
            {ACTIVE_CASE.caseNumber} · {ACTIVE_CASE.receivedDate} {ACTIVE_CASE.receivedTime}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3.5">
            <p className="text-sm text-slate-700 leading-relaxed">
              {ACTIVE_CASE.summary102}
            </p>
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-500">
                Jabrlanuvchi bayonoti ({ACTIVE_CASE.victimName})
              </div>
              <p className="mt-1.5 text-sm text-slate-800 italic leading-relaxed">
                {ACTIVE_CASE.victimStatement}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="font-bold text-[#0F172A] text-sm pb-2 border-b border-slate-200/80">
              Navbatchilik qaydlari
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Hudud:</span>
              <span className="font-semibold text-right text-[#0F172A]">Chilonzor IIO FMB</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Aloqa raqami:</span>
              <span className="font-mono tabular-nums text-[#0F172A]">{ACTIVE_CASE.victimPhone}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Zarar summasi:</span>
              <span className="font-mono font-semibold text-[#DC2626] tabular-nums">
                {ACTIVE_CASE.damageAmount}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">JPK muddati:</span>
              <span className="font-mono text-[#1D4ED8] font-medium">329-modda nazorati</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Options */}
      <div className="surface-card rounded-2xl p-6 space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#0F172A]">
            Dastlabki harakatingizni tanlang
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Tanlangan qaror protsessual muddat taymeriga ta’sir qiladi va «Xato narxi»
            jurnalida qayd etiladi.
          </p>
        </div>

        <div className="space-y-3">
          {STEP1_OPTIONS.map((opt) => {
            const isSelected = state.step1ChoiceId === opt.id;
            const disabled = state.step1Completed;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDecision(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? opt.status === 'green'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                      : opt.status === 'yellow'
                        ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                        : 'bg-red-50/70 border-red-400 shadow-xs'
                    : disabled
                      ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-[#1D4ED8] hover:bg-blue-50/30 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-[#0F172A]">{opt.title}</div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Vaqt sarfi: {opt.hoursSpent} soat</span>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Panel */}
        {chosenOption && (
          <div
            className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              chosenOption.status === 'green'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : chosenOption.status === 'yellow'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-red-50 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {chosenOption.status === 'green' && (
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              )}
              {chosenOption.status === 'yellow' && (
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              )}
              {chosenOption.status === 'red' && (
                <XCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="text-sm font-semibold">
                  {chosenOption.jpkRef} ·{' '}
                  {chosenOption.scoreDelta >= 0
                    ? `+${chosenOption.scoreDelta} ball`
                    : `${chosenOption.scoreDelta} ball`}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {chosenOption.feedback}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNextStep}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>2-bosqich: Dalillar doskasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
