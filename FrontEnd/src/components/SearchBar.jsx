import { useEffect, useRef, useState } from "react";

export default function SearchBar({
  query,
  onQueryChange,
  selectedGenre,
  onGenreChange,
  genres,
  totalMovies
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <section className="cmd" id="search">
      <div className="wrap">
        <div className="cmd__field">

          <div className="cmd__genre" ref={wrapRef}>
            <button
              className="cmd__genre-btn"
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            >
              <span>{selectedGenre}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div className={`cmd__dropdown ${open ? "open" : ""}`}>
              {genres.map((g) => (
                <button
                  key={g}
                  className={`cmd__dropdown-item ${g === selectedGenre ? "active" : ""}`}
                  type="button"
                  onClick={() => { onGenreChange(g); setOpen(false); }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <svg className="cmd__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            className="cmd__input"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={`Search ${totalMovies} films, cast, tags or collections…`}
          />

          {query && (
            <button
              className="cmd__clear"
              type="button"
              onClick={() => onQueryChange("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </section>
  );
}