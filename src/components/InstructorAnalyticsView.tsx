import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PlusCircle, FileText, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import {
  INSTRUCTOR_ERROR_HOTSPOTS,
  INSTRUCTOR_GROUP_TREND,
  INITIAL_LEADERBOARD,
} from '../data/caseData';
import { CustomCase, SimulationState } from '../types/simulation';

interface InstructorAnalyticsViewProps {
  state: SimulationState;
  onAddCustomCase: (newCase: CustomCase) => void;
}

export const InstructorAnalyticsView: React.FC<InstructorAnalyticsViewProps> = ({
  state,
  onAddCustomCase,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kiberfiribgarlik (JK 168-modda)');
  const [caseNumber, setCaseNumber] = useState(`102-2026/HMQA-${Math.floor(100 + Math.random() * 899)}`);
  const [summary102, setSummary102] = useState('');
  const [difficulty, setDifficulty] = useState<"Boshlang'ich" | "O'rta" | 'Murakkab'>("O'rta");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary102.trim()) return;

    const newCase: CustomCase = {
      id: `custom-${Date.now()}`,
      caseNumber,
      title: title.trim(),
      category,
      summary102: summary102.trim(),
      difficulty,
      createdAt: new Date().toLocaleDateString('uz-UZ'),
    };

    onAddCustomCase(newCase);
    setTitle('');
    setSummary102('');
    setCaseNumber(`102-2026/HMQA-${Math.floor(100 + Math.random() * 899)}`);
    setModalOpen(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header & Add Case CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <div className="text-xs font-medium text-slate-500">
            Huquqni muhofaza qilish akademiyasi · O‘qituvchi va kafedra paneli
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            O‘qituvchi Tahlil Paneli va Kazus Konstruktori
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi kazus qo‘shish</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>Yangi o‘quv kazusi muvaffaqiyatli qo‘shildi va talabalar tizimiga faollashtirildi!</span>
        </div>
      )}

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Error Hotspots */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Bosqichlar bo‘yicha xatolar issiqlik xaritasi (%)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              HMQA talabalarining tergov jarayonida eng ko‘p yo‘l qo‘yayotgan protsessual xatolari
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={INSTRUCTOR_ERROR_HOTSPOTS}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val ?? 0}% xato`, 'Xato ulushi']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="errorRate" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Group Trends */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Guruhlar kesimida o‘rtacha ko‘rsatkichlar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Akademiya o‘quv guruhlarining protsessual aniqlik va muddat rioyasi dinamikasi
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={INSTRUCTOR_GROUP_TREND}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="aniqlik" name="Aniqlik (%)" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="muddat" name="Muddat (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sudgaOtish" name="Sud ulushi (%)" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Performance Summary Table: Tergovchi raqamli portfoliosi */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              «Tergovchi raqamli portfoliosi» — Talabalar ko‘rsatkichlari
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kafedra bo‘yicha 4 ta asosiy KPI kesimida individual o‘zlashtirish jadvali
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {INITIAL_LEADERBOARD.length} nafar namuna profil
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-semibold">Talaba F.I.Sh.</th>
                <th className="py-3 px-4 font-semibold">Guruh</th>
                <th className="py-3 px-4 font-semibold">Daraja</th>
                <th className="py-3 px-4 font-semibold text-right">Aniqlik</th>
                <th className="py-3 px-4 font-semibold text-right">Muddat</th>
                <th className="py-3 px-4 font-semibold text-right">Dalil kuchi</th>
                <th className="py-3 px-4 font-semibold text-right">Sudga o‘tish</th>
                <th className="py-3 px-4 font-semibold text-right">Yakunlangan ishlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_LEADERBOARD.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">{st.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{st.group}</td>
                  <td className="py-3 px-4 text-slate-700">{st.rankTitle}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{st.proceduralAccuracy}%</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{st.deadlineCompliance}%</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{st.evidenceStrength}%</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#1D4ED8]">{st.cleanCourtRate}%</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">{st.casesCompleted} ta</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Custom Cases List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-[#0F172A]">
          Kafedra tomonidan qo‘shilgan kazuslar bazasi ({state.customCases.length} ta)
        </h3>
        <div className="divide-y divide-slate-100">
          {state.customCases.map((c: CustomCase) => (
            <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{c.caseNumber}</span>
                  <span>·</span>
                  <span className="font-semibold text-[#1D4ED8]">{c.category}</span>
                  <span>·</span>
                  <span>{c.difficulty}</span>
                </div>
                <div className="text-sm font-bold text-[#0F172A]">{c.title}</div>
                <p className="text-xs text-slate-600 line-clamp-1">{c.summary102}</p>
              </div>
              <span className="text-xs font-mono text-slate-400 shrink-0">
                Qo‘shilgan: {c.createdAt}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Case Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Yangi o‘quv kazusini yaratish
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Yopish
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kazus nomi / Sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Kriptovalyuta birjasida firibgarlik..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jinoyat toifasi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#0F172A]"
                  >
                    <option value="Kiberfiribgarlik (JK 168-modda)">Kiberfiribgarlik (JK 168)</option>
                    <option value="Iqtisodiy jinoyat (JK 167-modda)">Iqtisodiy talon-toroj (JK 167)</option>
                    <option value="Mansabdorlik (JK 205-modda)">Mansabdorlik (JK 205)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Qiyinlik darajasi
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#0F172A]"
                  >
                    <option value="Boshlang'ich">Boshlang‘ich</option>
                    <option value="O'rta">O‘rta</option>
                    <option value="Murakkab">Murakkab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  102 Xabari va holat qisqacha mazmuni
                </label>
                <textarea
                  required
                  rows={3}
                  value={summary102}
                  onChange={(e) => setSummary102(e.target.value)}
                  placeholder="Jabrlanuvchi murojaati va jinoyatning asosiy tafsilotlari..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  Kazusni qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
