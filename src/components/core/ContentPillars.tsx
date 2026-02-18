'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, Fragment } from 'react';
import { accentPalettes } from '@/lib/visual-seed';

const CATEGORIES = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'career', label: 'Career' },
  { id: 'values', label: 'Values' },
  { id: 'contact', label: 'Contact' },
] as const;

interface ContentPillarsProps {
  activeCategory: string | null;
  visitedCategories: string[];
  onNavigate: (category: string, nodeRect: { x: number; y: number }) => void;
  accentIndex?: number;
  isSearching?: boolean;
}

export function ContentPillars({
  activeCategory,
  visitedCategories,
  onNavigate,
  accentIndex = 0,
  isSearching = false,
}: ContentPillarsProps) {
  const palette = accentPalettes[accentIndex % accentPalettes.length];
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeIndex = CATEGORIES.findIndex((c) => c.id === activeCategory);

  return (
    <motion.nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center
                 pointer-events-auto hidden md:flex"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
      aria-label="Content navigation"
    >
      {CATEGORIES.map((cat, i) => {
        const isActive = activeCategory === cat.id;
        const isVisited = visitedCategories.includes(cat.id);
        const dotSize = isActive ? 32 : isSearching ? 28 : 20;

        // Connector between node[i-1] and node[i]:
        // palette-colored if either adjacent node is active
        const connectorNearActive =
          activeIndex >= 0 && (i === activeIndex || i - 1 === activeIndex);

        return (
          <Fragment key={cat.id}>
            {/* Connection line between nodes (T-018) */}
            {i > 0 && (
              <div
                className="flex justify-center"
                style={{ width: 24, height: 18 }}
              >
                <motion.div
                  style={{
                    width: 2,
                    height: '100%',
                    borderRadius: 1,
                    backgroundColor: connectorNearActive
                      ? palette.primary
                      : 'rgb(209 213 219)',
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.6,
                  }}
                />
              </div>
            )}

            {/* Node button */}
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x =
                  ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                const y =
                  ((rect.top + rect.height / 2) / window.innerHeight) * 100;
                onNavigate(cat.id, { x, y });
              }}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex items-center justify-center cursor-pointer"
              style={{ width: 24, height: 24 }}
              aria-label={cat.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Node dot (T-017: enlarged + palette glow) */}
              <motion.div
                className="rounded-full"
                animate={{
                  width: dotSize,
                  height: dotSize,
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  width: { type: 'spring', stiffness: 300, damping: 25 },
                  height: { type: 'spring', stiffness: 300, damping: 25 },
                  scale: {
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.8,
                  },
                }}
                style={{
                  backgroundColor: isActive
                    ? palette.primary
                    : isVisited
                      ? `${palette.primary}1A`
                      : 'rgb(229 231 235)',
                  border: isActive
                    ? 'none'
                    : isVisited
                      ? `1.5px solid ${palette.primary}40`
                      : '2px solid rgb(156 163 175)',
                  boxShadow: isActive
                    ? `0 0 24px 8px ${palette.primary}55`
                    : 'none',
                }}
              />

              {/* Label on hover */}
              <AnimatePresence>
                {hoveredId === cat.id && (
                  <motion.span
                    className="absolute text-sm font-medium text-gray-800
                               whitespace-nowrap select-none"
                    style={{ left: 32 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {cat.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </Fragment>
        );
      })}
    </motion.nav>
  );
}
