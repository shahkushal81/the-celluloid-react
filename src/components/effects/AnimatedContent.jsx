import { useEffect, useRef, useState } from "react";

export default function AnimatedContent({ children, stagger = 100, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={`animated-content ${visible ? "in" : ""} ${className}`}>
      {items.map((child, i) => (
        <div
          key={i}
          className="animated-content__item"
          style={{ transitionDelay: `${i * stagger}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}