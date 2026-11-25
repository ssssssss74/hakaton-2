import React, { useState } from 'react';
import { Trophy, Award, Users, Swords, Crown, ArrowRight } from 'lucide-react';
import { INITIAL_LEADERBOARD } from '../data/caseData';
import { ComputedMetrics, SimulationState } from '../types/simulation';
import { CadetDuelModal } from './CadetDuelModal';
import { VISUAL_ASSETS } from '../assets/visuals';

interface LeaderboardViewProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onJoinDuel: () => void;
  onRecordDuelVictory?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  state,
  metrics,
  onJoinDuel,
  onRecordDuelVictory,
}) => {
  const [duelModalOpen, setDuelModalOpen] = useState(false);
  const [duelImgFailed, setDuelImgFailed] = useState(false);

  const currentUserEntry = {
    id: 'current-user',
    name: state.studentName,
    group: state.studentGroup,
    rankTitle: metrics.rankTitle,
    proceduralAccuracy: metrics.proceduralAccuracy,
    deadlineCompliance: metrics.deadlineCompliance,
    evidenceStrength: metrics.evidenceStrength,
    cleanCourtRate: metrics.cleanCourtRate,
    totalScore: metrics.totalScore,
    casesCompleted: state.step6Completed ? 1 : 0,
    isCurrentUser: true,
  };

  const combinedList = [currentUserEntry, ...INITIAL_LEADERBOARD].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="pb-5 border-b border-cyan-500/20">
        <div className="text-xs font-mono font-medium text-cyan-300">
          Huquqni muhofaza qilish akademiyasi · Reyting va musobaqa
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Talabalar Reytingi va Tergov Dueli
        </h1>
      </div>

      {/* Hero Highlight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Weekly Duel Card with Editorial Academy Arena Backdrop */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#0B1221] text-white border border-slate-800 shadow-lg flex flex-col justify-between min-h-[260px]">
          {!duelImgFailed ? (
            <img
              src={VISUAL_ASSETS.academyDuel}
              alt="Akademiya talabalari o'rtasida tergov dueli zali"
              referrerPolicy="no-referrer"
              onError={() => setDuelImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1221] to-[#1E293B]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221]/95 via-[#0B1221]/82 to-[#0B1221]/60" />

          <div className="relative z-10 p-6 lg:p-7 flex flex-col justify-between flex-1 gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
                <Swords className="w-3.5 h-3.5" />
                <span>Haftalik Guruhlararo Tergov Dueli</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="font-mono text-slate-300">60 soniya blits</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                «Eng tezkor va aniq tergovchi» chempionati
              </h2>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl">
                HMQA 3-kurs kadetlari o‘rtasida eng qisqa vaqt ichida protsessual xatolarsiz jinoyat ishini sudga oshirish bo‘yicha jonli JPK musobaqasi.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs">
                <div className="text-slate-400">Joriy ishtirokchilar</div>
                <div className="font-semibold text-white font-mono tabular-nums mt-0.5">
                  48 nafar kadet · 4 ta guruh
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onJoinDuel();
                  setDuelModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0B1221] bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{state.duelJoined ? 'Duel arenasiga kirish' : 'Duellarga qo‘shilish'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Multiplayer Preview Card */}
        <div className="lg:col-span-5 surface-card rounded-2xl p-6 lg:p-7 flex flex-col justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#D97706]">
              <Users className="w-3.5 h-3.5" />
              <span>Rolli Multiplayer Rejimi</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500">3 ishtirokchi</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] leading-snug">
              Tergovchi – Prokuror – Advokat interaktiv stendi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bir vaqtning o‘zida 3 nafar talaba bitta kazus ustida hamkorlikda yoki raqobatbardosh rejimda — Tergovchi dalil to‘playdi, Prokuror nazorat qiladi, Advokat e’tiroz bildiradi — ishlash imkoniyati.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Akademiya lokal tarmog‘i</span>
            <span className="font-semibold text-[#1D4ED8]">Navbatdagi relizga tayyor</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#D97706]" />
            <h3 className="text-base font-bold text-[#0F172A]">
              HMQA Talabalari Reyting jadvali
            </h3>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            Jami: {combinedList.length} ta ishtirokchi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-semibold w-14 text-center">O‘rin</th>
                <th className="py-3 px-4 font-semibold">Talaba (F.I.Sh.) / Guruh</th>
                <th className="py-3 px-4 font-semibold">Tergov unvoni</th>
                <th className="py-3 px-4 font-semibold">Protsessual aniqlik</th>
                <th className="py-3 px-4 font-semibold text-right">Muddat</th>
                <th className="py-3 px-4 font-semibold text-right">Dalil kuchi</th>
                <th className="py-3 px-4 font-semibold text-right">Umumiy ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {combinedList.map((entry, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-blue-50/65 font-semibold'
                        : 'bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-[#B45309] border border-amber-200">
                          <Crown className="w-3.5 h-3.5" />
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 text-orange-800 border border-orange-200">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500">{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A] flex items-center gap-2">
                        <span>{entry.name}</span>
                        {entry.isCurrentUser && (
                          <span className="text-[11px] font-semibold text-[#1D4ED8]">
                            (Siz)
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {entry.group}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                        <span>{entry.rankTitle}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5 min-w-[110px]">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1D4ED8] rounded-full"
                            style={{ width: `${entry.proceduralAccuracy}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums text-slate-700 w-9 text-right">
                          {entry.proceduralAccuracy}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {entry.deadlineCompliance}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {entry.evidenceStrength}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-base tabular-nums text-[#1D4ED8]">
                      {entry.totalScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Cadet Duel Modal */}
      {duelModalOpen && (
        <CadetDuelModal
          state={state}
          onClose={() => setDuelModalOpen(false)}
          onRecordVictory={() => {
            if (onRecordDuelVictory) {
              onRecordDuelVictory();
            }
          }}
        />
      )}
    </div>
  );
};
