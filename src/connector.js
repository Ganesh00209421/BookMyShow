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


exports.connection = collection_connection;
