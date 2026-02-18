'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps, SkillsData, SkillCategory } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle } from '@/lib/animation';
import {
  calculateSpatialPositions,
  calculateConnections,
  type SpatialItem,
} from '@/lib/spatial-layout';

/* Colour per category index (cycles through palette) */
const CAT_COLORS = (palette: { primary: string; secondary: string; glow: string }) =>
  [palette.primary, palette.secondary, palette.glow] as const;

export function SkillsConstellation({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const skillsData = data as SkillsData;
  const categories: SkillCategory[] = skillsData?.categories ?? [];
  const baseDelay = visualSeed.animationDelay;
  const colors = CAT_COLORS(palette);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [vpWidth, setVpWidth] = useState(1440);
  useEffect(() => {
    setVpWidth(window.innerWidth);
    const onResize = () => setVpWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = vpWidth < 768;

  // Flatten skills into SpatialItems
  const { items, flat } = useMemo(() => {
    const flat: { name: string; level: number; years?: number; description?: string; catIdx: number; catName: string }[] = [];
    const spatialItems: SpatialItem[] = [];

    categories.forEach((cat, catIdx) => {
      const catName = cat.name?.ja ?? cat.name?.en ?? `cat-${catIdx}`;
      (cat.skills ?? []).forEach((skill) => {
        const level = Math.min(Math.max(skill.level ?? 0, 0), 5);
        flat.push({
          name: skill.name ?? '',
          level,
          years: skill.years,
          description: skill.description,
          catIdx,
          catName,
        });
        spatialItems.push({
          id: `${catIdx}-${skill.name}`,
          importance: level / 5,
          group: catName,
        });
      });
    });

    return { items: spatialItems, flat };
  }, [categories]);

  // Calculate positions
  const positions = useMemo(
    () =>
      calculateSpatialPositions(items, { width: 100, height: 100 }, visualSeed, vpWidth),
    [items, visualSeed, vpWidth],
  );

  // Connections for SVG lines
  const connections = useMemo(() => calculateConnections(items), [items]);

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}14`,
            left: '20%',
            top: '10%',
            animation: 'bg-drift-1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{
            background: `${palette.secondary}0C`,
            right: '15%',
            bottom: '15%',
            animation: 'bg-drift-2 22s ease-in-out infinite',
          }}
        />
      </div>

      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {connections.map(([a, b], i) => {
          if (!positions[a] || !positions[b]) return null;
          const catColor = colors[flat[a].catIdx % colors.length];
          return (
            <motion.line
              key={i}
              x1={`${positions[a].x}%`}
              y1={`${positions[a].y}%`}
              x2={`${positions[b].x}%`}
              y2={`${positions[b].y}%`}
              stroke={catColor}
              strokeOpacity={0.18}
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: baseDelay + 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>

      {/* Skill nodes */}
      {flat.map((skill, i) => {
        const pos = positions[i];
        if (!pos) return null;

        const catColor = colors[skill.catIdx % colors.length];
        // Node size: responsive based on viewport and level
        const nodeSize = isMobile ? 16 + skill.level * 4 : 20 + skill.level * 5.6;
        const isHovered = hoveredIdx === i;

        return (
          <motion.div
            key={`${skill.catIdx}-${skill.name}-${i}`}
            data-observe-zone={`skill-${skill.name}`}
            className="absolute z-20 flex items-center justify-center cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: nodeSize,
              height: nodeSize,
              transform: `translate3d(-50%, -50%, ${pos.z}px)`,
              ...breatheStyle(i % 6),
            }}
            initial={{ opacity: 0, scale: 0, filter: 'blur(8px)' }}
            animate={{ opacity: pos.opacity, scale: pos.scale, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: baseDelay + 0.2 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${catColor}${skill.level >= 4 ? '30' : '18'}, transparent 70%)`,
                transform: 'scale(2.5)',
              }}
            />

            {/* Core circle */}
            <div
              className="absolute inset-0 rounded-full border transition-transform duration-300"
              style={{
                backgroundColor: `${catColor}${Math.round(15 + skill.level * 8).toString(16).padStart(2, '0')}`,
                borderColor: `${catColor}40`,
                boxShadow: `0 0 ${4 + skill.level * 3}px ${catColor}25`,
                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
              }}
            />

            {/* Skill name — shown on node */}
            <span
              className="relative z-10 text-xs md:text-sm font-medium text-gray-800
                         whitespace-nowrap select-none pointer-events-none leading-none text-center px-1"
            >
              {skill.name}
            </span>

            {/* Hover detail */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none
                             whitespace-nowrap text-center"
                  style={{ top: nodeSize + 8 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-xs font-medium text-gray-900">{skill.name}</p>
                  {skill.years != null && (
                    <p className="text-[10px] text-gray-800">{skill.years}yr</p>
                  )}
                  {skill.description && (
                    <p className="text-[10px] text-gray-800 max-w-[180px] whitespace-normal">
                      {skill.description}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Category legend — small, bottom-left */}
      <motion.div
        className="absolute bottom-6 left-6 z-30 flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: baseDelay + 1 }}
      >
        {categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-[10px] text-gray-800">
              {cat.name?.ja ?? cat.name?.en ?? ''}
            </span>
          </div>
        ))}
      </motion.div>

      {/* AI Commentary — top right, faint */}
      {commentary && (
        <motion.div
          className="absolute top-6 right-6 max-w-[200px] z-30"
          style={{
            transform: 'translate3d(0, 0, 10px)',
            ...breatheStyle(3),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 0.85 }}
          transition={{ duration: 1.2, delay: baseDelay + 1.2 }}
        >
          <div className="prose prose-sm prose-p:text-gray-800 prose-p:text-xs prose-p:leading-relaxed max-w-none line-clamp-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
