'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  LayoutGroup,
} from 'framer-motion';
import { seededRandom, organicRadius, breatheStyle, revealStyle } from '@/lib/animation';
import { accentPalettes } from '@/lib/visual-seed';
import type { AccentPalette } from '@/lib/types';
import profile from '@/data/profile.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';
import contact from '@/data/contact.json';
import career from '@/data/career.json';
import values from '@/data/values.json';

/* ═══ Types ═══ */
interface NodeConfig {
  id: string;
  type: 'skills' | 'career' | 'values' | 'project';
  x: number;
  y: number;
  delay: number;
  seed: number;
  scale: number;
  label: string;
  dataIndex?: number;
}

/* ═══ Palette-aware accent for each node type ═══ */
function nodeAccent(type: NodeConfig['type'], palette: AccentPalette): string {
  switch (type) {
    case 'skills': return palette.primary;
    case 'career': return palette.secondary;
    case 'values': return palette.glow;
    case 'project': return palette.primary;
  }
}

/* ═══ Convert hex to rgb string ═══ */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

/* ═══ Dynamic layout — scales with project count ═══ */
function computeLayout(isMobile: boolean): NodeConfig[] {
  const base: { id: string; type: NodeConfig['type']; label: string; dataIndex?: number }[] = [
    { id: 'skills', type: 'skills', label: 'Skills' },
    { id: 'career', type: 'career', label: 'Career' },
    { id: 'values', type: 'values', label: 'Vision' },
    ...projects.projects.map((_, i) => ({
      id: `p${i}`, type: 'project' as const, label: 'Project', dataIndex: i,
    })),
  ];
  const count = base.length;
  const radius = isMobile ? 20 : (count <= 6 ? 33 : count <= 9 ? 28 : 24);
  const sc = isMobile ? 0.65 : (count <= 6 ? 0.85 : count <= 9 ? 0.75 : 0.68);

  return base.map((b, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI * 0.4;
    return {
      ...b,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
      delay: 0.8 + i * 0.15,
      seed: 300 + i * 100,
      scale: sc,
    };
  });
}

/* ═══ DepthLayer ═══ */
function DepthLayer({
  depth, mouseX, mouseY, children, className = '',
}: {
  depth: number; mouseX: MotionValue<number>; mouseY: MotionValue<number>;
  children: React.ReactNode; className?: string;
}) {
  const stiffness = 45 - depth * 5;
  const sx = useSpring(mouseX, { stiffness, damping: 22 });
  const sy = useSpring(mouseY, { stiffness, damping: 22 });
  const factor = Math.max(0, (3 - depth) * 9);
  const x = useTransform(sx, (v) => v * factor);
  const y = useTransform(sy, (v) => v * factor);
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ x, y, willChange: 'transform', isolation: 'isolate' as const }}
    >
      {children}
    </motion.div>
  );
}

/* ═══ FloatingNode ═══ */
function FloatingNode({
  x: xVw, y: yVh, delay, seed, scale = 1,
  children, onHover, onLeave, onClick,
  isHovered, isDimmed, isHidden,
  ariaLabel,
}: {
  x: number; y: number; delay: number; seed: number; scale?: number;
  children: React.ReactNode;
  onHover?: () => void; onLeave?: () => void;
  onClick?: (origin: { x: number; y: number }) => void;
  isHovered?: boolean; isDimmed?: boolean; isHidden?: boolean;
  ariaLabel?: string;
}) {
  const interactive = !!(onHover || onClick);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), (delay + 2.5) * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onClick({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [onClick]);

  const entryTransition = {
    opacity: { duration: 2, delay, ease: [0.16, 1, 0.3, 1] as const },
    scale: { type: 'spring' as const, stiffness: 200, damping: 20, delay: Math.max(0, delay) },
  };
  const liveTransition = {
    opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    scale: { type: 'spring' as const, stiffness: 60, damping: 18 },
  };

  // Any interaction (hover/dim/hide) immediately switches to live transitions
  // to prevent re-triggering entry animation delays on hover
  const interacted = isDimmed || isHovered || isHidden;

  return (
    <motion.div
      className={`absolute ${interactive ? 'pointer-events-auto cursor-pointer' : ''}`}
      style={{ left: '50%', top: '50%', x: `calc(${xVw}vw - 50%)`, y: `calc(${yVh}vh - 50%)` }}
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{
        opacity: isHidden ? 0 : 1,
        scale: isHidden ? 0.3 : scale,
      }}
      transition={(entered || interacted) ? liveTransition : entryTransition}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-expanded={isHovered || undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          onClick?.({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        }
      }}
    >
      {interactive && <div className="absolute -inset-10" aria-hidden="true" />}
      <div>
        {children}
      </div>
    </motion.div>
  );
}

/* ═══ HeartbeatPulse ═══ */
function HeartbeatPulse({ palette }: { palette: AccentPalette }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
      {[0, 3].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 24, height: 24, border: `1px solid rgba(${hexToRgb(palette.primary)},${0.08 - i * 0.015})` }}
          animate={{ scale: [1, 14], opacity: [0.2, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: d, ease: [0.22, 1, 0.36, 1] as const }}
        />
      ))}
    </div>
  );
}

/* ═══ AmbientParticles — count adapts to node count ═══ */
function AmbientParticles({ count = 18, palette }: { count?: number; palette: AccentPalette }) {
  const particles = useMemo(() => {
    const r = seededRandom(77);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (r() - 0.5) * 92, y: (r() - 0.5) * 92,
      size: 0.8 + r() * 2.5,
      dur: 24 + r() * 26, delay: r() * 10,
      dx: [(r() - 0.5) * 50, (r() - 0.5) * 40, (r() - 0.5) * 45],
      dy: [(r() - 0.5) * 45, (r() - 0.5) * 50, (r() - 0.5) * 35],
      op: 0.04 + r() * 0.14,
      glow: r() > 0.82,
    }));
  }, [count]);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            width: p.size, height: p.size,
            left: `calc(50% + ${p.x}vw)`, top: `calc(50% + ${p.y}vh)`,
            background: p.glow ? `rgba(${hexToRgb(palette.primary)},${p.op * 2.5})` : `rgba(0,0,0,${p.op})`,
            boxShadow: p.glow ? `0 0 ${p.size * 6}px rgba(${hexToRgb(palette.primary)},${p.op})` : undefined,
          }}
          animate={{
            x: [0, p.dx[0], p.dx[1], p.dx[2], 0],
            y: [0, p.dy[0], p.dy[1], p.dy[2], 0],
            opacity: [p.op, p.op * 1.8, p.op * 0.2, p.op * 1.5, p.op],
            scale: [1, 1.4, 0.6, 1.3, 1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </>
  );
}

/* ═══ NeuralLines — dynamic bezier curves, limited for perf ═══ */
function NeuralLines({ hovered, nodes, palette }: { hovered: string | null; nodes: NodeConfig[]; palette: AccentPalette }) {
  const connections = useMemo(() => {
    const cx = 500, cy = 500;
    // Limit connections for performance: max 8, skip every other for 10+
    const subset = nodes.length > 9 ? nodes.filter((_, i) => i % 2 === 0 || i < 3) : nodes;
    return subset.map((node) => {
      const endX = cx + node.x * 10;
      const endY = cy + node.y * 10;
      const dx = endX - cx, dy = endY - cy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const px = -dy / len, py = dx / len;
      const curve = (30 + Math.abs(node.x + node.y) * 0.8) * (node.x > 0 ? 1 : -1);
      const midX = (cx + endX) / 2 + px * curve;
      const midY = (cy + endY) / 2 + py * curve;
      return { id: node.id, path: `M ${cx} ${cy} Q ${Math.round(midX)} ${Math.round(midY)} ${endX} ${endY}` };
    });
  }, [nodes]);

  const rgb = hexToRgb(palette.primary);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      {connections.map((c, i) => {
        const active = hovered === c.id;
        return (
          <g key={c.id}>
            <motion.path
              d={c.path} fill="none"
              stroke={active ? `rgba(${rgb},0.25)` : `rgba(${rgb},0.04)`}
              strokeWidth={active ? 2.5 : 1} strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                opacity: active ? [0.4, 0.7, 0.4] : [0.03, 0.06, 0.02, 0.05, 0.03],
              }}
              transition={{
                pathLength: { duration: 3, delay: 0.6 + i * 0.3, ease: [0.16, 1, 0.3, 1] as const },
                opacity: { duration: active ? 2 : 16, repeat: Infinity, ease: 'easeInOut' },
                stroke: { duration: 0.6 }, strokeWidth: { duration: 0.6 },
              }}
            />
            {active && (
              <circle r="3.5" fill={`rgba(${rgb},0.8)`} filter="url(#dotGlow)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path={c.path} />
              </circle>
            )}
          </g>
        );
      })}
      <defs>
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ═══ OrbitalRings ═══ */
function OrbitalRings({ palette }: { palette: AccentPalette }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      {[14, 27, 40].map((r, i) => (
        <motion.ellipse
          key={i} cx="50%" cy="50%" rx={`${r}%`} ry={`${r * 0.42}%`}
          fill="none" stroke={`rgba(${hexToRgb(palette.primary)},${0.02 - i * 0.004})`}
          strokeWidth="0.5" strokeDasharray="2 14"
          animate={{ opacity: [0.01, 0.04, 0.01], rotate: i % 2 === 0 ? [0, 360] : [360, 0] }}
          transition={{
            opacity: { duration: 18, repeat: Infinity, ease: 'easeInOut', delay: i * 5 },
            rotate: { duration: 100 + i * 30, repeat: Infinity, ease: 'linear' },
          }}
          style={{ transformOrigin: '50% 50%' }}
        />
      ))}
    </svg>
  );
}

/* ═══ MouseGlow ═══ */
function MouseGlow({ mouseX, mouseY, palette }: { mouseX: MotionValue<number>; mouseY: MotionValue<number>; palette: AccentPalette }) {
  const sx = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const sy = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const left = useTransform(sx, (v) => `calc(${(v + 1) * 50}% - 220px)`);
  const top = useTransform(sy, (v) => `calc(${(v + 1) * 50}% - 220px)`);
  return (
    <motion.div
      className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
      aria-hidden="true"
      style={{ left, top, background: `radial-gradient(circle, rgba(${hexToRgb(palette.primary)},0.035) 0%, rgba(${hexToRgb(palette.secondary)},0.015) 40%, transparent 70%)` }}
      animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ═══ Peripheral keywords — scatter tech/role keywords in orbit space ═══ */
function ScatteredKeywords({ nodes, palette }: { nodes: NodeConfig[]; palette: AccentPalette }) {
  const keywords = useMemo(() => {
    const r = seededRandom(999);
    const words = [
      ...skills.categories.flatMap(c => c.skills.map(s => s.name)),
      profile.title.ja,
      ...career.history.map(e => e.role.ja),
    ];
    // Pick 6-10 keywords, scatter them in the negative space
    const count = Math.min(words.length, 8);
    return words.slice(0, count).map((w, i) => ({
      text: w,
      x: (r() - 0.5) * 80,
      y: (r() - 0.5) * 75,
      dur: 30 + r() * 20,
      delay: 2 + r() * 4,
      opacity: 0.04 + r() * 0.06,
      size: 10 + r() * 4,
      rotate: (r() - 0.5) * 20,
    }));
  }, [nodes]);

  return (
    <>
      {keywords.map((k, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none font-light whitespace-nowrap"
          aria-hidden="true"
          style={{
            left: `calc(50% + ${k.x}vw)`,
            top: `calc(50% + ${k.y}vh)`,
            fontSize: k.size,
            color: `rgba(${hexToRgb(palette.glow)},${k.opacity})`,
            rotate: `${k.rotate}deg`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [k.opacity, k.opacity * 2, k.opacity * 0.3, k.opacity * 1.5, k.opacity],
          }}
          transition={{ duration: k.dur, repeat: Infinity, ease: 'easeInOut', delay: k.delay }}
        >
          {k.text}
        </motion.span>
      ))}
    </>
  );
}

/* ═══ ExpandedNodeContent — full detail inside the node itself ═══ */
function ExpandedNodeContent({
  nodeId, nodes, palette, onClose,
}: {
  nodeId: string; nodes: NodeConfig[]; palette: AccentPalette; onClose: () => void;
}) {
  const node = nodes.find((n) => n.id === nodeId);
  const proj = node?.type === 'project' && node.dataIndex != null ? projects.projects[node.dataIndex] : null;
  const allSkills = skills.categories;
  const [imgErr, setImgErr] = useState(false);
  const rgb = hexToRgb(nodeAccent(node?.type ?? 'skills', palette));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[100] bg-white/80"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Node grows to fill — uses layoutId for seamless transition */}
      <motion.div
        className="fixed z-[101] overflow-y-auto pointer-events-auto"
        layoutId={`node-shell-${nodeId}`}
        style={{
          background: `radial-gradient(ellipse at 30% 20%, rgba(${rgb},0.14) 0%, rgba(249,250,251,0.95) 50%, rgba(255,255,255,0.9) 100%)`,
          borderRadius: organicRadius,
          boxShadow: `0 0 120px rgba(${rgb},0.1), 0 20px 60px rgba(0,0,0,0.5)`,
          inset: '5vh 5vw',
        }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${node?.label} details`}
      >
        <div className="p-8 md:p-12 max-w-3xl mx-auto">
          {/* Close hint */}
          <motion.button
            className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 transition-colors text-sm"
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            aria-label="Close details"
          >
            ESC
          </motion.button>

          {/* ── Project detail ── */}
          {node?.type === 'project' && proj && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              {proj.image && !imgErr && (
                <div className="w-full aspect-[2/1] overflow-hidden relative mb-6"
                  style={{ borderRadius: organicRadius }}>
                  <img src={proj.image} alt={proj.name} className="w-full h-full object-cover"
                    onError={() => setImgErr(true)} />
                </div>
              )}
              <h2 className="text-3xl md:text-4xl font-bold" style={breatheStyle(0)}>{proj.name}</h2>
              <p className="mt-2 text-lg" style={{ color: `rgba(${rgb},0.9)`, ...revealStyle(0) }}>{proj.tagline.ja}</p>
              <p className="text-gray-600 mt-4 leading-relaxed" style={revealStyle(1)}>{proj.description.ja}</p>
              <div className="flex flex-wrap gap-2 mt-5" style={revealStyle(2)}>
                {proj.stack.map((s) => (
                  <span key={s} className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-500 border border-gray-200">{s}</span>
                ))}
              </div>
              <div className="flex gap-5 mt-6" style={revealStyle(3)}>
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer"
                    className="transition-colors hover:underline" style={{ color: `rgba(${rgb},0.9)` }}>GitHub →</a>
                )}
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer"
                    className="transition-colors hover:underline" style={{ color: `rgba(${rgb},0.9)` }}>Visit →</a>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Skills detail ── */}
          {node?.type === 'skills' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={breatheStyle(0)}>Skills &amp; Technologies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allSkills.map((cat, ci) => (
                  <div key={cat.name.en} style={revealStyle(ci)}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-3"
                      style={{ color: `rgba(${rgb},0.85)` }}>{cat.name.ja}</h3>
                    <div className="space-y-3">
                      {cat.skills.map((s) => (
                        <div key={s.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">{s.name}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <div key={i} className={`h-1.5 w-4 rounded-full ${i < s.level ? '' : 'bg-gray-200'}`}
                                  style={i < s.level ? { background: `rgba(${rgb},0.6)` } : undefined} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{s.details.ja}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Career detail ── */}
          {node?.type === 'career' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={breatheStyle(0)}>Career</h2>
              <div className="space-y-6">
                {career.history.map((entry, i) => (
                  <div key={i} style={revealStyle(i)}>
                    <h3 className="text-xl font-semibold">{entry.company.ja}</h3>
                    <p style={{ color: `rgba(${rgb},0.85)` }}>{entry.role.ja}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{entry.period}</p>
                    <p className="text-gray-600 mt-2 leading-relaxed">{entry.description.ja}</p>
                    <div className="mt-3 space-y-1.5">
                      {entry.highlights.ja.map((h, hi) => (
                        <p key={hi} className="text-sm text-gray-500 flex gap-2 items-start">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ background: `rgba(${rgb},0.5)` }} />
                          {h}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Values detail ── */}
          {node?.type === 'values' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={breatheStyle(0)}>Vision &amp; Values</h2>
              <p className="text-gray-700 leading-relaxed text-lg" style={revealStyle(0)}>{values.visionForFutureSaaS.ja}</p>
              <div className="w-20 h-px my-6" style={{ background: `rgba(${rgb},0.2)` }} />
              <p className="text-gray-600 leading-relaxed" style={revealStyle(1)}>{values.beliefs.ja}</p>
              {values.workStyle && (
                <>
                  <div className="w-20 h-px my-6" style={{ background: `rgba(${rgb},0.2)` }} />
                  <p className="text-gray-700 leading-relaxed text-sm" style={revealStyle(2)}>{values.workStyle.ja}</p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}

/* ═══ Main ═══ */
export function StaticFallback() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [accentIndex] = useState(() => Math.floor(Math.random() * accentPalettes.length));
  const palette = accentPalettes[accentIndex];
  const primaryRgb = hexToRgb(palette.primary);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltConfig = { stiffness: 14, damping: 28 };
  const tiltX = useSpring(useTransform(mouseX, (v) => v * 0.3), tiltConfig);
  const tiltY = useSpring(useTransform(mouseY, (v) => v * -0.2), tiltConfig);

  // Track touch state for mobile tap-to-expand
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);

    const onResize = () => setIsMobile(window.innerWidth < 640);
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma != null && e.beta != null) {
        mouseX.set(Math.max(-1, Math.min(1, e.gamma / 30)));
        mouseY.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('resize', onResize);
    };
  }, [mouseX, mouseY]);

  const nodes = useMemo(() => computeLayout(isMobile), [isMobile]);
  const allSkills = useMemo(() => skills.categories.flatMap((c) => c.skills), []);
  const particleCount = Math.max(6, 12 - nodes.length);

  const handleNodeClick = useCallback((id: string, origin: { x: number; y: number }) => {
    if (isMobile) {
      const now = Date.now();
      const last = lastTapRef.current;
      // First tap: expand inline (hover). Second tap on same node: full expand
      if (last && last.id === id && now - last.time < 500) {
        setExpanded(id);
        setHovered(null);
        lastTapRef.current = null;
      } else {
        setHovered(id);
        lastTapRef.current = { id, time: now };
      }
    } else {
      setExpanded(id);
      setHovered(null);
    }
  }, [isMobile]);

  const handleClose = useCallback(() => {
    setExpanded(null);
    setHovered(null);
  }, []);

  // Close inline expansion when tapping outside on mobile
  const handleBackgroundTap = useCallback(() => {
    if (isMobile && hovered) {
      setHovered(null);
      lastTapRef.current = null;
    }
  }, [isMobile, hovered]);

  if (!mounted) return <div className="h-full w-full bg-white" />;

  return (
    <LayoutGroup>
      <div
        className="h-full w-full overflow-hidden bg-white text-gray-900"
        style={{ perspective: '1200px', contain: 'layout paint' }}
        onClick={handleBackgroundTap}
        role="main"
        aria-label="Portfolio overview"
      >
        <motion.div className="absolute inset-0" style={{ rotateX: tiltY, rotateY: tiltX }}>

          {/* ── DEPTH 3: Background ── */}
          <DepthLayer depth={3} mouseX={mouseX} mouseY={mouseY}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 25% 20%, rgba(${primaryRgb},0.10) 0%, transparent 50%), radial-gradient(ellipse at 75% 80%, rgba(${hexToRgb(palette.secondary)},0.08) 0%, transparent 50%)` }} />
            <motion.div
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 70% 60%, rgba(${hexToRgb(palette.glow)},0.10) 0%, transparent 50%), radial-gradient(ellipse at 20% 30%, rgba(${hexToRgb(palette.secondary)},0.08) 0%, transparent 50%)` }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(${primaryRgb},0.035) 0%, transparent 55%)` }} />
            <OrbitalRings palette={palette} />
            <ScatteredKeywords nodes={nodes} palette={palette} />
          </DepthLayer>

          {/* ── DEPTH 0: Center identity — enriched ── */}
          <DepthLayer depth={0} mouseX={mouseX} mouseY={mouseY} className="z-[1]">
            <FloatingNode x={0} y={isMobile ? -5 : -3} delay={0} seed={100}>
              <div className="text-center max-w-md mx-auto" style={{ textShadow: `0 0 60px rgba(${primaryRgb},0.15)` }}>
                <motion.h1
                  className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-none"
                  style={breatheStyle(0)}
                  initial={{ opacity: 0, letterSpacing: '0.2em' }}
                  animate={{ opacity: 1, letterSpacing: '-0.02em' }}
                  transition={{ duration: 2.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  {profile.name.ja}
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg md:text-xl font-medium mt-3"
                  style={{ ...breatheStyle(1), color: `rgba(${hexToRgb(palette.secondary)},0.9)` }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  {profile.title.ja}
                </motion.p>
                <motion.p
                  className="text-sm text-gray-600 mt-1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.1 }}
                >
                  {profile.location.ja}
                </motion.p>
                <motion.p
                  className="text-sm text-gray-700 mt-3 leading-relaxed max-w-xs mx-auto line-clamp-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1.6 }}
                >
                  {profile.introduction.ja.slice(0, 80)}
                </motion.p>
                {/* Enriched: contact icons inline */}
                <motion.div
                  className="flex gap-4 justify-center mt-3 items-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                >
                  {contact.github && (
                    <a href={contact.github} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 pointer-events-auto"
                      style={{ textShadow: 'none' }}>
                      GitHub
                    </a>
                  )}
                  <motion.span className="w-1 h-1 rounded-full" style={{ background: `rgba(${primaryRgb},0.5)` }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 pointer-events-auto"
                      style={{ textShadow: 'none' }}>
                      LinkedIn
                    </a>
                  )}
                  <motion.span className="w-1 h-1 rounded-full" style={{ background: `rgba(${hexToRgb(palette.glow)},0.5)` }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }} />
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 pointer-events-auto"
                      style={{ textShadow: 'none' }}>
                      Email
                    </a>
                  )}
                </motion.div>
              </div>
            </FloatingNode>
          </DepthLayer>

          {/* ── DEPTH 2: Particles & connections ── */}
          <DepthLayer depth={2} mouseX={mouseX} mouseY={mouseY} className="z-[2]">
            <AmbientParticles count={particleCount} palette={palette} />
            <NeuralLines hovered={hovered} nodes={nodes} palette={palette} />
            <HeartbeatPulse palette={palette} />
          </DepthLayer>

          {/* ── DEPTH 1: Content nodes — enriched ── */}
          <DepthLayer depth={1} mouseX={mouseX} mouseY={mouseY} className="z-[30]">
            {nodes.map((node) => {
              const isNodeHovered = hovered === node.id;
              const isNodeDimmed = (hovered !== null && !isNodeHovered) || (expanded !== null && expanded !== node.id);
              const isNodeHidden = expanded !== null && expanded !== node.id;
              const proj = node.type === 'project' && node.dataIndex != null ? projects.projects[node.dataIndex] : null;
              const accent = nodeAccent(node.type, palette);
              const accentRgb = hexToRgb(accent);

              return (
                <FloatingNode
                  key={node.id}
                  x={node.x} y={node.y} delay={node.delay} seed={node.seed} scale={node.scale}
                  isHovered={isNodeHovered} isDimmed={isNodeDimmed} isHidden={isNodeHidden}
                  onHover={isMobile ? undefined : () => setHovered(node.id)}
                  onLeave={isMobile ? undefined : () => setHovered(null)}
                  onClick={(origin) => handleNodeClick(node.id, origin)}
                  ariaLabel={`${node.label}${proj ? `: ${proj.name}` : ''}`}
                >
                  <motion.div
                    layoutId={`node-shell-${node.id}`}
                    className="relative text-center"
                    style={{ maxWidth: node.type === 'skills' ? 280 : 240 }}
                    transition={{ type: 'spring', stiffness: 70, damping: 20 }}
                  >
                    {/* Glass backdrop on hover */}
                    <motion.div
                      className="absolute -inset-5 -z-10"
                      style={{
                        background: `radial-gradient(ellipse at 30% 20%, rgba(${accentRgb},0.12) 0%, rgba(249,250,251,0.6) 50%, rgba(255,255,255,0.4) 100%)`,
                        borderRadius: organicRadius,
                        boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 80px rgba(${accentRgb},0.06)`,
                        backdropFilter: isNodeHovered ? 'blur(12px)' : 'blur(0px)',
                      }}
                      animate={{ opacity: isNodeHovered ? 1 : 0, scale: isNodeHovered ? 1 : 0.85 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                    />

                    {/* Label */}
                    <p className="text-xs uppercase tracking-[0.3em] mb-1.5" style={{ color: `rgba(${accentRgb},0.85)` }}>
                      {node.label}
                    </p>

                    {/* ─── Enriched compact content ─── */}
                    {node.type === 'skills' && (
                      <div>
                        <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1">
                          {allSkills.map((s, i) => (
                            <span
                              key={s.name}
                              className="text-sm text-gray-700"
                              style={{
                                animation: `ai-breathe ${3.2 + i * 0.7}s ease-in-out infinite`,
                                animationDelay: `${1.5 + i * 0.4}s`,
                              }}
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                        {/* Always visible: top 3 skill levels */}
                        <div className="mt-2 space-y-1">
                          {allSkills.slice(0, 3).map((s, i) => (
                            <div key={s.name} className="flex items-center justify-center gap-1.5"
                              style={{ animation: `ai-breathe ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${2 + i * 0.3}s` }}>
                              <span className="text-[10px] text-gray-500 w-14 text-right">{s.name}</span>
                              <div className="flex gap-px">
                                {Array.from({ length: 5 }, (_, j) => (
                                  <div key={j} className={`h-1 w-2.5 rounded-full ${j < s.level ? '' : 'bg-gray-200'}`}
                                    style={j < s.level ? { background: `rgba(${accentRgb},0.5)` } : undefined} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {node.type === 'career' && (
                      <div>
                        {career.history.slice(0, 2).map((entry, i) => (
                          <div key={i} className={i > 0 ? 'mt-2' : ''}>
                            <p className={`font-semibold ${i === 0 ? 'text-base' : 'text-sm text-gray-500'}`}>{entry.company.ja}</p>
                            <p className="text-sm text-gray-600 mt-0.5">{entry.role.ja}</p>
                            <p className="text-sm text-gray-600">{entry.period}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {node.type === 'values' && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{values.visionForFutureSaaS.ja}</p>
                    )}
                    {node.type === 'project' && proj && (
                      <>
                        <p className="text-base font-semibold">{proj.name}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{proj.tagline.ja}</p>
                        {/* Always visible: stack badges */}
                        <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                          {proj.stack.slice(0, 4).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 text-[9px] rounded-full bg-gray-100 text-gray-500">{s}</span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* ─── Hover inline expansion ─── */}
                    <AnimatePresence>
                      {isNodeHovered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                          className="overflow-hidden"
                          style={{ maxHeight: 160 }}
                        >
                          <div className="pt-3 border-t border-gray-200 mt-3 text-left">
                            {node.type === 'skills' && (
                              <div className="space-y-1.5">
                                {skills.categories.map((cat, ci) => (
                                  <div key={cat.name.en} className="flex items-center gap-2"
                                    style={{ animation: 'ai-reveal 0.5s ease-out both', animationDelay: `${ci * 0.12}s` }}>
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ background: `rgba(${accentRgb},0.5)` }} />
                                    <span className="text-xs text-gray-700">{cat.name.ja}</span>
                                    <span className="text-[10px] text-gray-400 ml-auto">{cat.skills.length} skills</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {node.type === 'career' && (
                              <div className="space-y-1.5">
                                {career.history[0]?.highlights.ja.slice(0, 2).map((h, i) => (
                                  <p key={i} className="text-xs text-gray-600 flex gap-1.5 items-start"
                                    style={{ animation: 'ai-reveal 0.4s ease-out both', animationDelay: `${i * 0.1}s` }}>
                                    <span className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                                      style={{ background: `rgba(${accentRgb},0.5)` }} />
                                    {h}
                                  </p>
                                ))}
                              </div>
                            )}
                            {node.type === 'values' && (
                              <p className="text-xs text-gray-600 leading-relaxed"
                                style={{ animation: 'ai-reveal 0.5s ease-out both' }}>{values.beliefs.ja}</p>
                            )}
                            {node.type === 'project' && proj && (
                              <>
                                {proj.image && (
                                  <div className="rounded-lg overflow-hidden mb-2 aspect-video relative bg-gradient-to-br from-cyan-500/10 to-violet-500/10"
                                    style={{ animation: 'ai-reveal 0.5s ease-out both' }}>
                                    <img src={proj.image} alt="" className="w-full h-full object-cover"
                                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                  </div>
                                )}
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3"
                                  style={{ animation: 'ai-reveal 0.4s ease-out both', animationDelay: '0.1s' }}>{proj.description.ja}</p>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="h-4" />
                  </motion.div>
                </FloatingNode>
              );
            })}
          </DepthLayer>

          {/* ── DEPTH -1: Mouse glow ── */}
          <DepthLayer depth={-1} mouseX={mouseX} mouseY={mouseY} className="z-[40]">
            <MouseGlow mouseX={mouseX} mouseY={mouseY} palette={palette} />
          </DepthLayer>

        </motion.div>

        {/* ── Expanded node — grows from node position via layoutId ── */}
        <AnimatePresence>
          {expanded && (
            <ExpandedNodeContent
              nodeId={expanded}
              nodes={nodes}
              palette={palette}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>

        {/* Screen reader: navigation hint */}
        <div className="sr-only" role="status" aria-live="polite">
          {expanded ? 'Details expanded. Press Escape to close.' : 'Use Tab to navigate between nodes. Enter to expand.'}
        </div>
      </div>
    </LayoutGroup>
  );
}
