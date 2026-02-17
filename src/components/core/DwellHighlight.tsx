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
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.03 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { type: 'spring', stiffness: 80, damping: 20 },
          }}
          style={{
            left: rect.left - 12,
            top: rect.top - 8,
            width: rect.width + 24,
            height: rect.height + 16,
            boxShadow:
              '0 0 30px rgba(139,92,246,0.06), 0 0 12px rgba(6,182,212,0.04)',
            border: '1px solid rgba(139,92,246,0.08)',
          }}
        />
      )}
    </AnimatePresence>
  );
}
