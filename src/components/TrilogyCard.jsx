const ROMAN = ["I", "II", "III"];

export default function TrilogyCard({ trilogy, index, onOpen }) {
  return (
    <button
      className="trilogy-card"
      type="button"
      onClick={onOpen}
      aria-label={`Open ${trilogy.name}`}
    >
      <div className="trilogy-card__art">
        {trilogy.movies.map((movie, i) => (
          <img
            key={i}
            src={movie.image}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ))}
      </div>

      <div className="trilogy-card__info">
        <div>
          <div className="trilogy-card__index">
            Trilogy {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="trilogy-card__title">{trilogy.name}</h3>
          <div className="trilogy-card__years">{trilogy.years}</div>

          <ul className="trilogy-card__list">
            {trilogy.movies.map((m, i) => (
              <li key={i}>
                <span>{ROMAN[i]}</span>
                <span>{m.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <span className="trilogy-card__open">
          Open Trilogy →
        </span>
      </div>
    </button>
  );
}