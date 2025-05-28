import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MouseGlow from './components/MouseGlow';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen w-screen overflow-x-hidden transition-colors duration-300
      ${isDark ? 'bg-black text-hunter_green' : 'bg-yinmn_blue text-baby_powder'}`}>
      <div className={`fixed inset-0 -z-10 transition-colors duration-300
        ${isDark ? 'bg-black' : 'bg-yinmn_blue'}`} />
      <ThemeToggle />
      <MouseGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
