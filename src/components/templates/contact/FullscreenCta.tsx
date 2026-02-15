'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mail, Github, Linkedin } from 'lucide-react';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ContactFullscreenCta({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;

  const email = d?.email ?? '';
  const github = d?.github ?? '';
  const linkedin = d?.linkedin ?? '';
  const message = d?.message?.ja ?? d?.message?.en ?? '';

  return (
    <div className="h-full w-full overflow-auto bg-gray-950 flex flex-col items-center justify-center relative">
      {/* Dramatic dark background with animated glow */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: [
            `radial-gradient(ellipse at 50% 50%, ${palette.primary}18 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, ${palette.secondary}0a 0%, transparent 40%), #030712`,
            `radial-gradient(ellipse at 50% 50%, ${palette.secondary}18 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${palette.primary}0a 0%, transparent 40%), #030712`,
            `radial-gradient(ellipse at 50% 50%, ${palette.primary}18 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, ${palette.secondary}0a 0%, transparent 40%), #030712`,
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-2xl w-full px-8 py-16 text-center">
        {/* Large CTA text */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {message || "Let's Connect"}
        </motion.h2>

        {/* Pulsing email link */}
        {email && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.3 }}
          >
            <motion.a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xl md:text-2xl font-medium px-8 py-4 rounded-2xl border transition-all duration-500"
              style={{
                color: palette.glow,
                borderColor: `${palette.primary}40`,
                backgroundColor: `${palette.primary}10`,
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 40px ${palette.glow}30, 0 0 80px ${palette.primary}15`,
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${palette.glow}10, 0 0 40px ${palette.primary}05`,
                  `0 0 30px ${palette.glow}20, 0 0 60px ${palette.primary}10`,
                  `0 0 20px ${palette.glow}10, 0 0 40px ${palette.primary}05`,
                ],
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Mail className="w-6 h-6" />
              {email}
            </motion.a>
          </motion.div>
        )}

        {/* Secondary links */}
        <motion.div
          className="flex items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: baseDelay + 0.6 }}
        >
          {github && (
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
              whileHover={{ y: -2 }}
            >
              <Github className="w-5 h-5" />
              <span className="text-sm tracking-wide">GitHub</span>
            </motion.a>
          )}
          {linkedin && (
            <motion.a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
              whileHover={{ y: -2 }}
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm tracking-wide">LinkedIn</span>
            </motion.a>
          )}
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-16 prose prose-invert prose-gray prose-sm max-w-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + 0.9 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
