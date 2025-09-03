// src/pages/AlbumDetail.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Refs for sections to observe
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const photosGridRef = useRef(null); // Ref for the photos grid container

  // States to trigger animations
  const [isTitleInView, setIsTitleInView] = useState(false);
  const [isDescriptionInView, setIsDescriptionInView] = useState(false);
  const [isPhotosGridInView, setIsPhotosGridInView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch album details
        const albumRes = await api.get(`/albums/${albumId}`);
        setAlbum(albumRes.data);

        // Fetch photos for this album
        const photosRes = await api.get(`/photos/${albumId}`);
        setPhotos(photosRes.data);
      } catch (err) {
        console.error("Error fetching album details or photos:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load album details or photos."
        );
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchData();
    }
  }, [albumId]);

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
    const cleanupDescription = createObserver(
      descriptionRef,
      setIsDescriptionInView
    );
    const cleanupPhotosGrid = createObserver(
      photosGridRef,
      setIsPhotosGridInView
    );

    return () => {
      cleanupTitle();
      cleanupDescription();
      cleanupPhotosGrid();
    };
  }, [album, photos]); // Re-run if album or photos data changes (after initial fetch)

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const showNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const showPrevPhoto = () => {
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center">
        Loading album...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center text-red-600">
        {error}
        <p className="mt-4">
          <Link to="/gallery" className="text-blue-600 hover:underline">
            Back to Albums
          </Link>
        </p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center text-gray-600">
        Album not found.
        <p className="mt-4">
          <Link to="/gallery" className="text-blue-600 hover:underline">
            Back to Albums
          </Link>
        </p>
      </div>
    );
  }

  const currentPhoto = photos[currentPhotoIndex];

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

        /* Staggered animations for individual photos */
        .album-photo-item {
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.6s ease-out forwards;
        }
        .album-photo-item.stagger-0 { animation-delay: 0s; }
        .album-photo-item.stagger-1 { animation-delay: 0.05s; }
        .album-photo-item.stagger-2 { animation-delay: 0.1s; }
        .album-photo-item.stagger-3 { animation-delay: 0.15s; }
        .album-photo-item.stagger-4 { animation-delay: 0.2s; }
        .album-photo-item.stagger-5 { animation-delay: 0.25s; }
        .album-photo-item.stagger-6 { animation-delay: 0.3s; }
        .album-photo-item.stagger-7 { animation-delay: 0.35s; }
        .album-photo-item.stagger-8 { animation-delay: 0.4s; }
        .album-photo-item.stagger-9 { animation-delay: 0.45s; }
        /* Add more .stagger-X classes if you expect more than 10 photos per album */
        `}
      </style>

      <Link
        to="/gallery"
        className="inline-flex items-center text-greenpact-green hover:text-greenpact-green-dark transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Albums
      </Link>

      <h1
        ref={titleRef}
        className={`text-4xl font-bold text-greenpact-green-dark mb-4 text-center ${
          isTitleInView ? "animate-fadeInScale" : "opacity-0"
        }`}
        style={{ animationDelay: "0s" }}
      >
        {album.title}
      </h1>
      {album.description && (
        <p
          ref={descriptionRef}
          className={`text-lg text-greenpact-text mb-8 text-center max-w-3xl mx-auto ${
            isDescriptionInView ? "animate-fadeIn" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          {album.description}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No photos in this album yet.
        </p>
      ) : (
        <div
          ref={photosGridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"
        >
          {photos.map((photo, index) => (
            <div
              key={photo._id}
              className={`relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105 album-photo-item ${
                isPhotosGridInView ? `stagger-${index}` : ""
              }`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={`http://localhost:5000/uploads/${photo.imageUrl.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x250/E9F5EB/107C41?text=No+Image";
                }} // Fallback image
              />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && currentPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[2000] p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>

          <button
            onClick={showPrevPhoto}
            className="absolute left-4 text-white text-5xl p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors z-10"
            aria-label="Previous photo"
          >
            &#8249;
          </button>
          <button
            onClick={showNextPhoto}
            className="absolute right-4 text-white text-5xl p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors z-10"
            aria-label="Next photo"
          >
            &#8250;
          </button>

          <div className="relative max-w-4xl max-h-full flex flex-col items-center justify-center">
            <img
              src={`http://localhost:5000/uploads/${currentPhoto.imageUrl.replace(
                /\\/g,
                "/"
              )}`}
              alt={currentPhoto.caption || `Photo ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
            {currentPhoto.caption && (
              <p className="text-white text-center mt-4 text-lg bg-gray-800 bg-opacity-70 px-4 py-2 rounded-md">
                {currentPhoto.caption}
              </p>
            )}
            <p className="text-gray-300 text-sm mt-2">
              {currentPhotoIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
