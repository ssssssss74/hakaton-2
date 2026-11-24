import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Crown, CheckCircle2, Shield, Flame, X, Play, RefreshCw } from 'lucide-react';
import { SimulationState } from '../types/simulation';

interface CadetDuelModalProps {
  state: SimulationState;
  onClose: () => void;
  onRecordVictory: () => void;
}

export const CadetDuelModal: React.FC<CadetDuelModalProps> = ({
  state,
  onClose,
  onRecordVictory,
}) => {
  const [battlePhase, setBattlePhase] = useState<'intro' | 'fighting' | 'finished'>('intro');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
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
      }, 700);
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
                Jonli taqqoslash: Tezkorlik, Protsessual aniqlik va Dalillar kuchi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
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
                QT
              </div>
              <div>
                <div className="font-bold text-sm text-[#0F172A]">{state.studentName}</div>
                <div className="text-xs text-[#1D4ED8] font-mono">{state.studentGroup} (Siz)</div>
              </div>
              <div className="pt-2 border-t border-blue-200/60 text-xs font-mono tabular-nums text-slate-600">
                Reyting: 142 ball
              </div>
            </div>

            {/* Cadet 2: Opponent */}
            <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-amber-400 text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D97706] text-white font-bold text-base mx-auto">
                AS
              </div>
              <div>
                <div className="font-bold text-sm text-[#0F172A]">Abdullayev Sardorbek</div>
                <div className="text-xs text-[#D97706] font-mono">HMQA-301 (Chempion)</div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-xs font-mono tabular-nums text-slate-600">
                Reyting: 140 ball
              </div>
            </div>
          </div>

          {/* Fight Stages Display */}
          {battlePhase === 'intro' && (
            <div className="text-center py-6 space-y-3">
              <Flame className="w-10 h-10 text-[#D97706] mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-[#0F172A]">
                Kiberfiribgarlik kazusi bo‘yicha tezkor duel
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Ikkala tergovchi bir xil 102 xabari ustida ishlaydi. 
                Tizim 4 ta parametr bo‘yicha harakatlar tezligi va JPK sifatini baholaydi!
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
                  ? '1-raund: 102 xabarini tezkor ro‘yxatga olish...'
                  : progress < 60
                    ? '2-raund: Raqamli dalillar va IP jurnali tahlili...'
                    : progress < 90
                      ? '3-raund: Gumonlanuvchini AI-so‘roq qilish taktikasi...'
                      : 'Yakuniy raund: Prokuror nazorati va sud himoyasi...'}
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
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#10B981] text-white mx-auto">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-emerald-950">
                  Tabriklaymiz! Siz g‘alaba qozondingiz!
                </div>
                <p className="text-xs text-emerald-800">
                  Sizning protsessual aniqligingiz va Svetofor indikatoridagi natijangiz raqibdan ustun keldi.
                </p>
              </div>

              {/* Round Score breakdown */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="p-2.5 bg-slate-50 font-semibold flex justify-between text-slate-700">
                  <span>Taqqoslash mezonlari</span>
                  <div className="flex gap-12 mr-2">
                    <span className="text-[#1D4ED8]">Siz</span>
                    <span className="text-[#D97706]">Sardorbek</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>102 tezkor ro‘yxatga olish</span>
                  <div className="flex gap-12 mr-3 font-mono font-semibold">
                    <span className="text-[#10B981]">2 soat (Yashil)</span>
                    <span className="text-slate-600">4 soat</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>Dalillar doskasida aniqlik</span>
                  <div className="flex gap-12 mr-3 font-mono font-semibold">
                    <span className="text-[#10B981]">3 / 3 ta</span>
                    <span className="text-slate-600">3 / 3 ta</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>AI-So‘roq sifati («Svetofor»)</span>
                  <div className="flex gap-12 mr-3 font-mono font-semibold">
                    <span className="text-[#10B981]">+30 ball (3 Yashil)</span>
                    <span className="text-slate-600">+23 ball</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span>PF-257 Etika tamoyiliga rioya</span>
                  <div className="flex gap-12 mr-3 font-mono font-semibold">
                    <span className="text-[#10B981]">100% Qonuniy</span>
                    <span className="text-slate-600">100%</span>
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
