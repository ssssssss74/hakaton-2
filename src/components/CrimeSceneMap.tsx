import React, { useState } from 'react';
import {
  MapPin,
  Laptop,
  Smartphone,
  CreditCard,
  ShieldAlert,
  CheckCircle2,
  X,
  FileText,
  Lock,
  Eye,
  Sparkles,
} from 'lucide-react';

interface CrimeSceneHotspot {
  id: string;
  title: string;
  category: string;
  jpkRef: string;
  coordinates: { x: number; y: number }; // percentage on floorplan
  icon: React.ReactNode;
  description: string;
  forensicData: {
    hash: string;
    seizedBy: string;
    status: 'Aniqlangan' | 'Tekshirilmoqda' | 'Tasdiqlangan';
    details: string[];
  };
}

const HOTSPOTS: CrimeSceneHotspot[] = [
  {
    id: 'pc',
    title: 'Asosiy Kompyuter Terminali',
    category: 'Raqamli Dalil №1',
    jpkRef: 'JPK 97-modda',
    coordinates: { x: 28, y: 35 },
    icon: <Laptop className="w-5 h-5 text-blue-400" />,
    description: 'Gumonlanuvchi D.Tursunov tomonidan firibgarlik havolasi yuborilgan ish stoli kompyuteri.',
    forensicData: {
      hash: '8f92b14c7e3a01d68294e5b3f1a2c4d68e9f01a32b4c5d6e7f8a9b0c1d2e3f4a',
      seizedBy: 'Tergovchi K.Normatov',
      status: 'Tasdiqlangan',
      details: [
        'IP manzil: 185.139.137.44 (Yunusobod proksi serveri)',
        'Brauzer keshida fishing sayt skriptlari aniqlandi',
        'Soxta autentifikatsiya tokenlari saqlangan',
      ],
    },
  },
  {
    id: 'phone',
    title: 'Gumonlanuvchi Smartfoni',
    category: 'Raqamli Dalil №2',
    jpkRef: 'JPK 98-modda',
    coordinates: { x: 72, y: 30 },
    icon: <Smartphone className="w-5 h-5 text-amber-400" />,
    description: 'Samsung Galaxy A54 (IMEI: 354892104491820) qurilmasi va Telegram messenjeri.',
    forensicData: {
      hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      seizedBy: 'Tezkor vakil Major O.Sobirov',
      status: 'Tasdiqlangan',
      details: [
        'SMS xabarnomalarida bank tasdiqlash kodlari mavjud',
        'Telegram guruhlarida phishing havolalar tarqatilgan',
        'Voqea vaqtida Sergeli tayanch stansiyasiga ulangani aniqlandi',
      ],
    },
  },
  {
    id: 'atm',
    title: 'Tranzit Karta va Bankomat',
    category: 'Moliya Dalili №3',
    jpkRef: 'JPK 104-modda',
    coordinates: { x: 50, y: 72 },
    icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
    description: 'Jabrlanuvchi M.Karimov hisobidan yechilgan 42 500 000 so‘m o‘tkazilgan 8600****9104 kartasi.',
    forensicData: {
      hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
      seizedBy: 'Iqtisodiy jinoyatlar bo‘limi',
      status: 'Tasdiqlangan',
      details: [
        'Mablag‘ 3 ta qismda naqdlashtirilgan',
        'Bankomat videokuzatuv yozuvlari olib qo‘yildi',
        'Tranzit karta egasi shaxsi aniqlashtirildi',
      ],
    },
  },
];

interface CrimeSceneMapProps {
  pinnedClues: string[];
  onTogglePinClue: (clueId: string) => void;
}

export const CrimeSceneMap: React.FC<CrimeSceneMapProps> = ({
  pinnedClues,
  onTogglePinClue,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<CrimeSceneHotspot | null>(
    HOTSPOTS[0]
  );

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Immersive Forensics — JPK 95-modda</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Hodisa sodir bo‘lgan joyni ko‘zdan kechirish (3D Xarita)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Yunusobod tumani, 14-mavze, 32-uy, 44-xonadon kiber-jinoyat joylashuvi va raqamli izlar sxemasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Kriminologik Xavfsizlik: Faol</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Floor Plan Viewport */}
        <div className="lg:col-span-7 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl p-6 relative min-h-[380px] flex items-center justify-center overflow-hidden shadow-inner">
          {/* Room Blueprint Drawing */}
          <div className="absolute inset-4 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center pointer-events-none">
            <div className="absolute top-3 left-4 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Xonadon №44 — Asosiy Tergov Maydoni
            </div>
            <div className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-500">
              Masshtab: 1:50 | Kriminologiya laboratoriyasi
            </div>
          </div>

          {/* Interior walls / partitions */}
          <div className="absolute w-3/4 h-1/2 border border-slate-600/60 rounded-lg pointer-events-none" />

          {/* Interactive Hotspot Beacons */}
          {HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            const isPinned = pinnedClues.includes(spot.id);

            return (
              <div
                key={spot.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}
                onClick={() => setSelectedHotspot(spot)}
              >
                {/* Radar pulse ring */}
                <span className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />

                <div
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 shadow-lg ${
                    isSelected
                      ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/50'
                      : 'bg-slate-900/90 border-slate-600 text-slate-200 hover:border-blue-500 hover:scale-105'
                  }`}
                >
                  <div className="p-1 rounded-lg bg-slate-800">{spot.icon}</div>
                  <div className="hidden sm:block text-xs font-semibold whitespace-nowrap">
                    {spot.title}
                  </div>
                  {isPinned && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hotspot Forensic Inspector Panel */}
        <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700 rounded-xl p-6 flex flex-col justify-between">
          {selectedHotspot ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-mono mb-1">
                    {selectedHotspot.category} • {selectedHotspot.jpkRef}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedHotspot.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedHotspot.description}
              </p>

              <div className="space-y-2 bg-slate-900/80 border border-slate-800 rounded-lg p-3.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kriptografik Dalil Xesh (SHA-256):
                </div>
                <div className="font-mono text-[10px] text-emerald-400 break-all bg-black/40 p-2 rounded border border-slate-800">
                  {selectedHotspot.forensicData.hash}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ekspertiza Xulosalari:
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedHotspot.forensicData.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onTogglePinClue(selectedHotspot.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    pinnedClues.includes(selectedHotspot.id)
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {pinnedClues.includes(selectedHotspot.id)
                      ? 'Dalillar doskasiga biriktirilgan ✓'
                      : 'Dalillar doskasiga (Pinboard) qo‘shish'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <Eye className="w-8 h-8 mb-2 opacity-50 text-blue-400" />
              <p className="text-xs">
                Xaritadagi istalgan raqamli ob’ektni (Kompyuter, Telefon, Bankomat) tanlang va uning ekspertiza ma’lumotlarini ko‘ring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
