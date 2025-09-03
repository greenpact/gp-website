// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // CRITICAL CHANGE: Use 'x-auth-token' header to match your backend middleware
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (specifically 401 for redirection)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API call detected. Redirecting to login.");
      // Clear authentication and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
      // Only redirect if the current path is not already login to prevent infinite loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"; // Use window.location.href for full page reload
      }
    }
    return Promise.reject(error); // Always reject the promise so the component can catch it
  }
);

export default api;
