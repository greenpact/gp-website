import React, { useState, useEffect, useRef } from "react";
import api from "../api";

export default function ManagePhotos() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [captions, setCaptions] = useState({}); // { fileName: caption }
  const fileInputRef = useRef(null);

  // Fetch all albums for the dropdown
  useEffect(() => {
    const fetchAlbumsForDropdown = async () => {
      try {
        const res = await api.get("/albums/admin-all");
        setAlbums(res.data);
        if (res.data.length > 0) {
          setSelectedAlbumId(res.data[0]._id); // Select the first album by default
        }
      } catch (err) {
        console.error("Error fetching albums for dropdown:", err);
        setError("Failed to load albums for photo management.");
      }
    };
    fetchAlbumsForDropdown();
  }, []);

  // Fetch photos for the selected album
  useEffect(() => {
    if (selectedAlbumId) {
      const fetchPhotos = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get(`/photos/${selectedAlbumId}`);
          setPhotos(res.data);
        } catch (err) {
          console.error("Error fetching photos:", err);
          setError(err.response?.data?.message || "Failed to load photos.");
        } finally {
          setLoading(false);
        }
      };
      fetchPhotos();
    } else {
      setPhotos([]); // Clear photos if no album is selected
      setLoading(false);
    }
  }, [selectedAlbumId]);

  const handleAlbumSelectChange = (e) => {
    setSelectedAlbumId(e.target.value);
    setMessage("");
    setError(null);
  };

  const handleFileChange = (e) => {
    setFilesToUpload(Array.from(e.target.files));
    // Initialize captions state for each selected file
    const initialCaptions = {};
    Array.from(e.target.files).forEach((file) => {
      initialCaptions[file.name] = "";
    });
    setCaptions(initialCaptions);
  };

  const handleCaptionChange = (fileName, value) => {
    setCaptions((prev) => ({ ...prev, [fileName]: value }));
  };

  const handleUploadPhotos = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    if (!selectedAlbumId) {
      setError("Please select an album first.");
      return;
    }
    if (filesToUpload.length === 0) {
      setError("Please select photos to upload.");
      return;
    }

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("photos", file); // 'photos' must match backend upload.array field name
    });
    // Append captions as an array, matching the order of files
    const orderedCaptions = filesToUpload.map(
      (file) => captions[file.name] || ""
    );
    console.log("Sending captions:", orderedCaptions); // Debug log
    formData.append("captions", JSON.stringify(orderedCaptions)); // Send as JSON string

    try {
      await api.post(`/photos/${selectedAlbumId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Photos uploaded successfully!");
      setShowUploadModal(false);
      setFilesToUpload([]);
      setCaptions({});
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPhotos(); // Re-fetch photos for the current album
    } catch (err) {
      console.error("Error uploading photos:", err);
      setError(err.response?.data?.message || "Failed to upload photos.");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }
    setMessage("");
    setError(null);
    try {
      await api.delete(`/photos/${photoId}`);
      setMessage("Photo deleted successfully!");
      fetchPhotos(); // Re-fetch photos
    } catch (err) {
      console.error("Error deleting photo:", err);
      setError(err.response?.data?.message || "Failed to delete photo.");
    }
  };

  // Function to re-fetch photos (used after an action)
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/photos/${selectedAlbumId}`);
      setPhotos(res.data);
    } catch (err) {
      console.error("Error re-fetching photos:", err);
      setError(err.response?.data?.message || "Failed to load photos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto sm:max-w-4xl lg:max-w-6xl">
      <h3 className="text-2xl font-bold text-greenpact-green-dark mb-6 text-center">
        Manage Album Photos
      </h3>
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-grow">
          <label
            htmlFor="albumSelect"
            className="block text-gray-700 font-medium mb-1"
          >
            Select Album:
          </label>
          <select
            id="albumSelect"
            value={selectedAlbumId}
            onChange={handleAlbumSelectChange}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenpact-green-light"
          >
            {albums.length === 0 ? (
              <option value="">No albums available</option>
            ) : (
              <>
                <option value="">-- Select an Album --</option>
                {albums.map((album) => (
                  <option key={album._id} value={album._id}>
                    {album.title}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          disabled={!selectedAlbumId}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedAlbumId
              ? "bg-greenpact-orange text-white hover:bg-greenpact-orange-dark"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Upload Photos to Album
        </button>
      </div>

      {selectedAlbumId && (
        <>
          {loading ? (
            <div className="text-center py-4">Loading photos...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : photos.length === 0 ? (
            <p className="text-gray-600 text-center">
              No photos in this album yet. Upload some!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  className="bg-gray-100 rounded-lg shadow-sm overflow-hidden flex flex-col"
                >
                  <img
                    src={`http://localhost:5000/uploads/${photo.imageUrl.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={photo.caption || "Gallery Photo"}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <p className="text-sm text-gray-800 mb-2 line-clamp-2">
                      {photo.caption || "No caption"}
                    </p>
                    <button
                      onClick={() => handleDeletePhoto(photo._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition-colors self-end"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload Photos Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center z-[1000] overflow-y-auto pt-10 pb-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[calc(100vh-5rem)]">
            <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white z-10">
              <h4 className="text-xl font-bold text-greenpact-green-dark">
                Upload Photos to{" "}
                {albums.find((a) => a._id === selectedAlbumId)?.title ||
                  "Selected Album"}
              </h4>
              <button
                onClick={() => setShowUploadModal(false)}
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
              onSubmit={handleUploadPhotos}
              className="flex-grow overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="photos"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Select Photos (Max 50)
                </label>
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  multiple // Allow multiple file selection
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-greenpact-green file:text-white hover:file:bg-greenpact-green-dark"
                />
                {filesToUpload.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {filesToUpload.length} file(s) selected.
                  </p>
                )}
              </div>
              {filesToUpload.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-md font-semibold text-gray-700">
                    Add Captions (Optional):
                  </h5>
                  {filesToUpload.map((file, index) => (
                    <div key={file.name} className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 font-medium w-1/3 truncate">
                        {file.name}:
                      </span>
                      <input
                        type="text"
                        value={captions[file.name] || ""}
                        onChange={(e) =>
                          handleCaptionChange(file.name, e.target.value)
                        }
                        placeholder="Enter caption"
                        className="flex-grow px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
              {error && (
                <p className="text-red-600 text-center text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={filesToUpload.length === 0}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  filesToUpload.length > 0
                    ? "bg-greenpact-orange text-white hover:bg-greenpact-orange-dark"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Upload Selected Photos
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
