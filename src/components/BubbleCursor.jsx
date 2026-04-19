import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function BubbleCursor() {
  const { isDark } = useTheme();
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Outer bubble trails behind with spring physics
  const ox = useSpring(mx, { damping: 22, stiffness: 180, mass: 0.4 });
  const oy = useSpring(my, { damping: 22, stiffness: 180, mass: 0.4 });

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return;

    // Inject a style tag at the highest possible specificity so no element
    // or browser default can override cursor: none within the document.
    const styleTag = document.createElement('style');
    styleTag.id = 'bubble-cursor-hide';
    styleTag.textContent = `
      *, *::before, *::after,
      html, body,
      a, button, input, textarea, select, label,
      [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleTag);
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => {
      setHovering(!!e.target.closest('a, button, [role="button"], input, textarea, select, label'));
    };
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    // Use a small delay on leave so the bubble doesn't vanish before the
    // native cursor has fully left the document, preventing a brief flash.
    let leaveTimer = null;
    const onLeave = () => { leaveTimer = setTimeout(() => setVisible(false), 50); };
    const onEnter = () => { clearTimeout(leaveTimer); setVisible(true); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.head.removeChild(styleTag);
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, [mx, my]);

  const bubbleBorder = isDark
    ? 'rgba(85, 107, 63, 0.65)'
    : 'rgba(251, 254, 249, 0.55)';

  const bubbleBg = isDark
    ? 'radial-gradient(circle at 32% 30%, rgba(85, 107, 63, 0.18), rgba(85, 107, 63, 0.04) 70%)'
    : 'radial-gradient(circle at 32% 30%, rgba(251, 254, 249, 0.22), rgba(251, 254, 249, 0.04) 70%)';

  const bubbleGlow = isDark
    ? '0 0 14px rgba(85, 107, 63, 0.2), inset 0 1px 0 rgba(255,255,255,0.12)'
    : '0 0 14px rgba(251, 254, 249, 0.2), inset 0 1px 0 rgba(255,255,255,0.25)';

  const dotColor = isDark
    ? 'rgba(85, 107, 63, 0.9)'
    : 'rgba(251, 254, 249, 0.85)';

  return (
    <>
      {/* Expanding ripple — only on hover, pulses outward */}
      <AnimatePresence>
        {hovering && !clicking && visible && (
          <motion.div
            key="ripple"
            className="pointer-events-none fixed z-[9998] rounded-full"
            style={{
              x: ox,
              y: oy,
              translateX: '-50%',
              translateY: '-50%',
              border: `1px solid ${bubbleBorder}`,
            }}
            initial={{ width: 52, height: 52, opacity: 0.55 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* Outer bubble — springs behind cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x: ox,
          y: oy,
          translateX: '-50%',
          translateY: '-50%',
          border: `1px solid ${hovering ? (isDark ? 'rgba(85, 107, 63, 0.9)' : 'rgba(251, 254, 249, 0.85)') : bubbleBorder}`,
          background: bubbleBg,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          boxShadow: hovering
            ? (isDark
                ? '0 0 20px rgba(85, 107, 63, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)'
                : '0 0 20px rgba(251, 254, 249, 0.35), inset 0 1px 0 rgba(255,255,255,0.3)')
            : bubbleGlow,
        }}
        animate={{
          width:   clicking ? 28 : hovering ? 52 : 38,
          height:  clicking ? 28 : hovering ? 52 : 38,
          scale:   clicking ? 0.8 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Inner dot — snaps directly to cursor, always visible */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x: mx,
          y: my,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: dotColor,
        }}
        animate={{
          width:   clicking ? 3 : 5,
          height:  clicking ? 3 : 5,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
