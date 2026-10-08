import React from 'react';

/**
 * GlobalGlassBackground Component (High Performance 60 FPS Edition)
 *
 * Renders a 4K-grade luxury glassmorphism background texture inspired by the Aleena R ID card:
 * - Color Palette: Lavender, Soft purple, Deep violet, Pink, Blush, Subtle peach, White/cream highlights
 *
 * Performance Optimizations:
 * 1. Zero full-screen GPU blur filters (replaced with static multi-stop CSS radial gradients).
 * 2. Zero SVG filter tags (<filter>, feGaussianBlur, drop-shadow).
 * 3. Only 2 organic flowing vector glass ribbons with GPU translate3d hardware compositing.
 * 4. Animates strictly transform: translate3d() at ultra-smooth low frequency (50s-60s).
 * 5. will-change: transform scoped strictly to the two moving elements.
 * 6. contain: strict and pointer-events: none for zero-cost layout/hit-testing.
 * 7. Full prefers-reduced-motion support.
 */
export default function GlobalGlassBackground() {
  return (
    <div className="global-glass-bg" aria-hidden="true">
      {/* 1. Static Multi-Stop CSS Atmospheric Ambient Layer (0 GPU Blur Cost) */}
      <div className="global-glass-ambient" />

      {/* 2. Primary Flowing Glass Ribbon Layer (Upper & Right Flow framing ID card) */}
      <div className="glass-ribbon-container ribbon-layer-1">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          className="glass-ribbon-svg"
        >
          <defs>
            {/* Dark Theme Gradients */}
            <linearGradient id="darkRibbonGrad1" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.22" />
              <stop offset="35%" stopColor="#C084FC" stopOpacity="0.16" />
              <stop offset="70%" stopColor="#E879F9" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="darkEdgeGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#F472B6" stopOpacity="0.55" />
              <stop offset="80%" stopColor="#C084FC" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Light Theme Gradients */}
            <linearGradient id="lightRibbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.45" />
              <stop offset="30%" stopColor="#F4C2D7" stopOpacity="0.40" />
              <stop offset="65%" stopColor="#FEDACB" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.18" />
            </linearGradient>

            <linearGradient id="lightEdgeGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#C084FC" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#F472B6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sweeping Ribbon 1: Upper Right curve cascading down towards mid-right */}
          <path
            d="M 1100 -80 C 1380 120, 1750 180, 1960 480 C 2060 620, 1880 820, 1680 920 C 1460 1030, 1180 960, 980 1080 L 1960 1080 L 1960 -80 Z"
            className="ribbon-path ribbon-fill-1"
          />

          {/* Luminous Edge Highlight Path 1 (Clean vector stroke, zero drop-shadow filter) */}
          <path
            d="M 1100 -80 C 1380 120, 1750 180, 1960 480 C 2060 620, 1880 820, 1680 920 C 1460 1030, 1180 960, 980 1080"
            className="ribbon-edge ribbon-edge-1"
          />
        </svg>
      </div>

      {/* 3. Secondary Flowing Glass Ribbon Layer (Lower & Left Flow) */}
      <div className="glass-ribbon-container ribbon-layer-2">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          className="glass-ribbon-svg"
        >
          <defs>
            <linearGradient id="darkRibbonGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="lightRibbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#C084FC" stopOpacity="0.28" />
              <stop offset="85%" stopColor="#FEDACB" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Sweeping Ribbon 2: Bottom flowing organic wave draping across page */}
          <path
            d="M -100 820 C 280 680, 680 880, 1120 760 C 1480 660, 1780 820, 2040 720 L 2040 1200 L -100 1200 Z"
            className="ribbon-path ribbon-fill-2"
          />

          {/* Luminous Edge Highlight Path 2 */}
          <path
            d="M -100 820 C 280 680, 680 880, 1120 760 C 1480 660, 1780 820, 2040 720"
            className="ribbon-edge ribbon-edge-2"
          />
        </svg>
      </div>

      {/* 4. Subtle Shimmer / Light Sheen Layer (Pure Static CSS Gradient) */}
      <div className="glass-light-sheen" />

      {/* 5. Central Low-Contrast Readability Mask (Protects Text Readability) */}
      <div className="glass-readability-scrim" />

      <style>{`
        .global-glass-bg {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          contain: strict;
          transform-style: flat;
        }

        /* 1. Static Ambient Mesh via Multi-Stop CSS Radial Gradients (Zero GPU Blur) */
        .global-glass-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: background 600ms ease;
        }

        [data-theme="dark"] .global-glass-ambient {
          background:
            radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.22) 0%, rgba(236, 72, 153, 0.12) 32%, transparent 62%),
            radial-gradient(circle at 10% 42%, rgba(147, 51, 234, 0.18) 0%, rgba(192, 132, 252, 0.10) 36%, transparent 66%),
            radial-gradient(circle at 82% 82%, rgba(168, 85, 247, 0.20) 0%, rgba(244, 114, 182, 0.10) 34%, transparent 62%),
            radial-gradient(circle at 14% 92%, rgba(126, 34, 206, 0.20) 0%, rgba(192, 132, 252, 0.08) 36%, transparent 66%);
        }

        [data-theme="light"] .global-glass-ambient {
          background:
            radial-gradient(circle at 85% 15%, rgba(216, 180, 254, 0.46) 0%, rgba(244, 194, 215, 0.32) 34%, rgba(254, 218, 203, 0.20) 56%, transparent 72%),
            radial-gradient(circle at 10% 42%, rgba(244, 194, 215, 0.38) 0%, rgba(216, 180, 254, 0.26) 36%, transparent 68%),
            radial-gradient(circle at 82% 82%, rgba(216, 180, 254, 0.42) 0%, rgba(254, 218, 203, 0.28) 38%, transparent 68%),
            radial-gradient(circle at 14% 92%, rgba(244, 194, 215, 0.35) 0%, rgba(216, 180, 254, 0.22) 36%, transparent 66%);
        }

        /* 2. Flowing Glass Ribbon Containers */
        .glass-ribbon-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .glass-ribbon-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Ribbon Layer Gentle Drifts: Hardware-accelerated translate3d only */
        .ribbon-layer-1 {
          will-change: transform;
          animation: floatRibbon1 55s ease-in-out infinite alternate;
          opacity: 0.95;
        }

        .ribbon-layer-2 {
          will-change: transform;
          animation: floatRibbon2 65s ease-in-out infinite alternate-reverse;
          opacity: 0.90;
        }

        /* Ribbon Fills */
        .ribbon-path {
          transition: fill 600ms ease;
        }

        [data-theme="dark"] .ribbon-fill-1 {
          fill: url(#darkRibbonGrad1);
        }
        [data-theme="dark"] .ribbon-fill-2 {
          fill: url(#darkRibbonGrad2);
        }

        [data-theme="light"] .ribbon-fill-1 {
          fill: url(#lightRibbonGrad1);
        }
        [data-theme="light"] .ribbon-fill-2 {
          fill: url(#lightRibbonGrad2);
        }

        /* Luminous Glass Edge Highlights (Crisp Vector Borders, 0 filter cost) */
        .ribbon-edge {
          fill: none;
          stroke-linecap: round;
          transition: stroke 600ms ease;
        }

        [data-theme="dark"] .ribbon-edge-1 {
          stroke: url(#darkEdgeGlow1);
          stroke-width: 1.4;
        }
        [data-theme="dark"] .ribbon-edge-2 {
          stroke: url(#darkEdgeGlow1);
          stroke-width: 1.2;
        }

        [data-theme="light"] .ribbon-edge-1 {
          stroke: url(#lightEdgeGlow1);
          stroke-width: 1.5;
        }
        [data-theme="light"] .ribbon-edge-2 {
          stroke: url(#lightEdgeGlow1);
          stroke-width: 1.3;
        }

        /* Soft Shimmer Overlay (Pure Static Gradient) */
        .glass-light-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: background 600ms ease;
        }

        [data-theme="dark"] .glass-light-sheen {
          background: radial-gradient(
            circle at 65% 30%,
            rgba(255, 255, 255, 0.04) 0%,
            transparent 60%
          );
        }

        [data-theme="light"] .glass-light-sheen {
          background: radial-gradient(
            circle at 65% 30%,
            rgba(255, 255, 255, 0.35) 0%,
            transparent 60%
          );
        }

        /* Readability Scrim: Protects Central Text Areas */
        .glass-readability-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: background 600ms ease;
        }

        [data-theme="dark"] .glass-readability-scrim {
          background: radial-gradient(
            circle at 45% 50%,
            rgba(11, 7, 19, 0.45) 0%,
            rgba(11, 7, 19, 0.15) 60%,
            transparent 100%
          );
        }

        [data-theme="light"] .glass-readability-scrim {
          background: radial-gradient(
            circle at 45% 50%,
            rgba(253, 249, 247, 0.40) 0%,
            rgba(253, 249, 247, 0.10) 60%,
            transparent 100%
          );
        }

        /* Ultra-Smooth Keyframes (Strictly translate3d, No scale, No blur) */
        @keyframes floatRibbon1 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-12px, 10px, 0);
          }
        }

        @keyframes floatRibbon2 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(14px, -12px, 0);
          }
        }

        /* Accessibility: Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .ribbon-layer-1,
          .ribbon-layer-2 {
            animation: none !important;
            transform: none !important;
            will-change: auto !important;
          }
        }

        /* Mobile Responsive Background: Visually anchored to section, scrolls 1:1 with content, zero address-bar jump */
        @media (max-width: 767px) {
          .global-glass-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            min-height: 100%;
            overflow: hidden;
            contain: paint;
            transform-style: flat;
          }

          /* Ambient mesh: smoothly covers mobile hero with stable dimensions */
          .global-glass-ambient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 1400px;
          }

          /* Primary ribbon layer: anchored to hero section, scrolls 1:1, stable height */
          .glass-ribbon-container.ribbon-layer-1 {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 1400px;
            animation: none !important;
            transform: none !important;
            will-change: auto !important;
          }

          /* Hide secondary bottom ribbon on mobile to avoid clutter */
          .glass-ribbon-container.ribbon-layer-2 {
            display: none;
          }

          .glass-light-sheen,
          .glass-readability-scrim {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 1400px;
          }
        }
      `}</style>
    </div>
  );
}
