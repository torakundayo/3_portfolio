'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Send } from 'lucide-react';
import type { InputPosition, InputStyle } from '@/lib/types';

const positionStyles: Record<InputPosition, string> = {
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'bottom-right': 'bottom-6 right-6 w-80',
  'top-center': 'top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'integrated': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
};

const buttonStyleClasses: Record<InputStyle, string> = {
  'minimal': 'bg-gray-900 text-white hover:bg-gray-800',
  'glass': 'bg-white/[0.08] text-white hover:bg-white/[0.15]',
  'dark-glass': 'bg-white/[0.06] text-white hover:bg-white/[0.12]',
  'transparent': 'bg-white/10 text-white hover:bg-white/20',
};

const SUGGEST_KEYWORDS = ['スキル', '経歴', 'プロジェクト', '連絡先'];

const WELCOME_SUGGESTIONS = [
  { label: 'スキルを見る', query: 'どんなスキルがありますか？' },
  { label: '開発実績', query: 'プロジェクトを見せて' },
  { label: '経歴', query: '経歴を教えて' },
  { label: 'このサイトの仕組み', query: 'このサイトはどういう仕組みですか？' },
];

interface FloatingInputProps {
  position: InputPosition;
  style: InputStyle;
  sendMessage: (message: { text: string }) => void;
  isLoading: boolean;
}

export function FloatingInput({ position, style, sendMessage, isLoading }: FloatingInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isTyping = input.length > 0;
  const isMinimal = style === 'minimal';
  const hasGlow = style === 'glass' || style === 'dark-glass';
  const isCenter = position === 'center';

  // ── Cursor proximity sensing (pre-focus glow) ──
  const cursorProximity = useMotionValue(0);
  const smoothProximity = useSpring(cursorProximity, { stiffness: 60, damping: 22 });

  const measureProximity = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el || isFocused) { cursorProximity.set(0); return; }
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const maxDist = isCenter ? 300 : 200;
    cursorProximity.set(Math.max(0, 1 - dist / maxDist));
  }, [cursorProximity, isFocused, isCenter]);

  useEffect(() => {
    if (!hasGlow) return;
    window.addEventListener('mousemove', measureProximity, { passive: true });
    return () => window.removeEventListener('mousemove', measureProximity);
  }, [hasGlow, measureProximity]);

  // Proactive welcome suggestions: show after brief entry delay when in center (welcome) mode
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    if (isCenter && !isTyping && !welcomeDismissed) {
      const t = setTimeout(() => setShowWelcome(true), 1500);
      return () => clearTimeout(t);
    } else {
      setShowWelcome(false);
    }
  }, [isCenter, isTyping, welcomeDismissed]);

  // Detect focus without typing → show suggestions after 3s (non-welcome state)
  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);

    if (isFocused && !isTyping && !isCenter) {
      suggestTimerRef.current = setTimeout(() => setShowSuggestions(true), 3000);
    } else {
      setShowSuggestions(false);
    }

    return () => {
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    };
  }, [isFocused, isTyping, isCenter]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
    setShowSuggestions(false);
    setWelcomeDismissed(true);
  };

  const handleSuggestClick = (keyword: string) => {
    sendMessage({ text: keyword });
    setInput('');
    setShowSuggestions(false);
    setWelcomeDismissed(true);
  };

  const glowDuration = isTyping ? 1.5 : 4;
  // Base glow: focus > center-idle > default
  const baseGlow = isFocused ? 0.6 : isCenter ? 0.4 : 0.25;
  // Proximity adds up to 0.25 extra glow (only when not focused — focus already has max)
  const proxGlowBoost = useTransform(smoothProximity, [0, 1], [0, isFocused ? 0 : 0.25]);
  const glowOpacity = useTransform(proxGlowBoost, (boost) => baseGlow + boost);
  // Proximity-driven halo intensity for center state
  const haloOpacity = useTransform(smoothProximity, [0, 0.5, 1], [1, 1.3, 1.8]);

  return (
    <motion.div
      ref={containerRef}
      layout
      transition={{
        layout: { type: 'spring', stiffness: 300, damping: 30, mass: 1 },
      }}
      className={`absolute z-50 px-4 pointer-events-auto ${positionStyles[position]}`}
    >
      {/* Ambient glow halo behind input in center (welcome) state */}
      {isCenter && hasGlow && (
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ opacity: haloOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
              animation: 'ai-breathe 6s ease-in-out infinite',
            }}
          />
        </motion.div>
      )}

      <div className="relative">
          {/* Breathing glow border (decorative only — does NOT wrap the form) */}
          {hasGlow && (
            <motion.div
              className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none"
              style={{ opacity: glowOpacity }}
              animate={!isFocused && !isTyping ? {
                scale: isCenter ? [1, 1.008, 1] : [1, 1.003, 1],
              } : { scale: 1 }}
              transition={{ duration: isCenter ? 4 : 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from var(--glow-angle), rgba(139,92,246,0.4), rgba(6,182,212,0.4), rgba(139,92,246,0.1), rgba(6,182,212,0.4), rgba(139,92,246,0.4))',
                  animation: `glow-rotate ${glowDuration}s linear infinite`,
                }}
              />
              <div className="absolute inset-[1px] rounded-[15px] bg-gray-950/90 backdrop-blur-xl" />
            </motion.div>
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`relative flex items-center transition-colors duration-300 ${
              isMinimal
                ? `bg-white rounded-xl border border-black/15 ${isFocused ? 'border-black/30' : ''}`
                : `rounded-2xl backdrop-blur-xl border border-white/[0.08] ${
                    isFocused ? 'border-white/[0.15]' : ''
                  } ${
                    style === 'glass' ? 'bg-white/[0.06] text-white placeholder:text-white/40' :
                    style === 'dark-glass' ? 'bg-black/30 text-white placeholder:text-white/40' :
                    'bg-transparent border-b border-white/30 text-white placeholder:text-white/40 rounded-none'
                  }`
            }`}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Delay blur to allow suggestion click
                setTimeout(() => setIsFocused(false), 150);
              }}
              placeholder="何でも聞いてください..."
              disabled={isLoading}
              aria-label="AIに質問する"
              className={`flex-1 bg-transparent outline-none text-sm ${
                isMinimal ? 'px-5 py-3 text-gray-900 placeholder:text-gray-400' : 'px-5 py-3.5'
              }`}
            />

            {/* Minimal: no button, just a subtle Enter hint */}
            {isMinimal ? (
              <AnimatePresence>
                {isTyping && (
                  <motion.span
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-black/20 text-xs mr-4 select-none"
                  >
                    ↵
                  </motion.span>
                )}
              </AnimatePresence>
            ) : (
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="送信"
                className={`mx-1 my-1 px-4 py-2.5 rounded-xl transition-all duration-200
                            disabled:opacity-20 disabled:cursor-not-allowed
                            ${buttonStyleClasses[style]}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={15} />
              </motion.button>
            )}
          </form>

          {/* Welcome proactive suggestions: shown immediately in center mode */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="mt-4 flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <motion.p
                  className="text-white/30 text-[11px] tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  例えば、こんなことが聞けます
                </motion.p>
                <div className="flex flex-wrap justify-center gap-2">
                  {WELCOME_SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s.label}
                      type="button"
                      onClick={() => handleSuggestClick(s.query)}
                      className="px-3.5 py-1.5 rounded-full text-[12px] text-white/50
                                 bg-white/[0.05] border border-white/[0.08]
                                 hover:text-white/80 hover:bg-white/[0.10] hover:border-white/[0.15]
                                 transition-all duration-300 cursor-pointer select-none"
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestion keywords: appear when focused but not typing (non-welcome) */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                className="flex justify-center gap-3 mt-3"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {SUGGEST_KEYWORDS.map((kw, i) => (
                  <motion.button
                    key={kw}
                    type="button"
                    onClick={() => handleSuggestClick(kw)}
                    className="text-white/25 hover:text-white/60 text-[11px] tracking-wider
                               transition-colors duration-300 cursor-pointer select-none"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {kw}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </motion.div>
  );
}
