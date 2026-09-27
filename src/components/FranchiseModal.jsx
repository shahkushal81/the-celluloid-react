export default function FranchiseModal({ franchise, onClose }) {
  return (
    <div className="modal__backdrop">
      <div className="modal__art">
        <img src={franchise.poster} alt={franchise.name} />
      </div>

      <div className="modal__content">
        <div className="modal__top">
          <span className="modal__kicker">The Franchise Vault</span>
        </div>

        <h2 className="modal__title">{franchise.name}</h2>

        <div className="modal__meta">
          <span>{franchise.years}</span>
        </div>

        <div className="f-modal__note" style={{
          whiteSpace: "pre-line",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "1rem",
          lineHeight: 1.7,
          color: "var(--text-2)",
          marginBottom: "2rem",
          maxWidth: "62ch"
        }}>
          {franchise.watchNote}
        </div>

        <div className="modal__actions">
          <button className="modal__btn modal__btn--ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <button className="modal__close" type="button" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}