import React from 'react';
import { Mail, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

function TelegramIcon({ size = 24, className = '' }) {
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

export default function Contact() {
  return (
    <section id="contact" className="section contact-section" aria-label="Contact Section">
      <div className="container">
        
        <div className="contact-box glass-card">
          <div className="contact-header">
            <span className="section-tag">Get in Touch</span>
            <h2 className="contact-headline">LET'S CONNECT</h2>
            <p className="contact-intro">
              I’m always open to meaningful conversations, professional opportunities, collaborations, and opportunities to learn. If you'd like to connect, I'd be happy to hear from you.
            </p>
          </div>

          <div className="contact-channels">
            
            {/* Email Channel */}
            <a
              href={`mailto:${personalInfo.email}`}
              className="channel-card"
              aria-label={`Send email to ${personalInfo.email}`}
            >
              <div className="channel-icon-wrap">
                <Mail size={24} className="channel-icon" />
              </div>
              <div className="channel-info">
                <span className="channel-type">DIRECT EMAIL</span>
                <span className="channel-val">{personalInfo.email}</span>
              </div>
              <ArrowUpRight size={20} className="channel-arrow" />
            </a>

            {/* LinkedIn Channel */}
            <a
              href={personalInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              aria-label="Connect with me on LinkedIn"
            >
              <div className="channel-icon-wrap">
                <Linkedin size={24} className="channel-icon" />
              </div>
              <div className="channel-info">
                <span className="channel-type">LINKEDIN</span>
                <span className="channel-val">in/aleena-r</span>
              </div>
              <ArrowUpRight size={20} className="channel-arrow" />
            </a>

            {/* Instagram Channel */}
            <a
              href={personalInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              aria-label="Follow me on Instagram"
            >
              <div className="channel-icon-wrap">
                <Instagram size={24} className="channel-icon" />
              </div>
              <div className="channel-info">
                <span className="channel-type">INSTAGRAM</span>
                <span className="channel-val">@aleena.rosu.raju</span>
              </div>
              <ArrowUpRight size={20} className="channel-arrow" />
            </a>

            {/* Telegram Channel */}
            <a
              href={personalInfo.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              aria-label="Message me on Telegram"
            >
              <div className="channel-icon-wrap">
                <TelegramIcon size={24} className="channel-icon" />
              </div>
              <div className="channel-info">
                <span className="channel-type">TELEGRAM</span>
                <span className="channel-val">@Aleenaraju</span>
              </div>
              <ArrowUpRight size={20} className="channel-arrow" />
            </a>

          </div>
        </div>

      </div>

      <style>{`
        .contact-section {
          background-color: var(--bg-primary);
          padding-bottom: 5rem;
        }
        .contact-box {
          padding: 4rem 2.5rem;
          border: 1px solid var(--border-gold);
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: var(--shadow-card);
        }
        @media (min-width: 768px) {
          .contact-box {
            padding: 5rem 4rem;
          }
        }
        .contact-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3.5rem auto;
        }
        .contact-headline {
          font-family: var(--font-editorial);
          font-size: clamp(2.25rem, 4.5vw, 3.75rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }
        .contact-intro {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .contact-channels {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          max-width: 1080px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .contact-channels {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .contact-channels {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .channel-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          position: relative;
          transition: all 0.35s var(--transition-smooth);
        }
        .channel-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-gold);
          transform: translateY(-5px);
          box-shadow: var(--shadow-card-hover);
        }
        .channel-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: var(--accent-gold-dim);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .channel-icon {
          color: var(--accent-gold);
        }
        .channel-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .channel-type {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--text-muted);
        }
        .channel-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-all;
        }
        .channel-arrow {
          position: absolute;
          top: 1.75rem;
          right: 1.75rem;
          color: var(--text-muted);
          transition: all 0.25s var(--transition-smooth);
        }
        .channel-card:hover .channel-arrow {
          color: var(--accent-gold);
          transform: translate(3px, -3px);
        }
        @media (max-width: 480px) {
          .contact-box {
            padding: 2.5rem 1.25rem;
          }
          .contact-headline {
            font-size: clamp(1.65rem, 6.5vw, 2.25rem);
          }
          .contact-intro {
            font-size: 0.95rem;
          }
          .channel-card {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
