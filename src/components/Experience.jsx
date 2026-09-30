import React from 'react';
import { Briefcase, ArrowUpRight, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { experiences } from '../data/portfolioData';

export default function Experience() {
  const currentExp = experiences.find((e) => e.isCurrent);
  const pastExps = experiences.filter((e) => !e.isCurrent);

  return (
    <section id="experience" className="section experience-section" aria-label="Experience">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Career Trajectory</span>
          <h2 className="section-title">
            Work & Internship <span className="section-title-subtle">Experience</span>
          </h2>
        </div>

        {/* Current Role (Prominent Display) */}
        {currentExp && (
          <div className="current-role-spotlight glass-card">
            <div className="spotlight-badge-row">
              <span className="current-badge">
                <span className="pulse-dot"></span>
                CURRENT POSITION
              </span>
              <span className="period-badge">
                <Calendar size={14} />
                {currentExp.period}
              </span>
            </div>

            <div className="spotlight-main">
              <div className="spotlight-titles">
                <h3 className="spotlight-role">{currentExp.role}</h3>
                <h4 className="spotlight-company">{currentExp.company}</h4>
                {currentExp.location && (
                  <p className="spotlight-location">
                    <MapPin size={14} />
                    {currentExp.location}
                  </p>
                )}
              </div>

              {currentExp.companyUrl && (
                <a
                  href={currentExp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight-company-btn"
                  aria-label={`Visit ${currentExp.company} website`}
                >
                  <span>Company Website</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>

            {currentExp.description && (
              <p className="spotlight-description">
                {currentExp.description}
              </p>
            )}

            <div className="spotlight-footer">
              <div className="spotlight-verified-tag">
                <CheckCircle size={15} className="verified-icon" />
                <span>Confirmed Active Appointment & Operations Trainee</span>
              </div>
            </div>
          </div>
        )}

        {/* Timeline of Clinical / Hospital Psychology Internships */}
        <div className="past-experience-container">
          <h3 className="past-exp-heading">CLINICAL & PSYCHOLOGICAL INTERNSHIPS</h3>
          
          <div className="past-exp-grid">
            {pastExps.map((exp) => (
              <div key={exp.id} className="past-exp-card glass-card">
                <div className="card-top-meta">
                  <span className="internship-tag">INTERNSHIP</span>
                  <span className="exp-date">
                    <Calendar size={13} />
                    {exp.period}
                  </span>
                </div>

                <h4 className="exp-role">{exp.role}</h4>
                <p className="exp-institution">{exp.company}</p>

                {exp.location && (
                  <p className="exp-location">
                    <MapPin size={13} />
                    {exp.location}
                  </p>
                )}

                {exp.description && (
                  <p className="exp-description">
                    {exp.description}
                  </p>
                )}

                <div className="exp-focus-tag">
                  Psychology Practice & Case Observation
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .experience-section {
          background-color: var(--bg-primary);
        }
        
        /* Current Role Spotlight */
        .current-role-spotlight {
          padding: 2.75rem;
          border: 1px solid var(--border-gold);
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: var(--shadow-card);
          margin-bottom: 3.5rem;
        }
        .spotlight-badge-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .current-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(197, 168, 128, 0.15);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          padding: 0.35rem 0.9rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--accent-gold);
        }
        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
        }
        .period-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .spotlight-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .spotlight-main {
            flex-direction: row;
            align-items: center;
          }
        }
        .spotlight-role {
          font-family: var(--font-editorial);
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          line-height: 1.1;
          margin-bottom: 0.4rem;
        }
        .spotlight-company {
          font-size: clamp(1.15rem, 2vw, 1.45rem);
          font-weight: 500;
          color: var(--accent-gold);
          margin-bottom: 0.5rem;
        }
        .spotlight-location {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .spotlight-company-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.4rem;
          border-radius: 6px;
          background: var(--accent-gold);
          color: var(--text-inverse);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.25s var(--transition-smooth);
          flex-shrink: 0;
        }
        .spotlight-company-btn:hover {
          background: var(--accent-gold-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(197, 168, 128, 0.4);
        }
        .spotlight-description {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 900px;
        }
        .exp-description {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }
        .spotlight-footer {
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.5rem;
        }
        .spotlight-verified-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .verified-icon {
          color: var(--accent-gold);
        }

        /* Past Experience */
        .past-exp-heading {
          font-family: var(--font-editorial);
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .past-exp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }
        @media (min-width: 768px) {
          .past-exp-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .past-exp-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .card-top-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .internship-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--accent-gold);
        }
        .exp-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .exp-role {
          font-family: var(--font-editorial);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .exp-institution {
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 0.6rem;
        }
        .exp-location {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }
        .exp-focus-tag {
          display: inline-block;
          font-size: 0.75rem;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.4rem 0.75rem;
          margin-top: auto;
          width: fit-content;
        }

        @media (max-width: 480px) {
          .current-role-spotlight {
            padding: 1.75rem 1.25rem;
            margin-bottom: 2.5rem;
          }
          .spotlight-role {
            font-size: clamp(1.45rem, 6vw, 1.85rem);
          }
          .spotlight-company {
            font-size: 1.05rem;
          }
          .spotlight-company-btn {
            width: 100%;
            justify-content: center;
          }
          .past-exp-card {
            padding: 1.5rem 1.25rem;
          }
          .exp-role {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
