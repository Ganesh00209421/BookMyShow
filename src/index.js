/**
 * index.js — Backend entry point
 * -----------------------------------------------------------------------
 * Express server exposing exactly two REST endpoints for the BookMyShow
 * booking flow:
 *   POST /api/booking  -> create a new booking
 *   GET  /api/booking  -> fetch the most recently created booking
 *
 * All other endpoints are considered invalid per the assignment spec.
 * -----------------------------------------------------------------------
 */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080; // deployment platforms (e.g. Vercel, Render) inject PORT
const path = require('path')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connection, dbReady } = require("./connector");
const cors = require('cors')
app.use(cors()) // allow the frontend (hosted on a different domain in production) to call this API

// 1. Create a new booking
// Expects body: { movie: string, slot: string, seats: { A1, A2, A3, A4, D1, D2 } }
app.post("/api/booking", async (req, res) => {
    try {
        await dbReady; // ensure MongoDB connection is open before querying
        const { movie, seats, slot } = req.body;

        const newBooking = new connection({
            movie,
            seats,
            slot
        });

        await newBooking.save(); // persists the booking document to MongoDB

        res.status(200).json({ message: "booking successful" });
    } catch (err) {
        console.log("error while saving booking", err);
        res.status(500).json({ message: "something went wrong" });
    }
});

// 2. Get the last booking made
app.get("/api/booking", async (req, res) => {
    try {
        await dbReady; // ensure MongoDB connection is open before querying
        // sort by _id descending -> _id is roughly time-ordered in MongoDB,
        // so the first result is the most recently inserted document
        const lastBooking = await connection.findOne().sort({ _id: -1 });

        if (!lastBooking) {
            return res.status(200).json({ message: "no previous booking found" });
        }

        res.status(200).json({
            movie: lastBooking.movie,
            seats: lastBooking.seats,
            slot: lastBooking.slot
        });
    } catch (err) {
        console.log("error while fetching last booking", err);
        res.status(500).json({ message: "something went wrong" });
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;