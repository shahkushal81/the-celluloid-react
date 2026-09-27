import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import AuthPanel from "./components/AuthPanel.jsx";
import {
  COLLECTIONS,
  ALL,
  ABSOLUTE,
  TRILOGIES,
  FRANCHISES,
  getGenreList
} from "./utils/deriveData.js";
import { useWatched } from "./hooks/useWatched.js";
import ProgressBar from "./components/ProgressBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Hero from "./components/Hero.jsx";
import Ticker from "./components/Ticker.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MainContent from "./components/MainContent.jsx";
import Manifesto from "./components/Manifesto.jsx";
import AboutPanel from "./components/AboutPanel.jsx";
import MovieModal from "./components/MovieModal.jsx";
import TrilogyModal from "./components/TrilogyModal.jsx";
import FranchiseModal from "./components/FranchiseModal.jsx";

export default function App() {
  
  const {
    token,
    celluloidCode,
    isLoggedIn,
    login,
    register,
    logout
  } = useAuth();

  const { watched, toggle } = useWatched(
    token,
    (message) => setNotification(message)
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [modal, setModal] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const pct = ALL.length ? Math.round((watched.size / ALL.length) * 100) : 0;

    useEffect(() => {
    // Preload all fonts the download canvases need — ONCE, at app startup.
    // By the time the user clicks Download, they're already in cache.
    const fonts = [
      "800 30px Archivo",
      "500 16px 'JetBrains Mono'",
      "800 28px 'JetBrains Mono'",
      "italic 900 104px Fraunces",
      "400 28px Archivo",
      "700 26px 'JetBrains Mono'",
      "700 18px 'JetBrains Mono'",
      "italic 400 38px Fraunces",
      "700 22px 'JetBrains Mono'",
      "500 20px 'JetBrains Mono'",
      "900 380px Fraunces",
      "300 180px Fraunces",
      "700 20px 'JetBrains Mono'",
      "900 110px Fraunces",
      "italic 900 138px Fraunces"
    ];
    fonts.forEach((f) => document.fonts.load(f).catch(() => {}));
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem("celluloid-code");

    if (!savedCode) {
      setAuthOpen(true);
    }
  }, []);

    useEffect(() => {
      if (!notification) return;

      const timer = setTimeout(() => {
        setNotification(null);
      }, 3500);

      return () => clearTimeout(timer);
    }, [notification]);

  useEffect(() => {
    if (modal || aboutOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [modal, aboutOpen]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setModal(null);
        setAboutOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function openMovie(movie, fromTrilogyId = null) {
    setModal({ type: "movie", movie, fromTrilogyId });
  }

  function openTrilogy(trilogy) {
    setModal({ type: "trilogy", trilogy });
  }

  function openFranchise(franchise) {
    setModal({ type: "franchise", franchise });
  }

  function closeModal() {
    setModal(null);
  }

  function backToTrilogy() {
    if (!modal || modal.type !== "movie" || !modal.fromTrilogyId) return;
    const trilogy = TRILOGIES.find((t) => t.id === modal.fromTrilogyId);
    if (trilogy) setModal({ type: "trilogy", trilogy });
  }

  function handleGenreChip(genre) {
    setModal(null);
    setQuery(genre);
    setSelectedGenre("All Genres");
    setTimeout(() => {
      const el = document.getElementById("search");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

    return (
    <>
      <ProgressBar />

      <div className="app">
        <Sidebar
          score={pct}
          totalMovies={ALL.length}
          watchedCount={watched.size}
          celluloidCode={celluloidCode}
          isLoggedIn={isLoggedIn}
          onLogout={logout}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenAuth={() => setAuthOpen(true)}
        />

        <main className="main">
          <Hero
            totalMovies={ALL.length}
            totalCollections={COLLECTIONS.length}
            totalUniverses={FRANCHISES.length}
            totalAbsolute={ABSOLUTE.length}
            watchedSize={watched.size}
            allMovies={ALL}
            onOpenMovie={(m) => openMovie(m)}
          />

          <Ticker />

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            genres={getGenreList()}
            totalMovies={ALL.length}
          />

          <MainContent
            query={query}
            selectedGenre={selectedGenre}
            collections={COLLECTIONS}
            allMovies={ALL}
            absolute={ABSOLUTE}
            trilogies={TRILOGIES}
            franchises={FRANCHISES}
            watched={watched}
            onToggleWatched={toggle}
            onOpenMovie={openMovie}
            onOpenTrilogy={openTrilogy}
            onOpenFranchise={openFranchise}
          />

          <Manifesto />
        </main>
      </div>

      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <AuthPanel
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        isLoggedIn={isLoggedIn}
        celluloidCode={celluloidCode}
        onLogin={login}
        onRegister={register}
        onLogout={logout}
      />

      {notification && (
        <div className="celluloid-notification">
          {notification}
        </div>
      )}

      {modal?.type === "movie" && (
        <MovieModal
          movie={modal.movie}
          fromTrilogy={!!modal.fromTrilogyId}
          onClose={closeModal}
          onBack={backToTrilogy}
          onGenreChip={handleGenreChip}
        />
      )}

      {modal?.type === "trilogy" && (
        <TrilogyModal
          trilogy={modal.trilogy}
          onOpenMovie={(m) => openMovie(m, modal.trilogy.id)}
          onClose={closeModal}
        />
      )}

      {modal?.type === "franchise" && (
        <FranchiseModal
          franchise={modal.franchise}
          onClose={closeModal}
        />
      )}
    </>
  );
}