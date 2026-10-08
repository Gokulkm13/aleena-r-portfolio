import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

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

  const { theme } = useTheme();
  const themeUpdateHandlerRef = useRef(null);

  useEffect(() => {
    if (themeUpdateHandlerRef.current) {
      themeUpdateHandlerRef.current(theme);
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, High-Precision Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);

    // Responsive Viewport & Centering Configuration
    let baseRestX = 0.12;
    let baseRestY = -0.20;
    let baseRestZ = 0;
    let targetRestAngleZ = -0.08;
    let targetRestAngleY = 0.08;

    const strapTopLeft = new THREE.Vector3(-0.65, 2.90, -0.15);
    const strapTopRight = new THREE.Vector3(0.65, 2.90, -0.05);

    function updateResponsiveConfig(w) {
      const isMobile = (typeof window !== 'undefined' ? window.innerWidth : w) < 768;
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
        camera.fov = 40;
        camera.position.set(0.08, 0.22, 5.6);
        baseRestX = 0.12;
        baseRestY = -0.20;
        targetRestAngleZ = -0.08;
        targetRestAngleY = 0.08;
        strapTopLeft.set(-0.65, 2.90, -0.15);
        strapTopRight.set(0.65, 2.90, -0.05);
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

    // Helper function to draw the minimal symmetrical Leaf Logo Vector
    function drawLeafLogo(ctx, cx, cy, size, color, strokeW = 8) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Center petal (pointed oval)
      const c_base_y = cy - size * 0.46;
      const c_tip_y = cy - size * 0.98;

      ctx.beginPath();
      ctx.moveTo(cx, c_base_y);
      ctx.bezierCurveTo(cx - size * 0.16, cy - size * 0.58, cx - size * 0.16, cy - size * 0.86, cx, c_tip_y);
      ctx.bezierCurveTo(cx + size * 0.16, cy - size * 0.86, cx + size * 0.16, cy - size * 0.58, cx, c_base_y);
      ctx.stroke();

      // Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.22);
      ctx.lineTo(cx, cy + size * 0.05);
      ctx.stroke();

      // Left petal
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.22);
      ctx.bezierCurveTo(cx - size * 0.20, cy - size * 0.24, cx - size * 0.50, cy - size * 0.46, cx - size * 0.44, cy - size * 0.65);
      ctx.bezierCurveTo(cx - size * 0.35, cy - size * 0.75, cx - size * 0.06, cy - size * 0.55, cx, cy - size * 0.35);
      ctx.stroke();

      // Right petal
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.22);
      ctx.bezierCurveTo(cx + size * 0.20, cy - size * 0.24, cx + size * 0.50, cy - size * 0.46, cx + size * 0.44, cy - size * 0.65);
      ctx.bezierCurveTo(cx + size * 0.35, cy - size * 0.75, cx + size * 0.06, cy - size * 0.55, cx, cy - size * 0.35);
      ctx.stroke();

      ctx.restore();
    }

    // Function to render the wide flat woven fabric lanyard strap
    function renderLanyardStrap(canvas, currentTheme = 'dark') {
      const isDark = currentTheme === 'dark';
      const sCtx = canvas.getContext('2d');
      sCtx.clearRect(0, 0, 512, 4096);

      // 1. Premium Woven Textile Base (Ivory/White in light, Deep Charcoal/Black in dark)
      sCtx.fillStyle = isDark ? '#141318' : '#faf7f3';
      sCtx.fillRect(0, 0, 512, 4096);

      // 2. Subtle Repeating Abstract Pattern (Flowing Jacquard / Woven Ribbons)
      for (let offset = 0; offset < 4096; offset += 512) {
        sCtx.save();
        sCtx.fillStyle = isDark ? 'rgba(165, 125, 230, 0.09)' : 'rgba(160, 130, 205, 0.12)';

        // Fluid sinusoidal jacquard weave 1
        sCtx.beginPath();
        sCtx.moveTo(0, offset + 40);
        sCtx.bezierCurveTo(170, offset + 120, 340, offset + 240, 512, offset + 320);
        sCtx.lineTo(512, offset + 440);
        sCtx.bezierCurveTo(340, offset + 360, 170, offset + 240, 0, offset + 160);
        sCtx.closePath();
        sCtx.fill();

        // Fluid sinusoidal jacquard weave 2 (Counter flow)
        sCtx.fillStyle = isDark ? 'rgba(135, 95, 205, 0.07)' : 'rgba(185, 150, 225, 0.09)';
        sCtx.beginPath();
        sCtx.moveTo(512, offset + 80);
        sCtx.bezierCurveTo(340, offset + 160, 170, offset + 280, 0, offset + 360);
        sCtx.lineTo(0, offset + 480);
        sCtx.bezierCurveTo(170, offset + 400, 340, offset + 280, 512, offset + 200);
        sCtx.closePath();
        sCtx.fill();

        // Subtle Repeating Minimal Leaf Jacquard Accent
        const leafColor = isDark ? 'rgba(180, 150, 235, 0.18)' : 'rgba(145, 115, 185, 0.22)';
        drawLeafLogo(sCtx, 256, offset + 256, 52, leafColor, 5);

        sCtx.restore();
      }

      // 3. Fine Woven Polyester Grosgrain Micro-Ribbing
      for (let y = 0; y < 4096; y += 6) {
        sCtx.fillStyle = isDark
          ? (y % 12 === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.20)')
          : (y % 12 === 0 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(120, 100, 140, 0.07)');
        sCtx.fillRect(0, y, 512, 3);
      }

      // 4. Selvage Edge Borders
      sCtx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.28)' : 'rgba(130, 110, 150, 0.10)';
      sCtx.fillRect(0, 0, 16, 4096);
      sCtx.fillRect(496, 0, 16, 4096);
      sCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.50)';
      sCtx.fillRect(16, 0, 4, 4096);
      sCtx.fillRect(492, 0, 4, 4096);

      // 5. Realistic Dashed Edge Stitching
      sCtx.strokeStyle = isDark ? 'rgba(180, 150, 230, 0.25)' : 'rgba(145, 115, 185, 0.35)';
      sCtx.lineWidth = 2.5;
      sCtx.setLineDash([8, 8]);
      sCtx.beginPath();
      sCtx.moveTo(28, 0);
      sCtx.lineTo(28, 4096);
      sCtx.moveTo(484, 0);
      sCtx.lineTo(484, 4096);
      sCtx.stroke();
      sCtx.setLineDash([]);
    }

    // High-Res Texture for Safety Buckle Collar (512 x 512)
    function renderCollar(canvas, currentTheme = 'dark') {
      const isDark = currentTheme === 'dark';
      const cCtx = canvas.getContext('2d');
      cCtx.clearRect(0, 0, 512, 512);

      cCtx.fillStyle = isDark ? '#1a1822' : '#f5f0ea';
      cCtx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 6) {
        cCtx.fillStyle = isDark
          ? (y % 12 === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.20)')
          : (y % 12 === 0 ? 'rgba(255, 255, 255, 0.40)' : 'rgba(120, 100, 140, 0.08)');
        cCtx.fillRect(0, y, 512, 3);
      }
      const leafColor = isDark ? '#c5b0e8' : '#654b84';
      drawLeafLogo(cCtx, 256, 256, 110, leafColor, 8);
    }

    // Function to render the 2000 x 3280 Front and Back ID Badge Faces
    function renderCardFace(canvas, currentTheme = 'dark', isBack = false, photo = null) {
      const isDark = currentTheme === 'dark';
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 2000, 3280);

      // 1. Base Canvas Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, 2000, 3280);
      if (isDark) {
        baseGrad.addColorStop(0, '#15131d');
        baseGrad.addColorStop(0.5, '#121018');
        baseGrad.addColorStop(1, '#0e0c13');
      } else {
        baseGrad.addColorStop(0, '#f9f5ee');
        baseGrad.addColorStop(0.5, '#f4ece2');
        baseGrad.addColorStop(1, '#eee2d4');
      }
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 2000, 3280);

      // 2. Soft Edge Shapes / Translucent Flowing Ribbons
      ctx.save();
      if (isDark) {
        // Restrained violet abstract shapes
        ctx.fillStyle = 'rgba(125, 80, 185, 0.16)';
        ctx.beginPath();
        ctx.moveTo(700, 0);
        ctx.bezierCurveTo(1200, 200, 1800, 600, 2000, 1200);
        ctx.lineTo(2000, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(155, 105, 220, 0.10)';
        ctx.beginPath();
        ctx.moveTo(1100, 0);
        ctx.bezierCurveTo(1500, 350, 1850, 800, 2000, 1500);
        ctx.lineTo(2000, 0);
        ctx.closePath();
        ctx.fill();

        // Bottom abstract curve
        ctx.fillStyle = 'rgba(110, 70, 170, 0.14)';
        ctx.beginPath();
        ctx.moveTo(0, 2400);
        ctx.bezierCurveTo(300, 2600, 900, 3100, 1600, 3280);
        ctx.lineTo(0, 3280);
        ctx.closePath();
        ctx.fill();

        // Frosted obsidian glass highlight sheen
        const sheen = ctx.createLinearGradient(0, 0, 2000, 2000);
        sheen.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        sheen.addColorStop(0.3, 'rgba(255, 255, 255, 0.015)');
        sheen.addColorStop(0.6, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, 2000, 3280);

        // Subtle edge vignette / glow
        ctx.strokeStyle = 'rgba(150, 105, 230, 0.15)';
        ctx.lineWidth = 12;
        ctx.strokeRect(6, 6, 1988, 3268);
      } else {
        // Soft lavender / pale-pink edge shapes
        ctx.fillStyle = 'rgba(224, 210, 240, 0.40)';
        ctx.beginPath();
        ctx.moveTo(600, 0);
        ctx.bezierCurveTo(1150, 180, 1750, 580, 2000, 1150);
        ctx.lineTo(2000, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(242, 226, 238, 0.32)';
        ctx.beginPath();
        ctx.moveTo(1050, 0);
        ctx.bezierCurveTo(1450, 320, 1820, 750, 2000, 1400);
        ctx.lineTo(2000, 0);
        ctx.closePath();
        ctx.fill();

        // Bottom pale pink/lavender curve
        ctx.fillStyle = 'rgba(220, 202, 236, 0.30)';
        ctx.beginPath();
        ctx.moveTo(0, 2450);
        ctx.bezierCurveTo(350, 2650, 950, 3120, 1650, 3280);
        ctx.lineTo(0, 3280);
        ctx.closePath();
        ctx.fill();

        // Frosted acrylic glass highlight sheen
        const sheen = ctx.createLinearGradient(0, 0, 2000, 2000);
        sheen.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.10)');
        sheen.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, 2000, 3280);

        // Soft lavender edge vignette
        ctx.strokeStyle = 'rgba(165, 130, 210, 0.12)';
        ctx.lineWidth = 12;
        ctx.strokeRect(6, 6, 1988, 3268);
      }
      ctx.restore();

      // 3. Rounded Punch Slot Bezel (at top center)
      ctx.save();
      const slotW = 280;
      const slotH = 68;
      const slotR = 34;
      const slotX = 1000 - slotW / 2;
      const slotY = 124 - slotH / 2;
      ctx.beginPath();
      ctx.roundRect(slotX, slotY, slotW, slotH, slotR);
      ctx.strokeStyle = isDark ? 'rgba(200, 170, 255, 0.22)' : 'rgba(150, 120, 185, 0.28)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      if (!isBack) {
        // ================= FRONT FACE =================
        // A. Subtle Minimal Decorative Mark (above photo)
        const markColor = isDark ? '#cbb3ed' : '#5b3d7a';
        drawLeafLogo(ctx, 1000, 370, 88, markColor, 7);

        // B. Portrait Frame & Image (Prominent, balanced ID photo)
        const pW = 1360;
        const pH = 1540;
        const pX = 1000 - pW / 2;
        const pY = 550;
        const pR = 72;

        ctx.save();
        // Soft diffuse drop shadow
        ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(70, 40, 110, 0.14)';
        ctx.shadowBlur = isDark ? 42 : 32;
        ctx.shadowOffsetY = 18;

        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, pR);
        ctx.fillStyle = isDark ? '#1a1725' : '#ffffff';
        ctx.fill();
        ctx.restore();

        // Draw portrait image
        if (photo && photo.complete && photo.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(pX, pY, pW, pH, pR);
          ctx.clip();
          // Scale to fill nicely while preserving natural portrait framing
          const imgAspect = photo.naturalWidth / photo.naturalHeight;
          const frameAspect = pW / pH;
          let drawW = pW;
          let drawH = pH;
          let drawX = pX;
          let drawY = pY;
          if (imgAspect > frameAspect) {
            drawW = pH * imgAspect;
            drawX = pX + (pW - drawW) / 2;
          } else {
            drawH = pW / imgAspect;
            drawY = pY + (pH - drawH) / 2;
          }
          ctx.drawImage(photo, drawX, drawY, drawW, drawH);
          ctx.restore();
        }

        // Hairline border over portrait
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, pR);
        ctx.strokeStyle = isDark ? 'rgba(190, 160, 240, 0.42)' : 'rgba(165, 135, 200, 0.50)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        // C. Typography - "ALEENA R"
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '14px';

        if (isDark) {
          ctx.font = '700 116px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#f6f2fc';
          ctx.shadowColor = 'rgba(195, 160, 250, 0.45)';
          ctx.shadowBlur = 20;
        } else {
          ctx.font = '800 120px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#1c0e30';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        ctx.fillText('ALEENA R', 1000, 2330);
        ctx.restore();

        // D. Small Elegant Divider
        ctx.save();
        const divW = 420;
        const divGrad = ctx.createLinearGradient(1000 - divW / 2, 2470, 1000 + divW / 2, 2470);
        if (isDark) {
          divGrad.addColorStop(0, 'rgba(190, 160, 240, 0)');
          divGrad.addColorStop(0.5, 'rgba(190, 160, 240, 0.65)');
          divGrad.addColorStop(1, 'rgba(190, 160, 240, 0)');
        } else {
          divGrad.addColorStop(0, 'rgba(130, 85, 175, 0)');
          divGrad.addColorStop(0.5, 'rgba(130, 85, 175, 0.85)');
          divGrad.addColorStop(1, 'rgba(130, 85, 175, 0)');
        }
        ctx.fillStyle = divGrad;
        ctx.fillRect(1000 - divW / 2, 2467, divW, 4.5);
        ctx.restore();

        // E. Typography - "HR INTERN"
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '18px';
        if (isDark) {
          ctx.font = '600 58px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#c5b0e8';
        } else {
          ctx.font = '700 62px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#4f2f71';
        }
        ctx.fillText('HR INTERN', 1000, 2600);
        ctx.restore();

      } else {
        // ================= BACK FACE =================
        // Minimal Executive Credential
        const markColor = isDark ? '#d0b8f4' : '#573a76';
        drawLeafLogo(ctx, 1000, 1260, 180, markColor, 9);

        // "ALEENA R"
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '16px';
        if (isDark) {
          ctx.font = '700 98px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#f6f2fc';
          ctx.shadowColor = 'rgba(195, 160, 250, 0.40)';
          ctx.shadowBlur = 18;
        } else {
          ctx.font = '800 104px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#1c0e30';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        ctx.fillText('ALEENA R', 1000, 1620);
        ctx.restore();

        // Divider
        ctx.save();
        const divW = 320;
        const divGrad = ctx.createLinearGradient(1000 - divW / 2, 1730, 1000 + divW / 2, 1730);
        if (isDark) {
          divGrad.addColorStop(0, 'rgba(190, 160, 240, 0)');
          divGrad.addColorStop(0.5, 'rgba(190, 160, 240, 0.60)');
          divGrad.addColorStop(1, 'rgba(190, 160, 240, 0)');
        } else {
          divGrad.addColorStop(0, 'rgba(130, 85, 175, 0)');
          divGrad.addColorStop(0.5, 'rgba(130, 85, 175, 0.80)');
          divGrad.addColorStop(1, 'rgba(130, 85, 175, 0)');
        }
        ctx.fillStyle = divGrad;
        ctx.fillRect(1000 - divW / 2, 1728, divW, 4);
        ctx.restore();

        // "HR INTERN"
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '18px';
        if (isDark) {
          ctx.font = '600 50px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#c5b0e8';
        } else {
          ctx.font = '700 54px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#4f2f71';
        }
        ctx.fillText('HR INTERN', 1000, 1840);
        ctx.restore();
      }
    }

    // 3. Ultra High-Resolution Matching Dual Strap Textures (512 x 4096)
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 512;
    strapCanvas.height = 4096;

    const strapBackCanvas = document.createElement('canvas');
    strapBackCanvas.width = 512;
    strapBackCanvas.height = 4096;

    // High-Res Texture for Matching Safety Buckle Collar (512 x 512)
    const collarCanvas = document.createElement('canvas');
    collarCanvas.width = 512;
    collarCanvas.height = 512;

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

    const collarTexture = new THREE.CanvasTexture(collarCanvas);
    collarTexture.anisotropy = maxAnisotropy;
    collarTexture.colorSpace = THREE.SRGBColorSpace;

    const strapMaterial = new THREE.MeshStandardMaterial({
      map: strapTexture,
      roughness: 0.65,
      metalness: 0.08,
      side: THREE.FrontSide
    });

    const strapMaterialBack = new THREE.MeshStandardMaterial({
      map: strapBackTexture,
      roughness: 0.65,
      metalness: 0.08,
      side: THREE.BackSide
    });

    const collarMaterial = new THREE.MeshStandardMaterial({
      map: collarTexture,
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

    // 4. Physical Premium Metal Hardware Material (Swapped: Dark style for Light mode, Light style for Dark mode)
    const isInitialDark = (theme || 'dark') === 'light';
    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: isInitialDark ? 0x282a32 : 0xe2e4ea,
      metalness: isInitialDark ? 0.92 : 0.88,
      roughness: isInitialDark ? 0.28 : 0.22,
      clearcoat: isInitialDark ? 0.35 : 0.60,
      clearcoatRoughness: 0.08
    });

    const claspGroup = new THREE.Group();

    // A. Realistic Swivel Lobster Clip Hook (passes through punched slot hole at y = -0.10)
    const hookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.04, 0.02),
      new THREE.Vector3(0.03, -0.07, 0.015),
      new THREE.Vector3(0.02, -0.11, 0),       // passes through slot
      new THREE.Vector3(-0.02, -0.11, 0),      // bottom loop through slot
      new THREE.Vector3(-0.03, -0.07, -0.015),
      new THREE.Vector3(0, -0.04, -0.02)
    ]);
    const hookGeo = new THREE.TubeGeometry(hookCurve, 24, 0.011, 10, false);
    const hookMesh = new THREE.Mesh(hookGeo, metalMaterial);
    claspGroup.add(hookMesh);

    // Lobster clip solid body
    const clipBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.028, 0.09, 16),
      metalMaterial
    );
    clipBody.position.set(0, 0.005, 0);
    claspGroup.add(clipBody);

    // Spring lever / trigger tab on the clip side
    const clipLever = new THREE.Mesh(
      new THREE.BoxGeometry(0.016, 0.05, 0.035),
      metalMaterial
    );
    clipLever.position.set(0.032, 0.01, 0);
    clipLever.rotation.z = -0.25;
    claspGroup.add(clipLever);

    // B. Precision Swivel Joint (Barrel & Eyelet)
    const swivelCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.032, 18),
      metalMaterial
    );
    swivelCollar.position.set(0, 0.065, 0);
    claspGroup.add(swivelCollar);

    const swivelEyelet = new THREE.Mesh(
      new THREE.TorusGeometry(0.038, 0.010, 10, 18),
      metalMaterial
    );
    swivelEyelet.position.set(0, 0.105, 0);
    swivelEyelet.rotation.y = Math.PI / 2;
    claspGroup.add(swivelEyelet);

    // C. Small Circular Metal Ring (Split/Jump Ring)
    const metalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.012, 12, 24),
      metalMaterial
    );
    metalRing.position.set(0, 0.175, 0);
    claspGroup.add(metalRing);

    // D. Compact Safety Buckle / Collar (holds the woven lanyard strap)
    const safetyBuckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.11, 0.045),
      collarMaterial
    );
    safetyBuckle.position.set(0, 0.265, 0);
    claspGroup.add(safetyBuckle);

    // Buckle accent trim (fine metal border)
    const buckleTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.022, 0.048),
      metalMaterial
    );
    buckleTrim.position.set(0, 0.265, 0);
    claspGroup.add(buckleTrim);

    // 5. ULTRA HIGH-RESOLUTION CARD CANVAS TEXTURE (2000 x 3280)
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 2000;
    cardCanvas.height = 3280;

    const cardTexture = new THREE.CanvasTexture(cardCanvas);
    cardTexture.generateMipmaps = true;
    cardTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardTexture.magFilter = THREE.LinearFilter;
    cardTexture.anisotropy = maxAnisotropy;
    cardTexture.colorSpace = THREE.SRGBColorSpace;

    // Dedicated Back Face Texture for Authentic 3D Realism
    const cardBackCanvas = document.createElement('canvas');
    cardBackCanvas.width = 2000;
    cardBackCanvas.height = 3280;

    const cardBackTexture = new THREE.CanvasTexture(cardBackCanvas);
    cardBackTexture.generateMipmaps = true;
    cardBackTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardBackTexture.magFilter = THREE.LinearFilter;
    cardBackTexture.anisotropy = maxAnisotropy;
    cardBackTexture.colorSpace = THREE.SRGBColorSpace;

    // Direct High-Clarity Card Mesh with Smooth Rounded ID Corners & Acrylic Finish
    const cardWidth = 1.62;
    const cardHeight = 2.65;
    const cardThickness = 0.034;
    const cardRadius = 0.135; // Semi-round, generous natural border radius (~8.3% of width)

    const cardGroup = new THREE.Group();

    // Front, Back, and Polished Acrylic Edge Materials
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: cardTexture,
      roughness: 0.12,
      metalness: 0.02,
      clearcoat: 0.95,
      clearcoatRoughness: 0.05,
      ior: 1.49
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      map: cardBackTexture,
      roughness: 0.12,
      metalness: 0.02,
      clearcoat: 0.95,
      clearcoatRoughness: 0.05,
      ior: 1.49
    });

    const edgeMat = new THREE.MeshPhysicalMaterial({
      color: isInitialDark ? 0x181522 : 0xfbf8f4,
      roughness: isInitialDark ? 0.18 : 0.14,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      ior: 1.49
    });

    // Asset Loading: Portrait Image for Authentic Badge Photo
    let activeTheme = theme || 'dark';
    const photoImg = new Image();
    photoImg.crossOrigin = 'anonymous';
    photoImg.src = `${import.meta.env.BASE_URL}assets/images/aleena-tag-photo-original.png`;
    photoImg.onload = () => {
      const visualTheme = activeTheme === 'dark' ? 'light' : 'dark';
      renderCardFace(cardCanvas, visualTheme, false, photoImg);
      cardTexture.needsUpdate = true;
      renderCardFace(cardBackCanvas, visualTheme, true, photoImg);
      cardBackTexture.needsUpdate = true;
    };
    if (photoImg.complete && photoImg.naturalWidth > 0) {
      const visualTheme = activeTheme === 'dark' ? 'light' : 'dark';
      renderCardFace(cardCanvas, visualTheme, false, photoImg);
      cardTexture.needsUpdate = true;
      renderCardFace(cardBackCanvas, visualTheme, true, photoImg);
      cardBackTexture.needsUpdate = true;
    }

    // Master Theme Update Handler (Swapped: Dark style for Light mode, Light style for Dark mode)
    function updateTheme(curTheme) {
      activeTheme = curTheme;
      const visualTheme = curTheme === 'dark' ? 'light' : 'dark';
      const isDark = visualTheme === 'dark';

      // 1. Hardware Metal & Edge Materials
      if (isDark) {
        metalMaterial.color.setHex(0x282a32);
        metalMaterial.roughness = 0.28;
        metalMaterial.metalness = 0.92;
        metalMaterial.clearcoat = 0.35;
        edgeMat.color.setHex(0x181522);
        edgeMat.roughness = 0.18;
        frontMat.roughness = 0.12;
        frontMat.clearcoat = 0.95;
        backMat.roughness = 0.12;
        backMat.clearcoat = 0.95;
      } else {
        metalMaterial.color.setHex(0xd8dae2);
        metalMaterial.roughness = 0.25;
        metalMaterial.metalness = 0.88;
        metalMaterial.clearcoat = 0.50;
        edgeMat.color.setHex(0xf5ede4);
        edgeMat.roughness = 0.16;
        frontMat.roughness = 0.20;
        frontMat.clearcoat = 0.50;
        backMat.roughness = 0.20;
        backMat.clearcoat = 0.50;
      }
      metalMaterial.needsUpdate = true;
      edgeMat.needsUpdate = true;
      frontMat.needsUpdate = true;
      backMat.needsUpdate = true;

      // 2. Strap Textures
      renderLanyardStrap(strapCanvas, visualTheme);
      strapTexture.needsUpdate = true;
      renderLanyardStrap(strapBackCanvas, visualTheme);
      strapBackTexture.needsUpdate = true;

      // 3. Safety Buckle Collar Texture
      renderCollar(collarCanvas, visualTheme);
      collarTexture.needsUpdate = true;

      // 4. ID Card Front and Back Textures
      renderCardFace(cardCanvas, visualTheme, false, photoImg);
      cardTexture.needsUpdate = true;
      renderCardFace(cardBackCanvas, visualTheme, true, photoImg);
      cardBackTexture.needsUpdate = true;
    }

    themeUpdateHandlerRef.current = updateTheme;
    updateTheme(activeTheme);

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (themeUpdateHandlerRef.current) {
          themeUpdateHandlerRef.current(activeTheme);
        }
      });
    }

    // Create 2D Rounded Rectangle Shape with Punched Slot Hole
    function createRoundedCardShape(w, h, r) {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
      shape.lineTo(x + w, y + h - r);
      shape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
      shape.lineTo(x + r, y + h);
      shape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
      shape.lineTo(x, y + r);
      shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);

      // Punched slot hole at top center of ID card
      const hole = new THREE.Path();
      const holeW = 0.22;
      const holeH = 0.054;
      const holeR = holeH / 2;
      const hx = -holeW / 2;
      const hy = h / 2 - 0.10 - holeH / 2;
      hole.moveTo(hx + holeR, hy);
      hole.lineTo(hx + holeW - holeR, hy);
      hole.absarc(hx + holeW - holeR, hy + holeR, holeR, -Math.PI / 2, 0, false);
      hole.lineTo(hx + holeW, hy + holeH - holeR);
      hole.absarc(hx + holeW - holeR, hy + holeH - holeR, holeR, 0, Math.PI / 2, false);
      hole.lineTo(hx + holeR, hy + holeH);
      hole.absarc(hx + holeR, hy + holeH - holeR, holeR, Math.PI / 2, Math.PI, false);
      hole.lineTo(hx, hy + holeR);
      hole.absarc(hx + holeR, hy + holeR, holeR, Math.PI, Math.PI * 1.5, false);
      shape.holes.push(hole);

      return shape;
    }

    const cardShape = createRoundedCardShape(cardWidth, cardHeight, cardRadius);

    // Front Face Mesh
    const frontGeo = new THREE.ShapeGeometry(cardShape, 24);
    const fPos = frontGeo.attributes.position;
    const fUvs = [];
    const halfW = cardWidth / 2;
    const halfH = cardHeight / 2;
    for (let i = 0; i < fPos.count; i++) {
      const px = fPos.getX(i);
      const py = fPos.getY(i);
      fUvs.push((px + halfW) / cardWidth, (py + halfH) / cardHeight);
    }
    frontGeo.setAttribute('uv', new THREE.Float32BufferAttribute(fUvs, 2));
    frontGeo.computeVertexNormals();

    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.set(0, 0, cardThickness / 2);
    cardGroup.add(frontMesh);

    // Back Face Mesh (facing -Z with aligned UVs)
    const backGeo = new THREE.ShapeGeometry(cardShape, 24);
    const bPos = backGeo.attributes.position;
    const bUvs = [];
    for (let i = 0; i < bPos.count; i++) {
      const px = bPos.getX(i);
      const py = bPos.getY(i);
      bUvs.push((px + halfW) / cardWidth, (py + halfH) / cardHeight);
    }
    backGeo.setAttribute('uv', new THREE.Float32BufferAttribute(bUvs, 2));
    backGeo.computeVertexNormals();

    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, 0, -cardThickness / 2);
    backMesh.rotation.y = Math.PI;
    cardGroup.add(backMesh);

    // Beveled Polished Acrylic Rim Band Geometry
    const shapePoints = cardShape.getPoints(24);
    const nPts = shapePoints.length;
    const halfT = cardThickness / 2;
    const bevelSize = 0.004;

    const edgePositions = [];
    const edgeNormals = [];
    const edgeUvs = [];
    const edgeIndices = [];

    for (let ring = 0; ring < 4; ring++) {
      const z = ring === 0 ? halfT :
                ring === 1 ? halfT - bevelSize :
                ring === 2 ? -halfT + bevelSize :
                -halfT;
      const inset = (ring === 0 || ring === 3) ? 0.002 : 0;

      for (let i = 0; i < nPts; i++) {
        const pt = shapePoints[i];
        const nextPt = shapePoints[(i + 1) % nPts];
        const prevPt = shapePoints[(i - 1 + nPts) % nPts];
        const tangent = new THREE.Vector2().subVectors(nextPt, prevPt).normalize();
        const norm2D = new THREE.Vector2(-tangent.y, tangent.x).normalize();

        const px = pt.x - norm2D.x * inset;
        const py = pt.y - norm2D.y * inset;

        edgePositions.push(px, py, z);
        const nz = ring === 0 ? 0.5 : ring === 1 ? 0.1 : ring === 2 ? -0.1 : -0.5;
        const nLen = Math.hypot(norm2D.x, norm2D.y, nz);
        edgeNormals.push(norm2D.x / nLen, norm2D.y / nLen, nz / nLen);
        edgeUvs.push(i / nPts, ring / 3);
      }
    }

    for (let ring = 0; ring < 3; ring++) {
      const baseCurrent = ring * nPts;
      const baseNext = (ring + 1) * nPts;
      for (let i = 0; i < nPts; i++) {
        const iNext = (i + 1) % nPts;
        const a = baseCurrent + i;
        const b = baseNext + i;
        const c = baseCurrent + iNext;
        const d = baseNext + iNext;

        edgeIndices.push(a, b, c);
        edgeIndices.push(b, d, c);
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute('normal', new THREE.Float32BufferAttribute(edgeNormals, 3));
    edgeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(edgeUvs, 2));
    edgeGeo.setIndex(edgeIndices);
    edgeGeo.computeVertexNormals();

    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    cardGroup.add(edgeMesh);

    // Acrylic inner wall mesh for punched hole
    const holePath = cardShape.holes[0];
    const holePoints = holePath.getPoints(16);
    const nHPts = holePoints.length;
    const slotPositions = [];
    const slotNormals = [];
    const slotIndices = [];
    for (let i = 0; i < nHPts; i++) {
      const pt = holePoints[i];
      slotPositions.push(pt.x, pt.y, halfT);
      slotPositions.push(pt.x, pt.y, -halfT);
      const nx = pt.x;
      const ny = pt.y - (cardHeight / 2 - 0.10);
      const len = Math.hypot(nx, ny) || 1;
      slotNormals.push(-nx / len, -ny / len, 0);
      slotNormals.push(-nx / len, -ny / len, 0);
    }
    for (let i = 0; i < nHPts; i++) {
      const next = (i + 1) % nHPts;
      const topCurr = i * 2;
      const botCurr = i * 2 + 1;
      const topNext = next * 2;
      const botNext = next * 2 + 1;
      slotIndices.push(topCurr, topNext, botCurr);
      slotIndices.push(topNext, botNext, botCurr);
    }
    const slotGeo = new THREE.BufferGeometry();
    slotGeo.setAttribute('position', new THREE.Float32BufferAttribute(slotPositions, 3));
    slotGeo.setAttribute('normal', new THREE.Float32BufferAttribute(slotNormals, 3));
    slotGeo.setIndex(slotIndices);
    const slotMesh = new THREE.Mesh(slotGeo, edgeMat);
    cardGroup.add(slotMesh);

    // 7. Master 3D Badge Assembly (Rigidly joins Card, Clamp, and Hardware)
    const badgePivot = new THREE.Group();
    cardGroup.position.set(0, 0, 0);
    claspGroup.position.set(0, cardHeight / 2, 0);
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
    const claspAnchorLocal = new THREE.Vector3(0, 0.32, 0);

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
      claspAnchorLocal.set(0, 0.32, 0);
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
        const isMobile = (typeof window !== 'undefined' ? window.innerWidth : width) < 768;
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

      // Track exact world position where strap ribbons connect into the top of fabric collar
      claspAnchorLocal.set(0, 0.32, 0);
      claspGroup.localToWorld(claspAnchorPoint.copy(claspAnchorLocal));

      // Dynamic ribbon twist follows swivel rotation (untwists naturally as badge flips on swivel hook)
      const baseFaceAngle = isFlippedToBack ? Math.PI : 0;
      const ribbonTwist = (badgePivot.rotation.y - baseFaceAngle) * 0.65;
      updateStrapRibbon(leftStrapGeo, strapTopLeft, claspAnchorPoint, 0.17, 0.0, ribbonTwist);
      updateStrapRibbon(rightStrapGeo, strapTopRight, claspAnchorPoint, 0.17, 0.0, ribbonTwist);

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
      themeUpdateHandlerRef.current = null;
      renderer.dispose();
      strapMaterial.dispose();
      strapMaterialBack.dispose();
      collarMaterial.dispose();
      metalMaterial.dispose();
      strapTexture.dispose();
      strapBackTexture.dispose();
      collarTexture.dispose();
      leftStrapGeo.dispose();
      rightStrapGeo.dispose();
      frontMat.dispose();
      backMat.dispose();
      edgeMat.dispose();
      cardTexture.dispose();
      cardBackTexture.dispose();
      frontGeo.dispose();
      backGeo.dispose();
      edgeGeo.dispose();
      slotGeo.dispose();
      hookGeo.dispose();
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
