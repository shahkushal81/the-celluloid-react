import { useEffect, useRef, useState } from "react";

export default function BlurText({ text, delay = 90, className = "", as: Tag = "span" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`blur-text ${visible ? "in" : ""} ${className}`}>
      {words.map((w, i) => (
        <span
          key={i}
          className="blur-text__word"
          style={{ transitionDelay: `${i * delay}ms` }}
        >
          {w}{i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}