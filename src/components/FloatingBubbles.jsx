import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(MotionPathPlugin);

// Normalized page coordinates: x across the viewport, y down the full page.
// These are the site's original waypoints converted to absolute screen space.
// The original positioned each bubble near the page bottom and translated it
// by -y * 0.95 * pageH, so its absolute y is (1 - 0.95 * y) and the list is
// already top-to-bottom in order. It sweeps right along the top, curls down
// into the hook on the right, wiggles back up behind the content card, then
// unwinds left and down to the bottom.
const CURVE = [
  [0.00, 0.050],
  [0.08, 0.079],
  [0.16, 0.107],
  [0.24, 0.136],
  [0.32, 0.164],
  [0.40, 0.202],
  [0.48, 0.240],
  [0.56, 0.288],
  [0.63, 0.335],
  [0.69, 0.392],
  [0.73, 0.459],
  [0.76, 0.539],
  [0.77, 0.628],
  [0.76, 0.710],
  [0.73, 0.770],
  [0.68, 0.794],
  [0.62, 0.760],
  [0.55, 0.707],
  [0.48, 0.662],
  [0.40, 0.630],
  [0.32, 0.613],
  [0.24, 0.616],
  [0.17, 0.636],
  [0.11, 0.684],
  [0.07, 0.762],
  [0.03, 0.867],
  [0.00, 1.000],
];

// Widens the curve on desktop so the hook reaches further right; narrows it
// on mobile so it still fits.
const X_SCALE = { desktop: 1.16, mobile: 0.82 };

export default function FloatingBubbles() {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const ctxRef = useRef(null);

  // Only the per-bubble traits that don't depend on layout. Paths are built
  // in the layout effect, where the page has a real measured height.
  const bubbles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 42 : 54;
    const minSize = isMobile ? 10 : 14;
    const sizeSpan = isMobile ? 80 : 165;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      // Skewed so most bubbles stay small and only a few swell to full size.
      size: minSize + Math.pow(Math.random(), 1.9) * sizeSpan,
      level: Math.random() * 0.17 + 0.03,
      duration: 18 + Math.random() * 10,
      // Staggered so the last bubble launches about as one journey ends,
      // keeping the stream continuous without bunching.
      delay: i * (isMobile ? 0.57 : 0.43),
      jx: Math.random() - 0.5,
      jy: Math.random() - 0.5,
      swayAmp: (isMobile ? 5 : 8) + Math.random() * (isMobile ? 7 : 12),
      swayDur: 4 + Math.random() * 3.5,
    }));
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = gsap.utils.toArray('.bubble', containerRef.current);

    // Dark mode is clouds only. Pop whatever is on screen, then stay empty.
    if (isDark) {
      const running = ctxRef.current;
      ctxRef.current = null;

      // Nothing was running, so the page loaded straight into dark mode and
      // there is nothing to pop.
      if (!running) {
        gsap.set(els, { opacity: 0 });
        return;
      }

      const live = els.filter((el) => Number(gsap.getProperty(el, 'opacity')) > 0.02);
      // kill() rather than revert() so each bubble pops where it currently is
      // instead of snapping back to the start of its path first.
      running.kill();
      gsap.set(els.filter((el) => !live.includes(el)), { opacity: 0 });

      // The pop scales the inner element and fades the outer one, leaving the
      // inner's opacity alone since React owns that as the brightness level.
      gsap.timeline()
        .to(live.map((el) => el.firstElementChild), {
          scale: 1.75,
          duration: 0.16,
          ease: 'power2.out',
          stagger: { each: 0.004, from: 'random' },
        }, 0)
        .to(live, {
          opacity: 0,
          duration: 0.16,
          ease: 'power1.in',
          stagger: { each: 0.004, from: 'random' },
        }, 0);

      return;
    }

    // Back to light: clear anything the pop left behind, then restart.
    ctxRef.current?.kill();
    gsap.set(els, { opacity: 0, x: 0, y: 0 });
    gsap.set(els.map((el) => el.firstElementChild), { scale: 1, x: 0 });

    const vw = window.innerWidth;
    const pageH = containerRef.current.offsetHeight;
    const xScale = vw < 768 ? X_SCALE.mobile : X_SCALE.desktop;

    ctxRef.current = gsap.context(() => {
      gsap.utils.toArray('.bubble').forEach((el, i) => {
        const b = bubbles[i];
        if (!b) return;

        // Jitter offsets the whole path so bubbles form a loose stream
        // rather than a single-file line.
        const ox = b.jx * vw * 0.11;
        const oy = b.jy * pageH * 0.05;
        const points = CURVE.map(([x, y]) => ({
          x: x * xScale * vw + ox,
          y: y * pageH + oy,
        }));

        gsap
          .timeline({ repeat: -1, repeatDelay: 0.8, delay: b.delay })
          .to(el, {
            motionPath: { path: points, curviness: 1.25, resolution: 16 },
            duration: b.duration,
            ease: 'none',
          }, 0)
          .fromTo(el,
            { opacity: 0 },
            { opacity: 1, duration: b.duration * 0.12, ease: 'sine.inOut' }, 0)
          .to(el, { opacity: 0, duration: b.duration * 0.12, ease: 'sine.inOut' },
            b.duration * 0.88);

        // Sway runs on the inner element so it layers on top of the path
        // transform instead of fighting it for the same property.
        gsap.fromTo(el.firstElementChild,
          { x: -b.swayAmp },
          {
            x: b.swayAmp,
            duration: b.swayDur,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        ).progress(Math.random());
      });
    }, containerRef);
  }, [bubbles, isDark]);

  // Reverting on every theme change would wipe the bubbles' positions before
  // the pop could play, so teardown is unmount-only.
  useEffect(() => () => {
    ctxRef.current?.revert();
    ctxRef.current = null;
  }, []);

  const fill = isDark
    ? `radial-gradient(circle at 32% 28%,
        rgba(255, 253, 245, 1) 0%,
        rgba(245, 240, 225, 0.7) 32%,
        rgba(245, 240, 225, 0.28) 65%,
        rgba(245, 240, 225, 0.06) 100%)`
    : `radial-gradient(circle at 32% 28%,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(251, 254, 249, 0.6) 30%,
        rgba(251, 254, 249, 0.25) 62%,
        rgba(251, 254, 249, 0.05) 100%)`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-[5]"
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble absolute top-0 left-0"
          style={{
            width: bubble.size,
            height: bubble.size,
            // Centers the bubble on its path point.
            marginLeft: -bubble.size / 2,
            marginTop: -bubble.size / 2,
            opacity: 0,
          }}
        >
          <div
            className="w-full h-full rounded-full transition-opacity duration-300"
            style={{
              background: fill,
              opacity: bubble.level * (isDark ? 2.2 : 1),
              boxShadow: isDark
                ? `inset 0 0 ${bubble.size * 0.14}px rgba(255, 255, 255, 0.4),
                   0 0 ${bubble.size * 0.4}px rgba(245, 240, 225, 0.3)`
                : `inset 0 0 ${bubble.size * 0.12}px rgba(255, 255, 255, 0.3)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
