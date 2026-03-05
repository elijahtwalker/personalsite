import { motion } from 'framer-motion';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useTheme } from '../context/ThemeContext';

export default function Hero() {
  const mousePosition = useMouseParallax(10);
  const { isDark } = useTheme();

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
            <span className={`text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[15rem] font-bold tracking-tighter transition-colors duration-300
              ${isDark ? 'text-mint_green drop-shadow-[0_0_8px_rgba(85,107,63,0.5)]' : 'text-baby_powder'}`}>
              Elijah
            </span>
            <span className={`text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[15rem] font-bold tracking-tighter -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16 transition-colors duration-300
              ${isDark ? 'text-mint_green drop-shadow-[0_0_8px_rgba(85,107,63,0.5)]' : 'text-baby_powder'}`}>
              Walker
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 
