import { motion } from 'framer-motion'
import personal from '../data/personal.json'

const categories = [
  { id: 'software', label: 'Software Development', icon: '⌨️', enabled: true },
  { id: 'printing', label: '3D Printing', icon: '🖨️', enabled: false },
  { id: 'pcb', label: 'PCB Development', icon: '🔌', enabled: false },
  { id: 'aiml', label: 'AI / ML', icon: '🧠', enabled: false },
]

export default function Navbar({ category, onSelect }) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-base/75 backdrop-blur-md border-b border-gray-800/50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative flex items-center justify-center px-6 py-3">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar text-sm">
          {categories.map((cat) =>
            cat.enabled ? (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`relative px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  category === cat.id ? 'text-white' : 'text-gray-300 hover:text-accent'
                }`}
              >
                {category === cat.id && (
                  <motion.span
                    className="absolute inset-0 bg-accent/15 rounded-lg border border-accent/30"
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{cat.icon}</span>
                <span className="relative z-10">{cat.label}</span>
              </button>
            ) : (
              <span
                key={cat.id}
                className="px-3 py-2 rounded-lg whitespace-nowrap text-gray-600 cursor-not-allowed select-none flex items-center gap-1.5 text-sm"
              >
                <span className="text-[13px]">{cat.icon}</span>
                {cat.label}
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">
                  soon
                </span>
              </span>
            )
          )}
        </div>

        <motion.a
          href={personal.socials.email ? `mailto:${personal.socials.email}` : personal.socials.linkedin}
          className="absolute right-6 text-gray-300 hover:text-accent text-sm px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          Say hi ↗
        </motion.a>
      </div>
    </motion.nav>
  )
}
