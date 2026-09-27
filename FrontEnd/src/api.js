const API_BASE = "http://localhost:5155";

export async function login(celluloidCode) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      celluloidCode
    })
  });

  if (!response.ok) {
    throw new Error("Invalid Celluloid Code.");
  }

  return response.json();
}

export async function register(personalCode) {
  const response = await fetch(
    `${API_BASE}/api/auth/register?personalCode=${encodeURIComponent(personalCode)}`,
    {
      method: "POST"
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Registration failed.");
  }

  return response.json();
}

export async function getWatched(token) {
  const response = await fetch(`${API_BASE}/api/watched`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to load watched movies.");
  }

  return response.json();
}

export async function markWatched(token, movieId) {
  const response = await fetch(`${API_BASE}/api/watched`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      movieId
    })
  });

  if (!response.ok) {
    throw new Error("Failed to mark movie as watched.");
  }

  return response.json();
}

export async function unmarkWatched(token, movieId) {
  const response = await fetch(
    `${API_BASE}/api/watched/${encodeURIComponent(movieId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove movie from watched.");
  }

  return response.json();
}