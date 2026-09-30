import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, Award, ExternalLink, Download, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { certificates, continuousLearning } from '../data/portfolioData';
import InteractiveCardImage from './InteractiveCardImage';

export default function Certificates({ onSelectCertificate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isSwipingRef = useRef(false);

  // 3-Card Grouping & Carousel for Workshops section
  const [activeWorkshopSlide, setActiveWorkshopSlide] = useState(0);
  const workshopsTrackRef = useRef(null);
  const isDraggingWorkshops = useRef(false);
  const startXWorkshops = useRef(0);
  const scrollLeftWorkshops = useRef(0);

  // Group continuousLearning into slides of 3 cards each
  const chunkSize = 3;
  const workshopSlides = [];
  for (let i = 0; i < continuousLearning.length; i += chunkSize) {
    workshopSlides.push(continuousLearning.slice(i, i + chunkSize));
  }

  const handleWorkshopsScroll = useCallback(() => {
    const container = workshopsTrackRef.current;
    if (!container) return;

    const slides = container.querySelectorAll('.learning-slide');
    if (!slides.length) return;

    const scrollLeft = container.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    slides.forEach((slide, idx) => {
      const diff = Math.abs(slide.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveWorkshopSlide(closestIndex);
  }, []);

  useEffect(() => {
    const container = workshopsTrackRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleWorkshopsScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleWorkshopsScroll);
    };
  }, [handleWorkshopsScroll]);

  const scrollToWorkshopSlide = (index) => {
    const container = workshopsTrackRef.current;
    if (!container) return;

    const slides = container.querySelectorAll('.learning-slide');
    if (slides[index]) {
      const slide = slides[index];
      container.scrollTo({
        left: slide.offsetLeft,
        behavior: 'smooth'
      });
      setActiveWorkshopSlide(index);
    }
  };

  const handleWorkshopsMouseDown = (e) => {
    if (e.button !== 0 || !workshopsTrackRef.current) return;
    isDraggingWorkshops.current = true;
    startXWorkshops.current = e.pageX - workshopsTrackRef.current.offsetLeft;
    scrollLeftWorkshops.current = workshopsTrackRef.current.scrollLeft;
  };

  const handleWorkshopsMouseMove = (e) => {
    if (!isDraggingWorkshops.current || !workshopsTrackRef.current) return;
    e.preventDefault();
    const x = e.pageX - workshopsTrackRef.current.offsetLeft;
    const walk = x - startXWorkshops.current;
    workshopsTrackRef.current.scrollLeft = scrollLeftWorkshops.current - walk;
  };

  const handleWorkshopsMouseUpOrLeave = () => {
    if (!isDraggingWorkshops.current || !workshopsTrackRef.current) return;
    isDraggingWorkshops.current = false;
    const container = workshopsTrackRef.current;
    const slides = container.querySelectorAll('.learning-slide');
    if (!slides.length) return;

    let closestIndex = 0;
    let minDiff = Infinity;
    slides.forEach((slide, idx) => {
      const diff = Math.abs(slide.offsetLeft - container.scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    scrollToWorkshopSlide(closestIndex);
  };

  // Sync activeIndex based on center scroll position of the carousel
  const handleScroll = useCallback(() => {
    const container = galleryRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.cert-gallery-card');
    if (!cards.length) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = Math.abs(cardCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = galleryRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToIndex = (index) => {
    const container = galleryRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.cert-gallery-card');
    if (cards[index]) {
      const card = cards[index];
      const targetLeft = card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleTouchStart = (e) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    if (deltaX > 8 || deltaY > 8) {
      isSwipingRef.current = true;
    }
  };

  const handleCardClick = (cert) => {
    if (isSwipingRef.current) return;
    onSelectCertificate(cert);
  };

  return (
    <section id="certificates" className="section certificates-section" aria-label="Certifications and Continuous Learning">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Lifelong Learning</span>
          <h2 className="section-title">
            Certifications & <span className="section-title-subtle">Continuous Learning</span>
          </h2>
          <p className="section-description">
            I believe learning does not stop with a degree. I have continued to expand my knowledge through courses, workshops, webinars, and practical learning experiences related to Psychology and human behaviour.
          </p>
        </div>

        {/* Carousel / Gallery Track */}
        <div className="certificates-carousel-wrapper">
          <div
            ref={galleryRef}
            className="certificates-gallery"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            tabIndex={0}
            role="region"
            aria-label="Certificates Carousel"
          >
            {certificates.map((cert, index) => (
              <div
                key={cert.id}
                className={`cert-gallery-card cert-interactive-card glass-card ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => handleCardClick(cert)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCertificate(cert);
                  }
                }}
                aria-label={`View full certificate: ${cert.title}`}
              >
                {/* Reusable Interactive Certificate Image Viewport */}
                <InteractiveCardImage
                  src={cert.previewImage}
                  alt={`${cert.title} Certificate`}
                  aspectRatio={cert.aspectRatio}
                  buttonText="VIEW CERTIFICATE"
                  buttonIcon={ExternalLink}
                  onActionClick={() => handleCardClick(cert)}
                />

                {/* Card Details Bar */}
                <div className="cert-card-info">
                  <span className="cert-card-provider">{cert.provider}</span>
                  <h3 className="cert-card-title">{cert.title}</h3>
                  
                  <div className="cert-card-meta">
                    {cert.score && (
                      <span className="cert-badge-score">Score: {cert.score}</span>
                    )}
                    {cert.duration && (
                      <span className="cert-badge-meta">{cert.duration}</span>
                    )}
                    {cert.date && (
                      <span className="cert-badge-meta">{cert.date}</span>
                    )}
                    {cert.issuedDate && (
                      <span className="cert-badge-meta">{cert.issuedDate}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Pagination Controls */}
        <div className="cert-carousel-controls" aria-label="Certificate carousel controls">
          <button
            type="button"
            className="cert-nav-btn cert-nav-prev"
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous certificate"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="cert-pagination">
            {certificates.map((cert, index) => (
              <button
                key={cert.id}
                type="button"
                className={`cert-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`View certificate ${index + 1} of ${certificates.length}: ${cert.title}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          <button
            type="button"
            className="cert-nav-btn cert-nav-next"
            onClick={() => scrollToIndex(Math.min(certificates.length - 1, activeIndex + 1))}
            disabled={activeIndex === certificates.length - 1}
            aria-label="Next certificate"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Continuous Learning, Workshops & Specialized Trainings */}
        <div className="learning-experiences-container">
          <h3 className="learning-experiences-title">WORKSHOPS, WEBINARS & SPECIALIZED TRAININGS</h3>
          
          <div className="learning-carousel-wrapper">
            <div
              ref={workshopsTrackRef}
              className="learning-carousel-track"
              onMouseDown={handleWorkshopsMouseDown}
              onMouseMove={handleWorkshopsMouseMove}
              onMouseUp={handleWorkshopsMouseUpOrLeave}
              onMouseLeave={handleWorkshopsMouseUpOrLeave}
              tabIndex={0}
              role="region"
              aria-label="Workshops and Webinars Carousel"
            >
              {workshopSlides.map((slideItems, slideIdx) => (
                <div key={slideIdx} className="learning-slide">
                  {slideItems.map((item, itemIdx) => (
                    <div key={slideIdx * chunkSize + itemIdx} className="learning-card glass-card">
                      <span className="learning-card-badge">{item.organization}</span>
                      <h4 className="learning-card-title">{item.title}</h4>
                      <p className="learning-card-detail">{item.detail}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Carousel Pagination Controls for 3-Card Slides */}
          <div className="learning-carousel-controls" aria-label="Workshops slide controls">
            <button
              type="button"
              className="cert-nav-btn cert-nav-prev"
              onClick={() => scrollToWorkshopSlide(Math.max(0, activeWorkshopSlide - 1))}
              disabled={activeWorkshopSlide === 0}
              aria-label="Previous 3 workshops"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="cert-pagination">
              {workshopSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`cert-dot ${index === activeWorkshopSlide ? 'active' : ''}`}
                  onClick={() => scrollToWorkshopSlide(index)}
                  aria-label={`View workshops slide ${index + 1} of ${workshopSlides.length}`}
                  aria-current={index === activeWorkshopSlide ? 'true' : 'false'}
                />
              ))}
            </div>

            <button
              type="button"
              className="cert-nav-btn cert-nav-next"
              onClick={() => scrollToWorkshopSlide(Math.min(workshopSlides.length - 1, activeWorkshopSlide + 1))}
              disabled={activeWorkshopSlide === workshopSlides.length - 1}
              aria-label="Next 3 workshops"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .certificates-section {
          background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          border-top: 1px solid var(--border-subtle);
          overflow-x: clip;
          width: 100%;
          max-width: 100vw;
        }
        .section-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 760px;
          margin-top: 1rem;
          margin-bottom: 3.5rem;
          line-height: 1.7;
        }
        .learning-experiences-container {
          margin-top: 4.5rem;
          padding-top: 3.5rem;
          border-top: 1px solid var(--border-subtle);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .learning-experiences-title {
          font-family: var(--font-editorial);
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        /* Mobile View (< 640px): 3-Card Group Unified Slide Carousel */
        @media (max-width: 639px) {
          .learning-carousel-wrapper {
            position: relative;
            width: 100%;
            max-width: 100%;
            overflow: hidden;
            box-sizing: border-box;
          }
          .learning-carousel-track {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            scrollbar-width: none;
            -ms-overflow-style: none;
            cursor: grab;
            user-select: none;
            -webkit-user-select: none;
            padding: 0.25rem 0 0.5rem 0;
            gap: 1.5rem;
          }
          .learning-carousel-track:active {
            cursor: grabbing;
          }
          .learning-carousel-track::-webkit-scrollbar {
            display: none;
          }
          .learning-slide {
            flex: 0 0 100%;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            scroll-snap-align: start;
            scroll-snap-stop: always;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .learning-card {
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }
          .learning-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
          }
        }

        /* Tablet View (640px to 1023px): Normal 2-Column Grid */
        @media (min-width: 640px) {
          .learning-carousel-wrapper {
            width: 100%;
            overflow: visible;
          }
          .learning-carousel-track {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            width: 100%;
            overflow: visible;
            scroll-snap-type: none;
            padding: 0;
            cursor: default;
          }
          .learning-slide {
            display: contents;
          }
          .learning-carousel-controls {
            display: none !important;
          }
        }

        /* Desktop View (>= 1024px): Normal 3-Column Grid */
        @media (min-width: 1024px) {
          .learning-carousel-track {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        .learning-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }
        .learning-card-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          text-transform: uppercase;
        }
        .learning-card-title {
          font-family: var(--font-editorial);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          overflow-wrap: break-word;
          word-break: normal;
        }
        .learning-card-detail {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          overflow-wrap: break-word;
          word-break: normal;
        }

        /* Carousel Wrapper */
        .certificates-carousel-wrapper {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        /* Default (Mobile & Tablet) Horizontal Carousel */
        .certificates-gallery {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
          gap: 1.25rem;
          padding: 0.5rem 0 1.25rem 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .certificates-gallery::-webkit-scrollbar {
          display: none;
        }
        .certificates-gallery:focus-visible {
          outline: 1px solid var(--border-gold);
          border-radius: 12px;
        }

        .cert-gallery-card {
          flex: 0 0 100%;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          overflow: hidden;
          outline: none;
          user-select: none;
          -webkit-user-select: none;
        }

        @media (max-width: 1023px) {
          .cert-gallery-card.is-active {
            border-color: var(--border-gold);
            box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.8), 0 0 20px -6px var(--accent-gold-glow);
          }
          [data-theme="light"] .cert-gallery-card.is-active {
            box-shadow: var(--shadow-card-hover);
          }
        }

        /* Tablet Width Centering (640px to 1023px) */
        @media (min-width: 640px) and (max-width: 1023px) {
          .certificates-gallery {
            padding-left: calc(50% - 240px);
            padding-right: calc(50% - 240px);
            gap: 1.5rem;
          }
          .cert-gallery-card {
            flex: 0 0 480px;
            max-width: 480px;
          }
        }

        /* Desktop Grid View (1024px and up) */
        @media (min-width: 1024px) {
          .certificates-carousel-wrapper {
            overflow: visible;
          }
          .certificates-gallery {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.75rem;
            overflow: visible;
            scroll-snap-type: none;
            padding: 0;
          }
          .cert-gallery-card {
            flex: initial;
            max-width: none;
            width: auto;
            scroll-snap-align: none;
          }
        }
        .cert-card-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        [data-theme="light"] .cert-card-info {
          background: #FFFFFF;
        }
        .cert-card-provider {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .cert-card-title {
          font-family: var(--font-editorial);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 1rem;
          flex: 1;
        }
        .cert-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }
        .cert-badge-score {
          font-size: 0.72rem;
          font-weight: 700;
          color: #4ade80;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }
        .cert-badge-meta {
          font-size: 0.72rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }
        [data-theme="light"] .cert-badge-meta {
          background: rgba(8, 43, 76, 0.05);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }

        /* Mobile & Tablet Carousel Controls */
        .cert-carousel-controls {
          display: none;
        }
        @media (max-width: 1023px) {
          .cert-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          .cert-pagination {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .cert-dot {
            height: 8px;
            width: 8px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 0;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .cert-dot.active {
            width: 24px;
            background: var(--accent-gold);
            border-color: var(--accent-gold);
            box-shadow: 0 0 10px var(--accent-gold-glow);
          }
          .cert-nav-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.25s ease;
          }
          .cert-nav-btn:hover:not(:disabled) {
            background: rgba(197, 168, 128, 0.15);
            border-color: var(--border-gold);
            color: var(--accent-gold);
          }
          .cert-nav-btn:disabled {
            opacity: 0.2;
            cursor: not-allowed;
          }
        }
      `}</style>
    </section>
  );
}
