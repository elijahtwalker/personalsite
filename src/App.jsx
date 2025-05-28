import { ThemeProvider } from './context/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'
import MouseGlow from './components/MouseGlow'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <ThemeProvider>
      <div className="relative">
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
