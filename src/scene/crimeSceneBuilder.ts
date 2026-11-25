import * as THREE from 'three';

export interface BuiltCrimeScene {
  root: THREE.Group;
  evidenceGroups: Map<string, THREE.Object3D>;
  interactables: THREE.Object3D[];
  roomBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  dispose: () => void;
}

function createCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  maxAnisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, width, height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  if (repeatX > 1 || repeatY > 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  tex.needsUpdate = true;
  return tex;
}

function makeWoodFloorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = '#2c221b';
      ctx.fillRect(0, 0, w, h);

      const plankCount = 8;
      const plankH = h / plankCount;
      for (let i = 0; i < plankCount; i++) {
        const y = i * plankH;
        const shade = 36 + ((i * 19) % 14);
        ctx.fillStyle = `rgb(${shade + 12}, ${shade + 2}, ${shade - 6})`;
        ctx.fillRect(0, y + 1, w, plankH - 2);

        // Subtle wood grain strokes
        ctx.strokeStyle = 'rgba(18, 12, 8, 0.24)';
        ctx.lineWidth = 1;
        for (let g = 0; g < 10; g++) {
          ctx.beginPath();
          const gy = y + 4 + (g * (plankH - 8)) / 10;
          ctx.moveTo(0, gy);
          ctx.bezierCurveTo(w * 0.33, gy + (g % 2 ? 2 : -2), w * 0.66, gy - 1, w, gy);
          ctx.stroke();
        }

        // Vertical plank seam
        const seamX = ((i * 173) % (w - 80)) + 40;
        ctx.fillStyle = '#15100c';
        ctx.fillRect(seamX, y, 2, plankH);
        ctx.fillRect(0, y, w, 2);
      }
    },
    maxAnisotropy,
    4,
    4
  );
}

function makeWallPlasterTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    512,
    (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2a3342');
      grad.addColorStop(0.7, '#222b38');
      grad.addColorStop(1, '#19202c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural concrete/plaster speckle
      for (let i = 0; i < 1800; i++) {
        const x = (i * 97) % w;
        const y = (i * 53) % h;
        const alpha = 0.03 + ((i % 5) * 0.01);
        ctx.fillStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha + 0.03})`;
        ctx.fillRect(x, y, 3, 3);
      }
    },
    maxAnisotropy,
    2,
    1
  );
}

function makeNoteTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = '#efe6cf';
      ctx.fillRect(0, 0, w, h);

      // Notebook ruled lines
      ctx.strokeStyle = 'rgba(71, 118, 179, 0.28)';
      ctx.lineWidth = 2;
      for (let y = 70; y < h - 30; y += 44) {
        ctx.beginPath();
        ctx.moveTo(28, y);
        ctx.lineTo(w - 28, y);
        ctx.stroke();
      }

      // Red margin line
      ctx.strokeStyle = 'rgba(205, 76, 76, 0.4)';
      ctx.beginPath();
      ctx.moveTo(76, 0);
      ctx.lineTo(76, h);
      ctx.stroke();

      // Handwritten Uzbek forensic clue
      ctx.fillStyle = '#1b3668';
      ctx.font = 'italic 600 32px Georgia, serif';
      ctx.fillText('SOAT 22:30 DA', 96, 152);
      ctx.fillText('UCHRASHUV!', 96, 198);
      ctx.font = 'italic 500 26px Georgia, serif';
      ctx.fillText('Chilonzor bekati...', 96, 286);
      ctx.fillText('8600 **** 9104', 96, 332);
      ctx.fillStyle = 'rgba(130, 32, 32, 0.35)';
      ctx.beginPath();
      ctx.arc(385, 390, 34, 0, Math.PI * 2);
      ctx.fill();
    },
    maxAnisotropy
  );
}

function makeMonitorScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    320,
    (ctx, w, h) => {
      ctx.fillStyle = '#07111f';
      ctx.fillRect(0, 0, w, h);

      // Top bar
      ctx.fillStyle = '#0f2442';
      ctx.fillRect(0, 0, w, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('PROXY NODE // 185.139.137.44', 16, 22);

      // Terminal forensic output
      ctx.fillStyle = '#10b981';
      ctx.font = '14px monospace';
      const lines = [
        '> TARGET: TuronPay Web-Mirror [ACTIVE]',
        '> SESSION: 19.11.2026 14:12:08 UTC+5',
        '> OTP_INTERCEPTED: 849-102 [OK]',
        '> TRANSFER: 42,500,000 UZS -> 8600****9104',
        '> ROUTE: YUNUSOBOD_GW -> SERGELI_PROXY',
        '> STATUS: TRACE DETECTED [WARNING]',
      ];
      lines.forEach((line, idx) => {
        ctx.fillStyle = idx === 5 ? '#f59e0b' : idx === 3 ? '#f87171' : '#34d399';
        ctx.fillText(line, 18, 68 + idx * 32);
      });

      // Graph bar accent
      ctx.strokeStyle = '#1e3a5f';
      ctx.strokeRect(18, 255, w - 36, 44);
      ctx.fillStyle = '#2563eb';
      for (let i = 0; i < 18; i++) {
        const bh = 8 + ((i * 13) % 28);
        ctx.fillRect(28 + i * 25, 294 - bh, 14, bh);
      }
    },
    maxAnisotropy
  );
}

function makePhoneScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    256,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(0, 0, w, 64);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Milliy Bank Bot', 20, 40);

      // Chat bubbles
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(16, 86, 210, 84);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '15px sans-serif';
      ctx.fillText('Tasdiqlash havolasi:', 26, 114);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('turon-verify.uz/id', 26, 144);

      ctx.fillStyle = '#065f46';
      ctx.fillRect(46, 194, 194, 72);
      ctx.fillStyle = '#ecfdf5';
      ctx.fillText('SMS kod: 849102', 60, 236);

      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(16, 296, 224, 92);
      ctx.fillStyle = '#fecaca';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('IMEI: 354892104491820', 24, 332);
      ctx.fillText('-42,500,000 UZS', 24, 366);
    },
    maxAnisotropy
  );
}

function makeEvidenceMarkerTexture(num: number, maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    128,
    128,
    (ctx, w, h) => {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 8;
      ctx.strokeRect(6, 6, w - 12, h - 12);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 76px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(num), w / 2, h / 2 + 4);
    },
    maxAnisotropy
  );
}

function makeCrimeTapeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    64,
    (ctx, w, h) => {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#0f172a';
      for (let x = -40; x < w + 40; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 18, 0);
        ctx.lineTo(x + 2, h);
        ctx.lineTo(x - 16, h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 12, w, 40);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HODISA JOYI • KIRISH TAQIQLANADI • 102', w / 2, h / 2 + 1);
    },
    maxAnisotropy,
    3,
    1
  );
}

function createEvidenceTentMarker(
  num: number,
  maxAnisotropy: number,
  textures: THREE.Texture[]
): THREE.Group {
  const group = new THREE.Group();
  const tex = makeEvidenceMarkerTexture(num, maxAnisotropy);
  textures.push(tex);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const planeGeo = new THREE.PlaneGeometry(0.085, 0.095);
  const front = new THREE.Mesh(planeGeo, mat);
  front.position.set(0, 0.044, 0.022);
  front.rotation.x = -0.35;
  front.castShadow = true;

  const back = new THREE.Mesh(planeGeo, mat);
  back.position.set(0, 0.044, -0.022);
  back.rotation.y = Math.PI;
  back.rotation.x = -0.35;
  back.castShadow = true;

  group.add(front, back);
  return group;
}

function tagEvidenceHierarchy(group: THREE.Object3D, evidenceId: string) {
  group.name = evidenceId;
  group.userData.evidenceId = evidenceId;
  group.traverse((child) => {
    child.userData.evidenceId = evidenceId;
    if (!child.name) {
      child.name = evidenceId;
    }
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
}

export function buildProceduralCrimeScene(maxAnisotropy: number): BuiltCrimeScene {
  const root = new THREE.Group();
  root.name = 'CrimeSceneRoom';

  const textures: THREE.Texture[] = [];
  const evidenceGroups = new Map<string, THREE.Object3D>();
  const interactables: THREE.Object3D[] = [];

  const roomW = 6.4;
  const roomH = 3.2;
  const roomD = 6.4;

  // === FLOOR & WALLS ===
  const floorTex = makeWoodFloorTexture(maxAnisotropy);
  const wallTex = makeWallPlasterTexture(maxAnisotropy);
  textures.push(floorTex, wallTex);

  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.62,
    metalness: 0.08,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x161d29,
    roughness: 0.9,
    metalness: 0.02,
  });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = roomH;
  root.add(ceiling);

  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex,
    roughness: 0.85,
    metalness: 0.04,
  });

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  backWall.receiveShadow = true;
  root.add(backWall);

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  frontWall.position.set(0, roomH / 2, roomD / 2);
  frontWall.rotation.y = Math.PI;
  frontWall.receiveShadow = true;
  root.add(frontWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  root.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  root.add(rightWall);

  // Baseboard trim
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x11151d,
    roughness: 0.55,
    metalness: 0.12,
  });
  const backTrim = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.14, 0.04), trimMat);
  backTrim.position.set(0, 0.07, -roomD / 2 + 0.02);
  const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, roomD), trimMat);
  leftTrim.position.set(-roomW / 2 + 0.02, 0.07, 0);
  const rightTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, roomD), trimMat);
  rightTrim.position.set(roomW / 2 - 0.02, 0.07, 0);
  root.add(backTrim, leftTrim, rightTrim);

  // === NIGHT WINDOW ON LEFT WALL (Moonlight atmosphere) ===
  const windowGroup = new THREE.Group();
  windowGroup.position.set(-roomW / 2 + 0.03, 1.78, -0.5);
  windowGroup.rotation.y = Math.PI / 2;
  const winFrameMat = new THREE.MeshStandardMaterial({ color: 0x171e2b, roughness: 0.5, metalness: 0.2 });
  const winGlassMat = new THREE.MeshStandardMaterial({
    color: 0x163259,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.55,
    roughness: 0.15,
    metalness: 0.1,
  });
  const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.25), winGlassMat);
  const winTop = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.08, 0.08), winFrameMat);
  winTop.position.y = 0.64;
  const winBot = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.1, 0.12), winFrameMat);
  winBot.position.y = -0.64;
  const winLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.32, 0.08), winFrameMat);
  winLeft.position.x = -0.83;
  const winRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.32, 0.08), winFrameMat);
  winRight.position.x = 0.83;
  const winMid = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.28, 0.06), winFrameMat);
  windowGroup.add(winGlass, winTop, winBot, winLeft, winRight, winMid);
  // Venetian blind slats
  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.025, 0.03), winFrameMat);
    slat.position.set(0, 0.52 - i * 0.11, 0.03);
    slat.rotation.x = 0.25;
    windowGroup.add(slat);
  }
  root.add(windowGroup);

  // === CEILING PENDANT LAMP ===
  const lampGroup = new THREE.Group();
  lampGroup.position.set(0, roomH, -0.75);
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.72, 10),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 })
  );
  cord.position.y = -0.36;
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.22, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.75,
      side: THREE.DoubleSide,
    })
  );
  shade.position.y = -0.76;
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 16, 12),
    new THREE.MeshStandardMaterial({
      color: 0xfff5d6,
      emissive: 0xffd27d,
      emissiveIntensity: 3.0,
      roughness: 0.2,
    })
  );
  bulb.position.y = -0.82;
  lampGroup.add(cord, shade, bulb);
  root.add(lampGroup);

  // === CRIME SCENE TAPE ACROSS BACK CORNER ===
  const tapeTex = makeCrimeTapeTexture(maxAnisotropy);
  textures.push(tapeTex);
  const tapeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 0.075),
    new THREE.MeshStandardMaterial({
      map: tapeTex,
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide,
    })
  );
  tapeMesh.position.set(-2.15, 0.98, -2.05);
  tapeMesh.rotation.y = Math.PI / 4;
  root.add(tapeMesh);

  // === INVESTIGATION DESK (Composite 7-part wooden + steel table) ===
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0, 0, -0.95);
  const deskTopY = 0.78;
  const deskWoodMat = new THREE.MeshStandardMaterial({
    color: 0x3f2d21,
    roughness: 0.52,
    metalness: 0.06,
  });
  const deskMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1b2230,
    roughness: 0.34,
    metalness: 0.82,
  });

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.06, 0.96), deskWoodMat);
  deskTop.position.set(0, deskTopY - 0.03, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  const legOffsets: [number, number][] = [
    [-0.95, -0.41],
    [0.95, -0.41],
    [-0.95, 0.41],
    [0.95, 0.41],
  ];
  legOffsets.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.055, deskTopY - 0.06, 0.055), deskMetalMat);
    leg.position.set(lx, (deskTopY - 0.06) / 2, lz);
    leg.castShadow = true;
    leg.receiveShadow = true;
    deskGroup.add(leg);
  });

  // Desk drawer pedestal on right
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.78), deskWoodMat);
  pedestal.position.set(0.66, 0.44, 0.02);
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  deskGroup.add(pedestal);
  for (let d = 0; d < 2; d++) {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.03), deskMetalMat);
    handle.position.set(0.66, 0.56 - d * 0.22, 0.42);
    deskGroup.add(handle);
  }
  root.add(deskGroup);

  // === OFFICE CHAIR (Slightly pushed back, tilted as if suspect left in a hurry) ===
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-0.28, 0, -0.05);
  chairGroup.rotation.y = 0.42;
  const chairLeather = new THREE.MeshStandardMaterial({ color: 0x161b24, roughness: 0.48, metalness: 0.1 });
  const chairChrome = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.22, metalness: 0.9 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.48), chairLeather);
  seat.position.y = 0.46;
  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.07), chairLeather);
  backrest.position.set(0, 0.76, 0.22);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.4, 12), chairChrome);
  stem.position.y = 0.24;
  const baseHub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.04, 5), chairChrome);
  baseHub.position.y = 0.04;
  chairGroup.add(seat, backrest, stem, baseHub);
  chairGroup.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
  root.add(chairGroup);

  // === SIDE FILING CABINET / SHELF ON BACK RIGHT ===
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-2.25, 0, -2.5);
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x262f3e, roughness: 0.5, metalness: 0.35 });
  const shelfBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.85, 0.45), shelfMat);
  shelfBody.position.y = 0.925;
  shelfBody.castShadow = true;
  shelfBody.receiveShadow = true;
  shelfGroup.add(shelfBody);
  // Folders on cabinet
  const folderColors = [0x1d4ed8, 0xb45309, 0x047857, 0x991b1b];
  folderColors.forEach((col, i) => {
    const folder = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.32, 0.26),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.72 })
    );
    folder.position.set(-0.32 + i * 0.14, 2.01, 0);
    folder.castShadow = true;
    shelfGroup.add(folder);
  });
  root.add(shelfGroup);

  // =====================================================================
  // EVIDENCE #1: Dalil_Pichoq (Kitchen Knife — Multi-part ExtrudeGeometry)
  // =====================================================================
  const knifeGroup = new THREE.Group();
  knifeGroup.position.set(-0.62, deskTopY + 0.005, -0.76);
  knifeGroup.rotation.y = 0.55;

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.22, 0.008);
  bladeShape.quadraticCurveTo(0.26, 0.018, 0.27, 0.042);
  bladeShape.lineTo(0, 0.046);
  bladeShape.closePath();

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0015,
    bevelSegments: 2,
  });
  bladeGeo.rotateX(Math.PI / 2);
  const bladeMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbe4ee,
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 0.4,
  });
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
  bladeMesh.position.set(0.02, 0.014, -0.023);

  const bolster = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.022, 0.044),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.25 })
  );
  bolster.position.set(0.012, 0.013, 0);

  const handleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.135, 0.022, 0.032),
    new THREE.MeshStandardMaterial({ color: 0x1b1512, roughness: 0.68, metalness: 0.08 })
  );
  handleMesh.position.set(-0.062, 0.013, 0);

  const rivetMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.2 });
  [-0.025, -0.062, -0.098].forEach((rx) => {
    const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.025, 10), rivetMat);
    rivet.position.set(rx, 0.013, 0);
    knifeGroup.add(rivet);
  });

  // Invisible hit-box padding so clicking small knife is effortless
  const knifeHitBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.12, 0.2),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  knifeHitBox.position.set(0.07, 0.05, 0);

  const marker1 = createEvidenceTentMarker(1, maxAnisotropy, textures);
  marker1.position.set(-0.18, 0, 0.08);
  marker1.rotation.y = -0.3;

  knifeGroup.add(bladeMesh, bolster, handleMesh, knifeHitBox, marker1);
  tagEvidenceHierarchy(knifeGroup, 'Dalil_Pichoq');
  root.add(knifeGroup);
  evidenceGroups.set('Dalil_Pichoq', knifeGroup);
  interactables.push(knifeGroup);

  // =====================================================================
  // EVIDENCE #2: Dalil_Xat (Torn Handwritten Note)
  // =====================================================================
  const noteGroup = new THREE.Group();
  noteGroup.position.set(0.56, deskTopY + 0.004, -0.68);
  noteGroup.rotation.y = -0.28;

  const noteTex = makeNoteTexture(maxAnisotropy);
  textures.push(noteTex);
  const noteMat = new THREE.MeshStandardMaterial({
    map: noteTex,
    roughness: 0.88,
    metalness: 0.02,
  });

  const mainSheet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.003, 0.28), noteMat);
  mainSheet.position.set(0, 0.002, 0);

  // Torn corner fragment resting nearby
  const tornCorner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.003, 0.07), noteMat);
  tornCorner.position.set(0.14, 0.002, -0.09);
  tornCorner.rotation.y = 0.65;

  // Metallic paperclip accent
  const clip = new THREE.Mesh(
    new THREE.TorusGeometry(0.016, 0.0025, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.22 })
  );
  clip.rotation.x = Math.PI / 2;
  clip.position.set(-0.07, 0.006, -0.1);

  const noteHitBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.12, 0.36),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  noteHitBox.position.set(0.04, 0.05, 0);

  const marker2 = createEvidenceTentMarker(2, maxAnisotropy, textures);
  marker2.position.set(0.18, 0, 0.09);
  marker2.rotation.y = 0.2;

  noteGroup.add(mainSheet, tornCorner, clip, noteHitBox, marker2);
  tagEvidenceHierarchy(noteGroup, 'Dalil_Xat');
  root.add(noteGroup);
  evidenceGroups.set('Dalil_Xat', noteGroup);
  interactables.push(noteGroup);

  // =====================================================================
  // EVIDENCE #3: Dalil_Kompyuter (Workstation Monitor + Keyboard + Tower)
  // =====================================================================
  const pcGroup = new THREE.Group();
  pcGroup.position.set(-0.04, deskTopY, -1.12);

  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.42, metalness: 0.35 });
  const screenTex = makeMonitorScreenTexture(maxAnisotropy);
  textures.push(screenTex);
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissive: 0x1d4ed8,
    emissiveMap: screenTex,
    emissiveIntensity: 0.85,
    roughness: 0.18,
    metalness: 0.1,
  });

  const monitorBody = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.38, 0.032), bezelMat);
  monitorBody.position.set(0, 0.34, 0);
  const monitorScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.34), screenMat);
  monitorScreen.position.set(0, 0.34, 0.018);
  const monitorNeck = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.04), bezelMat);
  monitorNeck.position.set(0, 0.1, -0.02);
  const monitorBase = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.018, 0.18), bezelMat);
  monitorBase.position.set(0, 0.01, 0.01);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.018, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.15 })
  );
  keyboard.position.set(-0.04, 0.012, 0.25);

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(0.21, 0.44, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.38, metalness: 0.65 })
  );
  tower.position.set(0.56, 0.22, -0.04);

  const towerLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.06, 0.01),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 2.2 })
  );
  towerLed.position.set(0.56, 0.36, 0.175);

  const marker3 = createEvidenceTentMarker(3, maxAnisotropy, textures);
  marker3.position.set(-0.34, 0, 0.14);

  pcGroup.add(monitorBody, monitorScreen, monitorNeck, monitorBase, keyboard, tower, towerLed, marker3);
  tagEvidenceHierarchy(pcGroup, 'Dalil_Kompyuter');
  root.add(pcGroup);
  evidenceGroups.set('Dalil_Kompyuter', pcGroup);
  interactables.push(pcGroup);

  // =====================================================================
  // EVIDENCE #4: Dalil_Smartfon (Suspect Smartphone)
  // =====================================================================
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(0.23, deskTopY + 0.005, -0.71);
  phoneGroup.rotation.y = 0.22;

  const phoneBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.082, 0.011, 0.165),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.24 })
  );
  phoneBody.position.y = 0.006;

  const phoneTex = makePhoneScreenTexture(maxAnisotropy);
  textures.push(phoneTex);
  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.072, 0.15),
    new THREE.MeshStandardMaterial({
      map: phoneTex,
      emissive: 0x60a5fa,
      emissiveMap: phoneTex,
      emissiveIntensity: 0.65,
      roughness: 0.14,
    })
  );
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.y = 0.0125;

  const phoneHitBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.12, 0.24),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  phoneHitBox.position.y = 0.05;

  const marker4 = createEvidenceTentMarker(4, maxAnisotropy, textures);
  marker4.position.set(-0.09, 0, 0.05);

  phoneGroup.add(phoneBody, phoneScreen, phoneHitBox, marker4);
  tagEvidenceHierarchy(phoneGroup, 'Dalil_Smartfon');
  root.add(phoneGroup);
  evidenceGroups.set('Dalil_Smartfon', phoneGroup);
  interactables.push(phoneGroup);

  // =====================================================================
  // EVIDENCE #5: Dalil_Seyf (Heavy Steel Safe + Transit Bank Cards)
  // =====================================================================
  const safeGroup = new THREE.Group();
  safeGroup.position.set(2.15, 0, -0.78);
  safeGroup.rotation.y = -Math.PI / 2.2;

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x273244,
    metalness: 0.78,
    roughness: 0.34,
  });
  const dialChromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.94,
    roughness: 0.18,
  });

  const safeBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.78, 0.62), steelMat);
  safeBody.position.y = 0.39;

  const safeDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.68, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.82, roughness: 0.28 })
  );
  safeDoor.position.set(0, 0.39, 0.31);

  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.035, 20), dialChromeMat);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0.08, 0.44, 0.34);

  const safeHandleHub = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.04, 14), dialChromeMat);
  safeHandleHub.rotation.x = Math.PI / 2;
  safeHandleHub.position.set(-0.12, 0.38, 0.34);

  const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.022, 0.022), dialChromeMat);
  handleBar.position.set(-0.12, 0.38, 0.36);

  // Transit bank card & cash bundle on top of safe
  const cardMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.005, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.45, roughness: 0.28 })
  );
  cardMesh.position.set(-0.1, 0.785, 0.08);
  cardMesh.rotation.y = 0.3;

  const cashBundle = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.045, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.82 })
  );
  cashBundle.position.set(0.1, 0.805, -0.04);
  cashBundle.rotation.y = -0.2;

  const marker5 = createEvidenceTentMarker(5, maxAnisotropy, textures);
  marker5.position.set(-0.18, 0.78, -0.14);
  marker5.rotation.y = 0.4;

  safeGroup.add(safeBody, safeDoor, dial, safeHandleHub, handleBar, cardMesh, cashBundle, marker5);
  tagEvidenceHierarchy(safeGroup, 'Dalil_Seyf');
  root.add(safeGroup);
  evidenceGroups.set('Dalil_Seyf', safeGroup);
  interactables.push(safeGroup);

  const dispose = () => {
    textures.forEach((t) => t.dispose());
    root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  };

  return {
    root,
    evidenceGroups,
    interactables,
    roomBounds: {
      minX: -roomW / 2 + 0.5,
      maxX: roomW / 2 - 0.5,
      minZ: -roomD / 2 + 0.5,
      maxZ: roomD / 2 - 0.5,
    },
    dispose,
  };
}
