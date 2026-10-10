import React from 'react';
import { Mail, Linkedin, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import ContactForm from './ContactForm';

export default function Contact() {
  return (
    <section id="contact" className="section contact-section" aria-label="Contact Section">
      <div className="container">
        
        <div className="contact-box glass-card">
          <div className="contact-content-grid">
            
            {/* Left Column: Direct Info & Channels */}
            <div className="contact-info-side">
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
                    <Mail size={22} className="channel-icon" />
                  </div>
                  <div className="channel-info">
                    <span className="channel-type">DIRECT EMAIL</span>
                    <span className="channel-val">{personalInfo.email}</span>
                  </div>
                  <ArrowUpRight size={18} className="channel-arrow" />
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
                    <Linkedin size={22} className="channel-icon" />
                  </div>
                  <div className="channel-info">
                    <span className="channel-type">LINKEDIN</span>
                    <span className="channel-val">in/aleena-r</span>
                  </div>
                  <ArrowUpRight size={18} className="channel-arrow" />
                </a>
              </div>
            </div>

            {/* Right Column: Premium Contact Form */}
            <div className="contact-form-side">
              <ContactForm eyebrow="SEND A MESSAGE" />
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .contact-section {
          background-color: transparent;
          padding-bottom: 5rem;
        }

        .contact-box {
          padding: 3.5rem 2.5rem;
          border: 1px solid var(--border-gold);
          border-radius: 24px;
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: var(--shadow-card);
          max-width: 1240px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .contact-box {
            padding: 4rem 3.5rem;
          }
        }

        /* 2-Column Responsive Layout */
        .contact-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.75rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          .contact-content-grid {
            grid-template-columns: 1fr 1.05fr;
            gap: clamp(2.5rem, 4vw, 4.5rem);
            align-items: center;
          }
        }

        /* Left Info Side */
        .contact-info-side {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .contact-header {
          text-align: left;
          max-width: 100%;
          margin: 0 0 2rem 0;
        }

        .contact-headline {
          font-family: var(--font-editorial);
          font-size: clamp(2.25rem, 3.8vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          margin-bottom: 1.15rem;
          line-height: 1.15;
        }

        .contact-intro {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin: 0;
          max-width: 520px;
        }

        /* Channels: Vertical stack on desktop alongside the form */
        .contact-channels {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          width: 100%;
          max-width: 520px;
          margin: 0;
        }

        .channel-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.6rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          position: relative;
          text-decoration: none;
          transition: all 0.35s var(--transition-smooth);
        }

        .channel-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-gold);
          transform: translateY(-3px);
          box-shadow: var(--shadow-card-hover);
        }

        .channel-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--accent-gold-dim);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 0;
        }

        .channel-icon {
          color: var(--accent-gold);
        }

        .channel-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .channel-type {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--text-muted);
        }

        .channel-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-all;
        }

        .channel-arrow {
          color: var(--text-muted);
          transition: all 0.25s var(--transition-smooth);
          flex-shrink: 0;
        }

        .channel-card:hover .channel-arrow {
          color: var(--accent-gold);
          transform: translate(3px, -3px);
        }

        /* Right Form Side */
        .contact-form-side {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        /* Mobile / Tablet Adjustments */
        @media (max-width: 991px) {
          .contact-box {
            padding: 3rem 1.5rem;
          }

          .contact-info-side {
            align-items: center;
            text-align: center;
          }

          .contact-header {
            text-align: center;
            margin: 0 auto 2rem auto;
          }

          .contact-intro {
            max-width: 100%;
          }

          .contact-channels {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .contact-box {
            padding: 2.25rem 1.15rem;
          }

          .contact-headline {
            font-size: clamp(1.85rem, 6.5vw, 2.35rem);
          }

          .contact-intro {
            font-size: 0.95rem;
          }

          .channel-card {
            padding: 1.15rem 1.25rem;
            gap: 1rem;
          }

          .channel-icon-wrap {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </section>
  );
}
