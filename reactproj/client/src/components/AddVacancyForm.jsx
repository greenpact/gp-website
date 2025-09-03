// src/components/AddVacancyForm.jsx
import React, { useState } from "react";
import api from "../api"; // Your configured Axios instance
import Alert from "./Alert"; // Assuming you have an Alert component

export default function AddVacancyForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "Full-time", // Default value
    requirements: "", // Comma-separated string
    closingDate: "",
    isActive: true, // Default to active
    numberOfEmployees: "", // Initialize numberOfEmployees
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError(null); // Clear errors on input change
    if (message) setMessage(""); // Clear messages on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);
    setLoading(true);

    try {
      // Ensure the closingDate is sent as a valid date string
      const dataToSend = {
        ...formData,
        // Convert requirements string to array if needed by backend, or handle in backend
        // For now, backend will split the string.
        // Ensure closingDate is formatted correctly if not already.
        closingDate: formData.closingDate
          ? new Date(formData.closingDate).toISOString()
          : null,
        // Convert numberOfEmployees to a number
        numberOfEmployees: formData.numberOfEmployees
          ? Number(formData.numberOfEmployees)
          : null,
      };

      const res = await api.post("/vacancies", dataToSend); // Submit to backend
      setMessage(res.data.message || "Vacancy added successfully!");
      setFormData({
        // Reset form after successful submission
        title: "",
        description: "",
        location: "",
        type: "Full-time",
        requirements: "",
        closingDate: "",
        isActive: true,
        numberOfEmployees: "",
      });
      console.log("Vacancy added:", res.data);
    } catch (err) {
      console.error(
        "Error adding vacancy:",
        err.response?.data || err.message || err
      );
      setError(err.response?.data?.message || "Failed to add vacancy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto sm:max-w-xl lg:max-w-2xl">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Add New Vacancy
      </h3>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-2"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            required
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-gray-700 font-medium mb-2"
          >
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="requirements"
            className="block text-gray-700 font-medium mb-2"
          >
            Requirements (comma-separated){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            placeholder="e.g., Bachelor's Degree, 2+ years experience, Strong communication"
            required
          />
        </div>
        <div>
          <label
            htmlFor="closingDate"
            className="block text-gray-700 font-medium mb-2"
          >
            Closing Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="closingDate"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            required
          />
        </div>
        <div>
          <label
            htmlFor="numberOfEmployees"
            className="block text-gray-700 font-medium mb-2"
          >
            Number of Employees Needed <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="numberOfEmployees"
            name="numberOfEmployees"
            value={formData.numberOfEmployees}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
            placeholder="e.g., 1, 5, 10"
            min="1"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-greenpact-green border-gray-300 rounded focus:ring-greenpact-green"
          />
          <label htmlFor="isActive" className="ml-2 block text-gray-700">
            Active Vacancy (visible to public)
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-greenpact-orange text-white py-3 rounded-md font-semibold hover:bg-greenpact-orange-dark transition-colors"
        >
          {loading ? "Adding..." : "Add Vacancy"}
        </button>
      </form>
    </div>
  );
}
