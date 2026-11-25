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
} from 'lucide-react';
import { NavView, SimulationState } from '../types/simulation';

interface PresentationTabletViewProps {
  state: SimulationState;
  onNavigate: (view: NavView) => void;
  onStartInvestigation: (step?: number) => void;
}

const SIX_STEPS = [
  {
    step: 1,
    title: '102 Xabari',
    jpk: 'JPK 322, 329',
    summary: 'Shakl-1 ro‘yxati va kechiktirib bo‘lmas choralar',
  },
  {
    step: 2,
    title: 'Dalillar doskasi',
    jpk: 'JPK 81, 95¹',
    summary: 'Bank, Telegram, IP/IMEI va 3D hodisa joyi',
  },
  {
    step: 3,
    title: 'So‘rov va Qaror',
    jpk: 'JPK 321, 331',
    summary: 'Idoralararo so‘rovlar va JPK auditi',
  },
  {
    step: 4,
    title: 'AI-So‘roq',
    jpk: 'JPK 96, PF-257',
    summary: 'Svetofor murabbiy, alibi fosh etish, etika',
  },
  {
    step: 5,
    title: 'Prokuror nazorati',
    jpk: 'JPK 381, 384',
    summary: 'Ayblov xulosasi auditi va xato narxi',
  },
  {
    step: 6,
    title: 'Virtual Sud',
    jpk: 'JPK 416, 419',
    summary: 'AI-Advokat e’tirozi va Sudya hukmi',
  },
];

export const PresentationTabletView: React.FC<PresentationTabletViewProps> = ({
  state,
  onNavigate,
  onStartInvestigation,
}) => {
  const [showPitchNotes, setShowPitchNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleCopyPitch = () => {
    const pitchText = `Hurmatli hakamlar hay'ati!
Biz Huquqni muhofaza qilish akademiyasi uchun yaratilgan «E-Tergov Lab» — virtual tergov va kriminalistika simulyatorini taqdim etamiz.

1. MUAMMO: Talabalar nazariy JPK normalarini o‘qiydi, lekin 102 xabaridan sud hukmigacha bo‘lgan real amaliyot, raqamli dalillar va 3D hodisa joyini ko‘zdan kechirish ko‘nikmasi yetishmaydi.
2. YECHIM: Yagona platformada 6 bosqichli to‘liq protsessual zanjir — barcha bosqichlar jonli namoyish uchun ochiq: 102 xabari, Dalillar doskasi, Idoralararo so‘rovlar, AI-So‘roq, Prokuror nazorati va Virtual Sud.
3. 3D HODISA JOYI & EKSPERTIZA: WASD boshqaruvli interaktiv 3D xona (xona.glb), 5 ta ashyoviy va raqamli dalil (Dalil_Pichoq, Dalil_Xat, Dalil_Kompyuter, Dalil_Smartfon, Dalil_Seyf) hamda ularning JPK 68, 95¹, 172, 180, 184-moddalari asosidagi 5 ta rasmiy sud ekspertizasi xulosalari (№ 2026/11-418 dan № 2026/11-422 gacha).
4. DUAL AI & NATIJA: Gibrid AI so‘roq «Svetofor» murabbiyi (Smart-Lock #4821 va 21:22 restoran kamerasi ziddiyatini fosh etish), PF-257 etika indeksi, 72 soatlik muddat taymeri, Cadet Duel va o‘qituvchi analitikasi.`;
    navigator.clipboard.writeText(pitchText);
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
      {/* Compact Presenter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E2E8F0] px-4 py-3 rounded-xl">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            Yagona Taqdimot Plansheti (1-Slayd)
          </h2>
          <p className="text-xs text-slate-500">
            Butun E-Tergov Lab tizimi bitta ekranda · Har bir bosqich va modulga 1 bosishda jonli o‘ting
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPitchNotes((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showPitchNotes
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Nutq tezislari</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Ekrandan chiqish' : 'To‘liq ekran'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible 2-Minute Pitch Notes */}
      {showPitchNotes && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200">
            <h3 className="text-xs font-bold text-amber-950">
              Taqdimot uchun 2 daqiqalik nutq rejasi
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-950 text-xs font-medium hover:bg-amber-100 cursor-pointer"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Nusxalandi' : 'Matnni nusxalash'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPitchNotes(false)}
                className="text-xs font-semibold text-amber-900 hover:underline px-1.5 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-800 leading-relaxed">
            <div className="bg-white border border-amber-200/80 rounded-lg p-3">
              <div className="font-bold text-[#0F172A] mb-1">00:00–00:30 · Muammo</div>
              <p>
                Kadetlar tergovni qog‘ozda o‘rganadi; real 102 bosimi, 3D hodisa joyi, raqamli billing va sud bahsi amaliyotda qolib ketadi.
              </p>
            </div>
            <div className="bg-white border border-amber-200/80 rounded-lg p-3">
              <div className="font-bold text-[#1D4ED8] mb-1">00:30–01:00 · 6 Bosqich</div>
              <p>
                102 xabaridan Virtual Sud hukmigacha to‘liq protsessual zanjir — 72 soatlik muddat taymeri va PF-257 etika nazorati bilan.
              </p>
            </div>
            <div className="bg-white border border-amber-200/80 rounded-lg p-3">
              <div className="font-bold text-amber-800 mb-1">01:00–01:30 · 3D & Ekspertiza</div>
              <p>
                WASD boshqaruvli 3D hodisa joyida 5 ta dalil (Dalil_Pichoq..Dalil_Seyf) va JPK talabidagi 5 ta rasmiy sud ekspertizasi xulosasi.
              </p>
            </div>
            <div className="bg-white border border-amber-200/80 rounded-lg p-3">
              <div className="font-bold text-emerald-800 mb-1">01:30–02:00 · Dual AI & Natija</div>
              <p>
                Svetofor so‘roq murabbiyi, Smart-Lock #4821 alibisini fosh etish, AI-Advokat/Sudya va o‘qituvchi analitikasi orqali xatolar 65% kamayadi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SINGLE UNIFIED PRESENTATION TABLET (1-SLAYD — BUTUN LOYIHA BITTA EKRANDA) */}
      {/* ===================================================================== */}
      <div className="mx-auto w-full bg-[#0F172A] p-3 sm:p-4 rounded-[2rem] border-2 border-slate-700 shadow-2xl">
        {/* Inner Tablet Screen — Single Slide Layout */}
        <div className="bg-[#0B1222] text-slate-100 rounded-[1.45rem] border border-slate-800 overflow-hidden flex flex-col">
          {/* Tablet Top Strip */}
          <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-white whitespace-nowrap">E-Tergov Lab · HMQA</span>
              <span className="text-slate-600" aria-hidden="true">/</span>
              <span className="text-slate-400 hidden sm:inline">
                O‘zbekiston Respublikasi Huquqni muhofaza qilish akademiyasi
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono tabular-nums">
              <span>JPK & PF-257</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-emerald-400">Barcha 6 bosqich ochiq</span>
            </div>
          </div>

          {/* Single-Slide Core Canvas */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* ROW 1: Hero Title + Problem/Solution + 4 KPI Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-blue-400">
                    Virtual jinoyat-protsessual va kriminalistika poligoni
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight text-balance">
                    102 xabaridan Virtual Sudgacha — yagona interaktiv tergov tizimi
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Talabalarni real protsessual muddat, 3D hodisa joyini ko‘zdan kechirish, rasmiy ekspertizalar, AI-so‘roq va sud tortishuvida tayyorlovchi amaliy simulyator.
                  </p>
                </div>

                {/* Active Cases Inline Summary (Clean Unboxed Hairline Divider) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-mono text-blue-400">
                      1-Kazus · JK 168-modda 3-qism
                    </div>
                    <div className="text-xs font-semibold text-white">
                      42,5 mln so‘m kiberfiribgarlik (TuronPay / OTP)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Bank ko‘chirmasi · Telegram phishing · IMEI & BS-TSH-104
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-mono text-amber-400">
                      2-Kazus · JK 97-modda 1-qism (CASE-02)
                    </div>
                    <div className="text-xs font-semibold text-white">
                      «Soxta xayrlashuv xati» (3D xona + alibi fosh etish)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dalil_Pichoq · Dalil_Xat · Smart-Lock #4821 · 21:22 kamera
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 4 Core Metrics + Quick Launch */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold font-mono tabular-nums text-blue-400">6</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">To‘liq JPK bosqichi</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">5 ta</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">3D dalil + Sud ekspertizasi</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">72 soat</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Protsessual muddat taymeri</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">-65%</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Protsessual xatolar kamayishi</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onStartInvestigation(1)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Tergovni boshlash</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('crime_scene_3d')}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Xona</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 2: Interactive 6-Step Direct Launcher Strip (ALL 6 STEPS UNLOCKED) */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-200">
                  6 bosqichli protsessual zanjir — istalgan bosqichni bosib jonli ko‘rsating
                </div>
                <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                  Joriy talaba: {state.studentName} · Ball: {state.baseScore} · Etika: {state.ethicsIndex}%
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {SIX_STEPS.map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => onStartInvestigation(item.step)}
                    className="group text-left bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/60 rounded-xl p-3 transition-colors cursor-pointer flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="w-5 h-5 rounded-md bg-blue-600/20 border border-blue-500/40 text-blue-300 font-mono text-[11px] font-bold flex items-center justify-center">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 truncate">
                        {item.jpk}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                        {item.summary}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ROW 3: 3 Core Pillars (3D Scene + Hybrid AI + Analytics/Duel) with Direct Demo Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 border-t border-slate-800 pt-4">
              {/* Pillar 1: 3D Crime Scene & Forensic Expertise */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <Box className="w-4 h-4 shrink-0" />
                    <span>3D Hodisa joyi va 5 ta Sud Ekspertizasi</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    W,A,S,D bilan erkin yurish, <span className="font-mono text-slate-200">xona.glb</span> yuklash va 5 ta dalilning (№ 2026/11-418..422) daktiloskopik, xatshunoslik, raqamli ekspertiza modallari.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('crime_scene_3d')}
                  className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
                >
                  <span>3D Hodisa joyini ochish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pillar 2: Dual AI & Procedural Guardrails */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>Gibrid AI-So‘roq va Virtual Sud</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    So‘roq «Svetofor» murabbiyi (JPK 96), PF-257 etika dilemmasi, 21:22 / Smart-Lock #4821 ziddiyatini fosh etish, AI-Advokat e’tirozi va AI-Sudya hukmi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onStartInvestigation(4)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-blue-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>AI-So‘roq</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartInvestigation(6)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Scale className="w-3 h-3" />
                    <span>Virtual Sud</span>
                  </button>
                </div>
              </div>

              {/* Pillar 3: Cadet Duel & Instructor Panel */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <Trophy className="w-4 h-4 shrink-0" />
                    <span>Reyting, Cadet Duel va O‘qituvchi Paneli</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Guruhlar kesimida protsessual xatolar tahlili, 60 soniyali JPK blits-duellari, unvonlar tizimi va o‘qituvchi uchun tezkor kazus konstruktori.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('leaderboard')}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>Reyting</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('analytics')}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <BarChart3 className="w-3 h-3 text-blue-400" />
                    <span>O‘qituvchi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                    title="102 Navbatchilik bosh sahifasi"
                  >
                    <Radio className="w-3 h-3 text-emerald-400" />
                    <span>102</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
