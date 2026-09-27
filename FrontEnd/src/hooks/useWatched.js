import { useState, useEffect, useCallback } from "react";
import {
  getWatched,
  markWatched,
  unmarkWatched
} from "../api.js";

const TOKEN_KEY = "celluloid-token";

export function useWatched(token, onNotify) {
  const [watched, setWatched] = useState(new Set());

  useEffect(() => {
  if (!token) {
    setWatched(new Set());
    return;
  }

  async function loadWatched() {
      try {
        const data = await getWatched(token);

        setWatched(
          new Set(data.map((movie) => movie.movieId))
        );
      } catch (error) {
        console.error("Failed to load watched movies:", error);
      }
    }

    loadWatched();
  }, [token]);

  const toggle = useCallback(async (id) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      onNotify("You're not logged in.\nLog in to save your watched films.");
      return;
    }

    try {
      if (watched.has(id)) {
        await unmarkWatched(token, id);

        setWatched((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await markWatched(token, id);

        setWatched((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to update watched status:", error);
    }
  }, [watched]);

  return { watched, toggle };
}