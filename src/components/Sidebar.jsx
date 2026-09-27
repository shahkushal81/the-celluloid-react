import { useEffect, useState } from "react";
import ClickSpark from "./effects/ClickSpark.jsx";

export default function Sidebar({
  score,
  totalMovies,
  watchedCount,
  celluloidCode,
  isLoggedIn,
  onLogout,
  onOpenAuth,
  onOpenAbout
}) {
  return (
    <aside className="sidebar">
      <ClickSpark sparkCount={8} sparkRadius={18}>
        <a className="sidebar__mark" href="#top">TC</a>
      </ClickSpark>

      <button
        className="sidebar__spine"
        type="button"
        onClick={onOpenAuth}
      >
        <span>MENU</span>
      </button>

      <div className="sidebar__bottom">
        <button
          className="sidebar__about"
          type="button"
          onClick={onOpenAbout}
          aria-label="About"
        >
          <span>☰</span>
        </button>
      </div>
    </aside>
  );
}