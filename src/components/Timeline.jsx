import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import timeline from '../data/timeline.json'

function TimelineItem({ item, i, active, onClick }) {
  const isAbove = i % 2 === 0

  return (
    <motion.div
      className="relative shrink-0 w-56 flex flex-col items-center cursor-pointer group"
      style={{ height: '420px' }}
      onClick={onClick}
      initial={{ opacity: 0, y: isAbove ? 30 : -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: i * 0.06, duration: 0.5 }}
    >
      {/* Connector line */}
      <motion.div
        className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-700 group-hover:bg-accent transition-colors ${
          isAbove ? 'bottom-1/2' : 'top-1/2'
        }`}
        initial={{ height: 0 }}
        whileInView={{ height: '60px' }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.06 + 0.2, duration: 0.4 }}
        style={{
          [isAbove ? 'bottom' : 'top']: '50%',
          marginBottom: isAbove ? 18 : 0,
          marginTop: isAbove ? 0 : 18,
          paddingBottom: 0,
          paddingTop: 0,
        }}
      />

      {/* Dot */}
      <motion.div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
          active ? 'bg-accent border-accent' : 'bg-base border-gray-600 group-hover:border-accent'
        }`}
        style={{ width: 36, height: 36 }}
        whileHover={{ scale: 1.25 }}
        animate={{ scale: active ? 1.15 : 1 }}
      >
        <motion.span
          className={`text-[10px] font-mono ${active ? 'text-white' : 'text-gray-500 group-hover:text-accent'}`}
        >
          {item.year.slice(2)}
        </motion.span>
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/30"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Card — above or below */}
      <motion.div
        className={`absolute left-1/2 -translate-x-1/2 transition-opacity ${isAbove ? 'bottom-1/2' : 'top-1/2'}`}
        style={{
          marginBottom: isAbove ? '72px' : 0,
          marginTop: isAbove ? 0 : '72px',
        }}
        whileHover={{ y: isAbove ? -8 : 8, scale: 1.04 }}
        animate={{
          opacity: active ? 1 : 0.45,
          scale: active ? 1 : 0.92,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`w-48 bg-surface border rounded-xl p-4 transition-colors ${
            active ? 'border-accent' : 'border-gray-800 group-hover:border-accent/50'
          }`}
        >
          <div className={`text-xs font-mono mb-1 ${active ? 'text-accent' : 'text-gray-500'}`}>
            {item.year}
          </div>
          <div className="text-white text-sm font-semibold leading-snug">{item.label}</div>
          <div className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-3">
            {item.detail}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Timeline({ category = 'software' }) {
  const containerRef = useRef(null)
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const items = timeline[category] || timeline.software
  const safeIdx = Math.min(activeIdx, items.length - 1)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const rawProgress = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])
  const lineScale = useSpring(rawProgress, { stiffness: 60, damping: 20 })

  return (
    <section id="timeline" className="py-24 px-6 relative" ref={containerRef}>
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center text-white mb-3 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        My <span className="text-accent">story</span> so far
      </motion.h2>
      <motion.p
        className="text-gray-500 text-center text-sm mb-12 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        Drag sideways, tap a year, see what changed.
      </motion.p>

      {/* Horizontal scroller — center line, alternating up/down cards */}
      <motion.div
        ref={scrollRef}
        className="max-w-5xl mx-auto overflow-x-auto hide-scrollbar pb-4 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div
          className="relative flex px-[calc(50%-112px)]"
          style={{ width: `${items.length * 224 + 224}px` }}
        >
          {/* Horizontal center line */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-surface origin-left"
            style={{ scaleX: lineScale }}
          />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800/50" />

          {items.map((item, i) => (
            <TimelineItem
              key={`${category}-${i}`}
              item={item}
              i={i}
              active={safeIdx === i}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom detail card (animated) */}
      <motion.div
        className="mt-10 max-w-md mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.div
          key={`${category}-${safeIdx}`}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          className="bg-surface rounded-xl p-5 border border-accent/30 shadow-lg shadow-accent/5"
        >
          <div className="text-accent font-mono text-lg mb-1">{items[safeIdx].year}</div>
          <div className="text-white font-semibold">{items[safeIdx].label}</div>
          <div className="text-gray-400 text-sm mt-2">{items[safeIdx].detail}</div>
        </motion.div>
      </motion.div>
    </section>
  )
}
