import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function mediaList(project) {
  const slides = []
  project.images.forEach((img) => {
    slides.push({
      type: 'image',
      src: typeof img === 'string' ? img : img.src,
      caption: typeof img === 'string' ? '' : img.caption,
    })
  })
  ;(project.videos || []).forEach((vid) => {
    slides.push({
      type: 'video',
      src: typeof vid === 'string' ? vid : vid.src,
      caption: typeof vid === 'string' ? '' : vid.caption,
      label: typeof vid === 'string' ? '' : vid.label,
    })
  })
  return slides
}

export default function GalleryCarousel({ project }) {
  const slides = mediaList(project)
  const [idx, setIdx] = useState(0)
  const current = slides[idx % slides.length]

  const next = () => setIdx((idx + 1) % slides.length)
  const prev = () => setIdx((idx - 1 + slides.length) % slides.length)

  return (
    <div>
      {/* status badge */}
      {project.status && (
        <motion.div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300 font-mono uppercase tracking-wider"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-amber-300"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          {project.status}
        </motion.div>
      )}

      {/* carousel */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gray-800/40 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {current.type === 'video' ? (
              <video
                src={current.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full max-h-[500px] object-contain mx-auto block"
              />
            ) : (
              <img src={current.src} alt={current.caption || project.title} className="w-full max-h-[500px] object-contain mx-auto block" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* slide type tag */}
        {current.type === 'video' && current.label && (
          <motion.div
            className="absolute top-3 left-3 px-2.5 py-1 rounded bg-base/80 backdrop-blur text-[10px] font-mono text-accent2 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {current.label}
          </motion.div>
        )}

        {/* arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-base/85 hover:bg-accent flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-base/85 hover:bg-accent flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>

        {/* dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i) }}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-accent' : 'w-1.5 bg-gray-600 hover:bg-gray-500'}`}
            />
          ))}
        </div>
      </div>

      {/* caption under slide */}
      <motion.div
        className="text-gray-500 text-sm italic mt-3 pl-4 border-l-2 border-accent/30"
        key={`cap-${idx}`}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {current.caption || `Slide ${idx + 1} of ${slides.length}`}
      </motion.div>

      {/* facts row */}
      <div className="grid grid-cols-3 gap-3 mt-8">
        {project.facts.map((fact, i) => (
          <motion.div
            key={i}
            className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-800"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <div className="text-lg font-bold text-accent2">{fact.value}</div>
            <div className="text-xs text-gray-500 mt-1">{fact.label}</div>
          </motion.div>
        ))}
      </div>

      {/* story */}
      {project.stories.map((story, i) => (
        <motion.div
          key={i}
          className="bg-surface/70 border border-gray-800 rounded-xl p-5 mt-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        >
          <div className="text-white font-medium text-sm mb-1">{story.title}</div>
          <div className="text-gray-400 text-sm leading-relaxed">{story.body}</div>
        </motion.div>
      ))}
    </div>
  )
}
