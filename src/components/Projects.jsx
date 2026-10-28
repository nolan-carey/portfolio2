import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import projects from '../data/projects.json'
import CaseStudy from './ProjectTemplates/CaseStudy'
import GalleryCarousel from './ProjectTemplates/GalleryCarousel'
import StoryMode from './ProjectTemplates/StoryMode'
import FeatureGrid from './ProjectTemplates/FeatureGrid'
import TechBreakdown from './ProjectTemplates/TechBreakdown'

const templates = {
  'case-study': CaseStudy,
  'gallery-carousel': GalleryCarousel,
  'story-mode': StoryMode,
  'feature-grid': FeatureGrid,
  'tech-breakdown': TechBreakdown,
}

const templateLabels = {
  'case-study': 'Case Study',
  'gallery-carousel': 'Gallery',
  'story-mode': 'Story',
  'feature-grid': 'Feature Grid',
  'tech-breakdown': 'Tech Breakdown',
}

function TiltCard({ project, index, onOpen }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })
  const imgY = useSpring(useTransform(y, [-0.5, 0.5], [-8, 8]), { stiffness: 100 })
  const glowX = useTransform(x, [-0.5, 0.5], [20, 80])
  const glowY = useTransform(y, [-0.5, 0.5], [20, 80])

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-gray-800 bg-surface/60 cursor-pointer overflow-hidden relative"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 150, damping: 18 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onOpen}
    >
      {/* Hover glow following cursor */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-accent/20 blur-3xl pointer-events-none z-0"
        style={{ x: glowX, y: glowY }}
      />

      <div className="h-36 bg-gray-800 overflow-hidden relative z-10">
        <motion.div style={{ y: imgY }} className="h-full flex items-center justify-center text-gray-600 text-xs">
          {project.images.length > 0 ? (
            <img src={typeof project.images[0] === 'string' ? project.images[0] : project.images[0].src} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="tracking-widest uppercase font-mono">{templateLabels[project.template]}</span>
          )}
        </motion.div>
      </div>

      <div className="p-5 relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            {templateLabels[project.template]}
          </span>
          <div className="flex items-center gap-2">
            {project.status && (
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                {project.status}
              </span>
            )}
            <motion.span
              className="text-gray-600 text-sm"
              initial={{ x: 0, y: 0 }}
              whileHover={{ x: 3, y: -3 }}
            >
              ↗
            </motion.span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">{project.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{project.summary}</p>
        {(project.ownership || project.role) && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-400">
            <span className="text-accent/70">◆</span>
            {project.ownershipText || (project.ownership ? `${project.ownership} · ${project.commitment || ''}` : project.role)}
          </div>
        )}
        {(project.sideProject || project.inResume) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {project.sideProject && (
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-700/40 text-gray-300 border border-gray-600/50">
                Side project
              </span>
            )}
            {project.inResume && (
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
                On my resume
              </span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.stack.map((s) => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent/80 border border-accent/20">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects({ category = 'software' }) {
  const [openId, setOpenId] = useState(null)
  const visible = projects.filter((p) => p.category === category)
  const openProject = visible.find((p) => p.id === openId)
  const OpenTemplate = openProject ? templates[openProject.template] : null

  return (
    <section id="projects" className="py-24 px-6 relative">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h2>
      <motion.p
        className="text-gray-400 text-center mb-16 max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        Click any card and it takes over the whole page.
      </motion.p>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        style={{ perspective: 1200 }}
      >
        {visible.map((project, i) => (
          <TiltCard
            key={project.id}
            project={project}
            index={i}
            onOpen={() => setOpenId(project.id)}
          />
        ))}
      </div>

      {/* Full screen overlay */}
      <AnimatePresence>
        {openProject && (
          <motion.div
            className="fixed inset-0 z-50 bg-base flex flex-col"
            initial={{ opacity: 0, scale: 1.04, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* animated background blob */}
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-[rgba(255, 250, 240, 0.05)] blur-[120px] -top-20 right-10 pointer-events-none"
              animate={{ x: [0, 30, -20, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Top bar */}
            <motion.div
              className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0 relative z-10"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.button
                onClick={() => setOpenId(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors text-sm"
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </motion.button>
              <div className="flex items-center gap-2">
                {openProject.status && (
                  <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    {openProject.status}
                  </span>
                )}
                <span className="text-sm text-gray-500 font-mono">
                  {templateLabels[openProject.template]}
                </span>
              </div>
            </motion.div>

            <div className="flex-1 overflow-y-auto hide-scrollbar relative z-10">
              <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Title block with letter stagger */}
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-white mb-4 flex flex-wrap"
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.02 }}
                >
                  {openProject.title.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.03, duration: 0.3 }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-gray-400 text-lg mb-4">{openProject.summary}</p>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {openProject.stack.map((s, i) => (
                      <motion.span
                        key={s}
                        className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 250 }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {(openProject.ownership || openProject.role) && (
                  <motion.div
                    className="mb-10 flex items-center gap-3 text-sm text-gray-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <span className="w-8 h-px bg-accent/50 shrink-0" />
                    {openProject.ownershipText
                      || (openProject.ownership
                        ? `${openProject.ownership}, ${openProject.commitment || ''}`
                        : openProject.role)}
                  </motion.div>
                )}

                {(openProject.sideProject || openProject.inResume) && (
                  <motion.div
                    className="flex flex-wrap gap-2 mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {openProject.sideProject && (
                      <span className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full bg-gray-700/40 text-gray-300 border border-gray-600/50">
                        Side project
                      </span>
                    )}
                    {openProject.inResume && (
                      <span className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
                        On my resume
                      </span>
                    )}
                  </motion.div>
                )}

                {OpenTemplate && <OpenTemplate project={openProject} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
