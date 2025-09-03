// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Your configured Axios instance
import Alert from "../components/Alert"; // Import the Alert component

export default function Login({ setIsAuthenticated, setCurrentUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // State for Alert component
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setAlertMessage(null); // Clear alert when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null); // Clear previous alerts

    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data; // user object should contain 'role'

      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(user)); // Store the full user object including role

      setIsAuthenticated(true);
      setCurrentUser(user); // Set the full user object in global state

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin", { replace: true }); // Use replace to prevent back button issues
      } else {
        navigate("/", { replace: true }); // Use replace to prevent back button issues
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setAlertMessage({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-greenpact-green-dark">
            Sign in to your account
          </h2>
        </div>
        {alertMessage && (
          <Alert
            message={alertMessage.message}
            type={alertMessage.type}
            onClose={() => setAlertMessage(null)}
          />
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-greenpact-green hover:text-greenpact-green-dark"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-greenpact-orange hover:bg-greenpact-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenpact-orange-dark"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
