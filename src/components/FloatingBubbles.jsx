import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/* Catmull-Rom spline: rounds the straight polyline legs between waypoints
   into a continuous curve so bubbles never visibly change direction. */
function catmullRom(pts, segs) {
  if (pts.length < 3) return pts;
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    for (let s = 0; s < segs; s++) {
      const t = s / segs;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (p2[0] - p0[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (3 * p1[0] - p0[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (p2[1] - p0[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (3 * p1[1] - p0[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function lerp(pts, numOut) {
  const dist = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    dist.push(dist[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const total = dist[dist.length - 1];
  const out = [];
  for (let k = 0; k < numOut; k++) {
    const target = (k / (numOut - 1)) * total;
    let j = 1;
    while (j < dist.length - 1 && dist[j] < target) j++;
    const seg = dist[j] - dist[j - 1];
    const f = seg > 0 ? (target - dist[j - 1]) / seg : 0;
    out.push([
      pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f,
      pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f,
    ]);
  }
  return out;
}

export default function FloatingBubbles() {
  const { isDark } = useTheme();

  const bubbles = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1400;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const pageH = vh * 2.5;
    const N = 64;
    const isMobile = vw < 768;

    const desktopWaypoints = [
      [0.00, 1.00],
      [0.08, 0.97],
      [0.16, 0.94],
      [0.24, 0.91],
      [0.32, 0.88],
      [0.40, 0.84],
      [0.48, 0.80],
      [0.56, 0.75],
      [0.63, 0.70],
      [0.69, 0.64],
      [0.73, 0.57],
      [0.76, 0.49],
      [0.77, 0.41],
      [0.76, 0.34],
      [0.73, 0.29],
      [0.68, 0.27],
      [0.62, 0.30],
      [0.55, 0.35],
      [0.48, 0.40],
      [0.40, 0.44],
      [0.32, 0.46],
      [0.24, 0.45],
      [0.17, 0.41],
      [0.11, 0.34],
      [0.07, 0.25],
      [0.03, 0.14],
      [0.00, 0.00],
    ];

    const mobileWaypoints = [
      [0.00, 0.00],
      [0.15, 0.08],
      [0.30, 0.16],
      [0.65, 0.25],
      [0.75, 0.35],
      [0.90, 0.46],
      [0.28, 0.56],
      [0.22, 0.66],
      [0.14, 0.76],
      [0.02, 0.86],
      [0.00, 0.96],
    ];

    const baseWaypoints = isMobile ? mobileWaypoints : desktopWaypoints;
    const bubbleCount = isMobile ? 60 : 70;

    return Array.from({ length: bubbleCount }, (_, i) => {
      const size = isMobile ? Math.random() * 72 + 24 : Math.random() * 150 + 50;
      const rx = (Math.random() - 0.5) * vw * 0.06;
      const ry = (Math.random() - 0.5) * pageH * 0.02;

      const scaled = baseWaypoints.map(([x, y]) => [x * vw, y * pageH * 0.95]);
      // Smooth the polyline into a spline, then resample evenly by arc length
      // so speed along the path stays constant between keyframes.
      const pts = lerp(catmullRom(scaled, 12), N);

      // Per-bubble sideways sway layered on the path for an underwater feel.
      const swayAmp = (isMobile ? 5 : 8) + Math.random() * (isMobile ? 7 : 12);
      const swayPhase = Math.random() * Math.PI * 2;
      const swayCycles = 2 + Math.random() * 2;
      const sway = (i) => Math.sin(swayPhase + (i / (N - 1)) * Math.PI * 2 * swayCycles) * swayAmp;

      const pathX = isMobile
        ? (() => {
            const x0 = pts[0][0];
            return pts.map(([x], i) =>
              Math.min(vw * 0.72, Math.max(-size * 0.3, x - x0 + rx * 0.1 + sway(i)))
            );
          })()
        : pts.map(([x], i) => x + rx + sway(i));

      const pathY = isMobile
        ? (() => {
            const y0 = pts[0][1];
            return pts.map(([, y]) => y - y0 + ry * 0.1);
          })()
        : pts.map(([, y]) => -y + ry);

      return {
        id: i,
        size,
        delay: i * 0.4,
        duration: Math.random() * 8 + 16,
        startX: isMobile ? Math.random() * 30 : Math.random() * 150,
        startY: isMobile ? Math.random() * 40 - 100 : pageH - 100 - Math.random() * 400,
        opacity: Math.random() * 0.17 + 0.03,
        pathX,
        pathY,
      };
    });
  }, []);

  // Cosine-eased fade in/out over the first and last 12% of the journey,
  // sized to however many keyframes the path has.
  const opacityKeys = (o, n) =>
    Array.from({ length: n }, (_, i) => {
      const edge = Math.min(i / (n - 1), 1 - i / (n - 1));
      const fade = Math.min(1, edge / 0.12);
      return o * ((1 - Math.cos(fade * Math.PI)) / 2);
    });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className={`absolute rounded-full backdrop-blur-sm transition-colors duration-300
            ${isDark ? 'bg-mint_green/90' : 'bg-baby_powder'}`}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.startX,
            top: bubble.startY,
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: opacityKeys(bubble.opacity, bubble.pathX.length),
            scale: 1,
            x: bubble.pathX,
            y: bubble.pathY,
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
