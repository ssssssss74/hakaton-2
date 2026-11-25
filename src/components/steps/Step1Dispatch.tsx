import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Radio,
  MapPin,
  Volume2,
  VolumeX,
  PhoneCall,
  ShieldCheck,
  FileWarning,
  Ban,
} from 'lucide-react';
import { STEP1_OPTIONS, resolveActiveCaseMeta } from '../../data/caseData';
import { SimulationState } from '../../types/simulation';
import { VISUAL_ASSETS } from '../../assets/visuals';
import { speakUzbekText, stopSpeaking } from '../../utils/audioEffects';

interface Step1DispatchProps {
  state: SimulationState;
  onSelectDecision: (optionId: string) => void;
  onNextStep: () => void;
}

const WAVE_BARS = [24, 52, 78, 42, 92, 65, 35, 84, 58, 96, 48, 72, 38, 86, 62, 44, 74, 30];

export const Step1Dispatch: React.FC<Step1DispatchProps> = ({
  state,
  onSelectDecision,
  onNextStep,
}) => {
  const [isPlayingCall, setIsPlayingCall] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const chosenOption = STEP1_OPTIONS.find((o) => o.id === state.step1ChoiceId);
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleToggleCallAudio = () => {
    if (isPlayingCall) {
      stopSpeaking();
      setIsPlayingCall(false);
    } else {
      setIsPlayingCall(true);
      speakUzbekText(
        `102 tezkor xabari. ${activeCase.victimName}. ${activeCase.victimStatement}`,
        () => setIsPlayingCall(false)
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* VIRTUAL 102 DISPATCH COMMAND CENTER STAGE                           */}
      {/* =================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl overflow-hidden border border-[#1C4742] bg-[#0B2021] text-white shadow-lg"
      >
        {!heroImgFailed ? (
          <img
            src={VISUAL_ASSETS.dispatch102}
            alt="102 Virtual Navbatchilik Markazi"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B2021] via-[#103835] to-[#0F1E28]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081A1B]/95 via-[#0B2424]/85 to-[#0B2021]/65" />

        <div className="relative z-10 p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left 8 Cols: Live 102 Call & Interactive Audio Waveform */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>102 KIRUVCHI QO‘NG‘IROQ</span>
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-teal-200">{activeCase.caseNumber}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 tabular-nums">
                {activeCase.receivedDate} {activeCase.receivedTime}
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white leading-tight">
              {activeCase.title}
            </h2>

            {/* Live Audio Call Console */}
            <div className="rounded-xl bg-[#091819]/85 border border-teal-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 backdrop-blur-xs">
              <button
                type="button"
                onClick={handleToggleCallAudio}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  isPlayingCall
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-[#0F766E] hover:bg-[#149187] text-white'
                }`}
              >
                {isPlayingCall ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>To‘xtatish</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>102 ovozini eshitish</span>
                  </>
                )}
              </button>

              {/* Animated Waveform Bars */}
              <div className="flex-1 w-full space-y-1.5">
                <div className="flex items-end gap-1 h-8" aria-hidden="true">
                  {WAVE_BARS.map((h, i) => (
                    <motion.span
                      key={i}
                      animate={
                        isPlayingCall
                          ? { scaleY: [0.3, 1, 0.45, 0.9, 0.35] }
                          : { scaleY: 0.4 }
                      }
                      transition={{
                        duration: 0.9 + (i % 4) * 0.15,
                        repeat: isPlayingCall ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                      style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                      className={`flex-1 rounded-full ${
                        isPlayingCall ? 'bg-emerald-400' : 'bg-teal-600/60'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-teal-200/90">
                  <span className="inline-flex items-center gap-1.5">
                    <PhoneCall className="w-3 h-3" />
                    <span>{activeCase.victimName}</span>
                  </span>
                  <span className="tabular-nums">{activeCase.victimPhone}</span>
                </div>
              </div>
            </div>

            {/* Concise Caller Quote */}
            <p className="text-sm text-slate-200/95 italic leading-relaxed border-l-2 border-emerald-400/70 pl-4">
              {activeCase.victimStatement}
            </p>
          </div>

          {/* Right 4 Cols: Interactive SVG Sector Radar & Telemetry Strip */}
          <div className="lg:col-span-4 rounded-xl bg-[#071516]/85 border border-teal-500/30 p-4 space-y-3 backdrop-blur-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Radio className="w-3.5 h-3.5" />
                <span>HUDUDIY RADAR</span>
              </span>
              <span className="text-slate-400">GPS · 102</span>
            </div>

            {/* Animated SVG City Incident Radar */}
            <div className="relative h-36 rounded-lg overflow-hidden bg-[#061113] border border-teal-800/50 flex items-center justify-center">
              <svg viewBox="0 0 240 130" className="w-full h-full">
                {/* Grid lines */}
                <g stroke="#134E4A" strokeOpacity="0.45" strokeWidth="0.7">
                  <line x1="0" y1="32" x2="240" y2="32" />
                  <line x1="0" y1="65" x2="240" y2="65" />
                  <line x1="0" y1="98" x2="240" y2="98" />
                  <line x1="60" y1="0" x2="60" y2="130" />
                  <line x1="120" y1="0" x2="120" y2="130" />
                  <line x1="180" y1="0" x2="180" y2="130" />
                </g>
                {/* Concentric Radar Rings */}
                <circle cx="120" cy="65" r="22" fill="none" stroke="#14B8A6" strokeOpacity="0.35" strokeDasharray="3 3" />
                <circle cx="120" cy="65" r="44" fill="none" stroke="#14B8A6" strokeOpacity="0.22" />
                {/* Signal Links */}
                <path d="M52 92 Q86 72 120 65 T192 42" fill="none" stroke="#34D399" strokeWidth="1.4" strokeDasharray="4 3" />
                {/* Secondary Node (Suspect Signal) */}
                <circle cx="192" cy="42" r="4" fill="#F59E0B" />
                <text x="192" y="32" textAnchor="middle" fill="#FCD34D" fontSize="8" fontFamily="monospace">
                  IP / BS-104
                </text>
                {/* Primary Incident Pulse */}
                <circle cx="120" cy="65" r="14" fill="#EF4444" fillOpacity="0.22">
                  <animate attributeName="r" values="8;20;8" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.35;0.05;0.35" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="120" cy="65" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="120" y="84" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontFamily="monospace">
                  102 SIGNAL
                </text>
              </svg>
            </div>

            {/* Compact Telemetry Key-Values */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Hudud:
                </span>
                <span className="font-semibold text-right text-slate-100 truncate">
                  {activeCase.district}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Zarar / Ob’ekt:</span>
                <span className="font-mono font-semibold text-amber-300 tabular-nums text-right">
                  {activeCase.damageAmount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Gumonlanuvchi:</span>
                <span className="font-semibold text-right text-slate-100 truncate">
                  {activeCase.suspectName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-teal-800/60">
                <span className="text-slate-400">JPK muddati:</span>
                <span className="font-mono text-emerald-300 font-semibold">329-m · 72 soat</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =================================================================== */}
      {/* VISUAL TACTICAL DECISION CARDS                                      */}
      {/* =================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#CFD8D4]">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tezkor protsessual harakatni tanlang
            </h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Qaroringiz 72 soatlik taymerga va «Xato narxi» jurnaliga darhol ta’sir qiladi.
            </p>
          </div>
          <span className="font-mono text-[11px] font-semibold text-teal-900 bg-[#DCE7E3] border border-[#B2C7C0] px-2.5 py-1 rounded-lg">
            JPK 322 · 329-modda
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEP1_OPTIONS.map((opt, idx) => {
            const isSelected = state.step1ChoiceId === opt.id;
            const disabled = state.step1Completed;
            const Icon =
              opt.status === 'green'
                ? ShieldCheck
                : opt.status === 'yellow'
                  ? FileWarning
                  : Ban;

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
                  delay: 0.05 + idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={disabled ? undefined : { y: -3 }}
                whileTap={disabled ? undefined : { scale: 0.985 }}
                className={`text-left p-5 rounded-xl border flex flex-col justify-between gap-4 transition-colors ${
                  isSelected
                    ? opt.status === 'green'
                      ? 'bg-[#DDF0E8] border-teal-600 shadow-sm'
                      : opt.status === 'yellow'
                        ? 'bg-amber-50/95 border-amber-500 shadow-sm'
                        : 'bg-red-50/95 border-red-400 shadow-sm'
                    : disabled
                      ? 'bg-[#E9EEEC] border-[#CDD7D2] opacity-55 cursor-not-allowed'
                      : 'bg-[#F5F7F6] border-[#C6D1CC] hover:border-[#0F766E] hover:bg-[#E7F0EC] cursor-pointer'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isSelected && opt.status === 'green'
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : isSelected && opt.status === 'yellow'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : isSelected && opt.status === 'red'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-[#E5ECE9] text-teal-900 border-[#C0CFC9]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold tabular-nums text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      <span>{opt.hoursSpent} soat</span>
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 leading-snug">{opt.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                </div>

                <div className="pt-2 border-t border-[#CFD8D4] flex items-center justify-between text-[11px] font-semibold text-teal-800">
                  <span>{isSelected ? 'Tanlangan qaror' : 'Qarorni qabul qilish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Immediate Feedback Panel */}
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
                  <p className="text-xs leading-relaxed opacity-90">{chosenOption.feedback}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onNextStep}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <span>2-bosqich: 3D Joy va Dalillar</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
