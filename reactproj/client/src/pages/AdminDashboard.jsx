import React, { useState } from "react";
import ManageVacancies from "../components/ManageVacancies.jsx";
import ManageApplications from "../components/ManageApplications.jsx";
import ManageContactInquiries from "../components/ManageContactInquiries.jsx";
import AddVacancyForm from "../components/AddVacancyForm.jsx";
import ManageAlbums from "../components/ManageAlbums.jsx";
import ManagePhotos from "../components/ManagePhotos.jsx";
import CommentModeration from "../components/CommentModeration.jsx";
import AdminBlog from "../pages/AdminBlog.jsx";
import AddEditPost from "../pages/AddEditPost.jsx";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("vacancies");

  return (
    <div className="container mx-auto px-4 py-20 pt-28">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold text-greenpact-green-dark mb-8 text-center">
        Admin Dashboard
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* Tabs / Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 border-b pb-4">
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "vacancies"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Vacancies
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "applications"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Applications
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "inquiries"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Inquiries
          </button>
          <button
            onClick={() => setActiveTab("add-vacancy")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "add-vacancy"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Add New Vacancy
          </button>
          <button
            onClick={() => setActiveTab("manage-albums")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "manage-albums"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Albums
          </button>
          <button
            onClick={() => setActiveTab("manage-photos")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "manage-photos"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Photos
          </button>
          <button
            onClick={() => setActiveTab("manage-comments")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "manage-comments"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Comments
          </button>
          <button
            onClick={() => setActiveTab("manage-blog")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "manage-blog"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Manage Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("add-blog")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === "add-blog"
                ? "bg-greenpact-orange text-white shadow-md"
                : "bg-gray-200 text-greenpact-green-dark hover:bg-gray-300"
            }`}
          >
            Add Blog
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "vacancies" && <ManageVacancies />}
          {activeTab === "applications" && <ManageApplications />}
          {activeTab === "inquiries" && <ManageContactInquiries />}
          {activeTab === "add-vacancy" && <AddVacancyForm />}
          {activeTab === "manage-albums" && <ManageAlbums />}
          {activeTab === "manage-photos" && <ManagePhotos />}
          {activeTab === "manage-comments" && <CommentModeration />}
          {activeTab === "manage-blog" && <AdminBlog />}
          {activeTab === "add-blog" && <AddEditPost />}
        </div>
      </div>
    </div>
  );
}
