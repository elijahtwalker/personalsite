import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

export default function Hero() {
  const mousePosition = useMouseParallax(10);
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // Hide after 50px of scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className={`relative h-screen overflow-hidden transition-colors duration-300
      ${isDark ? 'bg-eerie_black' : 'bg-yinmn_blue'}`}>
      
      {/* Main content - Name */}
      <div className="absolute bottom-12 left-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1,
              y: 0,
              x: mousePosition.x * 0.05,
              transition: {
                x: {
                  type: "spring",
                  stiffness: 50,
                  damping: 10,
                  mass: 0.1,
                }
              }
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col leading-none"
          >
            <span className={`text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[15rem] font-bold tracking-tighter transition-colors duration-300
              ${isDark ? 'text-mint_green drop-shadow-[0_0_8px_rgba(159,189,143,0.5)]' : 'text-baby_powder'}`}>
              Elijah
            </span>
            <span className={`text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[15rem] font-bold tracking-tighter -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16 transition-colors duration-300
              ${isDark ? 'text-mint_green drop-shadow-[0_0_8px_rgba(159,189,143,0.5)]' : 'text-baby_powder'}`}>
              Walker
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!isScrolled && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1,
            y: 0,
            x: mousePosition.x * 0.3,
          }}
          transition={{ 
            duration: 0.8, 
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-30"
        >
          <Link
            to="about"
            spy={true}
            smooth={true}
            offset={-64}
            duration={500}
            className={`flex flex-col items-center transition-colors duration-300
              ${isDark ? 'text-mint_green drop-shadow-[0_0_4px_rgba(159,189,143,0.6)] hover:text-mint_green/90' : 'text-baby_powder hover:text-baby_powder/80'}`}
          >
            <ChevronDownIcon className="h-6 w-6" />
          </Link>
        </motion.div>
      )}
    </section>
  );
} 
