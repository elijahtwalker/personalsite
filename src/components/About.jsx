import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDark } = useTheme();

  return (
    <section id="about" className={`py-20 px-4 transition-colors duration-300 ${isDark ? 'bg-eerie_black' : 'bg-yinmn_blue'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`max-w-6xl mx-auto rounded-3xl p-8 shadow-xl backdrop-blur-sm transition-colors duration-300
          ${isDark ? 'bg-eerie_black/90' : 'bg-baby_powder/10'}`}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <p className={`text-lg transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Hi there! I'm a passionate software engineer with a love for creating
              elegant solutions to complex problems. I specialize in full-stack
              development and have a keen interest in emerging technologies.
            </p>
            <p className={`text-lg transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              When I'm not coding, you can find me exploring new technologies,
              contributing to open-source projects, or sharing my knowledge with
              the developer community.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src="src/images/headshot.png"
              alt="Profile"
              className="rounded-3xl shadow-lg w-full max-w-md"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 