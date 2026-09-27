import { useEffect, useRef, useState } from "react";

export default function ProgressBar() {
  const ref = useRef(null);

  useEffect(() => {
    function onScroll() {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      const pct = max > 0 ? d.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${pct})`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="progress" ref={ref} />;
}