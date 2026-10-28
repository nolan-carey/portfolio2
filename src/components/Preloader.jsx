import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import personal from '../data/personal.json'

const nameLetters = personal.name.split('')

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => Math.min(c + Math.floor(Math.random() * 8) + 3, 100))
    }, 80)
    const done = setTimeout(onComplete, 2200)
    return () => {
      clearInterval(interval)
      clearTimeout(done)
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      {/* Name letters stagger */}
      <div className="flex text-4xl md:text-6xl font-bold text-white mb-8 overflow-hidden">
        {nameLetters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 18 }}
            className={char === ' ' ? 'w-4' : ''}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="text-sm font-mono text-accent mb-3 tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {personal.title}
      </motion.div>

      {/* Progress bar + counter */}
      <div className="w-64 h-0.5 bg-surface rounded overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>
      <motion.div
        className="text-xs font-mono text-gray-500 mt-3 tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {count}%
      </motion.div>
    </motion.div>
  )
}
