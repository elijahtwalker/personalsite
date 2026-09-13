import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import VantaFog from '../components/VantaFog';
import ThemeToggle from '../components/ThemeToggle';
import BubbleCursor from '../components/BubbleCursor';
import ShapeGallery from '../components/ShapeGallery';
import { SHAPES, DEFAULT_SHAPE } from '../lib/shapes';
import { createPlaceholderItems } from '../lib/placeholderTiles';
import { createVideoItems } from '../lib/videos';

// The opened clip. The source is only attached once a clip is actually opened, so browsing the
// gallery never downloads video — tiles are images until you choose one.
//
// Cloudinary builds the optimised version on first request and answers 423 while it does, so a first
// view of a clip can fail once and succeed a moment later. Rather than showing a broken player, this
// retries a few times behind the poster.
// Measured against this library: a clip Cloudinary hasn't built yet took anywhere from 1 to 18
// seconds to become available. Retrying a handful of times over ~6 seconds gave up before the slower
// ones were ready, which is what made clips seem to need several attempts or never load at all.
const MAX_PREPARE_WAIT_MS = 60000;
const RETRY_INTERVAL_MS = 1500;

function ClipPlayer({ item, onStatusChange }) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState('loading');
  // Controls stay hidden while a clip plays, so nothing overlays the footage. They appear once it
  // ends, where they're useful for replaying or scrubbing back.
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);
  const retryTimer = useRef(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setAttempt(0);
    setStatus('loading');
    setEnded(false);
    startedAt.current = Date.now();
    return () => clearTimeout(retryTimer.current);
  }, [item.id]);

  // With the control bar hidden there's no pause button, so the frame itself toggles playback.
  const togglePlayback = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video || ended) return;
    if (video.paused) video.play(); else video.pause();
  };

  // The indicator lives above the video, so the player reports upward rather than drawing it itself.
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const onError = () => {
    // Keep trying for as long as a first-time transcode plausibly takes, rather than a fixed few goes.
    if (Date.now() - startedAt.current > MAX_PREPARE_WAIT_MS) {
      setStatus('failed');
      return;
    }
    setStatus('preparing');
    retryTimer.current = setTimeout(() => setAttempt((value) => value + 1), RETRY_INTERVAL_MS);
  };

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        key={`${item.id}-${attempt}`}
        src={item.video}
        poster={item.largePoster}
        className="h-full w-full object-contain"
        controls={ended}
        autoPlay
        playsInline
        preload="none"
        onClick={togglePlayback}
        onPlaying={() => setStatus('playing')}
        onEnded={() => setEnded(true)}
        onError={onError}
      />
    </div>
  );
}

// Three pulsing dots, shown while a clip is still being fetched or prepared.
function LoadingDots() {
  return (
    <span className="flex items-center gap-1.5" role="status" aria-label="Loading clip">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-baby_powder"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 }}
        />
      ))}
    </span>
  );
}

// /views — the video gallery. Same fog backdrop and theme as the rest of the site, but none of the
// home page's content: no hero, no about card. Just the arrangement and the controls for it.
export default function Views() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [shapeId, setShapeId] = useState(DEFAULT_SHAPE);
  const [selected, setSelected] = useState(null);
  // Reported upward by the player, so the dots above the clip know when to show.
  const [clipStatus, setClipStatus] = useState('loading');
  const [reducedMotion, setReducedMotion] = useState(false);
  // Phones run the fog and the gallery on separate WebGL contexts, which is more than most handsets
  // want to do at once, so the fog steps aside there and the flat theme colour backs the gallery.
  const [showFog, setShowFog] = useState(true);

  // Real clips as soon as src/lib/videos.js has any; placeholder tiles until then.
  const items = useMemo(() => {
    const clips = createVideoItems();
    return clips.length ? clips : createPlaceholderItems(120);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallQuery = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setShowFog(!smallQuery.matches);
    };
    sync();
    motionQuery.addEventListener('change', sync);
    smallQuery.addEventListener('change', sync);
    return () => {
      motionQuery.removeEventListener('change', sync);
      smallQuery.removeEventListener('change', sync);
    };
  }, []);

  // Every newly opened clip starts out loading again, otherwise the dots stay hidden after the first.
  useEffect(() => {
    if (selected !== null) setClipStatus('loading');
  }, [selected]);

  useEffect(() => {
    if (selected === null) return undefined;
    const onKeyDown = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  const shapeIndex = SHAPES.findIndex((shape) => shape.id === shapeId);
  const step = (direction) => {
    const next = (shapeIndex + direction + SHAPES.length) % SHAPES.length;
    setShapeId(SHAPES[next].id);
  };

  // Left and right step through the shapes, so the whole gallery is reachable from the keyboard.
  // Ignored while a clip is open, where the arrows belong to the video and Escape closes.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (selected !== null) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = (shapeIndex + (e.key === 'ArrowLeft' ? -1 : 1) + SHAPES.length) % SHAPES.length;
      setShapeId(SHAPES[next].id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shapeIndex, selected]);

  const selectedItem = selected !== null ? items[selected] : null;

  const textColor = isDark ? 'text-mint_green' : 'text-baby_powder';

  return (
    <div className="relative h-screen-safe w-screen overflow-hidden">
      {showFog && <VantaFog />}
      {/* The same cursor treatment as the rest of the site. */}
      <BubbleCursor />

      <div className="absolute inset-0 z-10">
        <ShapeGallery
          items={items}
          shapeId={shapeId}
          reducedMotion={reducedMotion}
          onSelect={setSelected}
        />
      </div>

      <ThemeToggle />

      {/* The way back to the rest of the site, built to match the theme toggle opposite it. */}
      <motion.button
        onClick={() => navigate('/')}
        aria-label="Back to elijahwalker.me"
        className={`fixed top-6 left-6 z-50 p-3 rounded-full backdrop-blur-sm shadow-lg
          transition-colors duration-300
          ${isDark ? 'bg-mint_green/20 hover:bg-mint_green/30 border border-mint_green/40' : 'bg-baby_powder/10 hover:bg-baby_powder/20'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeftIcon
          className={`w-6 h-6 ${isDark ? 'text-mint_green drop-shadow-[0_0_4px_rgba(245,240,225,0.5)]' : 'text-baby_powder'}`}
        />
      </motion.button>

      {/* Shape switcher: the arrows either side are the only way to change shape. */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous shape"
          onClick={() => step(-1)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300
            ${isDark ? 'text-mint_green hover:bg-mint_green/10' : 'text-baby_powder hover:bg-baby_powder/10'}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Sized to the longest shape name, so the arrows hold still as the name changes without
            leaving a wide gap around the short ones. */}
        <span
          style={{ minWidth: `${Math.max(...SHAPES.map((shape) => shape.label.length))}ch` }}
          className={`text-center text-sm md:text-base transition-colors duration-300 ${textColor}`}
        >
          {SHAPES[shapeIndex]?.label}
        </span>

        <button
          type="button"
          aria-label="Next shape"
          onClick={() => step(1)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300
            ${isDark ? 'text-mint_green hover:bg-mint_green/10' : 'text-baby_powder hover:bg-baby_powder/10'}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Opened tile. The real version plays the Cloudinary video here with sound and controls; for now
          it shows the placeholder frame at size so the interaction can be judged. */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-[86vw] max-w-3xl cursor-default"
            >
              {/* Loading state sits above the clip, opposite the caption underneath it. */}
              <div className="mb-2 flex h-4 items-center justify-end">
                {clipStatus === 'failed' ? (
                  <span className="text-xs text-baby_powder/70">could not load this clip</span>
                ) : (
                  clipStatus !== 'playing' && <LoadingDots />
                )}
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
                {selectedItem.video ? (
                  <ClipPlayer item={selectedItem} onStatusChange={setClipStatus} />
                ) : (
                  <img
                    src={typeof selectedItem.poster === 'string'
                      ? selectedItem.poster
                      : selectedItem.poster.toDataURL()}
                    alt={selectedItem.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="mt-3">
                <span className="text-sm text-baby_powder">{selectedItem.title}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
