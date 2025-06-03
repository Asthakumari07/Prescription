const Prescription = require("../models/Prescription");

// POST: Create prescription
exports.createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const saved = await prescription.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET: Fetch all prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
