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

export interface CustodyPassportInfo {
  isDigital: boolean;
  evidenceCode: string;
  seizedAt: string;
  investigator: string;
  storageCondition: string;
  jpkArticle: string;
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
  custodyPassport: CustodyPassportInfo;
  expertiseReport?: ForensicExpertiseReport;
}

export const SMART_LOCK_PASSPORT = {
  id: 'SmartLock_4821',
  title: 'Smart-Lock #4821 elektron qulf kirish-chiqish jurnali',
  hash: 'c7f4a21e8d90b34c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
  custodyPassport: {
    isDigital: true,
    evidenceCode: 'RD-2026/0419-SL',
    seizedAt: '25.11.2026, 22:18',
    investigator: 'Qodirov Temur',
    storageCondition: 'Kriptografik muhrlangan jurnal / bitma-bit nusxa',
    jpkArticle: 'O‘zR JPK 204² va 95¹-moddalar',
  } as CustodyPassportInfo,
};

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
      'Dastada aniq papillyar chiziq izlari aniqlandi (B. Raximov namunasiga mos)',
      'Zanglamas po‘lat tig‘, uzunligi 18 sm — biologik izlar qayd etilgan',
      'JPK 172, 180, 203-moddalar asosida muhrlangan paketda saqlanadi',
    ],
    focusPosition: [-0.55, 1.52, 0.32],
    focusLookAt: [-0.62, 0.81, -0.78],
    custodyPassport: {
      isDigital: false,
      evidenceCode: 'AD-2026/0419-01',
      seizedAt: '25.11.2026, 22:05',
      investigator: 'Qodirov Temur',
      storageCondition: 'Steril qog‘oz konteyner / muhrlangan ashyoviy paket',
      jpkArticle: 'O‘zR JPK 203, 204² va 95¹-moddalar',
    },
    expertiseReport: {
      reportNumber: '№ 2026/11-418',
      expertiseType: 'Sud-daktiloskopik va biologik-DNK kompleks ekspertizasi',
      institution: 'X. Sulaymonova nomidagi Respublika sud ekspertiza markazi',
      date: '25.11.2026',
      legalBasis: 'O‘zR JPK 68, 172, 173, 180, 184-moddalari',
      warningRef: 'Ekspert bila turib yolg‘on xulosa berganlik uchun O‘zR JK 238-moddasi bo‘yicha jinoiy javobgarlik haqida ogohlantirildi.',
      findings: [
        'Pichoq dastasining o‘ng yon yuzasidan olingan 2 ta papillyar iz gumonlanuvchi B. Raximovning o‘ng qo‘l bosh va ko‘rsatkich barmoq izlari bilan 14 ta xususiy belgi bo‘yicha to‘liq mos keldi.',
        'Tig‘ va dasta tutashgan yoriq qismida jabrlanuvchi genotipiga mos biologik (qon) izlari hamda gumonlanuvchining epiteliy hujayralari aralashmasi aniqlandi.',
        'Izlarning joylashuv burchagi pichoqdan o‘ng qo‘l bilan zarba berish holatida foydalanilganini ko‘rsatadi.',
      ],
      conclusion:
        'Ashyoviy dalil — oshxona pichog‘i (Dalil_Pichoq) dastasidagi barmoq izlari gumonlanuvchi B. Raximovga tegishli; ushbu dalil JK 97-modda 1-qismi bo‘yicha ishga JPK 95¹, 184-moddalari talabiga muvofiq maqbul dalil sifatida qo‘shilishi mumkin.',
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
    custodyPassport: {
      isDigital: false,
      evidenceCode: 'YD-2026/0419-02',
      seizedAt: '25.11.2026, 22:11',
      investigator: 'Qodirov Temur',
      storageCondition: 'Shaffof fayl-konvert / xolislar imzosi bilan muhrlangan',
      jpkArticle: 'O‘zR JPK 204, 204² va 95¹-moddalar',
    },
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
        'Harflarning mikro-tuzilishi (xususan «a», «m», «r» va raqam yozilishi) gumonlanuvchi B. Raximovning qiyosiy namunalari bilan yuqori ehtimollikda mos keladi.',
      ],
      conclusion:
        '«Soxta xayrlashuv xati» (Dalil_Xat) jabrlanuvchi tomonidan emas, balki boshqa shaxs — yuqori ehtimollik bilan gumonlanuvchi B. Raximov tomonidan qasddan o‘z joniga qasd qilish sahnasini imitatsiya qilish maqsadida yozilgan.',
    },
  },
  Dalil_Kompyuter: {
    id: 'Dalil_Kompyuter',
    cluePinId: 'clue_billing_tower',
    markerNumber: 3,
    title: 'Ish stoli kompyuteri va Proksi tuguni',
    category: 'Raqamli Dalil №3',
    jpkRef: 'JPK 95¹, 172, 180, 204²-moddalar',
    desc: 'Yunusobod proksi tuguniga ulangan asosiy tizim. Brauzer keshida phishing_gate.py skriptlari, IP 185.139.137.44 va SHA-256 disk obrazi ekspertiza № 2026/11-420 da tasdiqlangan.',
    hash: '8f92b14c7e3a01d68294e5b3f1a2c4d68e9f01a32b4c5d6e7f8a9b0c1d2e3f4a',
    details: [
      'Faol IP manzil: 185.139.137.44 (Yunusobod proksi tuguni)',
      'Tizim diskida «phishing_gate.py» va soxta «TuronPay» formasi topildi',
      'Sud kompyuter-texnikaviy ekspertizasi № 2026/11-420 ilova qilingan',
    ],
    focusPosition: [-0.05, 1.55, 0.55],
    focusLookAt: [-0.05, 1.05, -1.08],
    custodyPassport: {
      isDigital: true,
      evidenceCode: 'RD-2026/0418-03',
      seizedAt: '19.11.2026, 15:24',
      investigator: 'Qodirov Temur',
      storageCondition: 'Yozuvdan himoyalangan bitma-bit obraz (qattiq disk nusxasi)',
      jpkArticle: 'O‘zR JPK 204² va 95¹-moddalar',
    },
    expertiseReport: {
      reportNumber: '№ 2026/11-420',
      expertiseType: 'Sud kompyuter-texnikaviy ekspertizasi',
      institution: 'Kiberxavfsizlik va Raqamli Sud Ekspertizasi Markazi',
      date: '25.11.2026',
      legalBasis: 'O‘zR JPK 68, 95¹, 172, 180, 184, 204²-moddalari',
      warningRef:
        'Ekspert bila turib yolg‘on xulosa berganlik uchun O‘zR JK 238-moddasi bo‘yicha jinoiy javobgarlik haqida ogohlantirildi.',
      findings: [
        'Qattiq diskdan yozuvni bloklovchi qurilma orqali olingan bitma-bit obrazning SHA-256 xeshi (8f92b14c...1d2e3f4a) hodisa joyi bayonnomasi bilan 100% mos keldi — o‘zgartirish kiritilmagan.',
        'Foydalanuvchi katalogida «phishing_gate.py» skripti va soxta «TuronPay» 3D-Secure OTP yig‘uvchi veb-shablonlari 19.11.2026 soat 13:55–14:16 oralig‘ida ishga tushirilgani aniqlandi.',
        'Tarmoq jurnallari 185.139.137.44 IP manzili orqali jabrlanuvchi sessiyasidan 6 xonali OTP kodini ushlab qolish va 8600****9104 kartasiga yo‘naltirish amalga oshirilganini tasdiqladi.',
      ],
      conclusion:
        'Tadqiq etilgan ish stoli kompyuteri (Dalil_Kompyuter) 42 500 000 so‘m mablag‘ni phishing yo‘li bilan o‘zlashtirishda bevosita qurol sifatida ishlatilgan; disk obrazi JPK 95¹, 184 va 204²-moddalari talablariga muvofiq maqbul elektron dalil hisoblanadi.',
    },
  },
  Dalil_Smartfon: {
    id: 'Dalil_Smartfon',
    cluePinId: 'clue_phishing_link',
    markerNumber: 4,
    title: 'Gumonlanuvchi Smartfoni',
    category: 'Raqamli Dalil №4',
    jpkRef: 'JPK 95¹, 172, 180, 204²-moddalar',
    desc: 'Samsung Galaxy A54 (IMEI: 354892104491820). Faradey paketida olingan Telegram bot loglari va SMS yozishmalari ekspertiza № 2026/11-421 orqali tasdiqlangan.',
    hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    details: [
      'IMEI: 354892104491820 — Yunusobod BS-TSH-104 tayanch stansiyasi',
      'Telegram @orion_verify_bot boshqaruv tokeni va loglari tiklandi',
      'Sud mobil-raqamli ekspertizasi № 2026/11-421 ilova qilingan',
    ],
    focusPosition: [0.35, 1.48, 0.2],
    focusLookAt: [0.22, 0.81, -0.72],
    custodyPassport: {
      isDigital: true,
      evidenceCode: 'RD-2026/0418-04',
      seizedAt: '19.11.2026, 15:31',
      investigator: 'Qodirov Temur',
      storageCondition: 'Faradey paketi / bitma-bit obraz (tarmoqdan izolyatsiya)',
      jpkArticle: 'O‘zR JPK 204² va 95¹-moddalar',
    },
    expertiseReport: {
      reportNumber: '№ 2026/11-421',
      expertiseType: 'Sud mobil-raqamli ekspertizasi',
      institution: 'Kiberxavfsizlik va Raqamli Sud Ekspertizasi Markazi',
      date: '25.11.2026',
      legalBasis: 'O‘zR JPK 68, 95¹, 172, 180, 184, 204²-moddalari',
      warningRef:
        'Ekspert bila turib yolg‘on xulosa berganlik uchun O‘zR JK 238-moddasi bo‘yicha jinoiy javobgarlik haqida ogohlantirildi.',
      findings: [
        'Samsung Galaxy A54 (IMEI: 354892104491820) qurilmasi ekranlangan Faradey paketida tarmoqdan uzilgan holda keltirilgani sababli masofadan o‘chirish izlari aniqlanmadi.',
        'Telegram lokal bazasidan o‘chirilgan yozishmalar tiklanib, @orion_verify_bot soxta boti orqali soat 14:10 da jabrlanuvchiga phishing havola yuborilgani va 482915 OTP kodi qabul qilingani tasdiqlandi.',
        'Qurilmaning tizim geolokatsiya keshi soat 14:15–14:19 oralig‘ida Yunusobod 4-mavze (ATM #412 hududi) koordinatalarini qayd etgan.',
      ],
      conclusion:
        'IMEI 354892104491820 smartfoni (Dalil_Smartfon) jinoyat sodir etilgan daqiqada Yunusobod hududida faol bo‘lgan va soxta bank botini boshqargan; Faradey paketida olingan raqamli izlar JPK 95¹, 184 va 204²-moddalariga ko‘ra to‘liq maqbul dalil sifatida e’tirof etiladi.',
    },
  },
  Dalil_Seyf: {
    id: 'Dalil_Seyf',
    cluePinId: 'clue_bank_transfer',
    markerNumber: 5,
    title: 'Temir Seyf (Tranzit kartalar)',
    category: 'Ashyoviy Dalil №5',
    jpkRef: 'JPK 95¹, 104, 172, 180-moddalar',
    desc: '42 500 000 so‘m o‘tkazilgan 8600****9104 tranzit bank kartasi va naqd pul o‘ramlari saqlangan po‘lat seyf. Ekspertiza xulosasi № 2026/11-422 tayyor.',
    hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    details: [
      '8600****9104 raqamli tranzit karta va ATM #412 cheklari aniqlandi',
      'Kodli qulf tutqichida gumonlanuvchining qo‘lqopsiz barmoq izlari bor',
      'Sud trasologik va daktiloskopik ekspertizasi № 2026/11-422 tayyor',
    ],
    focusPosition: [0.75, 1.45, 0.95],
    focusLookAt: [2.15, 0.52, -0.75],
    custodyPassport: {
      isDigital: false,
      evidenceCode: 'AD-2026/0418-05',
      seizedAt: '19.11.2026, 15:46',
      investigator: 'Qodirov Temur',
      storageCondition: 'Muhrlangan ashyoviy konteyner / xolislar ishtirokida',
      jpkArticle: 'O‘zR JPK 104, 203 va 95¹-moddalar',
    },
    expertiseReport: {
      reportNumber: '№ 2026/11-422',
      expertiseType: 'Sud trasologik va daktiloskopik ekspertizasi',
      institution: 'X. Sulaymonova nomidagi Respublika sud ekspertiza markazi',
      date: '25.11.2026',
      legalBasis: 'O‘zR JPK 68, 95¹, 172, 180, 184-moddalari',
      warningRef:
        'Ekspert bila turib yolg‘on xulosa berganlik uchun O‘zR JK 238-moddasi bo‘yicha jinoiy javobgarlik haqida ogohlantirildi.',
      findings: [
        'Po‘lat seyf eshigida buzib kirish (mexanik shikastlash) izlari mavjud emas — qulf shtatdagi kod kombinatsiyasi orqali ochilgan.',
        'Seyfning metall tutqichi va ichki 8600****9104 tranzit bank kartasi yuzasidan olingan 3 ta papillyar barmoq izi gumonlanuvchi namunalari bilan 12–15 ta xususiy belgi bo‘yicha mos keldi.',
        'Seyf ichidagi naqd pul o‘ramlarining bank lenta muhrlari Yunusobod 4-mavzedagi ATM #412 kassetasi seriya raqamlari bilan bir xil ekani aniqlandi.',
      ],
      conclusion:
        'Temir seyf (Dalil_Seyf) begona shaxslar tomonidan buzilmagan, uning tutqichi va ichidagi 8600****9104 tranzit kartasida bevosita gumonlanuvchining barmoq izlari qolgan; ashyoviy dalillar JPK 95¹, 184-moddalari talabiga to‘liq javob beradi.',
    },
  },
};

export function resolveEvidenceInfo(objectName: string): ForensicEvidenceInfo {
  const exact = FORENSIC_EVIDENCE_CATALOG[objectName];
  if (exact) return exact;

  const matchedKey = Object.keys(FORENSIC_EVIDENCE_CATALOG).find((key) =>
    objectName.startsWith(key)
  );
  if (matchedKey) return FORENSIC_EVIDENCE_CATALOG[matchedKey];

  const cleanLabel = objectName.replace(/^Dalil_/, '').replace(/[_.-]+/g, ' ').trim();
  return {
    id: objectName,
    cluePinId: objectName,
    markerNumber: 0,
    title: cleanLabel ? `Dalil: ${cleanLabel}` : objectName,
    category: 'Maxsus 3D Model Dalili',
    jpkRef: 'JPK 95¹, 204²-moddalar',
    desc: `Yuklangan 3D sahnadagi «${objectName}» ob’ekti ashyoviy dalil sifatida belgilandi.`,
    hash: '7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    details: [
      `3D model ob’ekt nomi: ${objectName}`,
      'Hodisa joyini ko‘zdan kechirish bayonnomasiga kiritildi',
    ],
    focusPosition: [0, 1.6, 2.2],
    focusLookAt: [0, 1.0, 0],
    custodyPassport: {
      isDigital: true,
      evidenceCode: 'RD-2026/3D-CUSTOM',
      seizedAt: '25.11.2026, 22:20',
      investigator: 'Qodirov Temur',
      storageCondition: 'Muhrlangan raqamli paket / bitma-bit obraz',
      jpkArticle: 'O‘zR JPK 204² va 95¹-moddalar',
    },
  };
}
