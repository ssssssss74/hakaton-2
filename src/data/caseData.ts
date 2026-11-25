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
    id: 'CASE-02-KNIFE-NOTE',
    caseNumber: '102-2026/CHIL-0419',
    title: '«Soxta xayrlashuv xati» — qasddan odam o‘ldirish va sahnalashtirish',
    jkCode: 'JK 97-modda 1-qismi (Qasddan odam o‘ldirish)',
    jpkCode: 'JPK 95¹, 137, 172, 173, 180, 203–205, 221, 322, 329-moddalar',
    difficulty: 'Murakkab',
    active: false,
  },
  {
    id: 'case-104',
    caseNumber: '102-2026/YUN-0912',
    title: 'Qasddan badanga og‘ir shikast yetkazish',
    jkCode: 'JK 104-modda 2-qism (Badanga og‘ir shikast)',
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

export const CASE_02_KNIFE_NOTE = {
  id: 'CASE-02-KNIFE-NOTE',
  caseNumber: '102-2026/CHIL-0419',
  title: '«Soxta xayrlashuv xati» — qasddan odam o‘ldirish va sahnalashtirish',
  shortCategory: 'Qasddan odam o‘ldirish (O‘zR JK 97-modda 1-qismi)',
  jkArticle: 'O‘zR JK 97-modda 1-qismi',
  jpkArticles: 'JPK 95¹, 137, 172, 173, 180, 203–205, 221, 322, 329-moddalar',
  receivedDate: '25.11.2026',
  receivedTime: '21:55',
  district: 'Toshkent shahri, Chilonzor tumani, 47-xonadon',
  victimName: 'A. Tursunov (marhum, 1989-y.t.)',
  victimPhone: '+998 90 512-47-00 (yaqin qarindoshi)',
  suspectName: 'B. Raximov (1991-y.t.)',
  damageAmount: 'Hayotga tajovuz (JK 97-m)',
  summary102:
    'Chilonzor tumanidagi 47-xonadonda fuqaro A. Tursunovning jasadi hamda yonida oshxona pichog‘i (Dalil_Pichoq) va «xayrlashuv xati» (Dalil_Xat) topilgan. Dastlabki ko‘zdan kechirishda o‘z joniga qasd qilish sahnalashtirilgani gumon qilinmoqda; Smart-Lock PIN #4821 (21:14–21:38), GPS/BTS billingi va restoran kassa kamerasi (21:22) tekshirilmoqda.',
  victimStatement:
    '«Marhum A. Tursunovning ukasi bergan tushuntirishga ko‘ra, akasining o‘z joniga qasd qilishga hech qanday sababi bo‘lmagan. Voqea kuni soat 21:00 lar atrofida B. Raximov bilan moliyaviy qarz masalasida uchrashishi kerak edi. Xatdagi dastxat akamnikiga o‘xshamaydi, holatni xolis tergov qilishingizni so‘rayman.»',
  alibiClaim:
    'Gumonlanuvchi B. Raximov soat 21:00 dan 22:00 gacha shahar markazidagi restoranda kechki ovqatda bo‘lganini va hodisa joyiga bormaganini da’vo qilmoqda.',
  alibiContradiction: {
    restaurantCameraTime: '21:22',
    smartLockWindow: '21:14–21:38',
    smartLockPin: '#4821',
    summary:
      'Restoran kassa kamerasi va to‘lov chekida B. Raximov soat 21:22 da emas, balki uning kartasi boshqa shaxs tomonidan ishlatilgani; Smart-Lock PIN #4821 jurnali va GPS/BTS billingi esa aynan 21:14–21:38 oralig‘ida xonadonga kirib-chiqqanini isbotlaydi.',
  },
  keyEvidenceIds: [
    'Dalil_Pichoq',
    'Dalil_Xat',
    'Smart-Lock PIN #4821 jurnali',
    'GPS/BTS billingi',
    'Restoran kassa kamerasi + to‘lov cheki (21:22)',
  ],
  prosecutorChecklist: [
    {
      id: 'case02_chk_scene',
      label:
        'Hodisa joyini ko‘zdan kechirish bayonnomasi, Dalil_Pichoq (№ 2026/11-418) va Dalil_Xat (№ 2026/11-419) muhrlanishi JPK 137, 203–204-moddalarga mos',
    },
    {
      id: 'case02_chk_electronic',
      label:
        'Smart-Lock PIN #4821 jurnali, GPS/BTS billingi va restoran kassa kamerasi yozuvi (21:22) JPK 95¹, 204²-moddalar tartibida elektron dalil sifatida rasmiylashtirilgan',
    },
    {
      id: 'case02_chk_expertise',
      label:
        'Daktiloskopik-DNK va sud-xatshunoslik ekspertizalari JPK 172, 180, 184-moddalar asosida tayinlanib, ekspertlar JK 238-modda bo‘yicha ogohlantirilgan',
    },
    {
      id: 'case02_chk_indictment',
      label:
        'Ayblov xulosasi JK 97-modda 1-qismi bilan to‘g‘ri kvalifikatsiya qilinib, JPK 384-modda talablariga muvofiq prokurorga taqdim etilgan',
    },
  ],
  virtualCourt: {
    advocateChallenge: {
      advocateArgument:
        'Hurmatli sud raisi! Tergov organi Smart-Lock PIN #4821 jurnalini gumonlanuvchi B. Raximovga bog‘lamoqda, biroq PIN-kod uchinchi shaxsga ham ma’lum bo‘lishi mumkin — qurilmaning biometrik autentifikatsiyasi mavjud emas! Bundan tashqari, Dalil_Xat bo‘yicha xatshunoslik ekspertizasi namunalari JPK 204² va 95¹-moddalari talablarini buzgan holda olingan. Ushbu dalillarni nomaqbul deb topib, ishni qayta tergovga qaytarishingizni talab qilaman!',
      targetPoint: 'Smart-Lock #4821 autentifikatsiyasi va Dalil_Xat namunalari maqbulligi',
      jpkRef: 'JPK 95¹, 184, 204²-moddalar',
    },
    verdicts: {
      approved: {
        verdict: 'approved' as const,
        verdictTitle: 'Ayblov tasdiqlandi — JK 97-modda 1-qismi bo‘yicha sud hukmi e’lon qilindi',
        judgeReasoning:
          'Sud tergovchining asosli raddiyasini inobatga oldi: Smart-Lock PIN #4821 (21:14–21:38) jurnali alohida emas, balki GPS/BTS billingi, soat 21:22 dagi restoran kassa kamerasi tasviri, Dalil_Pichoq dastasidagi daktiloskopik-DNK mosligi (№ 2026/11-418) hamda Dalil_Xat xatshunoslik xulosasi (№ 2026/11-419) bilan uzviy dalillar zanjirini tashkil etadi. Barcha materiallar JPK 95¹, 184, 204²-moddalarga muvofiq rasmiylashtirilgan.',
        improvementAdvice:
          'A’lo darajadagi sud himoyasi! Raqamli va moddiy dalillarni o‘zaro uyg‘unlashtirib, himoyachining JPK 95¹-modda bo‘yicha e’tirozini to‘liq bartaraf etdingiz.',
      },
      returned: {
        verdict: 'returned' as const,
        verdictTitle: 'Ish qayta tergovga qaytarildi (JPK 416 / 419-modda tartibida)',
        judgeReasoning:
          'Himoyachining JPK 95¹ va 204²-moddalarga tayangan e’tirozi qisman asosli deb topildi. Smart-Lock #4821 jurnalining haqiqiyligi, Dalil_Xat qiyosiy namunalari olingan bayonnoma yoki himoya huquqiga doir protsessual kamchiliklar bartaraf etilmagani sababli JK 97-modda 1-qismi bo‘yicha hukm chiqarish imkonsiz.',
        improvementAdvice:
          'Elektron dalillarni (Smart-Lock, kamera, billing) mutaxassis ishtirokida hash-summa bilan muhrlang va ekspertiza namunalarini JPK 184, 204²-moddalar talabiga qat’iy rioya qilgan holda rasmiylashtiring.',
      },
    },
  },
};

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
    value: 'JK_97_1',
    label: 'JK 97-modda 1-qismi (Qasddan odam o‘ldirish)',
    correct: false,
  },
  {
    value: 'JK_167_3',
    label: 'JK 167-modda 3-qismi (O‘zlashtirish yoki rastrata yo‘li bilan talon-toroj qilish)',
    correct: false,
  },
  {
    value: 'JK_104_2',
    label: 'JK 104-modda 2-qismi (Qasddan badanga og‘ir shikast yetkazish)',
    correct: false,
  },
  {
    value: 'JK_210_3',
    label: 'JK 210-modda 3-qismi (Mansabdor shaxs tomonidan pora olish)',
    correct: false,
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

export const CASE_02_INTERROGATION_QUESTIONS = [
  'Soat 21:22 da restoranda bo‘lganingizni aytdingiz, ammo restoran kassa kamerasi kartangizdan boshqa shaxs foydalanganini ko‘rsatmoqda — buni qanday izohlaysiz?',
  'Smart-Lock PIN #4821 elektron qulf jurnali sizning 21:14–21:38 oralig‘ida 47-xonadonga kirib-chiqqaningizni qayd etgan. O‘sha vaqtda xonadonda nima qilgansiz?',
  'Dalil_Pichoq (ekspertiza № 2026/11-418) dastasidagi barmoq izlaringiz va Dalil_Xat (№ 2026/11-419) xatshunoslik xulosasini qanday tushuntirasiz?',
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
    id: 'CASE-02-KNIFE-NOTE',
    caseNumber: '102-2026/CHIL-0419',
    title: '«Soxta xayrlashuv xati» (Dalil_Pichoq + Dalil_Xat + Smart-Lock #4821)',
    category: 'Qasddan odam o‘ldirish (JK 97-modda 1-qismi)',
    summary102:
      'Xonadonda oshxona pichog‘i (№ 2026/11-418) va soxta xayrlashuv xati (№ 2026/11-419) topilgan. Smart-Lock PIN #4821 (21:14–21:38), GPS/BTS billingi va restoran kassa kamerasi (21:22) gumonlanuvchi B. Raximovning yolg‘on alibisini fosh etadi.',
    difficulty: 'Murakkab',
    createdAt: '25.11.2026',
  },
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

export interface ActiveCaseMeta {
  id: string;
  caseNumber: string;
  title: string;
  shortCategory: string;
  receivedDate: string;
  receivedTime: string;
  district: string;
  victimName: string;
  victimPhone: string;
  suspectName: string;
  damageAmount: string;
  summary102: string;
  victimStatement: string;
  expectedJkValue: string;
  expectedJkLabel: string;
  quickQuestions: string[];
  introSystemText: string;
  introSuspectReply: string;
  isKnifeNote: boolean;
  isDefaultCase: boolean;
}

export function resolveActiveCaseMeta(
  activeCaseId?: string,
  customCases: CustomCase[] = INITIAL_CUSTOM_CASES
): ActiveCaseMeta {
  const id = activeCaseId || 'case-168';

  if (id === 'CASE-02-KNIFE-NOTE') {
    return {
      id: CASE_02_KNIFE_NOTE.id,
      caseNumber: CASE_02_KNIFE_NOTE.caseNumber,
      title: CASE_02_KNIFE_NOTE.title,
      shortCategory: CASE_02_KNIFE_NOTE.shortCategory,
      receivedDate: CASE_02_KNIFE_NOTE.receivedDate,
      receivedTime: CASE_02_KNIFE_NOTE.receivedTime,
      district: CASE_02_KNIFE_NOTE.district,
      victimName: CASE_02_KNIFE_NOTE.victimName,
      victimPhone: CASE_02_KNIFE_NOTE.victimPhone,
      suspectName: CASE_02_KNIFE_NOTE.suspectName,
      damageAmount: CASE_02_KNIFE_NOTE.damageAmount,
      summary102: CASE_02_KNIFE_NOTE.summary102,
      victimStatement: CASE_02_KNIFE_NOTE.victimStatement,
      expectedJkValue: 'JK_97_1',
      expectedJkLabel: 'JK 97-modda 1-qismi (Qasddan odam o‘ldirish)',
      quickQuestions: CASE_02_INTERROGATION_QUESTIONS,
      introSystemText:
        'So‘roq bayonnomasi ochildi (CASE-02-KNIFE-NOTE). Gumonlanuvchi B. Raximov protsessual huquqlari (JPK 48-modda) bilan tanishtirildi. Qonuniy va faktlarga tayangan savollar bering.',
      introSuspectReply:
        'Tergovchi aka, men u kuni soat 21:00 dan 22:00 gacha shahar markazidagi restoranda kechki ovqatda bo‘lganman. 47-xonadonga umuman bormaganman, marhumning o‘limiga hech qanday aloqam yo‘q!',
      isKnifeNote: true,
      isDefaultCase: false,
    };
  }

  if (id === 'case-104') {
    return {
      id: 'case-104',
      caseNumber: '102-2026/YUN-0912',
      title: 'Qasddan badanga og‘ir shikast yetkazish',
      shortCategory: 'JK 104-modda 2-qism (Badanga og‘ir shikast)',
      receivedDate: '22.11.2026',
      receivedTime: '23:18',
      district: 'Toshkent shahri, Yunusobod tumani IIO FMB',
      victimName: 'N. Sobirov (1992-y.t.)',
      victimPhone: '+998 93 601-12-40',
      suspectName: 'Sh. Ergashev (1990-y.t.)',
      damageAmount: 'Sog‘liqqa og‘ir zarar (JK 104-m)',
      summary102:
        'Yunusobod tumani hududidagi tungi kafeda kelib chiqqan janjal oqibatida fuqaro N. Sobirovga o‘tkir tig‘li jism bilan og‘ir tan jarohati yetkazilgani yuzasidan 102 xabari tushgan. Sud-tibbiy ekspertiza va videokuzatuv yozuvlari o‘rganilmoqda.',
      victimStatement:
        '«Kafedan chiqishda notanish bo‘lmagan Sh. Ergashev bilan tortishib qoldik. U kutilmaganda menga hujum qilib og‘ir jarohat yetkazdi. Voqeani ko‘rgan guvohlar va tashqi kamera yozuvlari mavjud.»',
      expectedJkValue: 'JK_104_2',
      expectedJkLabel: 'JK 104-modda 2-qismi (Qasddan badanga og‘ir shikast yetkazish)',
      quickQuestions: [
        '22-noyabr kuni soat 23:00 dan 23:20 gacha Yunusobod tumanidagi kafe hududida bo‘lganmisiz va janjal qanday boshlangan?',
        'Kafe tashqi videokuzatuv kamerasi hamda guvohlarning ko‘rsatmalarida qayd etilgan holatlarni qanday izohlaysiz?',
        'Sud-tibbiy ekspertiza xulosasida ko‘rsatilgan jarohat mexanizmi bo‘yicha nima deya olasiz?',
      ],
      introSystemText:
        'So‘roq bayonnomasi ochildi (102-2026/YUN-0912). Gumonlanuvchi Sh. Ergashevga JPK 48-modda huquqlari tushuntirildi.',
      introSuspectReply:
        'Men hech kimga qasddan zarar yetkazmoqchi emasdim, janjalni u o‘zi boshladi va men faqat o‘zimni himoya qildim.',
      isKnifeNote: false,
      isDefaultCase: false,
    };
  }

  if (id === 'case-210') {
    return {
      id: 'case-210',
      caseNumber: '102-2026/MIR-1104',
      title: 'Mansabdor shaxs tomonidan pora olish (Korrupsiya)',
      shortCategory: 'JK 210-modda 3-qism (Pora olish)',
      receivedDate: '23.11.2026',
      receivedTime: '11:30',
      district: 'Toshkent shahri, Mirzo Ulug‘bek tumani prokuraturasi',
      victimName: 'Ariza beruvchi tadbirkor M. Alimov',
      victimPhone: '+998 97 711-08-55',
      suspectName: 'O. Qosimov (bo‘lim boshlig‘i)',
      damageAmount: '12 000 AQSh dollari ekv.',
      summary102:
        'Tadbirkor M. Alimovning murojaati asosida o‘tkazilgan tezkor tadbirda bo‘lim boshlig‘i O. Qosimov yer uchastkasi hujjatlarini tezlashtirib berish evaziga maxsus kimyoviy kukun bilan belgilangan mablag‘ni olayotganda ushlangan.',
      victimStatement:
        '«Qonuniy ruxsatnomani olish uchun barcha hujjatlarni topshirdim, ammo mansabdor shaxs O. Qosimov hujjatni imzolash evaziga noqonuniy mukofot talab qildi. Shundan so‘ng huquqni muhofaza qiluvchi organlarga ariza berdim.»',
      expectedJkValue: 'JK_210_3',
      expectedJkLabel: 'JK 210-modda 3-qismi (Mansabdor shaxs tomonidan pora olish)',
      quickQuestions: [
        'Tadbirkor M. Alimov bilan xizmat xonangizda o‘tkazilgan uchrashuv va pul mablag‘lari olingan holatni qanday izohlaysiz?',
        'Tezkor tadbir bayonnomasida qayd etilgan maxsus kimyoviy belgilangan kupyuralar hamda audioyozuv yuzasidan nima deya olasiz?',
        'Ruxsatnoma hujjatlarini belgilangan muddatda ko‘rib chiqmasdan to‘xtatib qo‘yganingiz sababi nimada?',
      ],
      introSystemText:
        'So‘roq bayonnomasi ochildi (102-2026/MIR-1104). Gumonlanuvchi O. Qosimovga JPK 48-modda huquqlari tushuntirildi.',
      introSuspectReply:
        'Bu mablag‘ pora emas edi, men faqat xizmat maslahati bo‘yicha gaplashganman va konvert ichida nima borligini bilmaganman.',
      isKnifeNote: false,
      isDefaultCase: false,
    };
  }

  const matchedCustom = customCases.find((c) => c.id === id);
  if (matchedCustom && matchedCustom.id !== 'case-168') {
    const catLower = matchedCustom.category.toLowerCase();
    let expectedJkValue = 'JK_168_3';
    let expectedJkLabel = "JK 168-modda 3-qismi (Axborot texnologiyalaridan foydalanib ko'p miqdorda firibgarlik)";
    if (catLower.includes('97')) {
      expectedJkValue = 'JK_97_1';
      expectedJkLabel = 'JK 97-modda 1-qismi (Qasddan odam o‘ldirish)';
    } else if (catLower.includes('167')) {
      expectedJkValue = 'JK_167_3';
      expectedJkLabel = 'JK 167-modda 3-qismi (O‘zlashtirish yoki rastrata yo‘li bilan talon-toroj qilish)';
    } else if (catLower.includes('104')) {
      expectedJkValue = 'JK_104_2';
      expectedJkLabel = 'JK 104-modda 2-qismi (Qasddan badanga og‘ir shikast yetkazish)';
    } else if (catLower.includes('210')) {
      expectedJkValue = 'JK_210_3';
      expectedJkLabel = 'JK 210-modda 3-qismi (Mansabdor shaxs tomonidan pora olish)';
    }

    return {
      id: matchedCustom.id,
      caseNumber: matchedCustom.caseNumber,
      title: matchedCustom.title,
      shortCategory: matchedCustom.category,
      receivedDate: matchedCustom.createdAt || '25.11.2026',
      receivedTime: '10:15',
      district: 'HMQA O‘quv Poligoni — Maxsus kazus',
      victimName: 'Jabrlanuvchi / Ariza beruvchi tomon',
      victimPhone: '+998 90 102-00-01',
      suspectName: 'Gumonlanuvchi shaxs (ish materiallari bo‘yicha)',
      damageAmount: 'Ish materiallarida ko‘rsatilgan zarar',
      summary102: matchedCustom.summary102,
      victimStatement: `«${matchedCustom.summary102} Ushbu holat bo‘yicha qonuniy chora ko‘rishingizni va barcha raqamli hamda hujjatli dalillarni tekshirishingizni so‘rayman.»`,
      expectedJkValue,
      expectedJkLabel,
      quickQuestions: [
        `${matchedCustom.caseNumber} raqamli ish bo‘yicha hodisa sodir bo‘lgan vaqtda qayerda bo‘lgansiz va vaziyatni qanday izohlaysiz?`,
        'Tergov tomonidan to‘plangan elektron loglar, to‘lov hujjatlari va ekspertiza ma’lumotlari yuzasidan nima deya olasiz?',
        'Jabrlanuvchi tomonning ko‘rsatmalari hamda moliyaviy/hujjatli izlar mos kelishini qanday tushuntirasiz?',
      ],
      introSystemText: `So‘roq bayonnomasi ochildi (${matchedCustom.caseNumber} — ${matchedCustom.title}). Gumonlanuvchi JPK 48-modda huquqlari bilan tanishtirildi.`,
      introSuspectReply:
        'Tergovchi aka, men o‘zimga qo‘yilayotgan gumonni rad etaman. Barcha hujjatlar va elektron yozuvlar noto‘g‘ri talqin qilinmoqda, himoyachim ishtirokida izoh beraman.',
      isKnifeNote: false,
      isDefaultCase: false,
    };
  }

  return {
    id: 'case-168',
    caseNumber: ACTIVE_CASE.caseNumber,
    title: ACTIVE_CASE.title,
    shortCategory: ACTIVE_CASE.shortCategory,
    receivedDate: ACTIVE_CASE.receivedDate,
    receivedTime: ACTIVE_CASE.receivedTime,
    district: ACTIVE_CASE.district,
    victimName: ACTIVE_CASE.victimName,
    victimPhone: ACTIVE_CASE.victimPhone,
    suspectName: ACTIVE_CASE.suspectName,
    damageAmount: ACTIVE_CASE.damageAmount,
    summary102: ACTIVE_CASE.summary102,
    victimStatement: ACTIVE_CASE.victimStatement,
    expectedJkValue: 'JK_168_3',
    expectedJkLabel: "JK 168-modda 3-qismi (Axborot texnologiyalaridan foydalanib ko'p miqdorda firibgarlik)",
    quickQuestions: QUICK_INTERROGATION_QUESTIONS,
    introSystemText:
      "So'roq bayonnomasi ochildi. Gumonlanuvchi D.Tursunov protsessual huquqlari bilan tanishtirildi. Qonuniy, ochiq savollar bering.",
    introSuspectReply:
      "Tergovchi aka, bu yerda qandaydir tushunmovchilik bo'lgan. Men hech kimga bank nomidan xabar yubormaganman. Kartamni bir tanishim vaqtincha so'rab turgandi, pul qaerdan kelganini bilmayman.",
    isKnifeNote: false,
    isDefaultCase: true,
  };
}

export function createInitialState(
  activeCaseId = 'case-168',
  customCases: CustomCase[] = INITIAL_CUSTOM_CASES
): SimulationState {
  const meta = resolveActiveCaseMeta(activeCaseId, customCases);
  return {
    activeCaseId: meta.id,
    studentName: 'Qodirov Temur (Siz)',
    studentGroup: 'HMQA-302',
    aiEngine: 'gemini',
    activeView: 'dashboard',
    currentStep: 1,
    maxUnlockedStep: 6,
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
        text: meta.introSystemText,
        timestamp: '15:10',
      },
      {
        id: 'intro-suspect',
        role: 'suspect',
        text: meta.introSuspectReply,
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
    customCases,
    duelJoined: false,
  };
}
