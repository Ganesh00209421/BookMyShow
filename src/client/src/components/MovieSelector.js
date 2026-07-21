import React from "react";

/**
 * MovieSelector
 * -----------------------------------------------------------------------
 * Renders the row of movie choices. Clicking a movie selects it (only
 * one movie can be selected at a time). The `movie-column-selected`
 * class is applied to whichever movie matches `selectedMovie`.
 * -----------------------------------------------------------------------
 * Props:
 *  - movies: string[]            list of available movie names
 *  - selectedMovie: string       the currently selected movie name
 *  - onSelect: (movie) => void   called when the user clicks a movie
 */
const MovieSelector = ({ movies, selectedMovie, onSelect }) => (
  <div className="section-block">
    <h4>Select A Movie</h4>
    <div className="movie-row">
      {movies.map((movie) => (
        <div
          key={movie}
          className={
            "movie-column" +
            (selectedMovie === movie ? " movie-column-selected" : "")
          }
          onClick={() => onSelect(movie)}
        >
          {movie}
        </div>
      ))}
    </div>
  </div>
);

export default MovieSelector;