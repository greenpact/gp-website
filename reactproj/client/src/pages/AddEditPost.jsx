import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEditPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      let uploadedImageUrl = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          const uploadErrorData = await uploadRes.json();
          throw new Error(uploadErrorData.message || "Image upload failed.");
        }

        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.url;
      }

      const postResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            summary,
            content,
            author,
            imageUrl: uploadedImageUrl,
          }),
        }
      );

      if (!postResponse.ok) {
        const postErrorData = await postResponse.json();
        throw new Error(postErrorData.message || "Failed to add post.");
      }

      const newPost = await postResponse.json();
      setMessage(`Post "${newPost.title}" created successfully!`);

      // Reset form fields
      setTitle("");
      setSummary("");
      setContent("");
      setAuthor("");
      setFile(null);

      // Redirect to the admin blog page with a full page reload to fetch the new data
      window.location.href = "/admin/blog";
    } catch (err) {
      setError(err.message);
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
      <h2 className="text-3xl font-extrabold text-greenpact-green-dark mb-6 text-center">
        Add New Blog Post
      </h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {message && (
        <div className="text-green-500 mb-4 text-center">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenpact-green-dark"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows="3"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenpact-green-dark"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenpact-green-dark"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Author
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenpact-green-dark"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenpact-green-dark"
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-greenpact-green-dark text-white rounded-lg hover:bg-greenpact-orange transition-colors duration-200 font-semibold"
          >
            {loading ? "Adding..." : "Add Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
