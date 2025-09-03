// src/components/Modal.jsx
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react"; // Import close icon

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset"; // Ensure scroll is re-enabled on unmount
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        // Close modal if clicking on the backdrop, not the modal content itself
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto relative flex flex-col max-h-[90vh]" // Added max-h and flex-col
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div
          className="mt-4 overflow-y-auto flex-grow"
          style={{ wordBreak: "break-word" }}
        >
          {" "}
          {/* ADDED: style={{ wordBreak: 'break-word' }} */}
          {children}
        </div>
      </div>
    </div>
  );
}
