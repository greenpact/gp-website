// src/components/Alert.jsx
import React, { useEffect, useState } from "react";

export default function Alert({ message, type, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  // Determine styling based on type
  let bgColor = "bg-blue-100";
  let textColor = "text-blue-800";
  let borderColor = "border-blue-400";
  let icon = (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      ></path>
    </svg>
  );

  if (type === "success") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    borderColor = "border-green-400";
    icon = (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  } else if (type === "error") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    borderColor = "border-red-400";
    icon = (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  }

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose(); // Call parent's onClose handler
        }
      }, duration);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm rounded-lg border ${bgColor} ${textColor} ${borderColor}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{icon}</div>
      <span className="sr-only">
        {type === "success" ? "Success" : type === "error" ? "Error" : "Info"}
      </span>
      <div>
        <span className="font-medium">{message}</span>
      </div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} rounded-lg focus:ring-2 focus:ring-${type}-400 p-1.5 hover:${bgColor.replace(
          "100",
          "200"
        )} inline-flex h-8 w-8`}
        data-dismiss-target="#alert-1"
        aria-label="Close"
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
}
