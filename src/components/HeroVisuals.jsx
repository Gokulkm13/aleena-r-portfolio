import React from 'react';

/**
 * HeroVisuals Component
 * Renders the maritime visual atmosphere framing the ID card:
 * 1. Soft atmospheric circular glow
 * 2. Elegant gold & blue orbital curves
 * 3. 6x6 Dot-grid matrix
 * 4. Subtle maritime vessel silhouette with bridge deck details
 * 5. Multi-layered ocean waves with gold/orange crest highlight lines at bottom
 */
export default function HeroVisuals() {
  return (
    <div className="hero-visuals-container" aria-hidden="true">
      {/* Visual elements anchored strictly to the RIGHT HERO COLUMN framing the ID card */}
      <div className="hero-right-visuals-anchor">
        {/* 1. Large Soft Atmospheric Glow */}
        <div className="hero-radial-glow" />

      {/* 2. 6x6 Dot-Grid Pattern (Left of ID card) */}
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

      {/* 3. Concentric Orbital Curves Framing the Card */}
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

      {/* 4. Subtle Maritime Ship Silhouette (Right Background) */}
      <div className="hero-ship-silhouette">
        <svg
          viewBox="0 0 680 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ship-svg"
        >
          {/* Waterline & Hull of Research / Commercial Vessel */}
          <path
            d="M 40 265 L 140 265 Q 180 265 220 262 L 530 250 Q 585 246 620 220 L 645 200 L 590 200 L 550 215 L 210 222 L 140 225 L 80 235 Z"
            className="ship-hull"
          />
          {/* Main Deck Structure / Accommodation House */}
          <path
            d="M 230 222 L 230 170 L 360 170 L 360 220 Z"
            className="ship-superstructure"
          />
          {/* Upper Bridge Tier & Command Cabin */}
          <path
            d="M 260 170 L 260 125 L 340 125 L 348 170 Z"
            className="ship-bridge"
          />
          {/* Bridge Wings (Port & Starboard) */}
          <path
            d="M 245 140 L 362 140 L 360 148 L 247 148 Z"
            className="ship-details"
          />
          {/* Main Mast & Communication Array */}
          <line x1="305" y1="125" x2="305" y2="40" className="ship-mast-line" />
          <line x1="285" y1="65" x2="325" y2="65" className="ship-mast-line" />
          <line x1="295" y1="90" x2="315" y2="90" className="ship-mast-line" />
          {/* Rotating Radar Scanner */}
          <ellipse cx="305" cy="40" rx="14" ry="4" className="ship-radar" />
          {/* Forward Foredeck Cargo Cranes & Winches */}
          <path
            d="M 440 218 L 470 145 L 478 147 L 452 217 Z"
            className="ship-details"
          />
          <line x1="470" y1="145" x2="520" y2="195" className="ship-wire" />
          <path
            d="M 390 220 L 415 160 L 422 162 L 400 219 Z"
            className="ship-details"
          />
          {/* Exhaust Funnel Stack */}
          <path
            d="M 215 200 L 205 145 L 225 145 L 230 200 Z"
            className="ship-funnel"
          />
          {/* Bridge Illumination Lights (Visible at night in dark mode) */}
          <circle cx="280" cy="135" r="2" className="ship-nav-light" />
          <circle cx="300" cy="135" r="2" className="ship-nav-light" />
          <circle cx="320" cy="135" r="2" className="ship-nav-light" />
          <circle cx="305" cy="48" r="2.5" className="ship-mast-light" />
        </svg>
      </div>
      </div>

      {/* 5. Layered Flowing Ocean Waves with Accent Lines at Bottom */}
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
            d="M 0 120 C 260 70 480 155 760 115 C 1040 75 1260 145 1440 105 L 1440 220 L 0 220 Z"
            className="wave-path wave-1"
          />

          {/* Wave Layer 2 (Mid-Back) */}
          <path
            d="M 0 140 C 320 100 540 170 860 130 C 1140 90 1320 160 1440 125 L 1440 220 L 0 220 Z"
            className="wave-path wave-2"
          />

          {/* Accent Gold/Orange Crest Line 1 */}
          <path
            d="M 0 140 C 320 100 540 170 860 130 C 1140 90 1320 160 1440 125"
            className="wave-accent-line wave-accent-1"
          />

          {/* Wave Layer 3 (Mid-Front) */}
          <path
            d="M 0 162 C 280 128 580 190 920 150 C 1180 120 1360 175 1440 150 L 1440 220 L 0 220 Z"
            className="wave-path wave-3"
          />

          {/* Accent Gold/Orange Crest Line 2 */}
          <path
            d="M 0 162 C 280 128 580 190 920 150 C 1180 120 1360 175 1440 150"
            className="wave-accent-line wave-accent-2"
          />

          {/* Wave Layer 4 (Front Forefront) */}
          <path
            d="M 0 182 C 340 155 640 205 1000 175 C 1220 155 1360 195 1440 180 L 1440 220 L 0 220 Z"
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
          width: 48%;
          max-width: 690px;
          pointer-events: none;
          overflow: visible;
        }

        /* 1. Large Soft Atmospheric Glow framing ID badge */
        .hero-radial-glow {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(360px, 38vw, 540px);
          height: clamp(360px, 38vw, 540px);
          border-radius: 50%;
          background: var(--hero-glow);
          filter: blur(45px);
          transition: background 600ms ease-in-out;
          opacity: 0.85;
        }

        /* 2. 6x6 Dot Grid (Framing left edge of right column) */
        .hero-dot-grid-box {
          position: absolute;
          top: 38%;
          left: 4%;
          width: 130px;
          height: 150px;
          opacity: 0.75;
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

        /* 3. Orbital Curves framing the card */
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
          filter: drop-shadow(0 0 6px var(--hero-orbit-1));
          transition: fill 500ms ease-in-out;
        }

        .orbit-dot-2,
        .orbit-dot-3 {
          fill: var(--hero-orbit-2);
          transition: fill 500ms ease-in-out;
        }

        /* 4. Maritime Ship Silhouette */
        .hero-ship-silhouette {
          position: absolute;
          top: 20%;
          right: 2%;
          width: clamp(240px, 24vw, 360px);
          opacity: var(--ship-opacity);
          z-index: 2;
          transition: opacity 500ms ease-in-out;
        }

        .ship-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .ship-hull,
        .ship-superstructure,
        .ship-bridge,
        .ship-funnel {
          fill: var(--primary-navy);
          transition: fill 500ms ease-in-out;
        }

        .ship-details {
          fill: var(--accent-blue-soft);
          transition: fill 500ms ease-in-out;
        }

        .ship-mast-line,
        .ship-radar,
        .ship-wire {
          stroke: var(--primary-navy);
          stroke-width: 1.5;
          transition: stroke 500ms ease-in-out;
        }

        .ship-wire {
          stroke-width: 0.75;
          opacity: 0.6;
        }

        .ship-nav-light {
          fill: #FFE699;
          opacity: 0.85;
        }

        [data-theme="light"] .ship-nav-light {
          fill: #E9A24A;
          opacity: 0.5;
        }

        .ship-mast-light {
          fill: #F28C18;
          filter: drop-shadow(0 0 5px #F28C18);
        }

        /* 5. Layered Flowing Ocean Waves */
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
          animation: waveOscillate 18s ease-in-out infinite alternate;
        }

        .wave-2 {
          fill: var(--wave-2);
          animation: waveOscillate 14s ease-in-out infinite alternate-reverse;
        }

        .wave-3 {
          fill: var(--wave-3);
          animation: waveOscillate 16s ease-in-out infinite alternate;
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
          animation: waveOscillate 14s ease-in-out infinite alternate-reverse;
        }

        .wave-accent-2 {
          stroke-width: 1.2;
          opacity: 0.65;
          animation: waveOscillate 16s ease-in-out infinite alternate;
        }

        /* Subtle Gentle Wave Motion */
        @keyframes waveOscillate {
          0% {
            transform: translateX(0) scaleY(1);
          }
          50% {
            transform: translateX(-18px) scaleY(1.03);
          }
          100% {
            transform: translateX(18px) scaleY(0.98);
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

        /* Reduced Motion Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .wave-1,
          .wave-2,
          .wave-3,
          .wave-accent-1,
          .wave-accent-2,
          .orbit-ring-inner {
            animation: none !important;
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
          .hero-ship-silhouette {
            top: 6%;
            right: 4%;
            width: 200px;
            opacity: 0.12;
          }
          .hero-waves-wrapper {
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
}
