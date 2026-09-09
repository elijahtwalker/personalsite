import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/src/vanta.fog';
import { useTheme } from '../context/ThemeContext';

const PALETTES = {
  light: {
    highlightColor: 0xffffff,
    midtoneColor: 0xa8cee1,
    lowlightColor: 0x788cc8,
    baseColor: 0x5381aa,
  },
  dark: {
    highlightColor: 0x3c3c3c,
    midtoneColor: 0x313131,
    lowlightColor: 0x2a2a2a,
    baseColor: 0x000000,
  },
};

export default function VantaFog() {
  const containerRef = useRef(null);
  const effectRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      effectRef.current = FOG({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        blurFactor: 0.62,
        zoom: 0.9,
        ...PALETTES[isDark ? 'dark' : 'light'],
      });
    } catch {
      // No WebGL available — the flat theme background stays as-is.
      effectRef.current = null;
    }

    return () => {
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [isDark]);

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      />
      {/* Tints the fog down to the theme base so it reads as texture, not scenery.
          Matches the html background, so a WebGL-less fallback looks unchanged. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 transition-colors duration-300
          ${isDark ? 'bg-eerie_black/[0.62]' : 'bg-yinmn_blue/75'}`}
      />
    </>
  );
}
