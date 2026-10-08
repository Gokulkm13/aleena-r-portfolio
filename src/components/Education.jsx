import React from 'react';
import { GraduationCap, Calendar, Landmark, BookCheck } from 'lucide-react';
import { education } from '../data/portfolioData';

export default function Education() {
  return (
    <section id="education" className="section education-section" aria-label="Education">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Academic Foundation</span>
          <h2 className="section-title">
            My Academic <span className="section-title-subtle">Journey</span>
          </h2>
          <p className="section-description">
            My academic journey in Psychology has been an important part of understanding human behaviour, research, psychological processes, and interpersonal relationships. Each stage of my education has helped me develop both academic knowledge and a stronger interest in applying psychology to real-world environments.
          </p>
        </div>

        <div className="education-grid">
          {education.map((item, index) => (
            <div key={item.id} className="edu-card glass-card">
              <div className="edu-card-decor">
                <span className="edu-index">0{index + 1}</span>
                <GraduationCap size={24} className="edu-icon" />
              </div>

              <div className="edu-period-badge">
                <Calendar size={13} />
                <span>{item.period}</span>
              </div>

              <h3 className="edu-degree">{item.degree}</h3>

              <div className="edu-meta-block">
                <div className="edu-meta-line">
                  <Landmark size={15} className="edu-meta-icon" />
                  <span className="edu-institution">{item.institution}</span>
                </div>
                <div className="edu-meta-line">
                  <BookCheck size={15} className="edu-meta-icon" />
                  <span className="edu-university">{item.university}</span>
                </div>
              </div>

              <div className="edu-footer-accent">
                <span className="edu-field-pill">Psychological Science</span>
                <span className="edu-field-pill">Human Behavior</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .education-section {
          background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          border-top: 1px solid var(--border-subtle);
        }
        .section-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 760px;
          margin-top: 1rem;
          margin-bottom: 2.75rem;
          line-height: 1.7;
        }
        .education-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .education-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }
        .edu-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .edu-card-decor {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .edu-index {
          font-family: var(--font-accent);
          font-size: 1.25rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
        .edu-icon {
          color: var(--accent-gold);
        }
        .edu-period-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--accent-gold-dim);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          padding: 0.35rem 0.85rem;
          font-size: 0.75rem;
          color: var(--accent-gold-light);
          font-weight: 600;
          width: fit-content;
          margin-bottom: 1.25rem;
        }
        .edu-degree {
          font-family: var(--font-editorial);
          font-size: clamp(1.6rem, 2.4vw, 2.1rem);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 1.25rem;
        }
        .edu-meta-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .edu-meta-line {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.95rem;
        }
        .edu-meta-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .edu-institution {
          color: var(--text-secondary);
          font-weight: 500;
        }
        .edu-university {
          color: var(--text-muted);
          font-size: 0.88rem;
        }
        .edu-footer-accent {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
        }
        .edu-field-pill {
          font-size: 0.72rem;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.3rem 0.65rem;
          letter-spacing: 0.03em;
        }
        @media (max-width: 480px) {
          .edu-card {
            padding: 1.5rem 1.25rem;
          }
          .edu-degree {
            font-size: clamp(1.3rem, 5.5vw, 1.6rem);
          }
        }
      `}</style>
    </section>
  );
}
