import React from 'react';
import { Activity, Cpu, HeartPulse, Zap, AlertTriangle } from 'lucide-react';

interface SuspectBiometricScannerProps {
  twistActive: boolean;
  alibiConfronted: boolean;
  questionsCount: number;
  lastTrafficLight: string | null;
  isSpeaking?: boolean;
}

const EQ_BAR_HEIGHTS = [38, 64, 30, 82, 96, 46, 72, 36, 62, 92, 52, 76, 42, 84, 58, 100, 68, 44, 88, 36];

export const SuspectBiometricScanner: React.FC<SuspectBiometricScannerProps> = ({
  twistActive,
  alibiConfronted,
  questionsCount,
  lastTrafficLight,
  isSpeaking = false,
}) => {
  // Normal questions stay in 40-50% (amber); alibi contradiction jumps to 88-95% (red pulse)
  const stressLevel = alibiConfronted
    ? 92
    : twistActive
      ? 68
      : Math.min(50, 42 + questionsCount * 2);

  const pulseRate = Math.round(74 + (stressLevel / 100) * 44);
  const isCriticalLieRisk = stressLevel >= 88;
  const truthProbability = alibiConfronted ? 11 : twistActive ? 46 : 74;

  return (
    <div
      className={`bg-[#091224] border rounded-2xl p-5 text-slate-100 shadow-xl relative overflow-hidden transition-colors ${
        isCriticalLieRisk ? 'border-red-500/70 shadow-red-950/50' : 'border-cyan-500/35'
      }`}
    >
      {/* Tactical Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`p-2 rounded-lg border shrink-0 ${
              isCriticalLieRisk
                ? 'bg-red-500/20 border-red-400/50 text-red-300'
                : 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-100 tracking-wide truncate">
              Jonli Poligraf va Stress Darajasi
            </h3>
            <p className="text-[11px] text-slate-300 truncate">
              Gumonlanuvchi ovozi va biometrik ko‘rsatkichlari tahlili
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-mono font-semibold whitespace-nowrap shrink-0 ${
            isCriticalLieRisk
              ? 'bg-red-500/20 border-red-400/60 text-red-200 animate-pulse'
              : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCriticalLieRisk ? 'bg-red-400' : 'bg-emerald-400'
            }`}
          />
          <span>{isCriticalLieRisk ? 'YOLG‘ON XAVFI' : 'JONLI TAHLIL'}</span>
        </span>
      </div>

      {/* Main Stress Gauge Bar */}
      <div className="relative z-10 bg-[#060C18] border border-slate-800 rounded-xl p-3.5 mb-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            {isCriticalLieRisk ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
            ) : (
              <Activity className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>
              {isCriticalLieRisk
                ? 'Yolg‘on ehtimoli yuqori!'
                : stressLevel >= 60
                  ? 'Zo‘riqish kuchaymoqda'
                  : 'O‘rtacha zo‘riqish (kuzatuvda)'}
            </span>
          </span>
          <span
            className={`font-mono text-base font-bold tabular-nums ${
              isCriticalLieRisk ? 'text-red-400' : 'text-amber-300'
            }`}
          >
            {stressLevel}%
          </span>
        </div>

        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCriticalLieRisk
                ? 'bg-gradient-to-r from-amber-500 via-red-500 to-red-400 animate-pulse'
                : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-amber-500'
            }`}
            style={{ width: `${stressLevel}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
          <span>0% (Xotirjam)</span>
          <span>45% (Sariq zona)</span>
          <span className={isCriticalLieRisk ? 'text-red-300 font-bold' : ''}>
            88–95% (Qizil: Yolg‘on)
          </span>
        </div>
      </div>

      {/* 2 Sub-Metrics: Pulse & Truth Probability */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mb-3.5">
        <div className="bg-[#060C18] border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-300">Yurak urishi</div>
            <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
              {pulseRate} <span className="text-[10px] text-red-300 font-normal">zarba/daq</span>
            </div>
          </div>
        </div>

        <div className="bg-[#060C18] border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-300">Rostgo‘ylik darajasi</div>
            <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
              {truthProbability}%{' '}
              <span className="text-[10px] text-cyan-300 font-normal">
                {alibiConfronted ? 'Fosh etildi' : 'Kuzatuv'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Audio Waveform Equalizer */}
      <div className="relative z-10 bg-[#060C18] border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-200 font-medium flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span>Ovoz to‘lqini (ekvalayzer)</span>
          </span>
          <span className="font-mono text-cyan-300 text-[10px]">
            {isSpeaking
              ? 'Ovozli javob faol...'
              : lastTrafficLight === 'green'
                ? 'Xolis savol (+)'
                : lastTrafficLight === 'red'
                  ? 'Bosim aniqlandi (-)'
                  : 'Tinglashga tayyor'}
          </span>
        </div>
        <div className="h-8 flex items-end justify-between gap-1 px-2 py-1 bg-slate-950/80 rounded-lg border border-slate-800">
          {EQ_BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-300 ${
                isSpeaking ? 'animate-eq-bar' : ''
              } ${
                isCriticalLieRisk
                  ? 'bg-gradient-to-t from-red-600 to-amber-400'
                  : 'bg-gradient-to-t from-cyan-500 to-emerald-400'
              }`}
              style={{
                height: `${Math.max(18, Math.round((h * Math.max(stressLevel, 55)) / 100))}%`,
                animationDelay: `${(i % 7) * 90}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
