import React, { useEffect, useRef } from 'react';
import { X, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!certificate) return;

    // Handle Escape key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock background scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="cert-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={certificate.title}
    >
      <div className="cert-modal-container" ref={modalRef}>
        
        {/* Modal Top Bar */}
        <div className="cert-modal-header">
          <div className="cert-modal-title-group">
            <span className="cert-modal-badge">
              <ShieldCheck size={14} />
              VERIFIED CREDENTIAL
            </span>
            <h3 className="cert-modal-title">{certificate.title}</h3>
            <p className="cert-modal-provider">{certificate.provider}</p>
          </div>

          <div className="cert-modal-actions">
            {certificate.pdfUrl && (
              <>
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-action-btn"
                  title="Open original document in new tab"
                  aria-label="Open PDF in new tab"
                >
                  <ExternalLink size={16} />
                  <span>OPEN PDF</span>
                </a>
                <a
                  href={certificate.pdfUrl}
                  download
                  className="modal-action-btn modal-action-btn-gold"
                  title="Download original document"
                  aria-label="Download certificate PDF"
                >
                  <Download size={16} />
                  <span>DOWNLOAD</span>
                </a>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close certificate modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Image Viewport */}
        <div className="cert-modal-viewport">
          <img
            src={certificate.previewImage}
            alt={`${certificate.title} issued by ${certificate.provider}`}
            className="cert-modal-image"
          />
        </div>

        {/* Modal Footer with Authentic Metadata */}
        <div className="cert-modal-footer">
          <div className="modal-meta-grid">
            {certificate.recipient && (
              <div className="meta-cell">
                <span className="meta-cell-label">Recipient</span>
                <span className="meta-cell-value">{certificate.recipient}</span>
              </div>
            )}
            {certificate.instructor && (
              <div className="meta-cell">
                <span className="meta-cell-label">Instructor</span>
                <span className="meta-cell-value">{certificate.instructor}</span>
              </div>
            )}
            {certificate.score && (
              <div className="meta-cell">
                <span className="meta-cell-label">Score</span>
                <span className="meta-cell-value gold-value">{certificate.score}</span>
              </div>
            )}
            {certificate.courseDetails && (
              <div className="meta-cell">
                <span className="meta-cell-label">Course Type</span>
                <span className="meta-cell-value">{certificate.courseDetails}</span>
              </div>
            )}
            {certificate.duration && (
              <div className="meta-cell">
                <span className="meta-cell-label">Duration</span>
                <span className="meta-cell-value">{certificate.duration}</span>
              </div>
            )}
            {certificate.date && (
              <div className="meta-cell">
                <span className="meta-cell-label">Date of Issue</span>
                <span className="meta-cell-value">{certificate.date}</span>
              </div>
            )}
            {certificate.issuedDate && (
              <div className="meta-cell">
                <span className="meta-cell-label">Issued</span>
                <span className="meta-cell-value">{certificate.issuedDate}</span>
              </div>
            )}
            {certificate.paperId && (
              <div className="meta-cell">
                <span className="meta-cell-label">Paper ID</span>
                <span className="meta-cell-value mono-val">{certificate.paperId}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .cert-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(4, 5, 7, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cert-modal-container {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-gold);
          border-radius: 14px;
          width: 100%;
          max-width: 960px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-card-hover);
          overflow: hidden;
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.96) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .cert-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .cert-modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          margin-bottom: 0.25rem;
        }
        .cert-modal-title {
          font-family: var(--font-editorial);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .cert-modal-provider {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .cert-modal-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .modal-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 0.95rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          transition: all 0.2s ease;
        }
        .modal-action-btn:hover {
          background: var(--bg-card-hover);
          color: var(--accent-gold);
        }
        .modal-action-btn-gold {
          background: var(--accent-gold-dim);
          border-color: var(--border-gold);
          color: var(--accent-gold-light);
        }
        .modal-action-btn-gold:hover {
          background: var(--accent-gold);
          color: var(--text-inverse);
        }
        .modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .modal-close-btn:hover {
          background: var(--bg-card-hover);
          color: var(--accent-gold);
        }
        .cert-modal-viewport {
          flex: 1;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: var(--bg-primary);
        }
        .cert-modal-image {
          max-width: 100%;
          max-height: 62vh;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .cert-modal-footer {
          padding: 1rem 1.75rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }
        .modal-meta-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .meta-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .meta-cell-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .meta-cell-value {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .gold-value {
          color: var(--accent-gold);
          font-weight: 700;
        }
        .mono-val {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
