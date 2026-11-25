import fs from 'fs';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const REQUIRED_EVIDENCE_NODES = [
  'Dalil_Pichoq',
  'Dalil_Xat',
  'Dalil_Kompyuter',
  'Dalil_Smartfon',
  'Dalil_Seyf',
] as const;

interface TestResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, detail: string): void {
  results.push({ name, passed, detail });
  const icon = passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${name} — ${detail}`);
}

function assertCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function validateGlbBuffer(buffer: Buffer, label: string): { sizeBytes: number; nodeCount: number } {
  assertCondition(buffer.length >= 28, `${label}: fayl hajmi juda kichik (${buffer.length} bayt)`);
  assertCondition(buffer.length < 5 * 1024 * 1024, `${label}: hajm 5 MB dan oshib ketdi (${buffer.length} bayt)`);

  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const totalLength = buffer.readUInt32LE(8);
  assertCondition(magic === 0x46546c67, `${label}: noto'g'ri GLB magic (${magic.toString(16)})`);
  assertCondition(version === 2, `${label}: glTF versiyasi 2 bo'lishi kerak (${version})`);
  assertCondition(totalLength === buffer.length, `${label}: sarlavha uzunligi mos emas`);

  const jsonChunkLen = buffer.readUInt32LE(12);
  const jsonChunkType = buffer.readUInt32LE(16);
  assertCondition(jsonChunkType === 0x4e4f534a, `${label}: JSON chunk topilmadi`);

  const gltfJson = JSON.parse(buffer.subarray(20, 20 + jsonChunkLen).toString('utf-8')) as {
    nodes?: Array<{ name?: string }>;
  };
  const nodeNames = new Set((gltfJson.nodes ?? []).map((n) => n.name).filter(Boolean));
  for (const required of REQUIRED_EVIDENCE_NODES) {
    assertCondition(nodeNames.has(required), `${label}: majburiy "${required}" node topilmadi`);
  }
  return { sizeBytes: buffer.length, nodeCount: nodeNames.size };
}

async function waitForServer(baseUrl: string, timeoutMs = 15000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/api/ai/engines`);
      if (res.ok) return true;
    } catch {
      // Server still starting
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  return false;
}

async function runStaticChecks(): Promise<void> {
  const glbPath = path.join(ROOT_DIR, 'public', 'models', 'xona.glb');
  try {
    const buf = fs.readFileSync(glbPath);
    const info = validateGlbBuffer(buf, 'public/models/xona.glb');
    record(
      '3D Model (public/models/xona.glb)',
      true,
      `${(info.sizeBytes / 1024).toFixed(1)} KB, ${info.nodeCount} ta node, barcha 5 ta Dalil_* mavjud`
    );
  } catch (err) {
    record('3D Model (public/models/xona.glb)', false, (err as Error).message);
  }

  const viewerPath = path.join(ROOT_DIR, 'src', 'components', 'ThreeDSceneViewer.tsx');
  const catalogPath = path.join(ROOT_DIR, 'src', 'scene', 'evidenceCatalog.ts');
  try {
    const viewerSrc = fs.readFileSync(viewerPath, 'utf-8');
    const catalogSrc = fs.readFileSync(catalogPath, 'utf-8');
    assertCondition(viewerSrc.includes('/models/xona.glb'), 'ThreeDSceneViewer.tsx da /models/xona.glb integratsiyasi topilmadi');
    assertCondition(viewerSrc.includes('GLTFLoader'), 'ThreeDSceneViewer.tsx da GLTFLoader topilmadi');
    for (const id of REQUIRED_EVIDENCE_NODES) {
      assertCondition(catalogSrc.includes(id), `evidenceCatalog.ts da ${id} topilmadi`);
    }
    record('3D Sahna Kod Integratsiyasi', true, 'ThreeDSceneViewer.tsx va evidenceCatalog.ts barcha 5 dalil bilan mos');
  } catch (err) {
    record('3D Sahna Kod Integratsiyasi', false, (err as Error).message);
  }
}

async function runHttpChecks(baseUrl: string): Promise<void> {
  try {
    const pageRes = await fetch(`${baseUrl}/`);
    const html = await pageRes.text();
    assertCondition(pageRes.ok, `GET / -> HTTP ${pageRes.status}`);
    assertCondition(html.includes('id="root"') || html.includes('E-Tergov'), 'HTML root elementi topilmadi');
    record('GET / (SPA & 3D Sahna Host)', true, `HTTP ${pageRes.status}, HTML uzunligi ${html.length} bayt`);
  } catch (err) {
    record('GET / (SPA & 3D Sahna Host)', false, (err as Error).message);
  }

  try {
    const glbRes = await fetch(`${baseUrl}/models/xona.glb`);
    assertCondition(glbRes.ok, `GET /models/xona.glb -> HTTP ${glbRes.status}`);
    const buf = Buffer.from(await glbRes.arrayBuffer());
    const info = validateGlbBuffer(buf, 'HTTP /models/xona.glb');
    record('GET /models/xona.glb', true, `HTTP 200, ${(info.sizeBytes / 1024).toFixed(1)} KB, valid GLB`);
  } catch (err) {
    record('GET /models/xona.glb', false, (err as Error).message);
  }

  try {
    const engRes = await fetch(`${baseUrl}/api/ai/engines`);
    const engJson = (await engRes.json()) as Record<string, unknown>;
    assertCondition(engRes.ok, `HTTP ${engRes.status}`);
    assertCondition(
      typeof engJson.gemini === 'boolean' &&
        typeof engJson.claude === 'boolean' &&
        typeof engJson.antigravity === 'boolean',
      'Engine boolean maydonlari to‘liq emas'
    );
    record('GET /api/ai/engines', true, JSON.stringify(engJson));
  } catch (err) {
    record('GET /api/ai/engines', false, (err as Error).message);
  }

  try {
    const badRes = await fetch(`${baseUrl}/api/interrogate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '' }),
    });
    assertCondition(badRes.status === 400, `Bo'sh savol uchun 400 kutilgan edi, ${badRes.status} qaytdi`);
    record('POST /api/interrogate (400 validation)', true, 'Bo‘sh savolni to‘g‘ri rad etdi');
  } catch (err) {
    record('POST /api/interrogate (400 validation)', false, (err as Error).message);
  }

  try {
    const res = await fetch(`${baseUrl}/api/interrogate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question:
          'Soat 21:22 da restoranda bo‘lganingizni aytdingiz, ammo Smart-Lock PIN #4821 21:14–21:38 oralig‘ida xonadonga kirganingizni ko‘rsatmoqda. Buni qanday izohlaysiz?',
        history: [],
        twistActive: true,
        pinnedClues: ['Dalil_Pichoq', 'Dalil_Xat'],
        engine: 'gemini',
      }),
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (res.status === 200) {
      assertCondition(typeof data.trafficLight === 'string', 'trafficLight yo‘q');
      assertCondition(typeof data.suspectReply === 'string', 'suspectReply yo‘q');
      assertCondition(typeof data.alibiContradicted === 'boolean', 'alibiContradicted yo‘q');
      record('POST /api/interrogate', true, `HTTP 200 (AI: ${String(data.source)}, svetofor: ${String(data.trafficLight)})`);
    } else if (res.status === 503 && data.useFallback === true) {
      record('POST /api/interrogate', true, 'HTTP 503 (API kalit yo‘q — useFallback: true qaytdi)');
    } else {
      throw new Error(`Kutilmagan javob: HTTP ${res.status} — ${JSON.stringify(data)}`);
    }
  } catch (err) {
    record('POST /api/interrogate', false, (err as Error).message);
  }

  try {
    const res = await fetch(`${baseUrl}/api/court/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        violations: [{ title: 'Protsessual kechikish', detail: 'Bayonnoma vaqti', jpkRef: 'JPK 95-modda' }],
        summary: 'CASE-02-KNIFE-NOTE sud muhokamasi',
        engine: 'gemini',
      }),
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (res.status === 200) {
      assertCondition(typeof data.advocateArgument === 'string', 'advocateArgument yo‘q');
      assertCondition(typeof data.jpkRef === 'string', 'jpkRef yo‘q');
      record('POST /api/court/challenge', true, `HTTP 200 (source: ${String(data.source)})`);
    } else if (res.status === 503 && data.useFallback === true) {
      record('POST /api/court/challenge', true, 'HTTP 503 (API kalit yo‘q — useFallback: true qaytdi)');
    } else {
      throw new Error(`Kutilmagan javob: HTTP ${res.status} — ${JSON.stringify(data)}`);
    }
  } catch (err) {
    record('POST /api/court/challenge', false, (err as Error).message);
  }

  try {
    const res = await fetch(`${baseUrl}/api/court/verdict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        defenseStatement:
          'Dalil_Pichoq (№ 2026/11-418), Dalil_Xat (№ 2026/11-419) va Smart-Lock #4821 jurnali JPK 95¹, 180-moddalariga muvofiq rasmiylashtirilgan.',
        advocateArgument: 'Dalillarni yig‘ishda vaqt tafovuti mavjud.',
        criticalMistakesCount: 0,
        evidenceComplete: true,
        ethicsPassed: true,
        totalScore: 115,
        engine: 'gemini',
      }),
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (res.status === 200) {
      assertCondition(data.verdict === 'approved' || data.verdict === 'returned', 'Noto‘g‘ri verdict qiymati');
      assertCondition(typeof data.judgeReasoning === 'string', 'judgeReasoning yo‘q');
      record('POST /api/court/verdict', true, `HTTP 200 (verdict: ${String(data.verdict)})`);
    } else if (res.status === 503 && data.useFallback === true) {
      record('POST /api/court/verdict', true, 'HTTP 503 (API kalit yo‘q — useFallback: true qaytdi)');
    } else {
      throw new Error(`Kutilmagan javob: HTTP ${res.status} — ${JSON.stringify(data)}`);
    }
  } catch (err) {
    record('POST /api/court/verdict', false, (err as Error).message);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const shouldSpawn = args.includes('--spawn');
  const spawnPort = process.env.SMOKE_PORT || '3199';
  const baseUrl = process.env.SMOKE_BASE_URL || (shouldSpawn ? `http://127.0.0.1:${spawnPort}` : 'http://127.0.0.1:3000');

  console.log('=== E-Tergov Lab Smoke & API Test ===');
  await runStaticChecks();

  let serverProc: ChildProcess | null = null;
  try {
    let serverReady = await waitForServer(baseUrl, 1200);
    if (!serverReady && shouldSpawn) {
      console.log(`Server ishga tushirilmoqda (${baseUrl})...`);
      const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      serverProc = spawn(npxCmd, ['tsx', 'server.ts'], {
        cwd: ROOT_DIR,
        env: { ...process.env, PORT: spawnPort, NODE_ENV: 'development' },
        stdio: 'pipe',
      });
      serverReady = await waitForServer(baseUrl, 20000);
    }

    if (!serverReady) {
      record(
        'Serverga ulanish',
        false,
        `${baseUrl} manzilida server javob bermadi (avval "npm run dev" yoqing yoki "--spawn" bayrog'i bilan ishga tushiring)`
      );
    } else {
      await runHttpChecks(baseUrl);
    }
  } finally {
    if (serverProc && !serverProc.killed) {
      serverProc.kill();
    }
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;
  console.log(`\nNatija: ${passedCount}/${results.length} ta tekshiruv muvaffaqiyatli, ${failedCount} ta xato.`);
  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Smoke test fatal error:', err);
  process.exit(1);
});
