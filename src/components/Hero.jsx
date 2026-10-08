import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Link2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import Lanyard from './Lanyard';
import HeroVisuals from './HeroVisuals';
import ScrambleNumber from './ScrambleNumber';

// Module-scoped one-time guard ensuring hero stats animate at most ONCE per page lifecycle
let heroStatsHasAnimated = false;

export default function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(heroStatsHasAnimated);
  const desktopStatsRef = useRef(null);
  const mobileStatsRef = useRef(null);
  const hasTriggeredRef = useRef(heroStatsHasAnimated);

  useEffect(() => {
    // If already animated in this session, do nothing
    if (heroStatsHasAnimated || hasTriggeredRef.current) {
      if (!shouldAnimate) setShouldAnimate(true);
      return;
    }

    // Accessibility: check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroStatsHasAnimated = true;
      hasTriggeredRef.current = true;
      setShouldAnimate(true);
      return;
    }

    const handleTrigger = () => {
      if (hasTriggeredRef.current || heroStatsHasAnimated) return;
      hasTriggeredRef.current = true;
      heroStatsHasAnimated = true;
      setShouldAnimate(true);
    };

    if (typeof IntersectionObserver === 'undefined') {
      handleTrigger();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            handleTrigger();
            // Disconnect immediately after first successful trigger
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    if (desktopStatsRef.current) observer.observe(desktopStatsRef.current);
    if (mobileStatsRef.current) observer.observe(mobileStatsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldAnimate]);

  return (
    <section id="hero" className="hero-section" aria-label="Hero Section">
      {/* Background Graphic Elements: Glow, Orbital Curves, Dot Grid, Ship Silhouette & Layered Waves */}
      <HeroVisuals />

      <div className="container hero-container">
        {/* Left Column: Authentic Editorial Hierarchy */}
        <div className="hero-content">
          {/* Top Discipline Tag matching reference design */}
          <div className="hero-tag-wrap">
            <span className="hero-category-tag">
              PSYCHOLOGY • RESEARCH<span className="hero-category-separator"> • </span><span className="hero-category-hr">HUMAN RESOURCES</span>
            </span>
          </div>

          {/* Bold Modern Geometric Wordmark Heading: ALEENA R */}
          <div className="hero-wordmark-wrap">
            <h1 className="hero-name hero-bold-modern" aria-label="ALEENA R">
              <span className="wordmark-aleena">ALEENA</span>
              <span className="wordmark-r">R</span>
            </h1>
          </div>

          {/* Role Subtitle & Maritime Company Name */}
          <p className="hero-role">{personalInfo.role}</p>
          <p className="hero-company">{personalInfo.company}</p>

          {/* Verified Maritime Company Link */}
          <div className="hero-company-link-row">
            <a
              href={personalInfo.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-company-link"
              aria-label="Visit S&O Maritime Services company website"
            >
              <span>Company Website</span>
              <ArrowUpRight size={14} className="company-link-arrow" />
            </a>
            <span className="company-link-separator">|</span>
            <a
              href={personalInfo.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-company-url"
            >
              https://www.sandomaritime.com/
            </a>
          </div>

          {/* Executive Statement Paragraph */}
          <p className="hero-statement">
            I’m a Psychology postgraduate with a growing interest in human resources, workplace behaviour, and meaningful people-focused practices. My academic journey in Psychology, combined with clinical internships, research experience, and professional exposure, has shaped the way I understand people, communication, and organizational environments.
          </p>

          {/* Action CTAs: Solid Primary + Outline Secondary */}
          <div className="hero-actions">
            <a href="#about" className="btn-primary btn-hero-primary">
              <span>EXPLORE MY PROFILE</span>
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-secondary btn-hero-secondary">
              <Link2 size={16} />
              <span>LET'S CONNECT</span>
            </a>
          </div>

          {/* Academic & Professional Metrics Strip (Desktop) */}
          <div ref={desktopStatsRef} className="hero-meta-strip hero-meta-desktop">
            <div className="meta-item">
              <span className="meta-number" aria-label="03+ Clinical & HR Internships">
                <ScrambleNumber text="03+" duration={880} shouldAnimate={shouldAnimate} />
              </span>
              <span className="meta-label">Clinical & HR Internships</span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <span className="meta-number" aria-label="02 Research Publications">
                <ScrambleNumber text="02" duration={1020} shouldAnimate={shouldAnimate} />
              </span>
              <span className="meta-label">Research Publications</span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <span className="meta-number" aria-label="MSc Psychology">
                <ScrambleNumber text="MSc" duration={1160} shouldAnimate={shouldAnimate} />
              </span>
              <span className="meta-label">Psychology</span>
            </div>
          </div>
        </div>

        {/* Right Column: Locked 3D Interactive Hanging Lanyard Badge */}
        <div className="hero-lanyard-col">
          <Lanyard />
        </div>

        {/* Academic & Professional Metrics Strip (Mobile: rendered below ID card) */}
        <div ref={mobileStatsRef} className="hero-meta-strip hero-meta-mobile">
          <div className="meta-item">
            <span className="meta-number" aria-label="03+ Clinical & HR Internships">
              <ScrambleNumber text="03+" duration={880} shouldAnimate={shouldAnimate} />
            </span>
            <span className="meta-label">Clinical & HR Internships</span>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <span className="meta-number" aria-label="02 Research Publications">
              <ScrambleNumber text="02" duration={1020} shouldAnimate={shouldAnimate} />
            </span>
            <span className="meta-label">Research Publications</span>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <span className="meta-number" aria-label="MSc Psychology">
              <ScrambleNumber text="MSc" duration={1160} shouldAnimate={shouldAnimate} />
            </span>
            <span className="meta-label">Psychology</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          min-height: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          padding-top: calc(var(--header-height) + 16px);
          /* Exactly 52px breathing space between statistics and beginning of wave graphic */
          padding-bottom: calc(clamp(65px, 8vw, 105px) + 52px);
          box-sizing: border-box;
          overflow: hidden;
          background: transparent;
          transition: background-color 500ms ease-in-out;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 56px;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
          gap: 2.5rem;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 680px;
          width: 100%;
          z-index: 10;
        }



        /* 1. Eyebrow -> heading: 18px (reduced from 24px) */
        .hero-tag-wrap {
          margin-bottom: 18px;
          position: relative;
          z-index: 10;
        }

        .hero-category-tag {
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 15px; /* 14–16px */
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          transition: color 500ms ease-in-out;
        }

        [data-theme="light"] .hero-category-tag {
          color: #7E22CE;
        }

        [data-theme="dark"] .hero-category-tag {
          color: #C084FC;
        }

        .hero-category-hr {
          white-space: nowrap;
        }

        /* 2. Modern Luxury Editorial Wordmark Container */
        .hero-wordmark-wrap,
        .hero-signature-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: fit-content;
          max-width: 100%;
          margin: 0 0 14px 0;
          z-index: 5;
        }

        /* Bold Modern Geometric Wordmark: ALEENA R */
        .hero-name.hero-bold-modern,
        .hero-name.hero-editorial-wordmark,
        .hero-name.hero-signature-heading {
          font-family: 'Montserrat', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          font-size: clamp(52px, 4.4vw, 68px);
          font-weight: 850;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0;
          padding: 0;
          display: inline-flex;
          align-items: baseline;
          gap: clamp(0.32rem, 0.75vw, 0.55rem);
          position: relative;
          z-index: 1;
          user-select: none;
          white-space: nowrap;
          text-transform: uppercase;
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }

        .wordmark-aleena,
        .editorial-aleena {
          font-family: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          display: inline-block;
          transition: color 500ms ease-in-out, text-shadow 500ms ease-in-out;
        }

        .wordmark-r,
        .editorial-r-wrap,
        .editorial-r-char {
          font-family: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          display: inline-block;
          transition: color 500ms ease-in-out, text-shadow 500ms ease-in-out;
        }

        /* DARK THEME STYLING:
           ALEENA: soft white / ivory (#FAF8F5)
           R: vivid lavender / purple (#C084FC) with very subtle luminous glow
           NO gold, orange, or yellow. */
        [data-theme="dark"] .wordmark-aleena,
        [data-theme="dark"] .editorial-aleena {
          color: #FAF8F5;
          text-shadow: 0 0 24px rgba(255, 255, 255, 0.10);
        }

        [data-theme="dark"] .wordmark-r,
        [data-theme="dark"] .editorial-r-wrap,
        [data-theme="dark"] .editorial-r-char {
          color: #C084FC;
          text-shadow: 0 0 20px rgba(192, 132, 252, 0.45), 0 0 35px rgba(168, 85, 247, 0.25);
          filter: drop-shadow(0 0 12px rgba(192, 132, 252, 0.35));
        }

        /* LIGHT THEME STYLING:
           ALEENA: deep navy / plum (#1E122C)
           R: rich purple / lavender (#7E22CE)
           NO gold, orange, or yellow. */
        [data-theme="light"] .wordmark-aleena,
        [data-theme="light"] .editorial-aleena {
          color: #1E122C;
          text-shadow: none;
        }

        [data-theme="light"] .wordmark-r,
        [data-theme="light"] .editorial-r-wrap,
        [data-theme="light"] .editorial-r-char {
          color: #7E22CE;
          text-shadow: 0 2px 10px rgba(126, 34, 206, 0.18);
          filter: drop-shadow(0 2px 6px rgba(126, 34, 206, 0.15));
        }

        /* 3. Role -> company: 11px (reduced from 14px) */
        .hero-role {
          font-family: var(--font-sans);
          font-size: clamp(32px, 2.4vw, 36px);
          font-weight: 700;
          letter-spacing: 0.01em;
          line-height: 1.2;
          margin: 0 0 11px 0;
          transition: color 500ms ease-in-out;
        }

        [data-theme="light"] .hero-role {
          color: #7E22CE;
        }

        [data-theme="dark"] .hero-role {
          color: #C084FC;
        }

        /* 4. Company -> website: 11px (reduced from 14px) */
        .hero-company {
          font-family: var(--font-sans);
          font-size: clamp(20px, 1.45vw, 22px);
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          margin: 0 0 11px 0;
          transition: color 500ms ease-in-out;
        }

        /* 5. Website -> description: 22px (reduced from 28px) */
        .hero-company-link-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          margin: 0 0 22px 0;
          font-size: 0.88rem;
        }

        .hero-company-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 1px solid var(--accent-gold);
          padding-bottom: 1px;
          transition: color 0.25s ease, border-color 0.25s ease;
        }

        .hero-company-link:hover {
          color: var(--accent-gold);
        }

        .company-link-arrow {
          transition: transform 0.2s ease;
        }

        .hero-company-link:hover .company-link-arrow {
          transform: translate(2px, -2px);
        }

        .company-link-separator {
          color: var(--text-muted);
          font-weight: 300;
        }

        .hero-company-url {
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .hero-company-url:hover {
          color: var(--text-primary);
        }

        /* 6. Description -> buttons: 28px (reduced from 36px) */
        .hero-statement {
          font-family: var(--font-sans);
          font-size: 18px;
          line-height: 1.68;
          color: var(--text-secondary);
          max-width: 580px;
          margin: 0 0 28px 0;
          transition: color 500ms ease-in-out;
        }

        /* 7. Buttons -> statistics: 36px (reduced from 48px) */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1.15rem;
          margin: 0 0 36px 0;
        }

        .btn-hero-primary {
          padding: 0.95rem 2rem;
          box-shadow: 0 10px 28px -4px var(--accent-gold-glow);
        }

        .btn-hero-secondary {
          padding: 0.9rem 1.95rem;
        }

        /* 8. Statistics Strip: 1.25rem padding-top (reduced from 1.5rem) */
        .hero-meta-strip {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
          width: 100%;
          transition: border-color 500ms ease-in-out;
        }

        .hero-meta-desktop {
          display: flex;
        }

        .hero-meta-mobile {
          display: none;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
        }

        .meta-number {
          font-family: var(--font-editorial);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          display: inline-block;
          white-space: nowrap;
          transition: color 500ms ease-in-out;
        }

        .meta-label {
          font-size: 0.74rem;
          color: var(--text-muted);
          letter-spacing: 0.03em;
          margin-top: 0.25rem;
          transition: color 500ms ease-in-out;
        }

        .meta-divider {
          width: 1px;
          height: 28px;
          background: var(--border-subtle);
          transition: background 500ms ease-in-out;
        }

        /* Right Column: Lanyard Badge Floating at ~50-55% from top */
        .hero-lanyard-col {
          position: relative;
          width: 100%;
          height: clamp(520px, 55vh, 560px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transform: translateY(-20px); /* elevates card safely above waves and centers with left content */
        }

        /* 1366x768 & Short Desktop Screens Optimization (balanced typography, no cut-off) */
        @media (min-width: 1024px) and (max-height: 820px) {
          .hero-section {
            padding-top: calc(var(--header-height) + 12px);
            /* 52px clean empty gap above wave on short desktop displays */
            padding-bottom: calc(clamp(65px, 8vw, 105px) + 52px);
          }
          .hero-tag-wrap {
            margin-bottom: 12px;
          }
          .hero-category-tag {
            font-size: 14px;
          }
          .hero-signature-wrap {
            margin-bottom: 12px;
          }
          .hero-name.hero-signature-heading {
            font-size: clamp(58px, 5vw, 72px);
          }
          .hero-role {
            font-size: 28px;
            margin-bottom: 6px;
          }
          .hero-company {
            font-size: 19px;
            margin-bottom: 6px;
          }
          .hero-company-link-row {
            margin-bottom: 16px;
            font-size: 0.82rem;
          }
          .hero-statement {
            font-size: 17px;
            line-height: 1.55;
            margin-bottom: 22px;
            max-width: 520px;
          }
          .hero-actions {
            margin-bottom: 24px;
            gap: 0.85rem;
          }
          .btn-hero-primary,
          .btn-hero-secondary {
            padding: 0.75rem 1.6rem;
            font-size: 0.78rem;
          }
          .hero-meta-strip {
            padding-top: 0.85rem;
            gap: 1.5rem;
          }
          .meta-number {
            font-size: 1.35rem;
          }
          .meta-label {
            font-size: 0.68rem;
          }
          .hero-lanyard-col {
            height: clamp(470px, 58vh, 520px);
            transform: translateY(-28px);
          }
        }

        /* Tablet Screens (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-section {
            min-height: auto;
            display: block;
            padding-top: calc(78px + 24px);
            /* 48px clean empty gap above the 60px wave on tablets */
            padding-bottom: calc(60px + 48px);
          }
          .hero-container {
            display: flex;
            flex-direction: column;
            padding: 0 32px;
            gap: 2rem;
          }
          .hero-content {
            width: 100%;
            max-width: 100%;
            order: 1;
          }
          .hero-lanyard-col {
            order: 2;
            width: 100%;
            height: 480px;
            margin: 0 auto;
            transform: none;
          }
          .hero-meta-desktop {
            display: none !important;
          }
          .hero-meta-mobile {
            display: flex !important;
            order: 3;
            width: 100%;
            margin-top: 0;
          }
          .hero-category-tag {
            font-size: 14px;
          }
          .hero-wordmark-wrap,
          .hero-signature-wrap {
            margin-bottom: 12px;
          }
          .hero-name.hero-bold-modern,
          .hero-name.hero-editorial-wordmark,
          .hero-name.hero-signature-heading {
            font-size: clamp(44px, 5.8vw, 56px);
            white-space: nowrap;
          }
          .wordmark-aleena,
          .editorial-aleena {
            letter-spacing: -0.02em;
          }
          .hero-role {
            font-size: clamp(26px, 3.5vw, 32px);
          }
          .hero-company {
            font-size: 19px;
          }
          .hero-statement {
            font-size: 17px;
            line-height: 1.6;
          }
          .hero-actions {
            margin-bottom: 0;
          }
        }

        /* Dedicated Mobile Layout (< 768px) */
        @media (max-width: 767px) {
          .hero-section {
            min-height: auto;
            position: relative;
            display: block;
            /* Lanyard hangs seamlessly directly beneath the fixed 70px navigation bar (no gap) */
            padding-top: 68px;
            /* 40px clean empty gap above the 60px wave on mobile */
            padding-bottom: calc(60px + 40px);
            width: 100%;
            max-width: 100vw;
            box-sizing: border-box;
            overflow-x: hidden;
          }

          .hero-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 100%;
            /* Hero horizontal padding: 32px */
            padding-left: 32px;
            padding-right: 32px;
            box-sizing: border-box;
            gap: 0;
          }

          /* 1. LANYARD / ID CARD (FIRST on mobile) */
          .hero-lanyard-col {
            order: 1;
            width: 100%;
            height: 420px;
            margin: 0 auto 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: none;
            position: relative;
            z-index: 10;
          }

          /* 2. Hero Content (Everything else below it) */
          .hero-content {
            order: 2;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          /* Psychology -> ALEENA R: 26px (reduced from 36px) */
          .hero-tag-wrap {
            margin-bottom: 26px;
          }

          .hero-category-tag {
            font-size: 14px; /* 13–14px */
            letter-spacing: 0.12em;
            line-height: 1.35;
          }

          .hero-category-separator {
            display: none;
          }

          .hero-category-hr {
            display: block;
            white-space: nowrap;
          }

          .hero-wordmark-wrap,
          .hero-signature-wrap {
            width: fit-content;
            max-width: 100%;
            margin-bottom: 16px;
          }

          /* Bold Modern Wordmark: responsive fluid geometric strictly fitting on one line */
          .hero-name.hero-bold-modern,
          .hero-name.hero-editorial-wordmark,
          .hero-name.hero-signature-heading {
            font-size: clamp(34px, 8.4vw, 44px);
            line-height: 1;
            letter-spacing: -0.025em;
            gap: 0.28em;
            margin: 0;
            white-space: nowrap;
            display: inline-flex;
            align-items: baseline;
            width: auto;
            max-width: 100%;
            box-sizing: border-box;
            padding: 0;
          }

          .wordmark-aleena,
          .editorial-aleena {
            letter-spacing: -0.025em;
          }

          /* HR Intern: 30–32px, line-height 1.1 */
          /* HR Intern -> Company: 14px (reduced from 18px) */
          .hero-role {
            font-size: 32px;
            line-height: 1.1;
            margin-top: 0;
            margin-bottom: 14px;
          }

          /* Company Name: 18–20px, line-height 1.4, natural wrapping */
          /* Company -> Website: 16px (reduced from 22px) */
          .hero-company {
            font-size: 19px;
            line-height: 1.4;
            max-width: 100%;
            white-space: normal;
            word-break: normal;
            margin-bottom: 16px;
          }

          /* Company Website: 15–16px, natural wrapping, no overflow */
          /* Website -> Description: 24px (reduced from 32px) */
          .hero-company-link-row {
            font-size: 15px;
            margin-bottom: 24px;
            gap: 0.5rem;
            flex-wrap: wrap;
            max-width: 100%;
          }

          .hero-company-url {
            overflow-wrap: anywhere;
            word-break: break-all;
            max-width: 100%;
          }

          /* Description: 16–17px, line-height 1.65, highly readable */
          /* Description -> Buttons: 28px (reduced from 36px) */
          .hero-statement {
            font-size: 16.5px;
            line-height: 1.65;
            max-width: 100%;
            margin-bottom: 28px;
          }

          /* Action Buttons: Full width, min-height 56px, border-radius 28px, 14px gap */
          .hero-actions {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-top: 0;
            margin-bottom: 0;
            gap: 14px;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            min-height: 56px;
            font-size: 16px;
            border-radius: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            font-weight: 700;
            letter-spacing: 0.06em;
          }

          /* 3. Statistics Section Strip (Rendered below hero content on mobile) */
          .hero-meta-desktop {
            display: none !important;
          }

          .hero-meta-mobile {
            display: flex !important;
            order: 3;
            width: 100%;
            margin-top: 28px;
          }

          .hero-meta-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            padding-top: 1.25rem;
          }

          .meta-divider {
            display: none;
          }

          .meta-number {
            font-size: 1.35rem;
            font-variant-numeric: tabular-nums;
            font-feature-settings: "tnum";
            display: inline-block;
            white-space: nowrap;
          }

          .meta-label {
            font-size: 0.66rem;
            line-height: 1.3;
          }
        }

        /* Very small screens below 400px (e.g. 360px, 375px, 390px): padding 24px, font-size: ~36px */
        @media (max-width: 399px) {
          .hero-section {
            /* 36px clean empty gap above the 60px wave on small mobile */
            padding-bottom: calc(60px + 36px);
          }
          .hero-container {
            padding-left: 24px;
            padding-right: 24px;
          }
          .hero-name.hero-bold-modern,
          .hero-name.hero-editorial-wordmark,
          .hero-name.hero-signature-heading {
            font-size: clamp(28px, 7.8vw, 34px);
            letter-spacing: -0.03em;
            gap: 0.25em;
            padding: 0;
          }
          .wordmark-aleena,
          .editorial-aleena {
            letter-spacing: -0.03em;
          }
          .hero-role {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}
