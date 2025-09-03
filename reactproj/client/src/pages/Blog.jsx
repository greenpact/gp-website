import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/posts`
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (posts.length === 0)
    return <div className="text-center p-8">No posts available.</div>;

  return (
    <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1> 
         {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {" "}
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
                       {" "}
            {post.imageUrl && (
              <img // Correcting the image URL to include the server address
                src={`${import.meta.env.VITE_API_URL}${post.imageUrl}`}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
                       {" "}
            <div className="p-4">
                           {" "}
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>     
                     {" "}
              <p className="text-gray-600 text-sm mb-2">
                                By {post.author} -{" "}
                {new Date(post.date).toLocaleDateString()}             {" "}
              </p>
                            <p className="text-gray-700 mb-4">{post.summary}</p>
                           {" "}
              <Link
                to={`/blog/${post._id}`}
                className="text-blue-500 hover:underline font-semibold"
              >
                                Read Full Content →              {" "}
              </Link>
                         {" "}
            </div>
                     {" "}
          </div>
        ))}
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Blog;
