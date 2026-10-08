import React from 'react';

/**
 * HeroVisuals Component
 * Renders the luxury glassmorphism atmosphere framing the ID card and hero section:
 * 1. Soft atmospheric circular glow behind the badge
 * 2. Elegant sweeping organic glass ribbon framing the ID badge
 * 3. Concentric orbital curves and glowing satellite coordinate dots
 * 4. Subtle 6x6 dot-grid matrix in lavender/violet
 * 5. Multi-layered flowing organic glass waves with luminous crest lines at bottom
 *
 * Matching the exact visual aesthetic in the reference mockup (media_1791128593723.jpg).
 */
export default function HeroVisuals() {
  return (
    <div className="hero-visuals-container" aria-hidden="true">
      {/* Visual elements anchored strictly to the RIGHT HERO COLUMN framing the ID card */}
      <div className="hero-right-visuals-anchor">
        {/* 1. Large Soft Atmospheric Glow */}
        <div className="hero-radial-glow" />

        {/* 2. Sweeping Organic Glass Ribbon Framing ID Badge */}
        <div className="hero-glass-ribbon-box">
          <svg
            viewBox="0 0 720 720"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hero-glass-ribbon-svg"
          >
            <defs>
              <linearGradient id="heroRibbonGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#C084FC" stopOpacity="0.20" />
                <stop offset="85%" stopColor="#EC4899" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="heroRibbonGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.55" />
                <stop offset="40%" stopColor="#F4C2D7" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#FEDACB" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
              </linearGradient>

              <linearGradient id="heroRibbonEdgeDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#C084FC" stopOpacity="0.65" />
                <stop offset="80%" stopColor="#F472B6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="heroRibbonEdgeLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#C084FC" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#F472B6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Organic Flowing Ribbon: Curving gracefully behind the card */}
            <path
              d="M 380 40 C 560 120, 680 280, 640 460 C 600 620, 420 680, 240 640 C 140 610, 80 540, 40 450 C 120 480, 260 520, 390 460 C 510 400, 560 260, 460 140 C 420 90, 395 65, 380 40 Z"
              className="hero-ribbon-body"
            />

            {/* Luminous Outer Glass Edge Highlight */}
            <path
              d="M 380 40 C 560 120, 680 280, 640 460 C 600 620, 420 680, 240 640"
              className="hero-ribbon-stroke"
            />
          </svg>
        </div>

        {/* 3. 6x6 Dot-Grid Pattern (Left of ID card) */}
        <div className="hero-dot-grid-box">
          <svg viewBox="0 0 130 150" fill="none" className="dot-grid-svg">
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <circle
                  key={`dot-${r}-${c}`}
                  cx={15 + c * 20}
                  cy={15 + r * 24}
                  r="1.8"
                  className="grid-dot"
                />
              ))
            )}
          </svg>
        </div>

        {/* 4. Concentric Orbital Curves Framing the Card */}
        <div className="hero-orbit-box">
          <svg viewBox="0 0 640 640" fill="none" className="orbit-svg">
            {/* Inner Dashed Orbital Ring */}
            <circle
              cx="320"
              cy="320"
              r="230"
              className="orbit-ring-inner"
              strokeDasharray="5 7"
            />
            {/* Outer Sweeping Orbital Arc */}
            <path
              d="M 120 480 A 280 280 0 0 0 540 160"
              className="orbit-ring-outer"
            />
            {/* Secondary Counter Arc */}
            <path
              d="M 180 140 A 260 260 0 0 1 500 480"
              className="orbit-ring-subtle"
            />
            {/* Satellite Coordinate Accent Dots */}
            <circle cx="540" cy="160" r="3.5" className="orbit-dot-1" />
            <circle cx="120" cy="480" r="2.5" className="orbit-dot-2" />
            <circle cx="320" cy="90" r="2.0" className="orbit-dot-3" />
          </svg>
        </div>
      </div>

      {/* 5. Layered Flowing Organic Glass Waves with Luminous Crest Lines at Bottom */}
      <div className="hero-waves-wrapper">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="waves-svg"
        >
          {/* Wave Layer 1 (Deepest / Back) */}
          <path
            d="M 0 115 C 260 65, 480 150, 760 110 C 1040 70, 1260 140, 1440 100 L 1440 220 L 0 220 Z"
            className="wave-path wave-1"
          />

          {/* Wave Layer 2 (Mid-Back) */}
          <path
            d="M 0 135 C 320 95, 540 165, 860 125 C 1140 85, 1320 155, 1440 120 L 1440 220 L 0 220 Z"
            className="wave-path wave-2"
          />

          {/* Accent Crest Line 1 */}
          <path
            d="M 0 135 C 320 95, 540 165, 860 125 C 1140 85, 1320 155, 1440 120"
            className="wave-accent-line wave-accent-1"
          />

          {/* Wave Layer 3 (Mid-Front) */}
          <path
            d="M 0 158 C 280 124, 580 186, 920 146 C 1180 116, 1360 170, 1440 145 L 1440 220 L 0 220 Z"
            className="wave-path wave-3"
          />

          {/* Accent Crest Line 2 */}
          <path
            d="M 0 158 C 280 124, 580 186, 920 146 C 1180 116, 1360 170, 1440 145"
            className="wave-accent-line wave-accent-2"
          />

          {/* Wave Layer 4 (Front Forefront) */}
          <path
            d="M 0 180 C 340 150, 640 200, 1000 170 C 1220 150, 1360 190, 1440 175 L 1440 220 L 0 220 Z"
            className="wave-path wave-4"
          />
        </svg>
      </div>

      <style>{`
        .hero-visuals-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        /* Anchor container aligning decorative graphics specifically with the RIGHT hero column */
        .hero-right-visuals-anchor {
          position: absolute;
          top: 0;
          bottom: 0;
          right: max(0px, calc((100% - 1440px) / 2));
          width: 52%;
          max-width: 740px;
          pointer-events: none;
          overflow: visible;
        }

        /* 1. Large Soft Atmospheric Glow framing ID badge (CSS Radial Gradient, 0 Blur cost) */
        .hero-radial-glow {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: clamp(380px, 42vw, 580px);
          height: clamp(380px, 42vw, 580px);
          border-radius: 50%;
          background: var(--hero-glow);
          transition: background 600ms ease-in-out;
          opacity: 0.88;
          pointer-events: none;
        }

        /* 2. Sweeping Organic Glass Ribbon Box */
        .hero-glass-ribbon-box {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: clamp(480px, 50vw, 720px);
          height: clamp(480px, 50vw, 720px);
          z-index: 1;
          pointer-events: none;
          will-change: transform;
          animation: floatHeroRibbon 36s ease-in-out infinite alternate;
        }

        .hero-glass-ribbon-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .hero-ribbon-body {
          transition: fill 600ms ease-in-out;
        }

        [data-theme="dark"] .hero-ribbon-body {
          fill: url(#heroRibbonGradDark);
        }

        [data-theme="light"] .hero-ribbon-body {
          fill: url(#heroRibbonGradLight);
        }

        .hero-ribbon-stroke {
          fill: none;
          stroke-width: 1.6;
          transition: stroke 600ms ease-in-out;
        }

        [data-theme="dark"] .hero-ribbon-stroke {
          stroke: url(#heroRibbonEdgeDark);
        }

        [data-theme="light"] .hero-ribbon-stroke {
          stroke: url(#heroRibbonEdgeLight);
        }

        /* 3. 6x6 Dot Grid (Framing left edge of right column) */
        .hero-dot-grid-box {
          position: absolute;
          top: 38%;
          left: 2%;
          width: 130px;
          height: 150px;
          opacity: 0.70;
          z-index: 2;
        }

        .dot-grid-svg {
          width: 100%;
          height: 100%;
        }

        .grid-dot {
          fill: var(--hero-dot-grid);
          transition: fill 500ms ease-in-out;
        }

        /* 4. Orbital Curves framing the card */
        .hero-orbit-box {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(400px, 42vw, 600px);
          height: clamp(400px, 42vw, 600px);
          z-index: 2;
        }

        .orbit-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .orbit-ring-inner {
          stroke: var(--hero-orbit-1);
          stroke-width: 1.2;
          transition: stroke 500ms ease-in-out;
          animation: orbitRotateClockwise 85s linear infinite;
          transform-origin: 320px 320px;
        }

        .orbit-ring-outer {
          stroke: var(--hero-orbit-2);
          stroke-width: 1.4;
          transition: stroke 500ms ease-in-out;
        }

        .orbit-ring-subtle {
          stroke: var(--hero-orbit-1);
          stroke-width: 0.85;
          opacity: 0.45;
          transition: stroke 500ms ease-in-out;
        }

        .orbit-dot-1 {
          fill: var(--hero-orbit-1);
          transition: fill 500ms ease-in-out;
        }

        .orbit-dot-2,
        .orbit-dot-3 {
          fill: var(--hero-orbit-2);
          transition: fill 500ms ease-in-out;
        }

        /* 5. Layered Flowing Organic Glass Waves */
        .hero-waves-wrapper {
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          width: 100%;
          height: clamp(65px, 8vw, 105px);
          z-index: 3;
        }

        .waves-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .wave-path {
          transition: fill 500ms ease-in-out;
        }

        .wave-1 {
          fill: var(--wave-1);
          will-change: transform;
          animation: waveOscillate 24s ease-in-out infinite alternate;
        }

        .wave-2 {
          fill: var(--wave-2);
          will-change: transform;
          animation: waveOscillate 20s ease-in-out infinite alternate-reverse;
        }

        .wave-3 {
          fill: var(--wave-3);
          will-change: transform;
          animation: waveOscillate 22s ease-in-out infinite alternate;
        }

        .wave-4 {
          fill: var(--wave-4);
        }

        .wave-accent-line {
          fill: none;
          stroke: var(--wave-accent);
          transition: stroke 500ms ease-in-out;
        }

        .wave-accent-1 {
          stroke-width: 1.6;
          opacity: 0.85;
          will-change: transform;
          animation: waveOscillate 20s ease-in-out infinite alternate-reverse;
        }

        .wave-accent-2 {
          stroke-width: 1.2;
          opacity: 0.65;
          will-change: transform;
          animation: waveOscillate 22s ease-in-out infinite alternate;
        }

        /* Smooth 60 FPS Keyframes (Strictly translate3d, No scale, No blur) */
        @keyframes waveOscillate {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-10px, 0, 0);
          }
          100% {
            transform: translate3d(10px, 0, 0);
          }
        }

        @keyframes orbitRotateClockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatHeroRibbon {
          0% {
            transform: translate3d(-50%, -50%, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-51%, -49%, 0) rotate(1.5deg);
          }
          100% {
            transform: translate3d(-49%, -51%, 0) rotate(-1deg);
          }
        }

        /* Reduced Motion Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .wave-1,
          .wave-2,
          .wave-3,
          .wave-accent-1,
          .wave-accent-2,
          .orbit-ring-inner,
          .hero-glass-ribbon-box {
            animation: none !important;
            transform: none !important;
            will-change: auto !important;
          }
        }

        @media (max-width: 1023px) {
          .hero-right-visuals-anchor {
            width: 100%;
            right: 0;
            left: 0;
            top: auto;
            bottom: 40px;
            height: 480px;
          }
          .hero-dot-grid-box {
            display: none;
          }
          .hero-orbit-box {
            width: 360px;
            height: 360px;
          }
          .hero-radial-glow {
            width: 320px;
            height: 320px;
          }
          .hero-glass-ribbon-box {
            width: 420px;
            height: 420px;
          }
          .hero-waves-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 60px;
            z-index: 3;
          }
        }

        @media (max-width: 767px) {
          /* Anchor visuals directly behind the mobile lanyard ID badge at top of hero */
          .hero-right-visuals-anchor {
            width: 100%;
            right: 0;
            left: 0;
            top: calc(var(--header-height, 70px) + 32px);
            bottom: auto;
            height: 360px;
          }
          .hero-orbit-box {
            width: 340px;
            height: 340px;
          }
          .hero-radial-glow {
            width: 320px;
            height: 320px;
          }
          /* Hide duplicate hero ribbon box on mobile so GlobalGlassBackground ribbon-layer-1 remains the sole elegant ribbon */
          .hero-glass-ribbon-box {
            display: none;
          }
          .hero-waves-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 60px;
            z-index: 3;
          }
        }
      `}</style>
    </div>
  );
}
