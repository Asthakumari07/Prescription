// controllers/medicineController.js
const Medicine = require("../models/Medicine");

// POST: Add new medicine
exports.createMedicine = async (req, res) => {
  try {
    const { name, serialNumber, strength, type } = req.body;
    const medicine = new Medicine({ name, serialNumber, strength, type });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET: Fetch all medicines (optionally filtered by search query)
exports.getAllMedicines = async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? { name: { $regex: search, $options: "i" } } // case-insensitive partial match
      : {};

    const medicines = await Medicine.find(query).sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
