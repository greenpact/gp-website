import React, { useState } from "react";

const AddBlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post.");
      }

      const newPost = await response.json();
      setMessage(`Post "${newPost.title}" created successfully!`);
      setFormData({
        title: "",
        summary: "",
        content: "",
        author: "",
      });
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-greenpact-green-dark mb-4">
        Add New Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-greenpact-orange focus:border-greenpact-orange"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="summary"
            className="block text-gray-700 font-medium mb-1"
          >
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-greenpact-orange focus:border-greenpact-orange"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-greenpact-orange focus:border-greenpact-orange"
            rows="10"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="author"
            className="block text-gray-700 font-medium mb-1"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-greenpact-orange focus:border-greenpact-orange"
            required
          />
        </div>
        {message && (
          <div
            className={`p-3 my-4 rounded-lg text-center ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-greenpact-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPost;
