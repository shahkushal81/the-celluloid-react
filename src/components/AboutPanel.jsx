import { useEffect, useState } from "react";
import AnimatedContent from "./effects/AnimatedContent.jsx";

const GMAIL_URL = (subject, body) =>
  "https://mail.google.com/mail/?view=cm&fs=1" +
  "&to=" + encodeURIComponent("phantomfreak049@gmail.com") +
  "&su=" + encodeURIComponent(subject) +
  "&body=" + encodeURIComponent(body);

export default function AboutPanel({ open, onClose }) {
  const [movie, setMovie] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);

  function handleEmail() {
    const m = movie.trim(), n = name.trim(), nt = note.trim();
    if (!m) { setError(true); return; }
    setError(false);
    const lines = ["Film suggestion for The Celluloid:", "", m];
    if (nt) lines.push("", nt);
    if (n) lines.push("", "— " + n);
    window.open(GMAIL_URL("Film suggestion: " + m, lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`about ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="about__close" type="button" onClick={onClose} aria-label="Close">×</button>

      <div className="about__inner">
        <AnimatedContent stagger={110}>
          <p className="about__pre">About</p>
          <h1 className="about__title">
            About <em>THE CELLULOID.</em>
          </h1>
          <p className="about__lede">
            Hi, I'm Kushal — a movie lover who believes great stories deserve to be remembered.
          </p>
          <div className="about__body">
            <p>
              The Celluloid is my personal collection of films and TV shows that have genuinely
              stayed with me. Every recommendation reflects my own experience — no algorithms,
              no paid promotions, no ratings chasing. Just honest picks.
            </p>
            <p>
              Whether you're searching for your next favorite film or simply exploring cinema,
              welcome to <b>The Celluloid.</b>
            </p>
          </div>

          <div className="wall">
            <p className="wall__kicker">Suggestion Wall</p>
            <h3 className="wall__title">Got a film I should watch?</h3>
            <p className="wall__sub">Drop it below.</p>

            <div className="wall__form">
              <input
                className="wall__input"
                type="text"
                placeholder="Film or franchise title"
                value={movie}
                onChange={(e) => { setMovie(e.target.value); if (e.target.value.trim()) setError(false); }}
              />
              <input
                className="wall__input"
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="wall__input wall__area"
                placeholder="Why I should watch it (optional)"
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <p className={`wall__error ${error ? "show" : ""}`}>
                Please add a film title first.
              </p>
              <div className="wall__actions">
                <button className="wall__btn" type="button" onClick={handleEmail}>
                  Send via Email
                </button>
              </div>
            </div>

            <div className="wall__contact">
              <span>Or reach me directly —</span>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=phantomfreak049@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                phantomfreak049@gmail.com
              </a>
            </div>
          </div>

          <p className="about__sign">— Kushal Shah</p>
        </AnimatedContent>
      </div>
    </div>
  );
}