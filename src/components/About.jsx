import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import headshot from '../images/headshot.png';
import headshotDark from '../images/headshotDark.png';

const GITHUB_ICON_PATH = 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';
const YOUTUBE_ICON_PATH = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z';

const rotatingPhrases = [
  'full-stack engineer',
  'builder of thoughtful software',
  'product architect at heart',
  'engineer chasing complex problems',
  'perpetual learner',
  'engineer who ships',
];

function TypingPhrase() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = rotatingPhrases[phraseIndex];
    let timeout;
    if (!deleting) {
      if (text.length < phrase.length) {
        timeout = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 65);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200);
      }
    } else if (text.length > 0) {
      timeout = setTimeout(() => setText(phrase.slice(0, text.length - 1)), 35);
    } else {
      setDeleting(false);
      setPhraseIndex((phraseIndex + 1) % rotatingPhrases.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex]);

  const article = /^[aeiou]/i.test(rotatingPhrases[phraseIndex]) ? 'an' : 'a';

  return (
    <>
      {article}{' '}
      <span>{text}</span>.<span className="typing-cursor" aria-hidden="true">|</span>
    </>
  );
}

// Paste the hosted kickoff video's URL here once it is uploaded; the button on the ACM entry
// appears only when this is set, so an empty value simply hides it.
const ACM_KICKOFF_VIDEO_URL = '';

// Each interest card gets its own shade so the spread reads as one deck with variation.
const INTEREST_CARD_TONES = {
  light: ['#7b2d26', '#5c1a1b', '#932f2a', '#431216', '#a3413a', '#6a1f2a', '#852821', '#3a0f12'],
  dark: ['#171a1f', '#0d0e11', '#21242c', '#121317', '#1c1e24', '#0a0a0d', '#262a33', '#15171c'],
};

// Fixed per-card nudges so the spread looks hand-dealt rather than evenly fanned.
const DECK_JITTER = [
  { rotate: -1.5, y: 4 }, { rotate: 2, y: -3 }, { rotate: -0.5, y: 6 }, { rotate: 1.2, y: -2 },
  { rotate: -1.8, y: 3 }, { rotate: 0.8, y: -4 }, { rotate: -1, y: 2 }, { rotate: 1.6, y: 5 },
];

function InterestDeck({ items, isDark }) {
  const deckRef = useRef(null);
  const [deckWidth, setDeckWidth] = useState(0);
  const [drawn, setDrawn] = useState(null);
  // A card sliding back into the spread. It rides above the deck to a spot just clear of the card on
  // its right ('out'), takes its normal layer there where nothing overlaps it, then slides under that
  // neighbour into its slot ('in'), so the layer change never shows as a jump.
  const [returning, setReturning] = useState(null);
  const [hovered, setHovered] = useState(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = deckRef.current;
    // Measure before the first paint so the deck opens already spread; the observer tracks resizes after.
    setDeckWidth(el.offsetWidth);
    const observer = new ResizeObserver(([entry]) => setDeckWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (drawn === null) return;
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setReturning({ index: drawn, phase: 'out' });
      setDrawn(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawn]);

  const drawCard = (i) => {
    if (drawn !== null && drawn !== i) setReturning({ index: drawn, phase: 'out' });
    else setReturning((r) => (r && r.index === i ? null : r));
    setDrawn(i);
  };

  const returnCard = () => {
    if (drawn === null) return;
    setReturning({ index: drawn, phase: 'out' });
    setDrawn(null);
  };

  const isNarrow = deckWidth > 0 && deckWidth < 500;
  // Phones get two spread rows of four; wider screens fan every card in one row.
  const perRow = isNarrow ? 4 : items.length;
  const rowCount = Math.ceil(items.length / perRow);
  const rowMid = (perRow - 1) / 2;
  const cardWidth = isNarrow ? 104 : 136;
  // Phone cards run a little taller so their descriptions still fit the narrower width.
  const cardHeight = Math.round(cardWidth * (isNarrow ? 1.32 : 1.2));
  const rowGap = Math.round(cardHeight * 0.85);
  const spread = Math.max(0, deckWidth / 2 - cardWidth / 2 - 4);
  const tones = INTEREST_CARD_TONES[isDark ? 'dark' : 'light'];
  const slotSpacing = perRow > 1 ? (2 * spread) / (perRow - 1) : 0;
  // How far apart two cards in a row must sit before they stop overlapping; the tilt widens them a little.
  const clearGap = cardWidth + Math.round(cardHeight * 0.12) + 12;
  // Keeps a tucking card from sliding out past the edge of the deck.
  const minX = -deckWidth / 2 + cardWidth / 2 - 10;

  const restFor = (index) => {
    const r = Math.floor(index / perRow);
    const tt = ((index % perRow) - rowMid) / rowMid; // -1 at the left end of its row, 1 at the right
    const jit = DECK_JITTER[index % DECK_JITTER.length];
    return {
      x: tt * spread,
      // The -12 lifts the whole spread so the lowest, most tilted cards keep some bottom padding.
      y: (r - (rowCount - 1) / 2) * rowGap + tt * tt * 10 + jit.y - 12,
      rotate: tt * 9 + jit.rotate,
      scale: 1,
      row: r,
    };
  };

  // Where a returning card waits while it takes its normal layer: left of its slot, clear of the next
  // card along, and on phones lifted above the row underneath as well.
  const tuckXFor = (index) => Math.max(restFor(index).x - Math.max(0, clearGap - slotSpacing), minX);
  const tuckYFor = (index) => {
    const r = restFor(index);
    return r.y - (rowCount > 1 && r.row < rowCount - 1 ? cardHeight - rowGap + 16 : 6);
  };

  return (
    <div ref={deckRef} className="relative h-[310px] md:h-full" onClick={returnCard}>
      {items.map((item, i) => {
        const rest = restFor(i);
        const isDrawn = drawn === i;
        const isReturning = returning !== null && returning.index === i;

        // A card at the end of a row can't tuck far enough left, so the card on its right steps
        // aside instead and the gap for the layer change is there either way.
        const nudge = returning !== null && returning.phase === 'out' && i === returning.index + 1
          && rest.row === restFor(returning.index).row
          ? Math.max(0, clearGap - (rest.x - tuckXFor(returning.index)))
          : 0;

        let target = hovered === i && drawn === null && returning === null ? { ...rest, y: rest.y - 12 } : rest;
        if (isDrawn) {
          target = { x: 0, y: -10, rotate: 0, scale: isNarrow ? 1.45 : 1.3 };
        } else if (isReturning) {
          target = returning.phase === 'out' ? { ...rest, x: tuckXFor(i), y: tuckYFor(i) } : rest;
        } else if (drawn !== null) {
          // The rest of the deck shifts aside to make room for the drawn card.
          target = { ...rest, x: rest.x + (i < drawn ? -16 : 16), y: rest.y + 10, scale: 0.95 };
        } else if (nudge > 0) {
          target = { ...rest, x: rest.x + nudge };
        }

        return (
          <motion.button
            key={item.title}
            type="button"
            aria-pressed={isDrawn}
            onClick={(e) => { e.stopPropagation(); if (isDrawn) returnCard(); else drawCard(i); }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered((h) => (h === i ? null : h))}
            // Hand over from riding above the deck to sliding into the slot as soon as the card is
            // clear of its neighbour, rather than waiting for the spring to settle, so it never stops.
            onUpdate={isReturning && returning.phase === 'out'
              ? (latest) => {
                  if (Math.abs(latest.x - tuckXFor(i)) < 10 && Math.abs((latest.scale ?? 1) - 1) < 0.04) {
                    setReturning((r) => (r && r.index === i && r.phase === 'out' ? { index: i, phase: 'in' } : r));
                  }
                }
              : undefined}
            onAnimationComplete={isReturning
              ? () => setReturning((r) => (r && r.index === i ? (r.phase === 'out' ? { index: i, phase: 'in' } : null) : r))
              : undefined}
            initial={false}
            // Darken rather than fade the other cards, so the deck stays solid behind the drawn one.
            animate={{ ...target, filter: drawn !== null && !isDrawn && !isReturning ? 'brightness(0.6) saturate(0.85)' : 'brightness(1) saturate(1)' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 24 }}
            style={{
              width: cardWidth,
              height: cardHeight,
              marginLeft: -cardWidth / 2,
              marginTop: -cardHeight / 2,
              zIndex: isDrawn ? 30 : isReturning && returning.phase === 'out' ? 25 : i,
              backgroundColor: tones[i % tones.length],
              // A starting value Framer can interpolate from; without it the first dim reads the filter as NaN.
              filter: 'brightness(1) saturate(1)',
            }}
            className={`absolute left-1/2 top-1/2 flex flex-col overflow-hidden rounded-2xl text-left cursor-pointer outline-none
              shadow-[0_12px_28px_-10px_rgba(0,0,0,0.55)] focus-visible:ring-2 ${isNarrow ? 'p-2.5' : 'p-3'}
              ${isDark ? 'border border-mint_green/15 focus-visible:ring-mint_green' : 'border border-baby_powder/10 focus-visible:ring-baby_powder'}`}
          >
            <span className={`uppercase tracking-[0.18em] ${isNarrow ? 'text-[8px]' : 'text-[9px]'} ${isDark ? 'text-mint_green/55' : 'text-falu_red-900/80'}`}>
              No. {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`mt-1 font-semibold leading-tight ${isNarrow ? 'text-sm' : 'text-lg'} ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
              {item.title}
            </span>
            <span className={`leading-snug ${isNarrow ? 'mt-1.5 text-[9.5px]' : 'mt-3 text-[11px]'} ${isDark ? 'text-mint_green/80' : 'text-baby_powder/85'}`}>
              {item.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function About() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('about');
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const [selectedInvolvement, setSelectedInvolvement] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  // A bubble mid-flight to the centre of the row: { index, dx, dy }. The detail view takes over when it lands.
  const [flyingBubble, setFlyingBubble] = useState(null);
  const bubbleFlightTimer = useRef(null);

  useEffect(() => () => clearTimeout(bubbleFlightTimer.current), []);

  // Everything is measured from the clicked bubble itself rather than from refs, so the flight can
  // never be skipped because a ref hasn't attached.
  const handleBubbleSelect = (i, bubbleEl) => {
    const box = bubbleEl?.closest('[data-involvement-box]');
    const wrapper = bubbleEl?.parentElement;
    if (!box || !wrapper) { setSelectedInvolvement(i); return; }

    const boxRect = box.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    // The bubble is mid-drift when it is clicked, so take that offset back out: the flight runs from
    // where the bubble rests to the middle of the content area, not from wherever the drift had it.
    // Guarded because DOMMatrix throws on 'none', which would abort the flight before it starts.
    const transform = getComputedStyle(wrapper).transform;
    const driftY = transform && transform !== 'none' ? new DOMMatrix(transform).m42 : 0;
    setFlyingBubble({
      index: i,
      dx: boxRect.left + boxRect.width / 2 - (wrapperRect.left + wrapperRect.width / 2),
      dy: boxRect.top + boxRect.height / 2 - (wrapperRect.top + wrapperRect.height / 2 - driftY),
    });
    clearTimeout(bubbleFlightTimer.current);
    // Long enough for the bubble to land and pop before the detail view takes over. The flight state
    // deliberately stays set: clearing it here would snap the bubble back and restart its drift while
    // the row is still fading out, which reads as a jump. It is cleared on the way back instead.
    bubbleFlightTimer.current = setTimeout(() => setSelectedInvolvement(i), 600);
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
    { title: 'Software Engineer Intern', subtitle: 'Microsoft • May 2026 - August 2026', link: 'https://www.microsoft.com/en-us/power-platform/products/power-bi', description: 'Power BI Growth & Distribution Team working with React, TypeScript, C#, .NET, and LLMs.' },
    { title: 'Software Engineer Intern', subtitle: 'Goldman Sachs • June 2025 - August 2025', link: 'https://marquee.gs.com/welcome/our-platform/portfolio-analytics', description: 'Marquee Portfolio Analytics Team working with React, Redux, Python, Java, and Vert.X.' },
    { title: 'Software Engineer Intern', subtitle: 'Bell Flight • June 2024 - August 2024', description: 'Innovation Flight Controls Software Team working with Python, DXL, and Azure DevOps.' },
    { title: 'Research Assistant', subtitle: 'CVMC Lab • August 2024 - November 2024', description: 'Stable Diffusion Model Development for Enhanced Audio Synthesis for Video Generation.' }
  ];

  const projectItems = [
    { title: 'Aria', subtitle: 'React, TypeScript, MCP Servers, & GitHub Copilot SDK', description: 'Proactive agentic diabetes companion on Microsoft Scout that turns live CGM data into a patient persona.', githubConfidential: true, youtube: 'https://youtu.be/6vSSxD9flPU' },
    { title: 'Horizn', subtitle: 'Python, FastAPI, PostgreSQL, React, TypeScript, & Docker', description: 'Home buying platform with ZIP-level DFW housing price forecasts powered by a SARIMAX model service.', github: 'https://github.com/elijahtwalker/horizn' },
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
      photos: ['/images/acmpres.JPG', '/images/acmpres2.jpg'],
      video: ACM_KICKOFF_VIDEO_URL,
    },
    {
      title: 'Vice President of Membership',
      subtitle: 'AKPsi Mu Rho • May 2025 - Dec 2025',
      icon: '/images/akpsi.png',
      bullets: [
        'Led the pledge process of the largest and most premier co-ed business fraternity at UT Dallas with 140+ members. Spearheaded the rush process with 8 events and 300+ participants.'
      ],
      photos: ['/images/vpm.JPEG', '/images/vpm2.jpg'],
      front: 0,
    },
    {
      title: 'Director of Research',
      subtitle: 'ACM @ UTD • May 2024 - Dec 2024',
      icon: '/images/ResearchWhite.png',
      bullets: [
        'Coached 8 uniquely skilled research team leads while guiding almost 40 program participants through engaging workshops, socials, and research project development sessions.'
      ],
      photos: ['/images/research.JPG', '/images/research2.jpg'],
      front: 0,
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

  const ITEMS_PER_PAGE = { experience: 2, projects: 2, involvement: 1, interests: 8 };

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
    clearTimeout(bubbleFlightTimer.current);
    setFlyingBubble(null);
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
                  Hi, I'm Elijah. I'm <TypingPhrase />
                </p>
                <p className={`text-base md:text-xl transition-colors duration-300
                  ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                  I obsess over building meaningful, product-focused software for users worldwide.
                  I'm a senior computer science student with experience across the
                  technology, finance, and aerospace sectors.
                </p>
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
                    src={isDark ? headshotDark : headshot}
                    alt="Elijah Walker"
                    className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover object-top shadow-lg border-4 transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: isDark ? 'rgba(245, 240, 225, 0.5)' : '#7b2d26'
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
                  ${isDark ? 'bg-dark-950 border border-mint_green/60' : 'bg-baby_powder/20 border border-baby_powder/60'}`}>
                  <h4 className={`font-semibold text-lg transition-colors duration-300 text-left
                    ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm transition-colors duration-300 text-left
                    ${isDark ? 'text-mint_green/90' : 'text-baby_powder opacity-80'}`}>
                    {item.link ? (
                      <>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
                        >
                          {item.subtitle.split(' • ')[0]}
                        </a>
                        {' • '}{item.subtitle.split(' • ')[1]}
                      </>
                    ) : item.subtitle}
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
                  ${isDark ? 'bg-dark-950 border border-mint_green/60' : 'bg-baby_powder/20 border border-baby_powder/60'}`}>
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
                        aria-label={`${item.title} on GitHub`}
                        className={`transition-colors duration-300 hover:scale-110 transform ${isDark ? 'text-mint_green/70 hover:text-mint_green' : 'text-baby_powder/70 hover:text-baby_powder'}`}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={GITHUB_ICON_PATH} />
                        </svg>
                      </a>
                    )}
                    {/* The repo lived on a private company platform, so the icon stays visible but disabled. */}
                    {item.githubConfidential && (
                      <span
                        tabIndex={0}
                        aria-label="GitHub was on an internal confidential company platform"
                        className={`group relative inline-flex cursor-not-allowed outline-none transition-colors duration-300
                          ${isDark ? 'text-mint_green/30' : 'text-baby_powder/35'}`}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d={GITHUB_ICON_PATH} />
                        </svg>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-20 w-max max-w-[13rem] rounded-md px-2 py-1 text-xs leading-snug shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100
                            ${isDark ? 'bg-mint_green text-eerie_black' : 'bg-baby_powder text-falu_red'}`}
                        >
                          GitHub was on an internal confidential company platform
                        </span>
                      </span>
                    )}
                    {item.youtube && (
                      <a
                        href={item.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.title} demo on YouTube`}
                        className={`transition-colors duration-300 hover:scale-110 transform ${isDark ? 'text-mint_green/70 hover:text-mint_green' : 'text-baby_powder/70 hover:text-baby_powder'}`}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={YOUTUBE_ICON_PATH} />
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
            {/* Bubbles sit centred in the space; an open entry starts at the top so it reads straight
                under the heading instead of floating in the middle. */}
            <div
              data-involvement-box=""
              className={`relative flex justify-center h-full min-h-[200px]
                ${selectedInvolvement === null || flyingBubble !== null ? 'items-center' : 'items-start'}`}
            >
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
                      const isFlying = flyingBubble?.index === i;
                      return (
                        // The drift lives on this wrapper so hovering, tapping or flying to the centre
                        // never interrupts it.
                        <motion.div
                          key={i}
                          className={`relative transition-opacity duration-500 ease-out delay-75
                            ${flyingBubble !== null && flyingBubble.index !== i ? 'opacity-0' : 'opacity-100'}`}
                          style={{ marginBottom: offsets[i] }}
                          animate={flyingBubble === null ? { y: [0, amplitudes[i], 0] } : { y: 0 }}
                          transition={flyingBubble === null
                            ? { duration: 2.5 + i * 0.3, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: 0.2 }}
                        >
                        {flyingBubble?.index === i && (
                          <motion.span
                            key="ring"
                            aria-hidden="true"
                            initial={{ opacity: 0.5, scale: 1 }}
                            animate={{ opacity: 0, scale: 2 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
                            style={{ x: flyingBubble.dx, y: flyingBubble.dy }}
                            className={`absolute inset-0 rounded-full pointer-events-none
                              ${isDark ? 'bg-mint_green/30' : 'bg-baby_powder/40'}`}
                          />
                        )}
                        {/* Keyed so React keeps matching this button when the ring appears beside it;
                            without the key it remounts mid-flight and the animation restarts. */}
                        <motion.button
                          key="bubble"
                          onClick={(e) => handleBubbleSelect(i, e.currentTarget)}
                          style={{
                            // The flight, its pop and the hover all ride on CSS transforms. Unlike Framer's
                            // animations they carry on from wherever they are when React re-renders, which
                            // otherwise restarted the travel and left the bubble crawling.
                            // Always a real transform, never 'none': a transition needs a starting value
                            // of the same shape to interpolate from, or the bubble snaps to the centre.
                            transform: isFlying
                              ? `translate(${flyingBubble.dx}px, ${flyingBubble.dy}px) scale(1.12)`
                              : 'translate(0px, 0px) scale(1)',
                            transition: isFlying
                              // Gentle overshoot: enough to read as a landing, not a recoil.
                              ? 'transform 560ms cubic-bezier(0.25, 1.1, 0.35, 1)'
                              : 'transform 260ms ease-out',
                            // A light three-stop wash with an off-centre highlight, so each bubble reads as a lit
                            // sphere without any black in it. The angle shifts per bubble so the three don't look
                            // stamped from one template.
                            backgroundImage: isDark
                              ? `radial-gradient(circle at 30% 22%, rgba(245,240,225,0.24), rgba(245,240,225,0) 62%),
                                 linear-gradient(${140 + i * 20}deg, #525a67 0%, #3a4049 55%, #2a2f38 100%)`
                              : `radial-gradient(circle at 30% 22%, rgba(255,255,255,0.45), rgba(255,255,255,0) 62%),
                                 linear-gradient(${140 + i * 20}deg, #d2695c 0%, #b24137 55%, #8d3129 100%)`,
                          }}
                          className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center text-center p-2 md:p-3 cursor-pointer backdrop-blur-sm hover:brightness-110
                            shadow-[0_10px_22px_-14px_rgba(58,15,18,0.55)]
                            ${isFlying ? '' : `hover:-translate-y-2.5 hover:scale-[1.08] active:scale-95 ${i % 2 === 0 ? 'hover:-rotate-3' : 'hover:rotate-3'}`}`}
                        >
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt={item.title}
                              className={`object-contain pointer-events-none transition-all duration-300 ${item.title === 'VP of Membership' ? 'w-12 h-12 md:w-24 md:h-24' : 'w-9 h-9 md:w-16 md:h-16'}`}
                              style={isDark
                                ? { filter: 'brightness(0) saturate(100%) invert(94%) sepia(10%) saturate(200%) hue-rotate(358deg) brightness(103%) contrast(93%)' }
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
                        </motion.div>
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
                    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6 w-full text-left">
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex-1 min-w-0"
                      >
                        <h4 className={`text-base md:text-lg font-bold mb-0.5 transition-colors duration-300
                          ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                          {involvementItems[selectedInvolvement].title}
                        </h4>
                        <p className={`text-xs md:text-sm mb-1.5 opacity-80 transition-colors duration-300
                          ${isDark ? 'text-mint_green' : 'text-baby_powder'}`}>
                          {involvementItems[selectedInvolvement].subtitle}
                        </p>
                        <p className={`text-xs md:text-base leading-relaxed transition-colors duration-300
                          ${isDark ? 'text-mint_green/95' : 'text-baby_powder'}`}>
                          {involvementItems[selectedInvolvement].bullets[0]}
                        </p>
                        {involvementItems[selectedInvolvement].video && (
                          <a
                            href={involvementItems[selectedInvolvement].video}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-[1.03]
                              ${isDark
                                ? 'bg-dark-950 border border-mint_green/60 text-mint_green hover:bg-dark-900'
                                : 'bg-baby_powder/20 border border-baby_powder/60 text-baby_powder hover:bg-baby_powder/30'
                              }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch the kickoff video
                          </a>
                        )}
                      </motion.div>

                      {/* Both photos open the close-up view; hovering straightens one and lifts it in front.
                          `front` picks which of the two sits on top, so an entry can lead with its better shot. */}
                      <div className="relative flex-shrink-0 w-full h-40 md:w-80 md:h-52">
                        {involvementItems[selectedInvolvement].photos.map((photo, p) => (
                          <motion.img
                            key={photo}
                            src={photo}
                            alt={`${involvementItems[selectedInvolvement].title} photo ${p + 1}`}
                            onClick={(e) => { e.stopPropagation(); setLightboxPhoto(photo); }}
                            initial={{ opacity: 0, y: 10, rotate: p === 0 ? -5 : 4 }}
                            animate={{ opacity: 1, y: 0, rotate: p === 0 ? -5 : 4 }}
                            whileHover={{ scale: 1.06, rotate: 0, zIndex: 20 }}
                            transition={{ duration: 0.3, delay: 0.2 + p * 0.1 }}
                            style={{ zIndex: p === (involvementItems[selectedInvolvement].front ?? 1) ? 2 : 1 }}
                            className={`absolute w-[54%] md:w-[62%] aspect-[3/2] rounded-lg object-cover object-top border-2 cursor-pointer shadow-[0_10px_24px_-12px_rgba(0,0,0,0.7)]
                              ${p === 0 ? 'left-[8%] top-[7%] md:left-0 md:top-0' : 'left-[38%] top-[25%] md:left-[34%] md:top-[30%]'}
                              ${isDark ? 'border-mint_green/40' : 'border-baby_powder/70'}`}
                          />
                        ))}
                      </div>
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
            key="interests"
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <InterestDeck items={interestItems} isDark={isDark} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="about" className="relative py-20 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`max-w-6xl mx-auto rounded-3xl px-5 md:px-8 py-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 relative z-10 flex flex-col h-auto md:h-[350px]
          ${isDark
            ? 'bg-gradient-to-br from-dark-800/40 via-dark-900/30 to-dark-800/40 border border-mint_green/20 shadow-[0_8px_32px_0_rgba(245,240,225,0.1)]'
            : 'bg-gradient-to-br from-baby_powder/30 via-baby_powder/20 to-baby_powder/20 border border-falu_red/20 shadow-[0_8px_32px_0_rgba(123,45,38,0.15)]'
          }`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: isDark
            ? '0 8px 32px 0 rgba(245, 240, 225, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            : '0 8px 32px 0 rgba(123, 45, 38, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Living liquid blobs behind the content */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`liquid-blob liquid-blob-${n}`}
              style={{
                background: isDark
                  ? 'radial-gradient(circle at 35% 35%, rgba(245, 240, 225, 0.14), rgba(245, 240, 225, 0.02) 70%)'
                  : 'radial-gradient(circle at 35% 35%, rgba(251, 254, 249, 0.22), rgba(251, 254, 249, 0.04) 70%)',
              }}
            />
          ))}
        </div>

        {/* Navigation Tabs: one compact segmented row on phones, separate pills from md up.
            If a very narrow phone still can't fit it, the row scrolls sideways instead of wrapping. */}
        <div className={`relative z-10 flex-shrink-0 mb-4 md:mb-6 flex flex-nowrap w-full overflow-x-auto rounded-xl border p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          md:w-auto md:flex-wrap md:justify-center md:gap-2 md:overflow-visible md:rounded-none md:border-0 md:p-0
          ${isDark ? 'border-mint_green/40' : 'border-baby_powder/30'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative overflow-hidden flex-[1_0_auto] md:flex-none whitespace-nowrap px-1.5 sm:px-3 md:px-5 py-1.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-300 transform md:hover:scale-105
                ${activeTab === tab.id
                  ? isDark
                    ? 'text-eerie_black md:shadow-lg border border-transparent'
                    : 'text-falu_red md:shadow-lg border border-transparent'
                  : isDark
                    ? 'text-mint_green hover:bg-mint_green/20 border border-transparent md:border-mint_green/60'
                    : 'text-baby_powder hover:bg-baby_powder/20 border border-transparent md:border-baby_powder/30'
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
                href="/Resume_Elijah_Walker.pdf"
                alt="alt text"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-[1.02]
                  ${isDark
                    ? 'bg-dark-950 border border-mint_green/60 text-mint_green hover:bg-dark-900'
                    : 'bg-baby_powder/20 border border-falu_red/30 text-baby_powder hover:bg-baby_powder/30'
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
                    onClick={() => { setSelectedInvolvement(null); setFlyingBubble(null); }}
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

          {/* Tilted photos, the hover zoom and the interest deck's drawn card all grow past the content
              box, so only the tabs whose cards slide sideways between pages still clip. */}
          <div key={activeTab} className={`flex-1 relative z-10 ${activeTab === 'experience' || activeTab === 'projects' ? 'overflow-hidden' : 'overflow-visible'}`}>
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
