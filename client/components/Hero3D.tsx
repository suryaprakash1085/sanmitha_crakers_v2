import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Hero3D — a CSS/canvas 3D orbiting firework display for the hero section.
 * Three rings of colour orbs orbit at different speeds and tilts,
 * giving a deep-space gyroscope feel on a white background.
 */

const ORBS = [
  // ring 1 — tight, fast, pink/magenta
  { ring: 1, hue: 316, size: 14, dur: 4.5,  delay: 0,    tiltX: 60 },
  { ring: 1, hue: 316, size: 10, dur: 4.5,  delay: 1.5,  tiltX: 60 },
  { ring: 1, hue:  23, size: 12, dur: 4.5,  delay: 3,    tiltX: 60 },
  // ring 2 — medium, slower, purple/orange
  { ring: 2, hue: 263, size: 16, dur: 7,    delay: 0,    tiltX: 30 },
  { ring: 2, hue:  43, size: 12, dur: 7,    delay: 2.3,  tiltX: 30 },
  { ring: 2, hue: 200, size: 10, dur: 7,    delay: 4.6,  tiltX: 30 },
  // ring 3 — wide, slowest, multi-colour
  { ring: 3, hue:   6, size: 18, dur: 11,   delay: 0,    tiltX: 15 },
  { ring: 3, hue: 140, size: 12, dur: 11,   delay: 3.7,  tiltX: 15 },
  { ring: 3, hue: 340, size: 14, dur: 11,   delay: 7.3,  tiltX: 15 },
];

const RING_RADIUS = [60, 100, 148];

export const Hero3D = () => (
  <div
    className="relative flex items-center justify-center"
    style={{ width: 340, height: 340, perspective: "800px" }}
  >
    {/* Central glow */}
    <motion.div
      animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.8, 0.55] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute rounded-full"
      style={{
        width: 80,
        height: 80,
        background: "radial-gradient(circle, hsl(316 91% 60%), hsl(263 70% 55%) 60%, transparent 100%)",
        filter: "blur(14px)",
      }}
    />

    {/* Central icon */}
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute z-10 flex items-center justify-center rounded-full text-4xl shadow-xl"
      style={{
        width: 56,
        height: 56,
        background: "linear-gradient(135deg, hsl(316 91% 55%), hsl(263 70% 55%))",
        boxShadow: "0 0 32px hsl(316 91% 55% / .4), 0 0 60px hsl(263 70% 55% / .2)",
      }}
    >
      🎆
    </motion.div>

    {/* Orbiting rings */}
    {ORBS.map((orb, i) => {
      const r = RING_RADIUS[orb.ring - 1];
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: r * 2,
            height: r * 2,
            top: "50%",
            left: "50%",
            marginTop: -r,
            marginLeft: -r,
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: orb.dur, delay: -orb.delay, repeat: Infinity, ease: "linear" }}
        >
          {/* The orb itself sits at the "right edge" of its ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              right: 0,
              top: "50%",
              marginTop: -orb.size / 2,
              background: `hsl(${orb.hue} 90% 60%)`,
              boxShadow: `0 0 ${orb.size * 2}px hsl(${orb.hue} 90% 60% / .7), 0 0 ${orb.size}px hsl(${orb.hue} 90% 70%)`,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      );
    })}

    {/* Ring track circles (decorative) */}
    {RING_RADIUS.map((r, i) => (
      <div
        key={i}
        className="absolute rounded-full border border-dashed pointer-events-none"
        style={{
          width: r * 2,
          height: r * 2,
          top: "50%",
          left: "50%",
          marginTop: -r,
          marginLeft: -r,
          borderColor: `hsl(${[316, 263, 6][i]} 60% 70% / .18)`,
        }}
      />
    ))}

    {/* Pulse rings */}
    {[0, 1].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-pink-300/30 pointer-events-none"
        style={{ width: 160, height: 160, top: "50%", left: "50%", marginTop: -80, marginLeft: -80 }}
        animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
        transition={{ duration: 3, delay: i * 1.5, repeat: Infinity, ease: "easeOut" }}
      />
    ))}
  </div>
);
