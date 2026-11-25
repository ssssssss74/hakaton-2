export interface ForensicExpertiseReport {
  reportNumber: string;
  expertiseType: string;
  institution: string;
  date: string;
  legalBasis: string;
  warningRef: string;
  findings: string[];
  conclusion: string;
}

export interface ForensicEvidenceInfo {
  id: string;
  cluePinId: string;
  markerNumber: number;
  title: string;
  category: string;
  jpkRef: string;
  desc: string;
  hash: string;
  details: string[];
  focusPosition: [number, number, number];
  focusLookAt: [number, number, number];
  expertiseReport?: ForensicExpertiseReport;
}

export const FORENSIC_EVIDENCE_CATALOG: Record<string, ForensicEvidenceInfo> = {
  Dalil_Pichoq: {
    id: 'Dalil_Pichoq',
    cluePinId: 'Dalil_Pichoq',
    markerNumber: 1,
    title: 'Oshxona pichog‘i',
    category: 'Ashyoviy Dalil №1 (CASE-02-KNIFE-NOTE)',
    jpkRef: 'JPK 95¹, 172, 180, 203-moddalar',
    desc: 'Dastasida noma’lum barmoq izlari va biologik mikrozarralar mavjud. Daktiloskopik + DNK ekspertiza xulosasi № 2026/11-418 tayyor.',
    hash: '4c8a1f9e3d2b7a6c5e8f1a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    details: [
      'Dastada aniq papillyar chiziq izlari aniqlandi (J. Karimov namunasiga mos)',
      'Zanglamas po‘lat tig‘, uzunligi 18 sm — biologik izlar qayd etilgan',
      'JPK 172, 180, 203-moddalar asosida muhrlangan paketda saqlanadi',
    ],
    focusPosition: [-0.55, 1.52, 0.32],
    focusLookAt: [-0.62, 0.81, -0.78],
    expertiseReport: {
      reportNumber: '№ 2026/11-418',
      expertiseType: 'Sud-daktiloskopik va biologik-DNK kompleks ekspertizasi',
      institution: 'X. Sulaymonova nomidagi Respublika sud ekspertiza markazi',
      date: '25.11.2026',
      legalBasis: 'O‘zR JPK 68, 172, 173, 180, 184-moddalari',
      warningRef: 'Ekspert bila turib yolg‘on xulosa berganlik uchun O‘zR JK 238-moddasi bo‘yicha jinoiy javobgarlik haqida ogohlantirildi.',
      findings: [
        'Pichoq dastasining o‘ng yon yuzasidan olingan 2 ta papillyar iz gumonlanuvchi J. Karimovning o‘ng qo‘l bosh va ko‘rsatkich barmoq izlari bilan 14 ta xususiy belgi bo‘yicha to‘liq mos keldi.',
        'Tig‘ va dasta tutashgan yoriq qismida jabrlanuvchi genotipiga mos biologik (qon) izlari hamda gumonlanuvchining epiteliy hujayralari aralashmasi aniqlandi.',
        'Izlarning joylashuv burchagi pichoqdan o‘ng qo‘l bilan zarba berish holatida foydalanilganini ko‘rsatadi.',
      ],
      conclusion:
        'Ashyoviy dalil — oshxona pichog‘i (Dalil_Pichoq) dastasidagi barmoq izlari gumonlanuvchi J. Karimovga tegishli; ushbu dalil JK 97-modda 1-qismi bo‘yicha ishga JPK 95¹, 184-moddalari talabiga muvofiq maqbul dalil sifatida qo‘shilishi mumkin.',
    },
  },
  Dalil_Xat: {
    id: 'Dalil_Xat',
    cluePinId: 'Dalil_Xat',
    markerNumber: 2,
    title: 'Yirtilgan qog‘oz («Soxta xayrlashuv xati»)',
    category: 'Yozma Dalil №2 (CASE-02-KNIFE-NOTE)',
    jpkRef: 'JPK 95¹, 172, 180, 204-moddalar',
    desc: 'Soat 22:30 da uchrashuv va «xayrlashuv» mazmunidagi yozuv. Sud-xatshunoslik ekspertizasi № 2026/11-419 orqali qalbakilashtirish aniqlandi.',
    hash: '9e2d4b6a8c0f1e3d5b7a9c1e3f5a7b9d1c3e5f7a9b1d3c5e7f9a1b3d5c7e9f1a',
    details: [
      'Matn parchasi: «Soat 22:30 — Chilonzor bekati / hech kimni ayblamang»',
      'Ko‘k gel ruchka bilan qasddan o‘zgartirilgan dastxatda yozilgan',
      'Xatshunoslik ekspertizasi № 2026/11-419 xulosasi ilova qilingan',
    ],
    focusPosition: [0.55, 1.5, 0.35],
    focusLookAt: [0.52, 0.8, -0.68],
    expertiseReport: {
      reportNumber: '№ 2026/11-419',
      expertiseType: 'Sud-xatshunoslik (grafologik) ekspertizasi',
      institution: 'X. Sulaymonova nomidagi Respublika sud ekspertiza markazi',
      date: '25.11.2026',
      legalBasis: 'O‘zR JPK 68, 172, 180, 184-moddalari',
      warningRef: 'Ekspert bila turib yolg‘on xulosa berganlik uchun O‘zR JK 238-moddasi bo‘yicha jinoiy javobgarlik haqida ogohlantirildi.',
      findings: [
        'Taqdim etilgan yirtilgan qog‘ozdagi qo‘lyozma matn jabrlanuvchining erkin va eksperimental yozuv namunalari bilan asosiy grafik belgilari (harf bog‘lanishi, qiyalik burchagi, bosim maromi) bo‘yicha mos kelmaydi.',
        'Matnda chap qo‘l yoki ataylab sekinlashtirilgan harakat bilan taqlid (imitatsiya) qilishga xos to‘xtalishlar va g‘ayritabiiy sinish nuqtalari qayd etildi.',
        'Harflarning mikro-tuzilishi (xususan «a», «m», «r» va raqam yozilishi) gumonlanuvchi J. Karimovning qiyosiy namunalari bilan yuqori ehtimollikda mos keladi.',
      ],
      conclusion:
        '«Soxta xayrlashuv xati» (Dalil_Xat) jabrlanuvchi tomonidan emas, balki boshqa shaxs — yuqori ehtimollik bilan gumonlanuvchi J. Karimov tomonidan qasddan o‘z joniga qasd qilish sahnasini imitatsiya qilish maqsadida yozilgan.',
    },
  },
  Dalil_Kompyuter: {
    id: 'Dalil_Kompyuter',
    cluePinId: 'clue-billing',
    markerNumber: 3,
    title: 'Ish stoli kompyuteri & Proksi Server',
    category: 'Raqamli Dalil №3',
    jpkRef: 'JPK 95¹, 97-moddalar',
    desc: 'Yunusobod proksi tuguniga ulangan asosiy tizim. Brauzer keshida phishing sahifa skriptlari va IP 185.139.137.44 qayd etilgan.',
    hash: '8f92b14c7e3a01d68294e5b3f1a2c4d68e9f01a32b4c5d6e7f8a9b0c1d2e3f4a',
    details: [
      'Faol IP manzil: 185.139.137.44 (Yunusobod)',
      'Brauzer keshida «TuronPay» soxta formasi mavjud',
      'Qattiq diskdan bit-to-bit nusxa (image) olinishi lozim',
    ],
    focusPosition: [-0.05, 1.55, 0.55],
    focusLookAt: [-0.05, 1.05, -1.08],
  },
  Dalil_Smartfon: {
    id: 'Dalil_Smartfon',
    cluePinId: 'clue-telegram',
    markerNumber: 4,
    title: 'Gumonlanuvchi Smartfoni',
    category: 'Raqamli Dalil №4',
    jpkRef: 'JPK 95¹, 98-moddalar',
    desc: 'Samsung Galaxy A54 (IMEI: 354892104491820). Ekranda soxta bank xavfsizlik boti va bir martalik SMS kod yozishmalari ochiq qolgan.',
    hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    details: [
      'IMEI: 354892104491820 — Chilonzor/Yunusobod tayanch stansiyasi',
      'Telegram orqali jabrlanuvchiga yuborilgan havola logi',
      'Faradey paketiga solib tarmoqdan uzish shart',
    ],
    focusPosition: [0.35, 1.48, 0.2],
    focusLookAt: [0.22, 0.81, -0.72],
  },
  Dalil_Seyf: {
    id: 'Dalil_Seyf',
    cluePinId: 'clue-bank',
    markerNumber: 5,
    title: 'Temir Seyf (Tranzit kartalar)',
    category: 'Ashyoviy Dalil №5',
    jpkRef: 'JPK 104, 157-moddalar',
    desc: '42 500 000 so‘m o‘tkazilgan 8600****9104 tranzit bank kartasi va naqd pul o‘ramlari saqlangan po‘lat seyf.',
    hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    details: [
      '8600****9104 raqamli tranzit karta va bank cheklari',
      'Kodli qulf tutqichida qo‘lqopsiz izlar qolgan',
      'Xolislar ishtirokida ochib bayonnoma tuziladi',
    ],
    focusPosition: [0.75, 1.45, 0.95],
    focusLookAt: [2.15, 0.52, -0.75],
  },
};

export function resolveEvidenceInfo(objectName: string): ForensicEvidenceInfo {
  const exact = FORENSIC_EVIDENCE_CATALOG[objectName];
  if (exact) return exact;

  // Match prefix if Blender exported e.g. Dalil_Pichoq_001 or Dalil_Xat.001
  const matchedKey = Object.keys(FORENSIC_EVIDENCE_CATALOG).find((key) =>
    objectName.startsWith(key)
  );
  if (matchedKey) return FORENSIC_EVIDENCE_CATALOG[matchedKey];

  // Dynamic fallback for any custom Blender Dalil_* mesh
  const cleanLabel = objectName.replace(/^Dalil_/, '').replace(/[_.-]+/g, ' ').trim();
  return {
    id: objectName,
    cluePinId: objectName,
    markerNumber: 0,
    title: cleanLabel ? `Dalil: ${cleanLabel}` : objectName,
    category: 'Maxsus 3D Model Dalili',
    jpkRef: 'JPK 95-modda',
    desc: `Yuklangan 3D sahnadagi "${objectName}" ob’ekti ashyoviy dalil sifatida belgilandi.`,
    hash: '7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    details: [
      `Blender ob’ekt nomi: ${objectName}`,
      'Hodisa joyini ko‘zdan kechirish bayonnomasiga kiritildi',
    ],
    focusPosition: [0, 1.6, 2.2],
    focusLookAt: [0, 1.0, 0],
  };
}
