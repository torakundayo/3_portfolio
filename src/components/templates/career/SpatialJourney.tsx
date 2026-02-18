'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemplateProps, CareerData, CareerEntry } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle } from '@/lib/animation';
import {
  calculateSpatialPositions,
  type SpatialItem,
} from '@/lib/spatial-layout';

export function CareerSpatialJourney({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const careerData = data as CareerData;
  const positions_data: CareerEntry[] = careerData?.history ?? [];
  const baseDelay = visualSeed.animationDelay;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [vpWidth, setVpWidth] = useState(1440);
  useEffect(() => {
    setVpWidth(window.innerWidth);
    const onResize = () => setVpWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = vpWidth < 768;

  const items: SpatialItem[] = useMemo(
    () =>
      positions_data.map((p, i) => ({
        id: p.company?.ja || p.company?.en || `pos-${i}`,
        importance: 1 - i * 0.2,
        group: 'career',
      })),
    [positions_data],
  );

  const spatialPositions = useMemo(
    () => calculateSpatialPositions(items, { width: 100, height: 100 }, visualSeed, vpWidth),
    [items, visualSeed, vpWidth],
  );

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}18`,
            left: '20%',
            top: '10%',
            animation: 'bg-drift-1 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* Connection path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {positions_data.slice(0, -1).map((_, i) => {
          const a = spatialPositions[i];
          const b = spatialPositions[i + 1];
          if (!a || !b) return null;
          return (
            <motion.line
              key={i}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke={palette.glow}
              strokeOpacity={0.2}
              strokeWidth={1.5}
              strokeDasharray="6 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: baseDelay + 0.5 + i * 0.2 }}
            />
          );
        })}
      </svg>

      {/* Career nodes */}
      {positions_data.map((pos, i) => {
        const sPos = spatialPositions[i];
        if (!sPos) return null;
        const isHovered = hoveredIdx === i;
        const nodeSize = isMobile
          ? 50 + (1 - i * 0.15) * 40
          : 60 + (1 - i * 0.15) * 60;

        return (
          <motion.div
            key={pos.company?.ja || pos.company?.en || i}
            className="absolute z-20 cursor-pointer text-center"
            style={{
              left: `${sPos.x}%`,
              top: `${sPos.y}%`,
              width: nodeSize,
              transform: `translate3d(-50%, -50%, ${sPos.z}px)`,
              ...breatheStyle(i % 4),
            }}
            initial={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
            animate={{ opacity: sPos.opacity, scale: sPos.scale, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: baseDelay + 0.3 + i * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${palette.primary}25, transparent 70%)`,
                transform: 'scale(2.5)',
              }}
            />

            {/* Period */}
            <p className="text-[9px] font-mono text-gray-800" style={{ color: palette.glow }}>
              {pos.period}
            </p>

            {/* Role */}
            <p className="text-xs md:text-sm font-bold text-gray-900 mt-1 leading-tight">
              {pos.role?.ja || pos.role?.en || ''}
            </p>

            {/* Company */}
            <p className="text-[10px] text-gray-800 mt-0.5">
              {pos.company?.ja || pos.company?.en || ''}
            </p>

            {/* Hover detail */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none mt-2"
                  style={{ top: '100%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {(pos.description?.ja || pos.description?.en) && (
                    <p className="text-xs text-gray-800 max-w-[200px] whitespace-normal leading-relaxed">
                      {pos.description?.ja || pos.description?.en}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Commentary */}
      {commentary && (
        <motion.div
          className="absolute bottom-6 right-6 max-w-[200px] z-30 opacity-50 hover:opacity-85 transition-opacity duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: baseDelay + 1.2 }}
        >
          <p className="text-xs text-gray-800 leading-relaxed line-clamp-3">
            {commentary}
          </p>
        </motion.div>
      )}
    </div>
  );
}
