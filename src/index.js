const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const path = require('path')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connection } = require("./connector");
const cors = require('cors')
app.use(cors())

// 1. Create a new booking
app.post("/api/booking", async (req, res) => {
    try {
        const { movie, seats, slot } = req.body;

        const newBooking = new connection({
            movie,
            seats,
            slot
        });

        await newBooking.save();

        res.status(200).json({ message: "booking successful" });
    } catch (err) {
        console.log("error while saving booking", err);
        res.status(500).json({ message: "something went wrong" });
    }
});

// 2. Get the last booking made
app.get("/api/booking", async (req, res) => {
    try {
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