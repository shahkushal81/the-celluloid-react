import { useEffect, useState } from "react";

export default function PixelTransition({ active, gridSize = 18, duration = 700 }) {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    if (!active) { setCells([]); return; }
    const total = gridSize * gridSize;
    const arr = [];
    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const cx = gridSize / 2, cy = gridSize / 2;
      const d = Math.hypot(row - cy, col - cx) / (gridSize / 2);
      arr.push({ i, delay: d * duration * 0.35 });
    }
    setCells(arr);
  }, [active, gridSize, duration]);

  if (!active) return null;

  return (
    <div
      className="pixel-transition"
      aria-hidden="true"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }}
    >
      {cells.map((c) => (
        <span
          key={c.i}
          className="pixel-transition__cell"
          style={{
            animationDelay: `${c.delay}ms`,
            animationDuration: `${duration}ms`
          }}
        />
      ))}
    </div>
  );
}