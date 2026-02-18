'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TemplateProps, ContactData } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle, seededRandom } from '@/lib/animation';

const CONTACT_ICONS: Record<string, string> = {
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

export function ContactSpatialContact({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const contactData = data as ContactData;
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  // Build contact items
  const contactItems = useMemo(() => {
    const items: { type: string; label: string; href: string }[] = [];
    if (contactData?.email)
      items.push({ type: 'email', label: contactData.email, href: `mailto:${contactData.email}` });
    if (contactData?.github)
      items.push({ type: 'github', label: 'GitHub', href: contactData.github });
    if (contactData?.linkedin)
      items.push({ type: 'linkedin', label: 'LinkedIn', href: contactData.linkedin });
    return items;
  }, [contactData]);

  // Radial positions
  const positions = useMemo(() => {
    const r = seededRandom(visualSeed.accentIndex * 13 + 71);
    return contactItems.map((_, i) => {
      const angle = (i / contactItems.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 16 + r() * 6;
      const side = mirror ? -1 : 1;
      return {
        x: 50 + Math.cos(angle) * radius * side,
        y: 45 + Math.sin(angle) * radius * 0.55,
      };
    });
  }, [contactItems, mirror, visualSeed.accentIndex]);

  const message = contactData?.message?.ja || contactData?.message?.en || '';

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}18`,
            left: '30%',
            top: '25%',
            animation: 'bg-drift-1 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* Centre message */}
      {message && (
        <motion.p
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2
                     text-sm md:text-base text-gray-800 text-center max-w-xs z-20 leading-relaxed"
          style={{ transform: 'translate3d(-50%, -50%, 40px)', ...breatheStyle(0) }}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
        >
          {message}
        </motion.p>
      )}

      {/* Contact nodes radiating from center */}
      {contactItems.map((item, i) => {
        const pos = positions[i];
        const isEmail = item.type === 'email';

        return (
          <motion.a
            key={item.type}
            href={item.href}
            target={isEmail ? undefined : '_blank'}
            rel={isEmail ? undefined : 'noopener noreferrer'}
            className="absolute z-20 flex flex-col items-center gap-2 group cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate3d(-50%, -50%, 30px)',
              ...breatheStyle(i + 1),
            }}
            initial={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: baseDelay + 0.4 + i * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${palette.glow}30, transparent 70%)`,
                transform: 'scale(4)',
              }}
            />

            {/* Icon circle */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center border
                         group-hover:scale-110 transition-transform duration-300"
              style={{
                borderColor: `${palette.primary}40`,
                backgroundColor: `${palette.primary}08`,
              }}
            >
              {item.type === 'email' ? (
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={CONTACT_ICONS.email} />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d={CONTACT_ICONS[item.type]} />
                </svg>
              )}
            </div>

            {/* Label */}
            <span className="text-xs text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
              {item.label}
            </span>
          </motion.a>
        );
      })}

      {/* Commentary */}
      {commentary && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-xs z-30
                     opacity-50 hover:opacity-85 transition-opacity duration-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: baseDelay + 1 }}
        >
          <p className="text-xs text-gray-800 leading-relaxed line-clamp-2">{commentary}</p>
        </motion.div>
      )}
    </div>
  );
}
