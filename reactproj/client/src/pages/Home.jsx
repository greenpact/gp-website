import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import heroImage from "../assets/images/partners.png"; // Placeholder for the hero image
import api from "../api";
import solomonImage from "../assets/images/solomon.jpg"; // Correct import for Solomon's image
import ermiasImage from "../assets/images/ermias.jpg"; // Correct import for Ermias's image

// Reusable component for animating sections on scroll
const AnimatedSection = ({ children, animation, threshold = 0.2 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  return (
    <div
      ref={ref}
      className={`
        ${animation}
        transition-all duration-1000 ease-out
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      {children}
    </div>
  );
};

export default function Home({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showHeroTyping, setShowHeroTyping] = useState(false);
  const [showTaglineTyping, setShowTaglineTyping] = useState(false);
  const [galleryAlbums, setGalleryAlbums] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(null);

  const mainTitleRef = useRef(null);
  const welcomeSectionRef = useRef(null);
  const latestPostsRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const partnersRef = useRef(null);
  const whoWeAreRef = useRef(null);
  const workWithUsRef = useRef(null);

  const [isMainTitleInView, setIsMainTitleInView] = useState(false);
  const [isWelcomeSectionInView, setIsWelcomeSectionInView] = useState(false);
  const [isLatestPostsInView, setIsLatestPostsInView] = useState(false);
  const [isGallerySectionInView, setIsGallerySectionInView] = useState(false);
  const [isPartnersInView, setIsPartnersInView] = useState(false);
  const [isWhoWeAreInView, setIsWhoWeAreInView] = useState(false);
  const [isWorkWithUsInView, setIsWorkWithUsInView] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      setGalleryLoading(true);
      setGalleryError(null);
      try {
        const res = await api.get("/albums?limit=3");
        setGalleryAlbums(res.data);
      } catch (err) {
        console.error("Error fetching albums for homepage:", err);
        setGalleryError("Failed to load gallery preview.");
      } finally {
        setGalleryLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse currentUser from localStorage", e);
        }
      }
    } else {
      setCurrentUser(null);
    }

    const heroTypingTimer = setTimeout(() => setShowHeroTyping(true), 800);
    const taglineTypingTimer = setTimeout(
      () => setShowTaglineTyping(true),
      1800
    );

    return () => {
      clearTimeout(heroTypingTimer);
      clearTimeout(taglineTypingTimer);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
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
      return () => ref.current && observer.unobserve(ref.current);
    };

    const observers = [
      createObserver(mainTitleRef, setIsMainTitleInView),
      createObserver(welcomeSectionRef, setIsWelcomeSectionInView),
      createObserver(latestPostsRef, setIsLatestPostsInView),
      createObserver(gallerySectionRef, setIsGallerySectionInView),
      createObserver(partnersRef, setIsPartnersInView),
      createObserver(whoWeAreRef, setIsWhoWeAreInView),
      createObserver(workWithUsRef, setIsWorkWithUsInView),
    ];

    return () => observers.forEach((cleanup) => cleanup());
  }, []);

  const latestPosts = [
    {
      id: 1,
      title: "Catalyzing Sustainable Business Growth",
      date: "Jun 27, 2025",
      image:
        "https://via.placeholder.com/400x250/107C41/FFFFFF?text=Sustainable+Growth",
      link: "/catalyzing",
    },
    {
      id: 2,
      title: "Greenpact: Proficient and Tailored Consultancy Service!",
      date: "Oct 6, 2022",
      image:
        "https://via.placeholder.com/400x250/107C41/FFFFFF?text=Consultancy+Service",
      link: "#",
    },
  ];

  const examplePartners = [
    {
      id: 1,
      name: "EcoSolutions Inc.",
      logo: "https://placehold.co/100x100/4CAF50/FFFFFF?text=ES",
      description:
        "Leading innovators in sustainable waste management and recycling technologies.",
    },
    {
      id: 2,
      name: "GreenTech Innovations",
      logo: "https://placehold.co/100x100/2196F3/FFFFFF?text=GTI",
      description:
        "Developing cutting-edge renewable energy solutions for urban environments.",
    },
    {
      id: 3,
      name: "Community Harvest NGO",
      logo: "https://placehold.co/100x100/FFC107/FFFFFF?text=CH",
      description:
        "Dedicated to empowering local communities through sustainable agriculture and education.",
    },
    {
      id: 4,
      name: "Sustainable Futures Fund",
      logo: "https://placehold.co/100x100/9C27B0/FFFFFF?text=SFF",
      description:
        "Investing in environmentally responsible businesses and green infrastructure projects.",
    },
  ];

  const founderProfiles = [
    {
      id: 1,
      name: "Dr. Solomon Bizuayehu Wassie",
      title: "Co-founder & Lead Consultant",
      bio: "With over 15 years of expertise in agricultural economics, Dr. Solomon leads with a focus on sustainable development and impactful research.",
      image: solomonImage, // Corrected image source
    },
    {
      id: 2,
      name: "Dr. Ermias Tesfaye Teferi",
      title: "Co-founder & Lead Consultant",
      bio: "Dr. Ermias brings 15+ years of experience in data management and social impact assessment, enhancing our multidisciplinary approach.",
      image: ermiasImage, // Corrected image source
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Coffee Stumping Endline Survey (IFPRI)",
      year: 2022,
      icon: "☕",
    },
    {
      id: 2,
      name: "Youth Employment & Labor Market Survey (RTI)",
      year: 2022,
      icon: "📊",
    },
    {
      id: 3,
      name: "Field-in-Lab Experiment (Arizona Uni & IFPRI)",
      year: 2021,
      icon: "🔬",
    },
    {
      id: 4,
      name: "Quality Upgrading in Domestic Value Chains Survey",
      year: 2022,
      icon: "🌾",
    },
    {
      id: 5,
      name: "Off-Grid Energy & Water Access Project (UCL, CGE, Bahirdar Uni)",
      year: 2021,
      icon: "💡",
    },
    {
      id: 6,
      name: "GIZ-Green Innovation Centers Baseline Study",
      year: "Ongoing",
      icon: "🌱",
    },
    {
      id: 7,
      name: "TOMATO Project Baseline Survey (DAAD Germany)",
      year: 2021,
      icon: "🍅",
    },
    {
      id: 8,
      name: "IFAD & IFPRI Joint Project Survey",
      year: 2019,
      icon: "🌍",
    },
    {
      id: 9,
      name: "Bahir Dar University & CARE Ethiopia Socio-Economic Project",
      year: 2019,
      icon: "🤝",
    },
    {
      id: 10,
      name: "2016 Wheat Grower Survey (IFPRI)",
      year: 2016,
      icon: "🚜",
    },
    {
      id: 11,
      name: "Social Networking & Migration in East Africa (Life and Peace Institute)",
      year: "Ongoing",
      icon: "🔗",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes blink-caret {
            from, to { border-color: transparent; }
            50% { border-color: white; }
          }
          .typewriter {
            overflow: hidden;
            white-space: nowrap;
            letter-spacing: 0.05em;
            width: 0;
          }
          .hero-typewriter {
            animation: typing 3s steps(40, end) forwards, blink-caret 0.75s step-end infinite;
            animation-delay: 0.8s, 0.8s;
            animation-fill-mode: backwards;
          }
          .tagline-typewriter {
            animation: typing 2.5s steps(40, end) forwards;
            animation-delay: 0s;
            animation-fill-mode: backwards;
            border-right: 2px solid #107C41;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1
            className={`text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-[scaleIn_0.8s_ease-out] ${
              isMainTitleInView ? "" : "opacity-0"
            }`}
          >
            Driving Sustainable Impact
          </h1>
          {showHeroTyping && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light hero-typewriter">
              Tailored Consultancy for a Sustainable Future
            </p>
          )}
          <Link
            to="/about"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg font-medium animate-[slideInUp_0.6s_ease-out_3.5s] animate-fill-backwards"
          >
            Discover Our Mission
          </Link>
        </div>
      </section>
      {/* Main Title */}
      <div
        ref={mainTitleRef}
        className={`text-center py-12 px-4 ${
          isMainTitleInView ? "animate-[scaleIn_0.8s_ease-out]" : "opacity-0"
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Greenpact Consulting
        </h1>
        {showTaglineTyping && (
          <p className="text-lg md:text-xl text-gray-600 font-medium tagline-typewriter mx-auto max-w-2xl">
            Empowering Sustainable Success
          </p>
        )}
      </div>
      {/* Welcome Section */}
      <section
        ref={welcomeSectionRef}
        className={`py-16 px-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl mx-4 md:mx-8 shadow-xl ${
          isWelcomeSectionInView
            ? "animate-[slideInUp_0.6s_ease-out]"
            : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
            Welcome to Greenpact
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            At Greenpact Consulting, we empower organizations to thrive
            sustainably. Our innovative strategies and tailored solutions help
            you navigate challenges and achieve lasting impact.
          </p>
          <Link
            to="/services"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore Our Services
          </Link>
        </div>
      </section>
      ---
      {/* Who We Are Section */}
      <section
        ref={whoWeAreRef}
        className={`py-16 px-4 ${
          isWhoWeAreInView ? "animate-[fadeIn_0.8s_ease-out]" : "opacity-0"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Greenpact Consulting, based in Ethiopia, is a legally registered
            firm dedicated to delivering tailored consultancy services. Our
            passion for sustainable development drives us to create impactful
            solutions for our partners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover
                transition-all duration-500 ease-out
                ${
                  isWhoWeAreInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }
              `}
            >
              <div className="flex items-center mb-4">
                <img
                  src={founderProfiles[0].image}
                  alt={founderProfiles[0].name}
                  className="w-24 h-24 rounded-full mr-4 border-2 border-green-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800">
                    {founderProfiles[0].name}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {founderProfiles[0].title}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{founderProfiles[0].bio}</p>
            </div>
            <div
              className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover
                transition-all duration-500 ease-out
                ${
                  isWhoWeAreInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }
              `}
            >
              <div className="flex items-center mb-4">
                <img
                  src={founderProfiles[1].image}
                  alt={founderProfiles[1].name}
                  className="w-24 h-24 rounded-full mr-4 border-2 border-green-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800">
                    {founderProfiles[1].name}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {founderProfiles[1].title}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{founderProfiles[1].bio}</p>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-xl shadow-inner mb-12">
            <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">
              Our Multi-Disciplinary Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-lg bg-green-100">
                <p className="text-3xl font-bold text-green-700">2</p>
                <p className="text-sm font-medium text-green-800">
                  Full-time Staff
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-100">
                <p className="text-3xl font-bold text-green-700">2</p>
                <p className="text-sm font-medium text-green-800">
                  Associate Consultants
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-100">
                <p className="text-3xl font-bold text-green-700">15+</p>
                <p className="text-sm font-medium text-green-800">
                  Experienced Consultants
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-100">
                <p className="text-3xl font-bold text-green-700">170+</p>
                <p className="text-sm font-medium text-green-800">
                  Field Team Members
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Key Projects & Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`bg-white p-6 rounded-lg shadow-md card-hover
                    ${
                      isWhoWeAreInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }
                  `}
                  style={{
                    transitionDelay: isWhoWeAreInView
                      ? `${0.1 * index}s`
                      : "0s",
                  }}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{project.icon}</span>
                    <p className="font-semibold text-green-800">
                      {project.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">Year: {project.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      ---
      {/* Partners Section */}
      <section
        ref={partnersRef}
        className={`py-16 px-4 bg-green-50 rounded-2xl mx-4 md:mx-8 shadow-xl ${
          isPartnersInView ? "animate-[fadeIn_0.8s_ease-out]" : "opacity-0"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
            Our Valued Partners
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10">
            At GreenPact Consulting, collaboration drives sustainable change. We
            partner with organizations, businesses, and institutions committed
            to environmental stewardship and impactful solutions.
          </p>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Who We Work With
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {examplePartners.map((partner, index) => (
                <div
                  key={partner.id}
                  className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover transition-all duration-500 ease-out
                    ${
                      isPartnersInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }
                  `}
                  style={{
                    transitionDelay: isPartnersInView
                      ? `${index * 0.1}s`
                      : "0s",
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} Logo`}
                    className="w-24 h-24 rounded-full mb-4 border-2 border-green-200 object-cover mx-auto"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/100x100/4CAF50/FFFFFF?text=Partner";
                    }}
                  />
                  <h3 className="text-xl font-semibold text-green-800 mb-2 text-center">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">
                    {partner.description}
                  </p>
                  <Link
                    to="/partners"
                    className="block text-center text-green-600 text-sm font-medium hover:underline"
                  >
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Our Collaboration Principles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div
                className={`p-6 bg-white rounded-lg shadow-md card-hover
                  ${
                    isPartnersInView
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }
                `}
                style={{ transitionDelay: isPartnersInView ? "0.1s" : "0s" }}
              >
                <h4 className="font-semibold text-lg text-green-700 mb-2">
                  Shared Vision
                </h4>
                <p className="text-gray-600 text-sm">
                  Aligning on long-term goals for collective success.
                </p>
              </div>
              <div
                className={`p-6 bg-white rounded-lg shadow-md card-hover
                  ${
                    isPartnersInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }
                `}
                style={{ transitionDelay: isPartnersInView ? "0.2s" : "0s" }}
              >
                <h4 className="font-semibold text-lg text-green-700 mb-2">
                  Mutual Benefit
                </h4>
                <p className="text-gray-600 text-sm">
                  Ensuring partnerships foster growth for all parties.
                </p>
              </div>
              <div
                className={`p-6 bg-white rounded-lg shadow-md card-hover
                  ${
                    isPartnersInView
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }
                `}
                style={{ transitionDelay: isPartnersInView ? "0.3s" : "0s" }}
              >
                <h4 className="font-semibold text-lg text-green-700 mb-2">
                  Innovation & Impact
                </h4>
                <p className="text-gray-600 text-sm">
                  Driving creative solutions for measurable change.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Ready to Make a Difference Together?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We’re eager to explore collaborations that align with our mission.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Us to Partner
            </Link>
          </div>
        </div>
      </section>
      ---
      {/* Gallery Preview Section */}
      <section
        ref={gallerySectionRef}
        className={`py-16 px-4 ${
          isGallerySectionInView
            ? "animate-[fadeIn_0.8s_ease-out]"
            : "opacity-0"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">
          Our Gallery
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
          Explore our impactful projects and events through our curated photo
          albums.
        </p>
        {galleryLoading ? (
          <p className="text-center text-gray-600">Loading gallery...</p>
        ) : galleryError ? (
          <p className="text-center text-red-600">{galleryError}</p>
        ) : galleryAlbums.length === 0 ? (
          <p className="text-center text-gray-600">No albums available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {galleryAlbums.map((album, index) => (
              <Link
                key={album._id}
                to={`/gallery/${album._id}`}
                className={`bg-white rounded-lg overflow-hidden card-hover ${
                  isGallerySectionInView
                    ? `animate-[slideInUp_0.6s_ease-out_${0.2 * (index + 1)}s]`
                    : "opacity-0"
                }`}
              >
                <div className="relative w-full h-48">
                  {album.coverImageUrl ? (
                    <img
                      src={`http://localhost:5000/uploads/${album.coverImageUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={album.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x250/E9F5EB/107C41?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                      No Cover Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2 line-clamp-1">
                    {album.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {album.description || "No description available."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Full Gallery
          </Link>
        </div>
      </section>
      ---
      {/* Latest Posts */}
      <section
        ref={latestPostsRef}
        className={`py-16 px-4 ${
          isLatestPostsInView ? "animate-[fadeIn_0.8s_ease-out]" : "opacity-0"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">
          Greenpact Insights & News
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
          Stay informed with our latest insights and contributions to
          sustainable consulting.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {latestPosts.map((post, index) => (
            <div
              key={post.id}
              className={`bg-white rounded-lg shadow-md card-hover ${
                isLatestPostsInView
                  ? `animate-[slideInUp_0.6s_ease-out_${0.2 * (index + 1)}s]`
                  : "opacity-0"
              }`}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  <Link to={post.link || "#"} className="hover:text-green-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-2">{post.date}</p>
                <Link
                  to={post.link || "#"}
                  className="text-green-600 text-sm font-medium hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      ---
      {/* Join Our Team/Final CTA Section */}
      <section
        ref={workWithUsRef}
        className={`py-16 px-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl mx-4 md:mx-8 shadow-xl ${
          isWorkWithUsInView ? "animate-[slideInUp_0.6s_ease-out]" : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
            Transform Your Vision into Impact
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Partner with Greenpact Consulting for expert solutions in
            consultancy and capacity building. Passionate about sustainability?
            Join our team and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/contact"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get in Touch
            </Link>
            <Link
              to="/work-with-us"
              className="inline-block bg-gray-200 text-green-800 px-8 py-3 rounded-full hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Careers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
