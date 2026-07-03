// ============================
// Load Environment Variables
// ============================
require("dotenv").config();

// ============================
// Import Packages
// ============================
const express = require("express");

// ============================
// Import Database Connection
// ============================
const connectDB = require("./config/db");

// ============================
// Import Parking Model
// ============================
const Parking = require("./models/Parking");

// ============================
// Create Express App
// ============================
const app = express();

// ============================
// Connect to MongoDB
// ============================
connectDB();

// ============================
// Middleware
// Converts JSON body into req.body
// ============================
app.use(express.json());

// =====================================================
// HOME ROUTE
// GET /
// =====================================================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Where Did I Park API 🚗",
        status: "Server is running"
    });
});

// =====================================================
// CREATE PARKING
// POST /parking
// =====================================================
app.post("/parking", async (req, res) => {

    try {

        // Save data into MongoDB
        const savedParking = await Parking.create(req.body);

        res.status(201).json({
            message: "Parking saved successfully!",
            data: savedParking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong while saving parking."
        });

    }

});

// =====================================================
// GET ALL PARKING RECORDS
// GET /parking
// =====================================================
app.get("/parking", async (req, res) => {

    try {

        // Fetch all parking records
        const parkingList = await Parking.find();

        res.status(200).json({
            message: "Parking records fetched successfully!",
            data: parkingList
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch parking records."
        });

    }

});

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});