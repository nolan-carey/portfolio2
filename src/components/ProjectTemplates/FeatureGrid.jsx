import { motion } from 'framer-motion'

export default function FeatureGrid({ project }) {
  const tiles = [
    ...project.features,
    ...project.facts.map((f) => `${f.label}: ${f.value}`),
    ...project.stories.map((s) => `${s.title} — ${s.body}`),
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            className="bg-gray-800/60 rounded-lg p-4 text-sm text-gray-300 hover:bg-accent/10 hover:text-white transition-colors cursor-default min-h-[80px] flex items-start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.04 }}
          >
            <span>
              <span className="text-accent font-mono text-xs block mb-1">0{i + 1}</span>
              {tile.length > 120 ? `${tile.substring(0, 120)}...` : tile}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
