import React, { useState } from 'react';
import { Box, Laptop, Smartphone, ShieldAlert, CheckCircle2, RotateCw, Eye, Lock, Sparkles, X } from 'lucide-react';

interface ThreeDItem {
  id: string;
  name: string;
  category: string;
  jpkRef: string;
  position: { x: number; y: number; z: number };
  icon: React.ReactNode;
  description: string;
  forensics: {
    hash: string;
    status: string;
    details: string[];
  };
}

const ITEMS_3D: ThreeDItem[] = [
  {
    id: 'pc',
    name: 'Ish stoli kompyuteri & Server',
    category: 'Raqamli Dalil №1',
    jpkRef: 'JPK 97-modda',
    position: { x: -35, y: -10, z: 20 },
    icon: <Laptop className="w-6 h-6 text-blue-400" />,
    description: 'Yunusobod proksi serveriga ulangan va phishing yuborgan asosiy kompyuter.',
    forensics: {
      hash: '8f92b14c7e3a01d68294e5b3f1a2c4d68e9f01a32b4c5d6e7f8a9b0c1d2e3f4a',
      status: 'Tasdiqlangan & Hash olindi',
      details: ['IP manzil: 185.139.137.44', 'Brauzer keshida skriptlar topildi'],
    },
  },
  {
    id: 'phone',
    name: 'Gumonlanuvchi Smartfoni',
    category: 'Raqamli Dalil №2',
    jpkRef: 'JPK 98-modda',
    position: { x: 25, y: 15, z: -10 },
    icon: <Smartphone className="w-6 h-6 text-amber-400" />,
    description: 'Samsung Galaxy A54 (IMEI: 354892104491820) qurilmasi va Telegram messenjeri.',
    forensics: {
      hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      status: 'Tekshiruvdan o‘tdi',
      details: ['SMS tasdiqlash kodlari mavjud', 'Sergeli BS tayanch stansiyasi'],
    },
  },
  {
    id: 'safe',
    name: 'Temir Seyf (Naqd Pul va Kartalar)',
    category: 'Ashyoviy Dalil №3',
    jpkRef: 'JPK 104-modda',
    position: { x: 0, y: 30, z: 40 },
    icon: <Lock className="w-6 h-6 text-emerald-400" />,
    description: 'Yechib olingan 42.5 mln so‘m mablag‘ning bir qismi saqlangan seyf.',
    forensics: {
      hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
      status: 'Muhrlangan',
      details: ['Tranzit kartalar topildi', 'Barmoq izlari ekspertizasi tayinlandi'],
    },
  },
];

interface ThreeDSceneViewerProps {
  pinnedClues: string[];
  onTogglePinClue: (clueId: string) => void;
}

export const ThreeDSceneViewer: React.FC<ThreeDSceneViewerProps> = ({
  pinnedClues,
  onTogglePinClue,
}) => {
  const [rotation, setRotation] = useState({ x: 15, y: -25 });
  const [selectedItem, setSelectedItem] = useState<ThreeDItem | null>(ITEMS_3D[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Real-Time Forensic Inspector</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Hodisa Joyining Interaktiv 3D Proyektsiyasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sichqoncha yordamida 3D sahnani aylantiring va dalil ob’ektlarini ustiga bosib tekshiring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRotation({ x: 15, y: -25 })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Tiklash</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3D Viewport Box */}
        <div
          className="lg:col-span-8 bg-[#111827] border border-slate-700/80 rounded-xl min-h-[420px] relative flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden shadow-inner"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 3D Perspective Wrapper */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              className="relative w-72 h-72 transition-transform duration-75"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              }}
            >
              {/* 3D Room Floor */}
              <div
                className="absolute inset-[-60px] bg-slate-900/80 border-2 border-slate-700 rounded-2xl shadow-2xl"
                style={{
                  transform: 'translateZ(-60px) rotateX(90deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px] opacity-35" />
              </div>

              {/* 3D Interactive Items */}
              {ITEMS_3D.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isPinned = pinnedClues.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer group"
                    style={{
                      transform: `translate3d(${item.position.x}px, ${item.position.y}px, ${item.position.z}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                  >
                    <div
                      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-300 shadow-2xl ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/60'
                          : 'bg-slate-900/95 border-slate-600 text-slate-200 hover:border-blue-400 hover:scale-105'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-slate-800">{item.icon}</div>
                      <div className="text-xs font-semibold whitespace-nowrap">{item.name}</div>
                      {isPinned && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur border border-slate-800 rounded-lg text-[10px] font-mono text-slate-400 pointer-events-none">
            3D Kamera: X: {Math.round(rotation.x)}° | Y: {Math.round(rotation.y)}° (Sichqoncha bilan tortib aylantiring)
          </div>
        </div>

        {/* 3D Inspector Sidebar */}
        <div className="lg:col-span-4 bg-[#111827] border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-mono mb-1">
                    {selectedItem.category} • {selectedItem.jpkRef}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedItem.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedItem.description}
              </p>

              <div className="space-y-2 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kriptografik Butunlik Xeshi (SHA-256):
                </div>
                <div className="font-mono text-[9px] text-emerald-400 break-all bg-black/40 p-2 rounded border border-slate-800">
                  {selectedItem.forensics.hash}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ekspertiza Holati:
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedItem.forensics.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onTogglePinClue(selectedItem.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  pinnedClues.includes(selectedItem.id)
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {pinnedClues.includes(selectedItem.id)
                    ? 'Dalillar doskasida mavjud ✓'
                    : 'Doskaga qo‘shish (Pinboard)'}
                </span>
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <Eye className="w-8 h-8 mb-2 opacity-50 text-blue-400" />
              <p className="text-xs">
                Sahnadagi har qanday 3D ob’ektni tanlang va batafsil ekspertiza xulosasini ko‘ring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
