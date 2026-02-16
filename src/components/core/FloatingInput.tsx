'use client';

import { useState, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface FloatingInputProps {
  position: InputPosition;
  style: InputStyle;
  sendMessage: (message: { text: string }) => void;
  isLoading: boolean;
}

export function FloatingInput({ position, style, sendMessage, isLoading }: FloatingInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isTyping = input.length > 0;
  const isMinimal = style === 'minimal';
  const hasGlow = style === 'glass' || style === 'dark-glass';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  const glowDuration = isTyping ? 1.5 : 4;
  const glowOpacity = isFocused ? 0.5 : 0.25;

  return (
    <motion.div
      layout
      transition={{
        layout: { type: 'spring', stiffness: 300, damping: 30, mass: 1 },
      }}
      className={`absolute z-50 px-4 pointer-events-auto ${positionStyles[position]}`}
    >
      <motion.div
        animate={!isFocused && !isTyping && !isMinimal ? { scale: [1, 1.003, 1] } : { scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          {/* Animated conic-gradient glow border (glass/dark-glass only) */}
          {hasGlow && (
            <motion.div
              className="absolute -inset-[1px] rounded-2xl overflow-hidden"
              animate={{ opacity: glowOpacity }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from var(--glow-angle), rgba(139,92,246,0.4), rgba(6,182,212,0.4), rgba(139,92,246,0.1), rgba(6,182,212,0.4), rgba(139,92,246,0.4))',
                }}
                animate={{ '--glow-angle': ['0deg', '360deg'] } as any}
                transition={{ duration: glowDuration, repeat: Infinity, ease: 'linear' }}
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
              onBlur={() => setIsFocused(false)}
              placeholder="何でも聞いてください..."
              disabled={isLoading}
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
        </div>
      </motion.div>
    </motion.div>
  );
}
