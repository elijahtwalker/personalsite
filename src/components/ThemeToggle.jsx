import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-2 rounded-full bg-baby_powder/10 backdrop-blur-sm
        hover:bg-baby_powder/20 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <MoonIcon className="w-6 h-6 text-hunter_green" />
        ) : (
          <SunIcon className="w-6 h-6 text-baby_powder" />
        )}
      </motion.div>
    </motion.button>
  );
} 