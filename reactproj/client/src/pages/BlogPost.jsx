import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load post. Please try again later.");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!post) return <div className="text-center p-8">Post not found.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden p-6 sm:p-8">
        {post.imageUrl && (
          <img
            // Correcting the image URL to include the full server address
            src={`http://localhost:5000${post.imageUrl}`}
            alt={post.title}
            className="w-full h-auto object-cover rounded-lg shadow-md mb-6"
          />
        )}
        <h1 className="text-4xl font-extrabold text-greenpact-green-dark mb-4">
          {post.title}
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          By {post.author} - {new Date(post.date).toLocaleDateString()}
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {post.summary}
        </p>
        <div className="text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
          {post.content}
        </div>
        <Link
          to="/blog"
          className="mt-8 inline-block text-blue-500 hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
