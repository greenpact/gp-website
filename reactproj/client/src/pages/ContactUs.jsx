import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";
import Alert from "../components/Alert";

export default function ContactUs({ currentUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (alertMessage) setAlertMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(null);
    setLoading(true);

    const submitData = {
      name: formData.name.trim(),
      email: formData.email,
      subject: "General Inquiry",
      message: formData.message,
      ...(formData.phone && { phone: formData.phone }),
    };

    try {
      const res = await api.post("/contact", submitData);
      setAlertMessage({
        type: "success",
        message: res.data.message || "Your inquiry has been sent successfully!",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setAlertMessage({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to send inquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `}
      </style>

      <div className="container mx-auto px-4 py-20 pt-32">
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Reach out with questions, partnership inquiries, or feedback. We’re
            here to help you drive sustainable impact.
          </p>
        </motion.section>

        <motion.section
          className="mb-16 bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">
            Send Us a Message
          </h2>
          <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Fill out the form below, and we’ll respond promptly.
          </p>

          {alertMessage && (
            <div className="max-w-lg mx-auto mb-6">
              <Alert
                message={alertMessage.message}
                type={alertMessage.type}
                onClose={() => setAlertMessage(null)}
                duration={5000}
              />
            </div>
          )}

          <form
            className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                placeholder="John Doe"
                required
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                placeholder="john.doe@example.com"
                required
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                placeholder="+251 968 228 903"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Comment or Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                placeholder="Your message here..."
                required
                aria-required="true"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </motion.section>

        <motion.section
          className="bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">
            Reach Us Directly
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-lg text-gray-600">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a href="tel:+251968228903" className="hover:underline">
                +251 968 228 903
              </a>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v7a2 2 0 002 2h14a2 2 0 002-2v-7M3 8l7.89-5.26a2 2 0 012.22 0L21 8"
                />
              </svg>
              <a
                href="mailto:info@greenpactconsulting.com"
                className="hover:underline"
              >
                info@greenpactconsulting.com
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
