'use client';

import { motion } from 'framer-motion';
import profile from '@/data/profile.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';
import contact from '@/data/contact.json';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-300 w-28 shrink-0">{name}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${level * 20}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        />
      </div>
    </div>
  );
}

export function StaticFallback() {
  return (
    <div className="h-full w-full bg-gray-950 text-white overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <div className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
            Portfolio
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            {profile.name.ja}
          </h1>
          <p className="text-xl text-cyan-400 font-medium">
            {profile.title.ja}
          </p>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            {profile.introduction.ja}
          </p>
          <div className="flex gap-4 pt-2">
            {profile.links.github && (
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors">
                GitHub ↗
              </a>
            )}
            {profile.links.linkedin && (
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors">
                LinkedIn ↗
              </a>
            )}
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-8"
        >
          <h2 className="text-sm font-medium tracking-wider uppercase text-gray-500">
            Projects
          </h2>
          <div className="grid gap-6">
            {projects.projects.map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-cyan-400/80">{p.tagline.ja}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{p.description.ja}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {p.stack.map(t => (
                        <span key={t} className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                      Visit ↗
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-sm font-medium tracking-wider uppercase text-gray-500">
            Skills
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {skills.categories.map(cat => (
              <div key={cat.name.en} className="space-y-4">
                <h3 className="text-xs font-medium tracking-wider uppercase text-gray-500">
                  {cat.name.ja}
                </h3>
                <div className="space-y-3">
                  {cat.skills.map(s => (
                    <SkillBar key={s.name} name={s.name} level={s.level} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="space-y-4 pb-24"
        >
          <h2 className="text-sm font-medium tracking-wider uppercase text-gray-500">
            Contact
          </h2>
          <p className="text-gray-400">{contact.message.ja}</p>
          <div className="flex gap-6">
            {contact.email && (
              <a href={`mailto:${contact.email}`}
                className="text-sm text-gray-400 hover:text-white transition-colors">
                {contact.email}
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors">
                GitHub ↗
              </a>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
