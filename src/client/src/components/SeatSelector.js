import React from "react";

/**
 * SeatSelector
 * -----------------------------------------------------------------------
 * Renders one input box per seat type (A1, A2, A3, A4, D1, D2), each with
 * id="seat-<TYPE>" as required by the assignment spec. Seat values are
 * kept as strings in state (React controlled inputs) and converted to
 * numbers only when the booking is actually submitted.
 * -----------------------------------------------------------------------
 * Props:
 *  - seatTypes: string[]                      e.g. ['A1','A2',...]
 *  - seatCounts: { [seatType]: string }       current input values
 *  - onChange: (seatType, value) => void      called on every keystroke
 */
const SeatSelector = ({ seatTypes, seatCounts, onChange }) => (
  <div className="section-block">
    <h4>Select the seats</h4>
    <div className="seat-row">
      {seatTypes.map((seatType) => (
        <div key={seatType} className="seat-column">
          <div className="seat-label">Type {seatType}</div>
          <input
            id={`seat-${seatType}`}
            type="number"
            min="0"
            value={seatCounts[seatType]}
            onChange={(e) => onChange(seatType, e.target.value)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default SeatSelector;