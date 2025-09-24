import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'involvement', label: 'Involvement' },
    { id: 'interests', label: 'Interests' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Text Content */}
              <div className="flex-1 space-y-4">
                <p className={`text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Hi, I'm Elijah. I'm a Software Engineer.
                </p>
                <ul className={`space-y-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  <li className="flex items-start">
                    <span className="mr-2 mt-2 w-2 h-2 rounded-full bg-current flex-shrink-0"></span>
                    <span>Former Software Engineering Summer Analyst @ Goldman Sachs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-2 w-2 h-2 rounded-full bg-current flex-shrink-0"></span>
                    <span>Computer Science @ University of Texas at Dallas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-2 w-2 h-2 rounded-full bg-current flex-shrink-0"></span>
                    <span>Background in Full-Stack Development & Machine Learning</span>
                  </li>
                </ul>
                <p className={`text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Interested in connecting? Say <a href="mailto:hello@elijahwalker.me" className="hover:underline">hello@elijahwalker.me</a>
                </p>
              </div>
              
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src="..//images/headshot.JPG"
                    alt="Elijah Walker"
                    className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-lg border-4 transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: isDark ? '#1a1a1a' : '#355070'
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'experience':
        return (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-4"
          >
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Work Experience
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Software Engineering Intern
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Goldman Sachs • June 2025 - August 2025
                </p>
                <p className={`mt-2 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Designed and implemented a React and Redux interface for portfolio exposure uploads while integrating new data pre-processing procedures based in the downstream workflow pricing service reducing upload times by 80%.
                   <br></br>• Expanded portfolio upload services within a Python developer API through an object-oriented framework
                   <br></br>• Introduced new data quality checks within REST-Based Java Microservices built on Vert.X and with Elastic Search for an additional risk report metric amalgamated into the React and Redux frontend.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Software Engineering Intern
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Bell Flight • June 2024 - August 2024
                </p>
                <p className={`mt-2 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Automated 10,000+ system requirement updates through an Azure DevOps work item management system to streamline project management processes by reducing manual data synchronization checks by 80%.
                  <br></br>• Performed 20,000+ comparisons between DOORS and ADO in Python utilizing Azure Rest API, DXL, and WIQL for efficient queries to accurately synchronize requirements for our embedded software team through 5-stage pipeline.
                  <br></br>• Built 5 stage pipeline through Azure pipelines to deploy the work item management system using YAML and producing multi-page PDF artifacts
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Research Assistant
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Computer Vision & Multi-Modal Computing Lab • August 2024 - November 2024
                </p>
                <p className={`mt-2 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Researched diffusion-based audio generation models incorporated with scalable interpolant transformers.
                  <br></br>• Tailored 700+ text captions through interface developing accurate text-audio annotations for public dataset release.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Peer-Led Team Learning Tutor
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  The University of Texas at Dallas • August 2024 - May 2025
                </p>
                <p className={`mt-2 transition-colors duration-300 text-left
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Facilitated learning for students to understand fundamentals of Calculus I, II, & III in a collaborative environment.
                  <br></br>• Lead weekly sessions for 16 students examining challenging concepts and building meaningful community.
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'projects':
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-4"
          >
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Technical Projects
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Stilus
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  React, TypeScript, Tailwind CSS, Python, Flask, & MongoDB
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Digital wardrobe implementing TryOnDiffusion for outfit suggestions of amalgamated fashionable garments.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Hover
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  React, Python, Flask, & Tello API
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Visualization of multidimensional objects utilizing heuristic flight algorithms on a Tello drone.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Aerovista
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Python, PyTorch, OpenCV, Tello API, & NumPy
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Leveraged Mask R-CNN and RTMDet-Ins-s to enhance aerial drone SAR performance using a Tello drone.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Ingrediate
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  React, Python, Flask, MongoDB, Auth0, & Google Cloud API 
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Web application for informed recipe recommendations based on ingredients in their digital pantry. 
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Insight Invest
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  React, Python, Flask, & Quiver API 
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Interactive dashboard to analyze congressional respresentatives' investment patterns and news.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Scaffold
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  C++, Reinforcement Learning, Unreal Engine, & Game Design
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Dogfighting simulation confirming the effectiveness of PPO strategies by monitoring agent interactions.
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'involvement':
        return (
          <motion.div
            key="involvement"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-4"
          >
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Campus Involvement
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Vice President
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  The Association of Computing Machinery • December 2024 - Present
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Lead the largest computer science organization at UT Dallas with 800+ members, 8 uniquely talented divisions, 2 consecutive international awards, and 150+ officers at the forefront of innovation and intellectual curiosity.
                  <br></br>• Supporting 4 semester-long programs with 200+ participants, 8 industry sponsors, and 20+ large scale events such as HackUTD, North America's Largest 24-Hour Hackathon.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Vice President of Membership
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Alpha Kappa Psi Mu Rho Chapter • May 2025 - Present
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Leading the pledge process of the largest co-ed business fraternity at UT Dallas with 100+ members. Spearheading the rush process with 8 events and 150+ participants.
                  <br></br>• Developing content and programs specifically implemented to guide underclassmen through their early professional career through refined technical projects and individualized career plans.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Director of Research
                </h4>
                <p className={`text-sm opacity-80 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  The Association of Computing Machinery @ UTD • May 2024 - December 2024
                </p>
                <p className={`mt-2 transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  • Coached 8 uniquely skilled research team leads while guiding almost 40 program participants through engaging workshops, socials, and research project development sessions.
                  <br></br>• Spearheading research teams studying chemotherapy imaging with GANs, Pneumonia detection with SAM2, training a CLAP model using synthetic music, and social presence in multi-agent VR discourse
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'interests':
        return (
          <motion.div
            key="interests"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-4"
          >
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300
              ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
              Personal Interests
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Pastry Baking
                </h4>
                <p className={`transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Drop Cookies, Sweet Breads, & Puff Pastries.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Reading
                </h4>
                <p className={`transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Murder Mysteries & Personal Development.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Dance
                </h4>
                <p className={`transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Modern, Hip-Hop, & Breaking.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Learning Spanish
                </h4>
                <p className={`transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Studying Spanish Within Literature, Music, & Film.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Graphite Sketching
                </h4>
                <p className={`transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  2D Pencil Drawings.
                </p>
              </div>
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${isDark ? 'bg-eerie_black/50 border border-hunter_green/30' : 'bg-baby_powder/20 border border-yinmn_blue/30'}`}>
                <h4 className={`font-semibold text-lg transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Calisthenics
                </h4>
                <p className={`transition-colors duration-300
                  ${isDark ? 'text-hunter_green' : 'text-baby_powder'}`}>
                  Just Moving in General.
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

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
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-1.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
                ${activeTab === tab.id
                  ? isDark 
                    ? 'bg-hunter_green text-eerie_black shadow-lg' 
                    : 'bg-baby_powder text-yinmn_blue shadow-lg'
                  : isDark
                    ? 'text-hunter_green hover:bg-hunter_green/20 border border-hunter_green/30'
                    : 'text-baby_powder hover:bg-baby_powder/20 border border-baby_powder/30'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
