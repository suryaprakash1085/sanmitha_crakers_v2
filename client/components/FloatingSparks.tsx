import { useMemo } from "react";

interface Props { count?: number; }

export const FloatingSparks = ({ count = 24 }: Props) => {
  const sparks = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 10,
      size: 4 + Math.random() * 8,
      hue: [6, 42, 340, 200, 25][Math.floor(Math.random() * 5)],
    })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${s.left}%`,
            bottom: 0,
            width: s.size,
            height: s.size,
            background: `hsl(${s.hue} 90% 65%)`,
            boxShadow: `0 0 ${s.size * 2}px hsl(${s.hue} 90% 65% / 0.8)`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
