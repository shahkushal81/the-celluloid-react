import { useState } from "react";

export default function AuthPanel({
  open,
  onClose,
  isLoggedIn,
  celluloidCode,
  onLogin,
  onRegister,
  onLogout
}) {
  const [mode, setMode] = useState("login");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  function reset() {
    setCode("");
    setGeneratedCode("");
    setError("");
    setCopied(false);
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    reset();
  }

  async function handleLogin(e) {
    e.preventDefault();

    const value = code.trim();

    if (!value) {
      setError("Enter your Celluloid Code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onLogin(value);
      setCode("");
    } catch (err) {
      setError(err.message || "Invalid Celluloid Code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    const value = code.trim();

    if (!value) {
      setError("Choose your personal code first.");
      return;
    }

    if (value.length > 6) {
      setError("Your personal code can be up to 6 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setError("Use only letters and numbers.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await onRegister(value);
      setGeneratedCode(data.celluloidCode);
      setCode("");
    } catch (err) {
      setError(err.message || "Could not generate your code.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Could not copy the code.");
    }
  }

  return (
    <div className="auth" role="dialog" aria-modal="true">
      <div className="auth__backdrop" onClick={onClose} />

      <div className="auth__panel">
        <button
          className="auth__close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="auth__content">
          <p className="auth__pre">The Celluloid</p>

            <div className="auth__code">

                {isLoggedIn ? (
                    <strong>{celluloidCode}</strong>
                ) : (
                    <strong>Please Log In</strong>
                )}
                </div>

                {isLoggedIn ? (
                <button
                    className="auth__button"
                    type="button"
                    onClick={onLogout}
                >
                    Log Out
                </button>
                ) : (
                <>
                    <h2 className="auth__title">
                    Your <em> Celluloid</em> Id.
                    </h2>

                    <p className="auth__text">
                    Your Celluloid Code keeps your watched films with you across
                    devices. No email. No password. Just your code.
                    </p>

                    <div className="auth__tabs">
                    <button
                        type="button"
                        className={mode === "login" ? "active" : ""}
                        onClick={() => switchMode("login")}
                    >
                        I Have a Code
                    </button>

                    <button
                        type="button"
                        className={mode === "register" ? "active" : ""}
                        onClick={() => switchMode("register")}
                    >
                        Create One
                    </button>
                    </div>

                    {mode === "login" ? (
                    <form className="auth__form" onSubmit={handleLogin}>
                        <label htmlFor="celluloid-login">
                        Celluloid Code
                        </label>

                        <input
                        id="celluloid-login"
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError("");
                        }}
                        placeholder="f3se-Kush01"
                        autoComplete="off"
                        spellCheck="false"
                        />

                        <button
                        className="auth__button"
                        type="submit"
                        disabled={loading}
                        >
                        {loading ? "Checking..." : "Enter The Celluloid"}
                        </button>
                    </form>
                    ) : (
                    <form className="auth__form" onSubmit={handleRegister}>
                        <label htmlFor="celluloid-register">
                        Choose Your Personal Code
                        </label>

                        <input
                        id="celluloid-register"
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError("");
                            setGeneratedCode("");
                        }}
                        placeholder="Kush01"
                        maxLength={6}
                        autoComplete="off"
                        spellCheck="false"
                        />

                        <span className="auth__hint">
                        1–6 letters or numbers. Case-sensitive.
                        </span>

                        <button
                        className="auth__button"
                        type="submit"
                        disabled={loading}
                        >
                        {loading ? "Creating..." : "Generate My Code"}
                        </button>
                    </form>
                    )}

                    {generatedCode && (
                    <div className="auth__generated">
                        <span>Your Celluloid Code</span>
                        <strong>{generatedCode}</strong>
                    </div>
                    )}

                    {error && (
                    <p className="auth__error">
                        {error}
                    </p>
                    )}
                </>
                )}

        </div>
      </div>
    </div>
  );
}