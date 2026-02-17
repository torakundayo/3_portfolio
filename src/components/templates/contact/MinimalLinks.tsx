'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius } from '@/lib/animation';

export function ContactMinimalLinks({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;

  const email = d?.email ?? '';
  const github = d?.github ?? '';
  const linkedin = d?.linkedin ?? '';
  const message = d?.message?.ja ?? d?.message?.en ?? '';

  const links = [
    { href: email ? `mailto:${email}` : '', label: email, icon: Mail },
    { href: github, label: 'GitHub', icon: Github },
    { href: linkedin, label: 'LinkedIn', icon: Linkedin },
  ].filter((l) => l.href);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col items-center justify-center bg-white">
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

      <div className="max-w-lg w-full px-8 py-16">
        {/* Message — ai-breathe on main text */}
        {message && (
          <motion.p
            className="text-sm text-gray-400 text-center mb-12 tracking-wide"
            style={{
              ...breatheStyle(0),
              transform: 'translateZ(40px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: baseDelay }}
          >
            {message}
          </motion.p>
        )}

        {/* Links — ai-reveal on each item */}
        <div className="flex flex-col items-center space-y-6">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300"
                style={{
                  ...revealStyle(i),
                  transform: 'translateZ(30px)',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...SPRING_ENTER,
                  delay: baseDelay + 0.12 * i,
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-base tracking-wide border-b border-transparent group-hover:border-gray-300 transition-all duration-300 pb-0.5">
                  {link.label}
                </span>
                <motion.span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                >
                  <ExternalLink className="w-3 h-3 text-gray-300" />
                </motion.span>
              </motion.a>
            );
          })}
        </div>

        {/* Subtle line */}
        <motion.div
          className="mx-auto mt-12 mb-8"
          style={{
            width: '1px',
            height: '40px',
            backgroundColor: `${palette.primary}20`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: baseDelay + 0.6, duration: 0.6 }}
        />

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="prose prose-sm prose-gray max-w-none text-center"
            style={{ transform: 'translateZ(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.8 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
