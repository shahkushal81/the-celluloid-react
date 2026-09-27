const ROMAN = ["I", "II", "III"];

export default function TrilogyModal({ trilogy, onOpenMovie, onClose }) {
  return (
    <div className="modal__backdrop trilogy-backdrop">
      <div className="trilogy-modal" role="dialog" aria-modal="true">
        <div className="trilogy-modal__shade"></div>

        <button className="modal__close trilogy-close" type="button" onClick={onClose}>×</button>

        <div className="trilogy-modal__content">
          <span className="trilogy-modal__kicker">THE ABSOLUTE TRILOGY</span>
          <h2 className="trilogy-modal__title">{trilogy.name}</h2>
          <div className="trilogy-modal__years">{trilogy.years}</div>

          <div className="trilogy-movies">
            {trilogy.movies.map((movie, i) => (
              <button
                className="trilogy-movie"
                key={i}
                type="button"
                onClick={() => onOpenMovie(movie)}
              >
                <div className="trilogy-movie__poster">
                  <img src={movie.image} alt={movie.title} />
                  <span className="trilogy-year">{movie.year}</span>
                  <span className={`trilogy-verdict ${movie.verdict === "GO FOR IT" ? "go-for-it" : "perfection"}`}>
                    {movie.verdict}
                  </span>
                </div>
                <h3 className="trilogy-movie__title">{movie.title}</h3>
              </button>
            ))}
          </div>

          <p className="trilogy-modal__hint">CHOOSE A FILM TO OPEN ITS CELLULOID ENTRY.</p>
        </div>
      </div>
    </div>
  );
}