import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Maximize2,
  Minimize2,
  ArrowRight,
  FileText,
  Copy,
  Check,
  Box,
  Trophy,
  BarChart3,
  Play,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sliders,
  Radio,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { NavView, SimulationState } from '../types/simulation';
import { VISUAL_ASSETS } from '../assets/visuals';

interface PresentationTabletViewProps {
  state: SimulationState;
  onNavigate: (view: NavView) => void;
  onStartInvestigation: (step?: number) => void;
}

type TabletTab = 'analytics_impact' | 'live_demo_arch' | 'epoligon_interactive';

const OFFICIAL_STATS = [
  {
    value: '3,73 trln',
    unit: 'so‘m',
    kicker: '11 baravar o‘sish · 2021–2025',
    title: 'Fuqarolarga yetkazilgan kiberzarar',
    source: 'IIV / Gazeta.uz rasmiy ma’lumoti',
    barPct: 92,
    barColor: 'from-red-600 to-rose-500',
    valueColor: 'text-red-700',
    borderColor: 'border-red-300',
  },
  {
    value: '79%',
    unit: 'undirilmagan',
    kicker: '1 trln+ so‘mdan atigi 210 mlrd (21%)',
    title: 'Kechikish va xato sabab qaytmagan zarar',
    source: 'IIV Kiberdepartamenti · 2026-yil 9 oyi',
    barPct: 79,
    barColor: 'from-amber-600 to-amber-500',
    valueColor: 'text-amber-700',
    borderColor: 'border-amber-300',
  },
  {
    value: 'JPK 416',
    unit: 'va 95¹',
    kicker: 'Dalil maqbul emasligi & 72 soat kechikish',
    title: 'Protsessual xato → ish qo‘shimcha tergovga qaytadi',
    source: 'Sud-tergov amaliyoti tahlili (HMQA)',
    barPct: 68,
    barColor: 'from-slate-600 to-cyan-700',
    valueColor: 'text-slate-800',
    borderColor: 'border-[#B8C6C0]',
  },
  {
    value: '0 xato',
    unit: 'amaliyotda',
    kicker: 'PF-38 (10.03.2026) · JPK 204² standarti',
    title: 'Tergovchi va prokuror yordamchisi virtual poligoni',
    source: 'HMQA «E-Tergov Lab» milliy yechimi',
    barPct: 100,
    barColor: 'from-teal-700 to-emerald-600',
    valueColor: 'text-teal-800',
    borderColor: 'border-teal-400/60',
  },
];

const VISUAL_VALUE_CARDS = [
  {
    key: 'cyber',
    image: VISUAL_ASSETS.cyberTrace,
    alt: 'Faradey paketi va raqamli kriminalistika laboratoriyasi',
    kicker: 'JPK 204² va 95¹-moddalar',
    title: 'Raqamli dalil zanjiri (SHA-256)',
    riskText: 'Xesh va Faradey paketi bo‘lmasa — dalil sudda bekor bo‘ladi',
    solutionText: 'Avtomatik SHA-256 pasporti va maqbullik nazorati',
    actionLabel: 'Kiber-izlarni ochish',
    targetStep: 2,
  },
  {
    key: 'scene',
    image: VISUAL_ASSETS.crimeSceneLab,
    alt: '3D hodisa joyi va UV lazer skaneri',
    kicker: 'JPK 137, 172, 180-moddalar',
    title: '3D Hodisa joyi + 5 ta Sud ekspertizasi',
    riskText: 'Dastlabki 72 soatda ashyoviy iz yo‘qolsa — ish to‘xtaydi',
    solutionText: 'UV/Lazer skaner va real 3D xonada amaliy ko‘nikma',
    actionLabel: '3D Xonaga kirish',
    targetView: 'crime_scene_3d' as NavView,
  },
  {
    key: 'court',
    image: VISUAL_ASSETS.courtroomGavel,
    alt: 'Virtual sud zali va prokuror nazorati',
    kicker: 'JPK 384, 416 va 419-moddalar',
    title: 'Prokuror nazorati va 3 ustunli Sud',
    riskText: 'Protsessual xato — ishni qo‘shimcha tergovga qaytaradi',
    solutionText: 'Xatoni real fuqaroda emas, AI-Advokat oldida mashq qilish',
    actionLabel: 'Virtual Sudni ko‘rish',
    targetStep: 6,
  },
];

const FOUR_STAGE_GALLERY = [
  {
    num: '01',
    time: '00:00 – 00:45',
    title: '3D Hodisa joyi + UV Skener',
    subtitle: '3D kriminalistik xona · 5 ta ekspertiza (№ 2026/11-418..422) · SHA-256',
    image: VISUAL_ASSETS.crimeSceneLab,
    alt: '3D hodisa joyi laboratoriyasi',
    cta: '3D Xonani ochish',
    actionType: 'view' as const,
    targetView: 'crime_scene_3d' as NavView,
    span: 'lg:col-span-7',
  },
  {
    num: '02',
    time: '00:45 – 01:30',
    title: 'Kiber-izlar & Mini-DFIR',
    subtitle: 'IP 185.139.137.44 · Smart-Lock #4821 · Faradey pasporti',
    image: VISUAL_ASSETS.cyberTrace,
    alt: 'Raqamli izlar va Faradey paketi',
    cta: '2-bosqichni ochish',
    actionType: 'step' as const,
    targetStep: 2,
    span: 'lg:col-span-5',
  },
  {
    num: '03',
    time: '01:30 – 02:15',
    title: 'AI-So‘roq + Jonli Poligraf',
    subtitle: 'Ovozli so‘roq · 21:22 alibisini fosh etish · 92% stress sakrashi',
    image: VISUAL_ASSETS.aiPolygraph,
    alt: 'AI so‘roq va biometrik poligraf monitori',
    cta: 'AI-So‘roqqa o‘tish',
    actionType: 'step' as const,
    targetStep: 4,
    span: 'lg:col-span-5',
  },
  {
    num: '04',
    time: '02:15 – 03:00',
    title: '3 Ustunli Virtual Sud + A4 PDF',
    subtitle: 'Prokuror · Sudya (isbot shkalasi & muhr) · Himoyachi JPK 95¹',
    image: VISUAL_ASSETS.courtroomGavel,
    alt: 'Virtual sud zali',
    cta: 'Sud zalini ochish',
    actionType: 'step' as const,
    targetStep: 6,
    span: 'lg:col-span-7',
  },
];

const SIX_STEPS = [
  { step: 1, title: '102 Xabari', jpk: 'JPK 322, 329' },
  { step: 2, title: '3D & Dalillar', jpk: 'JPK 81, 204²' },
  { step: 3, title: 'So‘rovlar', jpk: 'JPK 321, 331' },
  { step: 4, title: 'AI-So‘roq', jpk: 'JPK 96, PF-257' },
  { step: 5, title: 'Prokuror', jpk: 'JPK 381, 384' },
  { step: 6, title: 'Virtual Sud', jpk: 'JPK 416, 419' },
];

const MATRIX_ROWS = [
  {
    feature: 'O‘zR JK / JPK (95¹, 204²) va E-tergov',
    hydra: false,
    interpol: false,
    cyberdef: false,
    hmqa: true,
  },
  {
    feature: '3D Hodisa joyi + UV Skener + 5 ta ekspertiza',
    hydra: false,
    interpol: false,
    cyberdef: false,
    hmqa: true,
  },
  {
    feature: 'AI-So‘roq + Poligraf + 3 ustunli Virtual Sud',
    hydra: true,
    interpol: false,
    cyberdef: false,
    hmqa: true,
  },
  {
    feature: 'Kiber-izlar grafi + Mini-DFIR + A4 PDF bayonnoma',
    hydra: false,
    interpol: true,
    cyberdef: true,
    hmqa: true,
  },
];

const GROWTH_BARS = [
  { year: '2021', heightPct: 12, label: '1x' },
  { year: '2022', heightPct: 26, label: '2,8x' },
  { year: '2023', heightPct: 48, label: '5,4x' },
  { year: '2024', heightPct: 74, label: '8,2x' },
  { year: '2025', heightPct: 100, label: '11x' },
];

export const PresentationTabletView: React.FC<PresentationTabletViewProps> = ({
  state,
  onNavigate,
  onStartInvestigation,
}) => {
  const [activeTab, setActiveTab] = useState<TabletTab>('analytics_impact');
  const [showPitchNotes, setShowPitchNotes] = useState(false);
  const [isTabletExpanded, setIsTabletExpanded] = useState(false);
  const [isEpoligonExpanded, setIsEpoligonExpanded] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const epoligonContainerRef = useRef<HTMLDivElement | null>(null);

  const toggleEpoligonFullscreen = () => {
    setIsEpoligonExpanded((prev) => {
      const next = !prev;
      if (next) {
        epoligonContainerRef.current?.requestFullscreen?.().catch(() => {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
  };

  // Interactive Impact Calculator ("Simulyatsiya modeli")
  const [trainedCount, setTrainedCount] = useState(400);
  const [errorReductionPct, setErrorReductionPct] = useState(45);

  const estimatedCasesPrevented = Math.round(trainedCount * 3.8 * (errorReductionPct / 100));
  const estimatedRecoveredBillion =
    Math.round(trainedCount * 0.24 * (errorReductionPct / 45) * 10) / 10;
  const estimatedSavedHours = Math.round(estimatedCasesPrevented * 42);
  const impactVisualPct = Math.min(
    100,
    Math.round(((trainedCount / 1500) * 0.55 + (errorReductionPct / 70) * 0.45) * 100)
  );

  const markImgError = (key: string) =>
    setImgErrors((prev) => ({ ...prev, [key]: true }));

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsTabletExpanded(false);
        setIsEpoligonExpanded(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEpoligonExpanded(false);
        setIsTabletExpanded(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleCopyPitch = () => {
    const pitchText = `Assalomu alaykum! HMQA «Kiberxavfsizlikni huquqiy ta’minlash» magistraturasi tomonidan ishlab chiqilgan «E-Tergov Lab | HMQA» virtual kiber-kriminalistika trenajyorini taqdim etamiz.

1. MUAMMO: 2021–2025-yillarda kiberjinoyatlar 11 baravar ortib, 3,73 trln so‘m zarar yetkazildi; 2026-yil 9 oyida zararning atigi 21% undirildi, protsessual xatolar (JPK 95¹, 416) esa ishlarni qo‘shimcha tergovga qaytarmoqda.
2. YECHIM: Bo‘lajak tergovchi va prokuror yordamchilari xatoni real fuqaroda emas, virtual poligonda o‘rganadi — 3D hodisa joyi (UV skaner, 5 ta ekspertiza, SHA-256 pasport), Kiber-izlar xaritasi, Poligraf bilan AI-so‘roq va 3 ustunli Virtual Sud.
3. SAMARA: 100% O‘zR JK/JPK va PF-38 talablariga mos milliy platforma — 1 klikda rasmiy A4 bayonnoma va QR-sertifikat.`;
    navigator.clipboard?.writeText(pitchText).catch(() => {});
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const toggleFullscreen = () => {
    setIsTabletExpanded((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
  };

  return (
    <div
      className={
        isTabletExpanded
          ? 'fixed inset-0 z-[9990] w-screen h-screen overflow-y-auto bg-[#E3E7E5] p-3 sm:p-4 space-y-3 text-slate-900'
          : 'space-y-4 w-full text-slate-900'
      }
    >
      {/* Compact Presenter Controls Strip */}
      <div className="forensic-glass flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 min-w-0">
          <Shield className="w-4 h-4 text-teal-800 shrink-0" />
          <span className="truncate">Taqdimot Plansheti & E-Poligon</span>
          <span className="text-slate-400 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-xs font-normal text-slate-600 hidden sm:inline truncate">
            HMQA «Kiberxavfsizlikni huquqiy ta’minlash» magistraturasi
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPitchNotes((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              showPitchNotes
                ? 'bg-[#0F766E] text-white border-teal-800'
                : 'bg-[#F2F4F3] text-slate-800 border-[#C6D1CC] hover:bg-[#E1EAE6]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Nutq tezislari</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            {isTabletExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
            <span>{isTabletExpanded ? 'Chiqish (ESC)' : 'To‘liq ekran'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Concise Speaker Notes */}
      {showPitchNotes && (
        <div className="bg-[#F2F4F3] border border-[#B8C6C0] rounded-xl p-4 space-y-3 text-slate-800 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#CFD8D4]">
            <h3 className="text-sm font-bold text-teal-900">
              3 daqiqalik taqdimot tezislari
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E2EAE6] border border-[#B5C6BF] text-teal-900 text-xs font-medium hover:bg-[#D5E1DC] cursor-pointer"
              >
                {copiedPitch ? (
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedPitch ? 'Nusxalandi' : 'Nusxalash'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPitchNotes(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-700">
            <div className="bg-[#E8ECEA] rounded-lg p-3 border border-[#CBD5D0]">
              <div className="font-mono font-bold text-red-700 mb-1">00:00–00:45 · Muammo & Xato</div>
              <p>3,73 trln so‘m zarar, atigi 21% undirilmoqda. JPK 95¹ xatosi ishni qaytaradi.</p>
            </div>
            <div className="bg-[#E8ECEA] rounded-lg p-3 border border-[#CBD5D0]">
              <div className="font-mono font-bold text-teal-800 mb-1">00:45–01:30 · 3D + UV</div>
              <p>3D hodisa joyi, UV skaner, 5 ekspertiza va SHA-256 raqamli dalil pasporti.</p>
            </div>
            <div className="bg-[#E8ECEA] rounded-lg p-3 border border-[#CBD5D0]">
              <div className="font-mono font-bold text-amber-800 mb-1">01:30–02:15 · AI + Poligraf</div>
              <p>Kiber-izlar grafi, Mini-DFIR va 21:22 alibisida 92% stress sakrashi.</p>
            </div>
            <div className="bg-[#E8ECEA] rounded-lg p-3 border border-[#CBD5D0]">
              <div className="font-mono font-bold text-emerald-800 mb-1">02:15–03:00 · Sud + PDF</div>
              <p>3 ustunli Virtual Sud va 1 klikda toza A4 rasmiy bayonnoma.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FLAGSHIP EXECUTIVE PRESENTATION TABLET (CALM MATTE GRAY-SAGE THEME)   */}
      {/* ===================================================================== */}
      <div className="mx-auto w-full bg-gradient-to-b from-[#D5DDD9] via-[#E5EAE7] to-[#D9E0DC] p-2 sm:p-3.5 rounded-[1.85rem] border border-[#B4C4BD] shadow-xl">
        <div className="bg-[#ECEFEB] text-slate-800 rounded-[1.4rem] border border-[#C6D1CC] overflow-hidden flex flex-col">
          {/* Tablet Top Bar + Clean 3-Tab Switcher */}
          <div className="px-5 sm:px-7 py-3.5 bg-[#E2E8E5] border-b border-[#C6D1CC] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
              <span className="text-teal-800 font-mono">HMQA</span>
              <span className="text-slate-400" aria-hidden="true">/</span>
              <span>E-Tergov Lab | Kiber-Kriminalistika Markazi</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFF2F0] border border-[#C6D1CC] rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('analytics_impact')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics_impact'
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-[#DFE6E3]'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>1. Muammo va Samara</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('live_demo_arch')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'live_demo_arch'
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-[#DFE6E3]'
                }`}
              >
                <Play className="w-4 h-4 shrink-0" />
                <span>2. 3 Daqiqalik Jonli Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('epoligon_interactive')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'epoligon_interactive'
                    ? 'bg-[#115E59] text-white shadow-sm'
                    : 'text-teal-900 hover:text-slate-950 hover:bg-[#DCE7E3]'
                }`}
              >
                <Volume2 className="w-4 h-4 shrink-0 text-amber-500" />
                <span>3. E-Poligon Ovozli Lab</span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: VISUAL KEYNOTE — MUAMMO, RASMIY STATISTIKA VA SAMARA       */}
          {/* ================================================================= */}
          {activeTab === 'analytics_impact' && (
            <div className="flex flex-col">
              {/* FULL-BLEED CINEMATIC HERO WITH VISUAL CHARTS */}
              <div className="relative overflow-hidden border-b border-emerald-100 bg-emerald-950 text-white">
                {!imgErrors.heroCommand ? (
                  <img
                    src={VISUAL_ASSETS.tabletHeroCommand}
                    alt="Milliy kiber-kriminalistika boshqaruv markazi"
                    referrerPolicy="no-referrer"
                    onError={() => markImgError('heroCommand')}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-emerald-950/60" />

                <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left: Bold Projector Statement */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                    <div className="space-y-3">
                      <div className="text-xs sm:text-sm font-mono text-emerald-300 tracking-wide">
                        O‘zbekiston Respublikasi Huquqni muhofaza qilish akademiyasi · 2026
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white leading-[1.12] tracking-tight text-balance">
                        Tergovchi amalda <span className="text-amber-300">xato qilmasligi</span> uchun — virtual poligonda tayyorlaymiz
                      </h1>
                      <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                        Protsessual xato (JPK 95¹, 416) tufayli ishlar qo‘shimcha tergovga qaytishi va fuqarolar zararining 79% undirilmay qolishini oldini olish uchun bo‘lajak tergovchi va prokuror yordamchilari xatoni real fuqaroda emas, «E-Tergov Lab» poligonida o‘rganadi.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('live_demo_arch')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>3 daqiqalik jonli demo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('epoligon_interactive')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/50 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer backdrop-blur-sm"
                      >
                        <Volume2 className="w-4 h-4 text-amber-300" />
                        <span>E-Poligon Ovozli Lab</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: High-Impact Visual Infographic Card */}
                  <div className="lg:col-span-5 bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between gap-5 text-white">
                    {/* Top: 11x Growth Bar Chart */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">
                          Kiberjinoyatlar o‘sish dinamikasi
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          2021 → 2025 (+11x)
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2.5 items-end h-28 pt-3 px-2 bg-slate-950/80 rounded-xl border border-slate-800">
                        {GROWTH_BARS.map((bar, idx) => (
                          <div
                            key={bar.year}
                            className="flex flex-col items-center justify-end h-full gap-1 pb-2"
                          >
                            <span
                              className={`font-mono text-[11px] font-bold tabular-nums ${
                                idx === 4 ? 'text-amber-400' : 'text-slate-300'
                              }`}
                            >
                              {bar.label}
                            </span>
                            <div
                              className={`w-full rounded-t-md transition-all ${
                                idx === 4
                                  ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-md shadow-amber-500/30'
                                  : 'bg-gradient-to-t from-emerald-700 to-emerald-400'
                              }`}
                              style={{ height: `${Math.max(14, bar.heightPct * 0.65)}%` }}
                            />
                            <span className="font-mono text-[10px] text-slate-400">
                              {bar.year}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: 21% Recovery Donut Ring */}
                    <div className="flex items-center gap-4 bg-slate-950/80 rounded-xl p-3.5 border border-slate-800">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="25"
                            fill="none"
                            stroke="#1E293B"
                            strokeWidth="7"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="25"
                            fill="none"
                            stroke="#34D399"
                            strokeWidth="7"
                            strokeDasharray="157"
                            strokeDashoffset={157 * (1 - 0.21)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-emerald-300 tabular-nums">
                          21%
                        </div>
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-sm font-bold text-white">
                          210 mlrd / 1 trln+ so‘m
                        </div>
                        <div className="text-xs text-slate-300">
                          2026-yil 9 oyida undirilgan zarar ulushi
                        </div>
                        <div className="text-[11px] font-mono text-amber-300">
                          79% mablag‘ kechikish sababli yo‘qotilmoqda
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BODY CONTENT WITH CALM NEUTRAL GRAY BACKGROUND */}
              <div className="p-6 sm:p-8 space-y-8 bg-[#E6EAE8]">
                {/* 4 BIG PROJECTOR-GRADE METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {OFFICIAL_STATS.map((stat) => (
                    <div
                      key={stat.title}
                      className={`bg-[#F3F5F4] border ${stat.borderColor} rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm`}
                    >
                      <div className="space-y-2">
                        <div className="text-xs font-mono text-slate-600">
                          {stat.kicker}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-3xl sm:text-4xl font-bold font-mono tabular-nums tracking-tight ${stat.valueColor}`}
                          >
                            {stat.value}
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            {stat.unit}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {stat.title}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-[#D8E0DC] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${stat.barColor}`}
                            style={{ width: `${stat.barPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] font-mono text-slate-600">
                          {stat.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3 PHOTOGRAPHIC VALUE CARDS */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Real tergov xatosi vs «E-Tergov Lab» yechimi
                    </h2>
                    <span className="text-xs font-mono text-teal-800">
                      Har bir kartaga bosib modulga o‘ting
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {VISUAL_VALUE_CARDS.map((card) => (
                      <div
                        key={card.key}
                        className="group bg-[#F3F5F4] border border-[#C6D1CC] hover:border-teal-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
                      >
                        <div>
                          {/* Rich 16:9 Photo Header */}
                          <div className="relative h-44 overflow-hidden bg-slate-100">
                            {!imgErrors[card.key] ? (
                              <img
                                src={card.image}
                                alt={card.alt}
                                referrerPolicy="no-referrer"
                                onError={() => markImgError(card.key)}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-200" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-3 left-4 right-4 text-white">
                              <div className="text-[11px] font-mono text-emerald-300">
                                {card.kicker}
                              </div>
                              <h3 className="text-base sm:text-lg font-bold leading-snug">
                                {card.title}
                              </h3>
                            </div>
                          </div>

                          {/* Concise 2-Line Risk vs Solution */}
                          <div className="p-4 space-y-2.5 text-xs sm:text-sm">
                            <div className="flex items-start gap-2.5 text-slate-700">
                              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>{card.riskText}</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-emerald-800 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{card.solutionText}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-4">
                          <button
                            type="button"
                            onClick={() =>
                              card.targetView
                                ? onNavigate(card.targetView)
                                : onStartInvestigation(card.targetStep || 1)
                            }
                            className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 text-xs sm:text-sm font-semibold text-emerald-900 hover:text-white transition-colors cursor-pointer"
                          >
                            <span>{card.actionLabel}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INTERACTIVE SAMARA CALCULATOR */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-300 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Sliders className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          Interaktiv Samara Kalkulyatori
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Simulyatsiya modeli · Slayderni surib kutilayotgan milliy samarani ko‘ring
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-600">
                        Samaradorlik indeksi
                      </span>
                      <div className="w-28 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300"
                          style={{ width: `${impactVisualPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                        {impactVisualPct}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label htmlFor="trained-slider" className="font-semibold text-slate-800">
                            O‘qitilgan kadrlar
                          </label>
                          <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
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
                          className="w-full accent-emerald-600 cursor-pointer h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label htmlFor="reduction-slider" className="font-semibold text-slate-800">
                            Xatolar qisqarishi
                          </label>
                          <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
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
                          className="w-full accent-emerald-600 cursor-pointer h-2"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#F3F5F4] border border-[#C2CFC9] rounded-xl p-4 shadow-xs">
                        <div className="text-xs text-slate-600">Qo‘shimcha undirish</div>
                        <div className="text-3xl font-bold font-mono tabular-nums text-teal-800 mt-1">
                          +{estimatedRecoveredBillion.toLocaleString('uz-UZ')}
                        </div>
                        <div className="text-xs font-semibold text-teal-900 mt-0.5">
                          mlrd so‘m / yil
                        </div>
                      </div>

                      <div className="bg-[#F3F5F4] border border-[#C2CFC9] rounded-xl p-4 shadow-xs">
                        <div className="text-xs text-slate-600">Saqlangan ishlar</div>
                        <div className="text-3xl font-bold font-mono tabular-nums text-teal-800 mt-1">
                          {estimatedCasesPrevented.toLocaleString('uz-UZ')}
                        </div>
                        <div className="text-xs font-semibold text-teal-900 mt-0.5">
                          ta ish (JPK 416)
                        </div>
                      </div>

                      <div className="bg-[#F3F5F4] border border-[#C2CFC9] rounded-xl p-4 shadow-xs">
                        <div className="text-xs text-slate-600">Tejalgan vaqt</div>
                        <div className="text-3xl font-bold font-mono tabular-nums text-amber-800 mt-1">
                          {estimatedSavedHours.toLocaleString('uz-UZ')}
                        </div>
                        <div className="text-xs font-semibold text-amber-900 mt-0.5">
                          ish soati / yil
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: 3 DAQIQALIK JONLI DEMO — CINEMATIC PHOTOGRAPHIC GALLERY    */}
          {/* ================================================================= */}
          {activeTab === 'live_demo_arch' && (
            <div className="p-6 sm:p-8 space-y-8 bg-[#E6EAE8]">
              {/* Top Title + 2 Live Cases Quick Launch */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm font-mono text-emerald-700 font-semibold">
                    3 DAQIQALIK JONLI NAMOYISH · BARCHA MODULLAR 1 KLIKDA OCHILADI
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                    102 xabaridan Virtual Sudgacha — jonli boshqaruv
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onStartInvestigation(1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <Radio className="w-4 h-4" />
                    <span>1-Kazus: JK 168 (42,5 mln)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('crime_scene_3d')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <Box className="w-4 h-4" />
                    <span>2-Kazus: JK 97 (3D Xona)</span>
                  </button>
                </div>
              </div>

              {/* ASYMMETRIC 4-CARD CINEMATIC PHOTO BENTO GALLERY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {FOUR_STAGE_GALLERY.map((card) => (
                  <div
                    key={card.num}
                    onClick={() =>
                      card.actionType === 'view' && card.targetView
                        ? onNavigate(card.targetView)
                        : onStartInvestigation(card.targetStep || 1)
                    }
                    className={`${card.span} group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all shadow-md`}
                  >
                    {!imgErrors[`gallery-${card.num}`] ? (
                      <img
                        src={card.image}
                        alt={card.alt}
                        referrerPolicy="no-referrer"
                        onError={() => markImgError(`gallery-${card.num}`)}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-200" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/10" />

                    <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-amber-400/30 tabular-nums">
                          {card.num} · {card.time}
                        </span>
                        <span className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-amber-400 text-white group-hover:text-slate-950 backdrop-blur-sm flex items-center justify-center transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </div>

                      <div className="space-y-1.5 text-white">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                          {card.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-200 font-medium">
                          {card.subtitle}
                        </p>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-300 group-hover:text-amber-300 transition-colors">
                            <span>{card.cta}</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 6-STEP CLEAN DIRECT LAUNCHER RAIL */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    6 bosqichga to‘g‘ridan-to‘g‘ri kirish
                  </span>
                  <span className="text-xs font-mono text-slate-600 tabular-nums">
                    Tinglovchi: {state.studentName} · Etika: {state.ethicsIndex}%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {SIX_STEPS.map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => onStartInvestigation(item.step)}
                      className="group text-left bg-[#F3F5F4] hover:bg-[#E1EAE6] border border-[#C6D1CC] hover:border-teal-600 rounded-xl p-3.5 transition-all cursor-pointer space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-mono font-bold text-emerald-700 group-hover:text-emerald-800">
                          0{item.step}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                          {item.jpk}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTTOM ROW: GLOBAL MATRIX + ACADEMY PHOTO BANNER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8 bg-[#F3F5F4] border border-[#C6D1CC] rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Xalqaro tajriba va E-Tergov Lab taqqoslama matritsasi
                    </h3>
                    <span className="text-xs font-mono text-emerald-700">
                      100% O‘zR JK va JPK mos keladi
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="pb-3 pr-3 font-semibold">Funksional Modul</th>
                          <th className="pb-3 px-2 text-center">Hydra</th>
                          <th className="pb-3 px-2 text-center">INTERPOL</th>
                          <th className="pb-3 px-2 text-center">CyberDefenders</th>
                          <th className="pb-3 pl-2 text-center text-emerald-700 font-bold">E-Tergov Lab</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MATRIX_ROWS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/50">
                            <td className="py-3 pr-3 font-medium text-slate-800">
                              {row.feature}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {row.hydra ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {row.interpol ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {row.cyberdef ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                              )}
                            </td>
                            <td className="py-3 pl-2 text-center bg-emerald-50">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-emerald-200 flex flex-col justify-between p-5 min-h-[240px] shadow-sm">
                  {!imgErrors.academy ? (
                    <img
                      src={VISUAL_ASSETS.academyDuel}
                      alt="HMQA akademiyasi reyting va analitika"
                      referrerPolicy="no-referrer"
                      onError={() => markImgError('academy')}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-slate-950/40" />

                  <div className="relative z-10 space-y-1 text-white">
                    <div className="text-xs font-mono text-emerald-300">
                      HMQA Nazorat va Baholash
                    </div>
                    <h3 className="text-lg font-bold">
                      O‘qituvchi analitikasi va Reyting
                    </h3>
                    <p className="text-xs text-slate-200">
                      6 ta kompetensiya, Top-3 xatolar va guruh dueli
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => onNavigate('analytics')}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-300" />
                        <span>O‘qituvchi paneli</span>
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('leaderboard')}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 border border-amber-400/40 text-xs sm:text-sm font-semibold text-slate-950 backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-slate-950" />
                        <span>Reyting va Duel</span>
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: E-POLIGON INTERAKTIV & OVOZLI LAB (EMBEDDED HTML ASSET)      */}
          {/* ================================================================= */}
          {activeTab === 'epoligon_interactive' && (
            <div
              ref={epoligonContainerRef}
              className={
                isEpoligonExpanded
                  ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#0B1214] flex flex-col'
                  : 'p-4 sm:p-6 gap-4 bg-[#E6EAE8] flex flex-col'
              }
            >
              {isEpoligonExpanded ? (
                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-[#11191D] border-b border-slate-800 text-slate-200 shrink-0">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>E-POLIGON INTERAKTIV TAQDIMOT · TO‘LIQ EKRAN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Alohida oynada</span>
                    </a>
                    <button
                      type="button"
                      onClick={toggleEpoligonFullscreen}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Chiqish (ESC)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-900 bg-[#D6E4DF] px-3 py-1 rounded-full border border-[#A8C4BA]">
                      <Volume2 className="w-3.5 h-3.5 text-teal-800 animate-pulse" />
                      <span>E-POLIGON OVOZLI VA INTERAKTIV TAQDIMOT</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-1">
                      E-Poligon interaktiv taqdimot stendi
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleEpoligonFullscreen}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>To‘liq ekran</span>
                    </button>
                    <a
                      href="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DCE7E3] hover:bg-[#CEDED8] border border-[#AFC6BE] text-teal-900 text-xs font-semibold transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Alohida oynada ochish</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Embedded Full-Screen-Ready Iframe Container */}
              <div
                className={`relative w-full overflow-hidden ${
                  isEpoligonExpanded
                    ? 'flex-1 bg-black'
                    : 'h-[82vh] min-h-[720px] rounded-2xl border border-[#B8C6C0] bg-[#ECEFEB] shadow-lg'
                }`}
              >
                <iframe
                  src="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                  className="w-full h-full border-0"
                  title="E-Poligon Interaktiv Taqdimot"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
