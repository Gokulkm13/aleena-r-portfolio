import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`theme-toggle-wrapper ${className} ${compact ? 'compact' : ''}`}
      role="radiogroup"
      aria-label="Color Theme Switcher"
    >
      {/* Sliding Pill Highlight */}
      <div
        className={`theme-toggle-slider ${isLight ? 'slider-light' : 'slider-dark'}`}
        aria-hidden="true"
      />

      {/* Light Option Button */}
      <button
        type="button"
        role="radio"
        aria-checked={isLight}
        onClick={() => setTheme('light')}
        className={`theme-toggle-btn ${isLight ? 'active' : ''}`}
        title="Switch to Light Theme (Warm Ivory & Maritime Navy)"
      >
        <Sun size={15} className="toggle-icon sun-icon" />
        <span className="toggle-label">Light</span>
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        role="radio"
        aria-checked={!isLight}
        onClick={() => setTheme('dark')}
        className={`theme-toggle-btn ${!isLight ? 'active' : ''}`}
        title="Switch to Dark Theme (Deep Ocean Navy & Gold)"
      >
        <Moon size={14} className="toggle-icon moon-icon" />
        <span className="toggle-label">Dark</span>
      </button>

      <style>{`
        .theme-toggle-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 3px;
          border-radius: 9999px;
          background: var(--bg-surface);
          border: 1px solid var(--border-card);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
          user-select: none;
          z-index: 10;
          transition: background-color 500ms ease-in-out, border-color 500ms ease-in-out;
        }

        .theme-toggle-slider {
          position: absolute;
          top: 3px;
          bottom: 3px;
          width: calc(50% - 3px);
          border-radius: 9999px;
          transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1),
                      background 500ms ease-in-out,
                      box-shadow 500ms ease-in-out,
                      border-color 500ms ease-in-out;
          pointer-events: none;
          z-index: 1;
        }

        .slider-light {
          transform: translateX(0);
          background: #FFFFFF;
          border: 1px solid rgba(126, 34, 206, 0.12);
          box-shadow: 0 2px 8px rgba(126, 34, 206, 0.10), 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .slider-dark {
          transform: translateX(calc(100%));
          background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%);
          border: 1px solid rgba(192, 132, 252, 0.45);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5), 0 0 14px rgba(168, 85, 247, 0.35);
        }

        .theme-toggle-btn {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.38rem 0.95rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          transition: color 250ms ease, transform 150ms ease;
          cursor: pointer;
          white-space: nowrap;
        }

        .theme-toggle-btn:hover {
          color: var(--text-primary);
        }

        .theme-toggle-btn.active {
          color: var(--text-primary);
        }

        .sun-icon {
          color: #A855F7;
          transition: transform 300ms ease;
        }

        .moon-icon {
          color: #C084FC;
          transition: transform 300ms ease;
        }

        .theme-toggle-btn:hover .sun-icon {
          transform: rotate(30deg);
        }

        .theme-toggle-btn:hover .moon-icon {
          transform: rotate(-15deg);
        }

        .theme-toggle-wrapper.compact {
          height: 40px;
          box-sizing: border-box;
        }

        .theme-toggle-wrapper.compact .theme-toggle-btn {
          padding: 0.35rem 0.85rem;
          font-size: 0.74rem;
          gap: 0.38rem;
          height: 100%;
        }

        @media (max-width: 480px) {
          .theme-toggle-btn {
            padding: 0.35rem 0.8rem;
            font-size: 0.72rem;
          }
        }
      `}</style>
    </div>
  );
}
