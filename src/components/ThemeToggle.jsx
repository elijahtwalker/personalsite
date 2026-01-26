import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-sm shadow-lg
        transition-colors duration-300
        ${isDark ? 'bg-mint_green/20 hover:bg-mint_green/30 border border-mint_green/40' : 'bg-baby_powder/10 hover:bg-baby_powder/20'}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <MoonIcon className="w-6 h-6 text-mint_green drop-shadow-[0_0_4px_rgba(159,189,143,0.5)]" />
        ) : (
          <SunIcon className="w-6 h-6 text-baby_powder" />
        )}
      </motion.div>
    </motion.button>
  );
} 