import { RAW_COLLECTIONS, RAW_FRANCHISES, RAW_TRILOGIES } from "../data.js";

function fix(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return "/" + path;
}

export const COLLECTIONS = RAW_COLLECTIONS.map((col) => ({
  ...col,
  themeImage: fix(col.themeImage),
  movies: col.movies.map((m, i) => ({
    ...m,
    id: col.id + "-" + i,
    collectionName: col.name,
    collectionId: col.id,
    image: fix(m.image)
  }))
}));

export const ALL = COLLECTIONS.flatMap((c) => c.movies);

export const ABSOLUTE = ALL.filter((m) => m.verdict === "PERFECTION");

export const TRILOGIES = RAW_TRILOGIES.map((t) => ({
  ...t,
  poster: fix(t.poster),
  movies: t.movies.map((m, i) => ({
    ...m,
    id: "trilogy-" + t.id + "-" + i,
    collectionName: t.name,
    collectionId: t.id,
    image: fix(m.image)
  }))
}));

export const FRANCHISES = RAW_FRANCHISES.map((f) => ({
  ...f,
  poster: fix(f.poster)
}));

export const BY_ID = {};
ALL.forEach((m) => (BY_ID[m.id] = m));
TRILOGIES.forEach((t) => t.movies.forEach((m) => (BY_ID[m.id] = m)));

export function getGenres(movie) {
  return movie.genres || movie.genre || [];
}

export function getGenreList() {
  const list = ["All Genres"];
  COLLECTIONS.forEach((c) => list.push(c.name));
  return list;
}