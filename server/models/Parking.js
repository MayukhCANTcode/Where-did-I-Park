const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({

    floor: {
        type: String,
        required: true
    },

    note: {
        type: String
    },

    latitude: {
        type: Number,
        required: true
    },

    longitude: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;