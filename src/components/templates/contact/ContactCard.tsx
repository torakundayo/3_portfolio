'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mail, Github, Linkedin } from 'lucide-react';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius } from '@/lib/animation';

export function ContactCard({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;

  const email = d?.email ?? '';
  const github = d?.github ?? '';
  const linkedin = d?.linkedin ?? '';
  const message = d?.message?.ja ?? d?.message?.en ?? '';

  const links = [
    { href: email ? `mailto:${email}` : '', label: email, icon: Mail, name: 'Email' },
    { href: github, label: github?.replace('https://', ''), icon: Github, name: 'GitHub' },
    { href: linkedin, label: linkedin?.replace('https://', ''), icon: Linkedin, name: 'LinkedIn' },
  ].filter((l) => l.href);

  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center">
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

      {/* Static background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #f8fafc, white, #f8fafc)',
        }}
      />

      <motion.div
        className="relative max-w-md w-full mx-6"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...SPRING_ENTER, delay: baseDelay }}
      >
        {/* Glass card — organicRadius instead of rounded-3xl */}
        <div
          className="border border-white/60 bg-white/70 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
          style={{ borderRadius: organicRadius }}
        >
          {/* Accent glow at top */}
          <div
            className="absolute -top-px left-8 right-8 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${palette.primary}60, ${palette.secondary}60, transparent)`,
            }}
          />

          {/* Message — ai-breathe on main heading */}
          {message && (
            <motion.p
              className="text-center text-lg text-gray-700 leading-relaxed mb-8"
              style={{
                ...breatheStyle(0),
                transform: 'translateZ(40px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.2, duration: 0.6 }}
            >
              {message}
            </motion.p>
          )}

          {/* Divider */}
          <motion.div
            className="mx-auto mb-8"
            style={{
              width: '40px',
              height: '1px',
              background: `linear-gradient(to right, ${palette.primary}40, ${palette.secondary}40)`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: baseDelay + 0.3, duration: 0.5 }}
          />

          {/* Links — ai-reveal on each item */}
          <div className="space-y-4">
            {links.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-3.5 border border-gray-100 bg-white/60 hover:bg-white hover:shadow-md transition-all duration-300 group"
                  style={{
                    ...revealStyle(i),
                    ...cardFloatStyle(i),
                    borderRadius: organicRadius,
                    transform: 'translateZ(30px)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING_ENTER, delay: baseDelay + 0.4 + 0.12 * i }}
                  whileHover={{ x: 4 }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: `${palette.primary}10` }}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: palette.primary }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{link.name}</p>
                    <p className="text-sm text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                      {link.label}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Commentary below card */}
        {commentary && (
          <motion.div
            className="mt-8 prose prose-sm prose-gray max-w-none text-center"
            style={{ transform: 'translateZ(20px)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + 0.8 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
