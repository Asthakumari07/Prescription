const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: true,
    },
    specialist: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true },
        strength: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
      },
    ],
    advice: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
