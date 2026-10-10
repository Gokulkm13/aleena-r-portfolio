import React, { useState } from 'react';
import { User, Mail, Phone, Tag, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycjtF6nLSPoKpb_R1X8XEIx7sxn7c9TAb-PJjpxNar60tNMAFiKEGcNan6mzEpJLTJmg/exec';

export default function ContactForm({ eyebrow = "SEND A MESSAGE" }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    type: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error once user starts typing again
    if (status.type === 'error') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    // Field validations
    if (!trimmedName) {
      setStatus({ type: 'error', message: 'Please enter your name.' });
      return;
    }

    if (!trimmedEmail) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setStatus({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    if (!trimmedMessage) {
      setStatus({ type: 'error', message: 'Please write your message.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      // URLSearchParams populates e.parameter in Google Apps Script natively
      const params = new URLSearchParams();
      params.append('name', trimmedName);
      params.append('email', trimmedEmail);
      params.append('phone', trimmedPhone);
      params.append('subject', trimmedSubject);
      params.append('message', trimmedMessage);

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params,
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}.`);
      }

      const result = await response.json();

      if (result && result.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        });
        // Clear inputs on verified success
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error((result && result.message) || 'Unable to submit your message. Please try again.');
      }
    } catch (err) {
      console.error('Contact Form submission error:', err);
      // Preserve form values on error so the user doesn't lose work
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-card-wrapper">
      {/* Subtle Ambient Lavender Glow behind the card */}
      <div className="contact-card-ambient-glow" aria-hidden="true" />

      {/* Main Glassmorphic Contact Card */}
      <div className="contact-form-card glass-card">
        
        {/* Form Header */}
        <div className="contact-card-header">
          <span className="contact-eyebrow">{eyebrow}</span>
          <h3 className="contact-main-heading">
            Send Me <span className="contact-heading-accent">a Message.</span>
          </h3>
          <p className="contact-subtext">
            Have a question, opportunity, or just want to say hello?<br className="contact-subtext-break" />
            I'd love to hear from you.
          </p>
        </div>

        {/* Status Alert Banner */}
        {status.message && (
          <div
            className={`contact-status-banner status-${status.type}`}
            role={status.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {status.type === 'loading' && <Loader2 size={16} className="status-icon status-spin" aria-hidden="true" />}
            {status.type === 'success' && <CheckCircle2 size={16} className="status-icon" aria-hidden="true" />}
            {status.type === 'error' && <AlertCircle size={16} className="status-icon" aria-hidden="true" />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} noValidate className="contact-form-inner">
          
          {/* Row 1: Name and Email */}
          <div className="contact-form-row two-col">
            <div className="contact-input-group">
              <label htmlFor="contact-name" className="sr-only">Your Name</label>
              <div className="contact-input-box">
                <User size={16} className="contact-field-icon" aria-hidden="true" />
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="contact-text-input"
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label htmlFor="contact-email" className="sr-only">Your Email</label>
              <div className="contact-input-box">
                <Mail size={16} className="contact-field-icon" aria-hidden="true" />
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="contact-text-input"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Phone Number (Optional) and Subject (Optional) */}
          <div className="contact-form-row two-col">
            <div className="contact-input-group">
              <label htmlFor="contact-phone" className="sr-only">Phone (Optional)</label>
              <div className="contact-input-box">
                <Phone size={16} className="contact-field-icon" aria-hidden="true" />
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone (Optional)"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  className="contact-text-input"
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label htmlFor="contact-subject" className="sr-only">Subject (Optional)</label>
              <div className="contact-input-box">
                <Tag size={16} className="contact-field-icon" aria-hidden="true" />
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject (Optional)"
                  disabled={isSubmitting}
                  className="contact-text-input"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Your Message */}
          <div className="contact-form-row full-width">
            <div className="contact-input-group">
              <label htmlFor="contact-message" className="sr-only">Your Message</label>
              <div className="contact-input-box textarea-box">
                <MessageSquare size={16} className="contact-field-icon textarea-icon" aria-hidden="true" />
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={3}
                  disabled={isSubmitting}
                  className="contact-text-input contact-textarea"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Submit Button */}
          <div className="contact-submit-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`contact-submit-btn ${isSubmitting ? 'is-busy' : ''}`}
              aria-label="Send Message"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="btn-spinner status-spin" aria-hidden="true" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <span className="btn-arrow" aria-hidden="true">&rarr;</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>

      <style>{`
        /* ==========================================================================
           Contact Form Card: Premium Glassmorphism & Editorial Styling
           ========================================================================== */

        .contact-card-wrapper {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        /* Ambient Glow behind the card */
        .contact-card-ambient-glow {
          position: absolute;
          inset: -15px;
          border-radius: 36px;
          background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.22) 0%, rgba(217, 70, 239, 0.08) 50%, transparent 75%);
          pointer-events: none;
          z-index: 1;
        }

        [data-theme="light"] .contact-card-ambient-glow {
          background: radial-gradient(circle at 50% 50%, rgba(197, 138, 255, 0.24) 0%, rgba(164, 110, 255, 0.08) 50%, transparent 75%);
        }

        /* Glassmorphism Card Surface */
        .contact-form-card {
          position: relative;
          z-index: 2;
          background: rgba(39, 30, 61, 0.82);
          border: 1px solid rgba(190, 120, 255, 0.28);
          border-radius: 24px;
          padding: 1.85rem 1.75rem 1.65rem 1.75rem;
          box-shadow: 0 16px 44px -8px rgba(0, 0, 0, 0.70), 0 0 28px -4px rgba(168, 85, 247, 0.22);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        [data-theme="light"] .contact-form-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(164, 110, 255, 0.20);
          box-shadow: 0 16px 44px -8px rgba(164, 110, 255, 0.16), 0 0 24px -4px rgba(197, 138, 255, 0.10);
        }

        /* Card Header */
        .contact-card-header {
          text-align: left;
          margin-bottom: 1.35rem;
        }

        .contact-eyebrow {
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #C084FC;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
        }

        [data-theme="light"] .contact-eyebrow {
          color: #963BEB;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .contact-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.65rem, 2.1vw, 1.95rem);
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: #F8F4FF;
          margin: 0 0 0.55rem 0;
          opacity: 1 !important;
          transform: none !important;
        }

        [data-theme="light"] .contact-main-heading {
          color: #17152F;
        }

        .contact-heading-accent {
          font-style: italic;
          color: #C084FC;
          font-weight: 600;
        }

        [data-theme="light"] .contact-heading-accent {
          color: #963BEB;
        }

        .contact-subtext {
          font-family: var(--font-sans);
          font-size: 0.86rem;
          line-height: 1.5;
          color: #B9B0CC;
          margin: 0;
        }

        [data-theme="light"] .contact-subtext {
          color: #5A476C;
        }

        /* Status Alert Banner */
        .contact-status-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 0.9rem;
          border-radius: 10px;
          font-size: 0.84rem;
          line-height: 1.4;
          margin-bottom: 1.15rem;
          animation: statusFadeIn 0.25s ease-out;
        }

        @keyframes statusFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-loading {
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.35);
          color: #E9D5FF;
        }

        [data-theme="light"] .status-loading {
          background: rgba(150, 59, 235, 0.08);
          border: 1px solid rgba(150, 59, 235, 0.25);
          color: #7E22CE;
        }

        .status-success {
          background: rgba(34, 197, 94, 0.14);
          border: 1px solid rgba(34, 197, 94, 0.35);
          color: #BBF7D0;
        }

        [data-theme="light"] .status-success {
          background: rgba(22, 163, 74, 0.10);
          border: 1px solid rgba(22, 163, 74, 0.30);
          color: #15803D;
        }

        .status-error {
          background: rgba(239, 68, 68, 0.14);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #FECACA;
        }

        [data-theme="light"] .status-error {
          background: rgba(220, 38, 38, 0.08);
          border: 1px solid rgba(220, 38, 38, 0.30);
          color: #B91C1C;
        }

        .status-icon {
          flex-shrink: 0;
        }

        .status-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        /* Form Layout */
        .contact-form-inner {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .contact-form-row {
          width: 100%;
        }

        .contact-form-row.two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .contact-input-group {
          position: relative;
          width: 100%;
        }

        .contact-input-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .contact-field-icon {
          position: absolute;
          left: 14px;
          color: #C084FC;
          opacity: 0.85;
          pointer-events: none;
          transition: color 0.2s ease, opacity 0.2s ease;
          flex-shrink: 0;
        }

        [data-theme="light"] .contact-field-icon {
          color: #963BEB;
          opacity: 0.80;
        }

        .textarea-box {
          align-items: flex-start;
        }

        .textarea-icon {
          top: 14px;
        }

        /* Inputs & Textarea */
        .contact-text-input {
          width: 100%;
          min-height: 44px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(190, 170, 220, 0.18);
          border-radius: 12px;
          padding: 0.68rem 0.95rem 0.68rem 2.55rem;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: #F7F2FF;
          outline: none;
          transition: all 0.22s ease;
          box-sizing: border-box;
        }

        [data-theme="light"] .contact-text-input {
          background: rgba(255, 255, 255, 0.90);
          border: 1px solid rgba(164, 110, 255, 0.22);
          color: #17152F;
        }

        .contact-text-input::placeholder {
          color: #B9B0CC;
          opacity: 0.85;
        }

        [data-theme="light"] .contact-text-input::placeholder {
          color: #8A8298;
          opacity: 0.90;
        }

        .contact-text-input:hover:not(:disabled) {
          border-color: rgba(190, 120, 255, 0.38);
        }

        [data-theme="light"] .contact-text-input:hover:not(:disabled) {
          border-color: rgba(150, 59, 235, 0.42);
        }

        .contact-text-input:focus {
          border-color: #C084FC;
          background: rgba(255, 255, 255, 0.09);
          box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.18);
        }

        [data-theme="light"] .contact-text-input:focus {
          border-color: #963BEB;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(150, 59, 235, 0.14);
        }

        .contact-textarea {
          min-height: 92px;
          resize: vertical;
          padding-top: 0.72rem;
          line-height: 1.5;
        }

        /* Submit Button */
        .contact-submit-wrap {
          margin-top: 0.35rem;
          width: 100%;
        }

        .contact-submit-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.78rem 1.6rem;
          border-radius: 9999px;
          border: none;
          background: linear-gradient(135deg, #A855F7 0%, #D946EF 100%);
          color: #FFFFFF;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 8px 25px -4px rgba(168, 85, 247, 0.45);
          transition: transform 0.25s var(--transition-smooth), box-shadow 0.25s var(--transition-smooth), opacity 0.2s ease;
        }

        [data-theme="light"] .contact-submit-btn {
          background: linear-gradient(135deg, #963BEB 0%, #D946EF 100%);
          box-shadow: 0 8px 24px -4px rgba(150, 59, 235, 0.40);
        }

        .contact-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -4px rgba(168, 85, 247, 0.60);
        }

        [data-theme="light"] .contact-submit-btn:hover:not(:disabled) {
          box-shadow: 0 12px 28px -4px rgba(150, 59, 235, 0.55);
        }

        .contact-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .contact-submit-btn:focus-visible {
          outline: 2px solid #C084FC;
          outline-offset: 3px;
        }

        [data-theme="light"] .contact-submit-btn:focus-visible {
          outline: 2px solid #963BEB;
        }

        .contact-submit-btn.is-busy,
        .contact-submit-btn:disabled {
          opacity: 0.78;
          cursor: not-allowed;
          transform: none;
        }

        .btn-arrow {
          font-size: 1.05rem;
          transition: transform 0.2s ease;
        }

        .contact-submit-btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(3px);
        }

        /* Responsive Breakpoints */
        @media (max-width: 640px) {
          .contact-card-wrapper {
            max-width: 100%;
          }

          .contact-form-card {
            padding: 1.5rem 1.25rem;
            border-radius: 20px;
          }

          .contact-form-row.two-col {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }

          .contact-subtext-break {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-submit-btn,
          .contact-text-input,
          .btn-arrow,
          .status-spin {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
