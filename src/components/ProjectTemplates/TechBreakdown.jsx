import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'

function imgSrc(img) {
  return typeof img === 'string' ? img : img.src
}

function CountUp({ value }) {
  const str = String(value)
  const m = str.match(/^([+\-]?)([\d,.]+)(.*)$/)
  const decimals = m ? (m[2].split('.')[1] || '').length : 0
  const num = m ? parseFloat(m[2].replace(/,/g, '')) : 0
  const mv = useMotionValue(0)
  useEffect(() => {
    const controls = animate(mv, num, { duration: 1.8, ease: 'easeOut', delay: 0.4 })
    return () => controls.stop()
  }, [num])
  const out = useTransform(mv, (v) =>
    m
      ? `${m[1]}${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${m[3]}`
      : str
  )
  return <motion.span>{out}</motion.span>
}

export default function TechBreakdown({ project }) {
  const [openIdx, setOpenIdx] = useState(0)
  const [hero, ...rest] = project.images

  const sections = [
    ...project.facts.map((f) => ({ q: f.label, a: f.value, isFact: true })),
    ...project.stories.map((s) => ({ q: s.title, a: s.body })),
    ...project.stack.map((s) => {
      const note = (project.stackNotes || []).find((n) => n.tech === s)
      return { q: `Why ${s}?`, a: note ? note.reason : `Write it when ready: why ${s} was chosen for this build.` }
    }),
  ]

  return (
    <div>
      {/* ---- metric band ---- */}
      <motion.div
        className="relative rounded-2xl border border-gray-800 bg-surface/80 overflow-hidden mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,122,92,0.08),transparent_60%)] pointer-events-none"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-800/70">
          {project.facts.map((fact, i) => (
            <motion.div
              key={i}
              className="p-6 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1, type: 'spring', stiffness: 180 }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                <CountUp value={fact.value} />
              </div>
              <div className="text-xs text-gray-500 mt-2 tracking-wide">{fact.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ---- hero screenshot ---- */}
      {hero && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <motion.div
            className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60"
            whileHover={{ scale: 1.015, rotateX: 2, rotateY: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ transformPerspective: 1400 }}
          >
            <img src={imgSrc(hero)} alt={hero.caption || project.title} className="w-full h-auto" />
          </motion.div>
          {hero.caption && (
            <motion.p className="text-gray-500 text-sm mt-4 flex items-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <span className="text-accent font-mono text-xs mt-0.5">01</span>
              <span className="italic">{hero.caption}</span>
            </motion.p>
          )}
        </motion.div>
      )}

      {/* ---- two column: images flow left, sticky accordion right ---- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-16">
        {/* images */}
        <div className="md:col-span-7 space-y-16 order-1">
          {rest.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="rounded-xl overflow-hidden border border-white/5 shadow-xl shadow-black/40">
                <img src={imgSrc(img)} alt={img.caption || ''} className="w-full h-auto" loading="lazy" />
              </div>
              {img.caption && (
                <motion.p
                  className="text-gray-500 text-sm mt-3 flex items-start gap-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <span className="text-accent/70 font-mono text-xs mt-0.5 whitespace-nowrap">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <span className="italic">{img.caption}</span>
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>

        {/* sticky accordion */}
        <div className="md:col-span-5 order-2">
          <motion.h4
            className="text-sm font-mono text-gray-500 uppercase tracking-[0.25em] mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Under the hood
          </motion.h4>
          <div className="md:sticky md:top-24 space-y-2">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                className="border border-gray-800 rounded-lg overflow-hidden bg-surface/70"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left text-sm text-gray-200 hover:bg-accent/5 transition-colors"
                >
                  <span>{section.q}</span>
                  <motion.span
                    animate={{ rotate: openIdx === i ? 45 : 0 }}
                    className={`shrink-0 ml-2 ${section.isFact ? 'text-accent font-mono' : 'text-accent'}`}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-4 pb-3 pt-1 text-sm leading-relaxed ${
                        section.isFact
                          ? 'text-accent2 font-mono text-lg'
                          : 'text-gray-500'
                      }`}>
                        {section.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
