'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

interface QaItem {
  question: string;
  answer: string;
}

function parseQa(text: string): QaItem[] {
  const items: QaItem[] = [];

  // Try to parse Q&A from markdown headers (## or ### or Q: / A: format)
  const lines = text.split('\n');
  let currentQ = '';
  let currentA = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect question patterns
    const questionMatch =
      trimmed.match(/^#{1,3}\s+(.+)/) ||
      trimmed.match(/^[QqQq][.:]?\s*(.+)/) ||
      trimmed.match(/^\*\*(.+)\*\*$/);

    if (questionMatch) {
      // Save previous Q&A if exists
      if (currentQ && currentA.trim()) {
        items.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = questionMatch[1];
      currentA = '';
    } else if (currentQ) {
      // Skip "A:" prefix
      const answerLine = trimmed.replace(/^[AaAa][.:]?\s*/, '');
      currentA += (currentA ? '\n' : '') + answerLine;
    }
  }

  // Push last item
  if (currentQ && currentA.trim()) {
    items.push({ question: currentQ, answer: currentA.trim() });
  }

  // Fallback: if no Q&A parsed, treat each paragraph as a section
  if (items.length === 0 && text.trim()) {
    const paragraphs = text.split('\n\n').filter((p) => p.trim());
    paragraphs.forEach((p, i) => {
      items.push({
        question: `Section ${i + 1}`,
        answer: p.trim(),
      });
    });
  }

  return items;
}

export function TextQaFormat({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;

  const qaItems = parseQa(commentary || '');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="h-full w-full overflow-auto">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, white 0%, ${palette.primary}03 50%, white 100%)`,
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: baseDelay }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${palette.primary}20` }}
            />
            <span
              className="text-xs font-mono tracking-[0.3em] uppercase"
              style={{ color: palette.primary }}
            >
              Q&A
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${palette.primary}20` }}
            />
          </div>
        </motion.div>

        {/* Accordion items */}
        <div className="space-y-3">
          {qaItems.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                className="rounded-xl border overflow-hidden transition-colors duration-300"
                style={{
                  borderColor: isOpen ? `${palette.primary}30` : '#f1f5f9',
                  backgroundColor: isOpen ? `${palette.primary}03` : 'white',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: baseDelay + 0.1 * i,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                {/* Question header */}
                <button
                  className="w-full text-left px-6 py-5 flex items-start gap-4 group"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {/* Q marker */}
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 transition-colors duration-300"
                    style={{
                      backgroundColor: isOpen ? `${palette.primary}15` : '#f1f5f9',
                      color: isOpen ? palette.primary : '#94a3b8',
                    }}
                  >
                    Q
                  </span>

                  <span className="flex-1 text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors leading-relaxed">
                    {item.question}
                  </span>

                  {/* Chevron */}
                  <motion.span
                    className="flex-shrink-0 mt-1 text-gray-400"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-[3.25rem]">
                        <div
                          className="h-px w-full mb-4"
                          style={{ backgroundColor: `${palette.primary}10` }}
                        />
                        <div className="prose prose-sm prose-gray max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {item.answer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
