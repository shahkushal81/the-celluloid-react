import { useRef } from "react";

export default function TiltedCard({ children, maxTilt = 6, scale = 1.015, className = "" }) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const state = useRef({ rx: 0, ry: 0, mx: 50, my: 50, s: 1, active: false });
  const rect = useRef(null);

  function apply() {
    const el = ref.current;
    if (!el) return;
    const { rx, ry, mx, my, s } = state.current;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`;
    el.style.setProperty("--mx", mx + "%");
    el.style.setProperty("--my", my + "%");
    rafRef.current = null;
  }

  function schedule() {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(apply);
  }

  function onEnter() {
    const el = ref.current;
    if (!el) return;
    state.current.active = true;
    state.current.s = scale;
    // cache rect ONCE on enter
    const r = el.getBoundingClientRect();
    rect.current = { l: r.left, t: r.top, w: r.width, h: r.height };
  }

  function onMove(e) {
    if (!state.current.active || !rect.current) return;
    const r = rect.current;
    const x = (e.clientX - r.l) / r.w;
    const y = (e.clientY - r.t) / r.h;
    state.current.rx = -(y - 0.5) * maxTilt * 2;
    state.current.ry = (x - 0.5) * maxTilt * 2;
    state.current.mx = x * 100;
    state.current.my = y * 100;
    schedule();
  }

  function onLeave() {
    state.current.active = false;
    state.current.rx = 0;
    state.current.ry = 0;
    state.current.s = 1;
    rect.current = null;
    schedule();
  }

  return (
    <div
      ref={ref}
      className={`tilted-card ${className}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      <span className="tilted-card__glare" aria-hidden="true" />
    </div>
  );
}