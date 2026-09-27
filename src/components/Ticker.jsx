const WORDS = ["Perfection", "Go For It", "The Celluloid"];
const ROW = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

export default function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__row">
        {ROW.map((w, i) => (
          <span className="ticker__word" key={i}>
            {w}
            <em>/</em>
          </span>
        ))}
      </div>
    </div>
  );
}