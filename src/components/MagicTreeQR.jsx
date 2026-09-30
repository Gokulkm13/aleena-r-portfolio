import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import QRCode from 'qrcode';
import { useTheme } from '../context/ThemeContext';

const PORTFOLIO_URL = 'https://aleenar.in/';

/**
 * Procedurally generates the unified 3D voxel system.
 * The QR code and the dense 3D tree are two mathematical states of the EXACT same 1,312 voxels!
 */
function buildVoxelMatrix(url) {
  // 1. Generate standard QR matrix (Version 2, 25x25)
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
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
  const qrNavy = new THREE.Color(0x061426);     // Midnight corporate navy (high contrast)
  const qrEmerald = new THREE.Color(0x0a2215);  // Deep forest emerald for finder corners

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
          color: m.isBorder ? qrEmerald.clone() : qrNavy.clone(),
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
  // - Dense Golden Canopy: 892 voxels
  const treeVoxels = [];

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
      color: new THREE.Color(0x4a2a14),
      rotX: 0, rotY: angle, rotZ: 0
    });
  }

  // 2. TRUNK (140 voxels): Sturdy segmented trunk columns with horizontal bark bands
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
      color: isBand ? new THREE.Color(0x2d1609) : new THREE.Color(0x5a361c),
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
        color: new THREE.Color(0x523018),
        rotX: 0, rotY: 0, rotZ: 0
      });
    }
  });

  // 4. DENSE GOLDEN CANOPY (892 voxels): Rich multi-tier volumetric foliage clusters
  // Stepped cluster centers producing an organic, dense, billowing cloud of voxel masses
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

  // Authentic Ginkgo Golden Palette:
  // - Bright Gold: #FFCD1E
  // - Warm Amber Gold: #F5B400
  // - Yellow-Green Fresh Foliage: #A2C816
  // - Olive-Yellow Depth: #7A7010
  // - Sunlit Highlight: #FFE54C
  const foliagePalette = {
    brightGold: new THREE.Color(0xffcd1e),
    amberGold: new THREE.Color(0xf5b400),
    yellowGreen: new THREE.Color(0xa2c816),
    oliveYellow: new THREE.Color(0x7a7010),
    sunHighlight: new THREE.Color(0xffe54c)
  };

  for (let i = 0; i < 892; i++) {
    const c = clusterCenters[i % clusterCenters.length];
    const u = rand();
    const theta = rand() * Math.PI * 2;
    const phi = (rand() - 0.5) * Math.PI;
    // Bias radius inward for higher cluster core density
    const rad = Math.pow(u, 0.45) * c.r;
    const lx = c.x + rad * Math.cos(phi) * Math.cos(theta) + (rand() - 0.5) * 0.06;
    const ly = c.y + rad * Math.sin(phi) * 0.88 + (rand() - 0.5) * 0.06;
    const lz = c.z + rad * Math.cos(phi) * Math.sin(theta) + (rand() - 0.5) * 0.06;

    let col;
    if (ly < 2.05 || rad < 0.22) {
      col = rand() > 0.4 ? foliagePalette.oliveYellow : foliagePalette.amberGold;
    } else if (ly > 3.0) {
      col = rand() > 0.3 ? foliagePalette.sunHighlight : foliagePalette.brightGold;
    } else {
      const p = rand();
      if (p < 0.38) col = foliagePalette.brightGold;
      else if (p < 0.62) col = foliagePalette.amberGold;
      else if (p < 0.84) col = foliagePalette.yellowGreen;
      else col = foliagePalette.sunHighlight;
    }

    // Slightly increased voxel scale for lush interlocking volume
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

  // Sort QR voxels so that lower/central modules form roots/trunk, and upper modules form canopy
  qrVoxels.sort((a, b) => a.y - b.y || a.x - b.x);

  // Precomputed gentle flight curvature for each voxel to ensure organic digital dispersal without overflowing bounds
  let cSeed = 12345;
  function randC() {
    cSeed = (cSeed * 9301 + 49297) % 233280;
    return cSeed / 233280;
  }
  const flightCurvatures = new Float32Array(TOTAL_VOXELS * 3);
  for (let i = 0; i < TOTAL_VOXELS; i++) {
    flightCurvatures[i * 3 + 0] = (randC() - 0.5) * 0.20; // gentle dx
    flightCurvatures[i * 3 + 1] = (randC() - 0.3) * 0.25; // gentle dy
    flightCurvatures[i * 3 + 2] = (randC() - 0.5) * 0.20; // gentle dz
  }

  return {
    totalCount: TOTAL_VOXELS,
    qrVoxels,
    treeVoxels,
    flightCurvatures
  };
}

/**
 * Calculates adaptive camera framing and positioning to ensure the complete
 * 3D object (canopy, trunk, roots, square ground patio base, and floating leaves)
 * fits comfortably inside the visible viewport with 18–20% safe padding at all times.
 */
function getFramingParameters(width, height) {
  const aspect = width > 0 && height > 0 ? width / height : 1.0;
  const targetY = 1.25;
  const target = new THREE.Vector3(0, targetY, 0);

  // Maintain consistent horizontal/vertical framing across desktop & mobile
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

export default function MagicTreeQR() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Initial state is strictly 'qr'
  const [activeState, setActiveState] = useState('qr'); // 'qr' | 'tree'
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeStateRef = useRef(activeState);
  activeStateRef.current = activeState;

  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Compute dual-state voxel coordinate tables once
  const voxelData = useMemo(() => buildVoxelMatrix(PORTFOLIO_URL), []);

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
      // Hide button immediately when entering tree state
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

    // --- 1. Scene & High-Precision Renderer ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // Dynamic adaptive camera framing based on bounding box
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- 2. Clean Natural Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfffcf2, isDark ? 1.15 : 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d6, 1.75);
    sunLight.position.set(5.2, 8.8, 4.4);
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xdbe9f6, 0.5);
    skyFill.position.set(-4.5, 3.5, -4.5);
    scene.add(skyFill);

    const groundBounce = new THREE.DirectionalLight(0x756040, 0.3);
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

    // A. Clean Slate Stone Slab Base (vertical cut sides)
    const slabGeo = new THREE.BoxGeometry(3.3, 0.22, 3.3);
    const slabMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x242830 : 0x484d58,
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
      new THREE.Color(0xb2aca1),
      new THREE.Color(0x958f84),
      new THREE.Color(0xc4bfb5),
      new THREE.Color(0x827d73)
    ] : [
      new THREE.Color(0xebe6de),
      new THREE.Color(0xded8ce),
      new THREE.Color(0xf6f2eb),
      new THREE.Color(0xd0cac0)
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

    // C. Grass Fringe along all 4 outer edges
    const tuftGeo = new THREE.ConeGeometry(0.045, 0.16, 4);
    const tuftMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x48793b : 0x5b934c,
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

    // D. Scattered Golden Leaf Flakes on the patio
    const fallenLeafGeo = new THREE.PlaneGeometry(0.09, 0.07);
    const fallenLeafMat = new THREE.MeshStandardMaterial({
      color: 0xf5b814,
      roughness: 0.75,
      side: THREE.DoubleSide
    });
    const fallenCoords = [
      { x: 0.35, z: 0.42, rot: 0.5 },
      { x: -0.45, z: 0.38, rot: 1.4 },
      { x: 0.55, z: -0.35, rot: 2.1 },
      { x: -0.32, z: -0.55, rot: 0.9 },
      { x: 0.22, z: 0.75, rot: 2.8 },
      { x: -0.65, z: -0.15, rot: 1.7 },
      { x: 0.65, z: 0.25, rot: 0.3 },
      { x: -0.22, z: 0.65, rot: 3.1 },
      { x: 0.48, z: -0.72, rot: 1.2 },
      { x: -0.62, z: 0.68, rot: 2.5 }
    ];
    fallenCoords.forEach(({ x, z, rot }) => {
      const fl = new THREE.Mesh(fallenLeafGeo, fallenLeafMat);
      fl.position.set(x, 0.045, z);
      fl.rotation.set(-Math.PI / 2, 0, rot);
      platformGroup.add(fl);
    });

    // --- 6. Drifting Falling Golden Leaves in 3D (Strictly hidden in QR mode!) ---
    const fallingLeafGeo = new THREE.PlaneGeometry(0.08, 0.06);
    const fallingLeafMat = new THREE.MeshStandardMaterial({
      color: 0xffd026,
      roughness: 0.72,
      side: THREE.DoubleSide
    });
    const FALLING_COUNT = 12;
    const fallingLeaves = [];
    const isTreeInit = activeStateRef.current === 'tree';

    for (let i = 0; i < FALLING_COUNT; i++) {
      const fl = new THREE.Mesh(fallingLeafGeo, fallingLeafMat);
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

    // --- 7. THE MASTER VOXEL SYSTEM: 1,312 INSTANCED CUBES ---
    const voxelGeo = new THREE.BoxGeometry(1, 1, 1);
    const voxelMat = new THREE.MeshStandardMaterial({
      roughness: 0.72,
      metalness: 0.04,
      flatShading: true
    });

    const TOTAL_COUNT = voxelData.totalCount; // 1,312
    const voxelsMesh = new THREE.InstancedMesh(voxelGeo, voxelMat, TOTAL_COUNT);
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

    // --- 8. Smooth Bidirectional Transition Engine (850ms) ---
    let transition = {
      active: false,
      direction: null, // 'to-tree' | 'to-qr'
      startTime: 0,
      duration: 850,
      onComplete: null
    };

    const triggerTransition = (targetState, callback) => {
      transition.active = true;
      transition.direction = targetState === 'tree' ? 'to-tree' : 'to-qr';
      transition.startTime = performance.now();
      transition.onComplete = callback;

      if (targetState === 'tree') {
        fallingLeaves.forEach(l => { l.visible = true; });
      }
    };

    transitionTriggerRef.current = triggerTransition;

    // --- 9. Interactive Parallax, 3D Raycasting & Direct Tree Tapping ---
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
        // Subtle hover parallax in tree state
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

      // Detect tap vs drag (small movement < 8px and tap duration < 500ms)
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
            // Clicked directly on tree or within stage framing the tree
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

    // --- 10. Resize Observer ---
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

    // --- 11. Render & Simulation Loop ---
    let clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Handle active transition interpolation
      if (transition.active) {
        const elapsed = performance.now() - transition.startTime;
        const rawProgress = Math.min(1.0, elapsed / transition.duration);

        // Smooth cubic easing
        const ease = rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        const isToTree = transition.direction === 'to-tree';
        const t = isToTree ? ease : 1.0 - ease;

        // A. Continuous Spherical Camera Orbit (Monotonic distance expansion, zero zoom-in)
        const az = framing.azTree * t;
        const el = framing.elTree * t;
        const dist = framing.qrDist + (framing.treeDist - framing.qrDist) * t;
        camera.position.set(
          dist * Math.sin(az) * Math.cos(el),
          framing.targetY + dist * Math.sin(el),
          dist * Math.cos(az) * Math.cos(el)
        );
        camera.lookAt(framing.target);

        // B. Ground Platform & Backing Plate Interpolation
        platformGroup.scale.setScalar(Math.max(0.0001, t));
        platformGroup.visible = t > 0.01;

        const plateScale = Math.max(0.0001, 1 - t);
        qrPlateMesh.scale.setScalar(plateScale);
        qrPlateMesh.visible = (1 - t) > 0.01;

        // C. Interpolate all 1,312 Voxels along 3D Arcs
        const arc = Math.sin(t * Math.PI);
        const { flightCurvatures } = voxelData;

        for (let i = 0; i < TOTAL_COUNT; i++) {
          const q = voxelData.qrVoxels[i];
          const tr = voxelData.treeVoxels[i];

          const px = q.x + (tr.x - q.x) * t + arc * flightCurvatures[i * 3 + 0];
          const py = q.y + (tr.y - q.y) * t + arc * flightCurvatures[i * 3 + 1];
          const pz = q.z + (tr.z - q.z) * t + arc * flightCurvatures[i * 3 + 2];

          // Scale transition
          const sx = q.sx + (tr.sx - q.sx) * t;
          const sy = q.sy + (tr.sy - q.sy) * t;
          const sz = q.sz + (tr.sz - q.sz) * t;

          // Rotation tumble during flight
          const rx = tr.rotX * t + Math.sin(t * Math.PI) * 0.15;
          const ry = tr.rotY * t + Math.sin(t * Math.PI) * 0.25;
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

      // Live tree living simulation (sway, drifting leaves, parallax)
      const isTreeCurrent = activeStateRef.current === 'tree';
      if (isTreeCurrent || transition.active) {
        // Natural foliage breeze sway
        treeSwayGroup.rotation.z = Math.sin(elapsedTime * 1.25) * 0.015;
        treeSwayGroup.rotation.x = Math.sin(elapsedTime * 0.9) * 0.012;

        // Falling golden leaves
        fallingLeaves.forEach(leaf => {
          if (!leaf.visible) return;
          const ud = leaf.userData;
          leaf.position.y -= ud.vy;
          leaf.position.x += Math.sin(elapsedTime * 1.5 + ud.phase) * 0.003;
          leaf.position.z += Math.cos(elapsedTime * 1.5 + ud.phase) * 0.003;
          leaf.rotation.x += ud.vRot;
          leaf.rotation.y += ud.vRot * 0.8;

          if (leaf.position.y < 0.04) {
            leaf.position.y = 3.3 + Math.random() * 0.4;
            leaf.position.x = (Math.random() - 0.5) * 2.0;
            leaf.position.z = (Math.random() - 0.5) * 2.0;
          }
        });

        // Parallax damping
        currentRotY += (targetRotY - currentRotY) * 0.08;
        currentRotX += (targetRotX - currentRotX) * 0.08;
        sceneMaster.rotation.y = currentRotY;
        sceneMaster.rotation.x = currentRotX;
      } else {
        // Keep dead steady in QR mode for 100% optical scannability
        treeSwayGroup.rotation.set(0, 0, 0);
        sceneMaster.rotation.set(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 12. Cleanup & Deep Disposal ---
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);

      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
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
        title={activeState === 'qr' ? 'Interactive 3D QR Code' : 'Interactive 3D Magic Tree'}
        aria-label={
          activeState === 'qr'
            ? '3D Voxel QR Code for https://aleenar.in/'
            : '3D Golden Voxel Magic Tree'
        }
      >
        <div className="tree-animation-layer">
          <canvas ref={canvasRef} className="magic-tree-canvas" />
        </div>
      </div>
    </div>
  );
}
