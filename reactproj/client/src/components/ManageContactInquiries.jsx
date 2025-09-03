// src/components/ManageContactInquiries.jsx
import React, { useState, useEffect } from "react";
import api from "../api"; // Your configured Axios instance
import Alert from "./Alert"; // Import the Alert component
import Modal from "./Modal"; // Import the new Modal component

export default function ManageContactInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages

  // State for the Read More modal
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [currentMessageContent, setCurrentMessageContent] = useState("");

  // State for the Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [inquiryToDeleteId, setInquiryToDeleteId] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    setMessage(null); // Clear messages on new fetch
    console.log("[Frontend ManageInquiries] Fetching inquiries...");
    try {
      // This endpoint requires admin authentication
      const res = await api.get("/contact");
      console.log(
        "[Frontend ManageInquiries] Inquiries fetched successfully:",
        res.data
      );
      setInquiries(res.data);
    } catch (err) {
      console.error(
        "[Frontend ManageInquiries] Error fetching inquiries:",
        err.response?.data || err.message || err
      );
      setError(err.response?.data?.message || "Failed to load inquiries.");
    } finally {
      console.log("[Frontend ManageInquiries] Setting loading to false.");
      setLoading(false); // Ensure loading is always set to false
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkAsRead = async (id) => {
    setMessage(null); // Clear previous success message
    setError(null); // Clear previous error message
    console.log(`[Frontend ManageInquiries] Marking inquiry ${id} as read.`);
    try {
      // Send a PUT request to update the 'read' field to true (boolean)
      const res = await api.put(`/contact/${id}`, { read: true }); // Sending 'read: true'
      console.log(
        "[Frontend ManageInquiries] Mark as read response:",
        res.data
      );
      setMessage(res.data.message || "Inquiry marked as read successfully!");
      fetchInquiries(); // Re-fetch inquiries to immediately update the table
    } catch (err) {
      console.error(
        `[Frontend ManageInquiries] Error marking inquiry ${id} as read:`,
        err.response?.data || err.message || err
      );
      setError(
        err.response?.data?.message ||
          "Failed to mark inquiry as read. Please try again."
      );
    }
  };

  // Function to open the confirmation modal
  const confirmDelete = (id) => {
    setInquiryToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  // Function to handle deletion after confirmation
  const handleDeleteInquiry = async () => {
    setMessage(null);
    setError(null);
    setIsConfirmModalOpen(false); // Close the confirmation modal
    if (!inquiryToDeleteId) return; // Should not happen if modal is opened correctly

    console.log(
      `[Frontend ManageInquiries] Deleting inquiry ${inquiryToDeleteId}.`
    );
    try {
      await api.delete(`/contact/${inquiryToDeleteId}`);
      console.log(
        `[Frontend ManageInquiries] Inquiry ${inquiryToDeleteId} deleted successfully.`
      );
      setMessage("Inquiry deleted successfully!");
      setInquiryToDeleteId(null); // Clear the ID
      fetchInquiries(); // Re-fetch inquiries to update the list
    } catch (err) {
      console.error(
        `[Frontend ManageInquiries] Error deleting inquiry ${inquiryToDeleteId}:`,
        err.response?.data || err.message || err
      );
      setError(err.response?.data?.message || "Failed to delete inquiry.");
    }
  };

  // Function to open the message modal
  const openMessageModal = (messageText) => {
    setCurrentMessageContent(messageText);
    setIsMessageModalOpen(true);
  };

  // Function to close the message modal
  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setCurrentMessageContent("");
  };

  // Function to close the confirmation modal
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setInquiryToDeleteId(null);
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  if (loading) {
    return <div className="text-center py-4">Loading inquiries...</div>;
  }

  // Display error if fetching failed initially
  if (error && !inquiries.length) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto sm:max-w-4xl lg:max-w-6xl">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Manage Contact Inquiries
      </h3>

      {/* Display success/error messages from actions */}
      {message && (
        <div className="max-w-lg mx-auto mb-4">
          <Alert
            message={message}
            type="success"
            onClose={() => setMessage(null)}
          />
        </div>
      )}
      {error && (
        <div className="max-w-lg mx-auto mb-4">
          <Alert message={error} type="error" onClose={() => setError(null)} />
        </div>
      )}

      {inquiries.length === 0 ? (
        <p className="text-gray-600 text-center">No contact inquiries found.</p>
      ) : (
        // REMOVED: overflow-x-auto from this div
        <div className="w-full">
          {" "}
          {/* Ensure it takes full width */}
          <table className="min-w-full bg-white border border-gray-200 rounded-lg table-auto">
            <thead>
              <tr className="bg-greenpact-green text-white">
                <th className="py-3 px-4 text-left">Name</th>{" "}
                {/* Removed whitespace-nowrap */}
                <th className="py-3 px-4 text-left">Email</th>{" "}
                {/* Removed whitespace-nowrap */}
                <th className="py-3 px-4 text-left">Phone</th>{" "}
                {/* Removed whitespace-nowrap */}
                <th className="py-3 px-4 text-left">Subject</th>{" "}
                {/* Removed whitespace-nowrap */}
                <th className="py-3 px-4 text-left">Message</th>
                <th className="py-3 px-4 text-left">Status</th>{" "}
                {/* Removed whitespace-nowrap */}
                <th className="py-3 px-4 text-left">Received</th>{" "}
                {/* Removed whitespace-nowrap */}
                <th className="py-3 px-4 text-left">Actions</th>{" "}
                {/* Removed whitespace-nowrap */}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{inquiry.name}</td>{" "}
                  {/* Removed whitespace-nowrap */}
                  <td className="py-3 px-4">{inquiry.email}</td>{" "}
                  {/* Removed whitespace-nowrap */}
                  <td className="py-3 px-4">{inquiry.phone || "N/A"}</td>{" "}
                  {/* Removed whitespace-nowrap */}
                  <td className="py-3 px-4">{inquiry.subject}</td>{" "}
                  {/* Removed whitespace-nowrap */}
                  <td className="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis">
                    <p className="text-sm text-gray-700">
                      {truncateText(inquiry.message, 100)}
                    </p>
                    {inquiry.message && inquiry.message.length > 100 && (
                      <button
                        onClick={() => openMessageModal(inquiry.message)}
                        className="text-blue-500 hover:underline ml-1 text-xs font-semibold"
                      >
                        Read More
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {" "}
                    {/* Removed whitespace-nowrap */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        inquiry.read // Check the 'read' boolean field
                          ? "bg-blue-100 text-blue-800" // Style for read
                          : "bg-yellow-100 text-yellow-800" // Style for unread
                      }`}
                    >
                      {inquiry.read ? "read" : "unread"}{" "}
                      {/* Display "read" or "unread" */}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {" "}
                    {/* Removed whitespace-nowrap */}
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 items-start sm:items-center">
                    {!inquiry.read && ( // Only show button if inquiry is NOT read
                      <button
                        onClick={() => handleMarkAsRead(inquiry._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors whitespace-nowrap"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => confirmDelete(inquiry._id)}
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

      {/* Full Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={closeMessageModal}
        title="Full Message"
      >
        <p className="whitespace-pre-wrap">{currentMessageContent}</p>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="Confirm Deletion"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this inquiry? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeConfirmModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteInquiry}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
