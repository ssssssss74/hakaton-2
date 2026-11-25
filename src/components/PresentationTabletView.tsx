import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Play,
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

const WORKFLOW_STEPS = [
  {
    step: 1,
    num: '01',
    title: '102 Navbatchilik',
    jpk: 'JPK 322, 329-m',
    desc: 'Ovozli 102 qo‘ng‘irog‘i, hududiy radar va 72 soatlik taymer.',
  },
  {
    step: 2,
    num: '02',
    title: '3D Joy va DFIR',
    jpk: 'JPK 81, 204²-m',
    desc: 'WASD 3D hodisa joyi, UV skaner, SHA-256 pasport va kiber-izlar.',
  },
  {
    step: 3,
    num: '03',
    title: 'So‘rov va Qaror',
    jpk: 'JPK 331-m',
    desc: '4 ta idora bilan jonli tarmoq va JPK qaror konstruktori.',
  },
  {
    step: 4,
    num: '04',
    title: 'AI-So‘roq',
    jpk: 'JPK 48, PF-257',
    desc: 'Video-xona, poligraf stress o‘lchovi va «Svetofor» nazorati.',
  },
  {
    step: 5,
    num: '05',
    title: 'Prokuror nazorati',
    jpk: 'JPK 379–384-m',
    desc: 'Tayyorgarlik shkalasi va sudgacha xatolarni tuzatish auditi.',
  },
  {
    step: 6,
    num: '06',
    title: 'Virtual Sud',
    jpk: 'JPK 95¹, 416-m',
    desc: '3 tomonlama tortishuv, raddiya va A4 rasmiy QR-bayonnoma.',
  },
];

const COMPARE_ROWS = [
  {
    label: 'Amaliyot ulushi',
    oldVal: '20% amaliyot',
    newVal: '75% jonli simulyatsiya',
  },
  {
    label: 'Xato aniqlash',
    oldVal: 'Real ishda qaytariladi',
    newVal: 'Virtual JPK auditida tuzatiladi',
  },
  {
    label: 'Natija va barqarorlik',
    oldVal: 'Qo‘lda baholash',
    newVal: 'A4 PDF + 100% Oflayn (PWA)',
  },
];

const SPEAKER_SCRIPT = `1-QISM (00:00–01:40) · E-Poligon Ovozli Stend:
Yuqoridagi interaktiv stendda platforma g‘oyasi, kasbiy rollar va ovozli 3D imkoniyatlari ko‘rsatiladi.

2-QISM (01:40–03:30) · 1-Ekranli Tizim Plansheti:
2021–2025-yillarda kiberjinoyatlar 11 baravar oshdi, 3,73 trln so‘m zarar yetkazildi, atigi 21% undirilmoqda. Bo‘lajak tergovchi va prokuror yordamchilari xatoni real inson taqdirida emas, virtual poligonda o‘rganishi uchun 102 dan Sudgacha bo‘lgan 6 bosqichli yagona tizim yaratildi. Har bir modul 1 klikda jonli ochiladi va 100% oflayn ishlaydi.`;

export const PresentationTabletView: React.FC<PresentationTabletViewProps> = ({
  onNavigate,
  onStartInvestigation,
}) => {
  const [epoligonFullscreen, setEpoligonFullscreen] = useState(false);
  const [tabletFullscreen, setTabletFullscreen] = useState(false);
  const [showSpeakerNote, setShowSpeakerNote] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const epoligonFsRef = useRef<HTMLDivElement>(null);
  const tabletFsRef = useRef<HTMLDivElement>(null);
  const topStandSectionRef = useRef<HTMLElement>(null);
  const tabletSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setEpoligonFullscreen(false);
        setTabletFullscreen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEpoligonFullscreen(false);
        setTabletFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const openEpoligonFullscreen = () => {
    setEpoligonFullscreen(true);
    window.setTimeout(() => {
      (epoligonFsRef.current || document.documentElement).requestFullscreen?.().catch(() => {});
    }, 60);
  };

  const closeEpoligonFullscreen = () => {
    setEpoligonFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleTabletFullscreen = () => {
    setTabletFullscreen((prev) => {
      const next = !prev;
      if (next) {
        window.setTimeout(() => {
          (tabletFsRef.current || document.documentElement).requestFullscreen?.().catch(() => {});
        }, 50);
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
  };

  const handleCopyScript = () => {
    navigator.clipboard?.writeText(SPEAKER_SCRIPT).catch(() => {});
    setCopiedScript(true);
    window.setTimeout(() => setCopiedScript(false), 2000);
  };

  const scrollToTablet = () => {
    tabletSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTopStand = () => {
    topStandSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-6">
        {/* ================================================================= */}
        {/* 1-QISM (ENG TEPADA): E-POLIGON OVOZLI INTERAKTIV TAQDIMOT STENDI  */}
        {/* ================================================================= */}
        <section
          ref={topStandSectionRef}
          className="w-full rounded-2xl overflow-hidden border border-[#BCCAC4] bg-[#E8EEEC] shadow-md"
        >
          <div className="px-5 py-3.5 bg-[#E2EAE7] border-b border-[#C0CEC8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <EPoligonLogo size="sm" />
              <div className="min-w-0">
                <div className="text-[11px] font-mono font-semibold text-teal-800 uppercase tracking-wider">
                  1-qism · Kirish va Ovozli Taqdimot
                </div>
                <h1 className="text-base sm:text-lg font-bold text-slate-950 truncate">
                  E-Poligon Ovozli Interaktiv Taqdimot Stendi
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openEpoligonFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>To‘liq ekran (HDMI)</span>
              </button>

              <a
                href="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#B2C2BC] bg-[#F2F4F3] hover:bg-[#DCE7E3] text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Alohida oynada</span>
              </a>

              <button
                type="button"
                onClick={scrollToTablet}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-700/40 bg-[#D7EAE3] hover:bg-[#C6E1D7] text-teal-950 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>2-qism: Tizim Plansheti</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full h-[78vh] min-h-[600px] bg-[#0B1730]">
            <iframe
              src="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
              title="E-Poligon ovozli interaktiv taqdimot stendi"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2-QISM (PASTDA): 1 TA EKRANLIK TIZIM IMKONIYATLARI PLANSHETI      */}
        {/* ================================================================= */}
        <section
          ref={(el) => {
            tabletSectionRef.current = el;
            tabletFsRef.current = el as HTMLDivElement | null;
          }}
          className={
            tabletFullscreen
              ? 'fixed inset-0 z-[9990] w-screen h-screen bg-[#E9EEEC] text-slate-950 flex flex-col justify-between overflow-y-auto lg:overflow-hidden p-5 sm:p-7 gap-4'
              : 'w-full rounded-2xl border border-[#B8C7C1] bg-[#ECEFEB] text-slate-950 shadow-lg flex flex-col justify-between p-5 sm:p-7 gap-5'
          }
        >
          {/* ROW 1: EXECUTIVE HEADER + 4 BIG-SCREEN KEY METRICS */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-[#C0CEC8] shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <EPoligonLogo size="md" className="shrink-0" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-semibold text-teal-800 uppercase tracking-wider">
                  <span>2-qism · 1-Ekranli Tizim Plansheti</span>
                  <span className="text-slate-400">·</span>
                  <span>Huquqni muhofaza qilish akademiyasi</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950 leading-tight mt-0.5">
                  E-Poligon — 102 dan Sudgacha yagona virtual tergov tizimi
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={scrollToTopStand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#BCCAC4] bg-[#F2F4F3] hover:bg-[#DFE8E4] text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Ovozli stend</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSpeakerNote((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  showSpeakerNote
                    ? 'bg-[#0F766E] border-[#0F766E] text-white'
                    : 'border-[#BCCAC4] bg-[#F2F4F3] text-slate-700 hover:bg-[#DFE8E4]'
                }`}
              >
                Nutq
              </button>
              <button
                type="button"
                onClick={toggleTabletFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {tabletFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
                <span>{tabletFullscreen ? 'Chiqish' : 'Planshetni to‘liq ekran'}</span>
              </button>
            </div>
          </div>

          {/* Optional Compact Speaker Note Strip */}
          <AnimatePresence>
            {showSpeakerNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden shrink-0"
              >
                <div className="p-3.5 rounded-xl bg-[#DFE8E4] border border-[#B8C7C1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-800">
                  <p className="leading-relaxed">
                    <strong>Asosiy xulosa:</strong> Bo‘lajak tergovchi va prokuror yordamchilari protsessual xatoni real inson taqdirida emas, virtual poligonda o‘rganadi — 102 xabaridan Virtual Sudgacha barcha bosqichlar 1 klikda jonli namoyish etiladi.
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1.5 font-semibold text-teal-900 hover:underline shrink-0 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Nusxalandi' : 'Nutqni nusxalash'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROW 2: 4-COLUMN HIGH-CLARITY METRIC STRIP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#C0CEC8] rounded-xl bg-[#F4F6F5] divide-y lg:divide-y-0 lg:divide-x divide-[#C8D4CF] shrink-0">
            <div className="px-4 py-3 flex items-baseline justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-600">Kiberjinoyat o‘sishi</div>
                <div className="text-[11px] text-slate-500 font-mono">2021 → 2025</div>
              </div>
              <div className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950 tabular-nums">
                11×
              </div>
            </div>

            <div className="px-4 py-3 flex items-baseline justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-600">Fuqarolarga zarar</div>
                <div className="text-[11px] text-slate-500 font-mono">So‘mda (jami)</div>
              </div>
              <div className="font-editorial text-3xl sm:text-4xl font-semibold text-red-800 tabular-nums">
                3,73 trln
              </div>
            </div>

            <div className="px-4 py-3 flex items-baseline justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-600">Zarar undirilishi</div>
                <div className="text-[11px] text-slate-500 font-mono">JPK xatolari sabab</div>
              </div>
              <div className="font-editorial text-3xl sm:text-4xl font-semibold text-amber-800 tabular-nums">
                21%
              </div>
            </div>

            <div className="px-4 py-3 flex items-baseline justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-600">Amaliy tayyorgarlik</div>
                <div className="text-[11px] text-teal-800 font-mono font-semibold">E-Poligon maqsadi</div>
              </div>
              <div className="font-editorial text-3xl sm:text-4xl font-semibold text-teal-800 tabular-nums">
                75%
              </div>
            </div>
          </div>

          {/* ROW 3: MAIN 12-COLUMN SINGLE-SCREEN EXECUTIVE BOARD */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* LEFT 7 COLS: 6-STAGE VIRTUAL INVESTIGATION MATRIX (2x3) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-teal-900">
                  6 Bosqichli Virtual Tergov Zanjiri (1 klikda jonli ochish)
                </div>
                <span className="text-[11px] font-mono text-slate-600">102 → Sud</span>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {WORKFLOW_STEPS.map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => onStartInvestigation(item.step)}
                    className="group text-left p-3.5 rounded-xl bg-[#F5F7F6] hover:bg-[#DFF0E8] border border-[#C2CFC9] hover:border-[#0F766E] transition-all flex flex-col justify-between gap-2 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#0F766E] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {item.num}
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-teal-800">
                          {item.jpk}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-950 group-hover:text-teal-950">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{item.desc}</p>
                    </div>
                    <div className="pt-1.5 border-t border-[#D6E0DC] flex items-center justify-between text-[11px] font-semibold text-teal-800">
                      <span>Jonli ochish</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT 5 COLS: 3 VISUAL LIVE LAUNCHERS + COMPARISON LEDGER */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              {/* 3 Visual Quick-Launch Plates */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-teal-900">
                  Asosiy Vizual Modullar
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      key: 'crime',
                      title: '3D Hodisa joyi',
                      sub: 'WASD · UV skaner',
                      img: VISUAL_ASSETS.crimeSceneLab,
                      onClick: () => onNavigate('crime_scene_3d'),
                    },
                    {
                      key: 'poly',
                      title: 'AI-So‘roq',
                      sub: 'Poligraf · Svetofor',
                      img: VISUAL_ASSETS.aiPolygraph,
                      onClick: () => onStartInvestigation(4),
                    },
                    {
                      key: 'court',
                      title: 'Virtual Sud',
                      sub: 'Hukm · A4 PDF',
                      img: VISUAL_ASSETS.courtroomGavel,
                      onClick: () => onStartInvestigation(6),
                    },
                  ].map((plate) => (
                    <button
                      key={plate.key}
                      type="button"
                      onClick={plate.onClick}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#B0C2BA] bg-[#122625] text-left cursor-pointer"
                    >
                      {!imgErrors[plate.key] && (
                        <img
                          src={plate.img}
                          alt={plate.title}
                          referrerPolicy="no-referrer"
                          onError={() => setImgErrors((p) => ({ ...p, [plate.key]: true }))}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081617]/95 via-[#081617]/40 to-transparent" />
                      <div className="relative z-10 h-full p-2.5 flex flex-col justify-end">
                        <div className="text-xs font-bold text-white leading-tight">
                          {plate.title}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-300 truncate">
                          {plate.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compact Comparison Table + Mission Statement */}
              <div className="flex-1 rounded-xl border border-[#C0CEC8] bg-[#F5F7F6] p-3.5 flex flex-col justify-between gap-2.5">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    An’anaviy o‘qitish vs E-Poligon
                  </div>
                  <div className="divide-y divide-[#D6DFDB] text-xs">
                    {COMPARE_ROWS.map((row) => (
                      <div
                        key={row.label}
                        className="py-1.5 grid grid-cols-12 gap-2 items-baseline"
                      >
                        <span className="col-span-4 font-semibold text-slate-900">
                          {row.label}
                        </span>
                        <span className="col-span-4 text-slate-500">{row.oldVal}</span>
                        <span className="col-span-4 font-semibold text-teal-800 text-right">
                          {row.newVal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CFD9D5] font-editorial italic text-xs sm:text-sm text-slate-800">
                  «Tergovchi va prokuror yordamchisi xatoni real fuqaroda emas, virtual poligonda o‘rganadi.»
                </div>
              </div>
            </div>
          </div>

          {/* ROW 4: CLEAN EXECUTIVE ACTION FOOTER */}
          <div className="pt-3 border-t border-[#C0CEC8] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-700">
              <span className="font-semibold text-teal-900">100% O‘zR JK / JPK · PF-257</span>
              <span className="text-slate-400">·</span>
              <span>Oflayn (PWA) barqaror</span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 text-teal-800 font-semibold">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ovozli stend tayyor</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('crime_scene_3d')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#A8BDB5] bg-[#F2F4F3] hover:bg-[#DCE7E3] text-teal-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>3D Xonani ochish</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onStartInvestigation(1)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Virtual tergovni boshlash</span>
              </button>
            </div>
          </div>
        </section>

        {/* Fullscreen Overlay for Top E-Poligon Ovozli Stand */}
        <AnimatePresence>
          {epoligonFullscreen && (
            <motion.div
              ref={epoligonFsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] w-screen h-screen bg-[#0B1730] flex flex-col"
            >
              <div className="h-[52px] px-5 bg-[#0B1730] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <EPoligonLogo size="xs" />
                  <span>1-qism · E-Poligon Ovozli Stend (Katta ekran)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeEpoligonFullscreen();
                      window.setTimeout(() => {
                        scrollToTablet();
                        toggleTabletFullscreen();
                      }, 120);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>2-qism: 1-Ekranli Planshetga o‘tish</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={closeEpoligonFullscreen}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Yopish</span>
                  </button>
                </div>
              </div>
              <iframe
                src="/assets/aistudio/E-POLIGON__________1a8a09b0.html"
                title="E-Poligon ovozli stend to‘liq ekran"
                className="w-full flex-1 border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
