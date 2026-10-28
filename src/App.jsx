import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Preloader from './components/Preloader'
import BackgroundCanvas from './components/BackgroundCanvas'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [category, setCategory] = useState('software')

  return (
    <div className="relative min-h-screen bg-base overflow-x-hidden">
      <BackgroundCanvas mode={category} />
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <>
          <Navbar category={category} onSelect={setCategory} />
          <Hero category={category} />
          <Projects category={category} />
          {/* Timeline paused for now */}
          <Skills category={category} />
          <Contact />
        </>
      )}
    </div>
  )
}
