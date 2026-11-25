import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  X,
} from 'lucide-react';
import { NavView, SimulationState } from '../types/simulation';
import { VISUAL_ASSETS } from '../assets/visuals';
import { EPoligonLogo } from './EPoligonLogo';

interface PresentationTabletViewProps {
  state: SimulationState;
  onNavigate: (view: NavView) => void;
  onStartInvestigation: (step?: number) => void;
}

interface SlideMeta {
  id: number;
  index: string;
  label: string;
  timeRange: string;
  cue: string;
}

const SLIDES: SlideMeta[] = [
  {
    id: 0,
    index: '01',
    label: 'Kirish',
    timeRange: '00:00 – 00:30',
    cue: 'Platforma maqsadi: bo‘lajak tergovchi va prokuror yordamchilari xatoni real fuqaroda emas, virtual poligonda o‘rganadi.',
  },
  {
    id: 1,
    index: '02',
    label: 'Muammo',
    timeRange: '00:30 – 01:15',
    cue: 'Raqamlar tahlili: 2021–2025-yillarda kiberjinoyatlar 11 baravar oshdi, 3,73 trln so‘m zarar yetkazildi, atigi 21% undirilmoqda.',
  },
  {
    id: 2,
    index: '03',
    label: 'Arxitektura',
    timeRange: '01:15 – 02:00',
    cue: 'Yagona 6 bosqichli zanjir: 102 xabaridan 3D hodisa joyi, idoralararo so‘rovlar, AI-so‘roq, prokuror auditi va virtual sudgacha.',
  },
  {
    id: 3,
    index: '04',
    label: '3D va DFIR',
    timeRange: '02:00 – 02:45',
    cue: 'Jonli namoyish I: 3D xonada UV skaner bilan 5 ta dalilni olish, SHA-256 raqamli pasporti va kiber-izlar grafigi.',
  },
  {
    id: 4,
    index: '05',
    label: 'So‘roq va Sud',
    timeRange: '02:45 – 03:30',
    cue: 'Jonli namoyish II: AI-so‘roqda poligraf va «Svetofor» JPK nazorati, 3 tomonlama Virtual Sud va A4 rasmiy bayonnoma.',
  },
  {
    id: 5,
    index: '06',
    label: 'Samara',
    timeRange: '03:30 – 04:00',
    cue: 'Xulosa: an’anaviy nazariyadan 75% amaliy simulyatsiyaga o‘tish — 100% O‘zR JK/JPK mosligi va to‘liq oflayn barqarorlik.',
  },
];

const GROWTH_SERIES = [
  { year: '2021', count: '4 865', pct: 12 },
  { year: '2022', count: '11 200', pct: 24 },
  { year: '2023', count: '23 500', pct: 46 },
  { year: '2024', count: '44 100', pct: 74 },
  { year: '2025', count: '62 400', pct: 100 },
];

const WORKFLOW_NODES = [
  {
    step: 1,
    num: '01',
    title: '102 Navbatchilik',
    jpk: 'JPK 322, 329-m',
    summary: 'Tezkor xabarni ro‘yxatga olish va 72 soatlik protsessual taymerni ishga tushirish.',
  },
  {
    step: 2,
    num: '02',
    title: '3D Joy va DFIR',
    jpk: 'JPK 81, 204²-m',
    summary: '3D hodisa joyi, UV skaner, SHA-256 pasporti va bank/IP kiber-izlarini bog‘lash.',
  },
  {
    step: 3,
    num: '03',
    title: 'So‘rov va Qaror',
    jpk: 'JPK 331-m',
    summary: 'Idoralararo elektron so‘rovlar va jinoyat ishi qo‘zg‘atish qarorini JPK auditidan o‘tkazish.',
  },
  {
    step: 4,
    num: '04',
    title: 'AI-So‘roq',
    jpk: 'JPK 48, PF-257',
    summary: 'Poligraf stress ko‘rsatkichi, «Svetofor» JPK bahosi va etika dilemmasi.',
  },
  {
    step: 5,
    num: '05',
    title: 'Prokuror nazorati',
    jpk: 'JPK 379–384-m',
    summary: 'Ayblov xulosasini to‘liq audit qilish va protsessual xatolarni sudgacha tuzatish.',
  },
  {
    step: 6,
    num: '06',
    title: 'Virtual Sud',
    jpk: 'JPK 95¹, 416-m',
    summary: 'Himoyachi e’tiroziga jonli raddiya, hukm va 1 klikda A4 bayonnoma hamda QR-sertifikat.',
  },
];

const COMPARISON_ROWS = [
  {
    criterion: 'O‘quv jarayoni nisbati',
    before: '80% ma’ruza · 20% amaliy mashg‘ulot',
    after: '75% jonli virtual tergov amaliyoti',
  },
  {
    criterion: 'Protsessual xato narxi',
    before: 'Real jinoyat ishida aniqlanadi va qaytariladi',
    after: 'Virtual muhitda oniy JPK auditi bilan oldi olinadi',
  },
  {
    criterion: 'Raqamli dalillar (DFIR)',
    before: 'Qog‘oz misollar va nazariy tushuntirish',
    after: '3D UV skaner, SHA-256 pasport va kiber-izlar grafigi',
  },
  {
    criterion: 'Baholash va hujjatlar',
    before: 'Qo‘lda tekshiriladigan subyektiv baho',
    after: 'Avtomatik KPI, A4 bayonnoma va 100% oflayn ishlash',
  },
];

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 32 : -32,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -24 : 24,
  }),
};

const AnimatedFigure: React.FC<{
  target: number;
  decimals?: number;
  suffix?: string;
}> = ({ target, decimals = 0, suffix = '' }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const duration = 780;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const text =
    decimals > 0
      ? val.toFixed(decimals).replace('.', ',')
      : Math.round(val).toLocaleString('uz-UZ');

  return (
    <span className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
};

export const PresentationTabletView: React.FC<PresentationTabletViewProps> = ({
  onNavigate,
  onStartInvestigation,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const [selectedNode, setSelectedNode] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEpoligonModal, setShowEpoligonModal] = useState(false);
  const [showSpeakerCue, setShowSpeakerCue] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const deckRef = useRef<HTMLDivElement>(null);
  const epoligonRef = useRef<HTMLDivElement>(null);

  const currentSlide = SLIDES[slideIdx];
  const activeNode = WORKFLOW_NODES.find((n) => n.step === selectedNode) ?? WORKFLOW_NODES[0];

  const goToSlide = (target: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, target));
    if (clamped === slideIdx) return;
    setSlideDir(clamped > slideIdx ? 1 : -1);
    setSlideIdx(clamped);
    if (clamped > 0 && !timerRunning) {
      setTimerRunning(true);
    }
  };

  // Presentation timer (00:00 / 04:00)
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const formattedTimer = `${String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:${String(
    elapsedSec % 60
  ).padStart(2, '0')}`;

  // Keyboard & Wireless Clicker Navigation
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setShowEpoligonModal(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') {
        setShowEpoligonModal(false);
        setIsFullscreen(false);
        return;
      }
      if (showEpoligonModal) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToSlide(slideIdx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(slideIdx - 1);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleDeckFullscreen();
      } else if (e.key >= '1' && e.key <= '6') {
        goToSlide(Number(e.key) - 1);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [slideIdx, showEpoligonModal, timerRunning]);

  const toggleDeckFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      if (next) {
        (deckRef.current || document.documentElement).requestFullscreen?.().catch(() => {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
  };

  const openEpoligonStand = () => {
    setShowEpoligonModal(true);
    window.setTimeout(() => {
      (epoligonRef.current || document.documentElement).requestFullscreen?.().catch(() => {});
    }, 60);
  };

  const closeEpoligonStand = () => {
    setShowEpoligonModal(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleCopyScript = () => {
    const script = SLIDES.map(
      (s) => `${s.index}. ${s.label} (${s.timeRange}): ${s.cue}`
    ).join('\n\n');
    navigator.clipboard?.writeText(script).catch(() => {});
    setCopiedPitch(true);
    window.setTimeout(() => setCopiedPitch(false), 2200);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={deckRef}
        className={
          isFullscreen
            ? 'fixed inset-0 z-[9990] w-screen h-screen bg-[#E9EEEC] flex flex-col text-slate-900 overflow-hidden'
            : 'w-full min-h-[82vh] bg-[#ECEFEB] border border-[#C2CFC9] rounded-2xl shadow-lg flex flex-col text-slate-900 overflow-hidden'
        }
      >
        {/* ================================================================= */}
        {/* MINIMALIST EDITORIAL TOP RIBBON (SINGLE 52PX HAIRLINE BAR)        */}
        {/* ================================================================= */}
        <header className="h-[54px] px-5 sm:px-8 border-b border-[#C6D1CC] bg-[#E5EBE8]/95 flex items-center justify-between gap-4 shrink-0">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <EPoligonLogo size="xs" />
            <div className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
              <span className="font-bold tracking-tight text-slate-900">E-POLIGON</span>
              <span className="text-slate-400 hidden md:inline" aria-hidden="true">/</span>
              <span className="text-slate-600 hidden md:inline font-medium">
                Huquqni muhofaza qilish akademiyasi
              </span>
            </div>
          </div>

          {/* Quiet Chapter Index (Swiss Typographic Navigation) */}
          <LayoutGroup id="keynote-chapters">
            <nav
              aria-label="Taqdimot boblari"
              className="hidden lg:flex items-center gap-1 h-full"
            >
              {SLIDES.map((s) => {
                const active = s.id === slideIdx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(s.id)}
                    className={`relative h-full px-3 inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'text-teal-950 font-semibold'
                        : 'text-slate-500 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-75">{s.index}</span>
                    <span>{s.label}</span>
                    {active && (
                      <motion.div
                        layoutId="keynoteChapterRule"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#0F766E]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Quiet Utility Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openEpoligonStand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B8C7C0] bg-[#F2F4F3] hover:bg-[#DCE7E3] text-xs font-semibold text-teal-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-800" />
              <span className="hidden sm:inline">E-Poligon Ovozli</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSpeakerCue((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                showSpeakerCue
                  ? 'bg-[#0F766E] border-[#0F766E] text-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-[#DCE5E1]'
              }`}
            >
              Nutq
            </button>

            <button
              type="button"
              onClick={toggleDeckFullscreen}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span>{isFullscreen ? 'Chiqish' : 'To‘liq ekran'}</span>
            </button>
          </div>
        </header>

        {/* Quiet Collapsible Speaker Cue Bar */}
        <AnimatePresence>
          {showSpeakerCue && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="px-6 sm:px-10 py-3 bg-[#DFE8E4] border-b border-[#C0CEC8] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-800 shrink-0"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="font-mono text-xs font-semibold text-teal-800 shrink-0">
                  {currentSlide.timeRange}
                </span>
                <span className="font-medium text-slate-900">{currentSlide.cue}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 hover:underline cursor-pointer shrink-0"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Nusxalandi' : 'To‘liq nutqni nusxalash'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================= */}
        {/* MAIN FULL-VIEWPORT ARCHITECTURAL KEYNOTE STAGE                    */}
        {/* ================================================================= */}
        <div className="flex-1 relative overflow-y-auto flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={slideDir} initial={false}>
            {/* ----------------------------------------------------------- */}
            {/* SLIDE 01: MONUMENTAL INSTITUTIONAL COVER                    */}
            {/* ----------------------------------------------------------- */}
            {slideIdx === 0 && (
              <motion.section
                key="slide-0"
                custom={slideDir}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1320px] mx-auto px-7 sm:px-14 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
              >
                <div className="lg:col-span-7 space-y-7">
                  <div className="text-xs font-mono tracking-widest uppercase text-teal-800 font-semibold">
                    O‘zbekiston Respublikasi · Huquqni muhofaza qilish akademiyasi · 2026
                  </div>

                  <div className="space-y-4">
                    <h1 className="font-editorial text-5xl sm:text-7xl font-semibold text-slate-950 tracking-tight leading-[1.03]">
                      E-Poligon
                    </h1>
                    <p className="text-xl sm:text-2xl font-medium text-teal-900 leading-snug max-w-2xl">
                      Tergovchi va prokuror yordamchilari uchun virtual kiber-kriminalistika trenajyori
                    </p>
                  </div>

                  <div className="h-px w-full max-w-xl bg-[#BFCBC6]" />

                  <p className="font-editorial italic text-xl sm:text-2xl text-slate-700 leading-relaxed max-w-2xl">
                    «Bo‘lajak tergovchi protsessual xatoni real inson taqdirida emas — virtual poligonda o‘rganishi kerak.»
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <motion.button
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => goToSlide(1)}
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <span>Taqdimotni boshlash</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <button
                      type="button"
                      onClick={openEpoligonStand}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-teal-900 hover:text-teal-700 underline underline-offset-4 cursor-pointer"
                    >
                      <span>Ovozli E-Poligon stendini ochish</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right 5 cols: Architectural Emblem Monolith */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative p-10 sm:p-14 border border-[#C0CDC7] rounded-3xl bg-[#E4EAE7]/75 flex flex-col items-center gap-6"
                  >
                    {/* Subtle architectural corner marks */}
                    <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-teal-800/50" />
                    <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-teal-800/50" />
                    <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-teal-800/50" />
                    <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-teal-800/50" />

                    <EPoligonLogo
                      size="xl"
                      className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl border border-[#A5BDB3] shadow-lg"
                    />

                    <div className="text-center space-y-1">
                      <div className="font-mono text-xs tracking-widest uppercase text-slate-700 font-semibold">
                        JK · JPK · PF-257 · PF-38
                      </div>
                      <div className="text-xs text-slate-500">
                        102 xabaridan Virtual Sud hukmigacha
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* ----------------------------------------------------------- */}
            {/* SLIDE 02: EDITORIAL PROBLEM LEDGER (NO CARTOON BOXES)       */}
            {/* ----------------------------------------------------------- */}
            {slideIdx === 1 && (
              <motion.section
                key="slide-1"
                custom={slideDir}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1320px] mx-auto px-7 sm:px-14 py-8 sm:py-12 space-y-10"
              >
                <div className="max-w-4xl space-y-3">
                  <div className="text-xs font-mono tracking-widest uppercase text-teal-800 font-semibold">
                    02 · Dolzarb Muammo va Amaliy Tahlil
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-slate-950 leading-[1.12]">
                    Kiberjinoyatlar keskin oshmoqda — protsessual xato esa adolatni kechiktirmoqda
                  </h2>
                </div>

                {/* 3-Column Swiss Ledger (Hairline Rules Only, Zero Card Clutter) */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#BCC8C3] divide-y md:divide-y-0 md:divide-x divide-[#BCC8C3]">
                  <div className="py-6 md:pr-8 space-y-2">
                    <div className="font-editorial text-5xl sm:text-6xl font-semibold text-slate-950">
                      <AnimatedFigure target={11} suffix="×" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Kiberjinoyatlar o‘sish sur’ati
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      2021-yilda 4 865 ta holatdan 2025-yilda 62 400 tagacha ko‘paydi.
                    </p>
                  </div>

                  <div className="py-6 md:px-8 space-y-2">
                    <div className="font-editorial text-5xl sm:text-6xl font-semibold text-red-800">
                      <AnimatedFigure target={3.73} decimals={2} suffix=" trln" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Fuqarolarga yetkazilgan zarar (so‘m)
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Raqamli dalillarni kech qayd etish moliyaviy izlarning yo‘qolishiga olib keladi.
                    </p>
                  </div>

                  <div className="py-6 md:pl-8 space-y-2">
                    <div className="font-editorial text-5xl sm:text-6xl font-semibold text-teal-800">
                      <AnimatedFigure target={21} suffix="%" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Zararni undirish ko‘rsatkichi
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      JPK 95¹ va 204²-moddalar buzilishi ishlarni qo‘shimcha tergovga qaytarmoqda.
                    </p>
                  </div>
                </div>

                {/* Minimalist Editorial Growth Chart + 4 Root Causes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                        2021–2025 Kiberjinoyatlar dinamikasi
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        Rasmiy tahlil ma’lumotlari
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-4 items-end h-[145px] pt-4 border-b border-[#BAC6C1]">
                      {GROWTH_SERIES.map((item, idx) => (
                        <div key={item.year} className="h-full flex flex-col justify-end items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                            {item.count}
                          </span>
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.1 + idx * 0.08,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{ height: `${item.pct}%`, transformOrigin: 'bottom' }}
                            className={`w-full rounded-t-sm ${
                              idx === GROWTH_SERIES.length - 1
                                ? 'bg-[#0F766E]'
                                : 'bg-[#8AA9A0]'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center font-mono text-xs text-slate-600">
                      {GROWTH_SERIES.map((item) => (
                        <span key={item.year}>{item.year}</span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-l border-[#C2CEC9] pt-5 lg:pt-0 lg:pl-8">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                      Ish qaytarilishining asosiy sabablari
                    </div>
                    <dl className="divide-y divide-[#CCD6D1] text-sm">
                      {[
                        ['JPK 95¹-modda', 'Nomuvofiq olingan raqamli dalil (xesh yo‘q)'],
                        ['JPK 329-modda', 'Tergovga qadar tekshiruv muddatini buzish'],
                        ['JK kvalifikatsiya', 'Moddani noto‘g‘ri qo‘llash (168 / 169 / 97)'],
                        ['JPK 48-modda', 'So‘roqda himoya huquqi va etika buzilishi'],
                      ].map(([code, desc]) => (
                        <div key={code} className="py-2.5 flex items-baseline justify-between gap-4">
                          <dt className="font-mono text-xs font-semibold text-teal-900 shrink-0">
                            {code}
                          </dt>
                          <dd className="text-slate-700 text-right">{desc}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ----------------------------------------------------------- */}
            {/* SLIDE 03: INTERACTIVE 6-STAGE ARCHITECTURE FLOW             */}
            {/* ----------------------------------------------------------- */}
            {slideIdx === 2 && (
              <motion.section
                key="slide-2"
                custom={slideDir}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1320px] mx-auto px-7 sm:px-14 py-8 sm:py-12 space-y-10"
              >
                <div className="max-w-4xl space-y-3">
                  <div className="text-xs font-mono tracking-widest uppercase text-teal-800 font-semibold">
                    03 · Tizim Arxitekturasi
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-slate-950 leading-[1.12]">
                    102 xabaridan Sud hukmigacha — yagona uzluksiz protsessual poligon
                  </h2>
                </div>

                {/* Connected 6-Node Architectural Timeline */}
                <div className="relative pt-4">
                  {/* Connecting horizontal SVG hairline */}
                  <div className="hidden lg:block absolute top-[34px] left-8 right-8 h-px bg-[#C2CEC9]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'left' }}
                      className="h-full bg-[#0F766E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {WORKFLOW_NODES.map((node, i) => {
                      const active = node.step === selectedNode;
                      return (
                        <motion.button
                          key={node.step}
                          type="button"
                          onClick={() => setSelectedNode(node.step)}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, delay: i * 0.05 }}
                          className="group text-left flex flex-col gap-3 cursor-pointer focus-visible:outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`relative z-10 w-10 h-10 rounded-full font-mono text-xs font-semibold flex items-center justify-center border transition-all ${
                                active
                                  ? 'bg-[#0F766E] border-[#0F766E] text-white scale-110 shadow-sm'
                                  : 'bg-[#ECEFEB] border-[#9EB4AC] text-slate-700 group-hover:border-teal-700'
                              }`}
                            >
                              {node.num}
                            </span>
                          </div>

                          <div className="space-y-1 pr-2">
                            <div
                              className={`text-sm font-bold transition-colors ${
                                active ? 'text-teal-900' : 'text-slate-900 group-hover:text-teal-800'
                              }`}
                            >
                              {node.title}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500">
                              {node.jpk}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Stage Editorial Spotlight (Clean Hairline Box, 1-Click Live Jump) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNode.step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="border-t border-b border-[#BCC8C3] py-7 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="font-mono text-xs uppercase tracking-wider text-teal-800 font-semibold">
                        Bosqich {activeNode.num} · {activeNode.jpk}
                      </div>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950">
                        {activeNode.title}
                      </h3>
                      <p className="text-base text-slate-700 leading-relaxed">
                        {activeNode.summary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartInvestigation(activeNode.step)}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start md:self-center"
                    >
                      <span>{activeNode.num}-bosqichni jonli ochish</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </motion.section>
            )}

            {/* ----------------------------------------------------------- */}
            {/* SLIDE 04: LIVE DEMO I — 3D CRIME SCENE & DIGITAL CUSTODY    */}
            {/* ----------------------------------------------------------- */}
            {slideIdx === 3 && (
              <motion.section
                key="slide-3"
                custom={slideDir}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1320px] mx-auto px-7 sm:px-14 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Left 7 Cols: Framed Editorial Plate */}
                <figure className="lg:col-span-7 space-y-2.5">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#B8C6C0] bg-[#162726]">
                    {!imgErrors.crime ? (
                      <motion.img
                        src={VISUAL_ASSETS.crimeSceneLab}
                        alt="3D hodisa joyi virtual laboratoriyasi"
                        referrerPolicy="no-referrer"
                        onError={() => setImgErrors((p) => ({ ...p, crime: true }))}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#133532] to-[#1D4E4A]" />
                    )}
                  </div>
                  <figcaption className="flex items-center justify-between text-xs text-slate-600 font-editorial italic">
                    <span>Fig. 01 — Virtual jinoyat joyi, UV lazer skaner va 5 ta ekspertiza obyekti</span>
                    <span className="font-mono not-italic text-[11px] text-slate-500">WebGL · 3D</span>
                  </figcaption>
                </figure>

                {/* Right 5 Cols: Editorial Specification & Direct Live Launch */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2.5">
                    <div className="text-xs font-mono tracking-widest uppercase text-teal-800 font-semibold">
                      04 · Jonli Namoyish I
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950 leading-tight">
                      3D Hodisa joyi va Raqamli Dalillar Pasporti
                    </h2>
                  </div>

                  <dl className="divide-y divide-[#C6D1CC] border-y border-[#C6D1CC] text-sm">
                    <div className="py-3.5 space-y-1">
                      <dt className="font-semibold text-slate-900">1-shaxs virtual ko‘zdan kechirish</dt>
                      <dd className="text-slate-600">
                        WASD erkin harakati, kriminalistik fonar va yashirin qon/barmoq izlari uchun UV skaner.
                      </dd>
                    </div>
                    <div className="py-3.5 space-y-1">
                      <dt className="font-semibold text-slate-900">SHA-256 va Faradey paketi (JPK 204²)</dt>
                      <dd className="text-slate-600">
                        Har bir qurilma xesh bilan muhrlanadi — dalil zanjiri buzilsa, tizim ogohlantiradi.
                      </dd>
                    </div>
                    <div className="py-3.5 space-y-1">
                      <dt className="font-semibold text-slate-900">Kiber-izlar xaritasi va Mini-DFIR</dt>
                      <dd className="text-slate-600">
                        Bank tranzaksiyasi, IP 185.139.137.44, IMEI va Smart-Lock #4821 bir grafiga bog‘lanadi.
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigate('crime_scene_3d')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <span>3D Xonani jonli ochish</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartInvestigation(2)}
                      className="text-sm font-semibold text-teal-900 hover:underline underline-offset-4 cursor-pointer"
                    >
                      Dalillar doskasiga o‘tish
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ----------------------------------------------------------- */}
            {/* SLIDE 05: LIVE DEMO II — AI INTERROGATION & VIRTUAL COURT   */}
            {/* ----------------------------------------------------------- */}
            {slideIdx === 4 && (
              <motion.section
                key="slide-4"
                custom={slideDir}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1320px] mx-auto px-7 sm:px-14 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Left 5 Cols: Editorial Narrative & Live Jump */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2.5">
                    <div className="text-xs font-mono tracking-widest uppercase text-teal-800 font-semibold">
                      05 · Jonli Namoyish II
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950 leading-tight">
                      AI-So‘roq, Poligraf va 3 Tomonlama Virtual Sud
                    </h2>
                  </div>

                  <dl className="divide-y divide-[#C6D1CC] border-y border-[#C6D1CC] text-sm">
                    <div className="py-3.5 space-y-1">
                      <dt className="font-semibold text-slate-900">Poligraf va «Svetofor» JPK nazorati</dt>
                      <dd className="text-slate-600">
                        Yolg‘on alibiga dalil keltirilganda stress 92% gacha ko‘tariladi; yo‘naltiruvchi savol darhol jarima beradi.
                      </dd>
                    </div>
                    <div className="py-3.5 space-y-1">
                      <dt className="font-semibold text-slate-900">Virtual Prokuror va Sud tortishuvi</dt>
                      <dd className="text-slate-600">
                        Himoyachi JPK 95¹ bo‘yicha e’tiroz bildiradi — talaba dalillar asosida raddiya nutqi bilan javob beradi.
                      </dd>
                    </div>
                    <div className="py-3.5 space-y-1">
                      <dt className="font-semibold text-slate-900">1 klikda rasmiy A4 bayonnoma</dt>
                      <dd className="text-slate-600">
                        Protsessual hujjatlar, KPI natijalari va QR-sertifikat chop etishga tayyor shaklda shakllanadi.
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => onStartInvestigation(4)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <span>AI-So‘roqni ochish</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartInvestigation(6)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-900 hover:underline underline-offset-4 cursor-pointer"
                    >
                      <span>Virtual Sudga o‘tish</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right 7 Cols: Editorial Diptych Gallery */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <figure className="space-y-2">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#B8C6C0] bg-[#162726]">
                      {!imgErrors.polygraph ? (
                        <motion.img
                          src={VISUAL_ASSETS.aiPolygraph}
                          alt="AI so‘roq va biometrik poligraf"
                          referrerPolicy="no-referrer"
                          onError={() => setImgErrors((p) => ({ ...p, polygraph: true }))}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#153533]" />
                      )}
                    </div>
                    <figcaption className="text-xs font-editorial italic text-slate-600">
                      Fig. 02 — AI-So‘roq va real vaqtli poligraf
                    </figcaption>
                  </figure>

                  <figure className="space-y-2 sm:mt-8">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#B8C6C0] bg-[#162726]">
                      {!imgErrors.court ? (
                        <motion.img
                          src={VISUAL_ASSETS.courtroomGavel}
                          alt="Virtual sud majlisi"
                          referrerPolicy="no-referrer"
                          onError={() => setImgErrors((p) => ({ ...p, court: true }))}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#153533]" />
                      )}
                    </div>
                    <figcaption className="text-xs font-editorial italic text-slate-600">
                      Fig. 03 — Virtual Sud zali va JPK 95¹ tortishuvi
                    </figcaption>
                  </figure>
                </div>
              </motion.section>
            )}

            {/* ----------------------------------------------------------- */}
            {/* SLIDE 06: INSTITUTIONAL IMPACT & EXECUTIVE CLOSING          */}
            {/* ----------------------------------------------------------- */}
            {slideIdx === 5 && (
              <motion.section
                key="slide-5"
                custom={slideDir}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1320px] mx-auto px-7 sm:px-14 py-8 sm:py-12 space-y-9"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-2.5 max-w-3xl">
                    <div className="text-xs font-mono tracking-widest uppercase text-teal-800 font-semibold">
                      06 · Strategik Samara va Xulosa
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-slate-950 leading-[1.12]">
                      Kadrlar tayyorlashda yangi standart — amaliy xatosiz tergov
                    </h2>
                  </div>
                  <EPoligonLogo size="md" className="hidden sm:inline-flex" />
                </div>

                {/* Clean Institutional Comparison Table (Zero Card Noise) */}
                <div className="overflow-x-auto border-y border-[#B8C6C0]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#C2CEC9] text-xs font-mono uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 pr-6 font-semibold">Mezon</th>
                        <th className="py-3.5 px-6 font-semibold">An’anaviy o‘qitish</th>
                        <th className="py-3.5 pl-6 font-semibold text-teal-900">E-Poligon · HMQA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CFD8D4] text-sm sm:text-base">
                      {COMPARISON_ROWS.map((row, idx) => (
                        <motion.tr
                          key={row.criterion}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.06 }}
                        >
                          <td className="py-4 pr-6 font-semibold text-slate-900 whitespace-nowrap">
                            {row.criterion}
                          </td>
                          <td className="py-4 px-6 text-slate-500">{row.before}</td>
                          <td className="py-4 pl-6 font-semibold text-teal-950">{row.after}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Authoritative Closing Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                  <p className="font-editorial italic text-lg sm:text-xl text-slate-700">
                    E’tiboringiz uchun rahmat. Tizimni jonli sinovdan o‘tkazishga tayyormiz.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onStartInvestigation(1)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <span>Jonli simulyatsiyani boshlash</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={openEpoligonStand}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#B2C4BC] bg-[#E3EAE7] hover:bg-[#D5E1DC] text-teal-950 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-teal-800" />
                      <span>E-Poligon Ovozli Stend</span>
                    </button>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ================================================================= */}
        {/* MINIMALIST BOTTOM KEYNOTE FOOTER (PROGRESS + CLICKER + TIMER)     */}
        {/* ================================================================= */}
        <footer className="relative border-t border-[#C6D1CC] bg-[#E5EBE8]/90 px-5 sm:px-8 py-3 flex items-center justify-between gap-4 shrink-0">
          {/* Ultra-fine 2px progress line along the top edge of footer */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent">
            <motion.div
              animate={{ width: `${((slideIdx + 1) / SLIDES.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="h-full bg-[#0F766E]"
            />
          </div>

          {/* Left: Slide Index & Time Range */}
          <div className="flex items-center gap-3 font-mono text-xs text-slate-600 tabular-nums">
            <span className="font-semibold text-slate-900">
              {currentSlide.index} / 0{SLIDES.length}
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="hidden sm:inline">{currentSlide.label}</span>
            <span className="text-slate-400 hidden md:inline" aria-hidden="true">·</span>
            <span className="hidden md:inline text-slate-500">{currentSlide.timeRange}</span>
          </div>

          {/* Center: Clean Prev / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={slideIdx === 0}
              onClick={() => goToSlide(slideIdx - 1)}
              aria-label="Oldingi slayd"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#C0CEC8] bg-[#F2F4F3] hover:bg-[#DCE7E3] text-xs font-semibold text-slate-800 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Oldingi</span>
            </button>
            <button
              type="button"
              disabled={slideIdx === SLIDES.length - 1}
              onClick={() => goToSlide(slideIdx + 1)}
              aria-label="Keyingi slayd"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Keyingi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Quiet Presenter Clock */}
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 tabular-nums">
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              title="Taymerni boshlash / to‘xtatish"
              className="hover:text-teal-900 cursor-pointer"
            >
              {formattedTimer} / 04:00
            </button>
            {elapsedSec > 0 && (
              <button
                type="button"
                onClick={() => {
                  setElapsedSec(0);
                  setTimerRunning(false);
                }}
                aria-label="Taymerni nollash"
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </footer>

        {/* ================================================================= */}
        {/* FULL-SCREEN OVERLAY FOR E-POLIGON INTERACTIVE SOUND STAND         */}
        {/* ================================================================= */}
        <AnimatePresence>
          {showEpoligonModal && (
            <motion.div
              ref={epoligonRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] w-screen h-screen bg-[#0D1517] flex flex-col"
            >
              <div className="h-12 px-5 bg-[#121D20] border-b border-slate-800 flex items-center justify-between gap-3 text-slate-200 shrink-0">
                <div className="flex items-center gap-2.5 text-xs font-mono text-teal-300">
                  <EPoligonLogo size="xs" />
                  <span>E-POLIGON · OVOZLI INTERAKTIV TAQDIMOT</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Alohida oynada</span>
                  </a>
                  <button
                    type="button"
                    onClick={closeEpoligonStand}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Yopish (ESC)</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full bg-black">
                <iframe
                  src="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                  className="w-full h-full border-0"
                  title="E-Poligon Ovozli Interaktiv Taqdimot"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
