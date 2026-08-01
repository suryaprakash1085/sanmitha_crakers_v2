import { ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
  /** how much the content "lifts" toward the viewer, in px */
  lift?: number;
}

/**
 * Tilt3D — wraps content in a perspective card that tilts toward the
 * cursor and lifts slightly on hover, giving a lightweight 3D feel
 * without any extra animation library. Pointer-driven, so it stays
 * snappy and reverts smoothly with a CSS transition on mouse leave.
 */
export const Tilt3D = ({ children, className = "", max = 10, lift = 14 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 -> 1
    const py = (e.clientY - rect.top) / rect.height; // 0 -> 1
    const rotateY = (px - 0.5) * max * 2;
    const rotateX = (0.5 - py) * max * 2;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] hover:drop-shadow-[0_20px_35px_rgba(207,51,212,.22)] ${className}`}
    >
      {children}
    </div>
  );
};
