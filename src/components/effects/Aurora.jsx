import { useEffect, useRef } from "react";

export default function Aurora({
  colorA = "#c8f24e",
  colorB = "#7cd9c4",
  baseColor = "#0a0a0c",
  speed = 1,
  className = ""
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    // Draw at 1/4 resolution, scale up via CSS — 16x fewer pixels
    function resize() {
      canvas.width = 320;
      canvas.height = 200;
    }
    resize();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const blobs = [
      { color: colorA, r: 120, sx: 0.00022, sy: 0.00028, px: 0, py: 0, yb: 0.72 },
      { color: colorB, r: 140, sx: 0.00028, sy: 0.00019, px: 2, py: 1, yb: 0.28 },
      { color: colorA, r: 100, sx: 0.00018, sy: 0.00024, px: 4, py: 3, yb: 0.5 }
    ];

    // 15fps — plenty for a slow drift
    const FRAME_MS = 1000 / 15;
    let lastFrame = 0;

    function draw(now) {
      if (now - lastFrame < FRAME_MS) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      for (const b of blobs) {
        const cx = w * (0.5 + Math.sin(t * b.sx + b.px) * 0.35);
        const cy = h * (b.yb + Math.cos(t * b.sy + b.py) * 0.15);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        g.addColorStop(0, hexA(b.color, 0.55));
        g.addColorStop(0.5, hexA(b.color, 0.15));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      t += 16 * speed;
      if (!prefersReduced) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [colorA, colorB, baseColor, speed]);

  return <canvas ref={ref} className={`aurora ${className}`} aria-hidden="true" />;
}

function hexA(hex, a) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}