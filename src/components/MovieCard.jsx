import TiltedCard from "./effects/TiltedCard.jsx";
import ClickSpark from "./effects/ClickSpark.jsx";

export default function MovieCard({ movie, isWatched, onToggle, onOpen }) {
  const isPerfect = movie.verdict === "PERFECTION";

  return (
    <TiltedCard maxTilt={6} scale={1.02}>
      <article className={`film ${isWatched ? "film--watched" : ""}`}>

        <div className="film__poster">
          <button
            className="film__open"
            type="button"
            onClick={onOpen}
            aria-label={`Open ${movie.title}`}
          >
            <img
              className="poster"
              src={movie.image}
              alt={`${movie.title} poster`}
              loading="lazy"
              onError={(e) => {
                const p = e.currentTarget.parentElement.parentElement;
                if (p) p.classList.add("no-img");
              }}
            />
            <span className="film__fb">{movie.title}</span>
          </button>

          <span className={`film__stamp ${isPerfect ? "film__stamp--perfect" : ""}`}>
            {isPerfect ? "PERFECTION" : "GO FOR IT"}
          </span>

          <span className="film__year">{movie.year}</span>
        </div>

        <div className="film__matte">
          <h3 className="film__title">{movie.title}</h3>
          <p className="film__meta">{movie.cast}</p>
        </div>

        <ClickSpark
          sparkCount={10}
          sparkRadius={24}
          sparkSize={5}
          className="film__watch-wrap"
        >
          <button
            className={`film__toggle ${isWatched ? "watched" : ""}`}
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            aria-label={isWatched ? "Unmark as watched" : "Mark as watched"}
          >
            <span className="film__toggle-icon" aria-hidden="true">
              {isWatched ? "✓" : "👁"}
            </span>
            <span className="film__toggle-label">
              {isWatched ? "Watched" : "Mark as Watched"}
            </span>
          </button>
        </ClickSpark>

      </article>
    </TiltedCard>
  );
}