import React, { useState, useEffect } from 'react';
import {
  Network,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Wand2,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { DigitalCustodyPassport } from './DigitalCustodyPassport';
import { SMART_LOCK_PASSPORT } from '../scene/evidenceCatalog';

interface CyberTraceNode {
  id: string;
  step: number;
  label: string;
  sublabel: string;
  technicalTrace: string;
  jpkSignificance: string;
  jpkRef: string;
  isCriticalHit?: boolean;
  showSmartLockPassport?: boolean;
}

const CASE_1_NODES: CyberTraceNode[] = [
  {
    id: 'c1-victim',
    step: 1,
    label: 'Jabrlanuvchi',
    sublabel: 'J. Karimov · TuronPay',
    technicalTrace:
      'Jabrlanuvchi qurilmasida soat 14:10 da Telegram orqali kelgan soxta xavfsizlik xabari ochilgan va bir martalik 482915 SMS-kodi kiritilgan.',
    jpkSignificance:
      '102 xabari va jabrlanuvchining dastlabki arizasi jinoyat alomatlarini qayd etish uchun protsessual asos bo‘lib xizmat qiladi.',
    jpkRef: 'O‘zR JPK 322, 329-moddalar',
  },
  {
    id: 'c1-phishing',
    step: 2,
    label: 'Phishing havola',
    sublabel: 'Soxta 3D-Secure sahifa',
    technicalTrace:
      '«phishing_gate.py» asosidagi klon sahifa bank logotipi bilan niqoblanib, karta rekvizitlari va 3D-Secure tasdiq kodini real vaqtda ushlab qolgan.',
    jpkSignificance:
      'Aldash va ishonchni suiiste’mol qilish usuli — harakatni axborot texnologiyalari orqali sodir etilgan firibgarlik sifatida kvalifikatsiya qiladi.',
    jpkRef: 'O‘zR JK 168-modda 3-qismi · JPK 81-modda',
  },
  {
    id: 'c1-ip',
    step: 3,
    label: 'IP: 185.139.137.44',
    sublabel: 'Yunusobod proksi tuguni',
    technicalTrace:
      'Tarmoq loglari va Dalil_Kompyuter disk obrazi (ekspertiza № 2026/11-420) phishing boshqaruv paneli aynan 185.139.137.44 IP manzilidan boshqarilganini tasdiqlaydi.',
    jpkSignificance:
      'SHA-256 xesh-qiymati bilan muhrlangan server loglari elektron dalil sifatida ayblovning asosiy texnik tayanchini tashkil etadi.',
    jpkRef: 'O‘zR JPK 95¹, 204²-moddalar',
    isCriticalHit: true,
  },
  {
    id: 'c1-bot',
    step: 4,
    label: 'Telegram bot: @orion_verify_bot',
    sublabel: 'OTP kod yig‘uvchi bot',
    technicalTrace:
      'Faradey paketida olingan smartfondan (ekspertiza № 2026/11-421) @orion_verify_bot boshqaruv tokeni va 482915 OTP kodi kelib tushgan avtomatik jurnallar tiklandi.',
    jpkSignificance:
      'Qurilma tarmoqdan izolyatsiya qilingani sababli masofadan o‘chirish oldi olingan va elektron dalilning maqbulligi saqlab qolingan.',
    jpkRef: 'O‘zR JPK 180, 204²-moddalar',
  },
  {
    id: 'c1-card',
    step: 5,
    label: 'Tranzit karta: 8600****9104',
    sublabel: '42 500 000 so‘m · ATM #412',
    technicalTrace:
      'Soat 14:15 da 42 500 000 so‘m mablag‘ 8600****9104 kartaga o‘tkazilgan, soat 14:19 da Yunusobod ATM #412 bankomatidan 15 000 000 so‘m naqdlashtirilgan.',
    jpkSignificance:
      'Rasmiy bank ko‘chirmasi va ATM kamera tasviri moddiy zarar miqdori hamda mablag‘ning yakuniy oluvchisini uzil-kesil isbotlaydi.',
    jpkRef: 'O‘zR JPK 88, 95-moddalar',
  },
  {
    id: 'c1-suspect',
    step: 6,
    label: 'Gumonlanuvchi',
    sublabel: 'D. Tursunov · IMEI 354892104491820',
    technicalTrace:
      'IMEI 354892104491820 qurilmasi BS-TSH-104 (Yunusobod) stansiyasida qayd etilgan; Dalil_Seyf (№ 2026/11-422) dagi karta va tutqichda uning barmoq izlari aniqlandi.',
    jpkSignificance:
      'Barcha elektron va moddiy dalillar bir-birini to‘ldirib, gumonlanuvchining Sergeli alibisini rad etadi va JK 168-modda 3-qismi bilan ayblovni asoslaydi.',
    jpkRef: 'O‘zR JPK 95, 381-moddalar',
    isCriticalHit: true,
  },
];

const CASE_2_NODES: CyberTraceNode[] = [
  {
    id: 'c2-room',
    step: 1,
    label: '47-xonadon: Dalil_Pichoq & Dalil_Xat',
    sublabel: 'Ekspertiza № 418 va № 419',
    technicalTrace:
      'Dalil_Pichoq dastasida J. Karimovning 14 belgili barmoq izlari va DNK aralashmasi (№ 2026/11-418), Dalil_Xat da esa qasddan o‘zgartirilgan dastxat (№ 2026/11-419) aniqlandi.',
    jpkSignificance:
      'O‘z joniga qasd qilish sahnasini qasddan imitatsiya qilinganini va JK 97-modda 1-qismi alomatlari mavjudligini isbotlaydi.',
    jpkRef: 'O‘zR JPK 137, 172, 184-moddalar',
  },
  {
    id: 'c2-smartlock',
    step: 2,
    label: 'Smart-Lock #4821 (21:14–21:38)',
    sublabel: 'Elektron eshik qulfi jurnali',
    technicalTrace:
      '47-xonadon eshigidagi aqlli qulf tizimi aynan gumonlanuvchiga tegishli shaxsiy #4821 PIN-kodi orqali soat 21:14 da kirish va 21:38 da chiqish qaydini saqlab qolgan.',
    jpkSignificance:
      'Raqamli kirish jurnali SHA-256 xesh-qiymati bilan muhrlanib, JPK 204²-modda tartibida maqbul elektron dalil sifatida rasmiylashtirilgan.',
    jpkRef: 'O‘zR JPK 95¹, 204²-moddalar',
    isCriticalHit: true,
    showSmartLockPassport: true,
  },
  {
    id: 'c2-gps',
    step: 3,
    label: 'Avto GPS / Zaxira SIM',
    sublabel: 'Marshrut va tayanch stansiya',
    technicalTrace:
      'Gumonlanuvchi avtomobilining GPS-trekeri va zaxira SIM-karta tayanch stansiyasi 21:08–21:44 oralig‘ida xonadon joylashgan mavzeda bo‘lganini qayd etgan.',
    jpkSignificance:
      'Mustaqil telekommunikatsiya ma’lumotlari Smart-Lock #4821 jurnalini tasdiqlaydi va uchinchi shaxs versiyasini zaiflashtiradi.',
    jpkRef: 'O‘zR JPK 88, 95¹-moddalar',
  },
  {
    id: 'c2-camera',
    step: 4,
    label: 'Restoran kamerasi (21:22 — boshqa shaxs)',
    sublabel: 'Kassa videosi va chek tahlili',
    technicalTrace:
      'Soat 21:22 da restoranda J. Karimovning kartasi bilan to‘lov amalga oshirilgan, biroq kassa kamerasida mutlaqo boshqa shaxs (tanishi) qayd etilgan.',
    jpkSignificance:
      'Gumonlanuvchining restoranda bo‘lgani haqidagi ko‘rsatmasi obyektiv video-dalil bilan to‘liq inkor etiladi.',
    jpkRef: 'O‘zR JPK 95, 111-moddalar',
    isCriticalHit: true,
  },
  {
    id: 'c2-busted',
    step: 5,
    label: 'Yolg‘on alibi fosh etildi',
    sublabel: 'JK 97-modda 1-qismi · Sudga tayyor',
    technicalTrace:
      '21:14–21:38 Smart-Lock #4821 kirishi + 21:22 restoran kassa kamerasi ziddiyati + № 2026/11-418/419 ekspertizalari uzviy dalillar zanjirini hosil qildi.',
    jpkSignificance:
      'So‘roq bosqichida yuzlashtirish va Virtual Sudda himoyachining JPK 95¹-modda bo‘yicha e’tirozini rad etish uchun hal qiluvchi asos.',
    jpkRef: 'O‘zR JPK 95¹, 384, 416-moddalar',
    isCriticalHit: true,
  },
];

interface CyberTraceGraphProps {
  activeCaseId?: 'case1' | 'case2';
  solvedCases: string[];
  chainBroken: boolean;
  investigatorName: string;
  onSolveDfir: (caseId: 'case1' | 'case2', artifact: string) => void;
}

export const CyberTraceGraph: React.FC<CyberTraceGraphProps> = ({
  activeCaseId,
  solvedCases,
  chainBroken,
  investigatorName,
  onSolveDfir,
}) => {
  const [selectedCase, setSelectedCase] = useState<'case1' | 'case2'>(activeCaseId || 'case1');
  const nodes = selectedCase === 'case1' ? CASE_1_NODES : CASE_2_NODES;
  const [activeNodeId, setActiveNodeId] = useState<string>(
    (activeCaseId || 'case1') === 'case1' ? CASE_1_NODES[2].id : CASE_2_NODES[1].id
  );
  const [dfirInput, setDfirInput] = useState('');
  const [dfirFeedback, setDfirFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (activeCaseId && activeCaseId !== selectedCase) {
      setSelectedCase(activeCaseId);
      setActiveNodeId(activeCaseId === 'case1' ? CASE_1_NODES[2].id : CASE_2_NODES[1].id);
      setDfirFeedback(null);
    }
  }, [activeCaseId]);

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];
  const isSolved = solvedCases.includes(selectedCase);

  const handleSwitchCase = (nextCase: 'case1' | 'case2') => {
    setSelectedCase(nextCase);
    setActiveNodeId(nextCase === 'case1' ? CASE_1_NODES[2].id : CASE_2_NODES[1].id);
    setDfirInput('');
    setDfirFeedback(null);
  };

  const handleFillDemoArtifact = () => {
    setDfirInput(selectedCase === 'case1' ? '185.139.137.44' : '21:22');
    setDfirFeedback(null);
  };

  const handleCheckDfir = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = dfirInput.trim().toLowerCase();
    if (!cleaned) return;

    const validCase1 = cleaned === '185.139.137.44';
    const validCase2 =
      cleaned === '21:22' || cleaned === '#4821' || cleaned === '4821';

    if ((selectedCase === 'case1' && validCase1) || (selectedCase === 'case2' && validCase2)) {
      if (!isSolved) {
        onSolveDfir(selectedCase, dfirInput.trim());
      }
      setDfirFeedback({
        type: 'success',
        message:
          selectedCase === 'case1'
            ? 'Tasdiqlandi! 185.139.137.44 proksi IP manzili ekspertiza № 2026/11-420 bilan to‘liq mos keldi (+10 bonus ball).'
            : 'Tasdiqlandi! Restoran kamerasi (21:22) va Smart-Lock #4821 ziddiyati aniq topildi (+10 bonus ball).',
      });
    } else {
      setDfirFeedback({
        type: 'error',
        message:
          selectedCase === 'case1'
            ? 'Artefakt mos kelmadi. Yuqoridagi kiber-izlar grafi va № 2026/11-420 ekspertiza xulosasidagi faol proksi IP manzilini tekshiring.'
            : 'Artefakt mos kelmadi. Restoran kassa kamerasi vaqti (masalan: 21:22) yoki Smart-Lock PIN-kodini (#4821) kiriting.',
      });
    }
  };

  return (
    <section className="rounded-2xl bg-[#0B1221] text-slate-100 border border-slate-800 shadow-lg overflow-hidden">
      {/* Header + Case Switcher */}
      <div className="px-5 sm:px-6 py-4 bg-[#070D19] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Network className="w-4 h-4 text-blue-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-amber-300">
              Raqamli kriminalistika va moliyaviy oqim grafi
            </div>
            <h3 className="text-base font-bold text-white truncate">
              Kiber-izlar xaritasi va Mini-DFIR «Artefaktni o‘zing top»
            </h3>
          </div>
        </div>

        {/* Segmented Case Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => handleSwitchCase('case1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCase === 'case1'
                ? 'bg-[#1D4ED8] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Kazus (JK 168)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchCase('case2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCase === 'case2'
                ? 'bg-[#D97706] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2-Kazus (CASE-02 · JK 97)
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Interactive Directed Flow Graph (SVG + CSS Nodes) */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Har bir tugun ustiga bosib, uning texnik izi va O‘zR JPK bo‘yicha daliliy ahamiyatini ko‘ring
            </span>
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {nodes.length} ta bog‘langan tugun
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex items-stretch gap-2 min-w-[760px]">
              {nodes.map((node, idx) => {
                const isSelected = node.id === activeNode.id;
                return (
                  <React.Fragment key={node.id}>
                    <button
                      type="button"
                      onClick={() => setActiveNodeId(node.id)}
                      className={`flex-1 min-w-[128px] text-left rounded-xl p-3 border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? selectedCase === 'case1'
                            ? 'bg-blue-950/80 border-blue-400 shadow-md shadow-blue-950/60'
                            : 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-950/50'
                          : node.isCriticalHit
                            ? 'bg-[#101B31] border-slate-700 hover:border-blue-500/60'
                            : 'bg-[#0E172A] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? selectedCase === 'case1'
                                ? 'bg-blue-500 text-white'
                                : 'bg-amber-500 text-[#0B1221]'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {node.step}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 truncate">
                          {node.jpkRef.replace('O‘zR ', '')}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-snug">
                          {node.label}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {node.sublabel}
                        </div>
                      </div>
                    </button>

                    {idx < nodes.length - 1 && (
                      <div className="flex items-center justify-center shrink-0 px-0.5">
                        <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true">
                          <line
                            x1="1"
                            y1="9"
                            x2="21"
                            y2="9"
                            stroke={selectedCase === 'case1' ? '#22D3EE' : '#F59E0B'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="animate-flow-dash"
                          />
                          <path
                            d="M18 4L24 9L18 14"
                            stroke={selectedCase === 'case1' ? '#22D3EE' : '#F59E0B'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Node Forensic Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#0E172A] border border-slate-800 rounded-xl p-4">
          <div className={activeNode.showSmartLockPassport ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-sm font-bold text-white">
                  {activeNode.step}-tugun: {activeNode.label}
                </span>
              </div>
              <span className="font-mono text-xs text-blue-300">{activeNode.jpkRef}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#081020] border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="font-semibold text-amber-300">Texnik va raqamli iz</div>
                <p className="text-slate-300 leading-relaxed">{activeNode.technicalTrace}</p>
              </div>
              <div className="bg-[#081020] border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="font-semibold text-emerald-300">
                  O‘zR JPK bo‘yicha daliliy ahamiyati
                </div>
                <p className="text-slate-300 leading-relaxed">{activeNode.jpkSignificance}</p>
              </div>
            </div>
          </div>

          {activeNode.showSmartLockPassport && (
            <div className="lg:col-span-5">
              <DigitalCustodyPassport
                title={SMART_LOCK_PASSPORT.title}
                hash={SMART_LOCK_PASSPORT.hash}
                passport={SMART_LOCK_PASSPORT.custodyPassport}
                chainBroken={chainBroken}
                investigatorOverride={investigatorName}
                compact
              />
            </div>
          )}
        </div>

        {/* Mini-DFIR Quest: "Artefaktni o'zing top" */}
        <div className="bg-[#0E172A] border border-blue-500/35 rounded-xl p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Mini-DFIR tekshiruvi: «Artefaktni o‘zing top»
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedCase === 'case1'
                    ? '1-kazus loglari va ekspertizasidan gumonlanuvchi foydalangan proksi IP manzilini kiriting'
                    : '2-kazus jurnallaridan yolg‘on alibi fosh bo‘lgan aniq vaqt (masalan, 21:22) yoki Smart-Lock PIN-kodini (#4821) kiriting'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isSolved ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Topildi (+10 bonus ball)</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleFillDemoArtifact}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Namuna to‘ldirish</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleCheckDfir} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={dfirInput}
                onChange={(e) => setDfirInput(e.target.value)}
                placeholder={
                  selectedCase === 'case1'
                    ? 'Asosiy proksi IP manzilini kiriting (masalan: 185.139.137.44)...'
                    : 'Alibi buzilgan vaqt (21:22) yoki PIN-kodni (#4821) kiriting...'
                }
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#070D19] border border-slate-700 text-xs sm:text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={!dfirInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-blue-600 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Artefaktni tekshirish</span>
            </button>
          </form>

          {dfirFeedback && (
            <div
              className={`rounded-lg p-3 border text-xs flex items-start gap-2 ${
                dfirFeedback.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/50 border-red-500/50 text-red-200'
              }`}
            >
              {dfirFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{dfirFeedback.message}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
