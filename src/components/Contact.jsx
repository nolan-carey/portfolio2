import { motion } from 'framer-motion'
import personal from '../data/personal.json'

const links = []
if (personal.socials.email) {
  links.push({ label: 'Email me', href: `mailto:${personal.socials.email}`, primary: true })
}
if (personal.socials.linkedin) {
  links.push({ label: 'LinkedIn', href: personal.socials.linkedin })
}

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 relative">
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-[rgba(255, 250, 240, 0.04)] blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="max-w-lg mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Say hi anytime<span className="text-accent">.</span>
        </h2>
        <p className="text-gray-300 mb-8">
          Want to talk about a project, an idea, or just have a casual chat about code?
          I'm always up for it.
        </p>
        <div className="flex gap-4 justify-center">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                link.primary
                  ? 'bg-accent text-base hover:bg-accent2'
                  : 'border border-gray-700 text-gray-200 hover:border-accent hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
      <motion.footer
        className="text-center text-gray-500 text-sm mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Made with React, a love for nice things, and an unreasonable amount of coffee.
      </motion.footer>
    </section>
  )
}
