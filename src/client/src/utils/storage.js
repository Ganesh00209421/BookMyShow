/**
 * storage.js
 * -----------------------------------------------------------------------
 * Wraps browser localStorage access for the user's in-progress selection
 * (movie, slot, seat counts). Storing these lets the selection survive
 * a page reload. Each field is stored under its own key, as required
 * by the assignment spec.
 * -----------------------------------------------------------------------
 */

const KEYS = {
  MOVIE: "movie",
  SLOT: "slot",
  SEATS: "seats",
};

export function saveMovie(movie) {
  localStorage.setItem(KEYS.MOVIE, movie);
}

export function saveSlot(slot) {
  localStorage.setItem(KEYS.SLOT, slot);
}

export function saveSeats(seatCounts) {
  localStorage.setItem(KEYS.SEATS, JSON.stringify(seatCounts));
}

/**
 * Reads any previously saved selection from localStorage.
 * Returns { movie, slot, seats } where each field may be null/undefined
 * if it was never saved.
 */
export function loadSelection() {
  const movie = localStorage.getItem(KEYS.MOVIE);
  const slot = localStorage.getItem(KEYS.SLOT);
  const seatsRaw = localStorage.getItem(KEYS.SEATS);
  return {
    movie,
    slot,
    seats: seatsRaw ? JSON.parse(seatsRaw) : null,
  };
}

/** Clears the saved selection after a successful booking. */
export function clearSelection() {
  localStorage.removeItem(KEYS.MOVIE);
  localStorage.removeItem(KEYS.SLOT);
  localStorage.removeItem(KEYS.SEATS);
}