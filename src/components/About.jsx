import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Users, Award, Globe, Compass, CheckCircle2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function About() {
  const langCardRef = useRef(null);
  const [isLangVisible, setIsLangVisible] = useState(false);

  useEffect(() => {
    const el = langCardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when the LANGUAGES card enters viewport, reset when it leaves
        if (entry.isIntersecting) {
          setIsLangVisible(true);
        } else {
          setIsLangVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getLanguagePercentage = (item) => {
    const name = item.language ? item.language.toLowerCase() : '';
    if (name === 'malayalam') return 100;
    if (name === 'english') return 88;
    if (name === 'hindi') return 70;
    if (item.proficiency === 'Native') return 100;
    if (item.proficiency === 'Fluent') return 88;
    return 70;
  };

  return (
    <section id="about" className="section about-section" aria-label="About Me">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Profile Overview</span>
          <h2 className="section-title">
            UNDERSTANDING PEOPLE. <span className="section-title-subtle">BUILDING BETTER WORKPLACES.</span>
          </h2>
        </div>

        <div className="about-grid">
          
          {/* Left: Bio Narrative */}
          <div className="about-narrative">
            <p className="about-lead-text">
              I am a Psychology postgraduate with a strong interest in understanding people, workplace behaviour, and the factors that contribute to healthy and productive organizational environments.
            </p>

            <p className="about-body-text">
              My academic journey has given me a foundation in psychological theory, research, observation, communication, and understanding human behaviour. Through my internships and academic experiences, I have had opportunities to work in professional and multidisciplinary environments where I developed my interpersonal, documentation, observation, and communication skills.
            </p>

            <p className="about-body-text">
              I am particularly interested in bringing psychological understanding into human resources and workplace practices. I believe that understanding people is an important part of building supportive, effective, and meaningful workplaces.
            </p>

            <p className="about-body-text">
              As I continue developing my career, I am looking forward to learning, contributing, and growing within the field of Human Resources.
            </p>

            {/* Core Values / Focus Pillars */}
            <div className="about-pillars">
              <div className="pillar-card">
                <Users size={20} className="pillar-icon" />
                <div>
                  <h4 className="pillar-title">People & Workplace</h4>
                  <p className="pillar-desc">Cultivating empathetic, communicative, and collaborative workplace environments where people feel supported.</p>
                </div>
              </div>

              <div className="pillar-card">
                <BookOpen size={20} className="pillar-icon" />
                <div>
                  <h4 className="pillar-title">Empirical Research</h4>
                  <p className="pillar-desc">Applying psychological understanding, structured inquiry, and evidence-based insights to people operations.</p>
                </div>
              </div>

              <div className="pillar-card">
                <Award size={20} className="pillar-icon" />
                <div>
                  <h4 className="pillar-title">Professional Integrity</h4>
                  <p className="pillar-desc">Upholding strict confidentiality, organizational precision, and continuous learning in every engagement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Languages & Future Direction */}
          <div className="about-sidebar">
            
            {/* Languages Card */}
            <div ref={langCardRef} className="glass-card lang-card">
              <div className="card-header-icon">
                <Globe size={22} className="gold-icon" />
                <h3 className="card-heading">LANGUAGES I SPEAK</h3>
              </div>
              <p className="card-subhead">Communication is one of the ways I connect with people, and I value being able to communicate across different environments.</p>
              
              <div className="lang-list">
                {personalInfo.languages.map((item, index) => {
                  const targetWidth = getLanguagePercentage(item);
                  return (
                    <div key={item.language} className="lang-item">
                      <div className="lang-info">
                        <span className="lang-name">{item.language}</span>
                        <span className="lang-proficiency">{item.proficiency}</span>
                      </div>
                      <div className="lang-bar-bg">
                        <div
                          className="lang-bar-fill"
                          role="progressbar"
                          aria-label={`${item.language} proficiency: ${item.proficiency}`}
                          aria-valuenow={isLangVisible ? targetWidth : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{
                            '--target-width': `${targetWidth}%`,
                            width: isLangVisible ? `${targetWidth}%` : '0%',
                            transition: isLangVisible
                              ? `width 1.35s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                              : 'none'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Career & Future Direction Card: Where I'm Headed */}
            <div className="glass-card summary-card">
              <div className="card-header-icon">
                <Compass size={22} className="gold-icon" />
                <h3 className="card-heading">WHERE I'M HEADED</h3>
              </div>
              <p className="future-direction-text">
                I am building my career at the intersection of Psychology and Human Resources. My goal is to continue learning about people, workplace behaviour, employee well-being, and organizational practices while developing myself as an HR professional.
              </p>
              <p className="future-direction-subtext">
                I want to bring empathy, curiosity, research-based thinking, and a willingness to learn into every professional environment I become part of.
              </p>
              <ul className="attribute-list">
                <li>
                  <CheckCircle2 size={16} className="attr-check" />
                  <span>Empathetic Interpersonal Communication</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="attr-check" />
                  <span>Structured Research & Analytical Inquiry</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="attr-check" />
                  <span>Professional Ethics & Strict Confidentiality</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="attr-check" />
                  <span>Adaptability & Passion for Lifelong Learning</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .about-section {
          background: transparent;
          border-top: 1px solid var(--border-subtle);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
        }
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1.2fr 0.8fr;
            gap: 4.5rem;
          }
        }
        .about-lead-text {
          font-size: 1.35rem;
          font-weight: 500;
          line-height: 1.6;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .highlight-text {
          color: var(--accent-gold);
          border-bottom: 1px dashed var(--accent-gold);
        }
        .about-body-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .about-pillars {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .pillar-card {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          transition: all 0.3s var(--transition-smooth);
        }
        .pillar-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-gold);
        }
        .pillar-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .pillar-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        .pillar-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .about-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .lang-card,
        .summary-card {
          padding: 2rem;
        }
        .card-header-icon {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .gold-icon {
          color: var(--accent-gold);
        }
        .card-heading {
          font-family: var(--font-editorial);
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }
        .card-subhead {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 1.75rem;
        }
        .lang-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .lang-item {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .lang-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .lang-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .lang-proficiency {
          font-size: 0.8rem;
          color: var(--accent-gold);
          font-weight: 500;
        }
        .lang-bar-bg {
          width: 100%;
          height: 5px;
          background: var(--border-card);
          border-radius: 4px;
          overflow: hidden;
        }
        .lang-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-gold-dim), var(--accent-gold));
          border-radius: 4px;
          will-change: width;
        }

        @media (prefers-reduced-motion: reduce) {
          .lang-bar-fill {
            transition: none !important;
            width: var(--target-width) !important;
          }
        }
        .future-direction-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .future-direction-subtext {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }
        .attribute-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .attribute-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .attr-check {
          color: var(--accent-gold);
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .about-lead-text {
            font-size: 1.1rem;
            line-height: 1.65;
            margin-bottom: 1.25rem;
          }
          .about-body-text {
            font-size: 0.95rem;
            line-height: 1.7;
            margin-bottom: 1.25rem;
          }
          .about-grid {
            gap: 2.5rem;
          }
          .pillar-card {
            padding: 1.1rem;
            gap: 1rem;
          }
          .lang-card,
          .summary-card {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
