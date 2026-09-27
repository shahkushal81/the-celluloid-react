import { useEffect, useRef, useState } from "react";

export default function CountUp({ to, duration = 1400, className = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const hasStarted = useRef(false);
  const lastTo = useRef(0);
  const rafRef = useRef(null);

  function animate(from, target, dur) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  // Initial count-up on first viewport entry
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          lastTo.current = to;
          animate(0, to, duration);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respond to changes AFTER the initial animation
  useEffect(() => {
    if (!hasStarted.current) return;
    if (to === lastTo.current) return;
    const from = lastTo.current;
    lastTo.current = to;
    animate(from, to, 500); // quick 500ms transition for updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return <span ref={ref} className={className}>{val}</span>;
}