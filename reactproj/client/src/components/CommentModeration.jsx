import { useEffect, useState } from "react";
import api from "../api";

export default function CommentModeration() {
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingComments = async () => {
      try {
        const res = await api.get("/comments/catalyzing?pending=true");
        setPendingComments(res.data);
      } catch (err) {
        console.error("Error fetching pending comments:", err);
        setError("Failed to load pending comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPendingComments();
  }, []);

  const handleApprove = async (commentId) => {
    try {
      await api.put(`/comments/${commentId}/approve`);
      setPendingComments(pendingComments.filter((c) => c._id !== commentId));
      alert("Comment approved successfully!");
    } catch (err) {
      console.error("Error approving comment:", err);
      alert("Failed to approve comment.");
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        setPendingComments(pendingComments.filter((c) => c._id !== commentId));
        alert("Comment deleted successfully!");
      } catch (err) {
        console.error("Error deleting comment:", err);
        alert("Failed to delete comment.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-greenpact-green-dark mb-6">
        Pending Comments
      </h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pendingComments.length === 0 ? (
        <p className="text-gray-600">No pending comments.</p>
      ) : (
        <div className="space-y-4">
          {pendingComments.map((comment) => (
            <div
              key={comment._id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <p>
                <strong>Name:</strong> {comment.name}
              </p>
              <p>
                <strong>Email:</strong> {comment.email}
              </p>
              {comment.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={comment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-greenpact-orange hover:underline"
                  >
                    {comment.website}
                  </a>
                </p>
              )}
              <p>
                <strong>Comment:</strong> {comment.comment}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleApprove(comment._id)}
                  className="bg-greenpact-green text-white px-4 py-2 rounded-full hover:bg-greenpact-green-dark transition-colors duration-300"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
