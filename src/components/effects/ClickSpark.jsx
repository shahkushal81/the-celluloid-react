import { useEffect, useRef } from "react";

export default function ClickSpark({
  children,
  sparkColor = "#c8f24e",
  sparkCount = 8,
  sparkRadius = 22,
  sparkSize = 6,
  duration = 420,
  className = ""
}) {
  const canvasRef = useRef(null);
  const sparks = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function tick(now) {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      sparks.current = sparks.current.filter((s) => {
        const p = (now - s.start) / duration;
        if (p >= 1) return false;
        const dist = p * sparkRadius;
        const x1 = s.x + Math.cos(s.angle) * dist;
        const y1 = s.y + Math.sin(s.angle) * dist;
        const x2 = s.x + Math.cos(s.angle) * (dist + sparkSize);
        const y2 = s.y + Math.sin(s.angle) * (dist + sparkSize);
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [sparkColor, sparkSize, sparkRadius, duration]);

  function onClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const start = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparks.current.push({
        x, y,
        angle: (i / sparkCount) * Math.PI * 2,
        start
      });
    }
  }

  return (
    <span className={`click-spark ${className}`} onClick={onClick}>
      {children}
      <canvas ref={canvasRef} className="click-spark__canvas" />
    </span>
  );
}