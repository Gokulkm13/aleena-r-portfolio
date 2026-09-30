import React, { useState, useEffect, useRef } from 'react';

/**
 * Character pool for digital text decoding / scramble effect.
 * Mix of numbers, uppercase/lowercase letters, and cipher symbols.
 */
const CHAR_POOL = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#*+?abcdefghijklmnopqrstuvwxyz';

function getRandomGlyph(target) {
  const r = Math.random();
  if (r < 0.45 && /\d/.test(target)) {
    return String(Math.floor(Math.random() * 10));
  }
  if (r < 0.75 && /[A-Z]/.test(target)) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  }
  return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
}

// Fixed slot width map for in-place character stability to completely eliminate layout shivering
const getCharWidth = (targetChar) => {
  if (targetChar === 'M') return '1.25ch';
  if (targetChar === 'S') return '1.05ch';
  if (targetChar === 'c') return '0.95ch';
  if (/\d/.test(targetChar)) return '1.05ch';
  if (targetChar === '+') return '1.0ch';
  return '1.05ch';
};

// Module-level guard: ensures each stat text only scrambles ONCE in the application lifecycle
const completedScrambles = new Set();

/**
 * ScrambleNumber Component
 * Provides a subtle digital decoding animation for statistics numbers.
 * Progressively resolves glyphs from left to right into the exact final value.
 * Triggers ONLY ONCE upon viewport entry and permanently settles into final text.
 * Respects prefers-reduced-motion.
 */
export default function ScrambleNumber({
  text,
  duration = 950,
  shouldAnimate = false
}) {
  const isAlreadyFinished = completedScrambles.has(text);
  const [displayText, setDisplayText] = useState(text);
  const [isComplete, setIsComplete] = useState(isAlreadyFinished);
  const hasStartedRef = useRef(isAlreadyFinished);
  const rafRef = useRef(null);

  useEffect(() => {
    // If already complete or already started, never restart
    if (hasStartedRef.current || completedScrambles.has(text)) {
      if (!isComplete) setIsComplete(true);
      return;
    }

    // Do not start until triggered
    if (!shouldAnimate) {
      return;
    }

    // Accessibility: if user prefers reduced motion, settle immediately with zero animation
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completedScrambles.add(text);
      hasStartedRef.current = true;
      setIsComplete(true);
      setDisplayText(text);
      return;
    }

    // One-time start guard
    hasStartedRef.current = true;

    let isMounted = true;
    const len = text.length;
    const startTime = performance.now();
    let lastTick = 0;
    const tickInterval = 38; // ~26fps glyph update interval for crisp, readable deciphering

    function frame(now) {
      if (!isMounted) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if ((now - lastTick) >= tickInterval || progress >= 1) {
        lastTick = now;

        let result = '';
        for (let i = 0; i < len; i++) {
          // Progressive lock from left to right:
          const lockThreshold = 0.42 + (0.58 * (i + 1)) / len;

          if (progress >= lockThreshold || progress >= 1) {
            result += text[i];
          } else {
            result += getRandomGlyph(text[i]);
          }
        }

        setDisplayText(result);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        completedScrambles.add(text);
        setIsComplete(true);
        setDisplayText(text);
      }
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      isMounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldAnimate, text, duration, isComplete]);

  // While scrambling: render stable character slots so characters never shift horizontally
  if (!isComplete && displayText !== text) {
    const chars = displayText.split('');
    return (
      <span
        className="scramble-container is-decoding"
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          whiteSpace: 'nowrap'
        }}
        aria-hidden="true"
      >
        {chars.map((char, idx) => (
          <span
            key={idx}
            className="scramble-slot"
            style={{
              display: 'inline-block',
              width: getCharWidth(text[idx] || char),
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            {char}
          </span>
        ))}
      </span>
    );
  }

  // Once settled permanently: clean static text with stable display
  return (
    <span
      className="scramble-container is-settled"
      style={{
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        whiteSpace: 'nowrap'
      }}
    >
      {text}
    </span>
  );
}
