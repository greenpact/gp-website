// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useRef
import api from "../api"; // Your configured Axios instance
import { useNavigate } from "react-router-dom";

export default function Profile({
  isAuthenticated,
  currentUser,
  setIsAuthenticated,
  setCurrentUser,
}) {
  const [userApplications, setUserApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState(null);
  const navigate = useNavigate();

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // State for profile picture management
  const [profilePicMessage, setProfilePicMessage] = useState("");
  const [profilePicError, setProfilePicError] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);

  // Effect to fetch user applications
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if not authenticated
      return;
    }

    const fetchUserApplications = async () => {
      setLoadingApplications(true);
      setApplicationsError(null);
      try {
        const res = await api.get("/applications/me");
        setUserApplications(res.data);
      } catch (err) {
        console.error("Error fetching user applications:", err);
        setApplicationsError(
          err.response?.data?.message || "Failed to load your applications."
        );
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchUserApplications();
  }, [isAuthenticated, navigate]);

  // Effect to update local storage when currentUser changes (from props or internal updates)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    setCurrentUser(null); // Clear current user state
    navigate("/");
  };

  // Function to trigger the hidden file input click
  const handleProfilePicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection and automatic upload
  const handleFileSelectedAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProfilePicError("No file selected.");
      return;
    }

    setUploadingPic(true);
    setProfilePicMessage("");
    setProfilePicError(null);

    const formData = new FormData();
    formData.append("profilePicture", file); // 'profilePicture' must match backend's upload.single() field name

    try {
      const res = await api.put("/users/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfilePicMessage(res.data.msg);
      // Directly update currentUser state with new profile picture path from response
      const updatedUser = {
        ...currentUser,
        profilePicture: res.data.profilePicture,
      };
      setCurrentUser(updatedUser); // This will trigger the useEffect for localStorage update
      // Clear the file input value to allow selecting the same file again if needed
      e.target.value = null;
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setProfilePicError(
        err.response?.data?.msg || "Failed to upload profile picture."
      );
      setProfilePicMessage(""); // Clear success message if error occurs
    } finally {
      setUploadingPic(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    if (!currentUser.profilePicture) {
      setProfilePicError("No profile picture to remove.");
      return;
    }

    setUploadingPic(true); // Use this for general operation feedback
    setProfilePicMessage("");
    setProfilePicError(null);

    try {
      const res = await api.delete("/users/profile-picture");
      setProfilePicMessage(res.data.msg);
      // Directly update currentUser state by removing profile picture path
      const updatedUser = { ...currentUser, profilePicture: undefined }; // Or null
      setCurrentUser(updatedUser); // This will trigger the useEffect for localStorage update
    } catch (err) {
      console.error("Error removing profile picture:", err);
      setProfilePicError(
        err.response?.data?.msg || "Failed to remove profile picture."
      );
      setProfilePicMessage(""); // Clear success message if error occurs
    } finally {
      setUploadingPic(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center text-red-600">
        Please log in to view your profile.
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center">
        Loading user data...
      </div>
    );
  }

  // Determine profile picture URL
  const profilePicUrl = currentUser.profilePicture
    ? `http://localhost:5000/uploads/${currentUser.profilePicture.replace(
        /\\/g,
        "/"
      )}`
    : "https://placehold.co/150x150/aabbcc/ffffff?text=No+Photo"; // Placeholder image

  return (
    <div className="container mx-auto px-4 py-20 pt-28">
      <h1 className="text-4xl font-bold text-greenpact-green-dark mb-6 text-center">
        Your Profile
      </h1>

      <section className="bg-white p-8 rounded-lg shadow-md mb-12 text-center">
        <h2 className="text-3xl font-semibold text-greenpact-green mb-4">
          Welcome, {currentUser.name}!
        </h2>

        {/* Profile Picture Section */}
        <div className="mb-6">
          {/* Hidden file input */}
          <input
            type="file"
            id="profilePictureUpload"
            name="profilePictureUpload"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelectedAndUpload} // Auto-upload on file selection
            ref={fileInputRef} // Attach ref to the input
            style={{ display: "none" }} // Hide the input
          />
          {/* Clickable Image Area */}
          <div
            onClick={!uploadingPic ? handleProfilePicClick : undefined} // Prevent click when uploading
            className={`w-32 h-32 rounded-full mx-auto object-cover border-4 border-greenpact-green-light shadow-lg cursor-pointer flex items-center justify-center overflow-hidden ${
              uploadingPic ? "opacity-70 cursor-not-allowed" : ""
            }`}
            style={{
              backgroundImage: `url(${profilePicUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title={
              uploadingPic ? "Uploading..." : "Click to change profile picture"
            }
          >
            {/* If no profile picture and not uploading, show placeholder text */}
            {!currentUser.profilePicture && !uploadingPic && (
              <span className="text-white text-xs font-semibold text-center p-2">
                Click to add photo
              </span>
            )}
            {/* If uploading, show a spinner or text */}
            {uploadingPic && (
              <span className="text-white text-xs font-semibold text-center p-2">
                Uploading...
              </span>
            )}
            {/* The actual image is now set as background-image for better circular display */}
          </div>

          <div className="mt-4 flex flex-col items-center space-y-2">
            {profilePicMessage && (
              <p className="text-green-600 text-sm mt-2">{profilePicMessage}</p>
            )}
            {profilePicError && (
              <p className="text-red-600 text-sm mt-2">{profilePicError}</p>
            )}

            {currentUser.profilePicture && ( // Only show remove button if a picture exists
              <button
                onClick={handleRemoveProfilePic}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                disabled={uploadingPic}
              >
                {uploadingPic ? "Removing..." : "Remove Photo"}
              </button>
            )}
          </div>
        </div>

        <p className="text-lg text-greenpact-text mb-2">
          Username: {currentUser.username}
        </p>
        <p className="text-lg text-greenpact-text mb-2">
          Email: {currentUser.email}
        </p>
        <p className="text-lg text-greenpact-text mb-4">
          Role: <span className="capitalize">{currentUser.role}</span>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
        >
          Logout
        </button>
      </section>

      {/* User Applications Section */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-greenpact-green mb-6 text-center">
          Your Applications
        </h2>
        {loadingApplications ? (
          <p className="text-center text-gray-600">
            Loading your submitted applications...
          </p>
        ) : applicationsError ? (
          <p className="text-red-600 text-center">{applicationsError}</p>
        ) : userApplications.length === 0 ? (
          <p className="text-gray-600 text-center">
            You have not submitted any applications yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-greenpact-green text-white">
                  <th className="py-3 px-4 text-left">Application Date</th>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left">Message Excerpt</th>
                  <th className="py-3 px-4 text-left">CV/Resume</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {app.vacancyId
                        ? app.vacancyId.title
                        : "General Application"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {app.message.substring(0, 100)}
                      {app.message.length > 100 ? "..." : ""}
                    </td>
                    <td className="py-3 px-4">
                      {app.cvPath ? (
                        <a
                          href={`http://localhost:5000/uploads/${app.cvPath.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download CV
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
