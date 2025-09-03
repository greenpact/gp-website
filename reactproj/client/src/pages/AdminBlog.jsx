import { useState, useEffect, useRef } from "react";

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editingPost && editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingPost]);

  const handleEdit = (post) => {
    setEditingPost({ ...post });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/posts/${editingPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingPost),
        }
      );
      if (!response.ok) throw new Error("Failed to update post");
      const updatedPost = await response.json();
      setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
      setEditingPost(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to delete post");
      setPosts(posts.filter((p) => p._id !== postId));
      setConfirmDeleteId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <div className="text-center p-8 text-gray-700">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        Manage Blog Posts
      </h2>

      {/* Existing Posts */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 p-8">No posts available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center"
            >
              <span className="text-lg font-semibold text-gray-700 truncate w-full sm:w-auto mb-2 sm:mb-0">
                {post.title}
              </span>
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDeleteId(post._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this post?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Form */}
      {editingPost && (
        <div
          className="mt-8 bg-gray-100 p-6 sm:p-8 rounded-xl shadow-inner"
          ref={editFormRef}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Edit Post</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Summary</label>
              <textarea
                value={editingPost.summary}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, summary: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Content</label>
              <textarea
                value={editingPost.content}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, content: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={6}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Author</label>
              <input
                type="text"
                value={editingPost.author}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, author: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Image URL</label>
              <input
                type="text"
                value={editingPost.imageUrl}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, imageUrl: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              {editingPost.imageUrl && (
                <div className="mt-4 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={editingPost.imageUrl}
                    alt="Image Preview"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x400/D1D5DB/000000?text=Invalid+Image";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
