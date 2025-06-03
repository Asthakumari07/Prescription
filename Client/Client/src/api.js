// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2000/api", // adjust if needed
});

export default API;
