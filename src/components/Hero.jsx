import { useMemo } from "react";
import Aurora from "./effects/Aurora.jsx";
import BlurText from "./effects/BlurText.jsx";
import CountUp from "./effects/CountUp.jsx";
import Magnet from "./effects/Magnet.jsx";
import { downloadScoreShare } from "../utils/share.js";

export default function Hero({
  totalMovies,
  totalCollections,
  totalUniverses,
  totalAbsolute,
  watchedSize,
  allMovies,
  onOpenMovie
}) {
  const pct = totalMovies ? Math.round((watchedSize / totalMovies) * 100) : 0;

  const stripPosters = useMemo(() => {
    const pool = allMovies.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    return pool.slice(0, 14);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShare() {
    downloadScoreShare({ watchedCount: watchedSize, totalCount: totalMovies, allMovies });
  }

  return (
    <section className="hero" id="top">
      <Aurora className="hero__aurora" />

      <div className="wrap">
        <div className="hero__inner">

          {/* ── Left: Editorial headline ── */}
          <div className="hero__left">
            <div className="hero__pre">A Personal Film Log</div>

            <h1 className="hero__title">
              <em>The</em><br />
              <b>Celluloid</b><span className="dot">.</span>
            </h1>

            <p className="hero__sub">
              A screening room for one obsessive. <b>{totalMovies} films</b> across{" "}
              <b>{totalCollections} collections</b> — verdicts, obsessions, and the movies
              I won't shut up about.
            </p>

            <div className="hero__actions">
              <a className="btn" href="#tier">
                Browse the log
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="btn btn--ghost" href="#search">Search</a>
            </div>
          </div>

          {/* ── Right: Score card ── */}
          <div className="hero__right">
            <div className="score">
              <div className="score__label">Your Celluloid Score</div>
              <div className="score__value">
                <CountUp to={pct} />
                <span>%</span>
              </div>
              <p className="score__detail">
                You've watched {watchedSize} of {totalMovies} films in the log.
              </p>

              <div className="score__bar">
                <div className="score__bar-fill" style={{ width: `${pct}%` }} />
              </div>

              <Magnet strength={0.2} radius={70}>
                <button
                  className="score__share"
                  type="button"
                  onClick={handleShare}
                >
                  Download Score
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
                    <path d="M12 4v12M6 12l6 6 6-6M5 20h14" />
                  </svg>
                </button>
              </Magnet>
            </div>
          </div>
        </div>

        {/* ── Poster ticker ── */}
        <div className="hero__strip">
          <div className="hero__strip-label">Now in rotation</div>
          {stripPosters.map((m, i) => (
            <button
              key={i}
              className="hero__strip-poster"
              type="button"
              onClick={() => onOpenMovie(m)}
              aria-label={`Open ${m.title}`}
            >
              <img
                src={m.image}
                alt={m.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}