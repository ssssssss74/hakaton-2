import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { STEP1_OPTIONS, resolveActiveCaseMeta } from '../../data/caseData';
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
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);

  return (
    <div className="space-y-6">
      {/* 102 Call Summary — Calm Mist-Sage Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card rounded-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#D7E4DF] via-[#E2EAE6] to-[#EAEFED] text-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#C0CEC8]">
          <div>
            <div className="text-[11px] font-mono font-semibold text-teal-800">
              1-bosqich · 102 Tezkor navbatchilik xabari · {activeCase.shortCategory}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {activeCase.title}
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-700 font-medium">
            {activeCase.caseNumber} · {activeCase.receivedDate} {activeCase.receivedTime}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3.5">
            <p className="text-sm text-slate-700 leading-relaxed">
              {activeCase.summary102}
            </p>
            <div className="bg-[#E9EEEC] border border-[#C8D4CE] rounded-xl p-4">
              <div className="text-xs font-semibold text-teal-900">
                Jabrlanuvchi / murojaat bayonoti ({activeCase.victimName})
              </div>
              <p className="mt-1.5 text-sm text-slate-800 italic leading-relaxed">
                {activeCase.victimStatement}
              </p>
            </div>
          </div>

          <div className="bg-[#E9EEEC] border border-[#C8D4CE] rounded-xl p-4 space-y-2.5 text-xs">
            <div className="font-bold text-slate-900 text-sm pb-2 border-b border-[#CAD6D0]">
              Navbatchilik qaydlari
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Hudud:</span>
              <span className="font-semibold text-right text-slate-900">{activeCase.district}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Aloqa raqami:</span>
              <span className="font-mono tabular-nums text-slate-900">{activeCase.victimPhone}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Zarar / Ob’ekt:</span>
              <span className="font-mono font-semibold text-red-700 tabular-nums text-right">
                {activeCase.damageAmount}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">Gumonlanuvchi:</span>
              <span className="font-semibold text-right text-slate-900">{activeCase.suspectName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">JPK muddati:</span>
              <span className="font-mono text-teal-800 font-semibold">329-modda nazorati</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decision Options with Staggered Smooth Motion */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card rounded-2xl p-6 space-y-4"
      >
        <div className="pb-3 border-b border-[#CFD8D4]">
          <h3 className="text-base font-bold text-slate-900">
            Dastlabki harakatingizni tanlang
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Tanlangan qaror protsessual muddat taymeriga ta’sir qiladi va «Xato narxi»
            jurnalida qayd etiladi.
          </p>
        </div>

        <div className="space-y-3">
          {STEP1_OPTIONS.map((opt, idx) => {
            const isSelected = state.step1ChoiceId === opt.id;
            const disabled = state.step1Completed;

            return (
              <motion.button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDecision(opt.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.24,
                  delay: 0.06 + idx * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={disabled ? undefined : { y: -2 }}
                whileTap={disabled ? undefined : { scale: 0.992 }}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  isSelected
                    ? opt.status === 'green'
                      ? 'bg-[#DDF0E8] border-teal-600 shadow-xs'
                      : opt.status === 'yellow'
                        ? 'bg-amber-50/90 border-amber-500 shadow-xs'
                        : 'bg-red-50/90 border-red-400 shadow-xs'
                    : disabled
                      ? 'bg-[#E9EEEC] border-[#CDD7D2] opacity-60 cursor-not-allowed'
                      : 'bg-[#F5F7F6] border-[#C6D1CC] hover:border-[#0F766E] hover:bg-[#E7F0EC] cursor-pointer'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">{opt.title}</div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-600 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>Vaqt sarfi: {opt.hoursSpent} soat</span>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {opt.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Immediate Feedback Panel with Smooth Spring Reveal */}
        <AnimatePresence>
          {chosenOption && (
            <motion.div
              key={chosenOption.id}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                chosenOption.status === 'green'
                  ? 'bg-[#DCF0E7] border-teal-500/60 text-teal-950'
                  : chosenOption.status === 'yellow'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-red-50/90 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {chosenOption.status === 'green' && (
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                )}
                {chosenOption.status === 'yellow' && (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                {chosenOption.status === 'red' && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
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

              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onNextStep}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <span>2-bosqich: Dalillar doskasi</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
