// src/components/ManageAlbums.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api";

export default function ManageAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null); // For editing
  const [newAlbumData, setNewAlbumData] = useState({
    title: "",
    description: "",
    coverImage: null,
    isActive: true,
  });

  const fileInputRef = useRef(null); // Ref for file input in Add/Edit forms

  const fetchAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/albums/admin-all"); // Admin endpoint for all albums
      setAlbums(res.data);
    } catch (err) {
      console.error("Error fetching albums:", err);
      setError(err.response?.data?.message || "Failed to load albums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewAlbumData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleAddAlbumSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    const formData = new FormData();
    formData.append("title", newAlbumData.title);
    formData.append("description", newAlbumData.description);
    formData.append("isActive", newAlbumData.isActive);
    if (newAlbumData.coverImage) {
      formData.append("coverImage", newAlbumData.coverImage);
    }

    try {
      await api.post("/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Album added successfully!");
      setShowAddModal(false);
      setNewAlbumData({
        title: "",
        description: "",
        coverImage: null,
        isActive: true,
      });
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
      fetchAlbums();
    } catch (err) {
      console.error("Error adding album:", err);
      setError(err.response?.data?.message || "Failed to add album.");
    }
  };

  const handleEditClick = (album) => {
    setCurrentAlbum(album);
    setNewAlbumData({
      // Populate form with current album data
      title: album.title,
      description: album.description,
      coverImage: null, // Don't pre-fill file input
      isActive: album.isActive,
    });
    setShowEditModal(true);
  };

  const handleEditAlbumSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    const formData = new FormData();
    formData.append("title", newAlbumData.title);
    formData.append("description", newAlbumData.description);
    formData.append("isActive", newAlbumData.isActive);
    if (newAlbumData.coverImage) {
      formData.append("coverImage", newAlbumData.coverImage);
    } else if (currentAlbum.coverImageUrl && !newAlbumData.coverImage) {
      // If no new image selected but existing one was there, and user didn't explicitly remove it
      // this case is handled by not appending 'coverImage' and letting backend keep old one
    }

    // Special handling for removing existing cover image if checkbox is added later
    // For now, if newAlbumData.coverImage is null and currentAlbum.coverImageUrl exists,
    // we assume user wants to keep the old one unless they explicitly upload a new one.
    // If you add a "remove cover image" checkbox, you'd add:
    // if (newAlbumData.removeCoverImage) formData.append("removeCoverImage", true);

    try {
      await api.put(`/albums/${currentAlbum._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Album updated successfully!");
      setShowEditModal(false);
      setCurrentAlbum(null);
      setNewAlbumData({
        // Reset form
        title: "",
        description: "",
        coverImage: null,
        isActive: true,
      });
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
      fetchAlbums();
    } catch (err) {
      console.error("Error updating album:", err);
      setError(err.response?.data?.message || "Failed to update album.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this album? All associated photos will also be deleted."
      )
    ) {
      return;
    }
    setMessage("");
    setError(null);
    try {
      await api.delete(`/albums/${id}`);
      setMessage("Album and its photos deleted successfully!");
      fetchAlbums();
    } catch (err) {
      console.error("Error deleting album:", err);
      setError(err.response?.data?.message || "Failed to delete album.");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading albums...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto sm:max-w-4xl lg:max-w-6xl">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Manage Photo Albums
      </h3>
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}

      <button
        onClick={() => setShowAddModal(true)}
        className="bg-greenpact-orange text-white px-4 py-2 rounded-md hover:bg-greenpact-orange-dark transition-colors mb-6"
      >
        Add New Album
      </button>

      {albums.length === 0 ? (
        <p className="text-gray-600 text-center">No albums found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg table-auto">
            <thead>
              <tr className="bg-greenpact-green text-white">
                <th className="py-3 px-4 text-left whitespace-nowrap">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Cover Image
                </th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album) => (
                <tr
                  key={album._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 whitespace-nowrap">{album.title}</td>
                  <td className="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis">
                    {album.description || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {album.coverImageUrl ? (
                      <img
                        src={`http://localhost:5000/uploads/${album.coverImageUrl.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={album.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No Cover</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        album.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {album.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 items-start sm:items-center">
                    <button
                      onClick={() => handleEditClick(album)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(album._id)}
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

      {/* Add Album Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center z-[1000] overflow-y-auto pt-10 pb-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[calc(100vh-5rem)]">
            <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white z-10">
              <h4 className="text-xl font-bold text-greenpact-green-dark">
                Add New Album
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
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
            <form
              onSubmit={handleAddAlbumSubmit}
              className="flex-grow overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Album Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newAlbumData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newAlbumData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Cover Image
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleInputChange}
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-greenpact-green file:text-white hover:file:bg-greenpact-green-dark"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newAlbumData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-greenpact-green border-gray-300 rounded focus:ring-greenpact-green"
                />
                <label htmlFor="isActive" className="ml-2 block text-gray-700">
                  Active (visible in public gallery)
                </label>
              </div>
              {error && (
                <p className="text-red-600 text-center text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-greenpact-orange text-white py-2 px-4 rounded-md hover:bg-greenpact-orange-dark transition-colors"
              >
                Add Album
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Album Modal */}
      {showEditModal && currentAlbum && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center z-[1000] overflow-y-auto pt-10 pb-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[calc(100vh-5rem)]">
            <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white z-10">
              <h4 className="text-xl font-bold text-greenpact-green-dark">
                Edit Album: {currentAlbum.title}
              </h4>
              <button
                onClick={() => setShowEditModal(false)}
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
            <form
              onSubmit={handleEditAlbumSubmit}
              className="flex-grow overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Album Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newAlbumData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newAlbumData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Change Cover Image
                </label>
                {currentAlbum.coverImageUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Cover:</p>
                    <img
                      src={`http://localhost:5000/uploads/${currentAlbum.coverImageUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Current Cover"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleInputChange}
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-greenpact-green file:text-white hover:file:bg-greenpact-green-dark"
                />
                {/* Optional: Add a checkbox to explicitly remove the cover image */}
                {/*
                {currentAlbum.coverImageUrl && (
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="removeCoverImage"
                      name="removeCoverImage"
                      checked={newAlbumData.removeCoverImage || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-600"
                    />
                    <label htmlFor="removeCoverImage" className="ml-2 block text-red-600 text-sm">
                      Remove Current Cover Image
                    </label>
                  </div>
                )}
                */}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newAlbumData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-greenpact-green border-gray-300 rounded focus:ring-greenpact-green"
                />
                <label htmlFor="isActive" className="ml-2 block text-gray-700">
                  Active (visible in public gallery)
                </label>
              </div>
              {error && (
                <p className="text-red-600 text-center text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-greenpact-orange text-white py-2 px-4 rounded-md hover:bg-greenpact-orange-dark transition-colors"
              >
                Update Album
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
