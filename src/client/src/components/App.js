import React, { useState, useEffect } from "react";
import '../styles/App.css';
import '../styles/bootstrap.min.css'
import { movies, slots, seats } from "./data";
import MovieSelector from "./MovieSelector";
import SlotSelector from "./SlotSelector";
import SeatSelector from "./SeatSelector";
import LastBooking from "./LastBooking";
import { getLastBooking, createBooking } from "../utils/api";
import {
  saveMovie,
  saveSlot,
  saveSeats,
  loadSelection,
  clearSelection as clearStoredSelection,
} from "../utils/storage";

/**
 * App
 * -----------------------------------------------------------------------
 * Top-level component. Owns all booking-related state and business
 * logic; delegates rendering of each section to a focused child
 * component (MovieSelector, SlotSelector, SeatSelector, LastBooking).
 * -----------------------------------------------------------------------
 */

// Returns a fresh, empty seat-counts object, e.g. { A1: '', A2: '', ... }
const emptySeats = () => {
  const obj = {};
  seats.forEach((seatType) => { obj[seatType] = ''; });
  return obj;
};

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [seatCounts, setSeatCounts] = useState(emptySeats());
  const [lastBooking, setLastBooking] = useState(null); // { movie, slot, seats } or null

  // On first render: restore any in-progress selection from localStorage,
  // and fetch the last booking from the server (only once, on load).
  useEffect(() => {
    const saved = loadSelection();
    if (saved.movie) setSelectedMovie(saved.movie);
    if (saved.slot) setSelectedSlot(saved.slot);
    if (saved.seats) setSeatCounts(saved.seats);

    getLastBooking()
      .then((data) => {
        setLastBooking(data.message === 'no previous booking found' ? null : data);
      })
      .catch((err) => console.log('error fetching last booking', err));
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    saveMovie(movie);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    saveSlot(slot);
  };

  const handleSeatChange = (seatType, value) => {
    const updated = { ...seatCounts, [seatType]: value };
    setSeatCounts(updated);
    saveSeats(updated);
  };

  const resetSelection = () => {
    setSelectedMovie('');
    setSelectedSlot('');
    setSeatCounts(emptySeats());
    clearStoredSelection();
  };

  // A booking is valid once a movie + slot are picked and at least
  // one seat type has a count greater than zero.
  const isBookingValid = () => {
    if (!selectedMovie || !selectedSlot) return false;
    const totalSeats = Object.values(seatCounts)
      .reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    return totalSeats > 0;
  };

  const handleBookNow = async () => {
    if (!isBookingValid()) return;

    // Convert seat count strings to numbers before sending to the API.
    const numericSeats = {};
    seats.forEach((seatType) => {
      numericSeats[seatType] = parseInt(seatCounts[seatType]) || 0;
    });

    const bookingPayload = {
      movie: selectedMovie,
      seats: numericSeats,
      slot: selectedSlot
    };

    try {
      const res = await createBooking(bookingPayload);

      if (res.status === 200) {
        // Update "last booking" directly from what we just sent -
        // avoids a redundant GET request, per the assignment spec.
        setLastBooking(bookingPayload);
        resetSelection();
      }
    } catch (err) {
      console.log('error while booking', err);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="brand-row">
          <span className="brand-icon">🎬</span>
          <h2>Book that show!!</h2>
        </div>
        <div className="tagline">Pick a movie · Pick a slot · Pick your seats</div>
      </div>
      <div className="film-strip"></div>

      <div className="content-grid">
        <div className="main-panel">
          <MovieSelector
            movies={movies}
            selectedMovie={selectedMovie}
            onSelect={handleSelectMovie}
          />
          <SlotSelector
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={handleSelectSlot}
          />
          <SeatSelector
            seatTypes={seats}
            seatCounts={seatCounts}
            onChange={handleSeatChange}
          />

          <div className="book-button">
            <button disabled={!isBookingValid()} onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>

        <LastBooking seatTypes={seats} lastBooking={lastBooking} />
      </div>
    </div>
  );
}

export default App;