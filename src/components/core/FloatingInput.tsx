'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { InputPosition, InputStyle } from '@/lib/types';

const positionStyles: Record<InputPosition, string> = {
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'bottom-right': 'bottom-6 right-6 w-80',
  'top-center': 'top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'integrated': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
};

const inputStyleClasses: Record<InputStyle, string> = {
  'minimal': 'bg-white border border-gray-200 shadow-sm text-gray-900 placeholder:text-gray-400',
  'glass': 'bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/50',
  'dark-glass': 'bg-black/30 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40',
  'transparent': 'bg-transparent border-b border-white/30 text-white placeholder:text-white/40 rounded-none',
};

const buttonStyleClasses: Record<InputStyle, string> = {
  'minimal': 'bg-gray-900 text-white hover:bg-gray-800',
  'glass': 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30',
  'dark-glass': 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20',
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  return (
    <motion.div
      layout
      transition={{
        layout: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 1,
        },
      }}
      className={`absolute z-50 px-4 ${positionStyles[position]}`}
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="何でも聞いてください..."
          disabled={isLoading}
          className={`flex-1 px-5 py-3.5 rounded-2xl outline-none transition-all duration-300
                      text-sm ${inputStyleClasses[style]}
                      focus:ring-2 focus:ring-white/20`}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`px-4 py-3.5 rounded-2xl transition-all duration-200
                      disabled:opacity-30 disabled:cursor-not-allowed
                      ${buttonStyleClasses[style]}`}
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
}
