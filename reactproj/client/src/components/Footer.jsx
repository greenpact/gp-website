import React from "react";
import logo from "../assets/images/logo.png"; // Ensure path is correct
import { Link } from "react-router-dom";
import { navLinks } from "../utils/navLinks"; // Verify this file exists

export default function Footer() {
  // Fallback navLinks in case import fails
  const fallbackNavLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact-us" },
  ];

  // Use fallback if navLinks is undefined or not an array
  const links = Array.isArray(navLinks) ? navLinks : fallbackNavLinks;

  return (
    <footer className="border-t border-gray-200 bg-gray-800 text-white py-12">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
        `}
      </style>
      <div className="container mx-auto px-4 text-center">
        {/* Logo with fallback */}
        <Link
          to="/"
          className="inline-block mb-4"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logo}
            alt="GreenPact Consulting Logo"
            className="h-24 md:h-28 w-auto mx-auto transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/200x100/107C41/FFFFFF?text=Greenpact+Logo";
            }}
          />
        </Link>
        <p className="text-gray-200 text-lg mb-6">
          Proficient and Tailored Consultancy Service!
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {links.map((link) => (
            <Link
              key={`footer-${link.name}`}
              to={link.path || "/"}
              className="text-gray-200 hover:text-green-600 px-3 py-1 rounded-full transition-colors font-medium"
            >
              {link.name || "Link"}
            </Link>
          ))}
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} GreenPact Consulting. All rights
          reserved.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Built with MERN Stack | Inspired by WordPress & Newsup Theme
        </p>
      </div>
    </footer>
  );
}
