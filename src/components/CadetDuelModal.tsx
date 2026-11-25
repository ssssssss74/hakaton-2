import React, { useState, useEffect } from 'react';
import { Swords, Crown, Flame, X, Play, RefreshCw, AlertTriangle } from 'lucide-react';
import { ComputedMetrics, SimulationState } from '../types/simulation';
import { INITIAL_LEADERBOARD } from '../data/caseData';

interface CadetDuelModalProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onClose: () => void;
  onRecordVictory: () => void;
}

export const CadetDuelModal: React.FC<CadetDuelModalProps> = ({
  state,
  metrics,
  onClose,
  onRecordVictory,
}) => {
  const [battlePhase, setBattlePhase] = useState<'intro' | 'fighting' | 'finished'>('intro');
  const [progress, setProgress] = useState(0);

  const opponent = INITIAL_LEADERBOARD[1] || {
    name: 'Nazarova Madinabonu',
    group: 'HMQA-302',
    totalScore: 124,
    proceduralAccuracy: 91,
    evidenceStrength: 93,
  };
  const opponentHours = 18;
  const opponentClues = 3;
  const opponentEthics = 92;

  const userInitials = state.studentName
    .split(/\s+/)
    .filter((p) => !p.startsWith('('))
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || 'QT';
  const oppInitials = opponent.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');

  const timeWin = state.hoursUsed > 0 ? state.hoursUsed <= opponentHours : false;
  const cluesWin = state.pinnedClueIds.length >= opponentClues;
  const accuracyWin = metrics.proceduralAccuracy >= opponent.proceduralAccuracy;
  const ethicsWin = state.ethicsIndex >= opponentEthics;

  const userRoundWins = [timeWin, cluesWin, accuracyWin, ethicsWin].filter(Boolean).length;
  const userWon = metrics.totalScore >= opponent.totalScore || userRoundWins >= 3;

  useEffect(() => {
    if (battlePhase === 'fighting') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setBattlePhase('finished');
            return 100;
          }
          return prev + 25;
        });
      }, 600);
      return () => clearInterval(interval);
    }
  }, [battlePhase]);

  const handleStartBattle = () => {
    setProgress(0);
    setBattlePhase('fighting');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Swords className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <h2 className="text-base font-bold">
                HMQA Guruhlararo Tergov Dueli
              </h2>
              <p className="text-xs text-slate-400">
                Real KPI taqqoslash: Ball, Muddat, Dalillar soni, JPK aniqligi va Etika
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Arena View */}
        <div className="p-6 space-y-6">
          {/* Fighters Cards */}
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Cadet 1: User */}
            <div className="p-4 rounded-xl bg-blue-50/70 border-2 border-[#1D4ED8] text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D4ED8] text-white font-bold text-base mx-auto">
                {userInitials}
              </div>
              <div>
                <div className="font-bold text-sm text-[#0F172A]">{state.studentName}</div>
                <div className="text-xs text-[#1D4ED8] font-mono">{state.studentGroup} (Siz)</div>
              </div>
              <div className="pt-2 border-t border-blue-200/60 text-xs font-mono tabular-nums text-slate-700 font-semibold">
                Joriy KPI: {metrics.totalScore} ball
              </div>
            </div>

            {/* Cadet 2: Opponent */}
            <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-amber-400 text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D97706] text-white font-bold text-base mx-auto">
                {oppInitials}
              </div>
              <div>
                <div className="font-bold text-sm text-[#0F172A]">{opponent.name}</div>
                <div className="text-xs text-[#D97706] font-mono">{opponent.group} (Raqib)</div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-xs font-mono tabular-nums text-slate-700 font-semibold">
                Reyting: {opponent.totalScore} ball
              </div>
            </div>
          </div>

          {/* Fight Stages Display */}
          {battlePhase === 'intro' && (
            <div className="text-center py-6 space-y-3">
              <Flame className="w-10 h-10 text-[#D97706] mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-[#0F172A]">
                Real ko‘rsatkichlar bo‘yicha tezkor tergov dueli
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Tizim sizning haqiqiy simulyatsiya KPI ko‘rsatkichlaringizni ({metrics.totalScore} ball,{' '}
                {state.hoursUsed} soat, {state.pinnedClueIds.length} ta dalil, {metrics.proceduralAccuracy}% aniqlik)
                raqib natijalari bilan jonli solishtiradi.
              </p>
              <button
                type="button"
                onClick={handleStartBattle}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#1D4ED8] hover:bg-blue-800 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Duelni boshlash</span>
              </button>
            </div>
          )}

          {battlePhase === 'fighting' && (
            <div className="space-y-4 py-4 text-center">
              <div className="text-xs font-semibold text-[#1D4ED8] animate-pulse">
                {progress < 30
                  ? '1-raund: Tergov vaqti va muddat intizomi tekshirilmoqda...'
                  : progress < 60
                    ? '2-raund: Dalillar doskasiga biriktirilgan dalillar solishtirilmoqda...'
                    : progress < 90
                      ? '3-raund: Protsessual aniqlik (JPK) baholanmoqda...'
                      : 'Yakuniy raund: PF-257 Etika indeksi va umumiy ball hisoblanmoqda...'}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-[#1D4ED8] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 font-mono">Tahlil jarayoni: {progress}%</p>
            </div>
          )}

          {battlePhase === 'finished' && (
            <div className="space-y-4">
              {userWon ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#10B981] text-white mx-auto">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="text-base font-bold text-emerald-950">
                    Tabriklaymiz! Real KPI hisobida siz ustun keldingiz! ({userRoundWins}/4 mezon)
                  </div>
                  <p className="text-xs text-emerald-800">
                    Protsessual aniqligingiz ({metrics.proceduralAccuracy}%) va umumiy natijangiz ({metrics.totalScore} ball) g‘alaba uchun yetarli bo‘ldi.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-1">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D97706] text-white mx-auto">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-base font-bold text-amber-950">
                    Bu raundda raqib ustun keldi ({userRoundWins}/4 mezon)
                  </div>
                  <p className="text-xs text-amber-900">
                    G‘alaba qozonish uchun tergov bosqichlarida ko‘proq dalil pin qiling, JPK aniqligini oshiring va qayta duelga kiring!
                  </p>
                </div>
              )}

              {/* Round Score breakdown (100% Real State & ComputedMetrics) */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="p-2.5 bg-slate-50 font-semibold flex justify-between text-slate-700">
                  <span>Real KPI taqqoslash mezonlari</span>
                  <div className="flex gap-10 mr-2">
                    <span className="text-[#1D4ED8] w-24 text-right">Siz</span>
                    <span className="text-[#D97706] w-20 text-right">Raqib</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>Sarflangan tergov vaqti</span>
                  <div className="flex gap-10 mr-2 font-mono font-semibold tabular-nums">
                    <span className={`w-24 text-right ${timeWin ? 'text-[#059669]' : 'text-slate-700'}`}>
                      {state.hoursUsed} soat
                    </span>
                    <span className="w-20 text-right text-slate-600">{opponentHours} soat</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>Biriktirilgan dalillar soni</span>
                  <div className="flex gap-10 mr-2 font-mono font-semibold tabular-nums">
                    <span className={`w-24 text-right ${cluesWin ? 'text-[#059669]' : 'text-amber-600'}`}>
                      {state.pinnedClueIds.length} ta
                    </span>
                    <span className="w-20 text-right text-slate-600">{opponentClues} ta</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>Protsessual aniqlik (JPK)</span>
                  <div className="flex gap-10 mr-2 font-mono font-semibold tabular-nums">
                    <span className={`w-24 text-right ${accuracyWin ? 'text-[#059669]' : 'text-amber-600'}`}>
                      {metrics.proceduralAccuracy}%
                    </span>
                    <span className="w-20 text-right text-slate-600">{opponent.proceduralAccuracy}%</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>PF-257 Etika indeksi</span>
                  <div className="flex gap-10 mr-2 font-mono font-semibold tabular-nums">
                    <span className={`w-24 text-right ${ethicsWin ? 'text-[#059669]' : 'text-red-600'}`}>
                      {state.ethicsIndex}%
                    </span>
                    <span className="w-20 text-right text-slate-600">{opponentEthics}%</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center bg-slate-50/70">
                  <span className="font-semibold text-[#0F172A]">Umumiy reyting balli</span>
                  <div className="flex gap-10 mr-2 font-mono font-bold tabular-nums">
                    <span className="w-24 text-right text-[#1D4ED8]">{metrics.totalScore} ball</span>
                    <span className="w-20 text-right text-slate-700">{opponent.totalScore} ball</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            HMQA Haftalik Duel Ligasi
          </div>
          {battlePhase === 'finished' ? (
            userWon ? (
              <button
                type="button"
                onClick={() => {
                  onRecordVictory();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#10B981] hover:bg-emerald-600 rounded-lg cursor-pointer"
              >
                G‘alabani reytingga qo‘shish (+10 ball)
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartBattle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Qayta solishtirish</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Yopish
                </button>
              </div>
            )
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Yopish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
