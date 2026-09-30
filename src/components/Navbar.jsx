import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import BrandWordmark from './BrandWordmark';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'EDUCATION', href: '#education' },
  { label: 'RESEARCH', href: '#research' },
  { label: 'CERTIFICATES', href: '#certificates' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { theme, toggleTheme } = useTheme();

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Track active section and header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPos = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const isMobile = window.innerWidth < 768;
      const headerOffset = isMobile ? 70 : 78;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`nav-header ${scrolled ? 'nav-scrolled' : ''}`}
      role="banner"
    >
      <div className="nav-container">
        {/* LEFT: Signature Wordmark + Tagline */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="nav-brand"
          aria-label="Aleena R — Psychology | HR"
        >
          <BrandWordmark />
        </a>

        {/* RIGHT: Theme Switcher + Kebab Menu Button [ ⋮ ] */}
        <div className="nav-actions">
          {/* Desktop Theme Switcher (Sliding Pill) - screens >= 768px */}
          <div className="desktop-theme-slot">
            <ThemeToggle compact={true} />
          </div>

          {/* Mobile Theme Switcher (Compact 42x42 Icon Button) - screens < 768px */}
          <button
            type="button"
            className="mobile-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Moon size={19} className="mobile-theme-icon moon-icon" />
            ) : (
              <Sun size={20} className="mobile-theme-icon sun-icon" />
            )}
          </button>

          {/* Kebab Menu Button [ ⋮ ] and Dropdown */}
          <div className="kebab-wrapper" ref={menuRef}>
            <button
              ref={buttonRef}
              type="button"
              className={`kebab-btn ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Navigation Menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <svg
                className="kebab-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="5" r="2.2" />
                <circle cx="12" cy="12" r="2.2" />
                <circle cx="12" cy="19" r="2.2" />
              </svg>
            </button>

            {/* Dropdown Floating Panel */}
            {menuOpen && (
              <div
                className="kebab-dropdown"
                role="menu"
                aria-orientation="vertical"
                aria-label="Site Navigation Menu"
              >
                <div className="dropdown-nav-list">
                  {NAV_ITEMS.map((item) => {
                    const id = item.href.substring(1);
                    const isActive = activeSection === id;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`dropdown-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <span className="dropdown-link-text">{item.label}</span>
                        {isActive && <span className="dropdown-active-dot" aria-hidden="true" />}
                      </a>
                    );
                  })}
                </div>

                <div className="dropdown-divider" role="separator" />

                <a
                  href="#contact"
                  role="menuitem"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="dropdown-cta-btn"
                >
                  <span>CONNECT</span>
                  <span className="dropdown-cta-arrow">→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ========================================================
           GLOBAL HEADER SHELL (Sticky, Translucent, Blur)
           ======================================================== */
        .nav-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 78px;
          background: var(--bg-nav);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color 500ms ease-in-out,
                      border-color 500ms ease-in-out,
                      box-shadow 300ms ease,
                      height 300ms ease;
        }

        [data-theme="light"] .nav-header {
          background: rgba(247, 245, 240, 0.90);
          border-bottom-color: rgba(8, 43, 76, 0.08);
        }

        [data-theme="dark"] .nav-header {
          background: rgba(6, 18, 31, 0.88);
          border-bottom-color: rgba(255, 255, 255, 0.07);
        }

        .nav-scrolled {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        /* Container Layout */
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 56px;
          box-sizing: border-box;
          gap: 1rem;
        }

        @media (max-width: 1024px) {
          .nav-container {
            padding: 0 32px;
          }
        }

        /* LEFT: Brand Area */
        .nav-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
          white-space: nowrap;
          cursor: pointer;
        }

        /* RIGHT: Actions Container */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          position: relative;
        }

        /* Desktop Theme Switcher (visible on desktop >= 768px) */
        .desktop-theme-slot {
          display: flex;
          align-items: center;
        }

        /* Mobile Theme Icon Button (hidden on desktop >= 768px) */
        .mobile-theme-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          min-width: 42px;
          min-height: 42px;
          border-radius: 50%;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 250ms ease;
          padding: 0;
          box-sizing: border-box;
          user-select: none;
        }

        [data-theme="dark"] .mobile-theme-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.10);
          color: #F5F7FA;
        }

        [data-theme="dark"] .mobile-theme-btn:hover,
        [data-theme="dark"] .mobile-theme-btn:active {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(242, 140, 24, 0.5);
          color: #F28C18;
          transform: translateY(-1px);
        }

        [data-theme="light"] .mobile-theme-btn {
          background: rgba(8, 43, 76, 0.04);
          border: 1px solid rgba(8, 43, 76, 0.10);
          color: #082B4C;
        }

        [data-theme="light"] .mobile-theme-btn:hover,
        [data-theme="light"] .mobile-theme-btn:active {
          background: rgba(8, 43, 76, 0.08);
          border-color: rgba(233, 162, 74, 0.5);
          color: #E9A24A;
          transform: translateY(-1px);
        }

        .mobile-theme-icon {
          display: block;
          transition: transform 300ms ease;
        }

        .sun-icon {
          color: #E9A24A;
        }

        .moon-icon {
          color: #F28C18;
        }

        /* Kebab Button & Dropdown Wrapper */
        .kebab-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .kebab-btn {
          width: 42px;
          height: 42px;
          min-width: 42px;
          min-height: 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 250ms ease;
          background: transparent;
          padding: 0;
          box-sizing: border-box;
          user-select: none;
        }

        /* Kebab Button Theming */
        [data-theme="light"] .kebab-btn {
          background: rgba(8, 43, 76, 0.04);
          border: 1px solid rgba(8, 43, 76, 0.10);
          color: #082B4C;
        }

        [data-theme="light"] .kebab-btn:hover,
        [data-theme="light"] .kebab-btn.active {
          background: rgba(8, 43, 76, 0.08);
          border-color: rgba(233, 162, 74, 0.55);
          color: #E9A24A;
          transform: translateY(-1px);
        }

        [data-theme="dark"] .kebab-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.10);
          color: #F5F7FA;
        }

        [data-theme="dark"] .kebab-btn:hover,
        [data-theme="dark"] .kebab-btn.active {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(242, 140, 24, 0.55);
          color: #F28C18;
          transform: translateY(-1px);
        }

        .kebab-icon {
          display: block;
          transition: transform 250ms ease;
        }

        .kebab-btn.active .kebab-icon {
          transform: rotate(90deg);
        }

        /* Floating Kebab Dropdown Panel */
        .kebab-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: min(280px, calc(100vw - 32px));
          max-width: 280px;
          border-radius: 16px;
          padding: 0.65rem 0.55rem;
          box-sizing: border-box;
          z-index: 1050;
          user-select: none;
          animation: dropdownReveal 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }

        @keyframes dropdownReveal {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Dropdown Colors - Light Mode */
        [data-theme="light"] .kebab-dropdown {
          background: #FFFFFF;
          color: #082B4C;
          border: 1px solid rgba(8, 43, 76, 0.12);
          box-shadow: 0 16px 36px -6px rgba(8, 43, 76, 0.16),
                      0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Dropdown Colors - Dark Mode */
        [data-theme="dark"] .kebab-dropdown {
          background: #102A43;
          color: #F5F7FA;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 48px -6px rgba(0, 0, 0, 0.55),
                      0 6px 18px rgba(0, 0, 0, 0.35);
        }

        .dropdown-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .dropdown-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 44px;
          padding: 0.65rem 0.95rem;
          border-radius: 10px;
          font-family: var(--font-sans);
          font-size: 0.80rem;
          font-weight: 700;
          letter-spacing: 0.10em;
          text-decoration: none;
          box-sizing: border-box;
          transition: background-color 200ms ease, color 200ms ease, transform 150ms ease;
        }

        [data-theme="light"] .dropdown-nav-link {
          color: #082B4C;
        }

        [data-theme="light"] .dropdown-nav-link:hover,
        [data-theme="light"] .dropdown-nav-link.active {
          background: #F3F6F8;
          color: #E9A24A;
          transform: translateX(2px);
        }

        [data-theme="dark"] .dropdown-nav-link {
          color: #F5F7FA;
        }

        [data-theme="dark"] .dropdown-nav-link:hover,
        [data-theme="dark"] .dropdown-nav-link.active {
          background: #173B59;
          color: #F28C18;
          transform: translateX(2px);
        }

        .dropdown-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        [data-theme="light"] .dropdown-active-dot {
          background: #E9A24A;
          box-shadow: 0 0 8px rgba(233, 162, 74, 0.5);
        }

        [data-theme="dark"] .dropdown-active-dot {
          background: #F28C18;
          box-shadow: 0 0 8px rgba(242, 140, 24, 0.6);
        }

        /* Divider */
        .dropdown-divider {
          height: 1px;
          margin: 0.45rem 0.4rem;
        }

        [data-theme="light"] .dropdown-divider {
          background: rgba(8, 43, 76, 0.08);
        }

        [data-theme="dark"] .dropdown-divider {
          background: rgba(255, 255, 255, 0.10);
        }

        /* CONNECT Bottom Action Button */
        .dropdown-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          padding: 0.72rem 1rem;
          border-radius: 10px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-decoration: none;
          box-sizing: border-box;
          transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
          margin-top: 0.2rem;
        }

        [data-theme="light"] .dropdown-cta-btn {
          background: #E9A24A;
          color: #082B4C;
          box-shadow: 0 4px 12px rgba(233, 162, 74, 0.35);
        }

        [data-theme="light"] .dropdown-cta-btn:hover {
          background: #F4BA6E;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(233, 162, 74, 0.45);
        }

        [data-theme="dark"] .dropdown-cta-btn {
          background: #F28C18;
          color: #06121F;
          box-shadow: 0 4px 14px rgba(242, 140, 24, 0.35);
        }

        [data-theme="dark"] .dropdown-cta-btn:hover {
          background: #FFA23A;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(242, 140, 24, 0.5);
        }

        .dropdown-cta-arrow {
          font-size: 0.92rem;
          transition: transform 200ms ease;
        }

        .dropdown-cta-btn:hover .dropdown-cta-arrow {
          transform: translateX(3px);
        }

        /* ========================================================
           DEDICATED MOBILE HEADER (< 768px)
           Strictly tailored for mobile viewports - NO horizontal scroll!
           ======================================================== */
        @media (max-width: 767px) {
          .nav-header {
            height: 70px; /* 68–72px range */
          }

          .nav-container {
            padding: 16px 18px;
            gap: 0;
            width: 100%;
            box-sizing: border-box;
          }

          /* Hide Desktop Sliding Pill Theme Switcher on Mobile */
          .desktop-theme-slot {
            display: none !important;
          }

          /* Show Mobile Compact 42x42 Theme Button */
          .mobile-theme-btn {
            display: inline-flex;
          }

          /* Brand Area */
          .nav-brand {
            gap: 0;
            flex-shrink: 0;
            display: flex;
            align-items: center;
          }

          /* Right Group: Theme button + Kebab button with 8px gap */
          .nav-actions {
            gap: 8px;
          }

          .mobile-theme-btn,
          .kebab-btn {
            width: 42px;
            height: 42px;
            min-width: 42px;
            min-height: 42px;
          }

          /* Mobile Dropdown Panel */
          .kebab-dropdown {
            width: min(280px, calc(100vw - 32px));
            top: calc(100% + 8px);
            right: 0;
          }

          .dropdown-nav-link {
            min-height: 44px;
            font-size: 0.82rem;
            padding: 0.7rem 1rem;
          }

          .dropdown-cta-btn {
            min-height: 44px;
            font-size: 0.84rem;
          }
        }
      `}</style>
    </header>
  );
}
