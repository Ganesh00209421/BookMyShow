/**
 * api.js
 * -----------------------------------------------------------------------
 * Centralizes all backend API calls in one place.
 *
 * In local development, requests to "/api/..." are proxied to
 * http://localhost:8080 by webpack-dev-server (see webpack.config.js).
 *
 * In production (deployed build), the frontend is served from a
 * different domain than the backend, so relative paths won't reach it.
 * We therefore point to the deployed backend's full URL instead.
 *
 * IMPORTANT: After deploying the backend (e.g. on Vercel), replace the
 * placeholder below with your actual backend URL.
 * -----------------------------------------------------------------------
 */

const PRODUCTION_API_BASE_URL = "https://your-backend-service.vercel.app";

// Webpack sets NODE_ENV to "production" automatically for `npm run build`.
export const API_BASE_URL =
  process.env.NODE_ENV === "production" ? PRODUCTION_API_BASE_URL : "";

/**
 * Fetches the most recently created booking from the backend.
 * Returns either a booking object { movie, slot, seats } or
 * { message: "no previous booking found" }.
 */
export async function getLastBooking() {
  const response = await fetch(`${API_BASE_URL}/api/booking`);
  return response.json();
}

/**
 * Submits a new booking to the backend.
 * @param {{ movie: string, slot: string, seats: object }} bookingPayload
 * @returns {Promise<Response>} the raw fetch Response (caller checks status)
 */
export async function createBooking(bookingPayload) {
  return fetch(`${API_BASE_URL}/api/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingPayload),
  });
}