import React, { useState, useEffect } from 'react';
import {
  Shield,
  Maximize2,
  Minimize2,
  ArrowRight,
  FileText,
  Copy,
  Check,
  Box,
  Scale,
  Cpu,
  Trophy,
  BarChart3,
  Radio,
  Play,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Globe,
  Landmark,
} from 'lucide-react';
import { NavView, SimulationState } from '../types/simulation';
import { VISUAL_ASSETS } from '../assets/visuals';

interface PresentationTabletViewProps {
  state: SimulationState;
  onNavigate: (view: NavView) => void;
  onStartInvestigation: (step?: number) => void;
}

type TabletTab = 'analytics_impact' | 'live_demo_arch';

const OFFICIAL_STATS = [
  {
    value: '3,73 trln so‘m',
    highlight: '11 baravar o‘sish',
    title: '2021–2025-yillardagi umumiy kiberzarar',
    detail:
      'O‘zbekistonda kiberjinoyatlar soni besh yil ichida 11 baravar ortib, fuqarolar va tashkilotlarga jiddiy moliyaviy zarar yetkazildi.',
    source: 'Manba: IIV / Gazeta.uz',
    accent: 'border-red-500/40 text-red-300',
    valueColor: 'text-red-400',
  },
  {
    value: '< 8%',
    highlight: '16 ming+ ish · ~2 trln so‘m',
    title: 'Toshkent shahrida fosh etish darajasi',
    detail:
      'Poytaxtda 16 mingdan ortiq kiberjinoyat va qariyb 2 trln so‘m zarar fonida fosh etish ko‘rsatkichi 8 foizdan past qolmoqda.',
    source: 'Manba: Prezident yig‘ilishi, 2026-yil yanvar',
    accent: 'border-amber-500/40 text-amber-300',
    valueColor: 'text-amber-300',
  },
  {
    value: '69 ming+ ish',
    highlight: '1 trln+ so‘m · 210 mlrd (~21%)',
    title: '2026-yilning 9 oyi natijasi',
    detail:
      '2026-yilning 9 oyida 1 trln so‘mdan ziyod zarar qayd etilib, shundan atigi 210 mlrd so‘m (~21%) undirilgan.',
    source: 'Manba: IIV Kiberdepartamenti, 2026-yil oktabr',
    accent: 'border-cyan-500/40 text-cyan-300',
    valueColor: 'text-cyan-300',
  },
  {
    value: 'PF-38 · JPK 204²',
    highlight: '10.03.2026-yil Farmoni',
    title: 'Normativ-huquqiy tayanch',
    detail:
      'Prezidentning 2026–2030 Kiberxavfsizlik strategiyasi (PF-38) hamda O‘zR JPK 204¹–204² va 95¹-moddalari talablariga to‘liq mos.',
    source: 'Manba: Lex.uz rasmiy bazasi (2026)',
    accent: 'border-emerald-500/40 text-emerald-300',
    valueColor: 'text-emerald-300',
  },
];

const COMPARISON_ROWS = [
  {
    aspect: 'Raqamli dalil zanjiri (JPK 204² / 95¹)',
    realRisk:
      'SHA-256 nazorat xeshi olinmasligi yoki qurilma Faradey paketisiz olib qo‘yilishi sababli dalil JPK 95¹-moddaga ko‘ra maqbul emas deb topiladi.',
    labSolution:
      'Talaba 3D xona va raqamli pasportda xesh-qiymatni tekshirish, saqlash shartini muhrlash va maqbullikni nazorat qilish refleksini egallaydi.',
  },
  {
    aspect: 'Protsessual muddat va tezkorlik (72 soat)',
    realRisk:
      'Bank, aloqa operatori va IIV bazalariga kechikib so‘rov yuborilishi natijasida o‘g‘irlangan mablag‘ni muzlatish va undirish imkoni boy beriladi.',
    labSolution:
      '72 soatlik jonli taymer ostida dastlabki qaror (102) va idoralararo so‘rovlar ketma-ketligini to‘g‘ri rejalashtirish ko‘nikmasi shakllanadi.',
  },
  {
    aspect: 'Prokuror nazorati va sud himoyasi (JPK 384, 416)',
    realRisk:
      'Protsessual xatolar sababli ish qo‘shimcha tergovga qaytariladi; tergovchi, prokuror va sud organlarining resursi takroran sarflanadi.',
    labSolution:
      'Bo‘lajak tergovchi va prokuror yordamchilari xatoni real fuqaroda emas, virtual trenajyorda qilib o‘rganadi; AI-Advokat e’tiroziga tayyorlanadi.',
  },
];

const FOUR_STAGE_DEMO = [
  {
    time: '00:00 – 00:45',
    num: '01',
    title: '102 Xabari va dastlabki JPK qarori',
    summary:
      'Tezkor murojaatni qabul qilish, Shakl-1 ro‘yxati, 72 soatlik taymer va JPK 322/329-modda asosidagi dastlabki qarorni ko‘rsating.',
    cta: '1-bosqichga o‘tish',
    actionType: 'step' as const,
    targetStep: 1,
  },
  {
    time: '00:45 – 01:30',
    num: '02',
    title: '3D Hodisa joyi + UV Skener + SHA-256 pasporti',
    summary:
      'xona.glb 3D xonasida UV/Lazer skanerni yoqing, 5 ta dalilning (№ 2026/11-418..422) ekspertiza xulosasi va JPK 204² pasportini oching.',
    cta: '3D Xonani ochish',
    actionType: 'view' as const,
    targetView: 'crime_scene_3d' as NavView,
  },
  {
    time: '01:30 – 02:15',
    num: '03',
    title: 'AI-So‘roq + Poligraf + Kiber-izlar xaritasi',
    summary:
      'Animatsiyali Kiber-izlar grafi va Mini-DFIR kvestini, so‘ng 4-bosqichda «Demo savol» orqali 21:22 alibisi va Poligraf (92%) sakrashini ko‘rsating.',
    cta: '4-bosqich (AI-So‘roq)',
    actionType: 'step' as const,
    targetStep: 4,
  },
  {
    time: '02:15 – 03:00',
    num: '04',
    title: 'Prokuror nazorati + Virtual Sud + PDF Bayonnoma',
    summary:
      '3 ustunli Virtual Sud zalida isbotlanganlik darajasi, sud muhrini va 1 klikda toza A4 rasmiy bayonnoma + QR-sertifikatni chop etib ko‘rsating.',
    cta: '6-bosqich (Sud + PDF)',
    actionType: 'step' as const,
    targetStep: 6,
  },
];

const SIX_STEPS = [
  { step: 1, title: '102 Xabari', jpk: 'JPK 322, 329', summary: 'Shakl-1 va dastlabki choralar' },
  { step: 2, title: 'Dalillar & 3D', jpk: 'JPK 81, 204²', summary: '3D xona, Kiber-izlar va Mini-DFIR' },
  { step: 3, title: 'So‘rov va Qaror', jpk: 'JPK 321, 331', summary: 'Idoralararo so‘rov va JPK auditi' },
  { step: 4, title: 'AI-So‘roq', jpk: 'JPK 96, PF-257', summary: 'Poligraf, Svetofor va alibi fosh etish' },
  { step: 5, title: 'Prokuror nazorati', jpk: 'JPK 381, 384', summary: 'Ayblov auditi va xato narxi' },
  { step: 6, title: 'Virtual Sud', jpk: 'JPK 416, 419', summary: '3 ustunli sud zali va PDF bayonnoma' },
];

const GLOBAL_ANALOGUES = [
  {
    name: 'Hydra Foundation (Buyuk Britaniya)',
    focus: 'Politsiya va tergov qarorlarini guruhda mashq qilish va qarorlar jurnali (Debriefing).',
    gap: 'O‘zbekiston JPK normalari, milliy bank/aloqa protokollari va o‘zbek tili mavjud emas.',
  },
  {
    name: 'INTERPOL Virtual Academy',
    focus: 'Xalqaro kiberjinoyatlar bo‘yicha masofaviy modul va treninglar.',
    gap: 'Real 3D hodisa joyi, JPK 204² dalil pasporti va Virtual Sud tortishuvi integratsiya qilinmagan.',
  },
  {
    name: 'CyberDefenders',
    focus: 'Raqamli kriminalistika (DFIR) artefaktlarini topish bo‘yicha texnik laboratoriyalar.',
    gap: 'Faqat texnik tahlilga yo‘naltirilgan; tergov qarori, so‘roq taktikasi va prokuror nazorati yo‘q.',
  },
];

export const PresentationTabletView: React.FC<PresentationTabletViewProps> = ({
  state,
  onNavigate,
  onStartInvestigation,
}) => {
  const [activeTab, setActiveTab] = useState<TabletTab>('analytics_impact');
  const [showPitchNotes, setShowPitchNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Interactive Impact Calculator ("Simulyatsiya modeli")
  const [trainedCount, setTrainedCount] = useState(350);
  const [errorReductionPct, setErrorReductionPct] = useState(45);

  const estimatedCasesPrevented = Math.round(trainedCount * 3.8 * (errorReductionPct / 100));
  const estimatedRecoveredBillion = Math.round(trainedCount * 0.24 * (errorReductionPct / 45) * 10) / 10;
  const estimatedSavedHours = Math.round(estimatedCasesPrevented * 42);

  const markImgError = (key: string) =>
    setImgErrors((prev) => ({ ...prev, [key]: true }));

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleCopyPitch = () => {
    const pitchText = `Hurmatli O‘zbekiston Respublikasi Bosh prokurori va komissiya a’zolari!
HMQA «Kiberxavfsizlikni huquqiy ta’minlash» magistratura talabalari nomidan «E-Tergov Lab | HMQA» virtual tergov va kiber-kriminalistika trenajyorini taqdim etamiz.

1. DOLZARBLIK: 2021–2025-yillarda kiberjinoyatlar 11 baravar oshib, 3,73 trln so‘m zarar yetkazildi; 2026-yil 9 oyida 69 ming+ ish bo‘yicha 1 trln+ so‘m zarardan atigi 21% undirildi. PF-38 Farmoni va JPK 204¹–204² normalari zamonaviy amaliy kadrlar tayyorlashni talab etmoqda.
2. YECHIM: Bo‘lajak tergovchi va prokuror yordamchilari xatoni real fuqaroda emas, virtual poligonda qilib o‘rganadi: 102 xabaridan 3D hodisa joyi (UV skener, SHA-256 pasporti, 5 ta ekspertiza), Kiber-izlar xaritasi, Poligraf bilan AI-so‘roq va 3 ustunli Virtual Sudgacha yagona tizim.
3. NATIJA: Xalqaro Hydra, INTERPOL va CyberDefenders tajribasi asosida 100% O‘zR JK/JPK va E-tergovga moslashtirilgan milliy yechim — protsessual xatolarni keskin kamaytirish va 1 klikda rasmiy bayonnoma hamda malaka sertifikati olish imkoniyati.`;
    navigator.clipboard?.writeText(pitchText).catch(() => {});
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Presenter Command Toolbar */}
      <div className="forensic-glass flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl">
        <div className="min-w-0">
          <div className="text-[11px] font-mono text-cyan-300">
            HMQA «Kiberxavfsizlikni huquqiy ta’minlash» magistratura talabalari taqdimoti
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
            Taqdimot Plansheti — Rahbariyat Tahlili va 3 Daqiqalik Jonli Demo
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPitchNotes((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              showPitchNotes
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-900/80 text-slate-100 border-cyan-500/30 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Nutq tezislari</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-blue-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Ekrandan chiqish' : 'To‘liq ekran'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Executive Pitch Notes */}
      {showPitchNotes && (
        <div className="bg-[#0F1B33] border border-amber-400/40 rounded-xl p-4 space-y-3 text-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-700">
            <h3 className="text-xs font-bold text-amber-300">
              Bosh prokuror oldida nutq uchun 3 daqiqalik tezislar
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-amber-400/40 text-amber-200 text-xs font-medium hover:bg-slate-800 cursor-pointer"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Nusxalandi' : 'Matnni nusxalash'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPitchNotes(false)}
                className="text-xs font-semibold text-slate-300 hover:text-white px-1.5 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-200 leading-relaxed">
            <div className="bg-[#081020] border border-slate-700 rounded-lg p-3">
              <div className="font-bold text-red-300 mb-1">00:00–00:45 · Rasmiy statistika</div>
              <p>3,73 trln so‘m zarar (11 baravar o‘sish), Toshkentda &lt;8% fosh etish va PF-38 Farmoni talabi.</p>
            </div>
            <div className="bg-[#081020] border border-slate-700 rounded-lg p-3">
              <div className="font-bold text-cyan-300 mb-1">00:45–01:30 · 3D + UV + JPK 204²</div>
              <p>3D xonada UV/Lazer skaner, 5 ta rasmiy sud ekspertizasi va SHA-256 dalil zanjiri pasporti.</p>
            </div>
            <div className="bg-[#081020] border border-slate-700 rounded-lg p-3">
              <div className="font-bold text-amber-300 mb-1">01:30–02:15 · AI-So‘roq + Poligraf</div>
              <p>Kiber-izlar grafi, Mini-DFIR kvesti, ovozli so‘roq va 21:22 alibisida 92% stress sakrashi.</p>
            </div>
            <div className="bg-[#081020] border border-slate-700 rounded-lg p-3">
              <div className="font-bold text-emerald-300 mb-1">02:15–03:00 · Sud + PDF & Samara</div>
              <p>3 ustunli Virtual Sud, 1 klikda toza A4 bayonnoma/QR-sertifikat va O‘qituvchi analitikasi.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PRESENTATION TABLET SHELL WITH 2 EXECUTIVE TABS                       */}
      {/* ===================================================================== */}
      <div className="mx-auto w-full bg-gradient-to-b from-slate-800/90 via-[#0C162A] to-slate-950 p-2.5 sm:p-4 rounded-[1.75rem] border border-cyan-500/35 shadow-2xl">
        <div className="bg-[#070E1D] text-slate-100 rounded-[1.35rem] border border-slate-800 overflow-hidden flex flex-col">
          {/* Tablet Header + 2-Tab Switcher */}
          <div className="px-4 sm:px-6 py-3 bg-[#050A15] border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-100">
                E-Tergov Lab | HMQA
              </span>
              <span className="text-slate-600 hidden md:inline" aria-hidden="true">|</span>
              <span className="text-xs text-slate-300 hidden md:inline">
                O‘zbekiston Respublikasi Huquqni muhofaza qilish akademiyasi
              </span>
            </div>

            {/* 2 Primary Executive Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0B1528] border border-cyan-500/25 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('analytics_impact')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics_impact'
                    ? 'bg-gradient-to-r from-[#1D4ED8] to-cyan-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>1. Muammo, Rasmiy Statistika va Samara</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('live_demo_arch')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'live_demo_arch'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Play className="w-3.5 h-3.5 shrink-0" />
                <span>2. 3 Daqiqalik Jonli Demo va Arxitektura</span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: MUAMMO, RASMIY STATISTIKA VA SAMARA                        */}
          {/* ================================================================= */}
          {activeTab === 'analytics_impact' && (
            <div className="p-5 sm:p-6 space-y-6">
              {/* Executive Headline Banner */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-cyan-300">
                    RAHBARIYAT UCHUN TAHLILIY PANEL · O‘ZBEKISTON RESPUBLIKASI RASMIY KO‘RSATKICHLARI
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 leading-tight">
                    Nega kiberjinoyatlar tergovida virtual amaliy poligon bugun zarur?
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                    Kiberjinoyatlar soni va yetkazilayotgan zarar keskin ortib borayotgan bir sharoitda, tergovchi va prokuror yordamchilarining raqamli dalillar bilan ishlash (JPK 204²-modda) ko‘nikmasini xavfsiz simulyatorda shakllantirish strategik ustuvor vazifadir.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('live_demo_arch')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>3 daqiqalik jonli demoga o‘tish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Official Uzbekistan Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {OFFICIAL_STATS.map((stat) => (
                  <div
                    key={stat.title}
                    className={`bg-[#0B1528] border ${stat.accent.split(' ')[0]} rounded-xl p-4 flex flex-col justify-between gap-3`}
                  >
                    <div className="space-y-1.5">
                      <div className={`text-[11px] font-mono font-semibold ${stat.accent.split(' ')[1]}`}>
                        {stat.highlight}
                      </div>
                      <div className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${stat.valueColor}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs font-bold text-slate-100 leading-snug">
                        {stat.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {stat.detail}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                      {stat.source}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table: Real Mistakes vs E-Tergov Lab Solution */}
              <div className="bg-[#0B1528] border border-cyan-500/25 rounded-xl overflow-hidden">
                <div className="px-4 sm:px-5 py-3.5 bg-[#081020] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-cyan-400 shrink-0" />
                    <h3 className="text-sm font-bold text-slate-100">
                      Tergov xatolari oqibati va «E-Tergov Lab» samarasi taqqoslamasi
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300">
                    O‘zR JPK 95¹, 204², 384 va 416-moddalar
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#091324] border-b border-slate-800 text-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold w-1/4">Protsessual yo‘nalish</th>
                        <th className="py-3 px-4 font-semibold text-red-300 w-[37.5%]">
                          Real amaliyotdagi xato oqibati
                        </th>
                        <th className="py-3 px-4 font-semibold text-emerald-300 w-[37.5%]">
                          «E-Tergov Lab» virtual trenajyori yechimi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {COMPARISON_ROWS.map((row) => (
                        <tr key={row.aspect} className="hover:bg-slate-900/40">
                          <td className="py-3.5 px-4 font-bold text-slate-100 align-top">
                            {row.aspect}
                          </td>
                          <td className="py-3.5 px-4 text-slate-200 leading-relaxed align-top">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              <span>{row.realRisk}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-100 leading-relaxed align-top bg-emerald-950/15">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{row.labSolution}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Impact Calculator ("Simulyatsiya modeli") */}
              <div className="bg-gradient-to-br from-[#0B1528] via-[#0E1B33] to-[#081326] border border-emerald-500/35 rounded-xl p-5 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        Tergov xatolarini kamaytirish — Interaktiv Samara Kalkulyatori
                      </h3>
                      <p className="text-xs text-slate-300">
                        HMQA tinglovchilari va amaliyotchi tergovchilarni tayyorlash ko‘lamini o‘zgartirib, kutilayotgan samarani baholang
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 font-mono text-[11px] font-semibold">
                    Simulyatsiya modeli
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left: 2 Interactive Sliders */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-[#070E1C] border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor="trained-slider" className="font-semibold text-slate-200">
                          O‘qitilgan tergovchi va tinglovchilar soni
                        </label>
                        <span className="font-mono font-bold text-cyan-300 tabular-nums">
                          {trainedCount} nafar / yil
                        </span>
                      </div>
                      <input
                        id="trained-slider"
                        type="range"
                        min={50}
                        max={1500}
                        step={25}
                        value={trainedCount}
                        onChange={(e) => setTrainedCount(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span>50 nafar</span>
                        <span>750 nafar</span>
                        <span>1 500 nafar</span>
                      </div>
                    </div>

                    <div className="bg-[#070E1C] border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor="reduction-slider" className="font-semibold text-slate-200">
                          Protsessual xatolar kamayish maqsadi
                        </label>
                        <span className="font-mono font-bold text-emerald-300 tabular-nums">
                          -{errorReductionPct}%
                        </span>
                      </div>
                      <input
                        id="reduction-slider"
                        type="range"
                        min={15}
                        max={70}
                        step={5}
                        value={errorReductionPct}
                        onChange={(e) => setErrorReductionPct(Number(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span>-15% (Boshlang‘ich)</span>
                        <span>-45% (Maqsadli)</span>
                        <span>-70% (Yuqori)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 3 Calculated Output Cards */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-[#070E1C] border border-emerald-500/40 rounded-xl p-4 space-y-2">
                      <div className="text-xs text-slate-300">
                        Qo‘shimcha undirilishi mumkin zarar
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-emerald-300">
                        +{estimatedRecoveredBillion.toLocaleString('uz-UZ')} mlrd
                      </div>
                      <div className="text-[11px] text-slate-300">
                        so‘m (tezkor bloklash va JPK 204² hisobiga)
                      </div>
                    </div>

                    <div className="bg-[#070E1C] border border-cyan-500/40 rounded-xl p-4 space-y-2">
                      <div className="text-xs text-slate-300">
                        Qayta tergovdan saqlangan ishlar
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-cyan-300">
                        {estimatedCasesPrevented.toLocaleString('uz-UZ')} ta
                      </div>
                      <div className="text-[11px] text-slate-300">
                        ish / yil (JPK 416/419 qaytaruvi oldini olish)
                      </div>
                    </div>

                    <div className="bg-[#070E1C] border border-amber-500/40 rounded-xl p-4 space-y-2">
                      <div className="text-xs text-slate-300">
                        Tejaladigan tergov-sud ish soatlari
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">
                        {estimatedSavedHours.toLocaleString('uz-UZ')} soat
                      </div>
                      <div className="text-[11px] text-slate-300">
                        prokuror, tergovchi va sud resursi tejalishi
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: 3 DAQIQALIK JONLI DEMO VA ARXITEKTURA                      */}
          {/* ================================================================= */}
          {activeTab === 'live_demo_arch' && (
            <div className="flex flex-col">
              {/* Cinematic Hero Banner */}
              <div className="relative overflow-hidden border-b border-slate-800/90">
                {!imgErrors.hero ? (
                  <img
                    src={VISUAL_ASSETS.forensicCommand}
                    alt="Huquqni muhofaza qilish akademiyasi tergov markazi"
                    referrerPolicy="no-referrer"
                    onError={() => markImgError('hero')}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0B1325] via-[#132140] to-[#0B1221]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070E1D]/96 via-[#070E1D]/88 to-[#070E1D]/76" />

                <div className="relative z-10 p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-cyan-300">
                        3 DAQIQALIK JONLI NAMOYISH VA TIZIM ARXITEKTURASI
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight leading-tight">
                        102 xabaridan Virtual Sudgacha — yagona kiber-kriminalistika poligoni
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                        Quyidagi 4 bosqichli jonli demo xaritasi orqali har bir modulni 1 klikda ochib, real vaqtda ko‘rsatishingiz mumkin.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-[#0B1528]/90 border border-cyan-500/30 rounded-xl p-3 space-y-1">
                        <div className="text-[11px] font-mono text-cyan-300">
                          1-Kazus · O‘zR JK 168-modda 3-qism
                        </div>
                        <div className="text-xs font-semibold text-slate-100">
                          42,5 mln so‘m kiberfiribgarlik (TuronPay / OTP)
                        </div>
                        <div className="text-[11px] text-slate-300">
                          IP 185.139.137.44 · @orion_verify_bot · 8600****9104
                        </div>
                      </div>
                      <div className="bg-[#0B1528]/90 border border-amber-500/30 rounded-xl p-3 space-y-1">
                        <div className="text-[11px] font-mono text-amber-300">
                          2-Kazus · O‘zR JK 97-modda 1-qism (CASE-02)
                        </div>
                        <div className="text-xs font-semibold text-slate-100">
                          «Soxta xayrlashuv xati» (3D xona + alibi fosh etish)
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Dalil_Pichoq · Dalil_Xat · Smart-Lock #4821 · 21:22 kamera
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Jump Metrics Box */}
                  <div className="lg:col-span-5 bg-[#0B1528]/90 border border-cyan-500/25 rounded-xl p-4 flex flex-col justify-between gap-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-[#060B16] border border-slate-800 rounded-lg p-3">
                        <div className="text-2xl font-bold font-mono tabular-nums text-cyan-300">6</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">To‘liq JPK bosqichi</div>
                      </div>
                      <div className="bg-[#060B16] border border-slate-800 rounded-lg p-3">
                        <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">5 ta</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">3D dalil + Sud ekspertizasi</div>
                      </div>
                      <div className="bg-[#060B16] border border-slate-800 rounded-lg p-3">
                        <div className="text-2xl font-bold font-mono tabular-nums text-emerald-300">UV + 3D</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Lazer skaner & SHA-256</div>
                      </div>
                      <div className="bg-[#060B16] border border-slate-800 rounded-lg p-3">
                        <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">100%</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">O‘zR JK / JPK muvofiqligi</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onStartInvestigation(1)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-blue-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>Tergovni boshlash</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('crime_scene_3d')}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D Xona</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* 4-Stage Presenter Live Demo Map */}
                <div className="bg-[#0B1528] border border-amber-400/35 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-100">
                        Boshlovchi uchun 4 bosqichli jonli namoyish xaritasi (3 daqiqa)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Zaxira lokal rejim faol · 1 klikda sakrash</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {FOUR_STAGE_DEMO.map((item) => (
                      <div
                        key={item.num}
                        className="bg-[#060C18] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-amber-300 tabular-nums">{item.time}</span>
                            <span className="text-cyan-300 font-bold">#{item.num}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-100 leading-snug">
                            {item.title}
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            item.actionType === 'view' && item.targetView
                              ? onNavigate(item.targetView)
                              : onStartInvestigation(item.targetStep || 1)
                          }
                          className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg bg-[#1D4ED8]/25 hover:bg-[#1D4ED8] border border-cyan-500/35 text-xs font-semibold text-cyan-100 hover:text-white transition-colors cursor-pointer"
                        >
                          <span>{item.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6-Step Direct Launcher Strip */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-100">
                      6 bosqichli protsessual zanjir — barcha bosqichlar erkin ochiq
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono tabular-nums">
                      Joriy tinglovchi: {state.studentName} · Etika: {state.ethicsIndex}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {SIX_STEPS.map((item) => (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => onStartInvestigation(item.step)}
                        className="group text-left bg-[#0B1528] hover:bg-[#122240] border border-slate-800 hover:border-cyan-400/60 rounded-xl p-3 transition-all cursor-pointer flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono text-[11px] font-bold flex items-center justify-center group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
                            {item.step}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 truncate">
                            {item.jpk}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-2">
                            {item.summary}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global Analogues vs National Solution Block */}
                <div className="bg-[#0B1528] border border-emerald-500/35 rounded-xl p-4 sm:p-5 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h3 className="text-sm font-bold text-slate-100">
                        Xalqaro analoglar bilan taqqoslash va milliy ustunlik
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-semibold">
                      100% O‘zR JK/JPK va E-tergovga moslashtirilgan milliy yechim
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {GLOBAL_ANALOGUES.map((item) => (
                      <div
                        key={item.name}
                        className="bg-[#060C18] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                      >
                        <div className="font-bold text-cyan-300">{item.name}</div>
                        <p className="text-slate-200 leading-relaxed">{item.focus}</p>
                        <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-200 leading-relaxed">
                          <span className="font-semibold text-amber-300">Cheklov: </span>
                          {item.gap}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>E-Tergov Lab | HMQA:</strong> 3D xona + UV skaner + JPK 204²/95¹ pasporti + Poligraf + 3 ustunli Virtual Sud + O‘qituvchi analitikasi yagona o‘zbek tilidagi milliy platformada.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate('analytics')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060C18] hover:bg-slate-800 border border-cyan-500/30 text-xs font-semibold text-cyan-200 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>O‘qituvchi analitikasi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('leaderboard')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060C18] hover:bg-slate-800 border border-amber-500/30 text-xs font-semibold text-amber-200 cursor-pointer"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Reyting va Duel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('dashboard')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060C18] hover:bg-slate-800 border border-emerald-500/30 text-xs font-semibold text-emerald-200 cursor-pointer"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>102 Markaz</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
