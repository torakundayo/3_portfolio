'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import profile from '@/data/profile.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';
import contact from '@/data/contact.json';
import career from '@/data/career.json';
import values from '@/data/values.json';

/* ═══ PRNG ═══ */
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/* ═══ Types ═══ */
interface NodeConfig {
  id: string;
  type: 'skills' | 'career' | 'values' | 'project';
  x: number;
  y: number;
  delay: number;
  seed: number;
  scale: number;
  accent: string;
  label: string;
  dataIndex?: number;
}

/* ═══ Dynamic layout — scales with project count ═══ */
function computeLayout(): NodeConfig[] {
  const base: { id: string; type: NodeConfig['type']; accent: string; label: string; dataIndex?: number }[] = [
    { id: 'skills', type: 'skills', accent: '139,92,246', label: 'Skills' },
    { id: 'career', type: 'career', accent: '168,85,247', label: 'Career' },
    { id: 'values', type: 'values', accent: '251,113,133', label: 'Vision' },
    ...projects.projects.map((_, i) => ({
      id: `p${i}`, type: 'project' as const, accent: '6,182,212', label: 'Project', dataIndex: i,
    })),
  ];
  const count = base.length;
  const radius = count <= 6 ? 33 : count <= 9 ? 28 : 24;
  const sc = count <= 6 ? 0.85 : count <= 9 ? 0.75 : 0.68;

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
  isHovered, isDimmed,
}: {
  x: number; y: number; delay: number; seed: number; scale?: number;
  children: React.ReactNode;
  onHover?: () => void; onLeave?: () => void;
  onClick?: (origin: { x: number; y: number }) => void;
  isHovered?: boolean; isDimmed?: boolean;
}) {
  const interactive = !!(onHover || onClick);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), (delay + 2.5) * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  const drift = useMemo(() => {
    const r = seededRandom(seed);
    return {
      dx: [(r() - 0.5) * 30, (r() - 0.5) * 24, (r() - 0.5) * 28],
      dy: [(r() - 0.5) * 26, (r() - 0.5) * 30, (r() - 0.5) * 22],
      dur: 22 + r() * 14,
      rot: (r() - 0.5) * 5,
    };
  }, [seed]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onClick({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [onClick]);

  const entryTransition = {
    opacity: { duration: 2, delay, ease: [0.16, 1, 0.3, 1] as const },
    scale: { type: 'spring' as const, stiffness: 200, damping: 20, delay: Math.max(0, delay) },
    filter: { duration: 2.5, delay },
  };
  const liveTransition = {
    opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    scale: { type: 'spring' as const, stiffness: 60, damping: 18 },
    filter: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <motion.div
      className={`absolute ${interactive ? 'pointer-events-auto cursor-pointer' : ''}`}
      style={{ left: '50%', top: '50%', x: `calc(${xVw}vw - 50%)`, y: `calc(${yVh}vh - 50%)` }}
      initial={{ opacity: 0, scale: 0.1, filter: 'blur(16px)' }}
      animate={{
        opacity: isDimmed ? 0.12 : 1,
        scale: isHovered ? scale * 1.12 : scale,
        filter: isDimmed ? 'blur(3px)' : 'blur(0px)',
      }}
      transition={entered ? liveTransition : entryTransition}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {interactive && <div className="absolute -inset-10" />}
      <motion.div
        animate={{
          x: [0, drift.dx[0], drift.dx[1], drift.dx[2], 0],
          y: [0, drift.dy[0], drift.dy[1], drift.dy[2], 0],
          rotate: [0, drift.rot, -drift.rot * 0.6, drift.rot * 0.4, 0],
        }}
        transition={{ duration: drift.dur, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ═══ HeartbeatPulse ═══ */
function HeartbeatPulse() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[0, 3].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 24, height: 24, border: `1px solid rgba(139,92,246,${0.08 - i * 0.015})` }}
          animate={{ scale: [1, 14], opacity: [0.2, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: d, ease: [0.22, 1, 0.36, 1] as const }}
        />
      ))}
    </div>
  );
}

/* ═══ AmbientParticles — count adapts to node count ═══ */
function AmbientParticles({ count = 18 }: { count?: number }) {
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
          style={{
            width: p.size, height: p.size,
            left: `calc(50% + ${p.x}vw)`, top: `calc(50% + ${p.y}vh)`,
            background: p.glow ? `rgba(139,92,246,${p.op * 2.5})` : `rgba(255,255,255,${p.op})`,
            boxShadow: p.glow ? `0 0 ${p.size * 6}px rgba(139,92,246,${p.op})` : undefined,
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

/* ═══ NeuralLines — dynamic bezier curves from layout ═══ */
function NeuralLines({ hovered, nodes }: { hovered: string | null; nodes: NodeConfig[] }) {
  const connections = useMemo(() => {
    const cx = 500, cy = 500;
    return nodes.map((node) => {
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

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      {connections.map((c, i) => {
        const active = hovered === c.id;
        return (
          <g key={c.id}>
            <motion.path
              d={c.path} fill="none"
              stroke={active ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.04)'}
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
              <circle r="3.5" fill="rgba(139,92,246,0.8)" filter="url(#dotGlow)">
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
function OrbitalRings() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {[14, 27, 40].map((r, i) => (
        <motion.ellipse
          key={i} cx="50%" cy="50%" rx={`${r}%`} ry={`${r * 0.42}%`}
          fill="none" stroke={`rgba(139,92,246,${0.02 - i * 0.004})`}
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
function MouseGlow({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const sx = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const sy = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const left = useTransform(sx, (v) => `calc(${(v + 1) * 50}% - 220px)`);
  const top = useTransform(sy, (v) => `calc(${(v + 1) * 50}% - 220px)`);
  return (
    <motion.div
      className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
      style={{ left, top, background: 'radial-gradient(circle, rgba(139,92,246,0.035) 0%, rgba(6,182,212,0.015) 40%, transparent 70%)' }}
      animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ═══ ExpandedOverlay — "landing on planet" zoom view ═══ */
function ExpandedOverlay({
  nodeId, origin, nodes, onClose,
}: {
  nodeId: string; origin: { x: number; y: number };
  nodes: NodeConfig[]; onClose: () => void;
}) {
  const node = nodes.find((n) => n.id === nodeId);
  const proj = node?.type === 'project' && node.dataIndex != null ? projects.projects[node.dataIndex] : null;
  const latestCareer = career.history[0];
  const allSkills = skills.categories;
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const offsetX = origin.x - window.innerWidth / 2;
  const offsetY = origin.y - window.innerHeight / 2;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] bg-gray-950/85 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="pointer-events-auto max-w-lg w-[90vw] max-h-[80vh] overflow-y-auto p-8 backdrop-blur-2xl"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(${node?.accent ?? '139,92,246'},0.12) 0%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.3) 100%)`,
            borderRadius: '2.5rem 1.8rem 3rem 2rem / 2rem 2.5rem 1.8rem 2.8rem',
            boxShadow: `0 0 120px rgba(${node?.accent ?? '139,92,246'},0.08), 0 20px 60px rgba(0,0,0,0.4)`,
          }}
          initial={{ x: offsetX, y: offsetY, scale: 0.15, opacity: 0 }}
          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        >
          {/* Project */}
          {node?.type === 'project' && proj && (
            <div>
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative mb-6 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
                {proj.image && !imgErr && (
                  <img src={proj.image} alt="" className="w-full h-full object-cover relative z-10"
                    onError={() => setImgErr(true)} />
                )}
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/5 select-none">
                  {proj.name}
                </span>
              </div>
              <motion.h2 className="text-3xl font-bold" initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>{proj.name}</motion.h2>
              <motion.p className="text-cyan-400/80 text-lg mt-1" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{proj.tagline.ja}</motion.p>
              <motion.p className="text-white/70 mt-4 leading-relaxed" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{proj.description.ja}</motion.p>
              <motion.div className="flex flex-wrap gap-2 mt-4" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                {proj.stack.map((s) => (
                  <span key={s} className="px-3 py-1 text-sm rounded-full bg-white/5 text-white/60">{s}</span>
                ))}
              </motion.div>
              <motion.div className="flex gap-4 mt-6" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors">GitHub →</a>
                )}
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors">Visit →</a>
                )}
              </motion.div>
            </div>
          )}

          {/* Skills */}
          {node?.type === 'skills' && (
            <div>
              <motion.h2 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}>Skills &amp; Technologies</motion.h2>
              {allSkills.map((cat, ci) => (
                <motion.div key={cat.name.en} className="mb-5 last:mb-0"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + ci * 0.1 }}>
                  <h3 className="text-white/90 font-semibold mb-2 text-sm uppercase tracking-wider">{cat.name.ja}</h3>
                  {cat.skills.map((s) => (
                    <div key={s.name} className="flex items-center gap-3 mb-2.5">
                      <span className="w-28 text-sm text-white/70">{s.name}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className={`h-2 w-6 rounded-full ${i < s.level ? 'bg-violet-400/80' : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-white/40">{s.yearsOfExperience}yr</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          )}

          {/* Career */}
          {node?.type === 'career' && (
            <div>
              <motion.h2 className="text-3xl font-bold mb-1" initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}>{latestCareer.company.ja}</motion.h2>
              <motion.p className="text-purple-400/80 text-lg" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>{latestCareer.role.ja}</motion.p>
              <motion.p className="text-white/40 text-sm mt-1" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>{latestCareer.period}</motion.p>
              <motion.p className="text-white/70 mt-4 leading-relaxed" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{latestCareer.description.ja}</motion.p>
              <motion.div className="mt-4 space-y-2" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                {latestCareer.highlights.ja.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400/50 mt-2 shrink-0" />
                    <p className="text-white/65">{h}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Values */}
          {node?.type === 'values' && (
            <div>
              <motion.h2 className="text-3xl font-bold mb-4" initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}>Vision &amp; Values</motion.h2>
              <motion.p className="text-white/80 leading-relaxed text-lg" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>{values.visionForFutureSaaS.ja}</motion.p>
              <div className="w-16 h-px bg-white/10 my-6" />
              <motion.p className="text-white/60 leading-relaxed" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{values.beliefs.ja}</motion.p>
            </div>
          )}

          <motion.p className="text-xs text-white/20 mt-6 text-center" initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>press Esc to return</motion.p>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ═══ Organic border radius ═══ */
const organicRadius = '2rem 1.4rem 2.4rem 1.6rem / 1.6rem 2rem 1.4rem 2.2rem';

/* ═══ Main ═══ */
export function StaticFallback() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandOrigin, setExpandOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltConfig = { stiffness: 14, damping: 28 };
  const tiltX = useSpring(useTransform(mouseX, (v) => v * 2.5), tiltConfig);
  const tiltY = useSpring(useTransform(mouseY, (v) => v * -1.8), tiltConfig);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const nodes = useMemo(computeLayout, []);
  const allSkills = useMemo(() => skills.categories.flatMap((c) => c.skills), []);
  const latestCareer = career.history[0];
  const particleCount = Math.max(6, 12 - nodes.length);

  const handleExpand = useCallback((id: string, origin: { x: number; y: number }) => {
    setExpandOrigin(origin);
    setExpanded(id);
    setHovered(null);
  }, []);
  const handleClose = useCallback(() => setExpanded(null), []);

  if (!mounted) return <div className="h-full w-full bg-gray-950" />;

  return (
    <div className="h-full w-full overflow-hidden bg-gray-950 text-white" style={{ perspective: '1200px', contain: 'layout paint' }}>
      <motion.div className="absolute inset-0" style={{ rotateX: tiltY, rotateY: tiltX }}>

        {/* ── DEPTH 3: Background (static gradients + opacity crossfade for perf) ── */}
        <DepthLayer depth={3} mouseX={mouseX} mouseY={mouseY}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 20%, rgba(139,92,246,0.10) 0%, transparent 50%), radial-gradient(ellipse at 75% 80%, rgba(6,182,212,0.08) 0%, transparent 50%)' }} />
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(236,72,153,0.10) 0%, transparent 50%), radial-gradient(ellipse at 20% 30%, rgba(6,182,212,0.08) 0%, transparent 50%)' }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(139,92,246,0.035) 0%, transparent 55%)' }} />
          <OrbitalRings />
        </DepthLayer>

        {/* ── DEPTH 0: Center identity (BEHIND everything else) ── */}
        <DepthLayer depth={0} mouseX={mouseX} mouseY={mouseY} className="z-[1]">
          <FloatingNode x={0} y={-3} delay={0} seed={100}>
            <div className="text-center" style={{ textShadow: '0 0 60px rgba(139,92,246,0.15)' }}>
              <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-tight leading-none"
                initial={{ opacity: 0, letterSpacing: '0.2em' }}
                animate={{ opacity: 1, letterSpacing: '-0.02em' }}
                transition={{ duration: 2.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              >
                {profile.name.ja}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-cyan-400/90 font-medium mt-3"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              >
                {profile.title.ja}
              </motion.p>
              <motion.p
                className="text-sm text-white/55 mt-1.5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                {profile.location.ja}
              </motion.p>
            </div>
          </FloatingNode>
        </DepthLayer>

        {/* ── DEPTH 2: Particles & connections ── */}
        <DepthLayer depth={2} mouseX={mouseX} mouseY={mouseY} className="z-[2]">
          <AmbientParticles count={particleCount} />
          <NeuralLines hovered={hovered} nodes={nodes} />
          <HeartbeatPulse />
        </DepthLayer>

        {/* ── DEPTH 1: Content nodes (ABOVE lines & center) ── */}
        <DepthLayer depth={1} mouseX={mouseX} mouseY={mouseY} className="z-[30]">
          {nodes.map((node) => {
            const isNodeHovered = hovered === node.id;
            const isNodeDimmed = (hovered !== null && !isNodeHovered) || (expanded !== null && expanded !== node.id);
            const proj = node.type === 'project' && node.dataIndex != null ? projects.projects[node.dataIndex] : null;

            return (
              <FloatingNode
                key={node.id}
                x={node.x} y={node.y} delay={node.delay} seed={node.seed} scale={node.scale}
                isHovered={isNodeHovered} isDimmed={isNodeDimmed}
                onHover={() => setHovered(node.id)}
                onLeave={() => setHovered(null)}
                onClick={(origin) => handleExpand(node.id, origin)}
              >
                <div className="relative text-center" style={{ maxWidth: node.type === 'skills' ? 260 : 220 }}>
                  {/* Glass backdrop on hover */}
                  <motion.div
                    className="absolute -inset-5 -z-10 backdrop-blur-xl"
                    style={{
                      background: `radial-gradient(ellipse at 30% 20%, rgba(${node.accent},0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.01) 100%)`,
                      borderRadius: organicRadius,
                      boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 80px rgba(${node.accent},0.06)`,
                    }}
                    animate={{ opacity: isNodeHovered ? 1 : 0, scale: isNodeHovered ? 1 : 0.85 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                  />

                  {/* Label */}
                  <p className="text-xs uppercase tracking-[0.3em] mb-1.5" style={{ color: `rgba(${node.accent},0.85)` }}>
                    {node.label}
                  </p>

                  {/* ─── Compact content ─── */}
                  {node.type === 'skills' && (
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                      {allSkills.map((s, i) => (
                        <span
                          key={s.name}
                          className="text-sm text-white/80"
                          style={{
                            animation: `ai-breathe ${3.2 + i * 0.7}s ease-in-out infinite`,
                            animationDelay: `${1.5 + i * 0.4}s`,
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {node.type === 'career' && (
                    <>
                      <p className="text-base font-semibold">{latestCareer.company.ja}</p>
                      <p className="text-sm text-white/70 mt-0.5">{latestCareer.role.ja}</p>
                      <p className="text-xs text-white/50 mt-0.5">{latestCareer.period}</p>
                    </>
                  )}
                  {node.type === 'values' && (
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">{values.visionForFutureSaaS.ja}</p>
                  )}
                  {node.type === 'project' && proj && (
                    <>
                      <p className="text-base font-semibold">{proj.name}</p>
                      <p className="text-sm text-white/70 mt-0.5">{proj.tagline.ja}</p>
                    </>
                  )}

                  {/* ─── Hover inline expansion (node itself becomes the detail) ─── */}
                  <AnimatePresence>
                    {isNodeHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-white/[0.06] mt-3 text-left">
                          {node.type === 'skills' && (
                            <div className="space-y-2">
                              {skills.categories.map((cat, ci) => (
                                <div key={cat.name.en} style={{ animation: 'ai-reveal 0.5s ease-out both', animationDelay: `${ci * 0.12}s` }}>
                                  <span className="text-white/90 text-xs font-medium">{cat.name.ja}</span>
                                  {cat.skills.map((s, si) => (
                                    <div key={s.name} className="flex items-center gap-2 ml-2 mt-1"
                                      style={{ animation: 'ai-reveal 0.4s ease-out both', animationDelay: `${ci * 0.12 + (si + 1) * 0.06}s` }}>
                                      <span className="text-xs text-white/75 w-20">{s.name}</span>
                                      <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }, (_, i) => (
                                          <div key={i} className={`h-1 w-3.5 rounded-full ${i < s.level ? 'bg-violet-400/70' : 'bg-white/8'}`} />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                          {node.type === 'career' && (
                            <div className="space-y-1.5">
                              {latestCareer.highlights.ja.map((h, i) => (
                                <p key={i} className="text-xs text-white/75 flex gap-1.5 items-start"
                                  style={{ animation: 'ai-reveal 0.4s ease-out both', animationDelay: `${i * 0.1}s` }}>
                                  <span className="w-1 h-1 rounded-full bg-purple-400/50 mt-1.5 shrink-0" />
                                  {h}
                                </p>
                              ))}
                            </div>
                          )}
                          {node.type === 'values' && (
                            <p className="text-xs text-white/75 leading-relaxed"
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
                              <p className="text-xs text-white/75 leading-relaxed line-clamp-3"
                                style={{ animation: 'ai-reveal 0.4s ease-out both', animationDelay: '0.1s' }}>{proj.description.ja}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2"
                                style={{ animation: 'ai-reveal 0.4s ease-out both', animationDelay: '0.2s' }}>
                                {proj.stack.map((s) => (
                                  <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-white/65">{s}</span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Click hint — always rendered, opacity toggles (no layout shift) */}
                  <motion.p
                    className="text-[10px] text-white/25 mt-2 text-center h-4"
                    animate={{ opacity: isNodeHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: isNodeHovered ? 0.4 : 0 }}
                  >
                    click to explore
                  </motion.p>
                </div>
              </FloatingNode>
            );
          })}
        </DepthLayer>

        {/* ── DEPTH -1: Foreground ── */}
        <DepthLayer depth={-1} mouseX={mouseX} mouseY={mouseY} className="z-[40]">
          <FloatingNode x={0} y={-30} delay={0.5} seed={200} scale={0.9}
            onHover={() => setHovered('contact')} onLeave={() => setHovered(null)}
            isHovered={hovered === 'contact'}
            isDimmed={(hovered !== null && hovered !== 'contact') || expanded !== null}
          >
            <div className="text-center relative">
              <div className="flex gap-6 items-center">
                {contact.github && (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-white/65 hover:text-white/90 transition-all duration-500 hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                    GitHub
                  </a>
                )}
                <motion.span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
                {contact.email && (
                  <a href={`mailto:${contact.email}`}
                    className="text-sm text-white/65 hover:text-white/90 transition-all duration-500 hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    Email
                  </a>
                )}
              </div>
            </div>
          </FloatingNode>
          <MouseGlow mouseX={mouseX} mouseY={mouseY} />
        </DepthLayer>

      </motion.div>

      {/* ── Expanded overlay (outside tilt wrapper) ── */}
      <AnimatePresence>
        {expanded && (
          <ExpandedOverlay
            nodeId={expanded}
            origin={expandOrigin}
            nodes={nodes}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
