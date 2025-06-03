// routes/medicineRoutes.js

const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const medicines = await Medicine.find({
      name: { $regex: query, $options: "i" },
    }).limit(10); // limit results for performance
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
