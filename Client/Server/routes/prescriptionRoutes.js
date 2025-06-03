const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getAllPrescriptions,
} = require("../controllers/prescriptionController");

// POST: Add new prescription
router.post("/", createPrescription);

// GET: Fetch all prescriptions
router.get("/", getAllPrescriptions);

module.exports = router;
