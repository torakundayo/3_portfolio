'use client';

import { useState, useRef, useEffect, useCallback, useMemo, type FormEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Send, Mic } from 'lucide-react';
import type { InputPosition, InputStyle } from '@/lib/types';
import { useVoiceInput } from '@/hooks/useVoiceInput';

const positionStyles: Record<InputPosition, string> = {
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'bottom-right': 'bottom-6 right-6 w-80',
  'top-center': 'top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'integrated': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
};

const buttonStyleClasses: Record<InputStyle, string> = {
  'minimal': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'glass': 'bg-gray-100/80 text-gray-800 hover:bg-gray-200/80',
  'dark-glass': 'bg-gray-100/80 text-gray-800 hover:bg-gray-200/80',
  'transparent': 'bg-gray-100/60 text-gray-800 hover:bg-gray-200/60',
  'ghost': 'text-gray-600 hover:text-gray-900',
};

const DEFAULT_SUGGEST_KEYWORDS = ['スキル', '経歴', 'プロジェクト', '連絡先'];


interface FloatingInputProps {
  position: InputPosition;
  style: InputStyle;
  sendMessage: (message: { text: string }) => void;
  isLoading: boolean;
  /** Dynamic keyword suggestions from behavior observer */
  suggestedKeywords?: string[];
  /** Callback to report focus-without-typing state */
  onFocusIdleChange?: (isFocusedEmpty: boolean) => void;
  /** Cursor is moving fast — user is searching */
  isSearching?: boolean;
}

export function FloatingInput({
  position, style, sendMessage, isLoading,
  suggestedKeywords, onFocusIdleChange, isSearching = false,
}: FloatingInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [positionTransitioning, setPositionTransitioning] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevPositionRef = useRef(position);

  const isTyping = input.length > 0;
  const isMinimal = style === 'minimal';
  const isGhost = style === 'ghost';
  const hasGlow = (style === 'glass' || style === 'dark-glass') && !isGhost;
  const isCenter = position === 'center';

  // ── Voice input ──
  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(text);
  }, []);
  const { isSupported: voiceSupported, isListening, startListening, stopListening } =
    useVoiceInput(handleVoiceTranscript);
  const toggleVoice = useCallback(() => {
    if (isListening) stopListening(); else startListening();
  }, [isListening, startListening, stopListening]);

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

  // Report focus-without-typing state to behavior observer
  useEffect(() => {
    onFocusIdleChange?.(isFocused && !isTyping);
  }, [isFocused, isTyping, onFocusIdleChange]);

  // T-020: Fade out → reposition → fade in when position changes (no y-axis movement)
  useEffect(() => {
    if (prevPositionRef.current !== position) {
      prevPositionRef.current = position;
      setPositionTransitioning(true);
      const timer = setTimeout(() => setPositionTransitioning(false), 280);
      return () => clearTimeout(timer);
    }
  }, [position]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || positionTransitioning) return;
    if (isListening) stopListening();
    sendMessage({ text: input.trim() });
    setInput('');
    setShowSuggestions(false);
  };

  const handleSuggestClick = (keyword: string) => {
    sendMessage({ text: keyword });
    setInput('');
    setShowSuggestions(false);
  };

  const glowDuration = isTyping ? 1.5 : 4;
  // Base glow: focus > searching > center-idle > default
  const baseGlow = isFocused ? 0.6 : isSearching ? 0.5 : isCenter ? 0.4 : 0.25;
  // Proximity adds up to 0.25 extra glow (only when not focused — focus already has max)
  const proxGlowBoost = useTransform(smoothProximity, [0, 1], [0, isFocused ? 0 : 0.25]);
  const glowOpacity = useTransform(proxGlowBoost, (boost) => baseGlow + boost);
  // Proximity-driven halo intensity for center state
  const haloOpacity = useTransform(smoothProximity, [0, 0.5, 1], [1, 1.3, 1.8]);

  // Disable input during position transition to prevent inconsistency
  const inputDisabled = isLoading || positionTransitioning;

  return (
    <motion.div
      ref={containerRef}
      animate={{ opacity: positionTransitioning ? 0 : 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
      className={`absolute px-4 pointer-events-auto ${positionStyles[position]}`}
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
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.45) 0%, rgba(6,182,212,0.28) 50%, transparent 70%)',
              animation: 'ai-breathe 4s ease-in-out infinite',
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
                scale: isCenter ? [1, 1.02, 1] : [1, 1.008, 1],
              } : { scale: 1 }}
              transition={{ duration: isCenter ? 3.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: isListening
                    ? 'conic-gradient(from var(--glow-angle), rgba(239,68,68,0.35), rgba(251,146,60,0.25), rgba(239,68,68,0.1), rgba(251,146,60,0.25), rgba(239,68,68,0.35))'
                    : 'conic-gradient(from var(--glow-angle), rgba(139,92,246,0.40), rgba(6,182,212,0.35), rgba(139,92,246,0.12), rgba(6,182,212,0.35), rgba(139,92,246,0.40))',
                  animation: `glow-rotate ${isListening ? 1.2 : glowDuration}s linear infinite`,
                }}
              />
              <div className="absolute inset-[1px] rounded-[15px] bg-white/95 backdrop-blur-xl" />
            </motion.div>
          )}

          {/* Ghost style: always-visible breathing glow underline */}
          {isGhost && !isFocused && !isTyping && (
            <motion.div
              className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full pointer-events-none z-10"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(6,182,212,0.7), rgba(139,92,246,0.8), transparent)',
                boxShadow: '0 0 12px rgba(139,92,246,0.3), 0 0 4px rgba(6,182,212,0.2)',
              }}
              animate={{ opacity: [0.6, 1, 0.6], scaleX: [0.92, 1, 0.92] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`relative flex items-center transition-all duration-300 ${
              isGhost
                ? `bg-transparent text-gray-900 placeholder:text-gray-400 ${
                    isFocused || isTyping
                      ? 'bg-white/60 backdrop-blur-sm rounded-xl border border-gray-300/50'
                      : 'border-b border-gray-400/30'
                  }`
                : isMinimal
                ? `bg-white rounded-xl border border-gray-200 ${isFocused ? 'border-gray-400' : ''}`
                : `rounded-2xl backdrop-blur-xl border border-gray-200/60 ${
                    isFocused ? 'border-gray-300' : ''
                  } ${
                    style === 'glass' ? 'bg-white/80 text-gray-900 placeholder:text-gray-400' :
                    style === 'dark-glass' ? 'bg-white/80 text-gray-900 placeholder:text-gray-400' :
                    'bg-transparent border-b border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-none'
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
              placeholder={isListening ? '...' : isCenter ? 'skills, career, projects...' : '...'}
              disabled={inputDisabled}
              aria-label="AIに質問する"
              className={`flex-1 bg-transparent outline-none text-sm ${
                isMinimal ? 'px-5 py-3 text-gray-900 placeholder:text-gray-400' : 'px-5 py-3.5 text-gray-900 placeholder:text-gray-400'
              }`}
            />

            {/* Minimal/Ghost: no button, just a subtle Enter hint */}
            {(isMinimal || isGhost) ? (
              <AnimatePresence>
                {isTyping && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 text-xs mr-4 select-none"
                  >
                    ↵
                  </motion.span>
                )}
              </AnimatePresence>
            ) : (
              <div className="flex items-center gap-0.5">
                {/* Voice input button */}
                {voiceSupported && (
                  <motion.button
                    type="button"
                    onClick={toggleVoice}
                    disabled={inputDisabled}
                    aria-label={isListening ? '音声入力を停止' : '音声で入力'}
                    className={`relative mx-0.5 my-1 p-2.5 rounded-xl transition-all duration-200
                                disabled:opacity-20 disabled:cursor-not-allowed
                                ${isListening ? 'text-red-400' : buttonStyleClasses[style]}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={isListening
                      ? { scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }
                      : { duration: 0.2 }
                    }
                  >
                    <Mic size={15} />
                    {/* Recording indicator dot */}
                    <AnimatePresence>
                      {isListening && (
                        <motion.div
                          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [1, 0.4, 1], scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{
                            opacity: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
                            scale: { duration: 0.2 },
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}

                {/* Send button */}
                <motion.button
                  type="submit"
                  disabled={inputDisabled || !input.trim()}
                  aria-label="送信"
                  className={`mx-0.5 my-1 px-4 py-2.5 rounded-xl transition-all duration-200
                              disabled:opacity-20 disabled:cursor-not-allowed
                              ${buttonStyleClasses[style]}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={15} />
                </motion.button>
              </div>
            )}
          </form>

          {/* Suggestion keywords: radial layout above input */}
          <AnimatePresence>
            {showSuggestions && (() => {
              const kws = suggestedKeywords ?? DEFAULT_SUGGEST_KEYWORDS;
              const count = kws.length;
              // Fan out in a gentle arc above the input
              const arcSpread = Math.min(Math.PI * 0.7, 0.3 + count * 0.12);
              const radius = 60 + count * 8; // px from center

              return (
                <div className="absolute left-1/2 bottom-full mb-2 pointer-events-none"
                     style={{ width: 0, height: 0 }}>
                  {kws.map((kw, i) => {
                    const angle = -Math.PI / 2 + (i - (count - 1) / 2) * (arcSpread / Math.max(count - 1, 1));
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.button
                        key={kw}
                        type="button"
                        onClick={() => handleSuggestClick(kw)}
                        className="absolute pointer-events-auto text-gray-800 hover:text-gray-900
                                   text-sm font-medium cursor-pointer select-none whitespace-nowrap
                                   transition-colors duration-200"
                        style={{
                          left: x,
                          top: y,
                          transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
                        transition={{
                          delay: i * 0.08,
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ scale: 1.15 }}
                      >
                        {kw}
                      </motion.button>
                    );
                  })}
                </div>
              );
            })()}
          </AnimatePresence>
        </div>
    </motion.div>
  );
}
