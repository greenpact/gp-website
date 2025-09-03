// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Your configured Axios instance
import Alert from "../components/Alert"; // Assuming you have an Alert component

export default function Register({ setIsAuthenticated, setCurrentUser }) {
  const [step, setStep] = useState(1); // 1: Email/Username/Name, 2: OTP/Password
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for password validation feedback
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
    if (message) setMessage("");

    // If the changed field is 'password', update validation feedback
    if (name === "password") {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  // Function to check if all password requirements are met
  const arePasswordRequirementsMet = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);
    setLoading(true);

    if (!formData.name || !formData.username || !formData.email) {
      setError(
        "Please fill in all required fields (Full Name, Username, Email Address)."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/request-otp", {
        email: formData.email,
      });
      setMessage(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      console.error("Error requesting OTP:", err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);
    setLoading(true);

    if (!formData.otp || !formData.password || !formData.confirmPassword) {
      setError("Please fill in OTP, Password, and Confirm Password.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      setLoading(false);
      return;
    }

    if (!arePasswordRequirementsMet()) {
      setError("Password does not meet all requirements.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));

      setIsAuthenticated(true);
      setCurrentUser(res.data.user);

      setMessage(res.data.message || "Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your OTP or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper for password requirement list item styling
  const getRequirementClass = (isValid) =>
    isValid ? "text-green-600" : "text-red-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-20 pt-28">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-greenpact-green-dark mb-6 text-center">
          Register
        </h2>
        {message && (
          <Alert
            message={message}
            type="success"
            onClose={() => setMessage("")}
          />
        )}
        {error && (
          <Alert message={error} type="error" onClose={() => setError(null)} />
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-greenpact-orange text-white py-2 px-4 rounded-md hover:bg-greenpact-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenpact-orange-dark transition-colors duration-200"
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              An OTP has been sent to{" "}
              <span className="font-semibold">{formData.email}</span>. Please
              check your inbox (and spam folder).
            </p>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP (One-Time Password)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength="6"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
              />
            </div>
            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-7"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.981 8.75C.997 10.461 1.026 13.047 3.98 14.75c.487.283.993.535 1.51.758a.75.75 0 0 0 .975-.247l.558-.879a.75.75 0 0 0-.215-1.022 20.574 20.574 0 0 1-2.179-1.29.75.75 0 0 1 0-1.128c.87-.506 1.764-.94 2.668-1.306a.75.75 0 0 0 .215-1.022l-.558-.879a.75.75 0 0 0-.975-.247A49.178 49.178 0 0 0 3.98 8.75ZM16.02 8.75c2.984 1.711 2.956 4.297 0 6s-.993.535-1.51.758a.75.75 0 0 1-.975-.247l-.558-.879a.75.75 0 0 1 .215-1.022 20.574 20.574 0 0 0 2.179-1.29.75.75 0 0 1 0-1.128c-.87-.506-1.764-.94-2.668-1.306a.75.75 0 0 0-.215-1.022l.558-.879a.75.75 0 0 1 .975-.247A49.178 49.178 0 0 1 16.02 8.75ZM12 5.75c-1.75 0-3.35 1.17-4.172 2.75a.75.75 0 0 0 1.444.606C9.516 7.6 10.66 7 12 7c1.34 0 2.484.6 3.028 1.356a.75.75 0 0 0 1.444-.606C15.35 6.92 13.75 5.75 12 5.75Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Requirements List */}
            <div className="text-sm text-gray-600 mt-2">
              <p className="font-semibold mb-1">Password must contain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li
                  className={getRequirementClass(passwordValidation.minLength)}
                >
                  Minimum 8 characters
                </li>
                <li
                  className={getRequirementClass(
                    passwordValidation.hasUpperCase
                  )}
                >
                  At least one uppercase letter (A-Z)
                </li>
                <li
                  className={getRequirementClass(
                    passwordValidation.hasLowerCase
                  )}
                >
                  At least one lowercase letter (a-z)
                </li>
                <li
                  className={getRequirementClass(passwordValidation.hasNumber)}
                >
                  At least one number (0-9)
                </li>
                <li
                  className={getRequirementClass(
                    passwordValidation.hasSpecialChar
                  )}
                >
                  At least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-7"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.981 8.75C.997 10.461 1.026 13.047 3.98 14.75c.487.283.993.535 1.51.758a.75.75 0 0 0 .975-.247l.558-.879a.75.75 0 0 0-.215-1.022 20.574 20.574 0 0 1-2.179-1.29.75.75 0 0 1 0-1.128c.87-.506 1.764-.94 2.668-1.306a.75.75 0 0 0 .215-1.022l-.558-.879a.75.75 0 0 0-.975-.247A49.178 49.178 0 0 0 3.98 8.75ZM16.02 8.75c2.984 1.711 2.956 4.297 0 6s-.993.535-1.51.758a.75.75 0 0 1-.975-.247l-.558-.879a.75.75 0 0 1 .215-1.022 20.574 20.574 0 0 0 2.179-1.29.75.75 0 0 1 0-1.128c-.87-.506-1.764-.94-2.668-1.306a.75.75 0 0 0-.215-1.022l.558-.879a.75.75 0 0 1 .975-.247A49.178 49.178 0 0 1 16.02 8.75ZM12 5.75c-1.75 0-3.35 1.17-4.172 2.75a.75.75 0 0 0 1.444.606C9.516 7.6 10.66 7 12 7c1.34 0 2.484.6 3.028 1.356a.75.75 0 0 0 1.444-.606C15.35 6.92 13.75 5.75 12 5.75Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !arePasswordRequirementsMet()} // Disable if requirements not met
              className={`w-full bg-greenpact-orange text-white py-2 px-4 rounded-md transition-colors duration-200 ${
                loading || !arePasswordRequirementsMet()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-greenpact-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenpact-orange-dark"
              }`}
            >
              {loading ? "Registering..." : "Verify OTP & Register"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 mt-2"
            >
              Back to Email
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-greenpact-green hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
