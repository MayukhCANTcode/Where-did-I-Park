const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const Parking = require("./models/Parking");

const app = express();
const aiRoutes = require("./ai");
const auth = require("./middleware/auth");

// ======================
// Database
// ======================

connectDB();

// ======================
// Middleware
// ======================

app.use(cors());
app.use(express.json());
app.use("/ai", aiRoutes);

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ParkPal API 🚗",
  });
});

// ======================
// Create Parking
// ======================

app.post("/parking", auth, async (req, res) => {
  try {
    const parking = await Parking.create({
      ...req.body,
      userId: req.user.sub,
    });

    res.status(201).json({
      success: true,
      message: "Parking saved successfully!",
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// Get All Parking
// ======================

app.get("/parking", auth, async (req, res) => {
  try {
    const parking = await Parking.find({ userId: req.user.sub }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// Update Parking
// ======================

app.put("/parking/:id", auth, async (req, res) => {
  try {
    const updatedParking = await Parking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      req.body,
      {
        new: true,
      },
    );

    res.json({
      success: true,
      message: "Parking updated successfully!",
      data: updatedParking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// Delete Parking
// ======================

app.delete("/parking/:id", auth, async (req, res) => {
  try {
    await Parking.findOneAndDelete({ _id: req.params.id, userId: req.user.sub });

    res.json({
      success: true,
      message: "Parking deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
