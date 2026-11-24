import React from 'react';
import { Printer, Download, X, CheckCircle2, Shield, QrCode } from 'lucide-react';
import { ACTIVE_CASE } from '../data/caseData';
import { SimulationState } from '../types/simulation';

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
  const docTitle = isDecision
    ? 'JINOYAT ISHI QO‘ZG‘ATISH VA TERGOVGA QABUL QILISH TO‘G‘RISIDA QAROR'
    : 'JINOYAT ISHI BO‘YICHA AYBLOV XULOSASI';

  const docNumber = isDecision ? 'QAROR № 102/26-04' : 'AYBLOV № 2026/88-A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none">
        {/* Modal Top Actions (Hidden in print) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
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
              {/* Uzbekistan State Emblem SVG Graphic */}
              <div className="w-16 h-16 rounded-full border-2 border-blue-900 flex items-center justify-center p-1 bg-amber-50">
                <svg viewBox="0 0 100 100" className="w-14 h-14 text-blue-900 fill-current">
                  <circle cx="50" cy="50" r="46" fill="#F8FAFC" stroke="#1E3A8A" strokeWidth="2.5" />
                  <path d="M50 12 L53 22 L63 22 L55 28 L58 38 L50 32 L42 38 L45 28 L37 22 L47 22 Z" fill="#D97706" />
                  <circle cx="50" cy="54" r="18" fill="#1E3A8A" />
                  <path d="M38 52 Q50 68 62 52" stroke="#F8FAFC" strokeWidth="3" fill="none" />
                  <path d="M22 68 Q50 82 78 68" stroke="#16A34A" strokeWidth="3" fill="none" />
                </svg>
              </div>
            </div>

            <div className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
              O‘zbekiston Respublikasi Huquqni Muhofaza Qilish Akademiyasi
            </div>
            <div className="font-sans text-xs text-slate-600">
              Toshkent shahri, Chilonzor tumani IIO FMB Tergov bo‘limi
            </div>
            <div className="font-mono text-xs text-slate-500 font-semibold pt-1">
              Ish raqami: {ACTIVE_CASE.caseNumber} · {docNumber}
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center pt-2">
            <h1 className="text-base sm:text-lg font-bold font-sans tracking-wide uppercase text-slate-950">
              {docTitle}
            </h1>
            <div className="font-sans text-xs text-slate-500 mt-1">
              Toshkent shahri, Chilonzor tumani · 19-noyabr 2026-yil
            </div>
          </div>

          {/* Opening Paragraph */}
          <p className="text-justify indent-8">
            HMQA 3-kurs talabasi, tergovchi <strong>{state.studentName}</strong>, 
            Chilonzor tumani IIO FMB Navbatchilik qismiga 2026-yil 19-noyabr kuni soat 14:42 da kelib tushgan 
            <strong> {ACTIVE_CASE.caseNumber}</strong>-sonli tergovga qadar tekshiruv materiallarini o‘rganib chiqib,
          </p>

          {/* Facts Section */}
          <div className="space-y-2">
            <div className="font-sans font-bold text-xs uppercase tracking-wide text-slate-700">
              ANIQLADI:
            </div>
            <p className="text-justify indent-8">
              Fuqaro Dilshod Alisherovich Tursunov (1998-yilda tug‘ilgan) o‘zganing mulkini aldash va ishonchni suiiste’mol qilish yo‘li bilan 
              qo‘lga kiritish maqsadida, 2026-yil 19-noyabr kuni soat 14:10 da jabrlanuvchi Karimov Jasur Bahromovichga 
              Telegram messenjeri orqali soxta <em>«milliy-bank-verify[.]uz»</em> fishing havolasini yuborib, 
              uning bir martalik SMS-tasdiq kodini egallagan.
            </p>
            <p className="text-justify indent-8">
              So‘ngra soat 14:15:38 da jabrlanuvchining «TuronPay» hisob raqamidan jami 
              <strong> 42 500 000 (qirq ikki million besh yuz ming) so‘m</strong> mablag‘ni o‘zining nomidagi 
              8600 57** **** 9104 tranzit kartasiga o‘tkazib olib, Yunusobod tumani 4-mavzedagi ATM #412 bankomatidan 
              qisman naqdlashtirgan.
            </p>
          </div>

          {/* Resolution / Order */}
          <div className="space-y-2 pt-2">
            <div className="font-sans font-bold text-xs uppercase tracking-wide text-slate-700">
              {isDecision ? 'QAROR QILDIM:' : 'AYBLOV XULOSASI:'}
            </div>
            <ol className="list-decimal pl-8 space-y-2 text-justify">
              <li>
                Ushbu holat yuzasida O‘zbekiston Respublikasi JK 168-moddasi 3-qismi («b» bandi — axborot texnologiyalaridan foydalanib sodir etilgan firibgarlik) 
                bilan jinoyat ishi qo‘zg‘atilsin va tergov yurituviga qabul qilinsin.
              </li>
              <li>
                To‘plangan ashyoviy va raqamli dalillar — bank tranzaksiyalari ko‘chirmasi, IMEI 354892104491820 va IP 185.139.137.44 billingi 
                hamda bankomat videoyozuvlari JPK 81-moddasi tartibida ish materiallariga qo‘shilsin.
              </li>
              <li>
                D.Tursunovga nisbatan JPK 47-moddasi talablari asosida himoyachi ishtirokida protsessual maqom berilib, tegishli ehtiyot chorasi ko‘rilsin.
              </li>
              <li>
                Ushbu qaror nusxasi 24 soat ichida qonuniylikni ta’minlash va nazorat yuritish uchun Chilonzor tumani prokuroriga yuborilsin (JPK 331-modda).
              </li>
            </ol>
          </div>

          {/* Signatures & Stamps Footer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-300">
            <div className="space-y-1 text-center sm:text-left font-sans">
              <div className="text-xs text-slate-500">Tergovchi:</div>
              <div className="font-bold text-slate-900">{state.studentName}</div>
              <div className="text-xs text-slate-600">HMQA Tergov yo‘nalishi tinglovchisi</div>
              <div className="font-mono text-[11px] text-[#1D4ED8] pt-1">
                E-Imzo: ESIGN-{Date.now().toString().slice(-8)}/HMQA
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
