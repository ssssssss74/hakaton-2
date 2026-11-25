import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Clock,
  UserCheck,
  Lock,
} from 'lucide-react';
import { CustodyPassportInfo } from '../scene/evidenceCatalog';

interface DigitalCustodyPassportProps {
  title: string;
  hash: string;
  passport: CustodyPassportInfo;
  chainBroken?: boolean;
  investigatorOverride?: string;
  compact?: boolean;
}

export const DigitalCustodyPassport: React.FC<DigitalCustodyPassportProps> = ({
  title,
  hash,
  passport,
  chainBroken = false,
  investigatorOverride,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanInvestigator = (investigatorOverride || passport.investigator).replace(/\s*\(Siz\)\s*/g, '');
  const shortHash = hash.length > 26 ? `${hash.slice(0, 14)}…${hash.slice(-10)}` : hash;

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl border p-3.5 space-y-2.5 ${
        chainBroken
          ? 'bg-red-950/55 border-red-500/70 text-red-100'
          : 'bg-[#091224] border-cyan-500/40 text-slate-100'
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          {chainBroken ? (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div className="text-xs font-bold text-slate-100 truncate">
            Dalil Zanjiri Pasporti (O‘zR JPK 204²-modda)
          </div>
        </div>
        <span className="font-mono text-[10px] text-cyan-300 tabular-nums shrink-0">
          {passport.evidenceCode}
        </span>
      </div>

      {/* Admissibility Seal (JPK 204² vs JPK 95¹) */}
      <div
        className={`rounded-lg px-3 py-2 border text-[11px] font-bold flex items-center gap-2 ${
          chainBroken
            ? 'bg-red-600/25 border-red-400 text-red-100'
            : 'bg-emerald-600/20 border-emerald-400/50 text-emerald-200'
        }`}
      >
        {chainBroken ? (
          <>
            <ShieldAlert className="w-4 h-4 text-red-300 shrink-0" />
            <span>JPK 95¹-MODDA: DALIL MAQBUL EMAS! (Zanjir uzilgan)</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>MAQBUL DALIL — JPK 204²-modda (O‘zgartirilmagan)</span>
          </>
        )}
      </div>

      {/* Custody Metadata Grid */}
      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-2 text-[11px]`}>
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-2 flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-300">Olingan aniq vaqt</div>
            <div className="font-mono text-slate-100 tabular-nums">{passport.seizedAt}</div>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-2 flex items-start gap-2">
          <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-300">Mas’ul tergovchi</div>
            <div className="font-semibold text-slate-100 truncate">{cleanInvestigator}</div>
          </div>
        </div>

        <div className={`bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-2 flex items-start gap-2 ${compact ? '' : 'sm:col-span-2'}`}>
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-300">Saqlash sharti ({title})</div>
            <div className="text-slate-100">{passport.storageCondition}</div>
          </div>
        </div>
      </div>

      {/* SHA-256 Hash Strip with Copy Action */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] text-slate-300">SHA-256 nazorat xesh-qiymati</div>
          <div
            className={`font-mono text-[10px] mt-0.5 truncate ${
              chainBroken ? 'text-red-300 line-through' : 'text-emerald-400'
            }`}
            title={hash}
          >
            {compact ? shortHash : hash}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyHash}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-medium text-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
        </button>
      </div>
    </div>
  );
};
