// src/components/ManageApplications.jsx
import React, { useState, useEffect } from "react";
import api from "../api"; // Your configured Axios instance

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // For success messages

  // State for modal visibility and content
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint is protected by authMiddleware and adminMiddleware on the backend
      // It should now populate vacancyId with title due to backend changes
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }
    setMessage("");
    setError(null);
    try {
      await api.delete(`/applications/${id}`);
      setMessage("Application deleted successfully!");
      fetchApplications(); // Re-fetch list after deletion
    } catch (err) {
      console.error("Error deleting application:", err);
      setError(err.response?.data?.message || "Failed to delete application.");
    }
  };

  // NEW: Function to handle inviting for interview
  const handleInviteForInterview = async (id) => {
    setMessage("");
    setError(null);
    if (
      !window.confirm(
        "Are you sure you want to invite this applicant for an interview? This will send an email."
      )
    ) {
      return;
    }
    try {
      // Send a PUT request to update status to 'Contacted' and trigger email
      await api.put(`/applications/${id}`, { status: "Contacted" });
      setMessage(
        "Interview invitation sent and application status updated to 'Contacted'!"
      );
      fetchApplications(); // Re-fetch list to show updated status
    } catch (err) {
      console.error("Error sending interview invitation:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send invitation or update status."
      );
    }
  };

  // Function to open the modal with full motivational letter
  const openMotivationalLetterModal = (content, name) => {
    setModalContent(content);
    setModalTitle(`Motivational Letter from ${name}`);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setModalContent("");
    setModalTitle("");
  };

  if (loading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto sm:max-w-4xl lg:max-w-6xl">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Manage User Applications
      </h3>
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}

      {applications.length === 0 ? (
        <p className="text-gray-600 text-center">
          No applications received yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg table-auto">
            <thead>
              <tr className="bg-greenpact-green text-white">
                <th className="py-3 px-4 text-left whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Email</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Phone</th>
                <th className="py-3 px-4 text-left">Job Title</th>
                <th className="py-3 px-4 text-left">Motivational Letter</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  CV/Resume
                </th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{app.email}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {app.phone || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis">
                    {app.vacancyId
                      ? app.vacancyId.title
                      : "General Application"}
                  </td>
                  <td className="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis">
                    {app.message.length > 70 ? (
                      <>
                        {app.message.substring(0, 70)}...
                        <button
                          onClick={() =>
                            openMotivationalLetterModal(
                              app.message,
                              `${app.firstName} ${app.lastName}`
                            )
                          }
                          className="text-blue-600 hover:underline ml-1 text-xs whitespace-nowrap"
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      app.message
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {app.cvPath ? (
                      <a
                        href={`http://localhost:5000/uploads/${app.cvPath.replace(
                          /\\/g,
                          "/"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Download CV
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {/* Simplified Status Display - No dropdown */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "Reviewed"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "Contacted"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 items-start sm:items-center">
                    {/* NEW: Invite for Interview Button */}
                    {app.status !== "Contacted" &&
                      app.status !== "Archived" && (
                        <button
                          onClick={() => handleInviteForInterview(app._id)}
                          className="bg-greenpact-green text-white px-3 py-1 rounded-md text-xs hover:bg-greenpact-green-dark transition-colors whitespace-nowrap"
                        >
                          Invite for Interview
                        </button>
                      )}
                    <button
                      onClick={() => handleDelete(app._id)}
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

      {/* Motivational Letter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center z-[1000] overflow-y-auto pt-32 pb-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[calc(100vh-10rem)]">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white z-10">
              <h4 className="text-xl font-bold text-greenpact-green-dark">
                {modalTitle}
              </h4>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto px-6 py-4 min-h-0">
              <p className="text-gray-800 whitespace-pre-wrap">
                {modalContent}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
