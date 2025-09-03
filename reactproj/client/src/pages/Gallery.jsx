// src/pages/Gallery.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useRef
import api from "../api";
import { Link } from "react-router-dom";

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for sections to observe
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const albumsGridRef = useRef(null); // Ref for the grid container itself

  // States to trigger animations
  const [isTitleInView, setIsTitleInView] = useState(false);
  const [isIntroInView, setIsIntroInView] = useState(false);
  const [isAlbumsGridInView, setIsAlbumsGridInView] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/albums"); // Public endpoint for active albums
        setAlbums(res.data);
      } catch (err) {
        console.error("Error fetching albums for gallery:", err);
        setError(err.response?.data?.message || "Failed to load photo albums.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  // Intersection Observer Logic
  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const createObserver = (ref, setState) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState(true);
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      }, observerOptions);

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    };

    // Set up observers for each section
    const cleanupTitle = createObserver(titleRef, setIsTitleInView);
    const cleanupIntro = createObserver(introRef, setIsIntroInView);
    const cleanupAlbumsGrid = createObserver(
      albumsGridRef,
      setIsAlbumsGridInView
    );

    return () => {
      cleanupTitle();
      cleanupIntro();
      cleanupAlbumsGrid();
    };
  }, []); // Run once on component mount

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center">
        Loading photo albums...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 pt-28">
      {/* Custom CSS for animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Staggered animations for album cards */
        .album-card {
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.6s ease-out forwards;
        }
        .album-card.stagger-0 { animation-delay: 0s; }
        .album-card.stagger-1 { animation-delay: 0.1s; }
        .album-card.stagger-2 { animation-delay: 0.2s; }
        .album-card.stagger-3 { animation-delay: 0.3s; }
        .album-card.stagger-4 { animation-delay: 0.4s; }
        .album-card.stagger-5 { animation-delay: 0.5s; }
        .album-card.stagger-6 { animation-delay: 0.6s; }
        .album-card.stagger-7 { animation-delay: 0.7s; }
        .album-card.stagger-8 { animation-delay: 0.8s; }
        .album-card.stagger-9 { animation-delay: 0.9s; }
        /* Add more .stagger-X classes if you expect more than 10 albums */
        `}
      </style>

      <h1
        ref={titleRef}
        className={`text-4xl font-bold text-greenpact-green-dark mb-8 text-center ${
          isTitleInView ? "animate-fadeInScale" : "opacity-0"
        }`}
        style={{ animationDelay: "0s" }}
      >
        Our Gallery
      </h1>
      <p
        ref={introRef}
        className={`text-lg text-greenpact-text mb-12 text-center max-w-3xl mx-auto ${
          isIntroInView ? "animate-fadeIn" : "opacity-0"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        Explore our projects and events through these photo albums.
      </p>

      {albums.length === 0 ? (
        <p className="text-gray-600 text-center">
          No photo albums available yet.
        </p>
      ) : (
        <div
          ref={albumsGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {albums.map((album, index) => (
            <Link
              key={album._id}
              to={`/gallery/${album._id}`} // Link to individual album detail page
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl album-card ${
                isAlbumsGridInView ? `stagger-${index}` : ""
              }`}
            >
              <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                {album.coverImageUrl ? (
                  <img
                    src={`http://localhost:5000/uploads/${album.coverImageUrl.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={album.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x250/E9F5EB/107C41?text=No+Image";
                    }} // Fallback image
                  />
                ) : (
                  <span className="text-gray-500 text-lg">No Cover Image</span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-greenpact-green-dark mb-2 line-clamp-1">
                  {album.title}
                </h2>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {album.description || "No description available."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
