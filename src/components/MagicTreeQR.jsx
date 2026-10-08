import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import QRCode from 'qrcode';
import { useTheme } from '../context/ThemeContext';

const PORTFOLIO_URL = 'https://aleenar.in/';

/**
 * Standard cubic ease-in-out interpolation curve for silky-smooth motion.
 */
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Procedurally generates the unified 3D voxel system.
 * The QR code and the dense 3D magic tree are two mathematical states of the EXACT same 1,312 voxels.
 *
 * Theme-aware Palette:
 * - DARK THEME: Deep navy/plum base, rich violet -> royal purple -> radiant lavender -> subtle pink canopy.
 * - LIGHT THEME: Cream/lavender base, soft lavender -> vivid violet -> blush pink -> lilac canopy.
 */
function buildVoxelMatrix(url = PORTFOLIO_URL, isDark = true) {
  const targetUrl = url || PORTFOLIO_URL;

  // 1. Generate standard QR matrix (Version 2, 25x25)
  const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size; // 25
  const darkModules = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (qr.modules.get(r, c)) {
        const isFinderTL = r < 8 && c < 8;
        const isFinderTR = r < 8 && c >= size - 8;
        const isFinderBL = r >= size - 8 && c < 8;
        const isPerimeter = r <= 1 || r >= size - 2 || c <= 1 || c >= size - 2;
        const isBorder = isFinderTL || isFinderTR || isFinderBL || isPerimeter;
        darkModules.push({ r, c, isBorder });
      }
    }
  }

  // Subdivide each dark module into a 2x2 micro-voxel grid -> 328 * 4 = 1,312 individual 3D voxels
  const TOTAL_VOXELS = darkModules.length * 4;

  // Deterministic seeded PRNG for reproducible, sculpted organic foliage
  let seed = 54321;
  function rand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // --- STATE A: QR Matrix Coordinates (Flat on Z = 0 plane) ---
  const QR_SIDE = 2.36;
  const MOD_SIZE = QR_SIDE / size; // ~0.0944
  const SUB_SIZE = MOD_SIZE / 2;  // ~0.0472

  // Midnight plum for high optical contrast against ivory stone backing (100% camera scan reliability)
  const qrPlum = new THREE.Color(0x0e0618);
  const qrCorner = new THREE.Color(0x220c38);

  const qrVoxels = [];
  darkModules.forEach((m) => {
    for (let sr = 0; sr < 2; sr++) {
      for (let sc = 0; sc < 2; sc++) {
        const qx = -QR_SIDE / 2 + (m.c + sc * 0.5 + 0.25) * MOD_SIZE;
        const qy = 1.25 + (QR_SIDE / 2 - (m.r + sr * 0.5 + 0.25) * MOD_SIZE);
        const qz = 0.016;

        qrVoxels.push({
          x: qx,
          y: qy,
          z: qz,
          sx: SUB_SIZE * 0.98,
          sy: SUB_SIZE * 0.98,
          sz: 0.032,
          color: m.isBorder ? qrCorner.clone() : qrPlum.clone(),
          origR: m.r,
          origC: m.c
        });
      }
    }
  });

  // --- STATE B: 3D Pixel Sculpture Tree Coordinates (1,312 Voxels) ---
  // Distribution:
  // - Roots: 100 voxels
  // - Trunk: 140 voxels
  // - Branches: 180 voxels
  // - Volumetric Purple/Lavender Canopy: 892 voxels
  const treeVoxels = [];

  // Theme-specific wood and bark colors
  const rootColor = isDark ? new THREE.Color(0x351930) : new THREE.Color(0x523645);
  const trunkBaseColor = isDark ? new THREE.Color(0x3b1d38) : new THREE.Color(0x5c3d4e);
  const trunkBandColor = isDark ? new THREE.Color(0x240f21) : new THREE.Color(0x442a38);
  const branchColor = isDark ? new THREE.Color(0x4a2444) : new THREE.Color(0x6a475a);

  // 1. ROOTS (100 voxels): 8 sprawling root flares anchoring into patio
  const rootAngles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4];
  for (let i = 0; i < 100; i++) {
    const flareIdx = i % 8;
    const angle = rootAngles[flareIdx] + (rand() - 0.5) * 0.16;
    const t = Math.floor(i / 8) / 12;
    const dist = 0.2 + t * 0.74;
    const rx = Math.cos(angle) * dist + (rand() - 0.5) * 0.03;
    const rz = Math.sin(angle) * dist + (rand() - 0.5) * 0.03;
    const ry = 0.03 + (1 - t) * 0.22 + (rand() - 0.5) * 0.015;
    const s = 0.092 * (1 - t * 0.38);
    treeVoxels.push({
      type: 'root',
      x: rx, y: ry, z: rz,
      sx: s, sy: s, sz: s,
      color: rootColor.clone(),
      rotX: 0, rotY: angle, rotZ: 0
    });
  }

  // 2. TRUNK (140 voxels): Sturdy segmented trunk columns with subtle purple reflections
  for (let i = 0; i < 140; i++) {
    const yNorm = i / 140;
    const y = 0.18 + yNorm * 1.15; // Y: 0.18 to 1.33
    const radius = 0.23 * (1 - yNorm * 0.35);
    const angle = (i * 2.39996) + (rand() - 0.5) * 0.2;
    const rDist = Math.sqrt(rand()) * radius;
    const tx = Math.cos(angle) * rDist;
    const tz = Math.sin(angle) * rDist;
    const isBand = (y >= 0.42 && y <= 0.48) || (y >= 0.74 && y <= 0.80) || (y >= 1.04 && y <= 1.10);
    const s = 0.096;
    treeVoxels.push({
      type: 'trunk',
      x: tx, y, z: tz,
      sx: s, sy: s, sz: s,
      color: isBand ? trunkBandColor.clone() : trunkBaseColor.clone(),
      rotX: 0, rotY: 0, rotZ: 0
    });
  }

  // 3. BRANCHES (180 voxels): Primary and secondary limbs spreading in 3D through the canopy
  const branchConfigs = [
    { start: [0, 1.25, 0], end: [0.82, 1.95, 0.42], count: 36 },
    { start: [0, 1.25, 0], end: [-0.78, 1.90, 0.38], count: 36 },
    { start: [0, 1.30, 0], end: [0.65, 2.05, -0.62], count: 36 },
    { start: [0, 1.30, 0], end: [-0.72, 1.98, -0.55], count: 36 },
    { start: [0, 1.35, 0], end: [0.05, 2.65, -0.05], count: 36 } // Central ascending spire
  ];

  branchConfigs.forEach(b => {
    for (let i = 0; i < b.count; i++) {
      const t = (i + 0.5) / b.count;
      const bx = b.start[0] + (b.end[0] - b.start[0]) * t + (rand() - 0.5) * 0.04;
      const by = b.start[1] + (b.end[1] - b.start[1]) * t + (rand() - 0.5) * 0.035;
      const bz = b.start[2] + (b.end[2] - b.start[2]) * t + (rand() - 0.5) * 0.04;
      const s = 0.088 * (1 - t * 0.32);
      treeVoxels.push({
        type: 'branch',
        x: bx, y: by, z: bz,
        sx: s, sy: s, sz: s,
        color: branchColor.clone(),
        rotX: 0, rotY: 0, rotZ: 0
      });
    }
  });

  // 4. VOLUMETRIC PURPLE / LAVENDER CANOPY (892 voxels)
  const clusterCenters = [
    // Lower tier canopy lobes (flanking branches)
    { x: 0.75, y: 1.85, z: 0.40, r: 0.52 },
    { x: -0.72, y: 1.80, z: 0.36, r: 0.52 },
    { x: 0.62, y: 1.95, z: -0.58, r: 0.52 },
    { x: -0.68, y: 1.90, z: -0.52, r: 0.52 },
    { x: 0.12, y: 1.90, z: 0.75, r: 0.48 },
    { x: -0.12, y: 1.92, z: -0.72, r: 0.48 },
    // Mid tier voluminous canopy
    { x: 0.52, y: 2.32, z: 0.32, r: 0.68 },
    { x: -0.48, y: 2.36, z: 0.28, r: 0.68 },
    { x: 0.42, y: 2.40, z: -0.42, r: 0.68 },
    { x: -0.42, y: 2.38, z: -0.38, r: 0.68 },
    { x: 0.0, y: 2.45, z: 0.0, r: 0.72 },
    // Upper crown and apex cloud
    { x: 0.22, y: 2.85, z: 0.14, r: 0.55 },
    { x: -0.22, y: 2.90, z: -0.14, r: 0.55 },
    { x: 0.0, y: 3.25, z: 0.0, r: 0.42 }
  ];

  // Dark Theme Palette: Lavender -> Purple -> Violet with subtle Pink highlights
  const darkCanopy = {
    deepViolet: new THREE.Color(0x7c3aed),      // #7C3AED
    royalPurple: new THREE.Color(0x9333ea),     // #9333EA
    radiantLavender: new THREE.Color(0xc084fc), // #C084FC
    softLavender: new THREE.Color(0xd8b4fe),    // #D8B4FE
    subtlePink: new THREE.Color(0xf472b6),      // #F472B6
    blushPink: new THREE.Color(0xec4899),       // #EC4899
    apexGlow: new THREE.Color(0xe9d5ff),        // #E9D5FF
    shadowPlum: new THREE.Color(0x581c87)       // #581C87
  };

  // Light Theme Palette: Soft lavender, violet, pink, and muted purple foliage
  const lightCanopy = {
    softLavender: new THREE.Color(0xc084fc),    // #C084FC
    pastelLavender: new THREE.Color(0xd8b4fe),  // #D8B4FE
    vividViolet: new THREE.Color(0xa855f7),     // #A855F7
    blushPink: new THREE.Color(0xf472b6),       // #F472B6
    pastelRose: new THREE.Color(0xf9a8d4),      // #F9A8D4
    mutedPurple: new THREE.Color(0x8b5cf6),     // #8B5CF6
    crownHighlight: new THREE.Color(0xede9fe),  // #EDE9FE
    shadowLilac: new THREE.Color(0x6d28d9)      // #6D28D9
  };

  for (let i = 0; i < 892; i++) {
    const c = clusterCenters[i % clusterCenters.length];
    const u = rand();
    const theta = rand() * Math.PI * 2;
    const phi = (rand() - 0.5) * Math.PI;
    const rad = Math.pow(u, 0.45) * c.r;
    const lx = c.x + rad * Math.cos(phi) * Math.cos(theta) + (rand() - 0.5) * 0.06;
    const ly = c.y + rad * Math.sin(phi) * 0.88 + (rand() - 0.5) * 0.06;
    const lz = c.z + rad * Math.cos(phi) * Math.sin(theta) + (rand() - 0.5) * 0.06;

    let col;
    if (isDark) {
      if (ly < 2.05 || rad < 0.22) {
        col = rand() > 0.4 ? darkCanopy.shadowPlum : darkCanopy.deepViolet;
      } else if (ly > 3.0) {
        col = rand() > 0.35 ? darkCanopy.apexGlow : darkCanopy.softLavender;
      } else {
        const p = rand();
        if (p < 0.28) col = darkCanopy.radiantLavender;
        else if (p < 0.52) col = darkCanopy.royalPurple;
        else if (p < 0.72) col = darkCanopy.deepViolet;
        else if (p < 0.88) col = darkCanopy.subtlePink;
        else col = darkCanopy.blushPink;
      }
    } else {
      if (ly < 2.05 || rad < 0.22) {
        col = rand() > 0.4 ? lightCanopy.shadowLilac : lightCanopy.mutedPurple;
      } else if (ly > 3.0) {
        col = rand() > 0.35 ? lightCanopy.crownHighlight : lightCanopy.pastelLavender;
      } else {
        const p = rand();
        if (p < 0.30) col = lightCanopy.softLavender;
        else if (p < 0.54) col = lightCanopy.vividViolet;
        else if (p < 0.74) col = lightCanopy.blushPink;
        else if (p < 0.88) col = lightCanopy.mutedPurple;
        else col = lightCanopy.pastelRose;
      }
    }

    const s = 0.102 + rand() * 0.022;
    treeVoxels.push({
      type: 'canopy',
      x: lx, y: ly, z: lz,
      sx: s, sy: s, sz: s,
      color: col.clone(),
      rotX: 0,
      rotY: (rand() - 0.5) * 0.2,
      rotZ: 0
    });
  }

  // Sort QR voxels so lower/central modules form roots/trunk, and upper modules form canopy
  qrVoxels.sort((a, b) => a.y - b.y || a.x - b.x);

  // Precomputed gentle flight curvature for organic 3D dispersal
  let cSeed = 12345;
  function randC() {
    cSeed = (cSeed * 9301 + 49297) % 233280;
    return cSeed / 233280;
  }
  const flightCurvatures = new Float32Array(TOTAL_VOXELS * 3);
  for (let i = 0; i < TOTAL_VOXELS; i++) {
    flightCurvatures[i * 3 + 0] = (randC() - 0.5) * 0.22;
    flightCurvatures[i * 3 + 1] = (randC() - 0.25) * 0.28;
    flightCurvatures[i * 3 + 2] = (randC() - 0.5) * 0.22;
  }

  // Precalculated organic wave stagger offsets for each voxel [0.0 to 0.22]
  // Produces an organic blossoming effect rather than a simultaneous block jump
  const staggerOffsets = new Float32Array(TOTAL_VOXELS);
  for (let i = 0; i < TOTAL_VOXELS; i++) {
    const tV = treeVoxels[i];
    if (tV.type === 'root') {
      staggerOffsets[i] = (i / 100) * 0.04;
    } else if (tV.type === 'trunk') {
      staggerOffsets[i] = 0.03 + Math.max(0, Math.min(1, (tV.y - 0.18) / 1.15)) * 0.05;
    } else if (tV.type === 'branch') {
      staggerOffsets[i] = 0.07 + Math.max(0, Math.min(1, (tV.y - 1.25) / 1.4)) * 0.06;
    } else {
      const distFromCenter = Math.sqrt(tV.x * tV.x + tV.z * tV.z) / 1.2;
      const heightNorm = Math.max(0, Math.min(1, (tV.y - 1.8) / 1.5));
      staggerOffsets[i] = 0.10 + Math.min(0.12, heightNorm * 0.06 + distFromCenter * 0.06);
    }
  }

  return {
    totalCount: TOTAL_VOXELS,
    qrVoxels,
    treeVoxels,
    flightCurvatures,
    staggerOffsets
  };
}

/**
 * Calculates adaptive camera framing and positioning to ensure the complete
 * 3D object fits comfortably inside the visible viewport with safe padding.
 */
function getFramingParameters(width, height) {
  const aspect = width > 0 && height > 0 ? width / height : 1.0;
  const targetY = 1.25;
  const target = new THREE.Vector3(0, targetY, 0);

  const fov = 34;
  const aspectFactor = Math.min(1.0, aspect);
  const treeDist = 9.9 / aspectFactor;
  const qrDist = 5.3 / aspectFactor;

  const elTree = 25 * (Math.PI / 180);
  const azTree = Math.PI / 4;

  const camTreeX = treeDist * Math.sin(azTree) * Math.cos(elTree);
  const camTreeY = targetY + treeDist * Math.sin(elTree);
  const camTreeZ = treeDist * Math.cos(azTree) * Math.cos(elTree);
  const camTree = new THREE.Vector3(camTreeX, camTreeY, camTreeZ);

  const camQR = new THREE.Vector3(0, targetY, qrDist);

  return {
    fov,
    aspect,
    targetY,
    target,
    treeDist,
    qrDist,
    elTree,
    azTree,
    camTree,
    camQR
  };
}

export default function MagicTreeQR({ url = PORTFOLIO_URL } = {}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const targetUrl = url || PORTFOLIO_URL;

  // Initial state is strictly 'qr'
  const [activeState, setActiveState] = useState('qr'); // 'qr' | 'tree'
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeStateRef = useRef(activeState);
  activeStateRef.current = activeState;

  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Compute dual-state voxel coordinate tables when URL or theme changes
  const voxelData = useMemo(() => buildVoxelMatrix(targetUrl, isDark), [targetUrl, isDark]);

  const lastToggleTimeRef = useRef(0);
  const transitionTriggerRef = useRef(null);

  // Toggle handler with synchronous lock and timestamp debounce to prevent double-firing
  const handleToggle = useCallback(() => {
    const now = performance.now();
    if (isTransitioningRef.current || now - lastToggleTimeRef.current < 350) return;
    lastToggleTimeRef.current = now;
    isTransitioningRef.current = true;

    const nextState = activeStateRef.current === 'qr' ? 'tree' : 'qr';
    activeStateRef.current = nextState;
    setIsTransitioning(true);

    if (nextState === 'tree') {
      setActiveState('tree');
    }

    if (transitionTriggerRef.current) {
      transitionTriggerRef.current(nextState, () => {
        setActiveState(nextState);
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      });
    } else {
      setActiveState(nextState);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }
  }, []);

  // WebGL 3D Voxel Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animFrameId;
    let isDisposed = false;
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    // Detect user accessibility reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. Scene & High-Precision Renderer ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    let framing = getFramingParameters(width, height);

    const camera = new THREE.PerspectiveCamera(framing.fov, framing.aspect, 0.1, 50);
    const initCamPos = activeStateRef.current === 'tree' ? framing.camTree : framing.camQR;
    camera.position.copy(initCamPos);
    camera.lookAt(framing.target);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- 2. Clean Natural Lighting with Lavender/Purple Ambiance ---
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0xede9fe : 0xffffff,
      isDark ? 1.25 : 1.40
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      isDark ? 0xf5d0fe : 0xfff8ee,
      isDark ? 1.85 : 1.70
    );
    sunLight.position.set(5.2, 8.8, 4.4);
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(
      isDark ? 0xc084fc : 0xe9d5ff,
      isDark ? 0.65 : 0.55
    );
    skyFill.position.set(-4.5, 3.5, -4.5);
    scene.add(skyFill);

    const groundBounce = new THREE.DirectionalLight(
      isDark ? 0x3b1d38 : 0xd8b4fe,
      0.35
    );
    groundBounce.position.set(0, -2.5, 0);
    scene.add(groundBounce);

    // --- 3. Scene Groups ---
    const sceneMaster = new THREE.Group();
    scene.add(sceneMaster);

    const treeSwayGroup = new THREE.Group();
    sceneMaster.add(treeSwayGroup);

    // --- 4. Ivory QR Backing Plate (Visible in QR state) ---
    const qrPlateGeo = new THREE.BoxGeometry(2.62, 2.62, 0.035);
    const qrPlateMat = new THREE.MeshStandardMaterial({
      color: 0xfcfaf6, // Warm ivory stone paver tone
      roughness: 0.9,
      metalness: 0.0
    });
    const qrPlateMesh = new THREE.Mesh(qrPlateGeo, qrPlateMat);
    qrPlateMesh.position.set(0, framing.targetY, -0.018);
    const initialPlateScale = activeStateRef.current === 'qr' ? 1.0 : 0.0001;
    qrPlateMesh.scale.setScalar(initialPlateScale);
    qrPlateMesh.visible = activeStateRef.current === 'qr';
    sceneMaster.add(qrPlateMesh);

    // --- 5. Isometric Ground Platform (Visible in Tree state) ---
    const platformGroup = new THREE.Group();
    platformGroup.rotation.y = Math.PI / 4; // 45-degree isometric alignment
    const initialPlatformScale = activeStateRef.current === 'tree' ? 1.0 : 0.0001;
    platformGroup.scale.setScalar(initialPlatformScale);
    platformGroup.visible = activeStateRef.current === 'tree';
    platformGroup.position.y = 0;
    sceneMaster.add(platformGroup);

    // A. Base Slab Base (Dark: dark navy/plum; Light: soft cream/lavender)
    const slabGeo = new THREE.BoxGeometry(3.3, 0.22, 3.3);
    const slabMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x180e26 : 0xeae2f0,
      roughness: 0.85,
      flatShading: true
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.y = -0.11;
    platformGroup.add(slabMesh);

    // B. Checkered Cobblestone Paver Patio (8x8 grid of 3D pavers)
    const paverGeo = new THREE.BoxGeometry(0.36, 0.035, 0.36);
    const paverMat = new THREE.MeshStandardMaterial({
      roughness: 0.78,
      flatShading: true
    });
    const PAVER_GRID = 8;
    const TOTAL_PAVERS = PAVER_GRID * PAVER_GRID;
    const paversMesh = new THREE.InstancedMesh(paverGeo, paverMat, TOTAL_PAVERS);
    const paverDummy = new THREE.Object3D();

    const paverColors = isDark ? [
      new THREE.Color(0x2c1a42),
      new THREE.Color(0x351f50),
      new THREE.Color(0x3d245c),
      new THREE.Color(0x251638)
    ] : [
      new THREE.Color(0xfaf5fd),
      new THREE.Color(0xf4ebf7),
      new THREE.Color(0xede0f2),
      new THREE.Color(0xf7f0fa)
    ];

    let pIdx = 0;
    const startOff = -((PAVER_GRID - 1) * 0.39) / 2;
    for (let r = 0; r < PAVER_GRID; r++) {
      for (let c = 0; c < PAVER_GRID; c++) {
        const px = startOff + c * 0.39;
        const pz = startOff + r * 0.39;
        const py = 0.018 + ((r + c) % 3 === 0 ? 0.005 : 0);

        paverDummy.position.set(px, py, pz);
        paverDummy.scale.set(0.96, 1.0, 0.96);
        paverDummy.updateMatrix();
        paversMesh.setMatrixAt(pIdx, paverDummy.matrix);

        const col = (r + c) % 2 === 0 ? paverColors[0] : paverColors[1 + ((r * 2 + c) % 3)];
        paversMesh.setColorAt(pIdx, col);
        pIdx++;
      }
    }
    paversMesh.instanceMatrix.needsUpdate = true;
    if (paversMesh.instanceColor) paversMesh.instanceColor.needsUpdate = true;
    platformGroup.add(paversMesh);

    // C. Grass / Violet Sprouts along all 4 outer edges
    const tuftGeo = new THREE.ConeGeometry(0.045, 0.16, 4);
    const tuftMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x8b5cf6 : 0xa855f7,
      roughness: 0.8,
      flatShading: true
    });
    const TUFT_COUNT = 72;
    const grassTufts = new THREE.InstancedMesh(tuftGeo, tuftMat, TUFT_COUNT);
    const tuftDummy = new THREE.Object3D();

    for (let i = 0; i < TUFT_COUNT; i++) {
      const edge = i % 4;
      const along = ((i / TUFT_COUNT) * 4 % 1 - 0.5) * 3.15;
      let tx = 0, tz = 0;
      if (edge === 0) { tx = 1.6 + (i % 3) * 0.03; tz = along; }
      else if (edge === 1) { tx = -1.6 - (i % 3) * 0.03; tz = along; }
      else if (edge === 2) { tx = along; tz = 1.6 + (i % 3) * 0.03; }
      else { tx = along; tz = -1.6 - (i % 3) * 0.03; }

      tuftDummy.position.set(tx, 0.08, tz);
      tuftDummy.rotation.set((i % 2 === 0 ? 0.12 : -0.12), (i * 0.8), 0);
      tuftDummy.scale.setScalar(0.8 + (i % 5) * 0.08);
      tuftDummy.updateMatrix();
      grassTufts.setMatrixAt(i, tuftDummy.matrix);
    }
    grassTufts.instanceMatrix.needsUpdate = true;
    platformGroup.add(grassTufts);

    // D. Scattered Lavender & Pink Petals on the patio
    const fallenPetalColors = isDark
      ? [0xc084fc, 0xf472b6, 0xd8b4fe, 0xec4899]
      : [0xd8b4fe, 0xf472b6, 0xc084fc, 0xf9a8d4];

    const fallenCoords = [
      { x: 0.35, z: 0.42, rot: 0.5, c: fallenPetalColors[0] },
      { x: -0.45, z: 0.38, rot: 1.4, c: fallenPetalColors[1] },
      { x: 0.55, z: -0.35, rot: 2.1, c: fallenPetalColors[2] },
      { x: -0.32, z: -0.55, rot: 0.9, c: fallenPetalColors[0] },
      { x: 0.22, z: 0.75, rot: 2.8, c: fallenPetalColors[3] },
      { x: -0.65, z: -0.15, rot: 1.7, c: fallenPetalColors[1] },
      { x: 0.65, z: 0.25, rot: 0.3, c: fallenPetalColors[2] },
      { x: -0.22, z: 0.65, rot: 3.1, c: fallenPetalColors[0] },
      { x: 0.48, z: -0.72, rot: 1.2, c: fallenPetalColors[1] },
      { x: -0.62, z: 0.68, rot: 2.5, c: fallenPetalColors[3] }
    ];

    const fallenLeafGeo = new THREE.PlaneGeometry(0.09, 0.07);
    fallenCoords.forEach(({ x, z, rot, c }) => {
      const flMat = new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.75,
        side: THREE.DoubleSide
      });
      const fl = new THREE.Mesh(fallenLeafGeo, flMat);
      fl.position.set(x, 0.045, z);
      fl.rotation.set(-Math.PI / 2, 0, rot);
      platformGroup.add(fl);
    });

    // --- 6. Drifting Falling Petals in 3D (Lavender & Blossom Pink) ---
    const fallingColors = isDark
      ? [0xc084fc, 0xf472b6, 0xe9d5ff, 0xd8b4fe]
      : [0xc084fc, 0xf472b6, 0xd8b4fe, 0xf9a8d4];

    const fallingLeafGeo = new THREE.PlaneGeometry(0.08, 0.06);
    const FALLING_COUNT = 12;
    const fallingLeaves = [];
    const isTreeInit = activeStateRef.current === 'tree';

    for (let i = 0; i < FALLING_COUNT; i++) {
      const flMat = new THREE.MeshStandardMaterial({
        color: fallingColors[i % fallingColors.length],
        roughness: 0.72,
        side: THREE.DoubleSide
      });
      const fl = new THREE.Mesh(fallingLeafGeo, flMat);
      fl.position.set(
        (Math.random() - 0.5) * 2.2,
        0.2 + Math.random() * 3.2,
        (Math.random() - 0.5) * 2.2
      );
      fl.visible = isTreeInit;
      fl.userData = {
        vy: 0.005 + Math.random() * 0.005,
        vRot: 0.015 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2
      };
      treeSwayGroup.add(fl);
      fallingLeaves.push(fl);
    }

    // --- 7. MASTER VOXEL SYSTEM: 1,312 INSTANCED CUBES ---
    const voxelGeo = new THREE.BoxGeometry(1, 1, 1);
    const voxelMat = new THREE.MeshStandardMaterial({
      roughness: 0.68,
      metalness: 0.06,
      flatShading: true
    });

    const TOTAL_COUNT = voxelData.totalCount; // 1,312
    const voxelsMesh = new THREE.InstancedMesh(voxelGeo, voxelMat, TOTAL_COUNT);

    // Pre-allocated object pool to prevent garbage collection spikes in animate()
    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();

    // Initialize all 1,312 voxel instances to initial state (QR or Tree)
    for (let i = 0; i < TOTAL_COUNT; i++) {
      const q = voxelData.qrVoxels[i];
      const t = voxelData.treeVoxels[i];

      if (isTreeInit) {
        dummy.position.set(t.x, t.y, t.z);
        dummy.rotation.set(t.rotX, t.rotY, t.rotZ);
        dummy.scale.set(t.sx, t.sy, t.sz);
        dummy.updateMatrix();
        voxelsMesh.setMatrixAt(i, dummy.matrix);
        voxelsMesh.setColorAt(i, t.color);
      } else {
        dummy.position.set(q.x, q.y, q.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(q.sx, q.sy, q.sz);
        dummy.updateMatrix();
        voxelsMesh.setMatrixAt(i, dummy.matrix);
        voxelsMesh.setColorAt(i, q.color);
      }
    }

    voxelsMesh.instanceMatrix.needsUpdate = true;
    if (voxelsMesh.instanceColor) voxelsMesh.instanceColor.needsUpdate = true;
    treeSwayGroup.add(voxelsMesh);

    // --- 8. Delta-Time Continuous Transition Engine ---
    let transition = {
      active: false,
      direction: null, // 'to-tree' | 'to-qr'
      elapsed: 0,
      duration: prefersReducedMotion ? 160 : 1350, // 1.35s duration for silky interpolation
      onComplete: null
    };

    const triggerTransition = (targetState, callback) => {
      transition.active = true;
      transition.direction = targetState === 'tree' ? 'to-tree' : 'to-qr';
      transition.elapsed = 0;
      transition.onComplete = callback;

      if (targetState === 'tree') {
        fallingLeaves.forEach(l => { l.visible = true; });
      }
    };

    transitionTriggerRef.current = triggerTransition;

    // --- 9. Interactive Parallax & Direct Tree Tapping ---
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();

    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;
    let isPointerDown = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let totalMoveDist = 0;
    let didDrag = false;

    const handlePointerDown = e => {
      isPointerDown = true;
      didDrag = false;
      totalMoveDist = 0;
      pointerStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      pointerStartY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      pointerStartTime = performance.now();
    };

    const handlePointerMove = e => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (isPointerDown) {
        const dx = clientX - pointerStartX;
        const dy = clientY - pointerStartY;
        totalMoveDist += Math.abs(dx) + Math.abs(dy);
        if (totalMoveDist > 8) {
          didDrag = true;
        }
        if (activeStateRef.current === 'tree') {
          targetRotY += dx * 0.012;
          targetRotX = Math.max(-0.25, Math.min(0.25, targetRotX + dy * 0.006));
        }
        pointerStartX = clientX;
        pointerStartY = clientY;
      } else if (activeStateRef.current === 'tree') {
        targetRotY = normX * 0.22;
        targetRotX = normY * 0.1;
      }
    };

    const handlePointerUp = e => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || pointerStartX;
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || pointerStartY;
      const elapsed = performance.now() - pointerStartTime;

      if (!didDrag && totalMoveDist < 8 && elapsed < 500) {
        const rect = container.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          if (activeStateRef.current === 'tree') {
            mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouseNDC.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
            raycaster.setFromCamera(mouseNDC, camera);
            handleToggle();
          } else {
            handleToggle();
          }
        }
      }
    };

    const handlePointerLeave = () => {
      isPointerDown = false;
      targetRotY = 0;
      targetRotX = 0;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    // --- 10. Resource Saving: Visibility & Intersection Observers ---
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0.02 });
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries[0] || isDisposed) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      if (newW > 0 && newH > 0) {
        framing = getFramingParameters(newW, newH);
        camera.aspect = framing.aspect;
        camera.fov = framing.fov;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);

        if (!transition.active) {
          const restingPos = activeStateRef.current === 'tree' ? framing.camTree : framing.camQR;
          camera.position.copy(restingPos);
          camera.lookAt(framing.target);
        }
      }
    });
    resizeObserver.observe(container);

    // --- 11. Render & Delta-Time Simulation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animFrameId = requestAnimationFrame(animate);

      // Skip render when off-screen or tab is hidden and not actively transitioning
      if ((!isIntersecting || !isTabVisible) && !transition.active) {
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05); // Cap delta to prevent jump on tab resume
      const elapsedTime = clock.getElapsedTime();

      // Handle continuous delta-time based transition interpolation
      if (transition.active) {
        transition.elapsed += delta * 1000;
        const rawProgress = Math.min(1.0, transition.elapsed / transition.duration);
        const globalEase = easeInOutCubic(rawProgress);

        const isToTree = transition.direction === 'to-tree';

        // Staggered per-voxel organic wave interpolation
        const { flightCurvatures, staggerOffsets } = voxelData;
        const maxStagger = 0.22;

        for (let i = 0; i < TOTAL_COUNT; i++) {
          const q = voxelData.qrVoxels[i];
          const tr = voxelData.treeVoxels[i];
          const delay = staggerOffsets[i];

          // Remap global progress to localized per-voxel progress [0, 1]
          const localProgress = Math.max(0, Math.min(1.0, (rawProgress - delay) / (1.0 - maxStagger)));
          const localEase = easeInOutCubic(localProgress);
          const t = isToTree ? localEase : (1.0 - localEase);

          // Smooth 3D flight arcs
          const arc = Math.sin(t * Math.PI);
          const px = q.x + (tr.x - q.x) * t + arc * flightCurvatures[i * 3 + 0];
          const py = q.y + (tr.y - q.y) * t + arc * flightCurvatures[i * 3 + 1];
          const pz = q.z + (tr.z - q.z) * t + arc * flightCurvatures[i * 3 + 2];

          // Scale interpolation with gentle mid-flight blossom expansion
          const pulse = 1.0 + 0.05 * arc;
          const sx = (q.sx + (tr.sx - q.sx) * t) * pulse;
          const sy = (q.sy + (tr.sy - q.sy) * t) * pulse;
          const sz = (q.sz + (tr.sz - q.sz) * t) * pulse;

          // Rotation tumble during dispersal
          const rx = tr.rotX * t + arc * 0.12;
          const ry = tr.rotY * t + arc * 0.20;
          const rz = tr.rotZ * t;

          dummy.position.set(px, py, pz);
          dummy.rotation.set(rx, ry, rz);
          dummy.scale.set(sx, sy, sz);
          dummy.updateMatrix();
          voxelsMesh.setMatrixAt(i, dummy.matrix);

          // Color interpolation
          tempColor.copy(q.color).lerp(tr.color, t);
          voxelsMesh.setColorAt(i, tempColor);
        }

        voxelsMesh.instanceMatrix.needsUpdate = true;
        if (voxelsMesh.instanceColor) voxelsMesh.instanceColor.needsUpdate = true;

        // Continuous Spherical Camera Orbit (Monotonic distance expansion, zero zoom-in)
        const camT = isToTree ? globalEase : (1.0 - globalEase);
        const az = framing.azTree * camT;
        const el = framing.elTree * camT;
        const dist = framing.qrDist + (framing.treeDist - framing.qrDist) * camT;
        camera.position.set(
          dist * Math.sin(az) * Math.cos(el),
          framing.targetY + dist * Math.sin(el),
          dist * Math.cos(az) * Math.cos(el)
        );
        camera.lookAt(framing.target);

        // Ground Platform & Backing Plate Interpolation
        platformGroup.scale.setScalar(Math.max(0.0001, camT));
        platformGroup.visible = camT > 0.01;

        const plateScale = Math.max(0.0001, 1.0 - camT);
        qrPlateMesh.scale.setScalar(plateScale);
        qrPlateMesh.visible = (1.0 - camT) > 0.01;

        if (rawProgress >= 1.0) {
          transition.active = false;
          if (!isToTree) {
            fallingLeaves.forEach(l => { l.visible = false; });
          }
          if (transition.onComplete) {
            transition.onComplete();
          }
        }
      } else {
        // Keep camera locked at resting framing when not in transition
        const restingPos = activeStateRef.current === 'tree' ? framing.camTree : framing.camQR;
        camera.position.copy(restingPos);
        camera.lookAt(framing.target);
      }

      // Live tree living simulation (sway, drifting petals, parallax)
      const isTreeCurrent = activeStateRef.current === 'tree';
      if (isTreeCurrent || transition.active) {
        if (!prefersReducedMotion) {
          // Natural foliage breeze sway
          treeSwayGroup.rotation.z = Math.sin(elapsedTime * 1.15) * 0.014;
          treeSwayGroup.rotation.x = Math.sin(elapsedTime * 0.85) * 0.010;

          // Falling lavender & pink petals
          fallingLeaves.forEach(leaf => {
            if (!leaf.visible) return;
            const ud = leaf.userData;
            leaf.position.y -= ud.vy * (delta * 60);
            leaf.position.x += Math.sin(elapsedTime * 1.4 + ud.phase) * 0.003;
            leaf.position.z += Math.cos(elapsedTime * 1.4 + ud.phase) * 0.003;
            leaf.rotation.x += ud.vRot * (delta * 60);
            leaf.rotation.y += ud.vRot * 0.8 * (delta * 60);

            if (leaf.position.y < 0.04) {
              leaf.position.y = 3.3 + Math.random() * 0.4;
              leaf.position.x = (Math.random() - 0.5) * 2.0;
              leaf.position.z = (Math.random() - 0.5) * 2.0;
            }
          });
        }

        // Smooth parallax damping
        currentRotY += (targetRotY - currentRotY) * (delta * 6.0);
        currentRotX += (targetRotX - currentRotX) * (delta * 6.0);
        sceneMaster.rotation.y = currentRotY;
        sceneMaster.rotation.x = currentRotX;
      } else {
        // Steady in QR mode for instantaneous optical scanning
        treeSwayGroup.rotation.set(0, 0, 0);
        sceneMaster.rotation.set(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 12. Cleanup & Disposal ---
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);

      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();

      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [handleToggle, isDark, voxelData]);

  return (
    <div className="magic-tree-widget-container">
      {/* 3D WebGL Canvas Stage */}
      <div
        ref={containerRef}
        className={`magic-tree-stage is-${activeState} ${isTransitioning ? 'is-transitioning' : ''}`}
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        title={activeState === 'qr' ? 'Click to bloom Magic Tree' : 'Click to assemble QR Code'}
        aria-label={
          activeState === 'qr'
            ? '3D Voxel QR Code for https://aleenar.in/ — Click to bloom Magic Tree'
            : '3D Lavender Voxel Magic Tree — Click to assemble QR Code'
        }
      >
        <div className="tree-animation-layer">
          <canvas ref={canvasRef} className="magic-tree-canvas" />
        </div>
      </div>
    </div>
  );
}
