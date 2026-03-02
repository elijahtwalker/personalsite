import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

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
    const N = 20;

    const baseWaypoints = [
      [0.00, 0.00],
      [0.02, 0.10],
      [0.04, 0.22],
      [0.08, 0.32],
      [0.20, 0.40],
      [0.45, 0.48],
      [0.70, 0.54],
      [0.88, 0.58],
      [0.90, 0.63],
      [0.87, 0.65],
      [0.8, 0.69],
      [0.77, 0.72],
      [0.72, 0.76],
      [0.55, 0.84],
      [0.42, 0.92],
      [0.35, 1.00],
    ];

    return Array.from({ length: 50 }, (_, i) => {
      const size = Math.random() * 150 + 50;
      const rx = (Math.random() - 0.5) * vw * 0.06;
      const ry = (Math.random() - 0.5) * pageH * 0.02;

      const scaled = baseWaypoints.map(([x, y]) => [x * vw, y * pageH * 0.95]);
      const pts = lerp(scaled, N);

      return {
        id: i,
        size,
        delay: i * 0.4,
        duration: Math.random() * 8 + 16,
        startX: Math.random() * 150,
        startY: pageH - 100 - Math.random() * 400,
        opacity: Math.random() * 0.17 + 0.03,
        pathX: pts.map(([x]) => x + rx),
        pathY: pts.map(([, y]) => -y + ry),
      };
    });
  }, []);

  const opacityKeys = (o) => {
    const arr = new Array(20).fill(o);
    arr[0] = 0;
    arr[1] = o * 0.5;
    arr[18] = o * 0.5;
    arr[19] = 0;
    return arr;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className={`absolute rounded-full backdrop-blur-sm transition-colors duration-300
            ${isDark ? 'bg-mint_green/40' : 'bg-baby_powder'}`}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.startX,
            top: bubble.startY,
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: opacityKeys(bubble.opacity),
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
