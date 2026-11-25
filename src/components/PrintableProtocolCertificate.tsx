import React from 'react';
import { Printer, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { resolveActiveCaseMeta } from '../data/caseData';
import { FORENSIC_EVIDENCE_CATALOG, SMART_LOCK_PASSPORT } from '../scene/evidenceCatalog';
import { ComputedMetrics, SimulationState } from '../types/simulation';

interface PrintableProtocolCertificateProps {
  state: SimulationState;
  metrics: ComputedMetrics;
  onClose: () => void;
}

const QR_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
];

export const PrintableProtocolCertificate: React.FC<PrintableProtocolCertificateProps> = ({
  state,
  metrics,
  onClose,
}) => {
  const cleanStudentName = state.studentName.replace(/\s*\(Siz\)\s*/g, '');
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);
  const activeCaseNumber = activeCase.caseNumber;
  const activeCaseTitle = `${activeCase.title} (${activeCase.shortCategory})`;

  const chainBroken = state.step1ChoiceId === 'informal_call';
  const todayStr = new Date().toLocaleDateString('uz-UZ');
  const certSerial = `HMQA-ET-2026-${String(metrics.totalScore).padStart(3, '0')}4`;

  const evidenceRows = [
    ...Object.values(FORENSIC_EVIDENCE_CATALOG).map((ev) => ({
      code: ev.custodyPassport.evidenceCode,
      title: ev.title,
      storage: ev.custodyPassport.storageCondition,
      hash: ev.hash,
      report: ev.expertiseReport?.reportNumber ?? 'Bayonnoma',
    })),
    {
      code: SMART_LOCK_PASSPORT.custodyPassport.evidenceCode,
      title: SMART_LOCK_PASSPORT.title,
      storage: SMART_LOCK_PASSPORT.custodyPassport.storageCondition,
      hash: SMART_LOCK_PASSPORT.hash,
      report: 'JPK 204² jurnal',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-backdrop fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="print-only-sheet bg-white text-[#0F172A] w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-300 shadow-2xl">
        {/* Non-printable Action Bar */}
        <div className="no-print sticky top-0 z-10 bg-[#0B1221] text-white px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-100">
              «E-Tergov» Rasmiy bayonnomasi va Malaka sertifikati (A4 PDF)
            </div>
            <div className="text-[11px] text-slate-300">
              Chop etish oynasida «PDF sifatida saqlash» bandini tanlab hujjatni yuklab olishingiz mumkin
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish / PDF saqlash</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable White Paper Body */}
        <div id="printable-protocol" className="p-6 sm:p-10 space-y-7 bg-white text-black">
          {/* SECTION 1: OFFICIAL INVESTIGATION & PROSECUTOR PROTOCOL */}
          <div className="space-y-5">
            <div className="text-center border-b-2 border-[#0F172A] pb-4 space-y-1">
              <div className="text-[11px] font-semibold tracking-wide text-slate-700">
                O‘ZBEKISTON RESPUBLIKASI HUQUQNI MUHOFAZA QILISH AKADEMIYASI
              </div>
              <div className="text-xs text-slate-600">
                «Kiberxavfsizlikni huquqiy ta’minlash» magistratura mutaxassisligi · «E-Tergov Lab» laboratoriyasi
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] pt-2 leading-snug">
                HODISA JOYINI KO‘ZDAN KECHIRISH VA PROKUROR NAZORATI BAYONNOMASI
              </h1>
              <div className="text-xs font-mono text-slate-600 tabular-nums">
                O‘zR JPK 137, 203, 204² va 381-moddalari tartibida tuzildi · Sana: {todayStr}
              </div>
            </div>

            {/* Case & Investigator Passport Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-slate-300 rounded-lg p-4 bg-slate-50/70">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500">Mas’ul tergovchi (tinglovchi): </span>
                  <span className="font-bold text-[#0F172A]">{cleanStudentName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Akademik guruh: </span>
                  <span className="font-mono font-semibold">{state.studentGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500">Tergov unvoni: </span>
                  <span className="font-semibold">{metrics.rankTitle}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500">Jinoyat ishi raqami: </span>
                  <span className="font-mono font-semibold">{activeCaseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Kazus mazmuni: </span>
                  <span className="font-semibold">{activeCaseTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500">Protsessual muddat sarfi: </span>
                  <span className="font-mono tabular-nums font-semibold">
                    {state.hoursUsed} / {state.totalHoursBudget} soat
                  </span>
                </div>
              </div>
            </div>

            {/* Chain of Custody Admissibility Banner */}
            <div
              className={`rounded-lg border p-3.5 text-xs flex items-center justify-between gap-3 ${
                chainBroken
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {chainBroken ? (
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>
                  {chainBroken
                    ? 'JPK 95¹-MODDA: DALILLAR ZANJIRIDA PROTSESSUAL BUZILISH QAYD ETILDI'
                    : 'MAQBUL DALILLAR ZANJIRI — O‘zR JPK 204²-MODDA (SHA-256 O‘ZGARTIRILMAGAN)'}
                </span>
              </div>
              <span className="font-mono tabular-nums font-semibold shrink-0">
                Etika (PF-257): {state.ethicsIndex}%
              </span>
            </div>

            {/* Collected Evidence & SHA-256 Table */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-[#0F172A]">
                1. Olingan raqamli va ashyoviy dalillar reyestri (SHA-256 nazorat xeshlari)
              </h2>
              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                    <tr>
                      <th className="py-2 px-2.5 font-semibold">Kod</th>
                      <th className="py-2 px-2.5 font-semibold">Dalil nomi va saqlash sharti</th>
                      <th className="py-2 px-2.5 font-semibold">Ekspertiza / Asos</th>
                      <th className="py-2 px-2.5 font-semibold">SHA-256 xesh-qiymati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {evidenceRows.map((row) => (
                      <tr key={row.code}>
                        <td className="py-2 px-2.5 font-mono font-semibold whitespace-nowrap">
                          {row.code}
                        </td>
                        <td className="py-2 px-2.5">
                          <div className="font-semibold text-[#0F172A]">{row.title}</div>
                          <div className="text-[10px] text-slate-600">{row.storage}</div>
                        </td>
                        <td className="py-2 px-2.5 font-mono whitespace-nowrap text-slate-700">
                          {row.report}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[10px] text-slate-700 break-all">
                          {row.hash.slice(0, 18)}…{row.hash.slice(-10)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prosecutor Audit & Virtual Court Outcome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border border-slate-300 rounded-lg p-3.5 space-y-1">
                <div className="font-bold text-[#0F172A]">
                  2. Prokuror nazorati natijasi (JPK 381-modda)
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {state.prosecutorReview.submitted
                    ? state.prosecutorReview.status === 'approved'
                      ? 'Ayblov xulosasi prokuror nazoratidan muvaffaqiyatli o‘tdi va sud muhokamasiga yo‘naltirildi.'
                      : `Prokuror tekshiruvida ${state.prosecutorReview.flags.length} ta kamchilik qayd etildi.`
                    : 'Prokuror nazorati chek-listi va tergov materiallari raqamli tizimda shakllantirildi.'}
                </p>
              </div>
              <div className="border border-slate-300 rounded-lg p-3.5 space-y-1">
                <div className="font-bold text-[#0F172A]">
                  3. Virtual Sud qarori (JPK 416 / 419-moddalar)
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {state.courtSession.verdictIssued
                    ? state.courtSession.verdictTitle
                    : 'Sud majlisi himoya raddiyasi va yakuniy hukm bosqichiga tayyor holatda qayd etildi.'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: HMQA E-TERGOV LAB QUALIFICATION CERTIFICATE + SVG QR */}
          <div className="print-break-inside-avoid border-2 border-[#0F172A] rounded-xl p-5 sm:p-6 bg-slate-50/40 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-semibold text-[#1D4ED8]">
                  RAQAMLI NATIJA TASDIQNOMASI · SERIYA: {certSerial}
                </div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  HMQA «E-Tergov Lab» Malaka Sertifikati
                </h2>
                <p className="text-xs text-slate-600">
                  Ushbu tasdiqnoma <strong className="text-[#0F172A]">{cleanStudentName}</strong> ({state.studentGroup}) tomonidan
                  virtual kriminalistika va jinoyat-protsessual tergov simulyatsiyasi muvaffaqiyatli bajarilganini tasdiqlaydi.
                </p>
              </div>

              {/* Deterministic Vector SVG QR Code */}
              <div className="flex flex-col items-center shrink-0">
                <div className="p-1.5 bg-white border border-slate-300 rounded-lg">
                  <svg
                    width="76"
                    height="76"
                    viewBox="0 0 21 21"
                    shapeRendering="crispEdges"
                    role="img"
                    aria-label="HMQA raqamli tasdiq QR-kodi"
                  >
                    <rect width="21" height="21" fill="#FFFFFF" />
                    {QR_MATRIX.map((row, rIdx) =>
                      row.map((cell, cIdx) =>
                        cell === 1 ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill="#0F172A"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <span className="font-mono text-[9px] text-slate-500 mt-1">{certSerial}</span>
              </div>
            </div>

            {/* 4 KPI Scorecard Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                <div className="text-[10px] text-slate-500">Yakuniy ball</div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#1D4ED8]">
                  {metrics.totalScore}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                <div className="text-[10px] text-slate-500">JPK aniqligi</div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#0F172A]">
                  {metrics.proceduralAccuracy}%
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                <div className="text-[10px] text-slate-500">Muddat rioyasi</div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#059669]">
                  {metrics.deadlineCompliance}%
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                <div className="text-[10px] text-slate-500">Dalil kuchi</div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#D97706]">
                  {metrics.evidenceStrength}%
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500">Sudga o‘tish</div>
                <div className="text-lg font-bold font-mono tabular-nums text-[#0F172A]">
                  {metrics.cleanCourtRate}%
                </div>
              </div>
            </div>

            {/* Signature Line */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4 text-xs text-slate-600">
              <div>
                <div className="font-semibold text-[#0F172A]">
                  Huquqni muhofaza qilish akademiyasi
                </div>
                <div className="text-[11px]">
                  «Kiberxavfsizlikni huquqiy ta’minlash» kafedrasi · Elektron tasdiq
                </div>
              </div>
              <div className="text-right font-mono tabular-nums text-[11px]">
                <div>Tasdiqlangan sana: {todayStr}</div>
                <div className="text-emerald-700 font-semibold">
                  Haqiqiylik kodi: SHA256-HMQA-{metrics.totalScore}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
