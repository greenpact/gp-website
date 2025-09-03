import React from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import founderSolomon from "../assets/images/solomon.jpg";
import founderErmias from "../assets/images/ermias.jpg";

// This is a reusable component for animated sections
const AnimatedSection = ({ children, animation, threshold = 0.2 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  return (
    <div
      ref={ref}
      className={`${animation} transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

export default function WhoWeAre() {
  const keyProjects = [
    {
      id: 1,
      title: "Coffee Stumping Endline Survey (IFPRI)",
      description:
        "Successfully completed an endline survey in four districts of Sidama Region, Ethiopia.",
      year: 2022,
      icon: "☕",
    },
    {
      id: 2,
      title: "Youth Employment & Labor Market Survey (RTI)",
      description:
        "Implemented a comprehensive survey in four selected Woredas in Amhara Region.",
      year: 2022,
      icon: "📊",
    },
    {
      id: 3,
      title: "Field-in-Lab Experiment (Arizona Uni & IFPRI)",
      description:
        "Managed and implemented a joint project in four woredas of the Amhara region.",
      year: 2021,
      icon: "🔬",
    },
    {
      id: 4,
      title: "Quality Upgrading in Domestic Value Chains Survey",
      description:
        "Implemented a survey covering 15 woredas in Amhara, Oromia, and SNNP regions for wheat traders.",
      year: 2022,
      icon: "🌾",
    },
    {
      id: 5,
      title: "Off-Grid Energy & Water Access Project (UCL, CGE, Bahirdar Uni)",
      description:
        "Managed a joint project on innovative passive thermal Technologies for energy and water access.",
      year: 2021,
      icon: "💡",
    },
    {
      id: 6,
      title: "GIZ-Green Innovation Centers Baseline Study",
      description:
        "Led consultants for baseline study and gross margin calculations for wheat and Faba bean in ten districts.",
      year: "Ongoing",
      icon: "🌱",
    },
    {
      id: 7,
      title: "TOMATO Project Baseline Survey (DAAD Germany)",
      description:
        "Conducted baseline survey, extension service valuation, and gross margin determination for Tomato and Onion.",
      year: 2021,
      icon: "🍅",
    },
    {
      id: 8,
      title: "IFAD & IFPRI Joint Project Survey",
      description:
        "Led survey team (50+ people) and participated in write-up for data from 1665 households and 517 micro-watersheds.",
      year: 2019,
      icon: "🌍",
    },
    {
      id: 9,
      title: "Bahir Dar University & CARE Ethiopia Socio-Economic Project",
      description:
        "Led consultants in socio-economic work package, collecting data from over 1000 sample households.",
      year: 2019,
      icon: "🤝",
    },
    {
      id: 10,
      title: "2016 Wheat Grower Survey (IFPRI)",
      description:
        "Coordinated and implemented survey with 1184 households from 11 districts in Amhara and Oromia.",
      year: 2016,
      icon: "🚜",
    },
    {
      id: 11,
      title:
        "Social Networking & Migration in East Africa (Life and Peace Institute)",
      description:
        "Led a project working on social networking and its impact on migration.",
      year: "Ongoing",
      icon: "🔗",
    },
  ];

  const greenpactViews = [
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

  // Animation for Our Multi-Disciplinary Team
  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation for Key Projects
  const { ref: projectsRef, inView: projectsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @keyframes slideInFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInFromRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .card, .section { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
          .slide-left { animation: slideInFromLeft 0.8s ease-out forwards; }
          .slide-right { animation: slideInFromRight 0.8s ease-out forwards; }
        `}
      </style>

      <div className="container mx-auto px-4 py-20 pt-32">
        {/* Introduction Section */}
        <AnimatedSection animation="animate-scaleIn">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Who We Are
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Greenpact Consulting, based in Ethiopia, is a legally registered
              firm dedicated to delivering tailored consultancy services. Our
              passion for sustainable development drives us to create impactful
              solutions for our partners.
            </p>
          </section>
        </AnimatedSection>

        {/* Founders Section */}
        <AnimatedSection animation="animate-slideInUp">
          <section className="mb-16 bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
              Our Visionary Founders
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center md:w-1/2 card">
                <img
                  src={founderSolomon}
                  alt="Dr. Solomon Bizuayehu Wassie"
                  className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/150x150/4CAF50/FFFFFF?text=Dr.S";
                  }}
                />
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  Dr. Solomon Bizuayehu Wassie
                </h3>
                <p className="text-lg text-gray-600">
                  Co-founder & Lead Consultant
                </p>
                <p className="text-base text-gray-600 mt-2 max-w-md mx-auto">
                  With over 15 years of expertise in agricultural economics, Dr.
                  Solomon leads with a focus on sustainable development and
                  impactful research.
                </p>
              </div>
              <div className="text-center md:w-1/2 card">
                <img
                  src={founderErmias}
                  alt="Dr. Ermias Tesfaye Teferi"
                  className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/150x150/2196F3/FFFFFF?text=Dr.E";
                  }}
                />
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  Dr. Ermias Tesfaye Teferi
                </h3>
                <p className="text-lg text-gray-600">
                  Co-founder & Lead Consultant
                </p>
                <p className="text-base text-gray-600 mt-2 max-w-md mx-auto">
                  Dr. Ermias brings 15+ years of experience in data management
                  and social impact assessment, enhancing our multidisciplinary
                  approach.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Our Team Structure Section */}
        <section ref={teamRef} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
            Our Multi-Disciplinary Team
          </h2>
          <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Our agile team structure ensures efficient, high-quality project
            delivery across diverse consultancy tasks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "👨‍💼",
                title: "Full-time Staff",
                desc: "2 dedicated professionals for core operations and oversight.",
              },
              {
                icon: "👩‍💻",
                title: "Associate Consultants",
                desc: "2 specialists providing expertise on demand.",
              },
              {
                icon: "👥",
                title: "Experienced Consultants Pool",
                desc: "15+ highly skilled consultants for diverse needs.",
              },
              {
                icon: "📋",
                title: "Field Teams",
                desc: "150+ enumerators and 20+ supervisors for accurate data collection.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 bg-white rounded-lg shadow-md border border-gray-100 card ${
                  teamInView
                    ? index % 2 === 0
                      ? "slide-left"
                      : "slide-right"
                    : "opacity-0"
                }`}
                style={{
                  animationDelay: teamInView ? `${index * 0.2}s` : "0s",
                }}
              >
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Projects/Achievements Section */}
        <section ref={projectsRef} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
            Key Projects & Achievements
          </h2>
          <p className="text-lg text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Our track record showcases impactful projects driving sustainable
            outcomes across Ethiopia and beyond.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyProjects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 card ${
                  projectsInView ? "animate-slideInUp" : "opacity-0"
                }`}
                style={{
                  animationDelay: projectsInView ? `${index * 0.15}s` : "0s",
                }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{project.icon}</span>
                  <h3 className="text-xl font-semibold text-green-800">
                    {project.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {project.description}
                </p>
                <p className="text-gray-500 text-xs">Year: {project.year}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Our Team Section */}
        <AnimatedSection animation="animate-slideInUp">
          <section className="mb-16 bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl shadow-xl text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Growing Team!
            </h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              Passionate about sustainability and research? Explore career
              opportunities with Greenpact and make a difference.
            </p>
            <Link
              to="/apply"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Send Your Application
            </Link>
          </section>
        </AnimatedSection>

        {/* Greenpact Insights Section */}
        <AnimatedSection animation="animate-fadeIn">
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
              Greenpact Insights & News
            </h2>
            <p className="text-lg text-gray-600 text-center mb-10 max-w-3xl mx-auto">
              Stay informed with our latest insights and contributions to
              sustainable consulting.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {greenpactViews.map((view, index) => (
                <div
                  key={view.id}
                  className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 card animate-slideInUp`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {view.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{view.date}</p>
                  <Link
                    to={view.link}
                    className="text-green-600 hover:underline text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Final Call to Action */}
        <AnimatedSection animation="animate-scaleIn">
          <section className="text-center p-8 bg-green-800 rounded-2xl shadow-xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your Vision into Impact
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Partner with Greenpact Consulting for expert solutions in
              consultancy and capacity building.
            </p>
            <Link
              to="/contact-us"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get in Touch
            </Link>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
