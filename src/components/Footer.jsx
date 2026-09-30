import React, { useState } from 'react';
import { ArrowUp, Instagram, Linkedin, Mail, X, ChevronRight, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import MagicTreeQR from './MagicTreeQR';

function TelegramIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.5 2.5L2 11.25l7.5 3.25L12 21.5l3.75-4.5 5.75 4.5L21.5 2.5z" />
      <path d="M9.5 14.5L16 8.5" />
    </svg>
  );
}

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="editorial-footer" role="contentinfo">
      <div className="container footer-wrapper">
        
        {/* Main Content Row */}
        <div className="footer-main-row">
          
          {/* Left Column: Brand Statement & Socials */}
          <div className="footer-col-left">
            <span className="footer-eyebrow">PEOPLE &bull; PSYCHOLOGY &bull; PURPOSE</span>
            
            <h2 className="footer-headline">
              Understanding people.<br />
              <span className="headline-accent">Empowering workplaces.</span>
            </h2>
            
            <p className="footer-supporting-text">
              Exploring people, psychology and purposeful work to create more human-centered workplaces.
            </p>

            {/* Circular Social Links with Labels */}
            <div className="footer-social-row" aria-label="Social media links">
              <a
                href={personalInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-group"
                aria-label="Instagram Profile"
                title="Instagram: @aleena.rosu.raju"
              >
                <div className="social-circle-btn">
                  <Instagram size={19} />
                </div>
                <span className="social-pill-label">Instagram</span>
              </a>

              <a
                href={personalInfo.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-group"
                aria-label="LinkedIn Profile"
                title="LinkedIn: Aleena R"
              >
                <div className="social-circle-btn">
                  <Linkedin size={19} />
                </div>
                <span className="social-pill-label">LinkedIn</span>
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                className="social-pill-group"
                aria-label="Send Direct Email"
                title={`Email: ${personalInfo.email}`}
              >
                <div className="social-circle-btn">
                  <Mail size={19} />
                </div>
                <span className="social-pill-label">Email</span>
              </a>

              <a
                href={personalInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-group"
                aria-label="Telegram Profile @Aleenaraju"
                title="Telegram: @Aleenaraju"
              >
                <div className="social-circle-btn">
                  <TelegramIcon size={19} />
                </div>
                <span className="social-pill-label">Telegram</span>
              </a>
            </div>
          </div>

          {/* Middle Column (~25%): Quick Links, Legal & Quick Access QR */}
          <div className="footer-col-middle">
            {/* Quick Links */}
            <div className="footer-col-nav">
              <h4 className="footer-column-title">Quick Links</h4>
              <ul className="footer-nav-list">
                <li>
                  <a href="#hero" className="footer-nav-item">
                    <span>Home</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#about" className="footer-nav-item">
                    <span>About</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#experience" className="footer-nav-item">
                    <span>Experience</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#certificates" className="footer-nav-item">
                    <span>Certificates</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-nav-item">
                    <span>Contact</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="footer-legal-block">
              <h4 className="footer-column-title">Legal</h4>
              <ul className="footer-nav-list">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="footer-link-action"
                  >
                    <span>Privacy Policy</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="footer-link-action"
                  >
                    <span>Terms & Conditions</span>
                    <ChevronRight size={14} className="link-chevron" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Access — Real Dynamic 3D Magic Tree & QR Experience */}
            <div className="footer-qr-block">
              <h5 className="footer-qr-title">Quick Access</h5>
              <p className="footer-qr-desc">Scan to open my portfolio</p>
              
              <MagicTreeQR />
            </div>
          </div>

          {/* Right Column: Aleena Portrait & Script Branding */}
          <div className="footer-col-portrait">
            <div className="portrait-container">
              {/* Subtle ambient warm backlight glow */}
              <div className="portrait-ambient-glow" aria-hidden="true" />
              
              {/* Decorative curved orange wireframe orbit with 4-pointed sparkle */}
              <svg
                className="portrait-decorative-orbit"
                viewBox="0 0 360 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M 350 90 C 330 15, 230 10, 160 55 C 90 100, 50 190, 75 285 C 90 345, 130 395, 190 410"
                  stroke="var(--accent-gold)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {/* 4-pointed sparkle star on the curve */}
                <g transform="translate(345, 85) scale(0.65)">
                  <path
                    d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z"
                    fill="var(--accent-gold)"
                  />
                </g>
              </svg>

              {/* Portrait Image with natural gradient blend at bottom */}
              <img
                src={personalInfo.footerPortrait || personalInfo.portrait}
                alt="Aleena R portrait"
                className="footer-portrait-img"
                loading="lazy"
              />

              {/* Script Name & Designation */}
              <div className="footer-portrait-meta">
                <span className="footer-script-signature">Aleena R</span>
                <span className="footer-signature-role">HR INTERN</span>
              </div>
            </div>
          </div>

        </div>

        {/* Center Sparkle Horizontal Divider */}
        <div className="footer-sparkle-divider" aria-hidden="true">
          <div className="divider-line left" />
          <div className="divider-sparkle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z"
                fill="var(--accent-gold)"
              />
            </svg>
          </div>
          <div className="divider-line right" />
        </div>

        {/* Bottom Bar: Monogram, Copyright, and Back to top */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <div className="footer-monogram-circle">
              <span>AR</span>
            </div>
            <div className="footer-brand-divider" />
            <div className="footer-brand-text">
              <span className="footer-brand-name">ALEENA R</span>
              <span className="footer-brand-subtitle">HR INTERN &bull; PSYCHOLOGY</span>
            </div>
          </div>

          <div className="footer-bottom-center">
            <p className="copyright-text">
              &copy; 2026 Aleena R. All rights reserved.
            </p>
          </div>

          <div className="footer-bottom-right">
            <button
              type="button"
              onClick={scrollToTop}
              className="footer-back-to-top"
              aria-label="Scroll back to top"
            >
              <ArrowUp size={15} />
              <span>Back to top</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal for Privacy Policy / Terms & Conditions */}
      {activeModal && (
        <div className="footer-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="footer-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{activeModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {activeModal === 'privacy' ? (
                <p>
                  This is my personal portfolio website, designed to share my academic milestones, research publications, and professional HR journey. I respect your privacy. No personal identification data or cookies are sold or tracked. Any message you send through the contact links comes directly to me.
                </p>
              ) : (
                <p>
                  All content, academic research summaries, publication certificates, and visual designs showcased on my portfolio website are my intellectual property and that of the respective publishing journals. Reproduction without prior written consent is strictly prohibited.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ==========================================================================
           Editorial Footer: Dark Mode & Light Mode
           ========================================================================== */
        
        .editorial-footer {
          position: relative;
          background: #06121F;
          color: #FFFFFF;
          padding-top: 5rem;
          padding-bottom: 2.25rem;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease;
        }

        /* Light Theme: Premium Warm Ivory Background (#FAF8F3) */
        [data-theme="light"] .editorial-footer {
          background: #FAF8F3;
          color: #0B2B48;
          border-top: 1px solid rgba(11, 43, 72, 0.08);
        }

        .footer-wrapper {
          position: relative;
          z-index: 2;
        }

        /* Main Content Row: Exactly 3 Columns matching Reference */
        .footer-main-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.75rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .footer-main-row {
            grid-template-columns: 1.35fr 0.85fr 0.8fr; /* approx 45% / 28% / 27% */
            gap: clamp(40px, 3.8vw, 56px); /* 40-64px column gaps */
            align-items: center; /* profile image vertically centered with main footer content */
          }
        }

        /* Left Column (~45%) */
        .footer-col-left {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        @media (min-width: 1024px) {
          .footer-col-left {
            padding-right: clamp(20px, 2vw, 28px);
          }

          /* Subtle Vertical Divider between Left and Middle Columns */
          .footer-col-left::after {
            content: '';
            position: absolute;
            top: 6px;
            bottom: 6px;
            right: 0;
            width: 1px;
            background: rgba(255, 255, 255, 0.08);
          }

          [data-theme="light"] .footer-col-left::after {
            background: rgba(11, 43, 72, 0.08);
          }
        }

        /* Section Eyebrow: 20px gap to headline (16-24px range) */
        .footer-eyebrow {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        /* Main Headline: 20px gap to paragraph (16-24px range) */
        .footer-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 2.5vw, 2.35rem);
          font-weight: 600;
          line-height: 1.25;
          color: #FFFFFF;
          margin: 0 0 20px 0;
          letter-spacing: -0.01em;
        }

        [data-theme="light"] .footer-headline {
          color: #0B2B48;
        }

        .headline-accent {
          font-style: italic;
          color: var(--accent-gold);
          font-weight: 600;
        }

        /* Supporting Paragraph: 24px gap to social icons (exact 24px) */
        .footer-supporting-text {
          font-family: var(--font-sans);
          font-size: 0.96rem;
          line-height: 1.65;
          color: #A7B8C7;
          max-width: 440px;
          margin: 0 0 24px 0;
        }

        [data-theme="light"] .footer-supporting-text {
          color: #617386;
        }

        /* Circular Social Links with Labels: 10px gap between circle and label (8-12px range) */
        .footer-social-row {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .social-pill-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s var(--transition-smooth);
        }

        .social-pill-group:hover {
          transform: translateY(-3px);
        }

        .social-circle-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          transition: all 0.25s var(--transition-smooth);
        }

        [data-theme="light"] .social-circle-btn {
          background: #FFFFFF;
          border: 1px solid rgba(11, 43, 72, 0.12);
          color: #0B2B48;
          box-shadow: 0 4px 12px rgba(11, 43, 72, 0.04);
        }

        .social-pill-group:hover .social-circle-btn {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          box-shadow: 0 0 16px var(--accent-gold-glow);
        }

        .social-pill-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #A7B8C7;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
        }

        [data-theme="light"] .social-pill-label {
          color: #617386;
        }

        .social-pill-group:hover .social-pill-label {
          color: var(--accent-gold);
        }

        /* Middle Column (~25%): Quick Links, Legal & Quick Access QR */
        .footer-col-middle {
          display: grid;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .footer-col-middle {
            grid-template-columns: auto auto;
            grid-template-rows: auto 1fr;
            grid-template-areas:
              "nav legal"
              "nav qr";
            column-gap: clamp(1.75rem, 2.4vw, 3rem);
            row-gap: 0;
            align-items: start;
          }

          .footer-col-nav {
            grid-area: nav;
            min-width: 115px;
          }

          .footer-legal-block {
            grid-area: legal;
          }

          .footer-qr-block {
            grid-area: qr;
            margin-top: 1.15rem;
            padding-top: 1.15rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }

          [data-theme="light"] .footer-qr-block {
            border-top: 1px solid rgba(11, 43, 72, 0.08);
          }
        }

        /* Column Headings */
        .footer-column-title {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 1.25rem 0;
          letter-spacing: 0.02em;
        }

        [data-theme="light"] .footer-column-title {
          color: #0B2B48;
        }

        /* Navigation & Action Lists */
        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .footer-nav-item,
        .footer-link-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: #A7B8C7;
          transition: color 0.2s ease;
          width: 100%;
        }

        [data-theme="light"] .footer-nav-item,
        [data-theme="light"] .footer-link-action {
          color: #617386;
        }

        .link-chevron {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-left: 0.75rem;
          transition: transform 0.2s ease;
        }

        .footer-nav-item:hover,
        .footer-link-action:hover {
          color: var(--accent-gold);
        }

        .footer-nav-item:hover .link-chevron,
        .footer-link-action:hover .link-chevron {
          transform: translateX(3px);
        }

        /* QR Block */
        .footer-qr-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-qr-title {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.25rem 0;
          letter-spacing: 0.02em;
        }

        [data-theme="light"] .footer-qr-title {
          color: #0B2B48;
        }

        .footer-qr-desc {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: #A7B8C7;
          margin: 0 0 0.75rem 0;
        }

        [data-theme="light"] .footer-qr-desc {
          color: #617386;
        }

        /* Dynamic 3D Magic Tree & QR Widget */
        .magic-tree-widget-container {
          position: relative;
          width: 250px;
          height: 250px;
          min-height: 250px;
          max-height: 250px;
          max-width: 250px;
          user-select: none;
          overflow: hidden;
          contain: layout paint size;
          flex-shrink: 0;
        }

        .magic-tree-stage {
          position: relative;
          width: 250px;
          height: 250px;
          border-radius: 16px;
          overflow: hidden;
          background: transparent;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          contain: layout paint size;
        }

        .magic-tree-stage:hover {
          transform: translateY(-2px);
        }

        /* Dedicated isolated animation layer that does NOT participate in document flow */
        .tree-animation-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          max-width: 100vw;
          max-height: 100vh;
          pointer-events: auto;
          contain: layout paint size;
        }

        .magic-tree-canvas {
          position: absolute;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          display: block;
          outline: none;
          touch-action: none;
          pointer-events: auto;
        }

        @media (max-width: 480px) {
          .magic-tree-widget-container {
            align-items: center;
            width: 230px;
            height: 230px;
            min-height: 230px;
            max-height: 230px;
            max-width: 230px;
            margin: 0 auto;
          }
          .magic-tree-stage {
            width: 230px;
            height: 230px;
            margin: 0 auto;
          }
          .magic-tree-stage:hover {
            transform: translateY(-2px);
          }
        }

        /* Right Column (~35%): Portrait Artwork & Script Branding */
        .footer-col-portrait {
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 100%;
        }

        .portrait-container {
          position: relative;
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Ambient Glow behind portrait */
        .portrait-ambient-glow {
          position: absolute;
          top: 15%;
          right: 10%;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, rgba(242, 140, 24, 0.22) 0%, rgba(13, 43, 77, 0.35) 60%, transparent 80%);
          filter: blur(28px);
          pointer-events: none;
          z-index: 1;
        }

        [data-theme="light"] .portrait-ambient-glow {
          background: radial-gradient(circle at 50% 50%, rgba(233, 162, 74, 0.22) 0%, rgba(175, 199, 216, 0.35) 60%, transparent 80%);
        }

        /* Decorative curved orbit SVG */
        .portrait-decorative-orbit {
          position: absolute;
          top: -10px;
          left: -20px;
          width: 110%;
          height: 110%;
          pointer-events: none;
          z-index: 2;
        }

        /* Portrait Image */
        .footer-portrait-img {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 280px;
          height: auto;
          display: block;
          user-select: none;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(to bottom, black 65%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 65%, transparent 100%);
        }

        /* Signature & Designation */
        .footer-portrait-meta {
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          align-self: flex-end;
          margin-top: -3.2rem;
          padding-right: 0.5rem;
        }

        .footer-script-signature {
          font-family: 'Alex Brush', 'Dancing Script', cursive;
          font-size: clamp(2.6rem, 3.8vw, 3.4rem);
          font-weight: 400;
          color: var(--accent-gold);
          line-height: 0.95;
          margin: 0;
          transform: rotate(-3deg);
          letter-spacing: 0.02em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        }

        .footer-signature-role {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #FFFFFF;
          margin-top: 0.35rem;
          text-transform: uppercase;
        }

        [data-theme="light"] .footer-signature-role {
          color: #0B2B48;
        }

        /* Center Sparkle Horizontal Divider */
        .footer-sparkle-divider {
          display: flex;
          align-items: center;
          width: 100%;
          margin: clamp(2.75rem, 4vw, 3.75rem) 0 clamp(1.5rem, 2.2vw, 2rem) 0;
          position: relative;
        }

        .divider-line {
          flex: 1;
          height: 1px;
        }

        .divider-line.left {
          background: linear-gradient(90deg, transparent 0%, rgba(242, 140, 24, 0.45) 100%);
        }

        .divider-line.right {
          background: linear-gradient(90deg, rgba(242, 140, 24, 0.45) 0%, transparent 100%);
        }

        [data-theme="light"] .divider-line.left {
          background: linear-gradient(90deg, transparent 0%, rgba(233, 162, 74, 0.45) 100%);
        }

        [data-theme="light"] .divider-line.right {
          background: linear-gradient(90deg, rgba(233, 162, 74, 0.45) 0%, transparent 100%);
        }

        .divider-sparkle {
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 6px var(--accent-gold-glow));
        }

        /* Bottom Bar: Same horizontal baseline on desktop */
        .footer-bottom-bar {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        @media (min-width: 900px) {
          .footer-bottom-bar {
            flex-direction: row;
          }
        }

        .footer-bottom-left {
          display: flex;
          align-items: center;
        }

        .footer-monogram-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-accent), serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          background: transparent;
        }

        [data-theme="light"] .footer-monogram-circle {
          color: #0B2B48;
        }

        .footer-brand-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 1.15rem;
        }

        [data-theme="light"] .footer-brand-divider {
          background: rgba(11, 43, 72, 0.15);
        }

        .footer-brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .footer-brand-name {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #FFFFFF;
        }

        [data-theme="light"] .footer-brand-name {
          color: #0B2B48;
        }

        .footer-brand-subtitle {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #A7B8C7;
        }

        [data-theme="light"] .footer-brand-subtitle {
          color: #617386;
        }

        .copyright-text {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          color: #A7B8C7;
          margin: 0;
          text-align: center;
        }

        [data-theme="light"] .copyright-text {
          color: #617386;
        }

        /* Elegant Orange Outlined Back-to-Top Button */
        .footer-back-to-top {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.4rem;
          border-radius: 9999px;
          border: 1px solid var(--accent-gold);
          background: transparent;
          color: var(--accent-gold);
          font-family: var(--font-sans);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.28s var(--transition-smooth);
        }

        .footer-back-to-top:hover {
          background: var(--accent-gold);
          color: var(--text-inverse);
          transform: translateY(-2px);
          box-shadow: 0 4px 18px var(--accent-gold-glow);
        }

        /* Modal Styles */
        .footer-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .footer-modal-card {
          width: 100%;
          max-width: 520px;
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-gold);
          border-radius: 14px;
          padding: 2rem;
          box-shadow: var(--shadow-card-hover);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-header h3 {
          font-family: var(--font-editorial);
          font-size: 1.35rem;
          color: var(--text-primary);
          margin: 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .modal-close-btn:hover {
          color: var(--accent-gold);
        }

        .modal-body p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1023px) {
          .editorial-footer {
            padding-top: 4rem;
          }

          .footer-main-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2.75rem;
            text-align: center;
          }

          .footer-col-left {
            align-items: center;
            padding-right: 0;
          }

          .footer-col-left::after {
            display: none;
          }

          .footer-headline,
          .footer-supporting-text {
            text-align: center;
          }

          .footer-social-row {
            justify-content: center;
            gap: 1.25rem;
          }

          /* Middle Column: Quick Links & Legal (side-by-side) on row 1, QR code centered on row 2 */
          .footer-col-middle {
            display: grid;
            grid-template-columns: auto auto;
            grid-template-areas:
              "nav legal"
              "qr qr";
            column-gap: clamp(2.5rem, 8vw, 4.5rem);
            row-gap: 2rem;
            justify-content: center;
            width: 100%;
          }

          .footer-col-nav {
            grid-area: nav;
            text-align: left;
          }

          .footer-legal-block {
            grid-area: legal;
            text-align: left;
          }

          .footer-qr-block {
            grid-area: qr;
            justify-self: center;
            align-items: center;
            text-align: center;
            margin-top: 0;
            padding-top: 0;
            border-top: none;
          }

          .magic-tree-widget-container {
            align-items: center;
            margin: 0 auto;
          }

          .footer-col-portrait {
            justify-content: center;
            align-items: center;
          }

          .portrait-container {
            max-width: 290px;
          }

          .footer-portrait-meta {
            align-self: center;
            align-items: center;
            padding-right: 0;
            margin-top: -2.4rem;
          }
        }

        @media (max-width: 640px) {
          .footer-headline {
            font-size: 1.85rem;
          }

          .footer-social-row {
            gap: 1.15rem;
            flex-wrap: wrap;
          }

          .social-circle-btn {
            width: 44px;
            height: 44px;
          }

          .footer-bottom-bar {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .footer-bottom-left {
            flex-direction: column;
            gap: 0.75rem;
          }

          .footer-brand-divider {
            display: none;
          }

          .footer-brand-text {
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
}
