/**
 * connector.js — MongoDB connection
 * -----------------------------------------------------------------------
 * Reads the connection string from the MONGO_URI environment variable
 * (see .env.example) rather than hardcoding credentials in source
 * control, and exposes a Mongoose model for the "bookmovietickets"
 * collection.
 * -----------------------------------------------------------------------
 */
require('dotenv').config();
const mongodb = require('mongodb');

const mongoURI = process.env.MONGO_URI;

let mongoose = require('mongoose');
const { bookMovieSchema } = require('./schema')


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });
let collection_connection = mongoose.model('bookmovietickets', bookMovieSchema)

// A promise that resolves once the MongoDB connection is actually open.
// On serverless platforms (e.g. Vercel), each cold start re-runs this file,
// and a request can arrive before mongoose.connect() finishes — awaiting
// this promise in route handlers avoids "buffering timed out" errors.
const dbReady = mongoose.connection.readyState === 1
    ? Promise.resolve()
    : new Promise((resolve, reject) => {
        mongoose.connection.once('connected', resolve);
        mongoose.connection.once('error', reject);
    });

// Prevent an "unhandled promise rejection" crash (which some serverless
// runtimes treat as a fatal process error) if the connection errors out
// before any request has a chance to await dbReady. Route handlers still
// get the real rejection when they `await dbReady` inside their own
// try/catch — this only stops it from being *unhandled*.
dbReady.catch(() => {});

exports.connection = collection_connection;
exports.dbReady = dbReady;