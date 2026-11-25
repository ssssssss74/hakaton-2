import React, { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import {
  Landmark,
  MessageSquare,
  RadioTower,
  Pin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
} from 'lucide-react';
import {
  BANK_TRANSACTIONS,
  EVIDENCE_CLUES,
  TELEGRAM_MESSAGES,
  TELECOM_BILLING_LOGS,
} from '../../data/caseData';
import { SimulationState } from '../../types/simulation';
import { computeSha256 } from '../../utils/audioEffects';
import { ThreeDSceneViewer } from '../ThreeDSceneViewer';
import { CyberTraceGraph } from '../CyberTraceGraph';
import { DigitalCustodyPassport } from '../DigitalCustodyPassport';
import { FORENSIC_EVIDENCE_CATALOG, SMART_LOCK_PASSPORT } from '../../scene/evidenceCatalog';

interface Step2EvidenceBoardProps {
  state: SimulationState;
  onToggleClue: (clueId: string) => void;
  onCompleteStep2: () => void;
  onSolveDfir: (caseId: 'case1' | 'case2', artifact: string) => void;
  onNextStep: () => void;
}

type EvidenceTab = 'bank' | 'chat' | 'billing' | 'passports';

export const Step2EvidenceBoard: React.FC<Step2EvidenceBoardProps> = ({
  state,
  onToggleClue,
  onCompleteStep2,
  onSolveDfir,
  onNextStep,
}) => {
  const [activeTab, setActiveTab] = useState<EvidenceTab>('bank');
  const [clueHashes, setClueHashes] = useState<Record<string, string>>({});
  const [verifyingClueId, setVerifyingClueId] = useState<string | null>(null);
  const chainBroken = state.step1ChoiceId === 'informal_call';

  const handleVerifyHash = async (clueId: string, text: string) => {
    setVerifyingClueId(clueId);
    const hash = await computeSha256(text);
    setTimeout(() => {
      setClueHashes((prev) => ({ ...prev, [clueId]: hash }));
      setVerifyingClueId(null);
    }, 400);
  };

  const criticalSelectedCount = EVIDENCE_CLUES.filter(
    (c) => c.isCritical && state.pinnedClueIds.includes(c.id)
  ).length;
  const distractorSelectedCount = EVIDENCE_CLUES.filter(
    (c) => !c.isCritical && state.pinnedClueIds.includes(c.id)
  ).length;
  const pinned3DForensicItems = (['Dalil_Pichoq', 'Dalil_Xat'] as const)
    .filter((id) => state.pinnedClueIds.includes(id))
    .map((id) => FORENSIC_EVIDENCE_CATALOG[id])
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <ThreeDSceneViewer
        pinnedClues={state.pinnedClueIds}
        onTogglePinClue={onToggleClue}
        chainBroken={chainBroken}
        investigatorName={state.studentName}
      />

      {/* Interactive Kiber-izlar Xaritasi + Mini-DFIR */}
      <CyberTraceGraph
        activeCaseId={
          state.activeCaseId === 'CASE-02-KNIFE-NOTE' ||
          state.pinnedClueIds.includes('Dalil_Pichoq') ||
          state.pinnedClueIds.includes('Dalil_Xat')
            ? 'case2'
            : 'case1'
        }
        solvedCases={state.solvedDfirCases || []}
        chainBroken={chainBroken}
        investigatorName={state.studentName}
        onSolveDfir={onSolveDfir}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Digital Evidence Viewer */}
        <div className="xl:col-span-7 surface-card rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                2-bosqich: Raqamli dalillar tahlili
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                3 ta raqamli manbani o‘rganib, gumonlanuvchi versiyasini fosh etuvchi 3 ta hal qiluvchi dalilni doskaga mahkamlang.
              </p>
            </div>
          </div>

          {/* Interactive Segmented Tabs with Smooth Spring Indicator */}
          <LayoutGroup id="step2-evidence-tabs">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#E5EBE8] border border-[#C6D1CC] rounded-xl">
              {(
                [
                  { id: 'bank', label: 'Bank ko‘chirmasi', Icon: Landmark },
                  { id: 'chat', label: 'Telegram / SMS', Icon: MessageSquare },
                  { id: 'billing', label: 'Aloqa billingi / IP', Icon: RadioTower },
                  { id: 'passports', label: 'Pasportlar (JPK 204²)', Icon: Shield },
                ] as const
              ).map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`relative flex-1 min-w-[125px] inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="step2EvidenceTabBg"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-[#0F766E] shadow-xs"
                      />
                    )}
                    <Icon
                      className={`relative z-10 w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-teal-100' : id === 'passports' ? 'text-amber-600' : 'text-teal-800'
                      }`}
                    />
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
          {/* Tab 1: Bank Transactions */}
          {activeTab === 'bank' && (
            <div className="overflow-x-auto border border-[#C6D1CC] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E6ECE9] border-b border-[#C6D1CC] text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Vaqt</th>
                    <th className="py-2.5 px-3 font-semibold">Yo‘nalish / Karta</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Summa</th>
                    <th className="py-2.5 px-3 font-semibold">Izoh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BANK_TRANSACTIONS.map((tx) => (
                    <tr
                      key={tx.id}
                      className={tx.suspicious ? 'bg-red-50/55' : 'bg-[#F4F6F5]'}
                    >
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        {tx.time}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800">{tx.fromCard}</div>
                        <div className="font-mono text-slate-500">→ {tx.toCard}</div>
                      </td>
                      <td
                        className={`py-3 px-3 font-mono font-semibold text-right tabular-nums whitespace-nowrap ${
                          tx.suspicious ? 'text-[#EF4444]' : 'text-slate-800'
                        }`}
                      >
                        {tx.amount}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{tx.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Telegram / SMS Chat Mockup */}
          {activeTab === 'chat' && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="pb-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-[#0F172A]">
                  Yozishma skrinshoti (Jabrlanuvchi qurilmasidan olingan)
                </span>
                <span className="font-mono">19.11.2026</span>
              </div>
              <div className="space-y-3">
                {TELEGRAM_MESSAGES.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === 'victim' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed border ${
                        m.sender === 'system'
                          ? 'bg-amber-50 border-amber-200 text-amber-950 w-full max-w-full'
                          : m.sender === 'victim'
                            ? 'bg-blue-50 border-blue-200 text-slate-900'
                            : m.highlight
                              ? 'bg-red-50 border-red-200 text-slate-900'
                              : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{m.author}</span>
                        <span className="font-mono tabular-nums">{m.time}</span>
                      </div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Telecom Billing / IP Logs */}
          {activeTab === 'billing' && (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Vaqt</th>
                    <th className="py-2.5 px-3 font-semibold">IMEI / IP manzil</th>
                    <th className="py-2.5 px-3 font-semibold">Tayanch stansiya</th>
                    <th className="py-2.5 px-3 font-semibold">Harakat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TELECOM_BILLING_LOGS.map((log, idx) => (
                    <tr
                      key={idx}
                      className={log.suspicious ? 'bg-amber-50/55' : 'bg-[#F4F6F5]'}
                    >
                      <td className="py-3 px-3 font-mono tabular-nums whitespace-nowrap text-slate-700">
                        {log.time}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800">
                        <div>{log.imei}</div>
                        <div className="text-slate-500">{log.ip}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{log.tower}</td>
                      <td className="py-3 px-3 text-slate-600">{log.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Digital Chain of Custody Passports (JPK 204² / 95¹) */}
          {activeTab === 'passports' && (
            <div className="space-y-3">
              <DigitalCustodyPassport
                title={FORENSIC_EVIDENCE_CATALOG.Dalil_Kompyuter.title}
                hash={FORENSIC_EVIDENCE_CATALOG.Dalil_Kompyuter.hash}
                passport={FORENSIC_EVIDENCE_CATALOG.Dalil_Kompyuter.custodyPassport}
                chainBroken={chainBroken}
                investigatorOverride={state.studentName}
              />
              <DigitalCustodyPassport
                title={FORENSIC_EVIDENCE_CATALOG.Dalil_Smartfon.title}
                hash={FORENSIC_EVIDENCE_CATALOG.Dalil_Smartfon.hash}
                passport={FORENSIC_EVIDENCE_CATALOG.Dalil_Smartfon.custodyPassport}
                chainBroken={chainBroken}
                investigatorOverride={state.studentName}
              />
              <DigitalCustodyPassport
                title={SMART_LOCK_PASSPORT.title}
                hash={SMART_LOCK_PASSPORT.hash}
                passport={SMART_LOCK_PASSPORT.custodyPassport}
                chainBroken={chainBroken}
                investigatorOverride={state.studentName}
              />
            </div>
          )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Interactive Dalillar doskasi */}
        <div className="xl:col-span-5 surface-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                «Dalillar doskasi»
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Faqat ishga bevosita aloqador 3 ta asosiy dalilni tanlab mahkamlang
              </p>
            </div>
            <span className="font-mono text-xs font-semibold tabular-nums text-teal-800">
              {state.pinnedClueIds.length} / 3 tanlandi
            </span>
          </div>

          <div className="space-y-2.5">
            {EVIDENCE_CLUES.map((clue) => {
              const pinned = state.pinnedClueIds.includes(clue.id);
              const hash = clueHashes[clue.id];
              const isVerifying = verifyingClueId === clue.id;

              return (
                <motion.div
                  key={clue.id}
                  layout
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    pinned
                      ? 'bg-[#DCEEE7] border-[#0F766E] shadow-xs'
                      : 'bg-[#F5F7F6] border-[#C6D1CC] hover:border-teal-600/60 hover:bg-[#EAF1EE]'
                  }`}
                >
                  <div
                    onClick={() => onToggleClue(clue.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-600">
                        {clue.sourceLabel} · {clue.jpkNote}
                      </span>
                      <Pin
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          pinned ? 'text-[#0F766E] fill-[#0F766E] -rotate-12' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[#0F172A] leading-snug">
                      {clue.title}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {clue.detail}
                    </p>
                  </div>

                  {/* SHA-256 Hash Forensics Tool */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    {!hash ? (
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyHash(clue.id, clue.title + clue.detail);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E5ECE9] hover:bg-[#D7E4DF] text-slate-800 font-mono transition-colors cursor-pointer"
                      >
                        <Shield className="w-3 h-3 text-teal-800" />
                        <span>{isVerifying ? 'Hash hisoblanmoqda...' : 'SHA-256 butunlikni tekshirish'}</span>
                      </button>
                    ) : (
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex items-center justify-between font-mono text-emerald-800">
                          <span className="flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-teal-700" />
                            <span>SHA-256 Butunlik tasdiqlandi (JPK 95¹-m)</span>
                          </span>
                          <span className="text-[9px] text-slate-600">O‘zgarmagan</span>
                        </div>
                        <div className="font-mono text-[9px] text-slate-600 truncate bg-[#F4F6F5] px-1.5 py-0.5 rounded border border-[#C6D1CC]">
                          {hash}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {pinned3DForensicItems.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                3D Hodisa joyidan biriktirilgan ashyoviy dalillar ({pinned3DForensicItems.length} ta)
              </div>
              {pinned3DForensicItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border bg-amber-50/75 border-amber-300 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-amber-900">
                      {item.category} · {item.expertiseReport?.reportNumber ?? item.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleClue(item.id)}
                      title="Doskadan olib tashlash"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:text-red-700 cursor-pointer shrink-0"
                    >
                      <Pin className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                    </button>
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] leading-snug">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
                  <div className="text-[10px] font-mono text-slate-600 pt-1 border-t border-amber-200/80 flex items-center justify-between gap-2">
                    <span>{item.jpkRef}</span>
                    <span className="truncate max-w-[160px]">SHA-256: {item.hash.slice(0, 14)}…</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action / Verification */}
          <div className="pt-2 space-y-3">
            {state.step2Completed ? (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                  criticalSelectedCount === 3 && distractorSelectedCount === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                {criticalSelectedCount === 3 && distractorSelectedCount === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">
                    {criticalSelectedCount === 3 && distractorSelectedCount === 0
                      ? "Barcha 3 ta asosiy raqamli dalil aniq bog'landi!"
                      : `Topilgan asosiy dalillar: ${criticalSelectedCount}/3. Aloqasiz faktlar: ${distractorSelectedCount}.`}
                  </div>
                  <div className="mt-0.5 opacity-90">
                    Ushbu dalillar zanjiri so‘roq vaqtida gumonlanuvchining yolg‘on alibisini fosh etishda qo‘llaniladi.
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              {!state.step2Completed ? (
                <motion.button
                  whileTap={state.pinnedClueIds.length > 0 ? { scale: 0.98 } : undefined}
                  type="button"
                  disabled={state.pinnedClueIds.length === 0}
                  onClick={onCompleteStep2}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors ${
                    state.pinnedClueIds.length > 0
                      ? 'bg-[#0F766E] hover:bg-[#115E59] text-white cursor-pointer shadow-xs'
                      : 'bg-[#DCE3E0] text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Dalillar doskasini rasmiylashtirish (JPK 81-modda)
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onNextStep}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white cursor-pointer shadow-xs"
                >
                  <span>3-bosqich: Idoralararo so‘rovlar va Qaror</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
