import { motion } from 'framer-motion'
import personal from '../data/personal.json'

function MarqueeRow({ skills, direction, className = '' }) {
  const doubled = [...skills, ...skills]
  return (
    <div className={`overflow-hidden py-2 ${className}`}>
      <div
        className={`mx-auto flex gap-4 w-max ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
      >
        {doubled.map((skill, i) => (
          <motion.span
            key={i}
            className="px-5 py-2 rounded-full border border-accent/25 bg-accent/5 text-sm text-gray-300 whitespace-nowrap select-none hover:bg-accent/20 hover:border-accent/50 transition-colors"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const half = Math.ceil(personal.skills.length / 2)
  const row1 = personal.skills.slice(0, half)
  const row2 = personal.skills.slice(half)

  return (
    <section id="skills" className="py-24 px-6 relative">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Tools I reach for
      </motion.h2>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <MarqueeRow skills={row1} direction="left" />
        <MarqueeRow skills={row2} direction="right" />
      </motion.div>
    </section>
  )
}
