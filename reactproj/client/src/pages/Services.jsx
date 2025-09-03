import React, { useState, useEffect, useRef } from "react";
import { Search, Database, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const introRef = useRef(null);
  const coreServicesRef = useRef(null);
  const taglineRef = useRef(null);
  const greenpactViewsRef = useRef(null);

  const [isIntroInView, setIsIntroInView] = useState(false);
  const [isCoreServicesInView, setIsCoreServicesInView] = useState(false);
  const [isTaglineInView, setIsTaglineInView] = useState(false);
  const [isGreenpactViewsInView, setIsGreenpactViewsInView] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const createObserver = (ref, setState) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState(true);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      if (ref.current) observer.observe(ref.current);
      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    };

    const cleanupIntro = createObserver(introRef, setIsIntroInView);
    const cleanupCoreServices = createObserver(
      coreServicesRef,
      setIsCoreServicesInView
    );
    const cleanupTagline = createObserver(taglineRef, setIsTaglineInView);
    const cleanupGreenpactViews = createObserver(
      greenpactViewsRef,
      setIsGreenpactViewsInView
    );

    return () => {
      cleanupIntro();
      cleanupCoreServices();
      cleanupTagline();
      cleanupGreenpactViews();
    };
  }, []);

  const latestPosts = [
    {
      id: 1,
      title: "Catalyzing Sustainable Business Growth: Your GreenPact Advantage",
      date: "Jun 27, 2025",
      link: "#",
    },
    {
      id: 2,
      title: "Greenpact: Proficient and Tailored Consultancy Service!",
      date: "Oct 6, 2022",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .service-card, .views-article { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .service-card:hover, .views-article:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
        `}
      </style>

      <div className="container mx-auto px-4 py-20 pt-32">
        {/* Intro Section */}
        <section
          ref={introRef}
          className={`text-center mb-16 animate-[scaleIn_0.8s_ease-out] ${
            isIntroInView ? "" : "opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Greenpact Consulting delivers tailored research, data collection,
            training, and community services, empowering sustainable solutions
            with expertise and precision.
          </p>
        </section>

        {/* Core Services Section */}
        <section
          ref={coreServicesRef}
          className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              to: "/services/research",
              icon: Search,
              title: "Research",
              desc: "In-depth studies and analysis for actionable insights.",
            },
            {
              to: "/services/data-management",
              icon: Database,
              title: "Data Management",
              desc: "Secure and efficient data handling for accurate reporting.",
            },
            {
              to: "/services/training",
              icon: GraduationCap,
              title: "Training",
              desc: "Specialized programs in research methods and statistical tools.",
            },
            {
              to: "/services/community-service-scientific-contribution",
              icon: Users,
              title: "Community & Scientific Contribution",
              desc: "Engaging communities and advancing scientific knowledge.",
            },
          ].map((service, index) => (
            <Link
              key={index}
              to={service.to}
              className={`service-card bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center animate-[slideInUp_0.6s_ease-out_${
                0.2 * index
              }s] ${isCoreServicesInView ? "" : "opacity-0"}`}
            >
              <service.icon
                className="h-12 w-12 text-green-600 mb-4"
                strokeWidth={1.5}
              />
              <h2 className="text-xl font-semibold text-green-800 mb-3">
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </Link>
          ))}
        </section>

        {/* Tagline Section */}
        <section
          ref={taglineRef}
          className={`text-center mb-16 animate-[scaleIn_0.8s_ease-out] ${
            isTaglineInView ? "" : "opacity-0"
          }`}
        >
          <p className="text-2xl md:text-3xl font-semibold text-green-800">
            Proficient and Tailored Consultancy Services
          </p>
        </section>

        {/* Greenpact Views Section */}
        <section
          ref={greenpactViewsRef}
          className={`bg-white p-8 rounded-2xl shadow-xl animate-[fadeIn_0.8s_ease-out] ${
            isGreenpactViewsInView ? "" : "opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
            Greenpact Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {latestPosts.map((post, index) => (
              <div
                key={post.id}
                className={`views-article bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 animate-[slideInUp_0.6s_ease-out_${
                  0.2 * index
                }s] ${isGreenpactViewsInView ? "" : "opacity-0"}`}
              >
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.date}</p>
                <Link
                  to={post.link}
                  className="text-green-600 hover:underline text-sm font-medium"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
