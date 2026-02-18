'use client';

import { motion } from 'framer-motion';
import { accentPalettes } from '@/lib/visual-seed';

const CATEGORIES = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'career', label: 'Career' },
  { id: 'values', label: 'Values' },
  { id: 'contact', label: 'Contact' },
] as const;

interface MobileNavProps {
  activeCategory: string | null;
  visitedCategories: string[];
  onNavigate: (category: string, nodeRect: { x: number; y: number }) => void;
  accentIndex?: number;
}

export function MobileNav({
  activeCategory,
  visitedCategories,
  onNavigate,
  accentIndex = 0,
}: MobileNavProps) {
  const palette = accentPalettes[accentIndex % accentPalettes.length];

  return (
    <motion.nav
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
                 pointer-events-auto md:hidden px-4 py-2 rounded-full
                 bg-white/60 backdrop-blur-md border border-gray-200/40"
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Mobile navigation"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const isVisited = visitedCategories.includes(cat.id);
        const dotSize = isActive ? 18 : 10;

        return (
          <button
            key={cat.id}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
              const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
              onNavigate(cat.id, { x, y });
            }}
            className="relative flex items-center justify-center"
            style={{ width: 24, height: 24 }}
            aria-label={cat.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <motion.div
              className="rounded-full"
              animate={{
                width: dotSize,
                height: dotSize,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                backgroundColor: isActive
                  ? palette.primary
                  : isVisited
                    ? `${palette.primary}30`
                    : 'rgb(209 213 219)',
                boxShadow: isActive
                  ? `0 0 12px 4px ${palette.primary}40`
                  : 'none',
              }}
            />
          </button>
        );
      })}
    </motion.nav>
  );
}
