'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mail, Github, Linkedin } from 'lucide-react';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function ContactFullscreenCta({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  const email = d?.email ?? '';
  const github = d?.github ?? '';
  const linkedin = d?.linkedin ?? '';
  const message = d?.message?.ja ?? d?.message?.en ?? '';

  const secondaryLinks = [
    github ? { href: github, icon: Github, label: 'GitHub' } : null,
    linkedin ? { href: linkedin, icon: Linkedin, label: 'LinkedIn' } : null,
  ].filter(Boolean) as { href: string; icon: typeof Github; label: string }[];

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center relative">
      {/* CSS keyframe background drifts (cyan/violet) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(-20px)' }}>
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}1f`,
            left: '20%',
            top: '15%',
            animation: 'bg-drift-1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{
            background: `${palette.secondary}14`,
            right: '15%',
            bottom: '20%',
            animation: 'bg-drift-2 22s ease-in-out infinite',
          }}
        />
      </div>

      <div className="max-w-2xl w-full px-8 py-16 text-center">
        {/* Large CTA text — ai-breathe on main heading */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight"
          style={{
            ...breatheStyle(0),
            transform: 'translateZ(40px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
        >
          {message || "Let's Connect"}
        </motion.h2>

        {/* Pulsing email link — organicRadius, translateZ(30px) */}
        {email && (
          <motion.div
            className="mb-12"
            style={{ ...revealStyle(0) }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.12 }}
          >
            <motion.a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xl md:text-2xl font-medium px-8 py-4 border transition-all duration-500"
              style={{
                color: palette.glow,
                borderColor: `${palette.primary}40`,
                backgroundColor: `${palette.primary}10`,
                borderRadius: organicRadius,
                transform: 'translateZ(30px)',
                boxShadow: `0 0 20px ${palette.glow}10, 0 0 40px ${palette.primary}05`,
              }}
              whileHover={{
                scale: 1.03,
              }}
            >
              <Mail className="w-6 h-6" />
              {email}
            </motion.a>
          </motion.div>
        )}

        {/* Secondary links — ai-reveal on each */}
        <motion.div
          className="flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: baseDelay + 0.6 }}
        >
          {secondaryLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors duration-300 group"
                style={{
                  ...revealStyle(i + 1),
                  transform: 'translateZ(30px)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm tracking-wide">{link.label}</span>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-16 prose prose-gray prose-sm max-w-none"
            style={{ transform: 'translateZ(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: baseDelay + 0.9 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
