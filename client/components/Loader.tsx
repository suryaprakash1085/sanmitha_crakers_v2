import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const i = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(i);
        setTimeout(() => setDone(true), 400);
      }
      setProgress(p);
    }, 180);
    return () => clearInterval(i);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-sky-festive">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-festive grid place-items-center shadow-soft animate-burst">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-festive blur-2xl opacity-60 -z-10 animate-pulse" />
          {/* burst rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-8 origin-bottom"
              style={{
                background: `linear-gradient(to top, hsl(${[6,42,340,200][i%4]} 90% 65%), transparent)`,
                transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-30px)`,
                animation: `burst 1s ease-out infinite ${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <h2 className="font-display text-3xl font-bold text-gradient-festive mb-3">Fire Crackers</h2>
        <div className="w-64 h-2 rounded-full bg-white/60 overflow-hidden shadow-card-festive">
          <div
            className="h-full bg-festive transition-all duration-300"
            style={{ width: `${progress}%`, boxShadow: "0 0 20px hsl(var(--primary))" }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3">Loading the festival… {Math.floor(progress)}%</p>
      </div>
    </div>
  );
};
