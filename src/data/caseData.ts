import {
  AgencyRequestDef,
  CustomCase,
  EvidenceClue,
  SimulationState,
  StudentLeaderboardEntry,
} from '../types/simulation';

export const ACTIVE_CASE = {
  caseNumber: '102-2026/TSH-0418',
  title: "Bank kartasidan 42 500 000 so'mni kiberfiribgarlik yo'li bilan o'zlashtirish",
  shortCategory: 'Kiberfiribgarlik (JK 168-modda 3-qism / JPK 322)',
  receivedDate: '19.11.2026',
  receivedTime: '14:42',
  district: 'Toshkent shahri, Chilonzor tumani IIO FMB',
  victimName: 'Karimov Jasur Bahromovich (1987-y.t.)',
  victimPhone: '+998 90 418-22-91',
  suspectName: 'Tursunov Dilshod Alisherovich (1998-y.t.)',
  damageAmount: "42 500 000 so'm",
  summary102:
    "Fuqaro J.Karimov 102 qisqa raqamiga murojaat qilib, soat 14:10 atrofida o'zini «Milliy Bank Xavfsizlik bo'limi» xodimi deb tanishtirgan shaxs Telegram orqali soxta himoya havolasi yuborganini, SMS kod kiritilgach uning «TuronPay» bank kartasidan 42 500 000 so'm mablag' noma'lum hisobga yechib olinganini ma'lum qildi.",
  victimStatement:
    "«Menga Telegram orqali bank logotipi tushirilgan akkauntdan xabar keldi. Kartam bloklanishini aytib, tezkor tasdiqlash havolasini ochishimni so'rashdi. Men bir martalik SMS kodni kiritganimdan 3 daqiqa o'tib, hisobimdan 42 500 000 so'm boshqa kartaga o'tib ketdi. Zudlik bilan chora ko'rishingizni so'rayman.»",
  proceduralDeadlineHours: 72,
};

export const CASES_LIST = [
  {
    id: 'case-168',
    caseNumber: '102-2026/TSH-0418',
    title: "Bank kartasidan 42.5 mln so'm kiberfiribgarlik",
    jkCode: 'JK 168-modda 3-qism (Firibgarlik)',
    jpkCode: 'JPK 322, 329, 381-moddalar',
    difficulty: 'O‘rta',
    active: true,
  },
  {
    id: 'case-104',
    caseNumber: '102-2026/YUN-0912',
    title: "Qasddan badanga o‘rtacha og‘ir shikayet yetkazish",
    jkCode: 'JK 104-modda 2-qism (Badanga shikayet)',
    jpkCode: 'JPK 335, 360-moddalar (Tibbiy ekspertiza)',
    difficulty: 'Murakkab',
    active: false,
  },
  {
    id: 'case-210',
    caseNumber: '102-2026/MIR-1104',
    title: "Mansabdor shaxs tomonidan pora olish (Korrupsiya)",
    jkCode: 'JK 210-modda 3-qism (Pora olish)',
    jpkCode: 'JPK 340, 395-moddalar (Tezkor tadbir)',
    difficulty: 'Yuqori',
    active: false,
  },
];

export const STEP_DEFINITIONS = [
  { id: 1, shortLabel: '102 Xabari', fullTitle: '102 Xabari va Dastlabki qaror' },
  { id: 2, shortLabel: 'Dalillar doskasi', fullTitle: 'Raqamli Dalillar va «Dalillar doskasi»' },
  { id: 3, shortLabel: 'So‘rov va Qaror', fullTitle: 'Idoralararo so‘rovlar va Jinoyat ishi qo‘zg‘atish' },
  { id: 4, shortLabel: 'AI-So‘roq', fullTitle: 'AI-So‘roq, «Svetofor» va Etika dilemmasi' },
  { id: 5, shortLabel: 'Prokuror nazorati', fullTitle: 'Ayblov xulosasi va Prokuror nazorati' },
  { id: 6, shortLabel: 'Virtual Sud', fullTitle: 'Virtual Sud Majlisi va «Xatolar xaritasi»' },
];

export const STEP1_OPTIONS = [
  {
    id: 'lawful_register',
    title: "Shakl-1 kitobida zudlik bilan ro'yxatga olish va tergovga qadar tekshiruvni boshlash",
    description:
      "Xabarni JPK talablariga muvofiq rasmiylashtirish, jabrlanuvchidan batafsil ariza olish hamda raqamli izlar yo'qolmasligi uchun tezkor bank blokirovkasi va tekshiruv tayinlash.",
    status: 'green' as const,
    scoreDelta: 15,
    hoursSpent: 2,
    jpkRef: 'JPK 322, 329-moddalar',
    feedback:
      "To'g'ri protsessual qaror. 102 xabari o'z vaqtida rasmiylashtirildi, raqamli dalillarni saqlab qolish chorasi ko'rildi va tergovga qadar tekshiruv muddatlari nazoratga olindi.",
  },
  {
    id: 'delay_wait',
    title: "Bankdan yozma ma'lumotnoma kelishini kutib, qaror qabul qilishni 48 soatga kechiktirish",
    description:
      "Tergovga qadar tekshiruvni rasman boshlamasdan, jabrlanuvchining o'zi bankdan qog'oz ko'chirma olib kelishini kutib turish.",
    status: 'yellow' as const,
    scoreDelta: -5,
    hoursSpent: 28,
    jpkRef: 'JPK 329-modda (muddatlar)',
    feedback:
      "Protsessual kechikish yuz berdi. Kiberjinoyatlarda dastlabki soatlar hal qiluvchi ahamiyatga ega; 28 soatlik yo'qotish mablag'ni muzlatish va loglarni saqlash imkonini pasaytirdi.",
  },
  {
    id: 'informal_call',
    title: "Rasmiy ro'yxatga olmasdan, norasmiy tarzda gumonlanuvchiga qo'ng'iroq qilib kelishuv taklif qilish",
    description:
      "Xabarni elektron tizimga kiritmay, pulni qaytarib berish sharti bilan og'zaki ogohlantirish orqali ishni yopishga urinish.",
    status: 'red' as const,
    scoreDelta: -20,
    hoursSpent: 6,
    jpkRef: 'JPK 321, 329-moddalar (qo‘pol buzilish)',
    feedback:
      "Jiddiy protsessual qonunbuzarlik! Jinoyat haqidagi xabarni ro'yxatdan yashirish va norasmiy muzokara olib borish qat'iyan man etiladi. Bu holat Prokuror nazoratida va Sudda salbiy baholanadi.",
  },
];

export const BANK_TRANSACTIONS = [
  {
    id: 'TX-90811',
    time: '19.11.2026 11:20:04',
    fromCard: '8600 14** **** 3320',
    toCard: '9860 03** **** 4412',
    amount: "1 450 000 so'm",
    channel: 'TuronPay Mobile',
    note: 'Maishiy to‘lov — supermarket',
    suspicious: false,
  },
  {
    id: 'TX-90847',
    time: '19.11.2026 14:15:38',
    fromCard: '8600 14** **** 3320 (J.Karimov)',
    toCard: '8600 57** **** 9104 (Tranzit — D.Tursunov)',
    amount: "42 500 000 so'm",
    channel: 'Veb-API / OTP tasdiq',
    note: 'Shubhali P2P o‘tkazma (3D-Secure phishing sessiyasi)',
    suspicious: true,
  },
  {
    id: 'TX-90852',
    time: '19.11.2026 14:19:11',
    fromCard: '8600 57** **** 9104 (D.Tursunov)',
    toCard: 'ATM #412 Yunusobod (Naqdlashtirish)',
    amount: "15 000 000 so'm",
    channel: 'Bankomat yechish',
    note: 'Tranzit kartadan tezkor qisman naqdlashtirish',
    suspicious: true,
  },
];

export const TELEGRAM_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'suspect',
    author: 'Milliy Bank Xavfsizlik (@milliybank_sec_uz)',
    time: '14:09',
    text: "Hurmatli mijoz! Kartangizdan shubhali urinish aniqlandi. 5 daqiqa ichida himoyani faollashtirmasangiz hisobingiz vaqtincha bloklanadi.",
  },
  {
    id: 'msg-2',
    sender: 'suspect',
    author: 'Milliy Bank Xavfsizlik (@milliybank_sec_uz)',
    time: '14:10',
    text: "Tasdiqlash havolasi: https://milliy-bank-verify[.]uz/otp-confirm — kirib SMS orqali kelgan 6 xonali kodni kiriting.",
    highlight: true,
  },
  {
    id: 'msg-3',
    sender: 'victim',
    author: 'J.Karimov',
    time: '14:13',
    text: "Havolaga kirdim, 482915 kodini yozdim. Endi bloklanmaydimi?",
  },
  {
    id: 'msg-4',
    sender: 'system',
    author: 'TuronPay SMS Xabarnoma',
    time: '14:15',
    text: "Yechib olindi: 42 500 000 UZS. Qabul qiluvchi karta: 8600 57** **** 9104. Qoldiq: 120 400 UZS.",
    highlight: true,
  },
];

export const TELECOM_BILLING_LOGS = [
  {
    time: '19.11.2026 13:55:12',
    phone: '+998 99 774-10-88',
    imei: '354892104491820',
    ip: '185.139.137.44',
    tower: 'BS-TSH-104 (Yunusobod tumani, 4-mavze)',
    activity: 'Phishing domenini boshqarish paneliga kirish',
    suspicious: true,
  },
  {
    time: '19.11.2026 14:15:30',
    phone: '+998 99 774-10-88',
    imei: '354892104491820',
    ip: '185.139.137.44',
    tower: 'BS-TSH-104 (Yunusobod tumani, 4-mavze)',
    activity: 'TuronPay API sessiyasi — OTP kiritish (42,5 mln so‘m)',
    suspicious: true,
  },
  {
    time: '19.11.2026 14:18:45',
    phone: '+998 99 774-10-88',
    imei: '354892104491820',
    ip: '185.139.137.44',
    tower: 'BS-TSH-106 (Yunusobod, ATM #412 yaqini)',
    activity: 'Mobil internet seansi — bankomat hududida qayd etilgan',
    suspicious: true,
  },
  {
    time: '19.11.2026 16:40:02',
    phone: '+998 99 774-10-88',
    imei: '354892104491820',
    ip: '94.158.52.19',
    tower: 'BS-TSH-221 (Sergeli tumani)',
    activity: 'Oddiy ovozli qo‘ng‘iroq (jinoyatdan 2 soat o‘tgach)',
    suspicious: false,
  },
];

export const EVIDENCE_CLUES: EvidenceClue[] = [
  {
    id: 'clue_bank_transfer',
    sourceTab: 'bank',
    sourceLabel: "Bank ko'chirmasi",
    title: "14:15:38 da 42 500 000 so'm D.Tursunovning 8600****9104 kartasiga o'tgan va 4 daqiqada naqdlashtirilgan",
    detail:
      "Tranzit hisob egasi bevosita gumonlanuvchi nomida bo'lib, pullar Yunusoboddagi ATM #412 orqali qisman yechilgan.",
    isCritical: true,
    jpkNote: 'JPK 81-modda (ashyoviy va raqamli dalil)',
  },
  {
    id: 'clue_phishing_link',
    sourceTab: 'chat',
    sourceLabel: 'Telegram / SMS yozishma',
    title: "Aldov yo'li bilan soxta «milliy-bank-verify[.]uz» havolasi orqali 6 xonali OTP kodi qo'lga kiritilgan",
    detail:
      "Jabrlanuvchi ishonchiga kirish va aldash alomati mavjud — bu qilmishni o'g'rilikdan (JK 169) firibgarlikka (JK 168) ajratuvchi muhim belgi.",
    isCritical: true,
    jpkNote: 'JK 168-modda kvalifikatsiya asosi',
  },
  {
    id: 'clue_billing_tower',
    sourceTab: 'billing',
    sourceLabel: 'Aloqa billingi / IP jurnal',
    title: "Soat 14:15 da IMEI 354892104491820 va IP 185.139.137.44 Yunusobod BS-TSH-104 tayanch stansiyasida qayd etilgan",
    detail:
      "Gumonlanuvchi Sergeliga faqat 16:40 da borgan; jinoyat sodir etilgan daqiqada aynan Yunusobodda bo'lgani isbotlanadi.",
    isCritical: true,
    jpkNote: 'Alibini rad etuvchi obyektiv raqamli iz',
  },
  {
    id: 'clue_distractor_grocery',
    sourceTab: 'bank',
    sourceLabel: "Bank ko'chirmasi",
    title: "11:20 da jabrlanuvchining supermarketda 1 450 000 so'mlik odatiy xaridi",
    detail: "Bu kundalik maishiy tranzaksiya bo'lib, jinoyat tarkibiga aloqasi yo'q.",
    isCritical: false,
    jpkNote: "Aloqador bo'lmagan ma'lumot (JPK 95-modda)",
  },
  {
    id: 'clue_distractor_sergeli',
    sourceTab: 'billing',
    sourceLabel: 'Aloqa billingi / IP jurnal',
    title: "16:40 da Sergeli tumanidan amalga oshirilgan odatiy ovozli qo'ng'iroq",
    detail: "Voqeadan ikki soatdan ortiq vaqt o'tgach qayd etilgan, asosiy ayblov dalili emas.",
    isCritical: false,
    jpkNote: 'Ikkinchi darajali ma’lumot',
  },
];

export const AGENCY_REQUESTS: AgencyRequestDef[] = [
  {
    id: 'req_iiv_tq',
    agency: 'IIV Tezkor-qidiruv xizmati',
    shortTitle: 'Tezkor-qidiruv va ATM kamera yozuvi',
    description: "ATM #412 (Yunusobod) videokuzatuv tasvirlari va gumonlanuvchining turar joyini aniqlash bo'yicha topshiriq.",
    hoursCost: 4,
    responseCode: 'IIV-TQX/2026-8841',
    responseSummary: "Yunusobod 4-mavzedagi ATM #412 kamerasidan soat 14:19 dagi tasvir olindi.",
    responseFacts: [
      "Kadrda qora kurtkali shaxs (biometrik moslik 96% — D.Tursunov) 8600****9104 kartadan naqd pul yechgan.",
      "Gumonlanuvchining doimiy yashash manzili va aloqa doirasi aniqlandi.",
    ],
    recommended: true,
  },
  {
    id: 'req_cyber_forensics',
    agency: 'Kiberxavfsizlik va Raqamli Ekspertiza Markazi',
    shortTitle: 'Kompyuter-texnikaviy ekspertiza',
    description: "Phishing havolasi, IP 185.139.137.44 loglari va qurilma IMEI ma'lumotlarini protsessual ekspertizadan o'tkazish.",
    hoursCost: 6,
    responseCode: 'KXM-EKS/2026-1192',
    responseSummary: "Phishing domen boshqaruv paneliga kirish IMEI 354892104491820 qurilmasidan amalga oshirilgani tasdiqlandi.",
    responseFacts: [
      "Hash-summa (SHA-256) bilan rasmiylashtirilgan server loglari ilova qilindi.",
      "Telegram bot tokeni va soxta bank sahifasi o'rtasidagi texnik bog'liqlik isbotlandi.",
    ],
    recommended: true,
  },
  {
    id: 'req_bank_telecom',
    agency: 'Tijorat banki va Mobil aloqa operatori',
    shortTitle: 'Rasmiy bank ko‘chirmasi va billing so‘rovi',
    description: "Sudda maqbul dalil sifatida qabul qilinishi uchun muhrlangan bank ko'chirmasi va abonent billingini olish.",
    hoursCost: 3,
    responseCode: 'BNK-OP/2026-5037',
    responseSummary: "Elektron imzo bilan tasdiqlangan rasmiy tranzaksiya va tayanch stansiya jurnali taqdim etildi.",
    responseFacts: [
      "42 500 000 so'mning 27 500 000 so'm qismi tranzit hisobda muzlatib qo'yildi.",
      "BS-TSH-104 tayanch stansiyasi koordinatalari soat 14:15 holatiga tasdiqlandi.",
    ],
    recommended: true,
  },
  {
    id: 'req_customs_fvv',
    agency: 'Bojxona qo‘mitasi / FVV',
    shortTitle: 'Chegara kesib o‘tish nazorati',
    description: "Gumonlanuvchining respublika hududidan chiqib ketish ehtimolini tekshirish so'rovi (qo'shimcha chora).",
    hoursCost: 5,
    responseCode: 'DBQ-NZ/2026-309',
    responseSummary: "D.Tursunov so'nggi 6 oy ichida davlat chegarasini kesib o'tmagan.",
    responseFacts: [
      "Xorijga chiqish bo'yicha faol chipta yoki chegara qaydnomasi mavjud emas.",
    ],
    recommended: false,
  },
];

export const JK_OPTIONS = [
  {
    value: 'JK_168_3',
    label: "JK 168-modda 3-qismi (Axborot texnologiyalaridan foydalanib ko'p miqdorda firibgarlik)",
    correct: true,
  },
  {
    value: 'JK_169_2',
    label: "JK 169-modda 2-qismi (Yashirin talon-toroj — o'g'rilik)",
    correct: false,
  },
  {
    value: 'JK_166_1',
    label: "JK 166-modda 1-qismi (Ochiqdan-ochiq talonchilik)",
    correct: false,
  },
];

export const JPK_BASIS_OPTIONS = [
  {
    value: 'JPK_321_322',
    label: "JPK 321, 322 va 331-moddalar (Yetarli ma'lumotlar va qonuniy sabab mavjudligi)",
    correct: true,
  },
  {
    value: 'JPK_84',
    label: "JPK 84-modda (Ayblilik masalasini hal qilmay ishni tugatish)",
    correct: false,
  },
  {
    value: 'JPK_333',
    label: "JPK 333-modda (Jinoyat ishi qo'zg'atishni rad etish)",
    correct: false,
  },
];

export const MANDATORY_REQUISITES = [
  { id: 'req_date_place', label: 'Qaror qabul qilingan sana, vaqt va joy', required: true },
  { id: 'req_investigator', label: 'Tergovchining lavozimi, unvoni va F.I.Sh.', required: true },
  { id: 'req_facts', label: 'Jinoyat tarkibini tasdiqlovchi faktik holatlar bayoni', required: true },
  { id: 'req_prosecutor_copy', label: "Qaror nusxasini 24 soat ichida prokurorga yuborish bandi", required: true },
];

export const INVESTIGATIVE_ACTIONS = [
  { id: 'act_victim', label: "J.Karimovni jabrlanuvchi deb e'tirof etish va so'roq qilish" },
  { id: 'act_evidence', label: "Raqamli dalillarni bayonnoma bilan ishga qo'shish (JPK 81-modda)" },
  { id: 'act_suspect', label: "Gumonlanuvchini advokat ishtirokida so'roq qilish (JPK 48-modda)" },
];

export const QUICK_INTERROGATION_QUESTIONS = [
  "19-noyabr kuni soat 14:00 dan 14:30 gacha qayerda bo'lgansiz va 8600****9104 raqamli bank kartangizdan kim foydalangan?",
  "Sizga tegishli IMEI 354892104491820 qurilmasi soat 14:15 da Yunusobod tumanidagi tayanch stansiyada va IP 185.139.137.44 orqali qayd etilganini qanday izohlaysiz?",
  "Yunusobod 4-mavzedagi ATM #412 bankomatidan soat 14:19 da 15 000 000 so'm yechib olingan holat bo'yicha nima deya olasiz?",
];

export const ETHICS_DILEMMA = {
  codeRef: "PF-257 va JPK 48, 224-moddalar",
  title: "Inson huquqlari va protsessual etika sinovi",
  scenario:
    "So'roq tanaffusi vaqtida tezkor xodimlardan biri sizga norasmiy ravishda quyidagini taklif qildi: «Gumonlanuvchi dovdirab qoldi. Advokat yetib kelishini kutib o'tirmaylik, hozirning o'zida iqrornoma yozdirib olsak, ish bugunoq yopiladi va reytingimiz oshadi».",
  options: [
    {
      id: 'ethics_lawful',
      title: "Qat'iyan rad etish — himoyachi ishtirokisiz so'roqni to'xtatib, advokatni rasman chaqirish",
      description:
        "Gumonlanuvchining JPK 48-moddadagi himoya huquqini to'liq ta'minlash va dalillarni faqat qonuniy yo'l bilan mustahkamlash.",
      lawful: true,
      scoreDelta: 15,
      ethicsDelta: 10,
      explanation:
        "Namuna bo'ladigan halollik va qonun ustuvorligi! Himoyachi ishtirokisiz olingan iqrornoma JPK 95¹-moddasiga ko'ra nomaqbul dalil hisoblanadi va sudda bekor qilinadi.",
    },
    {
      id: 'ethics_unlawful',
      title: "Tezkor natija uchun advokatsiz tushuntirish xati olib, keyinroq imzolatishga rozi bo'lish",
      description:
        "Muddatni tejash maqsadida himoyachi kelishini kutmasdan iqrorlik ko'rsatmasini yozib olish.",
      lawful: false,
      scoreDelta: -25,
      ethicsDelta: -35,
      explanation:
        "Qo'pol protsessual va axloqiy buzilish (PF-257, JPK 48 va 95¹-moddalar)! Himoya huquqini buzib olingan har qanday ko'rsatma yuridik kuchga ega emas va ishning qayta tergovga qaytarilishiga sabab bo'ladi.",
    },
  ],
};

export const PROSECUTOR_CHECKLIST = [
  { id: 'chk_evidence', label: "Barcha raqamli dalillar (bank, chat, billing) bayonnoma bilan ishga qo'shildi" },
  { id: 'chk_qualification', label: "Jinoyat kvalifikatsiyasi JK 168-modda 3-qismi bilan asoslandi" },
  { id: 'chk_rights', label: "Gumonlanuvchi va jabrlanuvchining protsessual huquqlari tushuntirildi" },
  { id: 'chk_damage', label: "Moddiy zararni qoplash chorasi (27,5 mln so'm muzlatish) qayd etildi" },
];

export const INITIAL_LEADERBOARD: StudentLeaderboardEntry[] = [
  {
    id: 'st-1',
    name: 'Abdullayev Sardorbek',
    group: 'HMQA-301',
    rankTitle: "O'ta muhim ishlar bo'yicha tergovchi",
    proceduralAccuracy: 96,
    deadlineCompliance: 94,
    evidenceStrength: 98,
    cleanCourtRate: 95,
    totalScore: 142,
    casesCompleted: 7,
  },
  {
    id: 'st-2',
    name: 'Nazarova Madinabonu',
    group: 'HMQA-302',
    rankTitle: 'Katta tergovchi',
    proceduralAccuracy: 91,
    deadlineCompliance: 90,
    evidenceStrength: 93,
    cleanCourtRate: 90,
    totalScore: 124,
    casesCompleted: 6,
  },
  {
    id: 'st-3',
    name: 'Rahimov Javohir',
    group: 'HMQA-301',
    rankTitle: 'Katta tergovchi',
    proceduralAccuracy: 87,
    deadlineCompliance: 85,
    evidenceStrength: 89,
    cleanCourtRate: 84,
    totalScore: 112,
    casesCompleted: 5,
  },
  {
    id: 'st-4',
    name: 'Sodiqova Nilufar',
    group: 'HMQA-304',
    rankTitle: 'Tergovchi',
    proceduralAccuracy: 82,
    deadlineCompliance: 88,
    evidenceStrength: 80,
    cleanCourtRate: 79,
    totalScore: 96,
    casesCompleted: 4,
  },
  {
    id: 'st-5',
    name: 'Xolmatov Azizjon',
    group: 'HMQA-303',
    rankTitle: 'Tergovchi',
    proceduralAccuracy: 76,
    deadlineCompliance: 72,
    evidenceStrength: 78,
    cleanCourtRate: 71,
    totalScore: 81,
    casesCompleted: 3,
  },
];

export const INSTRUCTOR_ERROR_HOTSPOTS = [
  { stage: 'Dalillarni rasmiylashtirish', errorRate: 62, jpkArticle: 'JPK 81, 95-m' },
  { stage: "So'roq taktikasi (Svetofor)", errorRate: 44, jpkArticle: 'JPK 96, 111-m' },
  { stage: 'Protsessual muddatlar', errorRate: 31, jpkArticle: 'JPK 329, 351-m' },
  { stage: 'JK kvalifikatsiya tanlovi', errorRate: 28, jpkArticle: 'JK 168 / 169-m' },
  { stage: 'Etika va himoya huquqi', errorRate: 19, jpkArticle: 'PF-257, JPK 48-m' },
];

export const INSTRUCTOR_GROUP_TREND = [
  { group: 'HMQA-301', aniqlik: 89, muddat: 86, sudgaOtish: 84 },
  { group: 'HMQA-302', aniqlik: 84, muddat: 82, sudgaOtish: 79 },
  { group: 'HMQA-303', aniqlik: 75, muddat: 71, sudgaOtish: 68 },
  { group: 'HMQA-304', aniqlik: 81, muddat: 85, sudgaOtish: 77 },
];

export const INITIAL_CUSTOM_CASES: CustomCase[] = [
  {
    id: 'case-preset-2',
    caseNumber: '102-2026/SAM-0192',
    title: "Elektron savdo maydonchasida soxta to'lov cheki orqali mulkni egallash",
    category: 'Kiberfiribgarlik (JK 168-modda)',
    summary102:
      "Samarqand shahrida tadbirkor 18 000 000 so'mlik maishiy texnikani soxta bank o'tkazmasi skrinshoti taqdim etgan shaxsga topshirib yuborgan.",
    difficulty: "O'rta",
    createdAt: '17.11.2026',
  },
  {
    id: 'case-preset-3',
    caseNumber: '102-2026/AND-0275',
    title: "Xizmat mavqeidan foydalanib budjet mablag'larini o'zlashtirish",
    category: "Iqtisodiy jinoyat (JK 167-modda)",
    summary102:
      "Davlat xaridlari elektron portalida narxlarni sun'iy oshirish va bajarilmagan ishlar dalolatnomasini imzolash holati bo'yicha xabar kelib tushdi.",
    difficulty: 'Murakkab',
    createdAt: '15.11.2026',
  },
];

export function createInitialState(): SimulationState {
  return {
    studentName: 'Qodirov Temur (Siz)',
    studentGroup: 'HMQA-302',
    activeView: 'dashboard',
    currentStep: 1,
    maxUnlockedStep: 1,
    totalHoursBudget: ACTIVE_CASE.proceduralDeadlineHours,
    hoursUsed: 0,
    baseScore: 50,
    ethicsIndex: 90,
    step1ChoiceId: null,
    step1Completed: false,
    pinnedClueIds: [],
    step2Completed: false,
    sentRequestIds: [],
    decisionForm: {
      jkArticle: '',
      jpkBasis: '',
      suspectStatus: "Gumonlanuvchi (JPK 47-modda)",
      mandatoryRequisites: [],
      investigativeActions: [],
      audited: false,
      auditPassed: false,
      auditIssues: [],
    },
    step3Completed: false,
    interrogationMessages: [
      {
        id: 'intro-sys',
        role: 'system',
        text: "So'roq bayonnomasi ochildi. Gumonlanuvchi D.Tursunov protsessual huquqlari bilan tanishtirildi. Qonuniy, ochiq savollar bering.",
        timestamp: '15:10',
      },
      {
        id: 'intro-suspect',
        role: 'suspect',
        text: "Tergovchi aka, bu yerda qandaydir tushunmovchilik bo'lgan. Men hech kimga bank nomidan xabar yubormaganman. Kartamni bir tanishim vaqtincha so'rab turgandi, pul qaerdan kelganini bilmayman.",
        timestamp: '15:11',
      },
    ],
    twistTriggered: false,
    alibiConfronted: false,
    ethicsDilemmaOpen: false,
    ethicsState: {
      answered: false,
      choiceId: null,
      lawful: null,
      explanation: '',
    },
    step4Completed: false,
    prosecutorReview: {
      checklist: [],
      submitted: false,
      status: 'pending',
      flags: [],
      remediated: false,
      proceededWithRisk: false,
    },
    step5Completed: false,
    courtSession: {
      challengeLoaded: false,
      advocateArgument: '',
      targetPoint: '',
      jpkRef: '',
      studentDefense: '',
      verdictIssued: false,
      verdict: null,
      verdictTitle: '',
      judgeReasoning: '',
      improvementAdvice: '',
    },
    step6Completed: false,
    timeline: [],
    customCases: INITIAL_CUSTOM_CASES,
    duelJoined: false,
  };
}
