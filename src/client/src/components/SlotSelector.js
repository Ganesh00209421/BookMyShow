import React from "react";

/**
 * SlotSelector
 * -----------------------------------------------------------------------
 * Renders the row of available time slots. Mirrors MovieSelector's
 * behaviour: single selection, highlighted via `slot-column-selected`.
 * -----------------------------------------------------------------------
 * Props:
 *  - slots: string[]             list of available time slots
 *  - selectedSlot: string        the currently selected slot
 *  - onSelect: (slot) => void    called when the user clicks a slot
 */
const SlotSelector = ({ slots, selectedSlot, onSelect }) => (
  <div className="section-block">
    <h4>Select a Time slot</h4>
    <div className="slot-row">
      {slots.map((slot) => (
        <div
          key={slot}
          className={
            "slot-column" +
            (selectedSlot === slot ? " slot-column-selected" : "")
          }
          onClick={() => onSelect(slot)}
        >
          {slot}
        </div>
      ))}
    </div>
  </div>
);

export default SlotSelector;