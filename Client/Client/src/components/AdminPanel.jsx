import React, { useState } from "react";

const AdminPanel = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      onLogin();
    } else {
      alert("Incorrect admin password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-6">
          Admin Panel
        </h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-900"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-900 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
