import { useState, useRef } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

const navItems = [
  { name: 'Home', to: 'home', icon: '🏠' },
  { name: 'About', to: 'about', icon: '👤' },
  { name: 'Projects', to: 'projects', icon: '💻' },
  { name: 'Resume', to: 'resume', icon: '📄' },
  { name: 'Contact', to: 'contact', icon: '✉️' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragConstraints();
  const constraintsRef = useRef(null);

  // Custom hook to handle drag constraints
  function useDragConstraints() {
    const [dragConstraints, setDragConstraints] = useState({ top: 0, bottom: 0 });

    // Update constraints on mount and window resize
    useState(() => {
      const updateConstraints = () => {
        const windowHeight = window.innerHeight;
        setDragConstraints({
          top: -windowHeight + 200,
          bottom: windowHeight - 200
        });
      };

      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }, []);

    return dragConstraints;
  }

  return (
    <>
      {/* Container for drag constraints */}
      <div ref={constraintsRef} className="fixed inset-y-0 right-0 pointer-events-none">
        {/* Draggable navigation container */}
        <motion.div
          drag="y"
          dragConstraints={dragControls}
          dragElastic={0.1}
          dragMomentum={false}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="relative pointer-events-auto">
            {/* Toggle Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                w-14 h-20 rounded-[30px] bg-dark-800 text-dark-50 
                flex items-center justify-center shadow-lg
                hover:bg-dark-700 transition-colors
                relative z-10
              `}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl"
              >
                {isOpen ? '✕' : '☰'}
              </motion.div>
            </motion.button>

            {/* Navigation Semicircle */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: '-5px' }}
                >
                  {navItems.map((item, i) => {
                    // Calculate positions in a semicircle (180 degrees)
                    const angle = (i * (180 / (navItems.length - 1)) - 90) * (Math.PI / 180) + Math.PI;
                    const radius = 100;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius - radius/4;

                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{ 
                          opacity: 1,
                          x: x,
                          y: y,
                          transition: { 
                            delay: i * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }
                        }}
                        exit={{ 
                          opacity: 0,
                          x: 0,
                          y: 0,
                          transition: { 
                            duration: 0.2,
                            delay: (navItems.length - i - 1) * 0.05
                          }
                        }}
                        className="absolute"
                        style={{ transformOrigin: 'center' }}
                      >
                        <Link
                          to={item.to}
                          spy={true}
                          smooth={true}
                          offset={-64}
                          duration={500}
                          onClick={() => setIsOpen(false)}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-full bg-dark-800 text-dark-50 
                              flex items-center justify-center cursor-pointer
                              hover:bg-dark-700 hover:text-amber-400 transition-colors
                              relative group shadow-lg"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="text-lg" role="img" aria-label={item.name}>
                              {item.icon}
                            </span>
                            
                            {/* Tooltip */}
                            <div className="absolute right-full mr-2 px-2 py-1 bg-dark-800 
                              rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 
                              transition-opacity shadow-lg">
                              {item.name}
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Background Overlay when nav is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-dark-950/5"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
    </>
  );
} 