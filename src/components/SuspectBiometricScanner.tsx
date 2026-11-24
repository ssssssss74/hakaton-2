import React from 'react';
import { Activity, ShieldAlert, Cpu, HeartPulse, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SuspectBiometricScannerProps {
  twistActive: boolean;
  alibiConfronted: boolean;
  questionsCount: number;
  lastTrafficLight: string | null;
}

export const SuspectBiometricScanner: React.FC<SuspectBiometricScannerProps> = ({
  twistActive,
  alibiConfronted,
  questionsCount,
  lastTrafficLight,
}) => {
  // Determine dynamic stress score based on investigation progress
  const baseStress = 35 + questionsCount * 8;
  const stressLevel = alibiConfronted ? 92 : twistActive ? Math.min(85, baseStress + 25) : Math.min(65, baseStress);
  const pulseRate = Math.round(72 + (stressLevel / 100) * 45);

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 text-slate-100 shadow-xl relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Biometrik & Psixologik Monitoring (AI-Polygraph)
            </h3>
            <p className="text-[10px] text-slate-400">
              Gumonlanuvchi D.Tursunov real vaqtda ovoz va yurak urish chastotasi tahlili
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE ANALYTICS</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Metric 1: Pulse */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Yurak Urishi (Pulse)</div>
            <div className="text-lg font-extrabold font-mono text-white flex items-baseline gap-1">
              <span>{pulseRate}</span>
              <span className="text-[10px] text-red-400 font-normal">bpm</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Stress Level */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            stressLevel > 75 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Stress Indeksi</div>
            <div className="text-lg font-extrabold font-mono text-white flex items-baseline gap-1">
              <span>{stressLevel}%</span>
              <span className={`text-[10px] ${stressLevel > 75 ? 'text-amber-400' : 'text-blue-400'}`}>
                {stressLevel > 75 ? 'Yuqori (Dovdirash)' : 'Barqaror'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Truth Probability */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            alibiConfronted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
          }`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Haqiqat ehtimolligi</div>
            <div className="text-lg font-extrabold font-mono text-white flex items-baseline gap-1">
              <span>{alibiConfronted ? '12%' : twistActive ? '34%' : '78%'}</span>
              <span className="text-[10px] text-purple-400">
                {alibiConfronted ? 'Fosh etildi' : 'Himoyalanmoqda'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Realtime voice frequency waveform animation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Ovoz chastotasi va nutq intonatsiyasi tahlili</span>
          </span>
          <span className="font-mono text-blue-400">
            {lastTrafficLight === 'green' ? 'Xolis savol (Optimal)' : lastTrafficLight === 'red' ? 'Bosim sezildi (-)' : 'Tahlil qilinmoqda...'}
          </span>
        </div>
        <div className="h-6 flex items-center justify-between gap-1 px-2 bg-black/40 rounded border border-slate-800">
          {[40, 65, 30, 85, 95, 45, 70, 35, 60, 90, 50, 75, 40, 80, 55, 100, 65, 45, 85, 35].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-600 to-emerald-400 rounded-full transition-all duration-300"
              style={{ height: `${Math.max(15, (h * stressLevel) / 100)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
