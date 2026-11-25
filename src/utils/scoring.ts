import {
  ComputedMetrics,
  RankTitle,
  SimulationState,
  TrafficLight,
} from '../types/simulation';
import { CASE_02_KNIFE_NOTE, EVIDENCE_CLUES } from '../data/caseData';

export function getRankTitle(score: number): RankTitle {
  if (score >= 130) return "O'ta muhim ishlar bo'yicha tergovchi";
  if (score >= 105) return 'Katta tergovchi';
  if (score >= 75) return 'Tergovchi';
  return 'Stajyor';
}

export function computeMetrics(state: SimulationState): ComputedMetrics {
  const deltaSum = state.timeline.reduce((acc, ev) => acc + ev.scoreDelta, 0);
  const totalScore = Math.max(0, state.baseScore + deltaSum);
  const rankTitle = getRankTitle(totalScore);

  const redViolationsCount = state.timeline.filter((t) => t.status === 'red').length;
  const yellowWarningsCount = state.timeline.filter((t) => t.status === 'yellow').length;
  const greenActionsCount = state.timeline.filter((t) => t.status === 'green').length;
  const totalActions = Math.max(1, state.timeline.length);

  const proceduralAccuracy = Math.max(
    18,
    Math.min(
      100,
      Math.round(
        state.timeline.length === 0
          ? 85
          : ((greenActionsCount * 100 + yellowWarningsCount * 65 + redViolationsCount * 15) /
              totalActions) -
              redViolationsCount * 5
      )
    )
  );

  const hoursRemaining = state.totalHoursBudget - state.hoursUsed;
  const isOverdue = hoursRemaining < 0;
  const deadlineCompliance = Math.max(
    10,
    Math.min(
      100,
      isOverdue
        ? Math.max(15, 60 + hoursRemaining * 3)
        : Math.round(100 - Math.max(0, state.hoursUsed - 24) * 0.9)
    )
  );

  const criticalClues = EVIDENCE_CLUES.filter((c) => c.isCritical);
  const pinnedCriticalCount = criticalClues.filter((c) =>
    state.pinnedClueIds.includes(c.id)
  ).length;
  const pinnedDistractorCount = state.pinnedClueIds.filter(
    (id) => !criticalClues.some((c) => c.id === id)
  ).length;

  const requestBonus = Math.min(3, state.sentRequestIds.length) * 10;
  const alibiBonus = state.alibiConfronted ? 10 : 0;
  const evidenceStrength = Math.max(
    15,
    Math.min(
      100,
      Math.round(
        (pinnedCriticalCount / 3) * 65 +
          requestBonus +
          alibiBonus -
          pinnedDistractorCount * 8 +
          (state.decisionForm.auditPassed ? 10 : 0)
      )
    )
  );

  let cleanCourtRate = Math.round(
    proceduralAccuracy * 0.4 +
      deadlineCompliance * 0.2 +
      evidenceStrength * 0.3 +
      state.ethicsIndex * 0.1
  );
  if (state.courtSession.verdict === 'returned') {
    cleanCourtRate = Math.min(cleanCourtRate, 54);
  } else if (state.courtSession.verdict === 'approved') {
    cleanCourtRate = Math.max(cleanCourtRate, 84);
  }
  cleanCourtRate = Math.max(15, Math.min(100, cleanCourtRate));

  return {
    totalScore,
    rankTitle,
    proceduralAccuracy,
    deadlineCompliance,
    evidenceStrength,
    cleanCourtRate,
    hoursRemaining,
    isOverdue,
    redViolationsCount,
    yellowWarningsCount,
  };
}

export function formatSimTime(hoursUsed: number): string {
  const baseMinutes = 14 * 60 + 42 + hoursUsed * 60;
  const dayOffset = Math.floor(baseMinutes / (24 * 60));
  const remMinutes = baseMinutes % (24 * 60);
  const hh = String(Math.floor(remMinutes / 60)).padStart(2, '0');
  const mm = String(remMinutes % 60).padStart(2, '0');
  const day = 19 + dayOffset;
  return `${day}.11.2026 ${hh}:${mm}`;
}

export interface FallbackInterrogationResult {
  trafficLight: TrafficLight;
  scoreDelta: number;
  coachTitle: string;
  coachExplanation: string;
  jpkReference: string;
  suspectReply: string;
  alibiContradicted: boolean;
}

export function evaluateInterrogationFallback(
  question: string,
  twistActive: boolean
): FallbackInterrogationResult {
  const q = question.toLowerCase();

  const coerciveKeywords = [
    'tan ol',
    'qamalasan',
    "bo'yningga ol",
    'aldama',
    'yolg\'onchi',
    'advokatsiz',
    'majbur',
    'jinoyatchi',
    'uraman',
    'o\'zing qilgansan',
    'iqror bo\'l',
  ];

  const evidenceKeywords = [
    'imei',
    '185.139',
    'ip',
    'yunusobod',
    'billing',
    'tayanch',
    'stansiya',
    'atm',
    '412',
    'bankomat',
    '9104',
    'kamera',
    '14:15',
    '14:19',
    'sergeli',
    'phishing',
    'havola',
    'ekspertiza',
    '21:22',
    '21:14',
    '21:38',
    '4821',
    'smart-lock',
    'smart lock',
    'restoran',
    'pichoq',
    'xat',
    '2026/11-418',
    '2026/11-419',
  ];

  const knifeNoteAlibiTriggers = ['21:22', '21:14', '21:38', '4821', 'smart-lock', 'smart lock', 'restoran'];
  const citesKnifeNoteAlibi = knifeNoteAlibiTriggers.some((kw) => q.includes(kw));

  const openLawfulKeywords = [
    'qayerda',
    'qanday',
    'izohla',
    'nima',
    'kim',
    'qachon',
    'tushuntir',
    'sabab',
    'karta',
    'telefon',
    'soat',
  ];

  const isCoercive = coerciveKeywords.some((kw) => q.includes(kw));
  const citesEvidence = evidenceKeywords.some((kw) => q.includes(kw));
  const isOpenQuestion = openLawfulKeywords.some((kw) => q.includes(kw)) && q.trim().length > 22;

  if (isCoercive) {
    return {
      trafficLight: 'red',
      scoreDelta: -10,
      coachTitle: "Qizil (JPK xavfi!)",
      coachExplanation:
        "Savolda bosim o'tkazish yoki yo'naltiruvchi ohang mavjud. Tergovchi aybsizlik prezumpsiyasiga amal qilishi va faktlarga tayangan xolis savol berishi shart.",
      jpkReference: 'JPK 23, 96-moddalar',
      suspectReply:
        "Menga bosim o'tkazmang! Himoyachim ishtirokida gapiraman, men hali aybdor deb topilmaganman va bunday ayblovni rad etaman.",
      alibiContradicted: false,
    };
  }

  if (citesKnifeNoteAlibi) {
    return {
      trafficLight: 'green',
      scoreDelta: 10,
      coachTitle: "Yashil (Alibi fosh etildi!)",
      coachExplanation:
        "A’lo darajadagi yuzlashtirish! Soat 21:22 dagi restoran kassa kamerasi va 21:14–21:38 oralig‘idagi Smart-Lock PIN #4821 jurnali o‘rtasidagi ziddiyat gumonlanuvchining yolg‘on alibisini to‘liq barbod qildi.",
      jpkReference: 'JPK 95¹, 96, 111, 180-moddalar',
      suspectReply:
        "To‘xtab turing... Smart-Lock #4821 kodi faqat menda bor edi, lekin soat 21:22 dagi restoran chekini tanishimga to‘latgan edim... Ha, 21:14 da xonadonga kirganman, lekin advokatim kelmaguncha boshqa tafsilot aytmayman.",
      alibiContradicted: true,
    };
  }

  if (citesEvidence) {
    if (twistActive) {
      return {
        trafficLight: 'green',
        scoreDelta: 10,
        coachTitle: "Yashil (To'g'ri taktika)",
        coachExplanation:
          "Ajoyib taktika! Siz gumonlanuvchining yolg'on alibisini aniq raqamli dalil (billing / IP / bankomat yozuvi) bilan fosh etdingiz.",
        jpkReference: 'JPK 96, 111-moddalar',
        suspectReply:
          "To'xtab turing... ha, mayli, rostini aytaman: soat 14:15 da Yunusobodda edim. Sergeliga keyinroq borganman. Havolani ham Telegramdagi tanishim bilan tayyorlagan edik, lekin pulning katta qismi hali kartada turibdi.",
        alibiContradicted: true,
      };
    }

    return {
      trafficLight: 'green',
      scoreDelta: 10,
      coachTitle: "Yashil (To'g'ri taktika)",
      coachExplanation:
        "Dalillarga asoslangan aniq va qonuniy savol berildi. Bunday taktika gumonlanuvchini faktlar oldida izoh berishga undaydi.",
      jpkReference: 'JPK 96-modda',
      suspectReply:
        "Ha, u karta mening nomimda, lekin telefonim ba'zan ofisdagi boshqa yigitlarda ham qolardi. Bankomat oldidan o'tgan bo'lishim mumkin, aniq eslolmayapman.",
      alibiContradicted: false,
    };
  }

  if (isOpenQuestion) {
    return {
      trafficLight: 'green',
      scoreDelta: 10,
      coachTitle: "Yashil (To'g'ri taktika)",
      coachExplanation:
        "Ochiq va xolis tergov savoli. Gumonlanuvchining o'z versiyasini batafsil bayon qilishi keyinchalik qarama-qarshiliklarni fosh etishga yordam beradi.",
      jpkReference: 'JPK 110-modda',
      suspectReply:
        "Men o'sha kuni kunduzi shaxsiy ishlarim bilan yurgan edim. Jabrlanuvchi J.Karimovni umuman tanimayman va uning kartasidan pul yechib olishga aloqam yo'q.",
      alibiContradicted: false,
    };
  }

  return {
    trafficLight: 'yellow',
    scoreDelta: 3,
    coachTitle: 'Sariq (Aniqlashtirish kerak)',
    coachExplanation:
      "Savol juda qisqa yoki umumiy berildi. Vaqt, joy va raqamli dalillarga bog'lab aniqroq savol tuzing.",
    jpkReference: 'JPK 111-modda',
    suspectReply:
      "Savolingizni uncha tushunmadim, aniqroq so'rasangiz javob beraman. Men hech qanday noqonuniy ish qilmaganman.",
    alibiContradicted: false,
  };
}

export function buildFallbackCourtChallenge(state: SimulationState): {
  advocateArgument: string;
  targetPoint: string;
  jpkRef: string;
} {
  const hasKnifeNote3DEvidence =
    state.pinnedClueIds.includes('Dalil_Pichoq') || state.pinnedClueIds.includes('Dalil_Xat');

  const redEvents = state.timeline.filter((t) => t.status === 'red');
  if (redEvents.length > 0) {
    const worst = redEvents[0];
    return {
      advocateArgument: `Hurmatli sud raisi! Tergov organi «${worst.stepLabel}» bosqichida jiddiy qonunbuzarlikka yo'l qo'ygan: ${worst.title}. ${worst.jpkRef} talablari buzilgani sababli ushbu dalil nomaqbul deb topilishi va jinoyat ishi qayta tergovga qaytarilishini so'rayman!`,
      targetPoint: worst.title,
      jpkRef: worst.jpkRef,
    };
  }

  if (hasKnifeNote3DEvidence) {
    return CASE_02_KNIFE_NOTE.virtualCourt.advocateChallenge;
  }

  if (!state.alibiConfronted) {
    return {
      advocateArgument:
        "Hurmatli sud! Himoyam ostidagi D.Tursunov voqea vaqtida Sergeli tumanida bo'lganini bildirgan, biroq tergovchi so'roq davomida bu alibini tayanch stansiya billingi va IMEI yozuvlari bilan to'liq yuzlashtirmagan. Shu bois ayblov yetarlicha isbotlanmagan deb hisoblayman.",
      targetPoint: "Gumonlanuvchining Sergeli alibisi to'liq rad etilmagan",
      jpkRef: 'JPK 95, 111-moddalar',
    };
  }

  return {
    advocateArgument:
      "Hurmatli sud raisi! Tergov materiallarida keltirilgan IP manzil va bank tranzaksiyalari D.Tursunovning shaxsan o'zi tomonidan amalga oshirilgani shubha ostida — qurilmadan uchinchi shaxs foydalangan bo'lishi mumkin. Tergovchidan raqamli dalillar zanjiri va kvalifikatsiyaning qonuniyligini isbotlab berishini talab qilaman.",
    targetPoint: "Raqamli dalillar zanjiri va shaxsiy ishtirok isboti",
    jpkRef: 'JPK 81, 95-moddalar',
  };
}

export function evaluateFallbackVerdict(
  state: SimulationState,
  defenseStatement: string
): {
  verdict: 'approved' | 'returned';
  verdictTitle: string;
  judgeReasoning: string;
  improvementAdvice: string;
} {
  const hasKnifeNote3DEvidence =
    state.pinnedClueIds.includes('Dalil_Pichoq') || state.pinnedClueIds.includes('Dalil_Xat');
  const redCount = state.timeline.filter((t) => t.status === 'red').length;
  const ethicsFailed = state.ethicsState.answered && state.ethicsState.lawful === false;
  const criticalCluesPinned = EVIDENCE_CLUES.filter(
    (c) => c.isCritical && state.pinnedClueIds.includes(c.id)
  ).length;
  const hasGoodDefense = defenseStatement.trim().length >= 35;

  if (ethicsFailed || redCount >= 2 || (criticalCluesPinned < 2 && !hasKnifeNote3DEvidence) || !hasGoodDefense) {
    if (hasKnifeNote3DEvidence) {
      return CASE_02_KNIFE_NOTE.virtualCourt.verdicts.returned;
    }
    return {
      verdict: 'returned',
      verdictTitle: 'Ish qayta tergovga qaytarildi (JPK 416 / 419-modda tartibida)',
      judgeReasoning:
        "Sud majlisida himoyachining e'tirozi qisman asosli deb topildi. Tergov jarayonida yo'l qo'yilgan protsessual xatolar, himoya huquqiga doir kamchiliklar yoki dalillar bazasining yetarli mustahkamlanmaganligi sababli ayblov xulosasini tasdiqlash imkonsiz.",
      improvementAdvice:
        "Kelgusi ishlarda har bir raqamli dalilni ekspertiza va rasmiy so'rov bilan mustahkamlang, himoya huquqiga (JPK 48-modda) qat'iy rioya qiling va so'roqda bosim o'tkazishdan saqlaning.",
    };
  }

  if (hasKnifeNote3DEvidence) {
    return CASE_02_KNIFE_NOTE.virtualCourt.verdicts.approved;
  }

  return {
    verdict: 'approved',
    verdictTitle: 'Ayblov tasdiqlandi — Sud hukmi e’lon qilindi',
    judgeReasoning:
      "Tergov organi tomonidan to'plangan raqamli dalillar (bank ko'chirmasi, phishing yozishmasi, IMEI va Yunusobod tayanch stansiyasi billingi hamda ATM #412 tasviri) o'zaro uyg'un va JPK talablariga muvofiq rasmiylashtirilgan. Tergovchining suddagi raddiyasi asosli deb topilib, JK 168-modda 3-qismi bo'yicha ayblov tasdiqlandi.",
    improvementAdvice:
      "Yuksak protsessual intizom! Keyingi murakkab kazuslarda idoralararo so'rovlar muddatini yanada optimallashtirish tavsiya etiladi.",
  };
}
