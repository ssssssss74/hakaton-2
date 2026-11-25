import React, { useMemo } from 'react';
import { Printer, X, CheckCircle2, Shield, QrCode } from 'lucide-react';
import { EVIDENCE_CLUES, JK_OPTIONS, resolveActiveCaseMeta } from '../data/caseData';
import { FORENSIC_EVIDENCE_CATALOG } from '../scene/evidenceCatalog';
import { SimulationState } from '../types/simulation';
import { EPoligonLogo } from './EPoligonLogo';

interface OfficialDocumentModalProps {
  type: 'decision' | 'indictment';
  state: SimulationState;
  onClose: () => void;
}

export const OfficialDocumentModal: React.FC<OfficialDocumentModalProps> = ({
  type,
  state,
  onClose,
}) => {
  const isDecision = type === 'decision';
  const activeCase = resolveActiveCaseMeta(state.activeCaseId, state.customCases);
  const selectedJkLabel =
    JK_OPTIONS.find((opt) => opt.value === state.decisionForm.jkArticle)?.label ||
    activeCase.expectedJkLabel;

  const pinnedEvidenceTitles = useMemo(() => {
    const titles: string[] = [];
    for (const id of state.pinnedClueIds) {
      const clue = EVIDENCE_CLUES.find((c) => c.id === id);
      if (clue) {
        titles.push(`${clue.sourceLabel}: ${clue.title}`);
        continue;
      }
      const forensic = FORENSIC_EVIDENCE_CATALOG[id];
      if (forensic) {
        titles.push(
          `${forensic.category}: ${forensic.title}${forensic.expertiseReport ? ` (${forensic.expertiseReport.reportNumber})` : ''}`
        );
      }
    }
    return titles;
  }, [state.pinnedClueIds]);

  const eSignatureCode = useMemo(() => {
    const seed = `${activeCase.caseNumber}-${type}-${state.studentName}`;
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `ESIGN-${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}/HMQA`;
  }, [activeCase.caseNumber, type, state.studentName]);

  const docTitle = isDecision
    ? 'JINOYAT ISHI QO‘ZG‘ATISH VA TERGOVGA QABUL QILISH TO‘G‘RISIDA QAROR'
    : 'JINOYAT ISHI BO‘YICHA AYBLOV XULOSASI';

  const docNumber = isDecision
    ? `QAROR № ${activeCase.caseNumber}`
    : `AYBLOV № ${activeCase.caseNumber}-A`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none">
        {/* Modal Top Actions (Hidden in print) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <Shield className="w-4 h-4" />
            <span>Rasmiy Protsessual Hujjat Blankasi (JPK talablari)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Printable Legal Document Content */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-6 text-slate-900 font-serif leading-relaxed text-sm print:p-0 print:text-xs">
          {/* State Emblem & Header */}
          <div className="text-center space-y-2 border-b-2 border-double border-slate-300 pb-6">
            <div className="flex justify-center">
              <EPoligonLogo size="lg" className="rounded-2xl shadow-md border-2 border-teal-800/30" />
            </div>

            <div className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
              O‘zbekiston Respublikasi Huquqni Muhofaza Qilish Akademiyasi
            </div>
            <div className="font-sans text-xs text-slate-600">
              {activeCase.district}
            </div>
            <div className="font-mono text-xs text-slate-500 font-semibold pt-1">
              Ish raqami: {activeCase.caseNumber} · {docNumber}
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center pt-2">
            <h1 className="text-base sm:text-lg font-bold font-sans tracking-wide uppercase text-slate-950">
              {docTitle}
            </h1>
            <div className="font-sans text-xs text-slate-500 mt-1">
              {activeCase.district} · {activeCase.receivedDate}
            </div>
          </div>

          {/* Opening Paragraph */}
          <p className="text-justify indent-8">
            HMQA tinglovchisi, tergovchi <strong>{state.studentName}</strong> ({state.studentGroup}),{' '}
            {activeCase.district} Navbatchilik qismiga {activeCase.receivedDate} kuni soat {activeCase.receivedTime} da kelib tushgan{' '}
            <strong>{activeCase.caseNumber}</strong>-sonli «{activeCase.title}» bo‘yicha tergovga qadar tekshiruv materiallarini o‘rganib chiqib,
          </p>

          {/* Facts Section */}
          <div className="space-y-2">
            <div className="font-sans font-bold text-xs uppercase tracking-wide text-slate-700">
              ANIQLADI:
            </div>
            <p className="text-justify indent-8">
              {activeCase.summary102}
            </p>
            <p className="text-justify indent-8">
              Jabrlanuvchi / murojaat qiluvchi tomon: <strong>{activeCase.victimName}</strong>.
              Gumonlanuvchi shaxs: <strong>{activeCase.suspectName}</strong>.
              Ish bo‘yicha yetkazilgan zarar / tajovuz ob’ekti: <strong>{activeCase.damageAmount}</strong>.
            </p>
          </div>

          {/* Resolution / Order */}
          <div className="space-y-2 pt-2">
            <div className="font-sans font-bold text-xs uppercase tracking-wide text-slate-700">
              {isDecision ? 'QAROR QILDIM:' : 'AYBLOV XULOSASI:'}
            </div>
            <ol className="list-decimal pl-8 space-y-2 text-justify">
              <li>
                Ushbu holat yuzasidan O‘zbekiston Respublikasi <strong>{selectedJkLabel}</strong> bilan jinoyat ishi qo‘zg‘atilsin va tergov yurituviga qabul qilinsin.
              </li>
              <li>
                {pinnedEvidenceTitles.length > 0 ? (
                  <>
                    To‘plangan va dalillar doskasiga biriktirilgan ({pinnedEvidenceTitles.length} ta) ashyoviy hamda raqamli dalillar O‘zR JPK 81, 95¹ va 204²-moddalari tartibida ish materiallariga qo‘shilsin:
                    <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs font-sans text-slate-800">
                      {pinnedEvidenceTitles.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  'Ish bo‘yicha to‘plangan barcha ashyoviy va raqamli dalillar JPK 81 va 204²-moddalari tartibida bayonnoma bilan ish materiallariga qo‘shilsin.'
                )}
              </li>
              <li>
                Gumonlanuvchi <strong>{activeCase.suspectName}</strong>ga nisbatan JPK 47–48-moddalari talablari asosida himoyachi ishtirokida protsessual maqom berilib, tegishli ehtiyot chorasi ko‘rilsin.
              </li>
              <li>
                Ushbu hujjat nusxasi 24 soat ichida qonuniylikni ta’minlash va nazorat yuritish uchun tegishli hudud prokuroriga yuborilsin (JPK 331 / 381-moddalar).
              </li>
            </ol>
          </div>

          {/* Signatures & Stamps Footer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-300">
            <div className="space-y-1 text-center sm:text-left font-sans">
              <div className="text-xs text-slate-500">Tergovchi:</div>
              <div className="font-bold text-slate-900">{state.studentName}</div>
              <div className="text-xs text-slate-600">HMQA Tergov yo‘nalishi tinglovchisi ({state.studentGroup})</div>
              <div className="font-mono text-[11px] text-[#1D4ED8] pt-1">
                E-Imzo: {eSignatureCode}
              </div>
            </div>

            {/* Verification QR Code Badge */}
            <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50 font-sans">
              <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[11px] space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>E-Tergov Yagona Reestri</span>
                </div>
                <div className="text-slate-500 font-mono text-[10px]">VERIFIED-DOC-2026</div>
                <div className="text-slate-600 text-[10px]">JPK 331-m talablariga mos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close Button (Hidden in print) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
