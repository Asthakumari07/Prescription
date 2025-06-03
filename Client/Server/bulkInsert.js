const mongoose = require("mongoose");
const fs = require("fs");
const Medicine = require("./models/Medicine");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://asthas274:Astha011221@cluster0.bntnmwd.mongodb.net/feedback",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function insertMedicines() {
  try {
    const data = fs.readFileSync("medicines.json", "utf-8");
    const medicines = JSON.parse(data);

    await Medicine.insertMany(medicines);
    console.log("✅ Medicines inserted successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting medicines:", error.message);
    mongoose.connection.close();
  }
}

insertMedicines();
