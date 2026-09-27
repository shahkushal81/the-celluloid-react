import { useEffect, useState } from "react";
import PixelTransition from "./effects/PixelTransition.jsx";
import { getGenres } from "../utils/deriveData.js";
import { downloadMovieShare } from "../utils/share.js";

export default function MovieModal({ movie, fromTrilogy, onClose, onBack, onGenreChip }) {
  const [pixelActive, setPixelActive] = useState(true);
  const genres = getGenres(movie);
  const isPerfect = movie.verdict === "PERFECTION";

  useEffect(() => {
    const t = setTimeout(() => setPixelActive(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PixelTransition active={pixelActive} gridSize={24} duration={750} />

      <div className="modal__backdrop">
        {/* Left: poster */}
        <div className="modal__art">
          <img src={movie.image} alt={`${movie.title} poster`} />
        </div>

        {/* Right: editorial */}
        <div className="modal__content">
          <div className="modal__top">
            <span className="modal__kicker">
              {fromTrilogy ? "From the Trilogy" : (movie.collectionName || "")}
            </span>
            <span className={`modal__stamp ${isPerfect ? "perfection" : ""}`}>
              {movie.verdict}
            </span>
          </div>

          <h2 className="modal__title">{movie.title}</h2>

          <div className="modal__meta">
            <span>{movie.year}</span>
            <span>{movie.cast}</span>
          </div>

          {genres.length > 0 && (
            <div className="modal__genres">
              {genres.map((g, i) => (
                <button
                  className="genre-chip"
                  key={i}
                  type="button"
                  onClick={() => onGenreChip(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          <p className="modal__body-copy">{movie.synopsis}</p>

          <div className="modal__quote">
            {movie.comment}
          </div>

          <div className="modal__actions">
            <button
              className="modal__btn modal__btn--primary"
              type="button"
              onClick={() => downloadMovieShare(movie)}
            >
              Share as Image
            </button>
            {fromTrilogy && (
              <button
                className="modal__btn modal__btn--ghost"
                type="button"
                onClick={onBack}
              >
                ← Back to Trilogy
              </button>
            )}
          </div>
        </div>

        <button className="modal__close" type="button" onClick={onClose} aria-label="Close">×</button>
      </div>
    </>
  );
}