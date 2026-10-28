import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

function imgSrc(img) {
  return typeof img === 'string' ? img : img.src
}

function CountUp({ value }) {
  const str = String(value)
  const m = str.match(/^([+\-]?)([\d,.+]+)(.*)$/)
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

export default function CaseStudy({ project }) {
  const [hero, ...rest] = project.images
  const facts = project.facts || []
  const features = project.features || []
  const stories = project.stories || []

  return (
    <div>
      {/* ---- metric band ---- */}
      {facts.length > 0 && (
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
            {facts.map((fact, i) => (
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
      )}

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

      {/* ---- step flow strip (features) ---- */}
      {features.length > 0 && (
        <>
          <motion.div
            className="h-px max-w-xs mx-auto my-14 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
          <motion.h4
            className="text-sm font-mono text-gray-500 uppercase tracking-[0.25em] mb-6 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h4>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x-mandatory">
            {features.map((step, i) => (
              <motion.div
                key={i}
                className="shrink-0 w-40 snap-start-always bg-surface/70 border border-gray-800 rounded-xl p-4 group hover:border-accent/40 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-mono text-sm mb-3 group-hover:bg-accent group-hover:text-base transition-colors">
                  {i + 1}
                </div>
                <div className="text-gray-200 text-sm leading-snug">{step}</div>
              </motion.div>
            ))}
          </div>
          {/* connector line under the strip */}
          <motion.div
            className="h-px bg-gradient-to-r from-accent/40 via-accent/20 to-transparent mt-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          />
        </>
      )}

      {/* ---- alternating editorial rows ---- */}
      {rest.length > 0 && (
        <div className="space-y-16 mt-16">
          {rest.map((img, i) => (
            <motion.div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <motion.div className="md:col-span-8 [direction:ltr]" whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 250 }}>
                <div className="rounded-xl overflow-hidden border border-white/5 shadow-xl shadow-black/40">
                  <img src={imgSrc(img)} alt={img.caption || ''} className="w-full h-auto" loading="lazy" />
                </div>
              </motion.div>
              <div className="md:col-span-4 [direction:ltr]">
                <motion.div
                  className={`flex items-start gap-3 ${i % 2 === 1 ? 'md:flex-row-reverse md:text-right' : ''}`}
                  initial={{ opacity: 0, x: i % 2 === 1 ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
                >
                  <span className="text-accent/70 font-mono text-xs mt-1 whitespace-nowrap">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <p className="text-gray-400 text-sm leading-relaxed italic">{img.caption}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ---- stories ---- */}
      {stories.length > 0 && (
        <>
          <motion.div
            className="h-px max-w-xs mx-auto my-14 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={i}
                className="relative bg-surface/70 border border-gray-800 rounded-2xl p-8 overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -6, borderColor: 'rgba(255, 122, 92, 0.35)' }}
              >
                <motion.div
                  className="absolute -top-4 left-3 text-[110px] font-serif text-accent/10 leading-none select-none pointer-events-none"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 5 + i, repeat: Infinity }}
                >
                  "
                </motion.div>
                <div className="relative z-10">
                  <div className="text-accent/80 font-mono text-[10px] uppercase tracking-[0.25em] mb-3">
                    {i === 0 ? 'The story' : 'The lesson'}
                  </div>
                  <div className="text-white font-semibold text-lg mb-3">{story.title}</div>
                  <div className="text-gray-400 text-sm leading-relaxed">{story.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
