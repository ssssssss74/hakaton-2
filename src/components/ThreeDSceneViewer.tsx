import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Eye,
  FileText,
  Flashlight,
  Maximize2,
  Minimize2,
  RotateCw,
  ShieldAlert,
  Upload,
  X,
} from 'lucide-react';
import { buildProceduralCrimeScene, BuiltCrimeScene } from '../scene/crimeSceneBuilder';
import {
  FORENSIC_EVIDENCE_CATALOG,
  ForensicEvidenceInfo,
  resolveEvidenceInfo,
} from '../scene/evidenceCatalog';

interface ThreeDSceneViewerProps {
  pinnedClues: string[];
  onTogglePinClue: (clueId: string) => void;
  fullViewport?: boolean;
}

// Pre-allocated math helpers (zero GC inside animation loop)
const _moveDir = new THREE.Vector3();
const _rightVec = new THREE.Vector3();
const _mouseNdc = new THREE.Vector2();
const _centerNdc = new THREE.Vector2(0, 0);
const _lookMat = new THREE.Matrix4();
const _targetQuat = new THREE.Quaternion();
const _targetPos = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

function findDalilName(obj: THREE.Object3D | null): string | null {
  let curr: THREE.Object3D | null = obj;
  while (curr) {
    if (typeof curr.userData?.evidenceId === 'string' && curr.userData.evidenceId.startsWith('Dalil_')) {
      return curr.userData.evidenceId;
    }
    if (curr.name && curr.name.startsWith('Dalil_')) {
      return curr.name;
    }
    curr = curr.parent;
  }
  return null;
}

export const ThreeDSceneViewer: React.FC<ThreeDSceneViewerProps> = ({
  pinnedClues,
  onTogglePinClue,
  fullViewport = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedEvidence, setSelectedEvidence] = useState<ForensicEvidenceInfo | null>(null);
  const [hoveredEvidenceName, setHoveredEvidenceName] = useState<string | null>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [customModelLabel, setCustomModelLabel] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [expertiseModalOpen, setExpertiseModalOpen] = useState(false);

  // Refs bridging React UI controls into the single stable WebGL lifecycle
  const flashlightRef = useRef(flashlightOn);
  const cameraTransitionRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    lookAt: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(0, 1.6, 2.35),
    lookAt: new THREE.Vector3(0, 0.95, -0.9),
  });
  const sceneApiRef = useRef<{
    lockPointer: () => void;
    resetCamera: () => void;
    focusEvidence: (ev: ForensicEvidenceInfo) => void;
    loadGlbFile: (file: File) => void;
    loadDefaultGlb: () => void;
    restoreDefaultRoom: () => void;
  } | null>(null);

  useEffect(() => {
    flashlightRef.current = flashlightOn;
  }, [flashlightOn]);

  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e18);
    scene.fog = new THREE.FogExp2(0x090e18, 0.065);

    const width = mountEl.clientWidth || 960;
    const height = mountEl.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.08, 60);
    camera.position.set(0, 1.6, 2.35);
    camera.lookAt(0, 0.98, -0.95);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // Mandatory studio environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // Warm/cool night forensic lighting rig (<= 3 shadow casters)
    const hemiLight = new THREE.HemisphereLight(0x6088c8, 0x1a1512, 0.65);
    scene.add(hemiLight);

    const ceilingLight = new THREE.PointLight(0xffdfb0, 5.2, 12, 1.6);
    ceilingLight.position.set(0, 2.35, -0.75);
    if (!isSoftwareGl) {
      ceilingLight.castShadow = true;
      ceilingLight.shadow.mapSize.set(1024, 1024);
      ceilingLight.shadow.bias = -0.002;
      ceilingLight.shadow.normalBias = 0.02;
    }
    scene.add(ceilingLight);

    const moonlightFill = new THREE.DirectionalLight(0x5b8def, 1.15);
    moonlightFill.position.set(-4.2, 2.4, -0.5);
    moonlightFill.target.position.set(0.4, 0.8, -0.8);
    scene.add(moonlightFill, moonlightFill.target);

    // Investigator handheld flashlight attached to camera
    const flashlight = new THREE.SpotLight(0xfff4e0, 4.5, 9, Math.PI / 5.5, 0.55, 1.5);
    flashlight.position.set(0.14, -0.1, 0);
    flashlight.target.position.set(0, -0.08, -3);
    camera.add(flashlight, flashlight.target);
    scene.add(camera);

    // Build default procedural crime scene room
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    let activeProcedural: BuiltCrimeScene | null = buildProceduralCrimeScene(maxAnisotropy);
    let customGltfRoot: THREE.Object3D | null = null;
    let currentInteractables: THREE.Object3D[] = activeProcedural.interactables;
    let roomBounds = activeProcedural.roomBounds;
    scene.add(activeProcedural.root);

    // PointerLockControls for authentic WASD + Mouse-Look walkthrough
    const controls = new PointerLockControls(camera, renderer.domElement);
    const onLock = () => {
      cameraTransitionRef.current.active = false;
      setIsPointerLocked(true);
    };
    const onUnlock = () => setIsPointerLocked(false);
    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);

    // WASD + Arrow key movement state
    const keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    const isInputFocused = () => {
      const tag = document.activeElement?.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = true;
          cameraTransitionRef.current.active = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = true;
          cameraTransitionRef.current.active = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = true;
          cameraTransitionRef.current.active = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = true;
          cameraTransitionRef.current.active = false;
          break;
        case 'KeyF':
          setFlashlightOn((v) => !v);
          break;
        case 'KeyH':
          setDockCollapsed((v) => !v);
          break;
        case 'KeyE':
          if (controls.isLocked) {
            pickFromCenter();
          }
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = false;
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Raycaster & Drag-to-Look Fallback (works seamlessly inside iframes too!)
    const raycaster = new THREE.Raycaster();
    raycaster.far = 14;
    let isDraggingLook = false;
    let pointerDownPos = { x: 0, y: 0 };
    let lastPointerPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');

    const pickFromCenter = () => {
      raycaster.setFromCamera(_centerNdc, camera);
      const hits = raycaster.intersectObjects(currentInteractables, true);
      if (hits.length > 0) {
        const dalil = findDalilName(hits[0].object);
        if (dalil) {
          setSelectedEvidence(resolveEvidenceInfo(dalil));
          if (controls.isLocked) controls.unlock();
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (controls.isLocked) {
        pickFromCenter();
        return;
      }
      isDraggingLook = true;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      lastPointerPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();

      if (isDraggingLook && !controls.isLocked) {
        const dx = e.clientX - lastPointerPos.x;
        const dy = e.clientY - lastPointerPos.y;
        lastPointerPos = { x: e.clientX, y: e.clientY };
        cameraTransitionRef.current.active = false;

        euler.setFromQuaternion(camera.quaternion);
        euler.y -= dx * 0.0038;
        euler.x = THREE.MathUtils.clamp(euler.x - dy * 0.0038, -Math.PI / 2.2, Math.PI / 2.2);
        camera.quaternion.setFromEuler(euler);
        return;
      }

      // Throttled hover raycast for pointer cursor + hovered label
      const now = performance.now();
      if (now - lastHoverCheck < 55) return;
      lastHoverCheck = now;

      if (controls.isLocked) {
        raycaster.setFromCamera(_centerNdc, camera);
      } else {
        _mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(_mouseNdc, camera);
      }

      const hits = raycaster.intersectObjects(currentInteractables, true);
      const dalil = hits.length > 0 ? findDalilName(hits[0].object) : null;
      renderer.domElement.style.cursor = dalil ? 'pointer' : isDraggingLook ? 'grabbing' : 'grab';
      setHoveredEvidenceName(dalil);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingLook) return;
      isDraggingLook = false;

      const movedDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (movedDist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        _mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(_mouseNdc, camera);
        const hits = raycaster.intersectObjects(currentInteractables, true);
        const dalil = hits.length > 0 ? findDalilName(hits[0].object) : null;
        if (dalil) {
          setSelectedEvidence(resolveEvidenceInfo(dalil));
        } else {
          // Clicking non-evidence surface engages first-person PointerLock if browser allows
          try {
            controls.lock();
          } catch {
            // Iframe fallback: drag-to-look remains active seamlessly
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // GLB Loader for user-supplied Blender xona.glb models
    const gltfLoader = new GLTFLoader();
    const disposeObjectTree = (obj: THREE.Object3D) => {
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    };

    const applyGlbBuffer = (buffer: ArrayBuffer, label: string, isDefaultAsset = false) => {
      if (buffer.byteLength < 12) {
        if (!isDefaultAsset) {
          setModelError("GLB fayl hajmi juda kichik yoki buzilgan.");
        }
        return;
      }
      const view = new DataView(buffer);
      const magic = view.getUint32(0, true);
      if (magic !== 0x46546c67) {
        if (!isDefaultAsset) {
          setModelError("Fayl haqiqiy glTF 2.0 (.glb) formatida emas.");
        }
        return;
      }

      gltfLoader.parse(
        buffer,
        '',
        (gltf) => {
          if (disposed) {
            disposeObjectTree(gltf.scene);
            return;
          }
          if (activeProcedural) {
            scene.remove(activeProcedural.root);
            activeProcedural.dispose();
            activeProcedural = null;
          }
          if (customGltfRoot) {
            scene.remove(customGltfRoot);
            disposeObjectTree(customGltfRoot);
            customGltfRoot = null;
          }

          const loadedRoot = gltf.scene;
          const dalilTargets: THREE.Object3D[] = [];

          loadedRoot.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
            if (child.name && child.name.startsWith('Dalil_')) {
              const evidenceId = child.name;
              child.userData.evidenceId = evidenceId;
              child.traverse((sub) => {
                sub.userData.evidenceId = evidenceId;
              });
              dalilTargets.push(child);
            }
          });

          const box = new THREE.Box3().setFromObject(loadedRoot);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          if (size.x >= 4 && size.z >= 4) {
            roomBounds = {
              minX: box.min.x + 0.55,
              maxX: box.max.x - 0.55,
              minZ: box.min.z + 0.55,
              maxZ: box.max.z - 0.55,
            };
          } else {
            roomBounds = {
              minX: box.min.x - 1,
              maxX: box.max.x + 1,
              minZ: box.min.z - 1,
              maxZ: box.max.z + 1,
            };
          }

          customGltfRoot = loadedRoot;
          currentInteractables = dalilTargets.length > 0 ? dalilTargets : [loadedRoot];
          scene.add(loadedRoot);

          camera.position.set(center.x, 1.6, center.z + Math.min(2.35, Math.max(1.5, size.z * 0.35)));
          camera.lookAt(center.x, 0.98, center.z - 0.95);
          setSelectedEvidence(null);
          setCustomModelLabel(`${label} (${dalilTargets.length} ta Dalil_* topildi)`);
          setModelError(null);
        },
        (err) => {
          console.error('GLB parse error:', err);
          if (!isDefaultAsset) {
            setModelError("GLB faylni o'qib bo'lmadi. Iltimos, to'g'ri .glb yoki .gltf model tanlang.");
          }
        }
      );
    };

    const loadGlbUrl = async (url: string, label: string, signal?: AbortSignal, isDefaultAsset = false) => {
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) return;
        const buffer = await res.arrayBuffer();
        if (signal?.aborted || disposed) return;
        applyGlbBuffer(buffer, label, isDefaultAsset);
      } catch (err) {
        if ((err as Error).name !== 'AbortError' && !isDefaultAsset) {
          setModelError("3D modelni yuklashda xatolik yuz berdi.");
        }
      }
    };

    const loadGlbFile = (file: File) => {
      setModelError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        applyGlbBuffer(buffer, file.name, false);
      };
      reader.readAsArrayBuffer(file);
    };

    const restoreDefaultRoom = () => {
      if (customGltfRoot) {
        scene.remove(customGltfRoot);
        disposeObjectTree(customGltfRoot);
        customGltfRoot = null;
      }
      if (!activeProcedural) {
        activeProcedural = buildProceduralCrimeScene(maxAnisotropy);
        scene.add(activeProcedural.root);
      }
      currentInteractables = activeProcedural.interactables;
      roomBounds = activeProcedural.roomBounds;
      setCustomModelLabel(null);
      setModelError(null);
      cameraTransitionRef.current = {
        active: true,
        pos: new THREE.Vector3(0, 1.6, 2.35),
        lookAt: new THREE.Vector3(0, 0.98, -0.95),
      };
    };

    const modelAbort = new AbortController();

    sceneApiRef.current = {
      lockPointer: () => {
        try {
          controls.lock();
        } catch {
          // Graceful no-op if iframe restricts pointer lock
        }
      },
      resetCamera: () => {
        setSelectedEvidence(null);
        cameraTransitionRef.current = {
          active: true,
          pos: new THREE.Vector3(0, 1.6, 2.35),
          lookAt: new THREE.Vector3(0, 0.98, -0.95),
        };
      },
      focusEvidence: (ev: ForensicEvidenceInfo) => {
        setSelectedEvidence(ev);
        if (controls.isLocked) controls.unlock();
        cameraTransitionRef.current = {
          active: true,
          pos: new THREE.Vector3(...ev.focusPosition),
          lookAt: new THREE.Vector3(...ev.focusLookAt),
        };
      },
      loadGlbFile,
      loadDefaultGlb: () => {
        void loadGlbUrl('/models/xona.glb', 'public/models/xona.glb', undefined, false);
      },
      restoreDefaultRoom,
    };

    // Auto-load public/models/xona.glb when available
    void loadGlbUrl('/models/xona.glb', 'public/models/xona.glb', modelAbort.signal, true);

    // Pre-warm shaders on real GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ResizeObserver keeps canvas sharp in both embedded & expanded modes
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(1, Math.floor(entry.contentRect.width));
      const h = Math.max(1, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(mountEl);

    // Frame loop with software WebGL pacing via afterDraw
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);

      // Flashlight smooth intensity damping
      const targetFlash = flashlightRef.current ? 4.8 : 0;
      flashlight.intensity = THREE.MathUtils.damp(flashlight.intensity, targetFlash, 10, delta);

      // Smooth camera transition to evidence preset
      if (cameraTransitionRef.current.active) {
        _targetPos.copy(cameraTransitionRef.current.pos);
        camera.position.lerp(_targetPos, 1 - Math.exp(-6 * delta));
        _lookMat.lookAt(camera.position, cameraTransitionRef.current.lookAt, _upAxis);
        _targetQuat.setFromRotationMatrix(_lookMat);
        camera.quaternion.slerp(_targetQuat, 1 - Math.exp(-6 * delta));
        if (camera.position.distanceTo(_targetPos) < 0.02) {
          cameraTransitionRef.current.active = false;
        }
      } else {
        // First-person WASD walking with Y-axis locked at 1.6m eye height
        const speed = 3.5 * delta;
        if (keys.forward || keys.backward || keys.left || keys.right) {
          camera.getWorldDirection(_moveDir);
          _moveDir.y = 0;
          if (_moveDir.lengthSq() > 0.0001) {
            _moveDir.normalize();
            _rightVec.crossVectors(camera.up, _moveDir).normalize();

            if (keys.forward) camera.position.addScaledVector(_moveDir, speed);
            if (keys.backward) camera.position.addScaledVector(_moveDir, -speed);
            if (keys.left) camera.position.addScaledVector(_rightVec, speed);
            if (keys.right) camera.position.addScaledVector(_rightVec, -speed);

            camera.position.x = THREE.MathUtils.clamp(
              camera.position.x,
              roomBounds.minX,
              roomBounds.maxX
            );
            camera.position.z = THREE.MathUtils.clamp(
              camera.position.z,
              roomBounds.minZ,
              roomBounds.maxZ
            );
            camera.position.y = 1.6;
          }
        }
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      modelAbort.abort();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      controls.dispose();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (activeProcedural) activeProcedural.dispose();
      if (customGltfRoot) disposeObjectTree(customGltfRoot);
      envRT.dispose();
      renderer.dispose();
    };
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sceneApiRef.current?.loadGlbFile(file);
    }
    e.target.value = '';
  }, []);

  const hoveredInfo = hoveredEvidenceName ? resolveEvidenceInfo(hoveredEvidenceName) : null;
  const isPinned = selectedEvidence
    ? pinnedClues.includes(selectedEvidence.cluePinId) || pinnedClues.includes(selectedEvidence.id)
    : false;

  const wrapperClass = isExpanded
    ? 'fixed inset-0 z-50 bg-[#090e18] text-slate-100 flex flex-col'
    : fullViewport
      ? 'relative w-full h-[calc(100vh-8rem)] min-h-[560px] rounded-2xl overflow-hidden border border-slate-800 bg-[#090e18] text-slate-100 shadow-2xl'
      : 'relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-[#090e18] text-slate-100 shadow-2xl';

  return (
    <div ref={containerRef} className={wrapperClass}>
      {/* Isolated WebGL Canvas Container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* Center Reticle (shown in First-Person Pointer Lock mode) */}
      {isPointerLocked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                hoveredInfo ? 'border-amber-400 scale-125' : 'border-white/70'
              }`}
            >
              <div className={`w-1 h-1 rounded-full ${hoveredInfo ? 'bg-amber-400' : 'bg-white'}`} />
            </div>
            {hoveredInfo && (
              <div className="px-2.5 py-1 rounded bg-slate-950/90 border border-amber-400/60 text-[11px] font-semibold text-amber-300">
                {hoveredInfo.title} — [Bosing yoki E]
              </div>
            )}
          </div>
        </div>
      )}

      {/* Minimal Top-Left Control Guide Badge (Solid rgba, no backdrop-filter over WebGL) */}
      <div className="absolute top-3.5 left-3.5 z-10 max-w-[calc(100%-28px)] sm:max-w-xl bg-slate-950/90 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-slate-200 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-bold text-blue-400">3D Hodisa joyi</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            Ekranni bosing: Kamerani aylantirish · <span className="font-mono text-white">W,A,S,D</span>: Yurish ·{' '}
            <span className="font-mono text-white">ESC</span>: Sichqonchani chiqarish
          </span>
        </div>
        {hoveredInfo && !isPointerLocked && (
          <div className="mt-1 text-[11px] text-amber-300 font-medium">
            Dalil aniqlandi: {hoveredInfo.title} ({hoveredInfo.id}) — ko‘rish uchun bosing
          </div>
        )}
        {customModelLabel && (
          <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <span>Model: {customModelLabel}</span>
            <button
              type="button"
              onClick={() => sceneApiRef.current?.restoreDefaultRoom()}
              className="underline text-slate-300 hover:text-white cursor-pointer"
            >
              Asl xonaga qaytish
            </button>
          </div>
        )}
        {modelError && <div className="mt-1 text-[11px] text-red-400">{modelError}</div>}
      </div>

      {/* Selected Evidence Forensic Card (Bottom-Right, only when a Dalil_* item is clicked) */}
      {selectedEvidence && (
        <div className="absolute bottom-24 right-4 z-20 w-[min(340px,calc(100%-32px))] bg-[#111827] border border-slate-700 rounded-xl p-4 text-slate-100 shadow-2xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="inline-block px-2 py-0.5 rounded bg-blue-950 border border-blue-700/60 text-blue-300 text-[10px] font-mono mb-1">
                {selectedEvidence.category} · {selectedEvidence.jpkRef}
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">
                {selectedEvidence.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEvidence(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{selectedEvidence.desc}</p>

          <ul className="space-y-1 text-[11px] text-slate-300 border-t border-slate-800 pt-2.5">
            {selectedEvidence.details.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
              SHA-256 Butunlik Xeshi
            </div>
            <div className="font-mono text-[9px] text-emerald-400 break-all mt-0.5">
              {selectedEvidence.hash}
            </div>
          </div>

          {selectedEvidence.expertiseReport && (
            <button
              type="button"
              onClick={() => setExpertiseModalOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Ekspertiza xulosasi ({selectedEvidence.expertiseReport.reportNumber})</span>
            </button>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onTogglePinClue(selectedEvidence.cluePinId)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isPinned
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isPinned ? 'Doskada mavjud ✓' : 'Doskaga qo‘shish'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setExpertiseModalOpen(false);
                setSelectedEvidence(null);
              }}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Official Forensic Expertise Report Modal (No backdrop-filter over WebGL) */}
      {expertiseModalOpen && selectedEvidence?.expertiseReport && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[85%] overflow-y-auto bg-[#0F172A] border border-slate-700 rounded-2xl p-5 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
                  <FileText className="w-3 h-3" />
                  <span>EKSPERTIZA XULOSASI {selectedEvidence.expertiseReport.reportNumber}</span>
                </div>
                <h4 className="mt-1.5 text-base font-bold text-white">
                  {selectedEvidence.expertiseReport.expertiseType}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedEvidence.expertiseReport.institution} · {selectedEvidence.expertiseReport.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpertiseModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                aria-label="Xulosani yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Huquqiy asos
                </div>
                <div className="mt-1 font-medium text-blue-300">
                  {selectedEvidence.expertiseReport.legalBasis}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Tadqiqot ob’ekti
                </div>
                <div className="mt-1 font-medium text-white">
                  {selectedEvidence.title} ({selectedEvidence.id})
                </div>
              </div>
            </div>

            <div className="bg-amber-950/50 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2.5 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{selectedEvidence.expertiseReport.warningRef}</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-200">Tadqiqot natijalari:</div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {selectedEvidence.expertiseReport.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
                    <span className="font-mono text-[10px] font-bold text-amber-400 mt-0.5">
                      {idx + 1}.
                    </span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Yakuniy ekspert xulosasi
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {selectedEvidence.expertiseReport.conclusion}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => onTogglePinClue(selectedEvidence.cluePinId)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isPinned
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isPinned ? 'Doskada mavjud ✓' : 'Dalilni doskaga biriktirish'}</span>
              </button>
              <button
                type="button"
                onClick={() => setExpertiseModalOpen(false)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock (Zero Center Occlusion) */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-300 flex flex-col items-center ${
          dockCollapsed ? 'bottom-2' : 'bottom-4'
        }`}
        style={{ maxWidth: 'min(940px, 94vw)' }}
      >
        <button
          type="button"
          onClick={() => setDockCollapsed((c) => !c)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-slate-950/95 border border-b-0 border-slate-700 text-[11px] font-medium text-slate-300 hover:text-white cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Boshqaruv (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Yashirish (H)</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="bg-slate-950/95 border border-slate-700 rounded-xl px-3 py-2 flex flex-wrap items-center justify-center gap-2 shadow-2xl">
            {/* First-Person Walk Button */}
            <button
              type="button"
              onClick={() => sceneApiRef.current?.lockPointer()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
              title="Kamerani sichqoncha bilan boshqarish"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>1-Shaxs (WASD)</span>
            </button>

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            {/* Quick Evidence Focus Buttons */}
            {Object.values(FORENSIC_EVIDENCE_CATALOG).map((ev) => {
              const active = selectedEvidence?.id === ev.id;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => sceneApiRef.current?.focusEvidence(ev)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold text-amber-400">
                    #{ev.markerNumber}
                  </span>
                  <span className="truncate max-w-[96px]">
                    {ev.id.replace('Dalil_', '')}
                  </span>
                </button>
              );
            })}

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            {/* Flashlight Toggle */}
            <button
              type="button"
              onClick={() => setFlashlightOn((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                flashlightOn
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Fonarikni yoqish / o'chirish (F)"
            >
              <Flashlight className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Fonarik</span>
            </button>

            {/* Upload custom Blender xona.glb */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => sceneApiRef.current?.loadDefaultGlb()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 hover:text-emerald-200 text-xs font-medium cursor-pointer"
              title="public/models/xona.glb modelini yuklash"
            >
              <span>xona.glb (3D)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
              title="Boshqa Blender .glb modelini yuklash"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Yuklash</span>
            </button>

            {/* Reset Camera */}
            <button
              type="button"
              onClick={() => sceneApiRef.current?.resetCamera()}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Kamerani boshlang'ich holatga qaytarish"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Expand Full Viewport */}
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title={isExpanded ? 'Kichraytirish' : "To'liq ekran"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Subtle Bottom-Left Hint when no evidence is open */}
      {!selectedEvidence && !dockCollapsed && (
        <div className="hidden xl:flex items-center gap-1.5 absolute bottom-4 left-4 z-10 px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 text-[11px] text-slate-400 pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>Sariq raqamli dalillar ustiga bosing</span>
        </div>
      )}
    </div>
  );
};
