import { useMemo } from "react";
import Reveal from "./Reveal.jsx";
import MovieCard from "./MovieCard.jsx";
import TrilogyCard from "./TrilogyCard.jsx";
import FranchiseCard from "./FranchiseCard.jsx";
import { getGenres } from "../utils/deriveData.js";

export default function MainContent({
  query,
  selectedGenre,
  collections,
  allMovies,
  absolute,
  trilogies,
  franchises,
  watched,
  onToggleWatched,
  onOpenMovie,
  onOpenTrilogy,
  onOpenFranchise
}) {
  const isFiltered = query.trim() !== "" || selectedGenre !== "All Genres";

  if (isFiltered) {
    return (
      <SearchResults
        query={query}
        selectedGenre={selectedGenre}
        allMovies={allMovies}
        collections={collections}
        watched={watched}
        onToggleWatched={onToggleWatched}
        onOpenMovie={onOpenMovie}
      />
    );
  }

  return (
    <>
      {/* ── PERFECT CINEMA ── */}
      {absolute.length > 0 && (
        <section className="section" id="tier">
          <div className="wrap">
            <div className="section__head">
              <div className="section__head-left">
                <span className="section__index">01 / The Headliners</span>
                <h2 className="section__title"><b>Perfect</b> Cinema.</h2>
              </div>
              <span className="section__meta">{absolute.length} Films</span>
            </div>

            <p className="section__lede">
              The films that earned the highest verdict — no compromises, no notes.
            </p>

            <div className="films films--rail">
              {absolute.map((m, i) => (
                <Reveal key={m.id} delay={(i % 8) * 0.04}>
                  <MovieCard
                    movie={m}
                    isWatched={watched.has(m.id)}
                    onToggle={() => onToggleWatched(m.id)}
                    onOpen={() => onOpenMovie(m)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COLLECTIONS ── */}
      {collections.map((col, index) => (
        <section className="section" id={`col-${col.id}`} key={col.id}>
          <div className="wrap">
            <div className="section__head">
              <div className="section__head-left">
                <span className="section__index">
                  {String(index + 2).padStart(2, "0")} / Collection
                </span>
                <h2 className="section__title"><b>{col.name}</b></h2>
              </div>
              <span className="section__meta">{col.movies.length} Films</span>
            </div>

            {col.description && (
              <p className="section__lede">{col.description}</p>
            )}

            <div className="films">
              {col.movies.map((m, i) => (
                <Reveal key={m.id} delay={(i % 8) * 0.04}>
                  <MovieCard
                    movie={m}
                    isWatched={watched.has(m.id)}
                    onToggle={() => onToggleWatched(m.id)}
                    onOpen={() => onOpenMovie(m)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── TRILOGIES ── */}
      {trilogies.length > 0 && (
        <section className="trilogies" id="absolute-trilogies">
          <div className="wrap">
            <div className="section__head">
              <div className="section__head-left">
                <span className="section__index">The Absolute Trilogies</span>
                <h2 className="section__title">Three of a <b>kind.</b></h2>
              </div>
              <span className="section__meta">{trilogies.length} Trilogies</span>
            </div>
          </div>

          <div className="trilogies__scroll">
            {trilogies.map((t, i) => (
              <TrilogyCard
                key={t.id}
                trilogy={t}
                index={i}
                onOpen={() => onOpenTrilogy(t)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── FRANCHISE VAULT ── */}
      {franchises.length > 0 && (
        <section className="vault" id="franchise-vault">
          <div className="wrap">
            <div className="section__head">
              <div className="section__head-left">
                <span className="section__index">The Franchise Vault</span>
                <h2 className="section__title">Universes I keep <b>returning to.</b></h2>
              </div>
              <span className="section__meta">{franchises.length} Worlds</span>
            </div>

            <p className="section__lede">
              Not every film in the saga. Just one entry for each world that earned a place in my log — click to see why it matters to me.
            </p>

            <div className="vault__grid">
              {franchises.map((f, i) => (
                <FranchiseCard
                  key={f.id}
                  franchise={f}
                  index={i}
                  onOpen={() => onOpenFranchise(f)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   SEARCH RESULTS
   ══════════════════════════════════════════════════════════ */

function SearchResults({
  query,
  selectedGenre,
  allMovies,
  collections,
  watched,
  onToggleWatched,
  onOpenMovie
}) {
  const res = useMemo(() => {
    let r = allMovies;
    const q = query.trim().toLowerCase();

    if (q) {
      r = r.filter((m) => {
        const genres = getGenres(m).join(" ");
        const hay =
          m.title + " " + m.cast + " " + m.synopsis + " " + m.comment + " " +
          m.collectionName + " " + m.verdict + " " + genres;
        return hay.toLowerCase().indexOf(q) !== -1;
      });
    }

    if (selectedGenre && selectedGenre !== "All Genres") {
      if (selectedGenre === "Animation") {
        r = r.filter((m) => {
          const genres = getGenres(m);
          return (
            genres.indexOf("Animation") !== -1 ||
            m.collectionId === "animation" ||
            (m.collectionName && m.collectionName.toLowerCase().indexOf("anim") !== -1)
          );
        });
      } else {
        const col = collections.find((c) => c.name === selectedGenre);
        if (col) {
          r = r.filter((m) => m.collectionId === col.id || m.collectionName === col.name);
        }
      }
    }
    return r;
  }, [query, selectedGenre, allMovies, collections]);

  const q = query.trim();

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div className="section__head-left">
            <span className="section__index">Filter</span>
            <h2 className="section__title">
              {res.length} {res.length === 1 ? "film" : "films"}
              {q && <b> for "{q}"</b>}
              {!q && <b> in {selectedGenre}</b>}
            </h2>
          </div>
          <span className="section__meta">Results</span>
        </div>

        {res.length ? (
          <div className="films">
            {res.map((m, i) => (
              <Reveal key={m.id} delay={(i % 8) * 0.04}>
                <MovieCard
                  movie={m}
                  isWatched={watched.has(m.id)}
                  onToggle={() => onToggleWatched(m.id)}
                  onOpen={() => onOpenMovie(m)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="results__empty">Nothing matched. Try another title, cast name, or genre.</p>
        )}
      </div>
    </section>
  );
}