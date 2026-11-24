import React, { useState } from 'react';
import { Trophy, Award, Users, Swords, Crown, Shield } from 'lucide-react';
import { INITIAL_LEADERBOARD } from '../data/caseData';
import { ComputedMetrics, SimulationState } from '../types/simulation';
import { CadetDuelModal } from './CadetDuelModal';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#E2E8F0]">
        <div className="text-xs font-medium text-slate-500">
          Huquqni muhofaza qilish akademiyasi · Reyting va musobaqa
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          Talabalar Reytingi va Tergov Dueli
        </h1>
      </div>

      {/* Hero Highlight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Duel Card */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-xl p-6 lg:p-7 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D4ED8] text-xs font-semibold text-white">
              <Swords className="w-3.5 h-3.5" />
              <span>Haftalik Guruhlararo Tergov Dueli</span>
            </div>
            <h2 className="text-xl font-bold">
              «Eng tezkor va aniq tergovchi» chempionati
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              HMQA 3-kurs kadetlari o‘rtasida eng qisqa vaqt ichida protsessual xatolarsiz jinoyat ishini sudga oshirish bo‘yicha jonli duel musobaqasi.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between gap-4">
            <div className="text-xs">
              <div className="text-slate-400">Joriy ishtirokchilar:</div>
              <div className="font-semibold text-white">48 nafar kadet</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onJoinDuel();
                  setDuelModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
              >
                {state.duelJoined ? 'Duel arenasiga kirish' : 'Duellarga qo‘shilish'}
              </button>
            </div>
          </div>
        </div>

        {/* Multiplayer Preview Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-7 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-xs font-semibold text-[#D97706] border border-amber-200">
              <Users className="w-3.5 h-3.5" />
              <span>Rolli Multiplayer Rejimi</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Tergovchi – Prokuror – Advokat interaktiv stendi
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bir vaqtning o‘zida 3 nafar talaba bitta kazus ustida hamkorlikda yoki raqobatbardosh rejimda (Tergovchi dalil to‘playdi, Prokuror nazorat qiladi, Advokat e’tiroz bildiradi) ishlash imkoniyati.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Akademiya tarmog‘i: Faol</span>
            <span className="font-semibold text-[#1D4ED8]">Tez kunda (v2.4)</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-semibold w-12 text-center">O‘rin</th>
                <th className="py-3 px-4 font-semibold">Talaba (F.I.Sh.) / Guruh</th>
                <th className="py-3 px-4 font-semibold">Tergov unvoni</th>
                <th className="py-3 px-4 font-semibold text-center">Protsessual aniqlik</th>
                <th className="py-3 px-4 font-semibold text-center">Muddat rioyasi</th>
                <th className="py-3 px-4 font-semibold text-center">Dalil kuchi</th>
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
                    className={
                      entry.isCurrentUser
                        ? 'bg-blue-50/70 font-semibold'
                        : 'bg-white hover:bg-slate-50/60'
                    }
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-[#D97706]">
                          <Crown className="w-3.5 h-3.5" />
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-800">
                          3
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A] flex items-center gap-2">
                        <span>{entry.name}</span>
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 rounded bg-[#1D4ED8] text-[10px] text-white font-normal">
                            Siz
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {entry.group}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{entry.rankTitle}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                      {entry.proceduralAccuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                      {entry.deadlineCompliance}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
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
