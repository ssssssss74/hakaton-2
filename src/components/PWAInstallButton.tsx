import React, { useState } from 'react';
import { Download, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-900 bg-[#DCE7E3] hover:bg-[#CEE0DA] border border-[#A8C5BC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Ilovani noutbukka o‘rnatib, internetsiz lokal rejimda ishlating"
      >
        <Download className="w-3.5 h-3.5 shrink-0 text-teal-800" />
        <span className="hidden xl:inline">Lokal o‘rnatish</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-900 bg-[#DCE7E3] hover:bg-[#CEE0DA] border border-[#A8C5BC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>O‘rnatish</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#F2F4F3] border border-[#C6D0CC] p-6 shadow-xl text-slate-800">
              <h3 className="text-base font-bold text-slate-900">Qurilmaga o‘rnatish (Offlayn rejim)</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                1. Safari pastki panelidan <strong>Ulashish (Share)</strong> tugmasini bosing.<br />
                2. <strong>Bosh ekranga qo‘shish (Add to Home Screen)</strong> bandini tanlang.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-teal-700 hover:bg-teal-800 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Tushunarli
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="no-print fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-700/95 border border-amber-500/60 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Lokal (Offlayn) rejim faol — barcha modullar keshdan tezkor ishlayapti</span>
    </div>
  );
};
