import React, { useState, useEffect } from "react";
import '../styles/App.css';
import '../styles/bootstrap.min.css'
import { movies, slots, seats } from "./data";

// helper: an empty seats object like {A1: '', A2: '', A3: '', A4: '', D1: '', D2: ''}
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
    const savedMovie = localStorage.getItem('movie');
    const savedSlot = localStorage.getItem('slot');
    const savedSeats = localStorage.getItem('seats');

    if (savedMovie) setSelectedMovie(savedMovie);
    if (savedSlot) setSelectedSlot(savedSlot);
    if (savedSeats) setSeatCounts(JSON.parse(savedSeats));

    fetch('/api/booking')
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'no previous booking found') {
          setLastBooking(null);
        } else {
          setLastBooking(data);
        }
      })
      .catch((err) => console.log('error fetching last booking', err));
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    localStorage.setItem('movie', movie);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    localStorage.setItem('slot', slot);
  };

  const handleSeatChange = (seatType, value) => {
    const updated = { ...seatCounts, [seatType]: value };
    setSeatCounts(updated);
    localStorage.setItem('seats', JSON.stringify(updated));
  };

  const clearSelection = () => {
    setSelectedMovie('');
    setSelectedSlot('');
    setSeatCounts(emptySeats());
    localStorage.removeItem('movie');
    localStorage.removeItem('slot');
    localStorage.removeItem('seats');
  };

  const isBookingValid = () => {
    if (!selectedMovie) return false;
    if (!selectedSlot) return false;
    // at least one seat type must have a count > 0
    const totalSeats = Object.values(seatCounts)
      .reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    return totalSeats > 0;
  };

  const handleBookNow = async () => {
    if (!isBookingValid()) return;

    // convert seat strings to numbers before sending
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
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (res.status === 200) {
        // update "last booking" directly from what we just sent -
        // no extra GET request needed
        setLastBooking(bookingPayload);
        clearSelection();
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

          {/* Movie selection */}
          <div className="section-block">
            <h4>Select A Movie</h4>
            <div className="movie-row">
              {movies.map((movie) => (
                <div
                  key={movie}
                  className={
                    'movie-column' +
                    (selectedMovie === movie ? ' movie-column-selected' : '')
                  }
                  onClick={() => handleSelectMovie(movie)}
                >
                  {movie}
                </div>
              ))}
            </div>
          </div>

          {/* Slot selection */}
          <div className="section-block">
            <h4>Select a Time slot</h4>
            <div className="slot-row">
              {slots.map((slot) => (
                <div
                  key={slot}
                  className={
                    'slot-column' +
                    (selectedSlot === slot ? ' slot-column-selected' : '')
                  }
                  onClick={() => handleSelectSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* Seat selection */}
          <div className="section-block">
            <h4>Select the seats</h4>
            <div className="seat-row">
              {seats.map((seatType) => (
                <div key={seatType} className="seat-column">
                  <div className="seat-label">Type {seatType}</div>
                  <input
                    id={`seat-${seatType}`}
                    type="number"
                    min="0"
                    value={seatCounts[seatType]}
                    onChange={(e) => handleSeatChange(seatType, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="book-button">
            <button disabled={!isBookingValid()} onClick={handleBookNow}>
              Book Now
            </button>
          </div>

        </div>

        {/* Last Booking Details */}
        <div className="side-panel-wrap">
          <div className="last-order">
            <h4>Last Booking Details</h4>
            {lastBooking ? (
              <div>
                {seats.map((seatType) => (
                  <div key={seatType} className="ticket-row">
                    <span>{seatType}</span>
                    <span>{lastBooking.seats[seatType]}</span>
                  </div>
                ))}
                <div className="ticket-row">
                  <span>slot</span>
                  <span>{lastBooking.slot}</span>
                </div>
                <div className="ticket-row">
                  <span>movie</span>
                  <span>{lastBooking.movie}</span>
                </div>
              </div>
            ) : (
              <div className="ticket-empty">no previous booking found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;