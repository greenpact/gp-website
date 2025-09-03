// src/components/ManageVacancies.jsx
import React, { useState, useEffect } from "react";
import api from "../api"; // Your configured Axios instance
import { Link } from "react-router-dom"; // For navigation to edit page
import Alert from "./Alert"; // Assuming you have an Alert component

export default function ManageVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // For success messages

  // Function to fetch all vacancies (including inactive ones for admin view)
  const fetchAllVacancies = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from the new protected admin endpoint
      const res = await api.get("/vacancies/admin-all");
      setVacancies(res.data);
    } catch (err) {
      console.error("Error fetching all vacancies:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load vacancies for management."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVacancies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) {
      return;
    }
    setMessage("");
    setError(null);
    try {
      await api.delete(`/vacancies/${id}`);
      setMessage("Vacancy deleted successfully!");
      fetchAllVacancies(); // Re-fetch list after deletion
    } catch (err) {
      console.error("Error deleting vacancy:", err);
      setError(err.response?.data?.message || "Failed to delete vacancy.");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading vacancies...</div>;
  }

  if (error) {
    return (
      <Alert message={error} type="error" onClose={() => setError(null)} />
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto sm:max-w-4xl lg:max-w-6xl">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Manage Existing Vacancies
      </h3>
      {message && (
        <Alert
          message={message}
          type="success"
          onClose={() => setMessage("")}
        />
      )}
      {vacancies.length === 0 ? (
        <p className="text-gray-600 text-center">No vacancies found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg table-auto">
            <thead>
              <tr className="bg-greenpact-green text-white">
                <th className="py-3 px-4 text-left whitespace-nowrap">Title</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Type</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vacancies.map((vacancy) => (
                <tr
                  key={vacancy._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {vacancy.title}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {vacancy.location}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {vacancy.type}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        vacancy.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vacancy.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 items-start sm:items-center">
                    <Link
                      to={`/admin/edit-vacancy/${vacancy._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(vacancy._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition-colors whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
