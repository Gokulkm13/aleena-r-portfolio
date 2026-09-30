import React from 'react';
import { FileText, Download, ArrowUpRight, BookOpen, Presentation, Sparkles, Eye, ExternalLink } from 'lucide-react';
import { researchPublications } from '../data/portfolioData';
import InteractiveCardImage from './InteractiveCardImage';

export default function Research({ onSelectCertificate }) {
  const { featuredPaper, bookChapter, presentations } = researchPublications;

  return (
    <section id="research" className="section research-section" aria-label="Research and Publications">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Empirical Inquiry</span>
          <h2 className="section-title">
            RESEARCH THAT SHAPED <span className="section-title-subtle">MY THINKING</span>
          </h2>
          <p className="section-description">
            Research has been an important part of my journey in Psychology. Through academic projects, publications, interviews, analysis, and presentations, I have developed a deeper appreciation for understanding human behaviour through evidence and structured inquiry.
          </p>
        </div>

        {/* Featured Publication: JAAFR Journal Paper with Certificate & PDF Access */}
        <div className="featured-research-card cert-interactive-card glass-card">
          <div className="featured-research-grid">
            
            {/* Left: Publication Data & Access Button */}
            <div className="featured-research-content">
              <div className="research-status-row">
                <span className="badge-gold">
                  <Sparkles size={13} />
                  RESEARCH PUBLICATION 02 • JOURNAL ARTICLE
                </span>
                <span className="research-id-tag">PAPER ID: {featuredPaper.paperId}</span>
              </div>

              <h3 className="featured-paper-title">
                {featuredPaper.title}
              </h3>

              <p className="research-personal-desc">
                {featuredPaper.description}
              </p>

              <div className="journal-meta-box">
                <div className="journal-meta-row">
                  <span className="journal-meta-label">Journal:</span>
                  <span className="journal-meta-value">{featuredPaper.journal}</span>
                </div>
                <div className="journal-meta-row">
                  <span className="journal-meta-label">Issue:</span>
                  <span className="journal-meta-value">{featuredPaper.volume} • {featuredPaper.date}</span>
                </div>
                <div className="journal-meta-row">
                  <span className="journal-meta-label">Co-author:</span>
                  <span className="journal-meta-value">{featuredPaper.coAuthor}</span>
                </div>
              </div>

              {/* Exact Required Button */}
              <div className="research-cta-row">
                <a
                  href={featuredPaper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary read-paper-btn"
                  aria-label="Read / Download research paper PDF"
                >
                  <FileText size={16} />
                  <span>READ / DOWNLOAD RESEARCH PAPER ↗</span>
                </a>

                <a
                  href={featuredPaper.pdfUrl}
                  download="JAAFR2607586.pdf"
                  className="btn-secondary download-direct-btn"
                  title="Direct Download PDF"
                  aria-label="Direct Download JAAFR2607586 PDF"
                >
                  <Download size={15} />
                  <span>DOWNLOAD PDF</span>
                </a>
              </div>
            </div>

            {/* Right: Visual Publication Certificate Display */}
            <div className="featured-cert-preview">
              <div className="cert-preview-frame">
                <InteractiveCardImage
                  src={featuredPaper.certificateImage}
                  alt="JAAFR Publication Certificate for Aleena R"
                  aspectRatio="0.77 / 1"
                  buttonText="VIEW PUBLICATION ↗"
                  buttonIcon={ExternalLink}
                  onActionClick={() =>
                    onSelectCertificate &&
                    onSelectCertificate({
                      title: 'Journal Publication Certificate',
                      provider: 'Journal of Advance and Future Research (JAAFR)',
                      previewImage: featuredPaper.certificateImage,
                      pdfUrl: featuredPaper.certificatePdf,
                      paper: featuredPaper.title,
                      paperId: featuredPaper.paperId,
                      publicationInfo: `${featuredPaper.volume}, ${featuredPaper.date}`,
                      recipient: 'Aleena R'
                    })
                  }
                />
              </div>
              <p className="cert-caption">Official Publication Certificate • JAAFR</p>
            </div>

          </div>
        </div>

        {/* Secondary Publications & Academic Milestones */}
        <div className="secondary-research-grid">
          
          {/* Book Chapter: Research Publication 01 */}
          <div className="secondary-card glass-card">
            <div className="secondary-card-header">
              <BookOpen size={22} className="gold-icon" />
              <span className="secondary-type-tag">RESEARCH PUBLICATION 01 • BOOK CHAPTER</span>
            </div>

            <h4 className="secondary-card-title">{bookChapter.title}</h4>

            <p className="research-personal-desc">
              {bookChapter.description}
            </p>

            <div className="book-meta-list">
              <p>
                <strong>Book:</strong> {bookChapter.bookTitle}
              </p>
              <p>
                <strong>Publisher:</strong> {bookChapter.publisher}
              </p>
              <p>
                <strong>ISBN:</strong> <span className="mono-code">{bookChapter.isbn}</span>
              </p>
              <p>
                <strong>Authors:</strong> {bookChapter.authors.join(', ')}
              </p>
              <p>
                <strong>Co-author:</strong> {bookChapter.coAuthor}
              </p>
            </div>
          </div>

          {/* Paper Presentation & Dissertation */}
          <div className="secondary-card glass-card">
            <div className="secondary-card-header">
              <Presentation size={22} className="gold-icon" />
              <span className="secondary-type-tag">SHARING MY RESEARCH & DISSERTATION</span>
            </div>

            <div className="presentation-items">
              {presentations.map((item, idx) => (
                <div key={idx} className="presentation-item">
                  <span className="pres-type-badge">{item.badge || item.type}</span>
                  <h5 className="pres-title">{item.title}</h5>
                  {item.description && (
                    <p className="pres-desc">{item.description}</p>
                  )}
                  {item.venue && <p className="pres-venue">{item.venue}</p>}
                  <p className="pres-date">{item.date || item.year}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .research-section {
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-subtle);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .section-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 780px;
          margin-top: 1rem;
          margin-bottom: 3rem;
          line-height: 1.7;
          width: 100%;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
        }
        .featured-research-card {
          padding: 3rem;
          margin-bottom: 3rem;
          border-radius: 14px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        [data-theme="light"] .featured-research-card .journal-meta-box {
          background: rgba(8, 43, 76, 0.04);
          border-color: var(--border-subtle);
        }
        [data-theme="light"] .featured-research-card .research-id-tag {
          background: rgba(8, 43, 76, 0.06);
          color: var(--text-muted);
        }
        .featured-research-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 3rem;
          align-items: center;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        @media (min-width: 1024px) {
          .featured-research-grid {
            grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
            gap: 3.5rem;
          }
        }
        .featured-research-content {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .research-status-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .featured-research-content .badge-gold {
          max-width: 100%;
          box-sizing: border-box;
          white-space: normal;
          word-break: break-word;
          line-height: 1.35;
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .featured-research-content .badge-gold svg {
          flex-shrink: 0;
        }
        .research-id-tag {
          font-family: monospace;
          font-size: 0.78rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          max-width: 100%;
          box-sizing: border-box;
          overflow-wrap: break-word;
        }
        .featured-paper-title {
          font-family: var(--font-editorial);
          font-size: clamp(1.4rem, 2.4vw, 2.1rem);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
          hyphens: auto;
          -webkit-hyphens: auto;
        }
        .research-personal-desc {
          font-size: 0.96rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
        }
        .pres-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
        }
        .journal-meta-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          margin-bottom: 2.25rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .journal-meta-row {
          display: flex;
          font-size: 0.92rem;
          gap: 0.75rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .journal-meta-label {
          color: var(--text-muted);
          font-weight: 600;
          min-width: 90px;
          flex-shrink: 0;
        }
        .journal-meta-value {
          color: var(--text-secondary);
          font-weight: 500;
          min-width: 0;
          flex: 1;
          overflow-wrap: break-word;
          word-break: break-word;
          white-space: normal;
        }
        .research-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .read-paper-btn {
          letter-spacing: 0.08em;
          font-size: 0.82rem;
          box-sizing: border-box;
        }
        .download-direct-btn {
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          box-sizing: border-box;
        }
        
        /* Visual Certificate Preview */
        .featured-cert-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .cert-preview-frame {
          width: 100%;
          max-width: 320px;
          min-width: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          box-sizing: border-box;
        }
        [data-theme="light"] .cert-preview-frame {
          box-shadow: 0 8px 24px rgba(8, 43, 76, 0.10);
        }
        .cert-caption {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.85rem;
          text-align: center;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-wrap: break-word;
        }

        /* Secondary Grid */
        .secondary-research-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 2rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .secondary-research-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .secondary-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .secondary-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          flex-wrap: wrap;
        }
        .secondary-type-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--accent-gold);
          white-space: normal;
          overflow-wrap: break-word;
        }
        .secondary-card-title {
          font-family: var(--font-editorial);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
        }
        .book-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .book-meta-list p {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .book-meta-list strong {
          color: var(--text-primary);
        }
        .mono-code {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          word-break: break-all;
        }
        .presentation-items {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .presentation-item {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .presentation-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .pres-type-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          background: var(--accent-gold-dim);
          border: 1px solid var(--border-gold);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          margin-bottom: 0.6rem;
          white-space: normal;
          max-width: 100%;
          box-sizing: border-box;
        }
        .pres-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
          line-height: 1.4;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
        }
        .pres-venue {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-wrap: break-word;
          word-break: normal;
          white-space: normal;
        }
        .pres-date {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .featured-research-card {
            padding: 1.5rem 1.25rem;
            margin-bottom: 2.5rem;
          }
          .featured-research-grid {
            gap: 2rem;
          }
          .featured-paper-title {
            font-size: clamp(1.15rem, 5vw, 1.45rem);
            margin-bottom: 1rem;
          }
          .research-personal-desc {
            font-size: 0.92rem;
            margin-bottom: 1.25rem;
          }
          .journal-meta-box {
            padding: 1rem;
            gap: 0.65rem;
            margin-bottom: 1.75rem;
          }
          .research-cta-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .research-cta-row .read-paper-btn,
          .research-cta-row .download-direct-btn {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            white-space: normal;
            text-align: center;
            justify-content: center;
            padding: 0.85rem 1.15rem;
            font-size: 0.78rem;
            line-height: 1.35;
            overflow-wrap: break-word;
            word-break: normal;
          }
          .research-cta-row .read-paper-btn svg,
          .research-cta-row .download-direct-btn svg {
            flex-shrink: 0;
          }
          .secondary-card {
            padding: 1.5rem 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .featured-research-card {
            padding: 1.35rem 1.25rem;
          }
          .featured-research-content .badge-gold {
            font-size: 0.68rem;
            padding: 0.35rem 0.6rem;
            letter-spacing: 0.03em;
          }
          .research-id-tag {
            font-size: 0.72rem;
            padding: 0.25rem 0.5rem;
          }
          .featured-paper-title {
            font-size: clamp(1.05rem, 4.8vw, 1.3rem);
            line-height: 1.3;
          }
          .journal-meta-box {
            padding: 0.85rem 0.95rem;
            gap: 0.65rem;
          }
          .journal-meta-row {
            flex-direction: column;
            gap: 0.18rem;
            font-size: 0.88rem;
          }
          .journal-meta-label {
            min-width: 0;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .journal-meta-value {
            font-size: 0.86rem;
            line-height: 1.4;
          }
          .research-cta-row .read-paper-btn,
          .research-cta-row .download-direct-btn {
            padding: 0.8rem 0.95rem;
            font-size: 0.74rem;
            letter-spacing: 0.04em;
          }
          .secondary-card {
            padding: 1.35rem 1.25rem;
          }
          .secondary-card-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}
