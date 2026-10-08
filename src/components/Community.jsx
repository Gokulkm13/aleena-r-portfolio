import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HeartHandshake, Mic2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { communityActivities } from '../data/portfolioData';

export default function Community() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Sync activeIndex on mobile based on carousel scroll position
  const handleScroll = useCallback(() => {
    const container = trackRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.community-card');
    if (!cards.length) return;

    const scrollLeft = container.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    cards.forEach((card, idx) => {
      const diff = Math.abs(card.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Scroll smoothly to a specific card via pagination dots or chevrons
  const scrollToIndex = (index) => {
    const container = trackRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.community-card');
    if (cards[index]) {
      const card = cards[index];
      container.scrollTo({
        left: card.offsetLeft,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = x - startX.current;
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    const container = trackRef.current;
    const cards = container.querySelectorAll('.community-card');
    if (!cards.length) return;

    let closestIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const diff = Math.abs(card.offsetLeft - container.scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    scrollToIndex(closestIndex);
  };

  return (
    <section id="community" className="section community-section" aria-label="Community Engagement">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Community Engagement</span>
          <h2 className="section-title">
            BEYOND <span className="section-title-subtle">ACADEMICS</span>
          </h2>
          <p className="section-description">
            I also value opportunities to contribute outside academic and professional settings. Through community activities and volunteering, I have had opportunities to communicate with people from different backgrounds, coordinate activities, and support organizational needs.
          </p>
        </div>

        {/* Carousel / Grid Wrapper */}
        <div className="community-carousel-wrapper">
          <div
            ref={trackRef}
            className="community-grid"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            role="region"
            aria-label="Community Engagement Carousel"
            tabIndex={0}
          >
            {communityActivities.map((item, index) => {
              const isSpeaker = item.role === 'Resource Person';
              return (
                <div
                  key={index}
                  className={`community-card glass-card ${index === activeIndex ? 'is-active' : ''}`}
                >
                  <div className="community-card-icon-row">
                    <div className="community-icon-circle">
                      {isSpeaker ? (
                        <Mic2 size={20} className="gold-icon" />
                      ) : (
                        <HeartHandshake size={20} className="gold-icon" />
                      )}
                    </div>
                    <span className="community-role-pill">{item.role}</span>
                  </div>

                  <h3 className="community-title">{item.title}</h3>
                  <p className="community-org">{item.organization}</p>

                  {item.description && (
                    <p className="community-desc">{item.description}</p>
                  )}

                  {item.date && (
                    <div className="community-date">
                      <Calendar size={13} />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Carousel Controls & Pagination Dots */}
        {communityActivities.length > 1 && (
          <div className="community-carousel-controls" aria-label="Community carousel controls">
            <button
              type="button"
              className="community-nav-btn community-nav-prev"
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous community activity"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="community-pagination">
              {communityActivities.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`community-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to community activity ${index + 1} of ${communityActivities.length}`}
                  aria-current={index === activeIndex ? 'true' : 'false'}
                />
              ))}
            </div>

            <button
              type="button"
              className="community-nav-btn community-nav-next"
              onClick={() => scrollToIndex(Math.min(communityActivities.length - 1, activeIndex + 1))}
              disabled={activeIndex === communityActivities.length - 1}
              aria-label="Next community activity"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      <style>{`
        .community-section {
          background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
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
          margin-bottom: 2.75rem;
          line-height: 1.7;
        }

        /* Carousel Wrapper containing horizontal overflow */
        .community-carousel-wrapper {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Mobile Horizontal Swipe Carousel (< 768px) */
        @media (max-width: 767px) {
          .community-grid {
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
            gap: 1.5rem;
            padding: 0.5rem 0 1.25rem 0;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            cursor: grab;
            user-select: none;
            -webkit-user-select: none;
          }
          .community-grid:active {
            cursor: grabbing;
          }
          .community-grid::-webkit-scrollbar {
            display: none;
          }

          .community-card {
            flex: 0 0 100%;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            scroll-snap-align: start;
            scroll-snap-stop: always;
            box-sizing: border-box;
            padding: 1.85rem 1.65rem;
            display: flex;
            flex-direction: column;
            position: relative;
            border-radius: 12px;
            background: var(--bg-card);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--border-subtle);
            user-select: none;
            -webkit-user-select: none;
            transition: transform 0.3s var(--transition-smooth), 
                        border-color 0.3s var(--transition-smooth),
                        box-shadow 0.3s var(--transition-smooth),
                        opacity 0.3s var(--transition-smooth);
          }
          .community-card.is-active {
            border-color: var(--border-gold);
            box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.4), 0 0 20px -6px var(--accent-gold-glow);
            opacity: 1;
          }
          .community-card:not(.is-active) {
            opacity: 0.85;
          }

          /* Mobile Carousel Controls & Pagination Dots */
          .community-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .community-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.35rem;
          }
          .community-dot {
            height: 6px;
            width: 6px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 0;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .community-dot.active {
            width: 18px;
            background: var(--accent-gold);
            border-color: var(--accent-gold);
            box-shadow: 0 0 8px var(--accent-gold-glow);
          }
          .community-nav-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.25s ease;
            flex-shrink: 0;
          }
          .community-nav-btn:hover:not(:disabled) {
            background: var(--accent-gold-dim);
            border-color: var(--border-gold);
            color: var(--accent-gold);
          }
          .community-nav-btn:disabled {
            opacity: 0.2;
            cursor: not-allowed;
          }
        }

        /* Desktop & Tablet Multi-Column Grid (>= 768px) */
        @media (min-width: 768px) {
          .community-carousel-wrapper {
            overflow: visible;
          }
          .community-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            overflow: visible;
            scroll-snap-type: none;
            padding: 0;
            cursor: default;
          }
          .community-card {
            padding: 2.25rem;
            display: flex;
            flex-direction: column;
            opacity: 1;
            transform: none;
            cursor: default;
            transition: transform 0.3s var(--transition-smooth),
                        border-color 0.3s var(--transition-smooth),
                        box-shadow 0.3s var(--transition-smooth);
          }
          .community-card:hover {
            transform: translateY(-4px);
            border-color: var(--border-gold);
            box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.6), 0 0 20px -5px var(--accent-gold-glow);
          }
          .community-carousel-controls {
            display: none !important;
          }
        }

        .community-card-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .community-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--accent-gold-dim);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gold-icon {
          color: var(--accent-gold);
        }
        .community-role-pill {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          text-transform: uppercase;
        }
        .community-title {
          font-family: var(--font-editorial);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 0.6rem;
        }
        .community-org {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }
        .community-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }
        .community-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </section>
  );
}
