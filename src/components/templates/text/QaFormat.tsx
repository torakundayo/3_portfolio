'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius } from '@/lib/animation';

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
  // Limit to first 4 items for viewport fitting
  const visibleItems = qaItems.slice(0, 4);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="h-full w-full overflow-hidden bg-gray-950 relative">
      {/* CSS keyframe bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1a`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 20s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}12`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 24s ease-in-out infinite' }} />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 h-full flex flex-col relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${palette.primary}30` }}
            />
            <span
              className="text-xs font-mono tracking-[0.3em] uppercase"
              style={{
                color: palette.primary,
                ...breatheStyle(0),
                transform: 'translateZ(40px)',
              }}
            >
              Q&A
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${palette.primary}30` }}
            />
          </div>
        </motion.div>

        {/* Accordion items */}
        <div className="space-y-3 flex-1 min-h-0">
          {visibleItems.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                className="border overflow-hidden transition-colors duration-300"
                style={{
                  borderRadius: organicRadius,
                  borderColor: isOpen ? `${palette.primary}40` : 'rgba(255,255,255,0.08)',
                  backgroundColor: isOpen ? `${palette.primary}08` : 'rgba(255,255,255,0.03)',
                  ...revealStyle(i),
                  transform: 'translateZ(15px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...SPRING_ENTER,
                  delay: baseDelay + 0.1 * i,
                }}
              >
                {/* Question header */}
                <button
                  className="w-full text-left px-6 py-4 flex items-start gap-4 group"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {/* Q marker */}
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 transition-colors duration-300"
                    style={{
                      backgroundColor: isOpen ? `${palette.primary}20` : 'rgba(255,255,255,0.06)',
                      color: isOpen ? palette.primary : '#94a3b8',
                    }}
                  >
                    Q
                  </span>

                  <span
                    className="flex-1 text-base font-semibold text-gray-200 group-hover:text-gray-100 transition-colors leading-relaxed"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    {item.question}
                  </span>

                  {/* Chevron */}
                  <motion.span
                    className="flex-shrink-0 mt-1 text-gray-500"
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
                      <div className="px-6 pb-5 pl-[3.25rem]">
                        <div
                          className="h-px w-full mb-4"
                          style={{ backgroundColor: `${palette.primary}15` }}
                        />
                        <div
                          className="prose prose-sm prose-invert max-w-none"
                          style={{ transform: 'translateZ(15px)' }}
                        >
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
