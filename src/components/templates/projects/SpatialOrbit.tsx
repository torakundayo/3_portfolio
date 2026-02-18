'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemplateProps, ProjectsData, Project } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle } from '@/lib/animation';
import {
  calculateSpatialPositions,
  calculateConnections,
  type SpatialItem,
} from '@/lib/spatial-layout';

export function ProjectsSpatialOrbit({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const projectsData = data as ProjectsData;
  const projects: Project[] = projectsData?.projects ?? [];
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
      projects.map((p, i) => ({
        id: p.name ?? `project-${i}`,
        importance: 1 - i * 0.25, // First project is most important
        group: 'projects',
      })),
    [projects],
  );

  const rawPositions = useMemo(
    () => calculateSpatialPositions(items, { width: 100, height: 100 }, visualSeed, vpWidth),
    [items, visualSeed, vpWidth],
  );

  // Clamp positions to account for node pixel widths on mobile
  const positions = useMemo(() => {
    if (!isMobile) return rawPositions;
    // Mobile nodes are 70-120px; half-width ~60px ≈ 15% of 390px viewport
    const margin = 18;
    return rawPositions.map((p) => ({
      ...p,
      x: Math.max(margin, Math.min(100 - margin, p.x)),
      y: Math.max(12, Math.min(88, p.y)),
    }));
  }, [rawPositions, isMobile]);

  const connections = useMemo(() => calculateConnections(items), [items]);

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background blobs */}
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
        <div
          className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{
            background: `${palette.secondary}10`,
            right: '15%',
            bottom: '15%',
            animation: 'bg-drift-2 16s ease-in-out infinite',
          }}
        />
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {connections.map(([a, b], i) => {
          if (!positions[a] || !positions[b]) return null;
          return (
            <motion.line
              key={i}
              x1={`${positions[a].x}%`}
              y1={`${positions[a].y}%`}
              x2={`${positions[b].x}%`}
              y2={`${positions[b].y}%`}
              stroke={palette.primary}
              strokeOpacity={0.15}
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: baseDelay + 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Project nodes */}
      {projects.map((project, i) => {
        const pos = positions[i];
        if (!pos) return null;

        const isHovered = hoveredIdx === i;
        // Node size: responsive — desktop 100-180px, mobile 70-120px
        const nodeSize = isMobile
          ? 70 + (1 - i * 0.2) * 50
          : 100 + (1 - i * 0.2) * 80;

        return (
          <motion.div
            key={project.name ?? i}
            className="absolute z-20 cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: nodeSize,
              transform: `translate3d(-50%, -50%, ${pos.z}px)`,
              ...breatheStyle(i % 4),
            }}
            initial={{ opacity: 0, scale: 0, filter: 'blur(12px)' }}
            animate={{ opacity: pos.opacity, scale: pos.scale, filter: 'blur(0px)' }}
            transition={{
              duration: 0.8,
              delay: baseDelay + 0.2 + i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${palette.primary}${i === 0 ? '30' : '18'}, transparent 70%)`,
                transform: 'scale(2)',
              }}
            />

            {/* Project name */}
            <h3
              className="text-sm md:text-base font-bold text-gray-900 text-center leading-tight"
              style={{ ...breatheStyle(i) }}
            >
              {project.name}
            </h3>

            {/* Tagline */}
            {(project.tagline?.ja || project.tagline?.en) && (
              <p
                className="text-[10px] md:text-xs text-center mt-1 line-clamp-2 text-gray-700"
              >
                {project.tagline?.ja || project.tagline?.en}
              </p>
            )}

            {/* Stack pills */}
            {project.stack && (
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {project.stack.slice(0, 3).map((tech: string) => (
                  <span
                    key={tech}
                    className="text-[8px] px-1.5 py-0.5 rounded-full"
                    style={{
                      color: palette.primary,
                      backgroundColor: `${palette.primary}10`,
                      border: `1px solid ${palette.primary}20`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Hover detail */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none
                             text-center mt-2"
                  style={{ top: '100%' }}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2 }}
                >
                  {(project.description?.ja || project.description?.en) && (
                    <p className="text-xs text-gray-800 max-w-[200px] whitespace-normal leading-relaxed">
                      {project.description?.ja || project.description?.en}
                    </p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto text-[10px] font-medium mt-1 inline-block"
                      style={{ color: palette.primary }}
                    >
                      View →
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Commentary — bottom right, faint */}
      {commentary && (
        <motion.div
          className="absolute bottom-6 right-6 max-w-[200px] z-30 opacity-50 hover:opacity-85 transition-opacity duration-500"
          style={{ ...breatheStyle(5) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: baseDelay + 1 }}
        >
          <p className="text-xs text-gray-800 leading-relaxed line-clamp-3">
            {commentary}
          </p>
        </motion.div>
      )}
    </div>
  );
}
