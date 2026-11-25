import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Layers,
  Scale,
  Brain,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  FileText,
  Volume2,
  Users,
  Search,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { NavView, SimulationState } from '../types/simulation';

interface PresentationTabletViewProps {
  state: SimulationState;
  onNavigate: (view: NavView) => void;
  onStartInvestigation: (step?: number) => void;
}

export const PresentationTabletView: React.FC<PresentationTabletViewProps> = ({
  state,
  onNavigate,
  onStartInvestigation,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'onepage'>('slides');
  const [showPitchNotes, setShowPitchNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [activeStepPreview, setActiveStepPreview] = useState(1);

  const SLIDES_COUNT = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlay && viewMode === 'slides') {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES_COUNT);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay, viewMode]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES_COUNT);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES_COUNT) % SLIDES_COUNT);
  };

  const handleCopyPitch = () => {
    const pitchText = `Hurmatli hakamlar hay'ati va professor-o'qituvchilar!
Biz bugun Huquqni muhofaza qilish akademiyasi talabalari uchun yaratilgan "E-Tergov Lab" — virtual jinoyat-protsessual simulyatorini taqdim etamiz.

1. MUAMMO: Nazariy bilimlar yetarli, biroq talabalarda 102 navbatchilik xabaridan to sud hukmigacha bo'lgan real kiber-kriminalistik amaliyot kam.
2. YECHIM: 6 ta qat'iy protsessual bosqich (102 xabari, Dalillar doskasi, JPK auditi, AI-so'roq, Prokuror nazorati va Virtual sud majlisi).
3. INNOVATSIYA: Dual AI arxitekturasi — Google Gemini 4 va Anthropic Claude Sonnet 5.5 tanlovi, hamda Antigravity agenti orqali chuqur kiber-kriminalistik tahlil.
4. NATIJA: PF-257 etika indeksi, 72 soatlik muddat taymeri va protsessual xatolarni 65% ga qisqartiruvchi amaliy ta'lim poligoni.`;
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Tablet Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                E-Tergov Lab — Taqdimot Plansheti
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                HMQA PITCH DECK
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Butun platformani bitta planshetda hakamlar va taqdimot uchun namoyish qilish
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Mode switch: Slaydlar vs 1-Sahifali Xulosa */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('slides')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'slides'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interaktiv Slaydlar ({currentSlide + 1}/5)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('onepage')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'onepage'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Sahifali Xulosa
            </button>
          </div>

          {/* Pitch Script Button */}
          <button
            type="button"
            onClick={() => setShowPitchNotes(!showPitchNotes)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showPitchNotes
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Nutq Tezislari</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            title="To'liq ekranga o'tish"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Pitch Notes Drawer / Modal */}
      {showPitchNotes && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-md space-y-3 relative">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Hakamlar Oldidagi 2 Daqiqalik Nutq Matni (Cadet Pitch Script)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-900 text-xs font-medium cursor-pointer transition-colors"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Nusxalandi!' : 'Nusxa olish'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPitchNotes(false)}
                className="text-xs text-amber-700 hover:text-amber-900 font-bold px-2 py-1"
              >
                Yopish ✕
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs leading-relaxed text-amber-950">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
              <div className="font-bold text-amber-800 mb-1">00:00 - 00:30 | Muammo</div>
              <p>
                "Amaliyotda kadetlar tergov jarayonini faqat qog'ozda o'rganadi. Kiberjinoyat izlari, billinglar va sud bosqichlari amaliy ko'nikmasiz qoladi."
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
              <div className="font-bold text-blue-800 mb-1">00:30 - 01:00 | 6 Bosqich</div>
              <p>
                "E-Tergov Lab 102 qo'ng'irog'idan boshlab dalillar doskasi, JPK auditi, so'roq va sud hukmigacha to'liq virtual protsessual zanjir yaratadi."
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
              <div className="font-bold text-indigo-800 mb-1">01:00 - 01:30 | Dual AI & Antigravity</div>
              <p>
                "Bitta AI bilan cheklanmadik: Gemini 4 va Claude Sonnet 5.5 so'roqda qonuniy baho beradi, Antigravity agenti esa kiber-kriminalistik tahlil olib boradi."
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
              <div className="font-bold text-emerald-800 mb-1">01:30 - 02:00 | Natija</div>
              <p>
                "72 soatlik muddat taymeri, PF-257 etika indeksi va real vaqtda prokuror nazorati orqali protsessual xatolar 65% ga kamayadi."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* THE TABLET CHASSIS (Planshet ramkasi) */}
      {/* ========================================================================================= */}
      <div className="relative mx-auto w-full bg-slate-900 p-3 sm:p-5 md:p-6 rounded-[2.5rem] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/60 transition-all">
        {/* Hardware details: Front camera dot & ambient light sensor */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-ping opacity-75" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Tablet Inner Screen Glass */}
        <div className="relative bg-[#0B132B] text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-inner min-h-[640px] flex flex-col justify-between">
          {/* Tablet Status Bar */}
          <div className="h-8 bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-slate-200">HMQA CYBERPAD 12X</span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-400">102 Maxfiy Tarmoq</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dual AI Router: Gemini 4 + Claude 5.5 + Antigravity</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">25-Noyabr</span>
              <span className="text-emerald-400 font-bold">100% ⚡</span>
            </div>
          </div>

          {/* MAIN TABLET CONTENT AREA */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {viewMode === 'slides' ? (
              /* SLIDE 1: LOYIHA PASPORTI VA MUAMMO */
              currentSlide === 0 ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                        SLAYD 1 / 5
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        Loyiha Pasporti va Dolzarbligi
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      HMQA Ta'lim Texnologiyalari Markazi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left pitch summary */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-wider font-bold text-blue-400">
                          E-Tergov Lab Simulyatori
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                          102 Qo‘ng‘irog‘idan Sudgacha: Virtual Jinoyat-Protsessual Poligoni
                        </h1>
                        <p className="text-sm text-slate-300 leading-relaxed pt-1">
                          Huquqni muhofaza qilish akademiyasi talabalari va tergov xodimlari uchun O‘zbekiston Respublikasi Jinoyat-protsessual kodeksi (JPK) hamda PF-257-sonli Farmon talablariga to‘liq moslashtirilgan realistik simulyatsiya platformasi.
                        </p>
                      </div>

                      {/* Problem vs Solution cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Mavjud Muammo:</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Amaliyotda kadetlar faqat qog‘oz kazuslarni o‘qiydi; bank billingi, IP-adreslar, alibini so‘roqda fosh qilish va advokat bilan sud bahsi amalda qolib ketadi.
                          </p>
                        </div>

                        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Bizning Yechim:</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Interaktiv 6 bosqichli protsessual zanjir, real vaqtda JPK «Svetofor» murabbiyi, 72 soatlik muddat hisoblagichi va xatolar xaritasi.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Key Metrics Showcase */}
                    <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Platforma Ko'rsatkichlari</span>
                        <span className="text-emerald-400">Faol Tizim</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                          <div className="text-2xl font-black text-blue-400 font-mono">6</div>
                          <div className="text-[11px] text-slate-400 mt-1 font-medium">Protsessual Bosqich</div>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                          <div className="text-2xl font-black text-amber-400 font-mono">72 soat</div>
                          <div className="text-[11px] text-slate-400 mt-1 font-medium">Qonuniy Muddat Taymeri</div>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                          <div className="text-2xl font-black text-emerald-400 font-mono">42.5 mln</div>
                          <div className="text-[11px] text-slate-400 mt-1 font-medium">Kiberfiribgarlik Kazusi</div>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                          <div className="text-2xl font-black text-purple-400 font-mono">Dual AI</div>
                          <div className="text-[11px] text-slate-400 mt-1 font-medium">Gemini + Claude + Agent</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-center justify-between">
                        <span>Amaldagi Kazus: 102-2026/TSH-0418</span>
                        <button
                          type="button"
                          onClick={() => onStartInvestigation(1)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer"
                        >
                          Kazusni ochish →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentSlide === 1 ? (
                /* SLIDE 2: 6 BOSQICHLI PROTSESSUAL ZANJIR */
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                        SLAYD 2 / 5
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        6 Bosqichli To‘liq Protsessual Zanjir
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      O‘zbekiston Respublikasi JPK talablari
                    </span>
                  </div>

                  {/* 6 Step Interactive Visual Stepper */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {[
                      { step: 1, title: '102 Xabari', jpk: 'JPK 322-modda', desc: 'Shakl-1 kitobida hisobga olish, kechiktirib bo‘lmas choralar' },
                      { step: 2, title: 'Dalillar doskasi', jpk: 'JPK 81, 95-moddalar', desc: 'Bank tranzaksiyasi, IP/IMEI va kripto-xeshlar' },
                      { step: 3, title: 'JPK Auditi', jpk: 'JPK 321, 331-moddalar', desc: 'Idoralararo so‘rovlar va ish qo‘zg‘atish qarori' },
                      { step: 4, title: 'AI-So‘roq', jpk: 'JPK 96, PF-257', desc: 'Alibini fosh qilish, Svetofor baholash, advokat huquqi' },
                      { step: 5, title: 'Prokuror nazorati', jpk: 'JPK 381-modda', desc: 'Ayblov xulosasi auditi, xatolarni tuzatish' },
                      { step: 6, title: 'Virtual Sud', jpk: 'JPK 416-modda', desc: 'AI-Advokat e’tirozi va Sudya oqlov/ayblov hukmi' },
                    ].map((item) => (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => setActiveStepPreview(item.step)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          activeStepPreview === item.step
                            ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-5 h-5 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                            activeStepPreview === item.step ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.step}
                          </span>
                          <span className="text-[10px] text-blue-400 font-mono">{item.jpk}</span>
                        </div>
                        <div className="text-xs font-bold text-white mt-2 truncate">{item.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-tight">{item.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Step Deep Dive Card */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white text-sm">
                          {activeStepPreview}-bosqich tafsiloti va ta'limiy maqsadi
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onStartInvestigation(activeStepPreview)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer"
                      >
                        Bu bosqichni amalda ochish →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <div className="text-slate-400 font-semibold mb-1">Qonuniy talab:</div>
                        <p className="text-slate-200">
                          {activeStepPreview === 1 && "JPK 322-modda bo'yicha 102 xabari zudlik bilan rasmiylashtirilishi, kechiktirilmasdan dalillar mustahkamlanishi shart."}
                          {activeStepPreview === 2 && "JPK 81-modda: Har bir raqamli dalil (IP, IMEI, kartalar tranzaksiyasi) xolislik va aloqadorlik talablariga javob berishi lozim."}
                          {activeStepPreview === 3 && "JPK 321 va 331-moddalar: Jinoyat ishi qo'zg'atish qarorida 4 ta majburiy rekvizit va JK moddasini to'g'ri kvalifikatsiya qilish talab etiladi."}
                          {activeStepPreview === 4 && "JPK 96-modda va PF-257: Bosim va yo'naltiruvchi savollar qat'iyan taqiqlanadi. Advokat ishtiroki kafolatlanishi shart."}
                          {activeStepPreview === 5 && "JPK 381-modda: Prokuror ayblov xulosasini tekshiradi; agar protsessual buzilishlar bo'lsa, ish qaytariladi."}
                          {activeStepPreview === 6 && "JPK 416, 419-moddalar: Sudda advokat tergovchining eng zaif nuqtasiga zarba beradi, tergovchi asosli raddiya berishi shart."}
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <div className="text-amber-400 font-semibold mb-1">Xavf / Xato oqibati:</div>
                        <p className="text-slate-200">
                          {activeStepPreview === 1 && "Kechiktirish (-5 ball, +28 soat vaqt yo'qotiladi; kiberjinoyatchi izlarini yashiradi)."}
                          {activeStepPreview === 2 && "Noto'g'ri dalil tanlash yoki muhim billingni o'tkazib yuborish ayblovni sudda bekor qiladi."}
                          {activeStepPreview === 3 && "Noto'g'ri kvalifikatsiya (masalan JK 168 o'rniga boshqa modda tanlansa) auditdan o'tmaydi."}
                          {activeStepPreview === 4 && "Qizil savol berilsa (-10 ball) yoki advokatsiz ko'rsatma olinsa (-25 ball va PF-257 buzilishi)."}
                          {activeStepPreview === 5 && "Prokuror ayblov xulosasini rad etishi yoki kamchiliklarni tuzatish uchun 4 soat qo'shimcha sarflanishi."}
                          {activeStepPreview === 6 && "Agar tergovchi raddiya bera olmasa, ish to'liq qo'shimcha tergovga qaytariladi."}
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <div className="text-emerald-400 font-semibold mb-1">Amaliy ko'nikma:</div>
                        <p className="text-slate-200">
                          Talaba tergov xonasidagi bosim, soat millari shiddati va qonun talablari o'rtasidagi muvozanatni his qilgan holda to'g'ri qaror qabul qilishni o'rganadi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentSlide === 2 ? (
                /* SLIDE 3: DUAL AI & ANTIGRAVITY AGENT */
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                        SLAYD 3 / 5
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        Dual AI Engine & Antigravity Kriminalistika
                      </h3>
                    </div>
                    <span className="text-xs text-purple-400 font-mono font-bold">
                      GIBRID SUN'IY INTELLEKT ARXITEKTURASI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Gemini Card */}
                    <div className="bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 font-mono uppercase">Google AI</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold">Tezkor</span>
                      </div>
                      <h4 className="text-base font-bold text-white">Gemini 4 (Hydrogen)</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        So'roq davomida tergovchining savollarini «Svetofor» qoidasi bo'yicha real vaqtda baholaydi va gumonlanuvchi D.Tursunovning psixologik javoblarini generatsiya qiladi.
                      </p>
                      <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                        • Kam kechikish (Low latency)
                        <br />• JPK 96-modda me'yorlari
                      </div>
                    </div>

                    {/* Claude Card */}
                    <div className="bg-gradient-to-b from-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 font-mono uppercase">Anthropic AI</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold">Advokatura</span>
                      </div>
                      <h4 className="text-base font-bold text-white">Claude Sonnet 5.5</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Virtual sudda professional AI-Advokat sifatida tergovdagi protsessual zaifliklarni aniqlaydi va tergovchini faktlarga asoslangan raddiya berishga majbur qiladi.
                      </p>
                      <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                        • Chuqur mantiqiy tahlil
                        <br />• Sud bahsi va ritorika
                      </div>
                    </div>

                    {/* Antigravity Agent Card */}
                    <div className="bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 font-mono uppercase">Managed Agent</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-semibold">Linux Sandbox</span>
                      </div>
                      <h4 className="text-base font-bold text-white">Antigravity Agent</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Alohida xavfsiz Linux sandboksida ko'p bosqichli kiber-kriminalistik tahlil o'tkazadi (IP, IMEI, billing faktlarini tekshirib, SSE orqali jonli qadamlarni ko'rsatadi).
                      </p>
                      <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                        • Server-Sent Events (SSE)
                        <br />• Real vaqtda "Proof of Work"
                      </div>
                    </div>
                  </div>

                  {/* Architecture Banner */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">100% Server-Side Xavfsiz Proksi</div>
                        <div className="text-slate-400 text-[11px]">
                          API kalitlari brauzerga hech qachon chiqmaydi; Express orqali boshqariladi.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-2 py-1 rounded bg-slate-900 text-blue-300 border border-slate-800">GEMINI_API_KEY</span>
                      <span className="text-slate-600">+</span>
                      <span className="px-2 py-1 rounded bg-slate-900 text-amber-300 border border-slate-800">ANTHROPIC_API_KEY</span>
                    </div>
                  </div>
                </div>
              ) : currentSlide === 3 ? (
                /* SLIDE 4: JONLI METRIKALAR VA BAHOLASH */
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                        SLAYD 4 / 5
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        Talaba KPI, PF-257 Etika va Cadet Duel
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      Obyektiv baholash mexanizmi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Metric 1 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-mono text-slate-400">JPK 329</span>
                      </div>
                      <div className="text-base font-bold text-white">Protsessual Muddat (72 soat)</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Har bir tergov harakati (so'rov yuborish, ekspertiza kutish) simulyatsiya soatlarini sarflaydi. Muddat o'tsa — tergovchi jarima oladi.
                      </p>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Award className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-mono text-slate-400">PF-257</span>
                      </div>
                      <div className="text-base font-bold text-white">Etika va Inson Huquqlari</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Advokatsiz so'roq qilish yoki gumonlanuvchiga noqonuniy bosim o'tkazish etika indeksini tushiradi va sudda ishni qaytarishga olib keladi.
                      </p>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-mono text-slate-400">Cadet Duel</span>
                      </div>
                      <div className="text-base font-bold text-white">Talabalar Raqobati</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Kadetlar o'rtasida 60 soniyali tezkor JPK blits-duellari. Jonli liderlar jadvali va unvonlar (Stajyor → Katta tergovchi).
                      </p>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <span className="text-xs font-mono text-slate-400">O'qituvchi</span>
                      </div>
                      <div className="text-base font-bold text-white">Analytics & Kazus Maker</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Professorlar guruhlar kesimida zaif nuqtalarni ko'radi va bir zumda yangi maxsus kiber-kazuslar generatsiya qila oladi.
                      </p>
                    </div>
                  </div>

                  {/* Live Simulation Status Preview Bar */}
                  <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                        Joriy Talaba Holati:
                      </div>
                      <span className="text-white font-semibold">{state.studentName} ({state.studentGroup})</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-amber-400 font-mono">Ball: {state.baseScore}</span>
                      <span className="text-emerald-400 font-mono">Etika: {state.ethicsIndex}%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('leaderboard')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Reyting jadvalini ko'rish →
                    </button>
                  </div>
                </div>
              ) : (
                /* SLIDE 5: AKADEMIK TA'SIR VA ISTIQBOL */
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                        SLAYD 5 / 5
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        Akademik Ta'sir va Kelajak Rejalari
                      </h3>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      STRATEGIK TA'SIR VA MIQYOSLASH
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>O'quv Samadorligining O'sishi (Kutilayotgan natijalar)</span>
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-300">Dastlabki tergovdagi protsessual xatolar:</span>
                          <span className="font-bold text-emerald-400 font-mono">-65% ga kamayadi</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-300">Raqamli kiber-dalillarni to'g'ri mustahkamlash:</span>
                          <span className="font-bold text-blue-400 font-mono">+85% aniqlik</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-300">Sudda prokuror nazoratidan muvaffaqiyatli o'tish:</span>
                          <span className="font-bold text-purple-400 font-mono">92% tasdiqlanish</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Akademiya o'quv dasturlariga to'liq integratsiya:</span>
                          <span className="font-bold text-amber-400 font-mono">100% tayyor</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                        <span>Respublika Miqyosidagi Rivojlanish Bosqichlari</span>
                      </h4>
                      <div className="space-y-2.5 text-xs text-slate-300">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                          <span className="text-blue-400 font-bold">1.</span>
                          <div>
                            <span className="font-semibold text-white">HMQA magistratura va bakalavriatida</span>
                            <p className="text-slate-400 text-[11px] mt-0.5">Amaliy seminar va imtihon sinovlariga joriy etish.</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                          <span className="text-purple-400 font-bold">2.</span>
                          <div>
                            <span className="font-semibold text-white">IIV Akademiyasi va Milliy Gvardiya</span>
                            <p className="text-slate-400 text-[11px] mt-0.5">Idoralararo tergov guruhlari tayyorlash modulini qo'shish.</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">3.</span>
                          <div>
                            <span className="font-semibold text-white">VR (Virtual Reality) ko'zoynaklar bilan integratsiya</span>
                            <p className="text-slate-400 text-[11px] mt-0.5">Hodisa joyini 3D ko'zdan kechirish va tintuv harakatlari.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch Call To Action */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div>
                      <h4 className="font-bold text-sm">Hozirning o'zida jonli tergovni boshlang!</h4>
                      <p className="text-xs text-blue-100">102 xabari kelib tushgan, gumonlanuvchi so'roqqa chaqirilgan.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartInvestigation(1)}
                      className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-extrabold text-xs hover:bg-blue-50 transition-colors shadow cursor-pointer whitespace-nowrap"
                    >
                      102 Xabaridan Boshlash →
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* ========================================================================= */
              /* 1-SAHIFALI XULOSA PLANSHETI (All-in-one Executive Infographic Mode) */
              /* ========================================================================= */
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                      1-SAHIFALI BOSHQARUV PLANSHETI
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      E-Tergov Lab: Barcha Yo‘nalishlar Bitta Ekranida
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartInvestigation(1)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Jonli Simulyatsiya →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1: Konsepsiya va Kazus */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                      <Shield className="w-4 h-4" />
                      <span>1. Loyiha va Faol Kazus</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">42.5 mln so'm kiberfiribgarlik</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Fuqaro J.Karimovdan o'zini bank xavfsizligi deb tanishtirib fishing orqali pul o'zlashtirilgan. Gumonlanuvchi D.Tursunov so'roqda alibi da'vo qilmoqda.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                      <div className="text-slate-400">Modda: <span className="text-white font-bold">JK 168-modda 3-qism</span></div>
                      <div className="text-slate-400">Asos: <span className="text-white font-bold">JPK 322-modda</span></div>
                      <div className="text-slate-400">Muddat chegarasi: <span className="text-amber-400 font-bold">72 soat</span></div>
                    </div>
                  </div>

                  {/* Column 2: 6 Bosqich Zanjiri */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      <span>2. 6 Protsessual Bosqich</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200">1. 102 Xabari & Shakl-1</span>
                        <span className="text-emerald-400 font-mono text-[10px]">JPK 322</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200">2. Dalillar doskasi (IP/IMEI)</span>
                        <span className="text-emerald-400 font-mono text-[10px]">JPK 81, 95</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200">3. JPK Ish qo'zg'atish auditi</span>
                        <span className="text-emerald-400 font-mono text-[10px]">JPK 321, 331</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200">4. AI-So'roq & PF-257 Etika</span>
                        <span className="text-emerald-400 font-mono text-[10px]">JPK 96</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200">5. Prokuror ayblov xulosasi</span>
                        <span className="text-emerald-400 font-mono text-[10px]">JPK 381</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200">6. Virtual Sud va Sudya hukmi</span>
                        <span className="text-emerald-400 font-mono text-[10px]">JPK 416</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: AI & Innovatsiya */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                      <Cpu className="w-4 h-4" />
                      <span>3. Gibrid AI Texnologiyasi</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="font-bold text-blue-400">Gemini 4 (Hydrogen)</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">«Svetofor» savol murabbiyi & Gumonlanuvchi roli</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="font-bold text-amber-400">Claude Sonnet 5.5</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">AI-Advokat e'tirozlari & Sud bahsi</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="font-bold text-purple-400">Antigravity Agent (Linux Sandbox)</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">Jonli kriminalistik tahlil va JPK ekspertizasi</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                      PF-257 Inson huquqlari va muddat nazorati bilan kafolatlangan ta'lim.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TABLET BOTTOM CONTROL BAR (Planshetning quyi paneli) */}
          <div className="h-16 bg-slate-950/95 border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3">
            {/* Slide Dots / Quick Jump */}
            {viewMode === 'slides' ? (
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Slayd ${idx + 1}`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-mono">Executive All-in-One Dashboard</span>
            )}

            {/* Slide Navigation Buttons */}
            {viewMode === 'slides' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Oldingi slayd"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isAutoPlay
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                  title={isAutoPlay ? "Avtomatik almashtirishni to'xtatish" : "Avtomatik almashtirish (7s)"}
                >
                  {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Keyingi slayd"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Jump to Live Case Button */}
            <button
              type="button"
              onClick={() => onStartInvestigation(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>Jonli Simulyatsiya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
