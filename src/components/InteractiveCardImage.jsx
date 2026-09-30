import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Reusable Interactive Card Image component
 * Encapsulates the certificate/publication image zoom, button-triggered translucent overlay,
 * and gold action button hover behavior shared across Certifications & Accreditations
 * and Research & Publications.
 */
export default function InteractiveCardImage({
  src,
  alt,
  aspectRatio,
  buttonText = 'VIEW CERTIFICATE',
  buttonIcon: ButtonIcon = ExternalLink,
  onActionClick,
  className = '',
  style = {}
}) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // If buttonText already includes an arrow like '↗' and ButtonIcon is also ExternalLink,
  // we render cleanly without duplicate arrow glyphs.
  const hasArrowInText = typeof buttonText === 'string' && buttonText.includes('↗');
  const IconComponent = hasArrowInText ? null : ButtonIcon;

  return (
    <div
      className={`cert-img-container ${className}`}
      style={{
        ...(aspectRatio ? { aspectRatio } : {}),
        ...style
      }}
      onClick={(e) => {
        if (onActionClick) {
          onActionClick(e);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onActionClick) onActionClick(e);
        }
      }}
      aria-label={typeof buttonText === 'string' ? `${buttonText}: ${alt}` : alt}
    >
      <img
        src={src}
        alt={alt}
        className="cert-card-img"
        loading="lazy"
      />

      {/* Translucent overlay - strictly appears ONLY when hovering the action button */}
      <div
        className={`cert-hover-overlay ${isButtonHovered ? 'is-active' : ''}`}
        aria-hidden="true"
      />

      {/* View Action Button Container */}
      <div className="cert-hover-action">
        <button
          type="button"
          className="cert-hover-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onActionClick) {
              onActionClick(e);
            }
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onFocus={() => setIsButtonHovered(true)}
          onBlur={() => setIsButtonHovered(false)}
          tabIndex={-1}
          aria-label={typeof buttonText === 'string' ? `${buttonText}: ${alt}` : alt}
        >
          <span>{buttonText}</span>
          {IconComponent && <IconComponent size={15} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
