import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import personal from '../data/personal.json'

// Simple typewriter hook
function useTypewriter(text, speed = 40, startDelay = 800) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    let i = 0
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setTyped(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
        i += 1
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(start)
      if (interval) clearInterval(interval)
    }
  }, [text, speed, startDelay])
  return typed
}

const particles = [
  { size: 4, top: '15%', left: '8%', dur: 7 },
  { size: 6, top: '30%', left: '85%', dur: 9 },
  { size: 3, top: '70%', left: '12%', dur: 8 },
  { size: 5, top: '55%', left: '75%', dur: 10 },
  { size: 4, top: '82%', left: '50%', dur: 7 },
  { size: 3, top: '40%', left: '40%', dur: 11 },
  { size: 5, top: '10%', left: '65%', dur: 9 },
  { size: 4, top: '88%', left: '28%', dur: 8 },
]

const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
}

export default function Hero({ category = 'software' }) {
  const typedTagline = useTypewriter(personal.tagline, 35, 900)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Background gradient blob */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-[rgba(255, 250, 240, 0.05)] blur-[100px] top-1/4 left-1/4"
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 25, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-[rgba(255, 250, 240, 0.04)] blur-[80px] bottom-1/4 right-1/4"
        animate={{ x: [0, -40, 30, 0], y: [0, 40, -25, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[rgba(255, 250, 240, 0.5)] pointer-events-none"
          style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
          animate={{ y: [0, -22, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Rotating border square */}
      <motion.div
        className="absolute w-32 h-32 border border-accent/10 rounded-2xl top-1/3 right-1/3"
        animate={{ rotate: [0, 90] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-20 h-20 border border-accent2/10 rounded-xl bottom-1/3 left-1/4"
        animate={{ rotate: [90, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-xs font-mono text-accent mb-6"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {({
            software: 'Software Development',
            data: 'Data Engineering',
            printing: '3D Printing',
            pcb: 'PCB Development',
            aiml: 'AI / ML',
          }[category] || 'Software Development')}
        </motion.div>

        <motion.div
          className="relative mb-4"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          {/* natural flashlight pool behind the name */}
          <motion.div
            className="absolute -inset-x-[416px] -inset-y-[312px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 62% 58% at 50% 50%, rgba(255, 252, 245, 0.08), rgba(255, 252, 245, 0.03) 55%, transparent 80%)',
              filter: 'blur(18px)',
            }}
            variants={{
              flicker: {
                opacity: [1, 0.72, 0.95, 0.5, 1, 0.78, 0.9, 0.55, 1, 0.85, 1],
                transition: { duration: 5.6, repeat: Infinity, ease: 'linear' },
              },
            }}
            initial="flicker"
            animate="flicker"
          />
          <motion.h1 className="relative text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-accent via-accent2 to-accent bg-clip-text text-transparent bg-[length:200%_auto]">
              {personal.name}
            </span>
          </motion.h1>
        </motion.div>

        <motion.h2
          className="text-xl md:text-2xl text-accent mb-5"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          {personal.title}
        </motion.h2>

        <motion.div
          className="text-lg text-gray-400 mb-10 h-7"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          {typedTagline}
          <motion.span
            className="inline-block w-0.5 h-5 bg-accent ml-0.5 align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          className="flex gap-4 justify-center"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <motion.a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-accent text-white font-medium relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 transition-colors group-hover:text-base">See my work</span>
            <motion.span
              className="absolute inset-0 bg-accent2"
              initial={{ scaleX: 0, originX: 0 }}
              whileHover={{ scaleX: 1 }}
            />
          </motion.a>
          <motion.a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300"
            whileHover={{ scale: 1.05, borderColor: '#6c5ce7' }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  )
}
