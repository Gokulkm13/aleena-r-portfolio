import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Users, Search, ShieldCheck, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { skills } from '../data/portfolioData';

// Minimal subtle icon helper per competency category
function getCategoryIcon(category) {
  switch (category) {
    case 'People & Interpersonal':
      return <Users size={15} />;
    case 'Analytical & Research':
      return <Search size={15} />;
    case 'Workplace & Governance':
      return <ShieldCheck size={15} />;
    case 'Growth & Mindset':
      return <TrendingUp size={15} />;
    default:
      return <Sparkles size={15} />;
  }
}

export default function Skills() {
  const categories = ['All', ...new Set(skills.map((s) => s.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  // Group filteredSkills into slides of 3 items each
  const chunkSize = 3;
  const competencyGroups = [];
  for (let i = 0; i < filteredSkills.length; i += chunkSize) {
    competencyGroups.push(filteredSkills.slice(i, i + chunkSize));
  }

  // Sync activeGroupIndex on mobile based on carousel scroll position
  const handleScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const slides = container.querySelectorAll('.skills-slide');
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

    setActiveGroupIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Adjust activeGroupIndex if out of bounds after category change
  useEffect(() => {
    if (activeGroupIndex >= competencyGroups.length && competencyGroups.length > 0) {
      setActiveGroupIndex(0);
    }
  }, [competencyGroups.length, activeGroupIndex]);

  // Handle category filter switch: reset active group index and scroll to beginning
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setActiveGroupIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  // Scroll smoothly to a specific 3-item group via pagination dots or chevrons
  const scrollToGroup = (index) => {
    const container = carouselRef.current;
    if (!container) return;

    const slides = container.querySelectorAll('.skills-slide');
    if (slides[index]) {
      const slide = slides[index];
      container.scrollTo({
        left: slide.offsetLeft,
        behavior: 'smooth'
      });
      setActiveGroupIndex(index);
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !carouselRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftStart.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startX.current;
    carouselRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging.current || !carouselRef.current) return;
    isDragging.current = false;
    const container = carouselRef.current;
    const slides = container.querySelectorAll('.skills-slide');
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

    scrollToGroup(closestIndex);
  };

  return (
    <section id="skills" className="section skills-section" aria-label="Skills and Competencies">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Core Competencies</span>
          <h2 className="section-title">
            WHAT I <span className="section-title-subtle">BRING</span>
          </h2>
          <p className="skills-subtitle">
            Through my academic, research, internship, and volunteer experiences, I have developed a combination of interpersonal, organizational, research, and professional skills.
          </p>
        </div>

        {/* Category Filters */}
        <div className="skills-filter-row" role="tablist" aria-label="Filter skills by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`skills-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel / Grid Track Wrapper */}
        <div className="skills-carousel-wrapper">
          <div
            ref={carouselRef}
            className="skills-grid"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            role="region"
            aria-label="Core Competencies Carousel"
            tabIndex={0}
          >
            {competencyGroups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className={`skills-slide ${groupIdx === activeGroupIndex ? 'is-active' : ''}`}
              >
                {group.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-card glass-card"
                  >
                    <div className="skill-card-top">
                      <span className="skill-category-tag">{skill.category}</span>
                      <span className="skill-icon-wrapper" aria-hidden="true">
                        {getCategoryIcon(skill.category)}
                      </span>
                    </div>
                    
                    <h3 className="skill-name">{skill.name}</h3>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel Controls & Pagination Dots */}
        {competencyGroups.length > 1 && (
          <div className="skills-carousel-controls" aria-label="Core Competencies carousel controls">
            <button
              type="button"
              className="skill-nav-btn skill-nav-prev"
              onClick={() => scrollToGroup(Math.max(0, activeGroupIndex - 1))}
              disabled={activeGroupIndex === 0}
              aria-label="Previous 3 competencies"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="skills-pagination">
              {competencyGroups.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`skill-dot ${index === activeGroupIndex ? 'active' : ''}`}
                  onClick={() => scrollToGroup(index)}
                  aria-label={`Go to competencies group ${index + 1} of ${competencyGroups.length}`}
                  aria-current={index === activeGroupIndex ? 'true' : 'false'}
                />
              ))}
            </div>

            <button
              type="button"
              className="skill-nav-btn skill-nav-next"
              onClick={() => scrollToGroup(Math.min(competencyGroups.length - 1, activeGroupIndex + 1))}
              disabled={activeGroupIndex === competencyGroups.length - 1}
              aria-label="Next 3 competencies"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      <style>{`
        .skills-section {
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-subtle);
          overflow-x: clip;
          width: 100%;
          max-width: 100vw;
        }
        .skills-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 650px;
          margin-top: -1.5rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .skills-filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }
        .skills-filter-btn {
          padding: 0.55rem 1.15rem;
          border-radius: 24px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s var(--transition-smooth);
        }
        .skills-filter-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-gold);
          background: var(--bg-card-hover);
        }
        .skills-filter-btn.active {
          background: var(--accent-gold-dim);
          border-color: var(--border-gold);
          color: var(--accent-gold-light);
          box-shadow: 0 0 15px var(--accent-gold-dim);
        }

        /* Carousel Wrapper strictly containing horizontal overflow */
        .skills-carousel-wrapper {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        /* Mobile Horizontal Swipe Carousel (< 768px) */
        @media (max-width: 767px) {
          .skills-subtitle {
            margin-bottom: 1.75rem;
          }
          .skills-filter-row {
            gap: 0.5rem;
            margin-bottom: 2rem;
          }
          .skills-filter-btn {
            padding: 0.45rem 0.95rem;
            font-size: 0.74rem;
          }

          .skills-grid {
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
          .skills-grid:active {
            cursor: grabbing;
          }
          .skills-grid::-webkit-scrollbar {
            display: none;
          }

          .skills-slide {
            flex: 0 0 100%;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            scroll-snap-align: start;
            scroll-snap-stop: always;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            transition: opacity 0.35s var(--transition-smooth);
          }
          .skills-slide.is-active {
            opacity: 1;
          }
          .skills-slide:not(.is-active) {
            opacity: 0.75;
          }

          .skill-card {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 1.35rem 1.4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            min-height: 105px;
            border-radius: 12px;
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-subtle);
            user-select: none;
            -webkit-user-select: none;
            transition: transform 0.3s var(--transition-smooth), 
                        border-color 0.3s var(--transition-smooth),
                        box-shadow 0.3s var(--transition-smooth);
          }
          .skill-card:active {
            border-color: var(--border-gold);
            box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.4), 0 0 16px -4px var(--accent-gold-glow);
          }
        }

        /* Desktop & Tablet Multi-Column Grid (>= 768px) */
        @media (min-width: 768px) {
          .skills-carousel-wrapper {
            overflow: visible;
          }
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5rem;
            overflow: visible;
            scroll-snap-type: none;
            padding: 0;
            cursor: default;
          }
          .skills-slide {
            display: contents;
          }
          .skill-card {
            padding: 1.75rem 1.65rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            min-height: 140px;
            border-radius: 12px;
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-subtle);
            transition: transform 0.3s var(--transition-smooth),
                        border-color 0.3s var(--transition-smooth),
                        box-shadow 0.3s var(--transition-smooth);
          }
          .skill-card:hover {
            transform: translateY(-4px);
            border-color: var(--border-gold);
            box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.6), 0 0 20px -5px var(--accent-gold-glow);
          }
          .skills-carousel-controls {
            display: none !important;
          }
        }

        /* Common Card Internal Elements */
        .skill-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }
        .skill-category-tag {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          text-transform: uppercase;
        }
        .skill-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(197, 168, 128, 0.45);
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .skill-card:hover .skill-icon-wrapper,
        .skill-card.is-active .skill-icon-wrapper {
          color: var(--accent-gold);
          transform: scale(1.1);
        }
        .skill-name {
          font-family: var(--font-editorial);
          font-size: clamp(1.2rem, 3.8vw, 1.35rem);
          font-weight: 700;
          letter-spacing: 0.015em;
          color: var(--text-primary);
          line-height: 1.35;
          margin: 0;
          word-break: break-word;
        }

        /* Mobile Carousel Controls & Pagination Dots */
        .skills-carousel-controls {
          display: none;
        }
        @media (max-width: 767px) {
          .skills-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .skills-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.35rem;
            flex-wrap: wrap;
            max-width: 260px;
          }
          .skill-dot {
            height: 6px;
            width: 6px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 0;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .skill-dot.active {
            width: 18px;
            background: var(--accent-gold);
            border-color: var(--accent-gold);
            box-shadow: 0 0 8px var(--accent-gold-glow);
          }
          .skill-nav-btn {
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
          .skill-nav-btn:hover:not(:disabled) {
            background: rgba(197, 168, 128, 0.15);
            border-color: var(--border-gold);
            color: var(--accent-gold);
          }
          .skill-nav-btn:disabled {
            opacity: 0.2;
            cursor: not-allowed;
          }
        }
      `}</style>
    </section>
  );
}
