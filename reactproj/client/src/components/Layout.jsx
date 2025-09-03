// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
  children,
  isAuthenticated,
  setIsAuthenticated,
  currentUser, // <--- NEW: Accept currentUser as a prop
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        currentUser={currentUser} // <--- NEW: Pass currentUser to Header
      />
      {/*
        Add padding-top to the main content area.
        The value (e.g., pt-20) should be slightly more than your header's height.
        Adjust 'pt-20' or 'pt-24' as needed if content is still covered.
      */}
      <main className="flex-grow pt-20"> {children}</main>
      <Footer />
    </div>
  );
}
