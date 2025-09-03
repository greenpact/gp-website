import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Import Layout component
import Layout from "./components/Layout";

// Import all your page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ContactUs from "./pages/ContactUs";
import Gallery from "./pages/Gallery";
import AlbumDetail from "./pages/AlbumDetail";
import Partners from "./pages/Partners";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import WhoWeAre from "./pages/WhoWeAre";
import WorkWithUs from "./pages/WorkWithUs";
import ApplicationForm from "./pages/ApplicationForm";
import ResearchServicePage from "./pages/ResearchServicePage";
import DataManagementServicePage from "./pages/DataManagementServicePage";
import TrainingServicePage from "./pages/TrainingServicePage";
import CommunityServicePage from "./pages/CommunityServicePage";
import EditVacancyForm from "./components/EditVacancyForm";

// Import Blog components
import Blog from "./pages/blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";
import AddEditPost from "./pages/AddEditPost"; // <-- added

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("currentUser");
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error(
        "Failed to parse currentUser from localStorage on init:",
        e
      );
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [isAuthenticated, currentUser]);

  return (
    <Layout
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
    >
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            isAuthenticated && currentUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Home
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            )
          }
        />
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              currentUser?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setCurrentUser={setCurrentUser}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register
                setIsAuthenticated={setIsAuthenticated}
                setCurrentUser={setCurrentUser}
              />
            )
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated && currentUser?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/edit-vacancy/:id"
          element={
            isAuthenticated && currentUser?.role === "admin" ? (
              <EditVacancyForm />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/blog"
          element={
            isAuthenticated && currentUser?.role === "admin" ? (
              <AdminBlog /> // <-- manage posts only
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/blog/add"
          element={
            isAuthenticated && currentUser?.role === "admin" ? (
              <AddEditPost /> // <-- add/edit post page with Image URL input
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Public Routes */}
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/research" element={<ResearchServicePage />} />
        <Route
          path="/services/data-management"
          element={<DataManagementServicePage />}
        />
        <Route path="/services/training" element={<TrainingServicePage />} />
        <Route
          path="/services/community-service-scientific-contribution"
          element={<CommunityServicePage />}
        />
        <Route path="/partners" element={<Partners />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:albumId" element={<AlbumDetail />} />
        <Route path="/work-with-us" element={<WorkWithUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                setIsAuthenticated={setIsAuthenticated}
                setCurrentUser={setCurrentUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/blog/add"
          element={
            isAuthenticated && currentUser?.role === "admin" ? (
              <AddEditPost />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/apply/:vacancyId"
          element={
            isAuthenticated ? (
              <ApplicationForm
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/apply"
          element={
            isAuthenticated ? (
              <ApplicationForm
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
