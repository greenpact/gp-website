import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function ApplicationForm({ isAuthenticated, currentUser }) {
  const { vacancyId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    cvFile: null,
  });
  const [vacancy, setVacancy] = useState(null);
  const [loadingVacancy, setLoadingVacancy] = useState(!!vacancyId); // Only load if vacancyId exists
  const [vacancyError, setVacancyError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vacancy details
  useEffect(() => {
    if (vacancyId) {
      const fetchVacancyDetails = async () => {
        setLoadingVacancy(true);
        setVacancyError(null);
        try {
          const res = await api.get(`/vacancies/${vacancyId}`);
          setVacancy(res.data || null);
        } catch (err) {
          console.error("Error fetching vacancy details:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });
          setVacancyError(
            "Failed to load vacancy details. You can still submit a general application."
          );
          setVacancy(null);
        } finally {
          setLoadingVacancy(false);
        }
      };
      fetchVacancyDetails();
    } else {
      setLoadingVacancy(false);
    }
  }, [vacancyId]);

  // Auto-fill email if authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      setFormData((prev) => ({ ...prev, email: currentUser.email }));
    }
  }, [currentUser, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSubmitError(null); // Clear errors on input change
    setSubmitMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size (e.g., max 5MB)
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setSubmitError("Please upload a PDF, DOC, or DOCX file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("File size must be less than 5MB.");
        return;
      }
      setFormData({ ...formData, cvFile: file });
      setSubmitError(null);
      setSubmitMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    setSubmitError(null);
    setIsSubmitting(true);

    if (!isAuthenticated) {
      setSubmitError("You must be logged in to submit an application.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.message.trim() ||
      !formData.cvFile
    ) {
      setSubmitError(
        "Please fill in all required fields and upload a valid CV/Resume."
      );
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("firstName", formData.firstName.trim());
    data.append("lastName", formData.lastName.trim());
    data.append("email", formData.email.trim());
    data.append("message", formData.message.trim());
    data.append("cvFile", formData.cvFile);
    if (formData.phone.trim()) data.append("phone", formData.phone.trim());
    if (vacancyId) data.append("vacancyId", vacancyId);

    try {
      const res = await api.post("/applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitMessage(
        res.data.message || "Application submitted successfully!"
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: isAuthenticated && currentUser?.email ? currentUser.email : "",
        phone: "",
        message: "",
        cvFile: null,
      });
      document.getElementById("cvFile").value = "";
      navigate("/profile");
    } catch (err) {
      console.error("Application submission error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setSubmitError(
        err.response?.data?.message || err.request
          ? "No response from server. Please check your network connection."
          : "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always render a base container to avoid white screen
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center px-4 py-20 pt-32">
      {loadingVacancy && vacancyId ? (
        <p className="text-lg text-gray-600 animate-pulse">
          Loading vacancy details...
        </p>
      ) : vacancyError && vacancyId && !vacancy ? (
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{vacancyError}</p>
          <button
            onClick={() => navigate("/careers")}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            View Other Vacancies
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
            Application Form
          </h1>
          {vacancy && (
            <h2 className="text-2xl font-semibold text-green-600 mb-6 text-center">
              Applying for: {vacancy.title}
            </h2>
          )}
          {!vacancy && vacancyId && (
            <p className="text-red-600 text-center mb-4">
              Could not load vacancy details. Submitting a general application.
            </p>
          )}
          <p className="text-gray-600 mb-6 text-center">
            Tell us about yourself, your interests, and upload your CV.
          </p>

          {submitMessage && (
            <p className="text-green-600 text-center mb-4">{submitMessage}</p>
          )}
          {submitError && (
            <p className="text-red-600 text-center mb-4">{submitError}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                autoComplete="off"
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                autoComplete="off"
                aria-required="true"
              />
            </div>
            <div>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                autoComplete="off"
                readOnly={isAuthenticated && currentUser?.email}
                style={
                  isAuthenticated && currentUser?.email
                    ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                    : {}
                }
                aria-required="true"
              />
            </div>
            <div>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="cvFile"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Upload CV/Resume <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="cvFile"
                name="cvFile"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                accept=".pdf,.doc,.docx"
                required
                aria-required="true"
              />
              {formData.cvFile && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected file: {formData.cvFile.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Motivational Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Tell us why you're a great fit for this role..."
                required
                autoComplete="off"
                aria-required="true"
              ></textarea>
            </div>
            <button
              type="submit"
              className={`w-full px-8 py-3 rounded-full font-semibold text-lg transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
