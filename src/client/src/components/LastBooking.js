import React from "react";

/**
 * LastBooking
 * -----------------------------------------------------------------------
 * Displays the most recent booking (movie, slot, and every seat type's
 * count). Shows a fallback message when no booking exists yet.
 * -----------------------------------------------------------------------
 * Props:
 *  - seatTypes: string[]             e.g. ['A1','A2',...] (for ordering)
 *  - lastBooking: object | null      { movie, slot, seats } or null
 */
const LastBooking = ({ seatTypes, lastBooking }) => (
  <div className="side-panel-wrap">
    <div className="last-order">
      <h4>Last Booking Details</h4>
      {lastBooking ? (
        <div>
          {seatTypes.map((seatType) => (
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
);

export default LastBooking;