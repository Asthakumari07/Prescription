import React, { useEffect, useState, useRef } from "react";
import { Search, AlertCircle, Pill, Stethoscope } from "lucide-react";
import API from "../api"; // Adjust the path if needed

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Refs to prescription containers for printing
  const prescriptionRefs = useRef([]);

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const res = await API.get("/prescriptions");
        setPrescriptions(res.data);
      } catch (err) {
        setError("Failed to load prescriptions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrescriptions();
  }, []);

  // Initialize refs array whenever prescriptions change
  useEffect(() => {
    prescriptionRefs.current = prescriptions.map(
      (_, i) => prescriptionRefs.current[i] ?? React.createRef()
    );
  }, [prescriptions]);

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.doctorName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printPrescription = (index) => {
    const ref = prescriptionRefs.current[index];
    if (!ref || !ref.current) return;

    const printContents = ref.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );

  if (prescriptions.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No prescriptions found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Prescriptions History
          </h1>
          <button
            className="bg-green-900 hover:bg-green-700 text-white px-4 py-2 rounded-3xl font-medium"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by patient name, doctor, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent"
          />
        </div>

        {/* Prescriptions List */}
        <div className="space-y-6">
          {filteredPrescriptions.map((prescription, idx) => (
            <div
              key={prescription._id || idx}
              ref={prescriptionRefs.current[idx]}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Patient Header */}
              <div className="bg-green-900 text-white p-4 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">
                      {prescription.patientName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">DOCTOR</span>
                        <p className="mt-1">{prescription.doctorName}</p>
                        {prescription.specialist && (
                          <p className="text-green-100 text-xs">
                            {prescription.specialist}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">AGE & GENDER</span>
                        <p className="mt-1 capitalize">
                          {prescription.patientAge} years, {prescription.gender}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">DATE</span>
                        <p className="mt-1">
                          {prescription.date || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => printPrescription(idx)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-4 py-2 rounded-md font-medium ml-4"
                  >
                    Print
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Diagnosis & Advice */}
                  <div className="space-y-6">
                    {/* Diagnosis */}
                    <div>
                      <div className="flex items-center mb-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="font-semibold text-gray-800">
                          Diagnosis
                        </h3>
                      </div>
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-gray-900">
                          {prescription.diagnosis}
                        </p>
                      </div>
                    </div>

                    {/* Medical Advice */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Stethoscope className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          Medical Advice
                        </h3>
                      </div>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {prescription.advice ||
                            "No specific advice provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Prescribed Medicines */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Pill className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        Prescribed Medicines
                      </h3>
                    </div>

                    {prescription.medicines &&
                    prescription.medicines.length > 0 ? (
                      <div className="space-y-4">
                        {prescription.medicines.map((med, i) => (
                          <div
                            key={i}
                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-green-800 text-lg">
                                {med.name || "Unnamed Medicine"}
                              </h4>
                              {med.strength && (
                                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  {med.strength}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-600">
                                  Dosage:
                                </span>
                                <p className="text-gray-800 mt-1">
                                  {med.dosage || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">
                                  Frequency:
                                </span>
                                <p className="text-gray-800 mt-1">
                                  {med.frequency || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">
                                  Duration:
                                </span>
                                <p className="text-gray-800 mt-1">
                                  {med.duration || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-500">
                          No medicines prescribed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Print Button for Mobile */}
              <div className="lg:hidden border-t border-gray-200 p-4">
                <button
                  onClick={() => printPrescription(idx)}
                  className="w-full bg-green-900 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Print Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
