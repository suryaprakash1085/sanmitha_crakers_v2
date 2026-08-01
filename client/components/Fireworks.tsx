import { useEffect, useRef } from "react";

/**
 * Fireworks — full-viewport canvas animation.
 *
 * Rockets "fire" up from the bottom of the screen leaving a glowing trail,
 * then burst into a shower of particles that arc outward and fall under
 * gravity. Each particle carries a random "depth" (z) value which drives
 * its scale, blur and opacity — a cheap pseudo-3D trick that makes some
 * sparks read as close/bright and others as far/faint, instead of every
 * burst looking like a flat 2D circle.
 *
 * Renders fixed + pointer-events:none IN FRONT of all page content
 * (text, cards, cart icon, etc.) on every page (Home, About, Contact,
 * Products, Quick Order, Checkout, Offers, Services all share this via
 * <Layout />), while still letting clicks pass through to whatever is
 * underneath. It sits below the cart drawer / modals so those still work
 * normally when open.
 */

// const HUES = [6, 42, 340, 200, 25, 48];
const HUES = [0, 20, 45, 60, 90, 140, 175, 200, 230, 270, 300, 330];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // pseudo-depth 0.3 (far) -> 1.3 (near)
  hue: number;
  life: number;
  maxLife: number;
  size: number;
  shape: "ring" | "star" | "willow";
};

type Rocket = {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  hue: number;
  trail: { x: number; y: number }[];
};

export const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let rockets: Rocket[] = [];
    let particles: Particle[] = [];
    let raf = 0;
    let lastLaunch = 0;
    let running = true;

    const launchRocket = () => {
      const hue = HUES[Math.floor(Math.random() * HUES.length)];
      const x = width * 0.12 + Math.random() * width * 0.76;
      const targetY = height * 0.14 + Math.random() * height * 0.32;
      rockets.push({
        x,
        y: height + 10,
        targetY,
        vy: -(7.5 + Math.random() * 2.5),
        hue,
        trail: [],
      });
    };

    // const explode = (x: number, y: number, hue: number) => {
    //   const count = 46 + Math.floor(Math.random() * 30);
    //   for (let i = 0; i < count; i++) {
    //     const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
    //     const speed = 1.6 + Math.random() * 3.4;
    //     const z = 0.3 + Math.random() * 1.0;
    //     particles.push({
    //       x,
    //       y,
    //       vx: Math.cos(angle) * speed * z,
    //       vy: Math.sin(angle) * speed * z,
    //       z,
    //       hue: hue + (Math.random() * 18 - 9),
    //       life: 0,
    //       maxLife: 55 + Math.random() * 35,
    //       size: (1.2 + Math.random() * 1.8) * z,
    //     });
    //   }
    // };


    const explode = (x: number, y: number, hue: number) => {
      const count = 110 + Math.floor(Math.random() * 90);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
     const speed = 1.6 + Math.random() * 4.4;
    const z = 0.3 + Math.random() * 1.0;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed * z,
      vy: Math.sin(angle) * speed * z,
      z,
      hue: HUES[Math.floor(Math.random() * HUES.length)], // multicolor per particle
      life: 0,
      maxLife: 55 + Math.random() * 35,
      size: (1.2 + Math.random() * 1.8) * z,
       shape: Math.random() > .72 ? "star" : Math.random() > .78 ? "willow" : "ring",
    });
  }
};


    const step = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

       if (t - lastLaunch > 720 + Math.random() * 900 && rockets.length < 5) {
        launchRocket();
        lastLaunch = t;
      }

      rockets = rockets.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();
        r.y += r.vy;
        r.vy += 0.02;

        for (let i = 0; i < r.trail.length; i++) {
          const p = r.trail[i];
          const alpha = (i / r.trail.length) * 0.6;
          ctx.fillStyle = `hsla(${r.hue}, 95%, 62%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `hsl(${r.hue}, 100%, 70%)`;
        ctx.shadowColor = `hsl(${r.hue}, 100%, 60%)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.hue);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => {
        p.life++;
         p.vy += p.shape === "willow" ? 0.075 : 0.045;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.max(0, (1 - lifeRatio) * p.z);
        if (alpha <= 0.01) return false;

         ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 92%, ${58 + p.z * 10}%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
        ctx.shadowBlur = 6 * p.z;
         if (p.shape === "star") {
           ctx.moveTo(p.x, p.y - p.size * 2.2);
           for (let i = 1; i < 10; i++) {
             const a = -Math.PI / 2 + i * Math.PI / 5;
             const r = i % 2 ? p.size * .8 : p.size * 2.2;
             ctx.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
           }
           ctx.fill();
         } else {
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
           ctx.fill();
         }
        ctx.shadowBlur = 0;

        return true;
      });

      raf = requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(step);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[55] pointer-events-none opacity-80"
    />
  );
};