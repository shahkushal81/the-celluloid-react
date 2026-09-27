export default function FranchiseCard({ franchise, index, onOpen }) {
  return (
    <button className="f-card" type="button" onClick={onOpen}>
      <div className="f-card__art">
        <img
          src={franchise.poster}
          alt={franchise.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <span className="f-card__years">{franchise.years}</span>
      </div>

      <div className="f-card__body">
        <div className="f-card__index">
          Universe {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="f-card__title">{franchise.name}</h3>
        <div className="f-card__hint">Read the note →</div>
      </div>
    </button>
  );
}