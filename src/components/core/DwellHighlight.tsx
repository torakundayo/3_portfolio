'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DwellHighlightProps {
  dwellTarget: string | null;
}

/**
 * Renders a subtle glow overlay on the element matching [data-observe-zone="<dwellTarget>"].
 * When the cursor dwells on an observed zone for 2s, the behavior observer sets dwellTarget.
 * This component finds the element and draws a highlight around it.
 */
export function DwellHighlight({ dwellTarget }: DwellHighlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!dwellTarget) {
      setRect(null);
      return;
    }

    const el = document.querySelector<HTMLElement>(
      `[data-observe-zone="${CSS.escape(dwellTarget)}"]`,
    );
    if (!el) {
      setRect(null);
      return;
    }

    // Get initial rect
    setRect(el.getBoundingClientRect());

    // Update on scroll/resize
    const update = () => setRect(el.getBoundingClientRect());
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [dwellTarget]);

  return (
    <AnimatePresence>
      {dwellTarget && rect && (
        <motion.div
          key={dwellTarget}
          className="fixed pointer-events-none z-40 rounded-2xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { type: 'spring', stiffness: 60, damping: 18 },
          }}
          style={{
            left: rect.left - 16,
            top: rect.top - 12,
            width: rect.width + 32,
            height: rect.height + 24,
            boxShadow:
              '0 0 60px rgba(139,92,246,0.30), 0 0 24px rgba(6,182,212,0.22), 0 0 8px rgba(139,92,246,0.15)',
            border: '1.5px solid rgba(139,92,246,0.35)',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.04), transparent 70%)',
          }}
        />
      )}
    </AnimatePresence>
  );
}
