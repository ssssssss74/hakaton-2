/**
 * Generates public/models/xona.glb — a valid glTF 2.0 binary crime scene room
 * aligned with evidenceCatalog.ts camera focus coordinates and containing all 5
 * mandatory interactive Dalil_* nodes (Dalil_Pichoq, Dalil_Xat, Dalil_Kompyuter,
 * Dalil_Smartfon, Dalil_Seyf).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '..', 'public', 'models', 'xona.glb');

interface PbrMaterialSpec {
  name: string;
  baseColorFactor: [number, number, number, number];
  metallicFactor: number;
  roughnessFactor: number;
  emissiveFactor?: [number, number, number];
}

interface GltfMeshEntry {
  name: string;
  geometry: THREE.BufferGeometry;
  materialIndex: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  parentGroup?: string;
}

const MATERIALS: PbrMaterialSpec[] = [
  { name: 'WoodFloor', baseColorFactor: [0.22, 0.14, 0.09, 1], metallicFactor: 0.04, roughnessFactor: 0.72 },
  { name: 'PlasterWall', baseColorFactor: [0.16, 0.19, 0.24, 1], metallicFactor: 0.0, roughnessFactor: 0.9 },
  { name: 'CeilingDark', baseColorFactor: [0.11, 0.13, 0.17, 1], metallicFactor: 0.0, roughnessFactor: 0.94 },
  { name: 'DeskOak', baseColorFactor: [0.28, 0.18, 0.11, 1], metallicFactor: 0.06, roughnessFactor: 0.56 },
  { name: 'DarkMetal', baseColorFactor: [0.14, 0.16, 0.2, 1], metallicFactor: 0.78, roughnessFactor: 0.34 },
  { name: 'SteelBlade', baseColorFactor: [0.84, 0.88, 0.93, 1], metallicFactor: 0.94, roughnessFactor: 0.18 },
  { name: 'KnifeHandle', baseColorFactor: [0.1, 0.08, 0.08, 1], metallicFactor: 0.12, roughnessFactor: 0.58 },
  { name: 'PaperNote', baseColorFactor: [0.95, 0.92, 0.84, 1], metallicFactor: 0.0, roughnessFactor: 0.88 },
  { name: 'ScreenGlow', baseColorFactor: [0.1, 0.26, 0.44, 1], metallicFactor: 0.15, roughnessFactor: 0.22, emissiveFactor: [0.06, 0.28, 0.52] },
  { name: 'PhoneScreen', baseColorFactor: [0.08, 0.2, 0.32, 1], metallicFactor: 0.15, roughnessFactor: 0.2, emissiveFactor: [0.06, 0.22, 0.38] },
  { name: 'SafeSteel', baseColorFactor: [0.2, 0.24, 0.29, 1], metallicFactor: 0.72, roughnessFactor: 0.4 },
  { name: 'BrassDial', baseColorFactor: [0.82, 0.65, 0.22, 1], metallicFactor: 0.88, roughnessFactor: 0.26 },
  { name: 'MarkerYellow', baseColorFactor: [0.98, 0.8, 0.08, 1], metallicFactor: 0.05, roughnessFactor: 0.45, emissiveFactor: [0.18, 0.13, 0.0] },
  { name: 'LampWarm', baseColorFactor: [1.0, 0.91, 0.74, 1], metallicFactor: 0.0, roughnessFactor: 0.3, emissiveFactor: [0.92, 0.76, 0.44] },
  { name: 'WindowNight', baseColorFactor: [0.07, 0.14, 0.28, 1], metallicFactor: 0.1, roughnessFactor: 0.15, emissiveFactor: [0.05, 0.12, 0.24] },
  { name: 'BankCardGold', baseColorFactor: [0.15, 0.36, 0.72, 1], metallicFactor: 0.45, roughnessFactor: 0.3 },
];

const M = {
  FLOOR: 0,
  WALL: 1,
  CEILING: 2,
  DESK: 3,
  METAL: 4,
  STEEL: 5,
  HANDLE: 6,
  PAPER: 7,
  SCREEN: 8,
  PHONE: 9,
  SAFE: 10,
  BRASS: 11,
  MARKER: 12,
  LAMP: 13,
  WINDOW: 14,
  CARD: 15,
};

function createSceneEntries(): { groups: Record<string, [number, number, number]>; meshes: GltfMeshEntry[] } {
  const groups: Record<string, [number, number, number]> = {
    Dalil_Pichoq: [-0.62, 0.785, -0.78],
    Dalil_Xat: [0.52, 0.785, -0.68],
    Dalil_Kompyuter: [-0.05, 0.785, -1.08],
    Dalil_Smartfon: [0.22, 0.785, -0.72],
    Dalil_Seyf: [2.15, 0.0, -0.75],
  };

  const meshes: GltfMeshEntry[] = [
    // Enclosed room shell (6.4m x 3.2m x 5.6m)
    { name: 'Floor', geometry: new THREE.BoxGeometry(6.4, 0.08, 5.6), materialIndex: M.FLOOR, position: [0, -0.04, 0] },
    { name: 'Ceiling', geometry: new THREE.BoxGeometry(6.4, 0.08, 5.6), materialIndex: M.CEILING, position: [0, 3.24, 0] },
    { name: 'WallNorth', geometry: new THREE.BoxGeometry(6.4, 3.2, 0.14), materialIndex: M.WALL, position: [0, 1.6, -2.8] },
    { name: 'WallSouth', geometry: new THREE.BoxGeometry(6.4, 3.2, 0.14), materialIndex: M.WALL, position: [0, 1.6, 2.8] },
    { name: 'WallWest', geometry: new THREE.BoxGeometry(0.14, 3.2, 5.6), materialIndex: M.WALL, position: [-3.2, 1.6, 0] },
    { name: 'WallEast', geometry: new THREE.BoxGeometry(0.14, 3.2, 5.6), materialIndex: M.WALL, position: [3.2, 1.6, 0] },

    // Night window on West wall
    { name: 'WindowFrame', geometry: new THREE.BoxGeometry(0.18, 1.4, 1.9), materialIndex: M.METAL, position: [-3.12, 1.82, -0.35] },
    { name: 'WindowGlass', geometry: new THREE.BoxGeometry(0.06, 1.24, 1.72), materialIndex: M.WINDOW, position: [-3.08, 1.82, -0.35] },

    // Ceiling pendant lamp
    { name: 'LampCord', geometry: new THREE.CylinderGeometry(0.014, 0.014, 0.7, 8), materialIndex: M.METAL, position: [0, 2.85, -0.45] },
    { name: 'LampShade', geometry: new THREE.CylinderGeometry(0.09, 0.28, 0.18, 16), materialIndex: M.METAL, position: [0, 2.48, -0.45] },
    { name: 'LampBulb', geometry: new THREE.SphereGeometry(0.075, 12, 10), materialIndex: M.LAMP, position: [0, 2.38, -0.45] },

    // Crime scene caution ribbon along north wall
    { name: 'CrimeTape', geometry: new THREE.BoxGeometry(4.4, 0.07, 0.015), materialIndex: M.MARKER, position: [0, 1.15, -2.65] },

    // Investigation Desk
    { name: 'DeskTop', geometry: new THREE.BoxGeometry(2.15, 0.07, 1.05), materialIndex: M.DESK, position: [0, 0.75, -0.9] },
    { name: 'DeskLegFL', geometry: new THREE.BoxGeometry(0.07, 0.72, 0.07), materialIndex: M.METAL, position: [-0.98, 0.36, -0.44] },
    { name: 'DeskLegFR', geometry: new THREE.BoxGeometry(0.07, 0.72, 0.07), materialIndex: M.METAL, position: [0.98, 0.36, -0.44] },
    { name: 'DeskLegBL', geometry: new THREE.BoxGeometry(0.07, 0.72, 0.07), materialIndex: M.METAL, position: [-0.98, 0.36, -1.36] },
    { name: 'DeskLegBR', geometry: new THREE.BoxGeometry(0.07, 0.72, 0.07), materialIndex: M.METAL, position: [0.98, 0.36, -1.36] },

    // Office Chair
    { name: 'ChairSeat', geometry: new THREE.BoxGeometry(0.52, 0.07, 0.5), materialIndex: M.HANDLE, position: [-0.15, 0.46, 0.08] },
    { name: 'ChairBack', geometry: new THREE.BoxGeometry(0.5, 0.56, 0.07), materialIndex: M.HANDLE, position: [-0.15, 0.76, 0.3] },
    { name: 'ChairStem', geometry: new THREE.CylinderGeometry(0.035, 0.045, 0.42, 10), materialIndex: M.METAL, position: [-0.15, 0.22, 0.08] },
    { name: 'ChairBase', geometry: new THREE.CylinderGeometry(0.28, 0.28, 0.04, 12), materialIndex: M.METAL, position: [-0.15, 0.02, 0.08] },

    // Bookshelf against North-West wall
    { name: 'ShelfFrame', geometry: new THREE.BoxGeometry(1.15, 2.0, 0.36), materialIndex: M.DESK, position: [-2.15, 1.0, -2.45] },

    // === DALIL 1: Dalil_Pichoq (Kitchen knife + forensic tent marker) ===
    { name: 'Pichoq_Blade', geometry: new THREE.BoxGeometry(0.22, 0.008, 0.042), materialIndex: M.STEEL, position: [0.06, 0.012, 0], rotation: [0, 0.42, 0], parentGroup: 'Dalil_Pichoq' },
    { name: 'Pichoq_Handle', geometry: new THREE.BoxGeometry(0.13, 0.024, 0.032), materialIndex: M.HANDLE, position: [-0.09, 0.016, 0.065], rotation: [0, 0.42, 0], parentGroup: 'Dalil_Pichoq' },
    { name: 'Pichoq_Marker', geometry: new THREE.BoxGeometry(0.06, 0.08, 0.05), materialIndex: M.MARKER, position: [-0.16, 0.04, -0.09], parentGroup: 'Dalil_Pichoq' },

    // === DALIL 2: Dalil_Xat (Torn note + forensic tent marker) ===
    { name: 'Xat_Sheet', geometry: new THREE.BoxGeometry(0.22, 0.005, 0.29), materialIndex: M.PAPER, position: [0, 0.004, 0], rotation: [0, -0.22, 0], parentGroup: 'Dalil_Xat' },
    { name: 'Xat_Pen', geometry: new THREE.CylinderGeometry(0.006, 0.006, 0.14, 8), materialIndex: M.CARD, position: [0.13, 0.008, 0.04], rotation: [0, 0.3, Math.PI / 2], parentGroup: 'Dalil_Xat' },
    { name: 'Xat_Marker', geometry: new THREE.BoxGeometry(0.06, 0.08, 0.05), materialIndex: M.MARKER, position: [0.16, 0.04, -0.1], parentGroup: 'Dalil_Xat' },

    // === DALIL 3: Dalil_Kompyuter (Monitor + Screen + Keyboard + Tower + Marker) ===
    { name: 'Komp_Stand', geometry: new THREE.BoxGeometry(0.22, 0.025, 0.18), materialIndex: M.METAL, position: [0, 0.015, 0], parentGroup: 'Dalil_Kompyuter' },
    { name: 'Komp_Neck', geometry: new THREE.BoxGeometry(0.06, 0.14, 0.04), materialIndex: M.METAL, position: [0, 0.09, -0.02], parentGroup: 'Dalil_Kompyuter' },
    { name: 'Komp_Monitor', geometry: new THREE.BoxGeometry(0.64, 0.38, 0.04), materialIndex: M.METAL, position: [0, 0.31, 0], parentGroup: 'Dalil_Kompyuter' },
    { name: 'Komp_Screen', geometry: new THREE.BoxGeometry(0.58, 0.32, 0.012), materialIndex: M.SCREEN, position: [0, 0.31, 0.022], parentGroup: 'Dalil_Kompyuter' },
    { name: 'Komp_Keyboard', geometry: new THREE.BoxGeometry(0.42, 0.018, 0.15), materialIndex: M.HANDLE, position: [0, 0.01, 0.22], parentGroup: 'Dalil_Kompyuter' },
    { name: 'Komp_Tower', geometry: new THREE.BoxGeometry(0.2, 0.42, 0.42), materialIndex: M.METAL, position: [-0.52, 0.21, -0.04], parentGroup: 'Dalil_Kompyuter' },
    { name: 'Komp_Marker', geometry: new THREE.BoxGeometry(0.06, 0.08, 0.05), materialIndex: M.MARKER, position: [0.38, 0.04, 0.16], parentGroup: 'Dalil_Kompyuter' },

    // === DALIL 4: Dalil_Smartfon (Smartphone body + lit screen + marker) ===
    { name: 'Smartfon_Body', geometry: new THREE.BoxGeometry(0.082, 0.011, 0.165), materialIndex: M.METAL, position: [0, 0.007, 0], rotation: [0, 0.25, 0], parentGroup: 'Dalil_Smartfon' },
    { name: 'Smartfon_Screen', geometry: new THREE.BoxGeometry(0.072, 0.004, 0.148), materialIndex: M.PHONE, position: [0, 0.013, 0], rotation: [0, 0.25, 0], parentGroup: 'Dalil_Smartfon' },
    { name: 'Smartfon_Marker', geometry: new THREE.BoxGeometry(0.06, 0.08, 0.05), materialIndex: M.MARKER, position: [0.1, 0.04, 0.06], parentGroup: 'Dalil_Smartfon' },

    // === DALIL 5: Dalil_Seyf (Steel safe + dial + transit bank card + marker) ===
    { name: 'Seyf_Body', geometry: new THREE.BoxGeometry(0.68, 0.86, 0.62), materialIndex: M.SAFE, position: [0, 0.43, 0], parentGroup: 'Dalil_Seyf' },
    { name: 'Seyf_Door', geometry: new THREE.BoxGeometry(0.04, 0.74, 0.52), materialIndex: M.METAL, position: [-0.35, 0.43, 0], parentGroup: 'Dalil_Seyf' },
    { name: 'Seyf_Dial', geometry: new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), materialIndex: M.BRASS, position: [-0.38, 0.5, 0.06], rotation: [0, 0, Math.PI / 2], parentGroup: 'Dalil_Seyf' },
    { name: 'Seyf_TransitCard', geometry: new THREE.BoxGeometry(0.09, 0.005, 0.06), materialIndex: M.CARD, position: [-0.08, 0.866, 0.08], rotation: [0, 0.35, 0], parentGroup: 'Dalil_Seyf' },
    { name: 'Seyf_Marker', geometry: new THREE.BoxGeometry(0.08, 0.1, 0.07), materialIndex: M.MARKER, position: [0.12, 0.91, -0.1], parentGroup: 'Dalil_Seyf' },
  ];

  return { groups, meshes };
}

function pad4(buf: Buffer, padByte = 0): Buffer {
  const rem = buf.length % 4;
  if (rem === 0) return buf;
  return Buffer.concat([buf, Buffer.alloc(4 - rem, padByte)]);
}

function buildGlb(): Buffer {
  const { groups, meshes } = createSceneEntries();

  const binChunks: Buffer[] = [];
  let byteOffset = 0;

  const bufferViews: Array<{ buffer: number; byteOffset: number; byteLength: number; target?: number }> = [];
  const accessors: Array<{
    bufferView: number;
    componentType: number;
    count: number;
    type: string;
    min?: number[];
    max?: number[];
  }> = [];

  const appendTypedArray = (
    typed: Float32Array | Uint16Array,
    componentType: number,
    type: string,
    target: number,
    computeMinMax = false
  ): number => {
    const raw = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    const padded = pad4(raw, 0);
    const bvIdx = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: raw.length,
      target,
    });
    binChunks.push(padded);
    byteOffset += padded.length;

    const comps = type === 'VEC3' ? 3 : 1;
    const count = typed.length / comps;
    const acc: (typeof accessors)[number] = {
      bufferView: bvIdx,
      componentType,
      count,
      type,
    };

    if (computeMinMax && type === 'VEC3') {
      const min = [Infinity, Infinity, Infinity];
      const max = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < typed.length; i += 3) {
        if (typed[i] < min[0]) min[0] = typed[i];
        if (typed[i + 1] < min[1]) min[1] = typed[i + 1];
        if (typed[i + 2] < min[2]) min[2] = typed[i + 2];
        if (typed[i] > max[0]) max[0] = typed[i];
        if (typed[i + 1] > max[1]) max[1] = typed[i + 1];
        if (typed[i + 2] > max[2]) max[2] = typed[i + 2];
      }
      acc.min = min;
      acc.max = max;
    }

    const accIdx = accessors.length;
    accessors.push(acc);
    return accIdx;
  };

  const gltfMeshes: Array<{ name: string; primitives: Array<{ attributes: { POSITION: number; NORMAL: number }; indices: number; material: number }> }> = [];
  const gltfNodes: Array<{
    name: string;
    mesh?: number;
    children?: number[];
    translation?: [number, number, number];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
  }> = [];

  const rootChildren: number[] = [];
  const groupNodeIndices: Record<string, number> = {};

  // Create parent group nodes for the 5 mandatory Dalil_* items
  for (const [groupName, pos] of Object.entries(groups)) {
    const idx = gltfNodes.length;
    groupNodeIndices[groupName] = idx;
    gltfNodes.push({
      name: groupName,
      translation: pos,
      children: [],
    });
    rootChildren.push(idx);
  }

  for (const entry of meshes) {
    const geom = entry.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const normAttr = geom.getAttribute('normal') as THREE.BufferAttribute;
    const indexAttr = geom.getIndex();

    const posArray = new Float32Array(posAttr.array);
    const normArray = new Float32Array(normAttr.array);
    const idxArray = indexAttr
      ? new Uint16Array(indexAttr.array)
      : Uint16Array.from({ length: posAttr.count }, (_, i) => i);

    const posAcc = appendTypedArray(posArray, 5126, 'VEC3', 34962, true);
    const normAcc = appendTypedArray(normArray, 5126, 'VEC3', 34962, false);
    const idxAcc = appendTypedArray(idxArray, 5123, 'SCALAR', 34963, false);

    const meshIdx = gltfMeshes.length;
    gltfMeshes.push({
      name: entry.name,
      primitives: [
        {
          attributes: { POSITION: posAcc, NORMAL: normAcc },
          indices: idxAcc,
          material: entry.materialIndex,
        },
      ],
    });

    const node: (typeof gltfNodes)[number] = {
      name: entry.name,
      mesh: meshIdx,
      translation: entry.position,
    };

    if (entry.rotation) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...entry.rotation));
      node.rotation = [q.x, q.y, q.z, q.w];
    }
    if (entry.scale) {
      node.scale = entry.scale;
    }

    const nodeIdx = gltfNodes.length;
    gltfNodes.push(node);

    if (entry.parentGroup && groupNodeIndices[entry.parentGroup] !== undefined) {
      gltfNodes[groupNodeIndices[entry.parentGroup]].children!.push(nodeIdx);
    } else {
      rootChildren.push(nodeIdx);
    }

    geom.dispose();
  }

  const binBuffer = pad4(Buffer.concat(binChunks), 0);

  const gltfJson = {
    asset: { version: '2.0', generator: 'E-Tergov Lab GLB Generator' },
    scene: 0,
    scenes: [{ name: 'CrimeSceneRoom', nodes: rootChildren }],
    nodes: gltfNodes,
    meshes: gltfMeshes,
    materials: MATERIALS.map((mat) => ({
      name: mat.name,
      pbrMetallicRoughness: {
        baseColorFactor: mat.baseColorFactor,
        metallicFactor: mat.metallicFactor,
        roughnessFactor: mat.roughnessFactor,
      },
      ...(mat.emissiveFactor ? { emissiveFactor: mat.emissiveFactor } : {}),
    })),
    accessors,
    bufferViews,
    buffers: [{ byteLength: binBuffer.length }],
  };

  const jsonBuffer = pad4(Buffer.from(JSON.stringify(gltfJson), 'utf-8'), 0x20);
  const totalLength = 12 + 8 + jsonBuffer.length + 8 + binBuffer.length;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF'
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(jsonBuffer.length, 0);
  jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const binChunkHeader = Buffer.alloc(8);
  binChunkHeader.writeUInt32LE(binBuffer.length, 0);
  binChunkHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

  return Buffer.concat([header, jsonChunkHeader, jsonBuffer, binChunkHeader, binBuffer]);
}

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
const glb = buildGlb();
fs.writeFileSync(OUTPUT_PATH, glb);
console.log(`Generated ${OUTPUT_PATH} (${(glb.length / 1024).toFixed(1)} KB)`);
