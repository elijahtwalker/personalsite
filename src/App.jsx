import { ThemeProvider } from './context/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'
import MouseGlow from './components/MouseGlow'
import ThemeToggle from './components/ThemeToggle'
import BubbleCursor from './components/BubbleCursor'
import VantaFog from './components/VantaFog'

function App() {
  return (
    <ThemeProvider>
      <div className="relative overflow-x-hidden">
        <VantaFog />
        <BubbleCursor />
        <MouseGlow />
        <ThemeToggle />
        <Hero />
        <About />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
