import { ThemeProvider } from './context/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'
import FloatingBubbles from './components/FloatingBubbles'
import MouseGlow from './components/MouseGlow'
import ThemeToggle from './components/ThemeToggle'
import BubbleCursor from './components/BubbleCursor'

function App() {
  return (
    <ThemeProvider>
      <div className="relative overflow-x-hidden">
        <BubbleCursor />
        <MouseGlow />
        <FloatingBubbles />
        <ThemeToggle />
        <Hero />
        <About />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
