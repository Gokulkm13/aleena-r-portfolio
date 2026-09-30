import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Interactive Real 3D Physical Lanyard Badge Component
 * Features seamless 360-degree rotation of the entire ID badge (Front: Executive Premium / Back: Minimal Professional)
 * with realistic physical thickness, hardware participation, inertia, touch dragging, and natural settling.
 */
export default function Lanyard({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const attachListenerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, High-Precision Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);

    // Responsive Viewport & Centering Configuration
    let baseRestX = 0.12;
    let baseRestY = -0.36;
    let baseRestZ = 0;
    let targetRestAngleZ = -0.08;
    let targetRestAngleY = 0.08;

    const strapTopLeft = new THREE.Vector3(-0.65, 2.75, -0.15);
    const strapTopRight = new THREE.Vector3(0.65, 2.75, -0.05);

    function updateResponsiveConfig(w) {
      const isMobile = w < 768;
      if (isMobile) {
        camera.fov = 42;
        camera.position.set(0, 0.35, 5.8);
        baseRestX = 0;
        baseRestY = -0.28;
        targetRestAngleZ = 0;
        targetRestAngleY = 0.03;
        strapTopLeft.set(-0.65, 2.90, -0.15);
        strapTopRight.set(0.65, 2.90, -0.05);
      } else {
        camera.fov = 38;
        camera.position.set(0.08, 0.40, 5.4);
        baseRestX = 0.12;
        baseRestY = -0.36;
        targetRestAngleZ = -0.08;
        targetRestAngleY = 0.08;
        strapTopLeft.set(-0.65, 2.75, -0.15);
        strapTopRight.set(0.65, 2.75, -0.05);
      }
    }

    updateResponsiveConfig(width);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    // High-DPI support: up to 3x for Retina/4K displays
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 2. Crisp Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    keyLight.position.set(2.8, 4.5, 4.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc5a880, 1.5);
    fillLight.position.set(-3.2, -1.0, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.0, 15);
    rimLight.position.set(1.5, 3.0, -2.5);
    scene.add(rimLight);

    // Helper function to draw the exact S&O Maritime Emblem
    function drawSOLogo(ctx, cx, cy, r, onDark = true) {
      ctx.save();
      ctx.translate(cx, cy);

      // Upper Wave (Maritime Blue #0072ce)
      ctx.fillStyle = '#0072ce';
      ctx.beginPath();
      // Outer arc sweeping along top-right circumference
      ctx.arc(0, 0, r, -Math.PI * 0.85, Math.PI * 0.22, false);
      // Dynamic inner contour sweeping down towards center and tapering into lower-left tail
      ctx.bezierCurveTo(r * 0.70, r * 0.50, r * 0.20, r * 0.42, -r * 0.12, r * 0.18);
      ctx.bezierCurveTo(r * 0.14, -r * 0.15, r * 0.30, -r * 0.52, -r * 0.12, -r * 0.85);
      ctx.closePath();
      ctx.fill();

      // Lower Wave (Vibrant Orange #f26522)
      ctx.fillStyle = '#f26522';
      ctx.beginPath();
      // Outer arc sweeping along bottom-left circumference
      ctx.arc(0, 0, r, Math.PI * 0.15, -Math.PI * 0.78, false);
      // Dynamic inner contour sweeping up towards center and tapering into upper-right tail
      ctx.bezierCurveTo(-r * 0.70, -r * 0.50, -r * 0.20, -r * 0.42, r * 0.12, -r * 0.18);
      ctx.bezierCurveTo(-r * 0.14, r * 0.15, -r * 0.30, r * 0.52, 0.12, r * 0.85);
      ctx.closePath();
      ctx.fill();

      // Crisp White Wave Separator Contour
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = r * 0.11;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.80, -r * 0.10);
      ctx.bezierCurveTo(-r * 0.25, r * 0.52, r * 0.25, -r * 0.52, r * 0.80, 0.10);
      ctx.stroke();

      ctx.restore();
    }

    // 3. Ultra High-Resolution S&O Maritime Dual Strap Texture (512 x 4096)
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 512;
    strapCanvas.height = 4096;
    const sCtx = strapCanvas.getContext('2d');
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';

    // Rich Corporate Maritime Navy Blue Base
    sCtx.fillStyle = '#0a223f';
    sCtx.fillRect(0, 0, 512, 4096);

    // Fine Woven Polyester Grosgrain Micro-Ribbing
    for (let y = 0; y < 4096; y += 6) {
      sCtx.fillStyle = y % 12 === 0 ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.22)';
      sCtx.fillRect(0, y, 512, 3);
    }

    // Selvage Edge Weave Lines
    sCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    sCtx.fillRect(0, 0, 14, 4096);
    sCtx.fillRect(498, 0, 14, 4096);
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    sCtx.fillRect(14, 0, 4, 4096);
    sCtx.fillRect(494, 0, 4, 4096);

    // Draw Repeating S&O Maritime Branding Cycles along Strap Length
    for (let offset = 0; offset < 4096; offset += 2048) {
      // Top S&O Logo
      drawSOLogo(sCtx, 256, offset + 140, 80, true);

      // S&O (Bold Serif, Pure White)
      sCtx.fillStyle = '#ffffff';
      sCtx.font = '800 68px "Playfair Display", "Cinzel", "Georgia", serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.letterSpacing = '4px';
      sCtx.fillText('S&O', 256, offset + 285);

      // MARITIME (Bold Sans-Serif, Spaced)
      sCtx.font = '800 36px "Plus Jakarta Sans", sans-serif';
      sCtx.letterSpacing = '14px';
      sCtx.fillText('MARITIME', 256, offset + 360);

      // Vibrant Orange Accent Divider Bar
      sCtx.fillStyle = '#f26522';
      sCtx.beginPath();
      sCtx.roundRect(256 - 75, offset + 408, 150, 8, [4]);
      sCtx.fill();

      // Corporate Motto along Strap Length (Rotated 90 deg, reading top-to-bottom)
      sCtx.save();
      sCtx.translate(256, offset + 1040);
      sCtx.rotate(Math.PI / 2);
      sCtx.fillStyle = '#ffffff';
      sCtx.font = '700 28px "Plus Jakarta Sans", sans-serif';
      sCtx.letterSpacing = '6px';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText('PEOPLE | IDEAS | CULTURE | GROWTH', 0, 0);
      sCtx.restore();

      // Lower S&O Logo before junction
      drawSOLogo(sCtx, 256, offset + 1750, 75, true);
    }

    // Reverse Side Texture (Matching "BACK VIEW" White Ribbon in Brand Specification)
    const strapBackCanvas = document.createElement('canvas');
    strapBackCanvas.width = 512;
    strapBackCanvas.height = 4096;
    const sbCtx = strapBackCanvas.getContext('2d');
    sbCtx.imageSmoothingEnabled = true;
    sbCtx.imageSmoothingQuality = 'high';

    sbCtx.fillStyle = '#f8f9fc';
    sbCtx.fillRect(0, 0, 512, 4096);

    for (let y = 0; y < 4096; y += 6) {
      sbCtx.fillStyle = y % 12 === 0 ? 'rgba(0, 0, 0, 0.035)' : 'rgba(0, 0, 0, 0.015)';
      sbCtx.fillRect(0, y, 512, 3);
    }

    sbCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    sbCtx.fillRect(0, 0, 14, 4096);
    sbCtx.fillRect(498, 0, 14, 4096);

    for (let offset = 0; offset < 4096; offset += 2048) {
      drawSOLogo(sbCtx, 256, offset + 140, 80, false);

      sbCtx.fillStyle = '#0a223f';
      sbCtx.font = '800 68px "Playfair Display", "Cinzel", "Georgia", serif';
      sbCtx.textAlign = 'center';
      sbCtx.textBaseline = 'middle';
      sbCtx.letterSpacing = '4px';
      sbCtx.fillText('S&O', 256, offset + 285);

      sbCtx.font = '800 36px "Plus Jakarta Sans", sans-serif';
      sbCtx.letterSpacing = '14px';
      sbCtx.fillText('MARITIME', 256, offset + 360);

      sbCtx.fillStyle = '#f26522';
      sbCtx.beginPath();
      sbCtx.roundRect(256 - 75, offset + 408, 150, 8, [4]);
      sbCtx.fill();

      sbCtx.save();
      sbCtx.translate(256, offset + 1040);
      sbCtx.rotate(Math.PI / 2);
      sbCtx.fillStyle = '#0a223f';
      sbCtx.font = '700 28px "Plus Jakarta Sans", sans-serif';
      sbCtx.letterSpacing = '6px';
      sbCtx.textAlign = 'center';
      sbCtx.textBaseline = 'middle';
      sbCtx.fillText('PEOPLE | IDEAS | CULTURE | GROWTH', 0, 0);
      sbCtx.restore();

      drawSOLogo(sbCtx, 256, offset + 1750, 75, false);
    }

    // High-Res Texture for White Fabric Tab & Breakaway Buckle Connector (512 x 512)
    const whiteTabCanvas = document.createElement('canvas');
    whiteTabCanvas.width = 512;
    whiteTabCanvas.height = 512;
    const wtCtx = whiteTabCanvas.getContext('2d');
    wtCtx.imageSmoothingEnabled = true;
    wtCtx.imageSmoothingQuality = 'high';

    wtCtx.fillStyle = '#ffffff';
    wtCtx.fillRect(0, 0, 512, 512);

    for (let y = 0; y < 512; y += 6) {
      wtCtx.fillStyle = y % 12 === 0 ? 'rgba(0, 0, 0, 0.035)' : 'rgba(0, 0, 0, 0.015)';
      wtCtx.fillRect(0, y, 512, 3);
    }

    drawSOLogo(wtCtx, 256, 256, 145, false);

    const strapTexture = new THREE.CanvasTexture(strapCanvas);
    strapTexture.wrapS = THREE.RepeatWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    strapTexture.flipY = false;
    strapTexture.anisotropy = maxAnisotropy;
    strapTexture.colorSpace = THREE.SRGBColorSpace;

    const strapBackTexture = new THREE.CanvasTexture(strapBackCanvas);
    strapBackTexture.wrapS = THREE.RepeatWrapping;
    strapBackTexture.wrapT = THREE.RepeatWrapping;
    strapBackTexture.flipY = false;
    strapBackTexture.anisotropy = maxAnisotropy;
    strapBackTexture.colorSpace = THREE.SRGBColorSpace;

    const whiteTabTexture = new THREE.CanvasTexture(whiteTabCanvas);
    whiteTabTexture.anisotropy = maxAnisotropy;
    whiteTabTexture.colorSpace = THREE.SRGBColorSpace;

    const strapMaterial = new THREE.MeshStandardMaterial({
      map: strapTexture,
      roughness: 0.68,
      metalness: 0.08,
      side: THREE.FrontSide
    });

    const strapMaterialBack = new THREE.MeshStandardMaterial({
      map: strapBackTexture,
      roughness: 0.68,
      metalness: 0.08,
      side: THREE.BackSide
    });

    const whiteTabMaterial = new THREE.MeshStandardMaterial({
      map: whiteTabTexture,
      roughness: 0.65,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    // Dynamic Straps Meshes
    const leftStrapGeo = new THREE.BufferGeometry();
    const rightStrapGeo = new THREE.BufferGeometry();

    const leftStrapMesh = new THREE.Mesh(leftStrapGeo, strapMaterial);
    const rightStrapMesh = new THREE.Mesh(rightStrapGeo, strapMaterial);
    scene.add(leftStrapMesh);
    scene.add(rightStrapMesh);

    const leftStrapMeshBack = new THREE.Mesh(leftStrapGeo, strapMaterialBack);
    const rightStrapMeshBack = new THREE.Mesh(rightStrapGeo, strapMaterialBack);
    scene.add(leftStrapMeshBack);
    scene.add(rightStrapMeshBack);

    function updateStrapRibbon(geo, pStart, pEnd, widthVal, uvOffset = 0, twistAngle = 0) {
      const dir = new THREE.Vector3().subVectors(pEnd, pStart).normalize();
      const topNormal = new THREE.Vector3(0, 0, 1);
      const bottomNormal = new THREE.Vector3(Math.sin(twistAngle), 0, Math.cos(twistAngle));

      const segments = 18;
      const positions = [];
      const uvs = [];
      const indices = [];

      // Dynamic strap tension: when pulled down, distance increases and sag tautens realistically
      const currentDist = pStart.distanceTo(pEnd);
      const tensionFactor = THREE.MathUtils.clamp(2.9 / Math.max(currentDist, 0.1), 0.35, 1.25);

      for (let s = 0; s <= segments; s++) {
        const factor = s / segments;
        const sag = Math.sin(factor * Math.PI) * (0.045 * tensionFactor);
        const center = new THREE.Vector3().lerpVectors(pStart, pEnd, factor);
        center.z -= sag;

        // Smooth cubic Hermite interpolation for the ribbon normal as it approaches the twisted clasp
        const smoothT = factor * factor * (3 - 2 * factor);
        const curNormal = new THREE.Vector3().lerpVectors(topNormal, bottomNormal, smoothT).normalize();
        const binormal = new THREE.Vector3().crossVectors(dir, curNormal).normalize().multiplyScalar(widthVal);

        positions.push(
          center.x - binormal.x, center.y - binormal.y, center.z - binormal.z,
          center.x + binormal.x, center.y + binormal.y, center.z + binormal.z
        );

        // factor = 0 is top (shoulder), factor = 1 is bottom (entering clasp)
        const v = factor * 0.5 + uvOffset;
        uvs.push(0, v, 1, v);
      }

      for (let s = 0; s < segments; s++) {
        const a = s * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c, b, d, c);
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
    }

    // 4. Physical Breakaway Buckle & Swivel Lobster Snap Assembly
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e4ea,
      metalness: 0.95,
      roughness: 0.18
    });

    const plasticMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.55,
      metalness: 0.12
    });

    const plasticAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f1014,
      roughness: 0.65,
      metalness: 0.1
    });

    const claspGroup = new THREE.Group();

    // A. Silver Lobster Trigger Snap Hook (Through Punch Hole)
    const hookTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.075, 0.022, 16, 24, Math.PI * 1.55),
      metalMaterial
    );
    hookTorus.rotation.z = Math.PI / 4;
    hookTorus.position.set(0, 0.02, 0);
    claspGroup.add(hookTorus);

    const triggerLever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.07, 12),
      metalMaterial
    );
    triggerLever.position.set(0.045, 0.055, 0);
    triggerLever.rotation.z = -Math.PI / 4;
    claspGroup.add(triggerLever);

    const hookEyelet = new THREE.Mesh(
      new THREE.TorusGeometry(0.038, 0.016, 14, 20),
      metalMaterial
    );
    hookEyelet.position.set(0, 0.11, 0);
    claspGroup.add(hookEyelet);

    // B. Silver Precision Swivel Barrel
    const swivelBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 0.09, 20),
      metalMaterial
    );
    swivelBarrel.position.set(0, 0.18, 0);
    claspGroup.add(swivelBarrel);

    const swivelRingTop = new THREE.Mesh(
      new THREE.TorusGeometry(0.038, 0.010, 12, 18),
      metalMaterial
    );
    swivelRingTop.position.set(0, 0.22, 0);
    swivelRingTop.rotation.x = Math.PI / 2;
    claspGroup.add(swivelRingTop);

    const swivelRingBot = new THREE.Mesh(
      new THREE.TorusGeometry(0.038, 0.010, 12, 18),
      metalMaterial
    );
    swivelRingBot.position.set(0, 0.14, 0);
    swivelRingBot.rotation.x = Math.PI / 2;
    claspGroup.add(swivelRingBot);

    // C. Silver Flat Wire D-Ring / Loop
    const dRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.016, 14, 24),
      metalMaterial
    );
    dRing.position.set(0, 0.27, 0);
    dRing.scale.set(1.4, 0.55, 1.0);
    claspGroup.add(dRing);

    // D. Lower White Ribbon Tab (Loop holding D-ring to Buckle)
    const lowerWhiteTab = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.14, 0.022),
      whiteTabMaterial
    );
    lowerWhiteTab.position.set(0, 0.38, 0);
    claspGroup.add(lowerWhiteTab);

    // E. Black Plastic Quick-Release Buckle
    const buckleGroup = new THREE.Group();
    buckleGroup.position.set(0, 0.52, 0);

    const buckleBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.29, 0.15, 0.052),
      plasticMaterial
    );
    buckleGroup.add(buckleBody);

    const sideTabL = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.08, 0.046),
      plasticAccentMaterial
    );
    sideTabL.position.set(-0.155, 0, 0);
    buckleGroup.add(sideTabL);

    const sideTabR = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.08, 0.046),
      plasticAccentMaterial
    );
    sideTabR.position.set(0.155, 0, 0);
    buckleGroup.add(sideTabR);

    const latchGroove = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.012, 0.055),
      plasticAccentMaterial
    );
    buckleGroup.add(latchGroove);
    claspGroup.add(buckleGroup);

    // F. Upper White Chevron Tab (Triangular Junction where blue straps converge)
    const chevronGeo = new THREE.BufferGeometry();
    const cwB = 0.12;
    const cwT = 0.16;
    const ch = 0.14;
    const cd = 0.012;

    const chevronPos = [
      -cwB, 0, cd,   cwB, 0, cd,   -cwT, ch, cd,
       cwB, 0, cd,   cwT, ch, cd,  -cwT, ch, cd,
      -cwB, 0, -cd,  -cwT, ch, -cd,  cwB, 0, -cd,
       cwB, 0, -cd,  -cwT, ch, -cd,  cwT, ch, -cd,
      -cwB, 0, -cd,  -cwB, 0, cd,   -cwT, ch, cd,
      -cwB, 0, -cd,  -cwT, ch, cd,  -cwT, ch, -cd,
       cwB, 0, -cd,   cwT, ch, cd,   cwB, 0, cd,
       cwB, 0, -cd,   cwT, ch, -cd,  cwT, ch, cd,
      -cwT, ch, cd,   cwT, ch, cd,  -cwT, ch, -cd,
       cwT, ch, cd,   cwT, ch, -cd, -cwT, ch, -cd
    ];

    const chevronUVs = [
      0.2, 0,  0.8, 0,  0.1, 1,
      0.8, 0,  0.9, 1,  0.1, 1,
      0.2, 0,  0.1, 1,  0.8, 0,
      0.8, 0,  0.1, 1,  0.9, 1,
      0, 0, 0.1, 0, 0.1, 1,  0, 0, 0.1, 1, 0, 1,
      0.9, 0, 1, 1, 0.9, 1,  0.9, 0, 1, 0, 1, 1,
      0, 0, 1, 0, 0, 1,  1, 0, 1, 1, 0, 1
    ];

    chevronGeo.setAttribute('position', new THREE.Float32BufferAttribute(chevronPos, 3));
    chevronGeo.setAttribute('uv', new THREE.Float32BufferAttribute(chevronUVs, 2));
    chevronGeo.computeVertexNormals();

    const upperWhiteTab = new THREE.Mesh(chevronGeo, whiteTabMaterial);
    upperWhiteTab.position.set(0, 0.60, 0);
    claspGroup.add(upperWhiteTab);

    // 5. ULTRA HIGH-RESOLUTION CARD CANVAS TEXTURE (2400 x 3600)
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 2400;
    cardCanvas.height = 3600;
    const ctx = cardCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cardTexture = new THREE.CanvasTexture(cardCanvas);
    cardTexture.generateMipmaps = true;
    cardTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardTexture.magFilter = THREE.LinearFilter;
    cardTexture.anisotropy = maxAnisotropy;
    cardTexture.colorSpace = THREE.SRGBColorSpace;

    // Dedicated Back Face Texture for Authentic 3D Realism
    const cardBackCanvas = document.createElement('canvas');
    cardBackCanvas.width = 2400;
    cardBackCanvas.height = 3600;
    const bCtx = cardBackCanvas.getContext('2d');
    bCtx.imageSmoothingEnabled = true;
    bCtx.imageSmoothingQuality = 'high';

    const cardBackTexture = new THREE.CanvasTexture(cardBackCanvas);
    cardBackTexture.generateMipmaps = true;
    cardBackTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardBackTexture.magFilter = THREE.LinearFilter;
    cardBackTexture.anisotropy = maxAnisotropy;
    cardBackTexture.colorSpace = THREE.SRGBColorSpace;

    // Assets for Authentic Two-Sided Credential (Design 5: Executive Premium & Design 6: Minimal Professional)
    const frontBaseImg = new Image();
    frontBaseImg.crossOrigin = 'anonymous';
    frontBaseImg.src = `${import.meta.env.BASE_URL}assets/images/id_card_front_clean.png`;

    const backBaseImg = new Image();
    backBaseImg.crossOrigin = 'anonymous';
    backBaseImg.src = `${import.meta.env.BASE_URL}assets/images/id_card_back_clean.png`;


    // FRONT SIDE — DESIGN 5: EXECUTIVE PREMIUM
    function drawExactCard() {
      // 1. Deep Maritime Navy Blue Background
      ctx.fillStyle = '#06182e';
      ctx.fillRect(0, 0, 2400, 3600);

      // 2. Executive Premium Front Design (Exact S&O Logo, Aleena R Photo, Corporate Typography, Ship & Orange Accent)
      // Rendered exclusively once from authentic base artwork without any duplicate layers
      if (frontBaseImg.complete && frontBaseImg.naturalWidth > 0) {
        ctx.drawImage(frontBaseImg, 0, 0, 2400, 3600);
      }

      cardTexture.needsUpdate = true;
    }

    // BACK SIDE — DESIGN 6: MINIMAL PROFESSIONAL (ULTRA HIGH-RESOLUTION NATIVE TYPOGRAPHY & VECTORS)
    function drawExactCardBack() {
      // 1. Clean White / Light Card Face
      bCtx.fillStyle = '#f9fafc';
      bCtx.fillRect(0, 0, 2400, 3600);

      // 2. Base Artwork (S&O Logo, Tagline, QR Code & Ocean Waves)
      if (backBaseImg.complete && backBaseImg.naturalWidth > 0) {
        bCtx.drawImage(backBaseImg, 0, 0, 2400, 3600);
      }

      // Sample background color in the details area
      const bgSample = bCtx.getImageData(300, 1500, 1, 1).data;
      const bgColor = `rgb(${bgSample[0]}, ${bgSample[1]}, ${bgSample[2]})`;

      // Clear the details block across full card width
      bCtx.fillStyle = bgColor;
      bCtx.fillRect(100, 1120, 2200, 1180);

      const iconColor = '#01173e';
      const textColor = '#0a1634';
      const textStartX = 635;
      const iconCx = 396;

      // 1. Person Icon
      function drawPersonIcon(ctx, cx, cy) {
        ctx.save();
        ctx.fillStyle = iconColor;
        ctx.beginPath();
        ctx.arc(cx, cy - 24, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        const bw = 50;
        const by = cy + 8;
        ctx.moveTo(cx - bw, by + 32);
        ctx.bezierCurveTo(cx - bw, by + 8, cx - bw * 0.5, by, cx, by);
        ctx.bezierCurveTo(cx + bw * 0.5, by, cx + bw, by + 8, cx + bw, by + 32);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 2. Briefcase Icon
      function drawBriefcaseIcon(ctx, cx, cy) {
        ctx.save();
        ctx.fillStyle = iconColor;
        ctx.strokeStyle = iconColor;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy - 20);
        ctx.lineTo(cx - 24, cy - 42);
        ctx.bezierCurveTo(cx - 24, cy - 50, cx - 18, cy - 54, cx - 8, cy - 54);
        ctx.lineTo(cx + 8, cy - 54);
        ctx.bezierCurveTo(cx + 18, cy - 54, cx + 24, cy - 50, cx + 24, cy - 42);
        ctx.lineTo(cx + 24, cy - 20);
        ctx.stroke();

        const w = 124;
        const h = 78;
        const x = cx - w / 2;
        const y = cy - 20;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [12]);
        ctx.fill();

        ctx.fillStyle = bgColor;
        ctx.fillRect(x + 10, cy + 14, w - 20, 5);

        ctx.fillStyle = iconColor;
        ctx.beginPath();
        ctx.roundRect(cx - 10, cy + 8, 20, 18, [4]);
        ctx.fill();
        ctx.restore();
      }

      // 3. Building Icon (precisely centered at cx = 396)
      function drawBuildingIcon(ctx, cx, cy) {
        ctx.save();
        ctx.fillStyle = iconColor;
        const tw = 68;
        const th = 110;
        const tx = cx - 54;
        const ty = cy - th / 2;
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, th, [6, 6, 0, 0]);
        ctx.fill();

        ctx.fillStyle = bgColor;
        const winW = 10;
        const winH = 14;
        for (let r = 0; r < 3; r++) {
          const wy = ty + 18 + r * 28;
          ctx.fillRect(tx + 14, wy, winW, winH);
          ctx.fillRect(tx + 44, wy, winW, winH);
        }

        const aw = 34;
        const ah = 68;
        const ax = tx + tw + 6;
        const ay = ty + th - ah;
        ctx.beginPath();
        ctx.roundRect(ax, ay, aw, ah, [4, 4, 0, 0]);
        ctx.fill();

        ctx.fillStyle = bgColor;
        ctx.fillRect(ax + 12, ay + 14, winW, winH);
        ctx.fillRect(ax + 12, ay + 42, winW, winH);

        ctx.fillStyle = iconColor;
        ctx.fillRect(cx - 56, ty + th - 2, 112, 8);
        ctx.restore();
      }

      // 4. Pin Icon
      function drawPinIcon(ctx, cx, cy) {
        ctx.save();
        ctx.fillStyle = iconColor;
        const r = 36;
        const pinY = cy - 14;
        ctx.beginPath();
        ctx.arc(cx, pinY, r, Math.PI * 0.8, Math.PI * 0.2, false);
        ctx.lineTo(cx, pinY + 68);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(cx, pinY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Blood Drop Icon
      function drawBloodDropIcon(ctx, cx, cy) {
        ctx.save();
        ctx.fillStyle = iconColor;
        const dropW = 76;
        const dropH = 92;
        const topY = cy - dropH * 0.48;
        const bottomY = cy + dropH * 0.48;
        const waistY = cy + dropH * 0.12;

        ctx.beginPath();
        ctx.moveTo(cx, topY);
        ctx.bezierCurveTo(
          cx + dropW * 0.50, waistY - dropH * 0.15,
          cx + dropW * 0.52, bottomY,
          cx, bottomY
        );
        ctx.bezierCurveTo(
          cx - dropW * 0.52, bottomY,
          cx - dropW * 0.50, waistY - dropH * 0.15,
          cx, topY
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw all 5 vector icons
      drawPersonIcon(bCtx, iconCx, 1247);
      drawBriefcaseIcon(bCtx, iconCx, 1425);
      drawBuildingIcon(bCtx, iconCx, 1636);
      drawPinIcon(bCtx, iconCx, 1866);
      drawBloodDropIcon(bCtx, iconCx, 2050);

      // Configure Text Rendering with Exact Font, Weight and Color
      bCtx.fillStyle = textColor;
      bCtx.font = '600 90px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      bCtx.textAlign = 'left';
      bCtx.textBaseline = 'alphabetic';

      // Row 1: Aleena R
      bCtx.fillText('Aleena R', textStartX, 1276);

      // Row 2: HR Intern
      bCtx.fillText('HR Intern', textStartX, 1450);

      // Row 3: S & O Maritime Services / Private Limited
      bCtx.fillText('S & O Maritime Services', textStartX, 1600);
      bCtx.fillText('Private Limited', textStartX, 1690);

      // Row 4: Pulinchode, Aluva
      bCtx.fillText('Pulinchode, Aluva', textStartX, 1901);

      // Row 5: O+
      bCtx.fillText('O+', textStartX, 2085);

      cardBackTexture.needsUpdate = true;
    }

    function redrawAll() {
      drawExactCard();
      drawExactCardBack();
    }

    frontBaseImg.onload = redrawAll;
    backBaseImg.onload = redrawAll;

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawExactCardBack);
    }

    if (frontBaseImg.complete) drawExactCard();
    if (backBaseImg.complete) drawExactCardBack();

    // 6. Direct High-Clarity Card Mesh with Realistic 3D Thickness
    const cardWidth = 1.62;
    const cardHeight = 2.43;
    const cardThickness = 0.034;

    const cardGroup = new THREE.Group();

    // Front, Back, and Edge Materials for True 3D Realism
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: cardTexture,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.06
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      map: cardBackTexture,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12
    });

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c12,
      roughness: 0.35,
      metalness: 0.1
    });

    const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);
    const cardMesh = new THREE.Mesh(cardGeo, [
      edgeMat,  // +x right edge
      edgeMat,  // -x left edge
      edgeMat,  // +y top edge
      edgeMat,  // -y bottom edge
      frontMat, // +z front face
      backMat   // -z back face
    ]);
    cardGroup.add(cardMesh);

    // Sleek Acrylic Border Frame (Frames edges and extends above for clip slot, without occluding the card front)
    const frameWidth = cardWidth + 0.10;
    const frameHeight = cardHeight + 0.24;
    const frameThickness = cardThickness + 0.018;

    const frameGeo = new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness);
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.10,
      depthWrite: false,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 0.06, 0);
    cardGroup.add(frameMesh);

    // Slot Punch-Hole Mesh at Top of Acrylic Tab
    const slotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.07, 16);
    slotGeo.rotateZ(Math.PI / 2);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 });
    const slotMesh = new THREE.Mesh(slotGeo, slotMat);
    slotMesh.position.set(0, cardHeight / 2 + 0.11, 0);
    cardGroup.add(slotMesh);

    // 7. Master 3D Badge Assembly (Rigidly joins Card, Frame, Slot, Ring, Clip, and Buckle)
    const badgePivot = new THREE.Group();
    cardGroup.position.set(0, 0, 0);
    claspGroup.position.set(0, cardHeight / 2 + 0.11, 0);
    badgePivot.add(cardGroup);
    badgePivot.add(claspGroup);
    scene.add(badgePivot);

    // Initial Natural Resting Angle (Matches reference image / mobile config)
    badgePivot.position.set(baseRestX, baseRestY, baseRestZ);
    badgePivot.rotation.set(0.04, targetRestAngleY, targetRestAngleZ);

    // 8. Full Omnidirectional Touch & Pointer Drag System + Natural Physics
    let isPointerDown = false;
    let isBadgeDragging = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let lastClientTime = performance.now();

    // 3D Flip State (Double-Tap: Front <-> Back)
    let isFlippedToBack = false;
    let lastFlipTime = 0;

    // Double-tap vs Drag Gesture Tracking
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let hasExceededDragTolerance = false;
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    // 3D Position State
    let currentSwingX = baseRestX;
    let currentBadgeY = baseRestY;
    let currentDepthZ = baseRestZ;

    // Velocities for momentum and spring release
    let velX = 0;
    let velY = 0;
    let lastBadgeX = baseRestX;
    let lastBadgeY = baseRestY;

    // Rotation and Tilt
    let currentRotY = targetRestAngleY;
    let angularVelY = 0;
    let currentTiltZ = targetRestAngleZ;
    let currentPitchX = 0;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const claspAnchorPoint = new THREE.Vector3();
    const claspAnchorLocal = new THREE.Vector3(0, 0.74, 0);

    const dragPlane = new THREE.Plane();
    const touchPoint3D = new THREE.Vector3();
    const dragGrabOffset = new THREE.Vector2();

    const draggableObjects = [
      cardGroup,
      claspGroup,
      leftStrapMesh,
      rightStrapMesh,
      leftStrapMeshBack,
      rightStrapMeshBack
    ];

    function getPointerClientCoords(e) {
      if (!e) return { clientX: lastClientX, clientY: lastClientY };
      if (e.clientX !== undefined) return { clientX: e.clientX, clientY: e.clientY };
      if (e.touches && e.touches[0]) return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      if (e.changedTouches && e.changedTouches[0]) return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
      return { clientX: lastClientX, clientY: lastClientY };
    }

    function updateRaycasterMouse(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    function checkHit(clientX, clientY) {
      updateRaycasterMouse(clientX, clientY);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(draggableObjects, true);
      if (intersects.length > 0) return true;

      // Generous proximity detection for touch targets on mobile
      const cardNdc = badgePivot.position.clone().project(camera);
      const distToCard = Math.hypot(mouse.x - cardNdc.x, mouse.y - cardNdc.y);
      if (distToCard < 0.52) return true;

      // Strap line segment proximity
      claspAnchorLocal.set(0, 0.74, 0);
      claspGroup.localToWorld(claspAnchorPoint.copy(claspAnchorLocal));
      const strapMid = new THREE.Vector3()
        .addVectors(strapTopLeft, claspAnchorPoint)
        .multiplyScalar(0.5)
        .project(camera);
      const distToStrap = Math.hypot(mouse.x - strapMid.x, mouse.y - strapMid.y);
      if (distToStrap < 0.45) return true;

      return false;
    }

    function triggerFlip() {
      const now = performance.now();
      if (now - lastFlipTime < 280) return; // Prevent double trigger
      lastFlipTime = now;

      isFlippedToBack = !isFlippedToBack;
      // Realistic angular impulse kick to initiate 180° rotation
      angularVelY = isFlippedToBack ? 8.5 : -8.5;
    }

    function startDrag(clientX, clientY) {
      if (isBadgeDragging) return;
      isPointerDown = true;
      isBadgeDragging = true;
      setIsDragging(true);

      lastClientX = clientX;
      lastClientY = clientY;
      lastClientTime = performance.now();
      lastBadgeX = currentSwingX;
      lastBadgeY = currentBadgeY;
      velX = 0;
      velY = 0;
      angularVelY = 0;

      // Initialize tap detection baseline
      touchStartX = clientX;
      touchStartY = clientY;
      touchStartTime = performance.now();
      hasExceededDragTolerance = false;

      // Define plane at current badge Z depth perpendicular to Z-axis
      dragPlane.set(new THREE.Vector3(0, 0, 1), -badgePivot.position.z);
      updateRaycasterMouse(clientX, clientY);
      raycaster.setFromCamera(mouse, camera);

      if (raycaster.ray.intersectPlane(dragPlane, touchPoint3D)) {
        dragGrabOffset.set(currentSwingX - touchPoint3D.x, currentBadgeY - touchPoint3D.y);
      } else {
        dragGrabOffset.set(0, 0);
      }

      canvas.style.touchAction = 'none';
    }

    function updateDrag(clientX, clientY) {
      if (!isBadgeDragging) return;

      const now = performance.now();
      const dt = Math.max((now - lastClientTime) / 1000, 0.001);

      // Detect if user movement exceeds tap tolerance (12px)
      const distFromStart = Math.hypot(clientX - touchStartX, clientY - touchStartY);
      if (distFromStart > 12) {
        hasExceededDragTolerance = true;
        lastTapTime = 0; // A drag completely invalidates any prior tap
      }

      updateRaycasterMouse(clientX, clientY);
      raycaster.setFromCamera(mouse, camera);

      if (raycaster.ray.intersectPlane(dragPlane, touchPoint3D)) {
        const targetX = touchPoint3D.x + dragGrabOffset.x;
        const targetY = touchPoint3D.y + dragGrabOffset.y;

        // Viewport boundaries
        const isMobile = width < 768;
        const limitX = isMobile ? 1.65 : 2.35;
        const limitYMin = -1.75;
        const limitYMax = 1.25;

        currentSwingX = THREE.MathUtils.clamp(targetX, -limitX, limitX);
        currentBadgeY = THREE.MathUtils.clamp(targetY, limitYMin, limitYMax);
      }

      // Calculate instantaneous movement velocities for release momentum
      const instantVelX = (currentSwingX - lastBadgeX) / dt;
      const instantVelY = (currentBadgeY - lastBadgeY) / dt;

      velX = THREE.MathUtils.lerp(velX, instantVelX, 0.4);
      velY = THREE.MathUtils.lerp(velY, instantVelY, 0.4);
      velX = THREE.MathUtils.clamp(velX, -18, 18);
      velY = THREE.MathUtils.clamp(velY, -18, 18);

      // Natural physical tilt while dragging in 2D space
      const dispX = currentSwingX - baseRestX;
      const dispY = currentBadgeY - baseRestY;
      currentTiltZ = THREE.MathUtils.clamp(targetRestAngleZ - dispX * 0.16, -0.45, 0.45);
      currentPitchX = THREE.MathUtils.clamp(-dispY * 0.08, -0.3, 0.3);

      const stepX = clientX - lastClientX;
      // Tilt responsive to drag, strictly bounded to current face so drag NEVER triggers a flip
      const baseFaceAngle = isFlippedToBack ? (Math.PI + targetRestAngleY) : targetRestAngleY;
      currentRotY = THREE.MathUtils.clamp(
        currentRotY + stepX * 0.003,
        baseFaceAngle - 0.45,
        baseFaceAngle + 0.45
      );
      const instantAngVel = (stepX * 0.003) / dt;
      angularVelY = THREE.MathUtils.lerp(angularVelY, instantAngVel, 0.3);

      lastBadgeX = currentSwingX;
      lastBadgeY = currentBadgeY;
      lastClientX = clientX;
      lastClientY = clientY;
      lastClientTime = now;
    }

    function endDrag(clientX, clientY, e) {
      if (!isPointerDown && !isBadgeDragging) return;

      const now = performance.now();
      const pressDuration = now - touchStartTime;
      const distFromStart = Math.hypot(clientX - touchStartX, clientY - touchStartY);

      const wasTap = !hasExceededDragTolerance && distFromStart <= 14 && pressDuration < 320;

      isPointerDown = false;
      isBadgeDragging = false;
      setIsDragging(false);
      canvas.style.touchAction = 'manipulation';

      try {
        if (e && e.target && e.target.releasePointerCapture && e.pointerId !== undefined) {
          e.target.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      if (wasTap) {
        const timeSinceLastTap = now - lastTapTime;
        const distFromLastTap = Math.hypot(clientX - lastTapX, clientY - lastTapY);

        // Double-Tap detection:
        // 1. Two taps within interval (~40ms to ~340ms)
        // 2. Spatial tolerance between taps (<= 32px)
        if (timeSinceLastTap >= 40 && timeSinceLastTap <= 340 && distFromLastTap <= 32) {
          // GESTURE 3: DOUBLE TAP -> Flip 180°!
          triggerFlip();
          lastTapTime = 0; // Reset so 3rd tap won't re-flip
          lastTapX = 0;
          lastTapY = 0;
        } else {
          // GESTURE 2: SINGLE TAP -> Do nothing!
          lastTapTime = now;
          lastTapX = clientX;
          lastTapY = clientY;
        }
      } else {
        // GESTURE 1: DRAG -> Never flips!
        lastTapTime = 0;
      }
    }

    function onPointerDown(e) {
      const { clientX, clientY } = getPointerClientCoords(e);
      if (checkHit(clientX, clientY)) {
        startDrag(clientX, clientY);
        try {
          if (e.target && e.target.setPointerCapture && e.pointerId !== undefined) {
            e.target.setPointerCapture(e.pointerId);
          }
        } catch (_) {}
      }
    }

    function onPointerMove(e) {
      const { clientX, clientY } = getPointerClientCoords(e);
      if (!isPointerDown || !isBadgeDragging) {
        setIsHovered(checkHit(clientX, clientY));
        return;
      }
      updateDrag(clientX, clientY);
    }

    function onPointerUp(e) {
      const { clientX, clientY } = getPointerClientCoords(e);
      endDrag(clientX, clientY, e);
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (checkHit(touch.clientX, touch.clientY)) {
        if (e.cancelable) e.preventDefault();
        startDrag(touch.clientX, touch.clientY);
      }
    }

    function onTouchMove(e) {
      if (!isBadgeDragging) return;
      if (e.cancelable) e.preventDefault();
      if (e.touches.length > 0) {
        updateDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    function onTouchEnd(e) {
      const { clientX, clientY } = getPointerClientCoords(e);
      endDrag(clientX, clientY, e);
    }

    function onDblClick(e) {
      e.preventDefault();
      const { clientX, clientY } = getPointerClientCoords(e);
      if (checkHit(clientX, clientY)) {
        triggerFlip();
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    canvas.addEventListener('dblclick', onDblClick);

    // 8B. Device Orientation Sensor Integration
    let isListenerAttached = false;
    let hasDeviceOrientation = false;
    let deviceGamma = 0;
    let deviceBeta = 45; // Neutral handheld inclination
    let lastLogTime = 0;

    function handleOrientation(event) {
      const now = performance.now();
      if (now - lastLogTime > 250) {
        console.log('Device orientation:', event.beta, event.gamma);
        lastLogTime = now;
      }

      if (event.beta === null || event.gamma === null) return;
      deviceBeta = event.beta;
      deviceGamma = event.gamma;
      hasDeviceOrientation = true;
    }

    function attachOrientationListener() {
      if (isListenerAttached) return;
      if (typeof window === 'undefined') return;

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      isListenerAttached = true;
    }

    attachListenerRef.current = attachOrientationListener;

    // Check DeviceOrientationEvent
    const hasDeviceOrientationEvent = typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';
    const requiresPermission = hasDeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function';

    if (hasDeviceOrientationEvent && !requiresPermission) {
      attachOrientationListener();
    }

    // 9. Simulation & Render Loop
    let lastTime = performance.now();

    function animate(currentTime) {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.033);
      lastTime = currentTime;

      if (!isBadgeDragging) {
        // Calculate rest targets (including device orientation if available)
        let targetSwingX = baseRestX;
        let targetTiltZ = targetRestAngleZ;
        let targetPitchX = 0;
        let targetDepthZ = baseRestZ;

        if (hasDeviceOrientation) {
          const clampedGamma = THREE.MathUtils.clamp(deviceGamma, -35, 35);
          const normGamma = clampedGamma / 35; // [-1, 1]

          const clampedBeta = THREE.MathUtils.clamp(deviceBeta, 15, 75);
          const normBeta = (clampedBeta - 45) / 30; // [-1, 1]

          targetSwingX = baseRestX + (normGamma * 0.28);
          targetTiltZ = targetRestAngleZ + (normGamma * 0.14);
          targetPitchX = -normBeta * 0.10;
          targetDepthZ = baseRestZ + (normBeta * 0.12);
        }

        // ----------------------------------------------------
        // A. HORIZONTAL SPRING PHYSICS (Pendulum Return)
        // ----------------------------------------------------
        const springK_X = 26.0;   // Snappy pendulum stiffness
        const dampingC_X = 4.6;   // Damped settling with natural swing
        const dispX = currentSwingX - targetSwingX;
        const springForceX = -springK_X * dispX;
        const dampingForceX = -dampingC_X * velX;
        const accX = springForceX + dampingForceX;

        velX += accX * dt;
        currentSwingX += velX * dt;

        // ----------------------------------------------------
        // B. VERTICAL SPRING PHYSICS (Damped Harmonic Recoil)
        // ----------------------------------------------------
        const springK_Y = 34.0;   // Vertical spring stiffness
        const dampingC_Y = 5.2;   // Damped settling with bounce
        const dispY = currentBadgeY - baseRestY;
        const springForceY = -springK_Y * dispY;
        const dampingForceY = -dampingC_Y * velY;
        const accY = springForceY + dampingForceY;

        velY += accY * dt;
        currentBadgeY += velY * dt;

        // When nearly settled, cleanly rest at equilibrium
        if (Math.abs(dispX) < 0.002 && Math.abs(velX) < 0.01) {
          currentSwingX = targetSwingX;
          velX = 0;
        }
        if (Math.abs(dispY) < 0.002 && Math.abs(velY) < 0.01) {
          currentBadgeY = baseRestY;
          velY = 0;
        }

        // ----------------------------------------------------
        // C. HORIZONTAL ROTATIONAL INERTIA & FACE SETTLING
        // ----------------------------------------------------
        const targetFaceY = isFlippedToBack ? (Math.PI + targetRestAngleY) : targetRestAngleY;
        const springK_Rot = 32.0;
        const dampingC_Rot = 9.8;
        const dispRotY = currentRotY - targetFaceY;
        const accRotY = -springK_Rot * dispRotY - dampingC_Rot * angularVelY;

        angularVelY += accRotY * dt;
        currentRotY += angularVelY * dt;

        // When nearly settled, cleanly rest at equilibrium
        if (Math.abs(dispRotY) < 0.002 && Math.abs(angularVelY) < 0.01) {
          currentRotY = targetFaceY;
          angularVelY = 0;
        }

        // Feed tilt, pitch, and depth targets smoothly
        currentTiltZ = THREE.MathUtils.lerp(currentTiltZ, targetTiltZ, 0.08);
        currentPitchX = THREE.MathUtils.lerp(currentPitchX, targetPitchX, 0.08);
        currentDepthZ = THREE.MathUtils.lerp(currentDepthZ, targetDepthZ, 0.08);
      }

      // Natural ambient breathe & pendulum sway
      const ambientSwayY = Math.sin(currentTime * 0.0016) * 0.012;
      const ambientSwayX = Math.sin(currentTime * 0.0022) * 0.006;
      const ambientSwayZ = Math.cos(currentTime * 0.0019) * 0.006;
      const ambientSwayPitch = Math.sin(currentTime * 0.002) * 0.008;

      // Position badge in 3D world space
      badgePivot.position.set(
        currentSwingX + ambientSwayX,
        currentBadgeY + ambientSwayY,
        currentDepthZ + ambientSwayZ
      );

      // Combine 3D rotation around Y with subtle pitch tilt, roll tilt, and ambient sway
      badgePivot.rotation.x = 0.04 + ((currentBadgeY - baseRestY) * 0.06) + ambientSwayPitch + currentPitchX;
      badgePivot.rotation.y = currentRotY + ambientSwayY;
      badgePivot.rotation.z = currentTiltZ + ambientSwayZ;

      // Track exact world position where strap ribbons connect into the top of breakaway buckle
      claspAnchorLocal.set(0, 0.74, 0);
      claspGroup.localToWorld(claspAnchorPoint.copy(claspAnchorLocal));

      // Dynamic ribbon twist follows swivel rotation (untwists naturally as badge flips on swivel hook)
      const baseFaceAngle = isFlippedToBack ? Math.PI : 0;
      const ribbonTwist = (badgePivot.rotation.y - baseFaceAngle) * 0.65;
      updateStrapRibbon(leftStrapGeo, strapTopLeft, claspAnchorPoint, 0.16, 0.0, ribbonTwist);
      updateStrapRibbon(rightStrapGeo, strapTopRight, claspAnchorPoint, 0.16, 0.0, ribbonTwist);

      renderer.render(scene, camera);
    }

    if (typeof window !== 'undefined') {
      window.__lanyardState = {
        getPosition: () => ({
          x: badgePivot.position.x,
          y: badgePivot.position.y,
          z: badgePivot.position.z
        }),
        isDragging: () => isBadgeDragging,
        getRest: () => ({ x: baseRestX, y: baseRestY }),
        isFlipped: () => isFlippedToBack,
        getRotY: () => badgePivot.rotation.y,
        triggerFlip: () => triggerFlip()
      };
    }

    animate(performance.now());

    // 10. Responsive Resizing
    function handleResize() {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      updateResponsiveConfig(width);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (!isBadgeDragging) {
        currentSwingX = baseRestX;
        currentBadgeY = baseRestY;
        currentDepthZ = baseRestZ;
      }
    }

    window.__lanyardState = {
      triggerFlip,
      isFlipped: () => isFlippedToBack
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      delete window.__lanyardState;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('dblclick', onDblClick);
      if (isListenerAttached) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      renderer.dispose();
      strapMaterial.dispose();
      strapMaterialBack.dispose();
      whiteTabMaterial.dispose();
      plasticMaterial.dispose();
      plasticAccentMaterial.dispose();
      metalMaterial.dispose();
      strapTexture.dispose();
      strapBackTexture.dispose();
      whiteTabTexture.dispose();
      chevronGeo.dispose();
      leftStrapGeo.dispose();
      rightStrapGeo.dispose();
      frontMat.dispose();
      backMat.dispose();
      edgeMat.dispose();
      cardTexture.dispose();
      cardBackTexture.dispose();
      frameMat.dispose();
      cardGeo.dispose();
      frameGeo.dispose();
      slotGeo.dispose();
      slotMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`lanyard-wrapper ${className}`}
      style={{
        cursor: isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
        touchAction: isDragging ? 'none' : 'manipulation'
      }}
    >
      <canvas
        ref={canvasRef}
        className="lanyard-canvas"
        style={{ touchAction: isDragging ? 'none' : 'manipulation' }}
      />

      <style>{`
        .lanyard-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          touch-action: manipulation;
        }
        .lanyard-canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
          outline: none;
          touch-action: manipulation;
        }
        @media (max-width: 1024px) {
          .lanyard-wrapper {
            min-height: 500px;
          }
        }
        @media (max-width: 768px) {
          .lanyard-wrapper {
            min-height: 440px;
            height: 440px;
          }
        }
        @media (max-width: 480px) {
          .lanyard-wrapper {
            min-height: 420px;
            height: 420px;
          }
        }
      `}</style>
    </div>
  );
}
