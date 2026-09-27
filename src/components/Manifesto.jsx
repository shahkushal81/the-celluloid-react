import AnimatedContent from "./effects/AnimatedContent.jsx";

export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="manifesto__inner">
        <AnimatedContent stagger={120}>
          <p className="manifesto__kicker">The Manifesto</p>
          <p className="manifesto__text">
            Some films you watch. The good ones you rewatch. The great ones live in your head,{" "}
            <b>rent-free</b>. This is my log — the ones that earned a <b>verdict</b> and a note
            I had to write down.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}