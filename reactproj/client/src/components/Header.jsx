import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo.png";

export default function Header({
  isAuthenticated,
  setIsAuthenticated,
  currentUser,
  setCurrentUser,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesSubMenuOpen, setIsMobileServicesSubMenuOpen] =
    useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const servicesDropdownRef = useRef(null);
  const dropdownCloseTimeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/login", { replace: true });
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsMobileServicesSubMenuOpen(false);
  };

  useEffect(() => {
    setIsServicesDropdownOpen(false);
    setIsMobileServicesSubMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMouseEnterServices = () => {
    clearTimeout(dropdownCloseTimeoutRef.current);
    setIsServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutsideMobile = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setIsMobileServicesSubMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMobile);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMobile);
  }, []);

  const profilePicUrl = currentUser?.profilePicture
    ? `http://localhost:5000/uploads/${currentUser.profilePicture.replace(
        /\\/g,
        "/"
      )}`
    : null;

  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile
      ? "block px-4 py-3 text-base font-medium transition-colors duration-200"
      : "px-3 py-2 text-base font-medium transition-colors duration-200";
    const activeClasses = "text-green-700 border-b-2 border-green-700";
    const inactiveClasses = "text-gray-600 hover:text-green-600";

    const isActive =
      path === location.pathname ||
      (path === "/admin" && location.pathname.startsWith("/admin/")) ||
      (path === "/blog" && location.pathname.startsWith("/blog"));
    const isServicesActive =
      path === "/services" && location.pathname.startsWith("/services");

    return `${baseClasses} ${
      isActive || isServicesActive ? activeClasses : inactiveClasses
    }`;
  };

  const serviceLinks = [
    { to: "/services/research", text: "Research" },
    { to: "/services/data-management", text: "Data Management" },
    { to: "/services/training", text: "Training" },
    {
      to: "/services/community-service-scientific-contribution",
      text: "Community & Scientific Contribution",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-6 transition-all duration-300 ${
        scrolled ? "bg-green-50 shadow-lg" : "bg-white"
      }`}
    >
      <style>
        {`
          @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .dropdown-item {
            opacity: 0;
            animation: slideInDown 0.3s ease-out forwards;
          }
          .dropdown-item.stagger-0 { animation-delay: 0s; }
          .dropdown-item.stagger-1 { animation-delay: 0.05s; }
          .dropdown-item.stagger-2 { animation-delay: 0.1s; }
          .dropdown-item.stagger-3 { animation-delay: 0.15s; }
        `}
      </style>

      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logo}
            alt="Greenpact Consulting Logo"
            className="h-24 md:h-28 w-auto transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/200x100/107C41/FFFFFF?text=Greenpact+Logo";
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!(isAuthenticated && currentUser?.role === "admin") && (
            <Link to="/" className={getLinkClasses("/")}>
              Home
            </Link>
          )}
          <Link to="/who-we-are" className={getLinkClasses("/who-we-are")}>
            Who We Are
          </Link>

          <div
            className="relative"
            onMouseEnter={handleMouseEnterServices}
            onMouseLeave={handleMouseLeaveServices}
            ref={servicesDropdownRef}
          >
            <Link to="/services" className={getLinkClasses("/services")}>
              Services
              <svg
                className="w-4 h-4 inline-block ml-1 -mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
            {isServicesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 z-50">
                <div className="py-2">
                  {serviceLinks.map((link, index) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 dropdown-item stagger-${index}`}
                      onClick={() => setIsServicesDropdownOpen(false)}
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/partners" className={getLinkClasses("/partners")}>
            Partners
          </Link>
          <Link to="/blog" className={getLinkClasses("/blog")}>
            Blog
          </Link>
          <Link to="/gallery" className={getLinkClasses("/gallery")}>
            Gallery
          </Link>
          <Link to="/work-with-us" className={getLinkClasses("/work-with-us")}>
            Work With Us
          </Link>
          <Link to="/contact-us" className={getLinkClasses("/contact-us")}>
            Contact Us
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {currentUser?.role === "admin" && (
                <Link to="/admin" className={getLinkClasses("/admin")}>
                  Admin Dashboard
                </Link>
              )}
              <div
                onClick={() => navigate("/profile")}
                className="cursor-pointer w-10 h-10 rounded-full bg-gray-100 border-2 border-green-600 hover:border-green-700 transition-all duration-200 overflow-hidden"
                title="Go to Profile"
              >
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={28} className="text-gray-500" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 shadow-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/register"
                className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300 text-sm font-medium"
              >
                Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => navigate("/profile")}
                className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 border-2 border-green-600 hover:border-green-700 transition-all duration-200 overflow-hidden"
                title="Go to Profile"
              >
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={24} className="text-gray-500" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-all duration-300 text-xs font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 text-xs font-medium"
            >
              Login
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-green-600 hover:text-green-700 focus:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full py-4"
        >
          <div className="px-4 space-y-2">
            {!(isAuthenticated && currentUser?.role === "admin") && (
              <Link
                to="/"
                className={getLinkClasses("/", true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/who-we-are"
              className={getLinkClasses("/who-we-are", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Who We Are
            </Link>
            <div>
              <button
                onClick={() =>
                  setIsMobileServicesSubMenuOpen(!isMobileServicesSubMenuOpen)
                }
                className={`${getLinkClasses(
                  "/services",
                  true
                )} w-full text-left flex justify-between items-center`}
                aria-expanded={isMobileServicesSubMenuOpen}
              >
                Services
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${
                    isMobileServicesSubMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isMobileServicesSubMenuOpen && (
                <div className="pl-6 py-2 space-y-1">
                  {serviceLinks.map((link, index) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 dropdown-item stagger-${index}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileServicesSubMenuOpen(false);
                      }}
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/partners"
              className={getLinkClasses("/partners", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Partners
            </Link>
            <Link
              to="/blog"
              className={getLinkClasses("/blog", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/gallery"
              className={getLinkClasses("/gallery", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/work-with-us"
              className={getLinkClasses("/work-with-us", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Work With Us
            </Link>
            <Link
              to="/contact-us"
              className={getLinkClasses("/contact-us", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            {isAuthenticated && currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className={getLinkClasses("/admin", true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-200">
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
