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
import { PlusCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  INSTRUCTOR_ERROR_HOTSPOTS,
  INSTRUCTOR_GROUP_TREND,
  INITIAL_LEADERBOARD,
} from '../data/caseData';
import { CustomCase, SimulationState } from '../types/simulation';

interface InstructorAnalyticsViewProps {
  state: SimulationState;
  onAddCustomCase: (newCase: CustomCase) => void;
  onActivateCase: (caseId: string, navigateToInvestigation?: boolean) => void;
}

const SIX_COMPETENCIES = [
  { label: 'Raqamli dalillar (JPK 204²)', value: 86, color: 'bg-[#1D4ED8]' },
  { label: 'JPK aniqligi va kvalifikatsiya', value: 89, color: 'bg-[#059669]' },
  { label: 'Kriminalistika va 3D ko‘zdan kechirish', value: 84, color: 'bg-[#D97706]' },
  { label: 'So‘roq taktikasi va alibi fosh etish', value: 81, color: 'bg-[#1D4ED8]' },
  { label: 'Protsessual muddat intizomi (72 soat)', value: 92, color: 'bg-[#059669]' },
  { label: 'Sud nutqi va raddiya mahorati', value: 78, color: 'bg-[#0F172A]' },
];

const TOP_THREE_MISTAKES = [
  {
    rank: '01',
    title: 'JPK 204²-modda: raqamli dalil SHA-256 xesh-qiymatini tekshirmaslik',
    jpkRef: 'O‘zR JPK 95¹, 204²-moddalar',
    rate: 42,
    note: 'Talabalar faylni zaxiralashda nazorat xeshini qayd etmagani uchun sudda dalil maqbulligi shubha ostida qoladi.',
  },
  {
    rank: '02',
    title: 'Faradey paketi va mobil qurilmani tarmoqdan uzish qoidasini buzish',
    jpkRef: 'O‘zR JPK 172, 203-moddalar',
    rate: 28,
    note: 'Smartfon tarmoqda qoldirilganda masofadan ma’lumot o‘chirilishi xavfi yuzaga keladi.',
  },
  {
    rank: '03',
    title: 'JPK 329-modda: tergovga qadar tekshiruv muddatini kechiktirish',
    jpkRef: 'O‘zR JPK 329, 351-moddalar',
    rate: 15,
    note: 'Idoralararo so‘rovlar ketma-ketligini noto‘g‘ri rejalashtirish 72 soatlik chegarani buzadi.',
  },
];

export const InstructorAnalyticsView: React.FC<InstructorAnalyticsViewProps> = ({
  state,
  onAddCustomCase,
  onActivateCase,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kiberfiribgarlik (JK 168-modda)');
  const [caseNumber, setCaseNumber] = useState(
    `102-2026/HMQA-${Math.floor(100 + Math.random() * 899)}`
  );
  const [summary102, setSummary102] = useState('');
  const [difficulty, setDifficulty] = useState<"Boshlang'ich" | "O'rta" | 'Murakkab'>("O'rta");
  const [successMessage, setSuccessMessage] = useState(false);

  const avgAccuracy = Math.round(
    INITIAL_LEADERBOARD.reduce((acc, s) => acc + s.proceduralAccuracy, 0) /
      INITIAL_LEADERBOARD.length
  );
  const avgDeadline = Math.round(
    INITIAL_LEADERBOARD.reduce((acc, s) => acc + s.deadlineCompliance, 0) /
      INITIAL_LEADERBOARD.length
  );
  const avgCourtRate = Math.round(
    INITIAL_LEADERBOARD.reduce((acc, s) => acc + s.cleanCourtRate, 0) /
      INITIAL_LEADERBOARD.length
  );

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
    <div className="space-y-7">
      {/* Header & Add Case CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-cyan-500/20">
        <div>
          <div className="text-xs font-mono font-medium text-cyan-300">
            Huquqni muhofaza qilish akademiyasi · O‘qituvchi va kafedra paneli
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            O‘qituvchi Tahlil Paneli va Kazus Konstruktori
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-blue-600 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi kazus qo‘shish</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
          <span>
            Yangi o‘quv kazusi muvaffaqiyatli qo‘shildi va talabalar tizimiga faollashtirildi!
          </span>
        </div>
      )}

      {/* 4-Column Department KPI Overview Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">O‘rtacha JPK aniqligi</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {avgAccuracy}%
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1D4ED8] rounded-full" style={{ width: `${avgAccuracy}%` }} />
          </div>
        </div>
        <div className="surface-card rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Muddat intizomi</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#059669]">
            {avgDeadline}%
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#059669] rounded-full" style={{ width: `${avgDeadline}%` }} />
          </div>
        </div>
        <div className="surface-card rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Sudga bexato o‘tish</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#1D4ED8]">
            {avgCourtRate}%
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${avgCourtRate}%` }} />
          </div>
        </div>
        <div className="surface-card rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Faol kazuslar banki</div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
            {state.customCases.length} ta
          </div>
          <div className="mt-1.5 text-xs text-slate-500 font-mono tabular-nums">
            {INITIAL_LEADERBOARD.length} nafar namuna talaba
          </div>
        </div>
      </section>

      {/* Top Executive Analytics: 6 Competencies + Top 3 Group Procedural Mistakes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6 Competencies Card */}
        <div className="lg:col-span-7 surface-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-[#0F172A]">
                <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
                <span>6 ta kasbiy kompetensiya ko‘rsatkichlari</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                HMQA «Kiberxavfsizlikni huquqiy ta’minlash» magistratura guruhi kesimida o‘zlashtirish profili
              </p>
            </div>
            <span className="font-mono text-xs font-semibold tabular-nums text-[#1D4ED8]">
              O‘rtacha: 85%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SIX_COMPETENCIES.map((comp) => (
              <div
                key={comp.label}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#0F172A]">{comp.label}</span>
                  <span className="font-mono font-bold tabular-nums text-[#0F172A]">
                    {comp.value}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${comp.color}`}
                    style={{ width: `${comp.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Most Common Procedural Mistakes */}
        <div className="lg:col-span-5 bg-[#0B1221] text-slate-100 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Guruhda eng ko‘p uchraydigan 3 ta protsessual xato</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Amaliy mashg‘ulotlar davomida avtomatik qayd etilgan asosiy xavf nuqtalari
            </p>
          </div>

          <div className="space-y-3">
            {TOP_THREE_MISTAKES.map((err) => (
              <div
                key={err.rank}
                className="bg-[#0E172A] border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-amber-300">
                      #{err.rank} · {err.jpkRef}
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5 leading-snug">
                      {err.title}
                    </div>
                  </div>
                  <span className="font-mono text-base font-bold tabular-nums text-red-400 shrink-0">
                    {err.rate}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#DC2626] to-[#D97706] rounded-full"
                    style={{ width: `${err.rate}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{err.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Error Hotspots */}
        <div className="lg:col-span-6 surface-card rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="stage" type="category" width={140} tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  formatter={(val) => [`${val ?? 0}% xato`, 'Xato ulushi']}
                  contentStyle={{
                    fontSize: '12px',
                    borderRadius: '10px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 8px 20px -8px rgba(15,23,42,0.15)',
                  }}
                />
                <Bar dataKey="errorRate" fill="#DC2626" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Group Trends */}
        <div className="lg:col-span-6 surface-card rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#334155' }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    fontSize: '12px',
                    borderRadius: '10px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 8px 20px -8px rgba(15,23,42,0.15)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="aniqlik" name="Aniqlik (%)" fill="#1D4ED8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="muddat" name="Muddat (%)" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sudgaOtish" name="Sud ulushi (%)" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Performance Summary Table: Tergovchi raqamli portfoliosi */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              «Tergovchi raqamli portfoliosi» — Talabalar ko‘rsatkichlari
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kafedra bo‘yicha 4 ta asosiy ko‘rsatkich kesimida individual o‘zlashtirish jadvali
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {INITIAL_LEADERBOARD.length} nafar namuna profil
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-600">
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
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{st.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{st.group}</td>
                  <td className="py-3.5 px-4 text-slate-700">{st.rankTitle}</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">{st.proceduralAccuracy}%</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">{st.deadlineCompliance}%</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">{st.evidenceStrength}%</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-[#1D4ED8]">{st.cleanCourtRate}%</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">{st.casesCompleted} ta</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Custom Cases List */}
      <div className="surface-card rounded-2xl p-6 space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">
            Kafedra tomonidan qo‘shilgan kazuslar bazasi ({state.customCases.length} ta)
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {state.customCases.map((c: CustomCase) => {
            const isActive = state.activeCaseId === c.id;
            return (
              <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                    <span>{c.caseNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#1D4ED8]">{c.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{c.difficulty}</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">{c.title}</div>
                  <p className="text-xs text-slate-600 line-clamp-1">{c.summary102}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {c.createdAt}
                  </span>
                  <button
                    type="button"
                    onClick={() => onActivateCase(c.id, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-[#059669] border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#1D4ED8] text-white hover:bg-blue-700'
                    }`}
                  >
                    {isActive ? 'Faol kazus (Ochish)' : 'Simulyatorda ochish'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Case Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Yangi o‘quv kazusini yaratish
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
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
                    onChange={(e) => setDifficulty(e.target.value as "Boshlang'ich" | "O'rta" | 'Murakkab')}
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
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-blue-700 rounded-lg cursor-pointer"
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
