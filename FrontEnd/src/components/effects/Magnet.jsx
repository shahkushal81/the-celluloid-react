import { useEffect, useRef, useState } from "react";

export default function Magnet({ children, strength = 0.3, radius = 100, className = "" }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const lim = radius + Math.max(r.width, r.height) / 2;
      if (dist < lim) {
        setPos({ x: dx * strength, y: dy * strength });
      } else if (pos.x !== 0 || pos.y !== 0) {
        setPos({ x: 0, y: 0 });
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength, radius, pos.x, pos.y]);

  return (
    <div
      ref={ref}
      className={`magnet ${className}`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: "transform 0.35s cubic-bezier(.22,1,.36,1)"
      }}
    >
      {children}
    </div>
  );
}