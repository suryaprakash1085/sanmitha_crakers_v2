import { ButtonHTMLAttributes, useState } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const SparkButton = ({ children, variant = "primary", className = "", onClick, ...rest }: Props) => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setBursts((b) => [...b, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 800);
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`${variant === "primary" ? "btn-spark" : "btn-outline-festive"} ${className}`}
      {...rest}
    >
      {children}
      {bursts.map((b) => (
        <span key={b.id} className="absolute pointer-events-none" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 12;
            const dist = 30 + Math.random() * 20;
            const hue = [6, 42, 340, 200][i % 4];
            return (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: `hsl(${hue} 90% 65%)`,
                  boxShadow: `0 0 8px hsl(${hue} 90% 65%)`,
                  animation: `spark-fly 0.8s ease-out forwards`,
                  ["--tx" as any]: `${Math.cos(angle) * dist}px`,
                  ["--ty" as any]: `${Math.sin(angle) * dist}px`,
                }}
              />
            );
          })}
        </span>
      ))}
      <style>{`@keyframes spark-fly{to{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}`}</style>
    </button>
  );
};
