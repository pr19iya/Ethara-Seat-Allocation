import axios from "axios";

const api = axios.create({
  baseURL: "https://ethara-seat-allocation-1e2x.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export default api;