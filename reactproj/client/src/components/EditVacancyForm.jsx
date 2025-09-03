// src/components/EditVacancyForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // Your configured Axios instance
import Alert from "./Alert"; // Assuming you have an Alert component

export default function EditVacancyForm() {
  const { id } = useParams(); // Get the vacancy ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    requirements: "", // Stored as comma-separated string for input field
    closingDate: "",
    isActive: false,
    numberOfEmployees: "", // NEW: Initialize numberOfEmployees in state
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [vacancyExists, setVacancyExists] = useState(true); // New state to track if vacancy was found

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await api.get(`/vacancies/${id}`); // Fetch specific vacancy by ID
        const vacancyData = res.data;

        setFormData({
          title: vacancyData.title,
          description: vacancyData.description,
          location: vacancyData.location,
          type: vacancyData.type,
          requirements: vacancyData.requirements
            ? vacancyData.requirements.join(", ") // Convert array to comma-separated string for input
            : "",
          closingDate: vacancyData.closingDate
            ? new Date(vacancyData.closingDate).toISOString().split("T")[0]
            : "", // Format date for input type="date"
          isActive: vacancyData.isActive,
          numberOfEmployees: vacancyData.numberOfEmployees || "", // NEW: Populate numberOfEmployees
        });
        setLoading(false);
        setVacancyExists(true); // Vacancy found
      } catch (err) {
        console.error("Error fetching vacancy for edit:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to load vacancy data.";
        setError(errorMessage);
        setLoading(false);
        // If the error indicates not found, set vacancyExists to false
        if (
          err.response?.status === 404 ||
          errorMessage.includes("Vacancy not found")
        ) {
          setVacancyExists(false);
        }
      }
    };

    if (id) {
      fetchVacancy();
    } else {
      setLoading(false);
      setError("No vacancy ID provided for editing.");
      setVacancyExists(false);
    }
  }, [id]); // Re-run effect if ID changes

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
    setError("");
    setLoading(true);

    try {
      // Prepare data to send to backend
      const dataToSend = {
        ...formData,
        // Convert requirements string back to an array
        requirements: formData.requirements
          .split(",")
          .map((req) => req.trim())
          .filter((req) => req !== ""), // Split by comma, trim, and remove empty strings
        // Ensure closingDate is formatted correctly if not already.
        closingDate: formData.closingDate
          ? new Date(formData.closingDate).toISOString()
          : null,
        // NEW: Convert numberOfEmployees to a number
        numberOfEmployees: formData.numberOfEmployees
          ? Number(formData.numberOfEmployees)
          : null,
      };

      const res = await api.put(`/vacancies/${id}`, dataToSend); // Send updated data to your backend API
      setMessage(res.data.message || "Vacancy updated successfully!");
      console.log("Vacancy updated:", res.data);
      // Optionally navigate back to manage page after successful update
      navigate("/admin"); // Navigate to the admin dashboard, where vacancies are managed
    } catch (err) {
      console.error(
        "Error updating vacancy:",
        err.response?.data || err.message || err
      );
      setError(err.response?.data?.message || "Failed to update vacancy.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading vacancy details...</div>;
  }

  if (!vacancyExists) {
    return (
      <div className="text-red-600 text-center py-4">
        {error || "Vacancy not found or invalid ID provided."}
        <button
          onClick={() => navigate("/admin")} // Go back to admin dashboard
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Admin Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Edit Vacancy
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
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700"
          >
            Requirements (comma-separated)
          </label>
          <input
            type="text"
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="e.g., Degree in Env. Sci, 2+ years experience"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="closingDate"
            className="block text-sm font-medium text-gray-700"
          >
            Closing Date (Optional)
          </label>
          <input
            type="date"
            id="closingDate"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
          />
        </div>
        {/* NEW FIELD: Number of Employees Needed */}
        <div>
          <label
            htmlFor="numberOfEmployees"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Employees Needed
          </label>
          <input
            type="number"
            id="numberOfEmployees"
            name="numberOfEmployees"
            value={formData.numberOfEmployees}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-greenpact-green focus:border-greenpact-green sm:text-sm"
            placeholder="e.g., 1, 5, 10"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-greenpact-green focus:ring-greenpact-green border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-900"
          >
            Active Vacancy
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-greenpact-orange text-white py-2 px-4 rounded-md hover:bg-greenpact-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenpact-orange-dark transition-colors duration-200"
        >
          {loading ? "Updating..." : "Update Vacancy"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin")} // Go back to admin dashboard
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 mt-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
