import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('about');
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const [selectedInvolvement, setSelectedInvolvement] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const [utdHovered, setUtdHovered] = useState(false);
  const utdRef = useRef(null);
  const utdTimeoutRef = useRef(null);

  const handleUtdEnter = () => {
    if (utdTimeoutRef.current) {
      clearTimeout(utdTimeoutRef.current);
      utdTimeoutRef.current = null;
    }
    setUtdHovered(true);
  };

  const handleUtdLeave = () => {
    utdTimeoutRef.current = setTimeout(() => {
      setUtdHovered(false);
    }, 500);
  };

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 300, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);

  const handlePhotoMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handlePhotoMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'involvement', label: 'Involvement' },
    { id: 'interests', label: 'Interests' }
  ];

  const experienceItems = [
    { title: 'Software Engineering Intern', subtitle: 'Goldman Sachs • June 2025 - August 2025', description: '• Marquee Portfolio Analytics Team working with React, Redux, Python, Java, and Vert.X.' },
    { title: 'Software Engineering Intern', subtitle: 'Bell Flight • June 2024 - August 2024', description: '• Innovation Flight Controls Software Team working with Python, DXL, and Azure DevOps.' },
    { title: 'Research Assistant', subtitle: 'CVMC Lab • August 2024 - November 2024', description: '• Stable Diffusion Model Development for Enhanced Audio Synthesis for Video Generation.' },
    { title: 'Peer-Led Team Learning Tutor', subtitle: 'The University of Texas at Dallas • August 2024 - May 2025', description: '• Multivariable and Advanced Calculus Tutoring for 30+ students in a Weekly Team Environment.' },
  ];

  const projectItems = [
    // { title: 'Stilus', subtitle: 'React, TypeScript, Tailwind CSS, Python, Flask, & MongoDB', description: 'Digital wardrobe implementing TryOnDiffusion for outfit suggestions of amalgamated fashionable garments.', github: 'https://github.com/elijahtwalker/stilus' },
    // { title: 'Hover', subtitle: 'React, Python, Flask, & Tello API', description: 'Visualization of multidimensional objects utilizing heuristic flight algorithms on a Tello drone.', github: 'https://github.com/elijahtwalker/hover' },
    { title: 'Aerovista', subtitle: 'Python, PyTorch, OpenCV, Tello API, & NumPy', description: 'Leveraged Mask R-CNN and RTMDet-Ins-s to enhance aerial drone SAR performance using a Tello drone.', github: 'https://github.com/elijahtwalker/aerovista' },
    { title: 'Ingrediate', subtitle: 'React, Python, Flask, MongoDB, Auth0, & Google Cloud API', description: 'Web application for informed recipe recommendations based on ingredients in their digital pantry.', github: 'https://github.com/elijahtwalker/ingrediate' },
    { title: 'Insight Invest', subtitle: 'React, Python, Flask, & Quiver API', description: "Interactive dashboard to analyze congressional respresentatives' investment patterns and news.", github: 'https://github.com/elijahtwalker/insightinvest' },
    { title: 'Scaffold', subtitle: 'C++, Reinforcement Learning, Unreal Engine, & Game Design', description: 'Dogfighting simulation confirming the effectiveness of PPO strategies by monitoring agent interactions.', github: 'https://github.com/ACM-Research/Scaffold' },
  ];

  const involvementItems = [
    {
      title: 'President',
      subtitle: 'ACM @ UTD • Dec 2024 - Present',
      icon: '/images/ACMLogoWhite.png',
      bullets: [
        'Leading the largest computer science organization at UT Dallas with 800+ members, 8 uniquely talented divisions, 2 consecutive international awards, and 190+ officers at the forefront of innovation and intellectual curiosity.'
      ],
      photo: '/images/acmpres.JPG',
    },
    {
      title: 'Vice President of Membership',
      subtitle: 'AKPsi Mu Rho • May 2025 - Dec 2025',
      icon: '/images/akpsi.png',
      bullets: [
        'Led the pledge process of the largest and most premier co-ed business fraternity at UT Dallas with 140+ members. Spearheaded the rush process with 8 events and 300+ participants.'
      ],
      photo: '/images/vpm.JPEG',
    },
    {
      title: 'Director of Research',
      subtitle: 'ACM @ UTD • May - Dec 2024',
      icon: '/images/ResearchWhite.png',
      bullets: [
        'Coached 8 uniquely skilled research team leads while guiding almost 40 program participants through engaging workshops, socials, and research project development sessions.'
      ],
      photo: '/images/research.JPG',
    },
  ];

  const interestItems = [
    { title: 'Pastry Baking', description: 'Drop Cookies, Sweet Breads, & Puff Pastries.' },
    { title: 'Reading', description: 'Murder Mysteries & Personal Development.' },
    { title: 'Dance', description: 'Modern, Hip-Hop, Bachata, & Breaking.' },
    { title: 'Video Editing', description: 'Color Grading, Special Effects, & Storytelling.' },
    { title: 'Game Development', description: 'Interactive Design & Character Animation.' },
    { title: 'Learning Spanish', description: 'Studying Spanish in Literature & Media.' },
    { title: 'Graphite Sketching', description: '2D Pencil Drawings & Contour Drawing.' },
    { title: 'Calisthenics', description: 'Staying Active, Mobile, & Moving in the Gym.' },
  ];

  const ITEMS_PER_PAGE = { experience: 2, projects: 2, involvement: 1, interests: 4 };

  const paginate = (items, perPage) => {
    const result = [];
    for (let i = 0; i < items.length; i += perPage) {
      result.push(items.slice(i, i + perPage));
    }
    return result;
  };

  const getPages = () => {
    const map = { experience: experienceItems, projects: projectItems, involvement: involvementItems, interests: interestItems };
    if (!map[activeTab]) return [[]];
    return paginate(map[activeTab], ITEMS_PER_PAGE[activeTab]);
  };

  const allPages = activeTab === 'about' ? [[]] : getPages();
  const totalPages = activeTab === 'about' ? 1 : allPages.length;
  const currentPageItems = allPages[page] || allPages[0] || [];

  const handleTabChange = (tabId) => {
    setDirection(1);
    setPage(0);
    setSelectedInvolvement(null);
    setActiveTab(tabId);
  };

  const goToPage = (newPage) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(((newPage % totalPages) + totalPages) % totalPages);
  };

  const contentVariants = {
    enter: (dir) => ({ x: dir >= 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir >= 0 ? -40 : 40, opacity: 0 }),
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <motion.div
            key="about"
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex-1 space-y-4">
                <p className={`text-base md:text-xl transition-colors duration-300
                  ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                  Hi, I'm Elijah. I'm a Software Engineer.
                </p>
                <ul className={`space-y-2 text-base md:text-xl transition-colors duration-300
                  ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                  <li className="flex items-start">
                    <span className="mr-2 mt-3 w-2 h-2 rounded-full bg-current flex-shrink-0"></span>
                    <span>Incoming Software Engineering Intern @ Microsoft</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-3 w-2 h-2 rounded-full bg-current flex-shrink-0"></span>
                    <span>
                      Computer Science @{' '}
                      <span
                        ref={utdRef}
                        className="relative inline-block cursor-pointer italic"
                        onMouseEnter={handleUtdEnter}
                        onMouseLeave={handleUtdLeave}
                      >
                        The University of Texas at Dallas
                        <motion.span
                          className={`absolute left-0 bottom-0 h-[1px] w-full border-b border-dashed ${isDark ? 'border-mint_green' : 'border-baby_powder'}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: utdHovered ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          style={{ originX: 0 }}
                        />
                        <AnimatePresence>
                          {utdHovered && (
                            <motion.div
                              onMouseEnter={handleUtdEnter}
                              onMouseLeave={handleUtdLeave}
                              initial={{ opacity: 0, y: 6, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className={`absolute left-0 right-0 mx-auto w-fit top-full mt-2 z-50 flex items-center gap-3 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md transition-colors duration-300
                                ${isDark
                                  ? 'bg-dark-800/90 border border-mint_green/40'
                                  : 'bg-baby_powder/90 border border-yinmn_blue/30'
                                }`}
                            >
                              <a
                                href="https://cs.utdring.com/#elijahwalker.me?nav=prev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm transition-colors duration-300 hover:scale-110 transform ${isDark ? 'text-mint_green hover:text-mint_green/80' : 'text-yinmn_blue hover:text-yinmn_blue/70'}`}
                              >
                                ←
                              </a>
                              <a
                                href="https://cs.utdring.com/#elijahwalker.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-110 transform transition-transform duration-200"
                              >
                                <img
                                  src="https://cs.utdring.com/icon.white.svg"
                                  alt="CS Webring"
                                  className="w-5 h-auto"
                                  style={isDark
                                    ? { filter: 'brightness(0) saturate(100%) invert(38%) sepia(15%) saturate(900%) hue-rotate(62deg) brightness(92%) contrast(85%)' }
                                    : { filter: 'brightness(0) saturate(100%) invert(29%) sepia(25%) saturate(1200%) hue-rotate(173deg) brightness(95%) contrast(90%)' }
                                  }
                                />
                              </a>
                              <a
                                href="https://cs.utdring.com/#elijahwalker.me?nav=next"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm transition-colors duration-300 hover:scale-110 transform ${isDark ? 'text-mint_green hover:text-mint_green/80' : 'text-yinmn_blue hover:text-yinmn_blue/70'}`}
                              >
                                →
                              </a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-3 w-2 h-2 rounded-full bg-current flex-shrink-0"></span>
                    <span>Background in Full-Stack Development & Machine Learning</span>
                  </li>
                </ul>
                <p className={`text-base md:text-xl transition-colors duration-300
                  ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                  Interested in connecting? Say <a href="mailto:hello@elijahwalker.me" className="hover:underline">hello@elijahwalker.me</a>
                </p>
              </div>
              <div className="flex-shrink-0" style={{ perspective: 600 }}>
                <motion.div
                  className="relative"
                  style={{ rotateX, rotateY }}
                  onMouseMove={handlePhotoMouseMove}
                  onMouseLeave={handlePhotoMouseLeave}
                >
                  <img
                    src="..//images/headshot.JPG"
                    alt="Elijah Walker"
                    className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-lg border-4 transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: isDark ? 'rgba(85, 107, 63, 0.5)' : '#355070'
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            key={`experience-${page}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {currentPageItems.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg transition-colors duration-300 min-h-[120px]
                  ${isDark ? 'bg-dark-950 border border-mint_green/60' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                  <h4 className={`font-semibold text-lg transition-colors duration-300 text-left
                    ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm transition-colors duration-300 text-left
                    ${isDark ? 'text-mint_green/90' : 'text-baby_powder opacity-80'}`}>
                    {item.subtitle}
                  </p>
                  <p className={`mt-2 transition-colors duration-300 text-left
                    ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div
            key={`projects-${page}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {currentPageItems.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg transition-colors duration-300 min-h-[120px]
                  ${isDark ? 'bg-dark-950 border border-mint_green/60' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold text-lg transition-colors duration-300
                      ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                      {item.title}
                    </h4>
                    {item.github && (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-colors duration-300 hover:scale-110 transform ${isDark ? 'text-mint_green/70 hover:text-mint_green' : 'text-baby_powder/70 hover:text-baby_powder'}`}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className={`text-sm transition-colors duration-300
                    ${isDark ? 'text-mint_green/90' : 'text-baby_powder opacity-80'}`}>
                    {item.subtitle}
                  </p>
                  <p className={`mt-2 transition-colors duration-300
                    ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'involvement':
        return (
          <motion.div
            key="involvement"
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <div className="relative flex items-center justify-center h-full min-h-[200px]">
              <AnimatePresence mode="wait">
                {selectedInvolvement === null ? (
                  <motion.div
                    key="bubbles"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-end justify-center gap-4 md:gap-12 w-full px-2 -mt-6"
                  >
                    {involvementItems.map((item, i) => {
                      const offsets = [12, -16, 6];
                      const amplitudes = [-10, -6, -12];
                      return (
                        <motion.button
                          key={i}
                          onClick={() => setSelectedInvolvement(i)}
                          style={{ marginBottom: offsets[i] }}
                          animate={{ y: [0, amplitudes[i], 0] }}
                          transition={{
                            duration: 2.5 + i * 0.3,
                            delay: i * 0.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center text-center p-2 md:p-3 cursor-pointer backdrop-blur-sm transition-colors duration-300
                            ${isDark
                              ? 'bg-mint_green/15 border border-mint_green/50 hover:bg-mint_green/25'
                              : 'bg-baby_powder/20 border border-baby_powder/40 hover:bg-baby_powder/30'
                            }`}
                        >
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt={item.title}
                              className={`object-contain pointer-events-none transition-all duration-300 ${item.title === 'VP of Membership' ? 'w-12 h-12 md:w-24 md:h-24' : 'w-9 h-9 md:w-16 md:h-16'}`}
                              style={isDark
                                ? { filter: 'brightness(0) saturate(100%) invert(38%) sepia(15%) saturate(900%) hue-rotate(62deg) brightness(92%) contrast(85%)' }
                                : {}
                              }
                            />
                          ) : (
                            <>
                              <span className={`text-sm md:text-base font-bold leading-tight transition-colors duration-300 pointer-events-none
                                ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                                {item.title}
                              </span>
                              <span className={`text-xs md:text-sm mt-1 leading-tight opacity-70 transition-colors duration-300 pointer-events-none
                                ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                                {item.subtitle.split('•')[0].trim()}
                              </span>
                            </>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`detail-${selectedInvolvement}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full overflow-y-auto md:overflow-visible"
                  >
                    {/* Mobile: bubble left of text, photo below */}
                    <div className="flex flex-col gap-3 md:hidden">
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => setSelectedInvolvement(null)}
                          initial={{ x: -10, scale: 0.8 }}
                          animate={{ x: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center p-2 flex-shrink-0 cursor-pointer backdrop-blur-sm transition-colors duration-300
                            ${isDark
                              ? 'bg-mint_green/20 border-2 border-mint_green/60'
                              : 'bg-baby_powder/25 border-2 border-baby_powder/50'
                            }`}
                        >
                          {involvementItems[selectedInvolvement].icon ? (
                            <img
                              src={involvementItems[selectedInvolvement].icon}
                              alt={involvementItems[selectedInvolvement].title}
                              className={`object-contain pointer-events-none transition-all duration-300 ${involvementItems[selectedInvolvement].title === 'VP of Membership' ? 'w-10 h-10' : 'w-7 h-7'}`}
                              style={isDark
                                ? { filter: 'brightness(0) saturate(100%) invert(38%) sepia(15%) saturate(900%) hue-rotate(62deg) brightness(92%) contrast(85%)' }
                                : {}
                              }
                            />
                          ) : (
                            <span className={`text-xs font-bold leading-tight transition-colors duration-300 pointer-events-none
                              ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                              {involvementItems[selectedInvolvement].title}
                            </span>
                          )}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold mb-0.5 transition-colors duration-300
                            ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].title}
                          </h4>
                          <p className={`text-xs mb-1 opacity-80 transition-colors duration-300
                            ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].subtitle}
                          </p>
                          <p className={`text-xs leading-relaxed transition-colors duration-300
                            ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].bullets[0]}
                          </p>
                        </div>
                      </div>

                      <motion.img
                        src={involvementItems[selectedInvolvement].photo}
                        alt={involvementItems[selectedInvolvement].title}
                        onClick={() => setLightboxPhoto(involvementItems[selectedInvolvement].photo)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        className={`w-full aspect-[3/2] rounded-lg object-cover border cursor-pointer transition-colors duration-300
                          ${isDark ? 'border-mint_green/40' : 'border-baby_powder/30'}`}
                      />
                    </div>

                    {/* Desktop: horizontal layout */}
                    <div className="hidden md:flex items-center gap-6 w-full">
                      <motion.button
                        onClick={() => setSelectedInvolvement(null)}
                        initial={{ x: 40, scale: 0.8 }}
                        animate={{ x: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-center p-2 flex-shrink-0 cursor-pointer backdrop-blur-sm transition-colors duration-300 ml-2
                          ${isDark
                            ? 'bg-mint_green/20 border-2 border-mint_green/60 hover:bg-mint_green/30'
                            : 'bg-baby_powder/25 border-2 border-baby_powder/50 hover:bg-baby_powder/35'
                          }`}
                      >
                        {involvementItems[selectedInvolvement].icon ? (
                          <img
                            src={involvementItems[selectedInvolvement].icon}
                            alt={involvementItems[selectedInvolvement].title}
                            className={`object-contain pointer-events-none transition-all duration-300 ${involvementItems[selectedInvolvement].title === 'VP of Membership' ? 'w-20 h-20' : 'w-14 h-14'}`}
                            style={isDark
                              ? { filter: 'brightness(0) saturate(100%) invert(38%) sepia(15%) saturate(900%) hue-rotate(62deg) brightness(92%) contrast(85%)' }
                              : {}
                            }
                          />
                        ) : (
                          <span className={`text-base font-bold leading-tight transition-colors duration-300 pointer-events-none
                            ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].title}
                          </span>
                        )}
                      </motion.button>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                        className="flex-1 min-w-0 flex items-center gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-lg font-bold mb-0.5 transition-colors duration-300
                            ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].title}
                          </h4>
                          <p className={`text-sm mb-1.5 opacity-80 transition-colors duration-300
                            ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].subtitle}
                          </p>
                          <p className={`text-base leading-relaxed transition-colors duration-300
                            ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                            {involvementItems[selectedInvolvement].bullets[0]}
                          </p>
                        </div>
                        <motion.img
                          src={involvementItems[selectedInvolvement].photo}
                          alt={involvementItems[selectedInvolvement].title}
                          onClick={() => setLightboxPhoto(involvementItems[selectedInvolvement].photo)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                          whileHover={{ scale: 1.03 }}
                          className={`w-72 aspect-[3/2] rounded-lg object-cover border flex-shrink-0 cursor-pointer transition-colors duration-300
                            ${isDark ? 'border-mint_green/40' : 'border-baby_powder/30'}`}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 'interests':
        return (
          <motion.div
            key={`interests-${page}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              {currentPageItems.map((item, i) => (
                <div key={i} className={`p-4 rounded-lg transition-colors duration-300 min-h-[120px] flex flex-col justify-center
                  ${isDark ? 'bg-dark-950 border border-mint_green/60' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                  <h4 className={`font-semibold text-lg transition-colors duration-300
                    ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                    {item.title}
                  </h4>
                  <div className={`w-12 h-[1px] my-2 ${isDark ? 'bg-mint_green/40' : 'bg-baby_powder/40'}`} />
                  <p className={`transition-colors duration-300
                    ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="about" className={`relative py-20 px-4 overflow-hidden transition-colors duration-300 ${isDark ? 'bg-eerie_black' : 'bg-yinmn_blue'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`max-w-6xl mx-auto rounded-3xl px-8 py-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 relative z-10 flex flex-col h-auto md:h-[350px]
          ${isDark
            ? 'bg-gradient-to-br from-dark-800/40 via-dark-900/30 to-dark-800/40 border border-mint_green/20 shadow-[0_8px_32px_0_rgba(85,107,63,0.1)]'
            : 'bg-gradient-to-br from-baby_powder/30 via-baby_powder/20 to-baby_powder/20 border border-yinmn_blue/20 shadow-[0_8px_32px_0_rgba(48,87,122,0.15)]'
          }`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: isDark
            ? '0 8px 32px 0 rgba(85, 107, 63, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            : '0 8px 32px 0 rgba(48, 87, 122, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 relative z-10 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative overflow-hidden px-5 py-1.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
                ${activeTab === tab.id
                  ? isDark
                    ? 'text-eerie_black shadow-lg border border-transparent'
                    : 'text-yinmn_blue shadow-lg border border-transparent'
                  : isDark
                    ? 'text-mint_green hover:bg-mint_green/20 border border-mint_green/60'
                    : 'text-baby_powder hover:bg-baby_powder/20 border border-baby_powder/30'
                }`}
            >
              {activeTab === tab.id && (
                <motion.span
                  className={`absolute inset-0 rounded-lg ${isDark ? 'bg-mint_green' : 'bg-baby_powder'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl mx-auto w-full relative z-10 flex flex-col min-h-0">
          {/* Static section header */}
          {activeTab === 'experience' && (
            <div className="flex items-baseline justify-between gap-4 mb-3 flex-shrink-0">
              <h3 className={`text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                Work Experience
              </h3>
              <a
                href="/Resumé_Elijah_Walker.pdf"
                alt="alt text"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-[1.02]
                  ${isDark
                    ? 'bg-dark-950 border border-mint_green/60 text-mint_green hover:bg-dark-900'
                    : 'bg-baby_powder/20 border border-yinmn_blue/30 text-baby_powder hover:bg-baby_powder/30'
                  }`}
              >
                Résumé
              </a>
            </div>
          )}
          {activeTab === 'projects' && (
            <h3 className={`text-2xl font-bold mb-3 flex-shrink-0 transition-colors duration-300
              ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
              Technical Projects
            </h3>
          )}
          {activeTab === 'involvement' && (
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 className={`text-2xl font-bold transition-colors duration-300
                ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                Campus Involvement
              </h3>
              <AnimatePresence>
                {selectedInvolvement !== null && (
                  <motion.button
                    onClick={() => setSelectedInvolvement(null)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300
                      ${isDark
                        ? 'text-mint_green/70 hover:text-mint_green hover:bg-mint_green/10'
                        : 'text-baby_powder/70 hover:text-baby_powder hover:bg-baby_powder/10'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
          {activeTab === 'interests' && (
            <h3 className={`text-2xl font-bold mb-3 flex-shrink-0 transition-colors duration-300
              ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
              Personal Interests
            </h3>
          )}

          <div key={activeTab} className="flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              {renderContent()}
            </AnimatePresence>
          </div>

          {/* Carousel Navigation */}
          {totalPages > 1 && activeTab !== 'involvement' && (
            <div className="flex items-center justify-center gap-3 pt-3 flex-shrink-0">
              <button
                onClick={() => goToPage(page - 1)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                  ${isDark
                    ? 'text-mint_green border border-mint_green/40 hover:bg-mint_green/10'
                    : 'text-baby_powder border border-baby_powder/40 hover:bg-baby_powder/10'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300
                      ${i === page
                        ? isDark ? 'bg-mint_green scale-125' : 'bg-baby_powder scale-125'
                        : isDark ? 'bg-mint_green/30 hover:bg-mint_green/50' : 'bg-baby_powder/30 hover:bg-baby_powder/50'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                  ${isDark
                    ? 'text-mint_green border border-mint_green/40 hover:bg-mint_green/10'
                    : 'text-baby_powder border border-baby_powder/40 hover:bg-baby_powder/10'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.img
              src={lightboxPhoto}
              alt="Enlarged view"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain shadow-2xl cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
