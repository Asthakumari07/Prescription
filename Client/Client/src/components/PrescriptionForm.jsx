import React, { useState, useEffect, useRef } from "react";
import API from "../api"; // Adjust your API import path
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { LuShieldPlus } from "react-icons/lu";

export default function PrescriptionForm({ onSuccess }) {
  const [form, setForm] = useState({
    doctorName: "",
    specialist: "",
    patientName: "",
    patientAge: "",
    gender: "",
    diagnosis: "",
    advice: "",
    medicines: [
      { name: "", strength: "", dosage: "", frequency: "", duration: "" },
    ],
  });

  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  // Fetch medicine suggestions based on query
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await API.get(`/medicines/search?query=${query}`);
      setSuggestions(res.data);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      console.error("Failed to fetch medicine suggestions", error);
    }
  };

  // Handle change for normal inputs and medicines inputs
  const handleChange = (e, index, field) => {
    if (field !== undefined) {
      const newMeds = [...form.medicines];
      newMeds[index][field] = e.target.value;
      setForm({ ...form, medicines: newMeds });

      // If the field is "name", fetch suggestions
      if (field === "name") {
        fetchSuggestions(e.target.value);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // When user selects a suggestion
  const selectSuggestion = (med, index) => {
    const newMeds = [...form.medicines];
    newMeds[index].name = med.name;
    newMeds[index].strength = med.strength;
    setForm({ ...form, medicines: newMeds });
    setSuggestions([]);
  };

  // Add a new medicine input group
  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [
        ...form.medicines,
        { name: "", strength: "", dosage: "", frequency: "", duration: "" },
      ],
    });
  };

  // Remove a medicine input group
  const removeMedicine = (index) => {
    if (form.medicines.length > 1) {
      const newMeds = form.medicines.filter((_, i) => i !== index);
      setForm({ ...form, medicines: newMeds });
      setSuggestions([]);
    }
  };

  // Validation before submit
  const validateForm = () => {
    const requiredFields = [
      "doctorName",
      "specialist",
      "patientName",
      "patientAge",
      "gender",
      "diagnosis",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        return `Please fill in ${field.replace(/([A-Z])/g, " $1")}`;
      }
    }
    return null;
  };

  // Submit handler
  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    try {
      const res = await API.post("/prescriptions", form);
      console.log("Prescription saved:", res.data);
      alert("Prescription submitted successfully!");

      setForm({
        doctorName: "",
        specialist: "",
        patientName: "",
        patientAge: "",
        gender: "",
        diagnosis: "",
        advice: "",
        medicines: [
          { name: "", strength: "", dosage: "", frequency: "", duration: "" },
        ],
      });
      setSuggestions([]);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to save prescription:", error);
      if (error.response && error.response.status === 400) {
        alert("Bad request: Please check all required fields and formats.");
      } else {
        alert("Error submitting prescription. Please try again.");
      }
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Close suggestions if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-10 py-[150px] bg-[url('/assetes/Rectangle278.jpg')] bg-cover bg-center">
      <div className="max-w-6xl mx-auto bg-white rounded-4xl shadow-3xl border border-yellow-200 overflow-hidden">
        {/* Header with Doctor Info */}
        <div className="border-b-2 border-gray-400 p-6 flex justify-between items-center">
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-gray-800">Doctor Name:</span>
              <input
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                placeholder="Doctor Name"
                className="ml-2 shadow shadow-4xl rounded-md px-2 py-1 bg-white"
              />
            </div>
            <div>
              <span className="font-semibold text-gray-800">Specialist:</span>
              <input
                name="specialist"
                value={form.specialist}
                onChange={handleChange}
                placeholder="Specialist"
                className="ml-2 shadow shadow-4xl rounded-md px-2 py-1 bg-white"
              />
            </div>
          </div>
          {/* <button className="flex justify-between items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-3xl hover:bg-gray-700 text-xl">
            Log Out{" "}
            <div className="text-3xl">
              <IoArrowForwardCircleSharp />
            </div>
          </button> */}
        </div>

        <div className="p-8 space-y-8">
          {/* Patient Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Patient's Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex gap-11 h-10">
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 shadow shadow-xl rounded-md bg-gray-50"
                  placeholder="Patient's name"
                />
              </div>
              <div className="flex gap-11 h-10">
                <label className="block text-gray-700 font-semibold mb-2">
                  Age
                </label>
                <input
                  name="patientAge"
                  value={form.patientAge}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  className="w-full p-3 border border-gray-300 shadow shadow-xl rounded-md bg-gray-50"
                  placeholder="Patient's age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex gap-4 h-10">
                <label className="block text-gray-700 font-semibold mb-2">
                  Diagnosis
                </label>
                <input
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 shadow shadow-xl rounded-md bg-gray-50"
                  placeholder="Enter Diagnosis"
                />
              </div>
              <div className="flex gap-4 h-10">
                <label className="block text-gray-700 font-semibold mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 shadow shadow-xl rounded-md bg-gray-50"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-10 h-20">
              <label className="block text-gray-700 font-semibold mb-2">
                Advice
              </label>
              <textarea
                name="advice"
                value={form.advice}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 shadow shadow-xl rounded-md bg-gray-50"
                placeholder="Add any advice for patient..."
              />
            </div>
          </div>

          {/* Medicines Section */}
          <div className="rounded-xl shadow bg-gray-50 shadow-4xl p-6 max-w-6xl mx-auto">
            <h3 className="font-semibold text-xl mb-4 text-gray-700">
              Medicines
            </h3>
            {form.medicines.map((medicine, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3 relative"
                ref={index === 0 ? suggestionsRef : null}
              >
                {/* Medicine Name with autocomplete */}
                <div className="relative col-span-1">
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) => handleChange(e, index, "name")}
                    placeholder="Medicine name"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-md"
                    autoComplete="off"
                  />
                  {/* Suggestion dropdown */}
                  {suggestions.length > 0 && index === 0 && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg">
                      {suggestions.map((med, i) => (
                        <li
                          key={med._id || i}
                          className={`p-2 cursor-pointer hover:bg-yellow-300 ${
                            activeSuggestionIndex === i ? "bg-yellow-400" : ""
                          }`}
                          onClick={() => selectSuggestion(med, index)}
                          onMouseEnter={() => setActiveSuggestionIndex(i)}
                        >
                          {med.name} - {med.strength}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Strength"
                  value={medicine.strength}
                  onChange={(e) => handleChange(e, index, "strength")}
                  className="col-span-1 p-3 border border-gray-300 rounded-md shadow-md"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={medicine.dosage}
                  onChange={(e) => handleChange(e, index, "dosage")}
                  className="col-span-1 p-3 border border-gray-300 rounded-md shadow-md"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={medicine.frequency}
                  onChange={(e) => handleChange(e, index, "frequency")}
                  className="col-span-1 p-3 border border-gray-300 rounded-md shadow-md"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={medicine.duration}
                  onChange={(e) => handleChange(e, index, "duration")}
                  className="col-span-1 p-3 border border-gray-300 rounded-md shadow-md"
                />

                {form.medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 hover:bg-red-800"
                    title="Remove medicine"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMedicine}
              className="px-6 py-2 rounded-md transition-colors flex items-center gap-3 shadow shadow-x bg-green-900 text-green-900 text-white"
            >
              <span className="text-xl">Add</span>
              <div className="bg-white text-green-900 rounded-full flex items-center justify-center font-bold text-4xl">
                <LuShieldPlus />
              </div>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-6 pt-6">
            <button
              onClick={handleSubmit}
              className="bg-green-900 text-white px-9 py-3 rounded-3xl hover:bg-green-800 font-medium"
            >
              Submit
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-600 text-white px-11 py-3 rounded-3xl hover:bg-gray-700 font-medium"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
