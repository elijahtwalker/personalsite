import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useTheme } from '../context/ThemeContext';
import { useMemo } from 'react';

export default function Hero() {
  const mousePosition = useMouseParallax(10);
  const { isDark } = useTheme();

  // Create bubbles with static positions using useMemo
  const bubbles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * (200 - 50) + 50,
    delay: i * 0.4, // Increased delay for slower, more spaced out initial appearance
    duration: Math.random() * (15 - 10) + 10, // Much slower, more consistent duration
    startX: window.innerWidth - Math.random() * 400,
    startY: window.innerHeight + Math.random() * 400,
    endX: Math.random() * 300,
    endY: -200,
    opacity: Math.random() * (0.2 - 0.03) + 0.03,
  })), []);

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
            <span className={`text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[15rem] font-bold tracking-tighter transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Elijah
            </span>
            <span className={`text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[15rem] font-bold tracking-tighter -mt-8 sm:-mt-12 md:-mt-14 lg:-mt-16 transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Walker
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating bubbles - now in front */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className={`absolute rounded-full transition-colors duration-300 backdrop-blur-sm
              ${isDark ? 'bg-hunter_green' : 'bg-baby_powder'}`}
            style={{
              width: bubble.size,
              height: bubble.size,
              left: bubble.startX,
              top: bubble.startY,
            }}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: bubble.opacity,
              scale: 1,
              x: [
                0,
                -(bubble.startX - bubble.endX) * 0.2,
                -(bubble.startX - bubble.endX) * 0.4,
                -(bubble.startX - bubble.endX) * 0.7,
                -(bubble.startX - bubble.endX)
              ],
              y: [
                0,
                -(bubble.startY - bubble.endY) * 0.4,
                -(bubble.startY - bubble.endY) * 0.6,
                -(bubble.startY - bubble.endY) * 0.9,
                -(bubble.startY - bubble.endY)
              ]
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
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
            ${isDark ? 'text-hunter_green hover:text-hunter_green/80' : 'text-baby_powder hover:text-baby_powder/80'}`}
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDownIcon className="h-6 w-6" />
        </Link>
      </motion.div>
    </section>
  );
} 