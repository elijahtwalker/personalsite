import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'
import MouseGlow from './components/MouseGlow'
import ThemeToggle from './components/ThemeToggle'
import BubbleCursor from './components/BubbleCursor'
import VantaFog from './components/VantaFog'
import Views from './pages/Views'

function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <VantaFog />
      <BubbleCursor />
      <MouseGlow />
      <ThemeToggle />
      <Hero />
      <About />
      <Footer />
    </div>
  )
}

// ThemeProvider sits above the router so the light/dark choice carries between pages.
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/views" element={<Views />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
