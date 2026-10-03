import Hero from '../sections/Hero'
import About from '../sections/About'
import Experience from '../sections/Experience'
import Work from '../sections/Work'
import Skills from '../sections/Skills'
import Credentials from '../sections/Credentials'
import Contact from '../sections/Contact'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'
import { marquee } from '../data/skills'
import { useMeta } from '../hooks/useMeta'

export default function Home() {
  useMeta({
    description:
      'Kaif Ahmed Sherdi — Full Stack Developer (React.js, Laravel) with 2+ years building e-commerce, SaaS, HRMS and fintech web applications.',
  })
  return (
    <>
      <Hero />
      <div className="relative z-10 -rotate-2 scale-105">
        <Marquee items={marquee} accent speed={34} />
      </div>
      <About />
      <Experience />
      <div className="relative z-10 rotate-1 scale-105">
        <Marquee items={['E-commerce', 'SaaS', 'HRMS', 'Trading', 'Real estate', 'Fintech', 'Dashboards', 'APIs']} reverse speed={42} />
      </div>
      <Work />
      <Skills />
      <Credentials />
      <Contact />
      <Footer />
    </>
  )
}
