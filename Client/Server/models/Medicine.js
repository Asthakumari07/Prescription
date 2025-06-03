// models/Medicine.js
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    serialNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    strength: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ["tablet", "syrup", "capsule", "injection", "ointment"],
    },
  },
  { timestamps: true } // Optional: tracks creation and update times
);

module.exports = mongoose.model("Medicine", medicineSchema);
