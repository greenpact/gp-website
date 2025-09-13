import React from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import partnerImage from "../assets/images/partners
.png";

// Reusable component for animating sections on scroll
// This component now handles opacity and transform states
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

export default function Partners() {
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

  const { ref: partnersRef, inView: partnersInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: principlesRef, inView: principlesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          .partner-card-anim { animation: slideInUp 0.6s ease-out forwards; }
          .principle-card-anim { animation: slideInUp 0.6s ease-out forwards; }
        `}
      </style>

      <div className="container mx-auto px-4 py-20 pt-32">
        {/* Main Content Section - Initial page load animation */}
        <div className="animate-[scaleIn_0.7s_ease-out]">
          <section className="bg-white p-8 rounded-2xl shadow-xl max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6 text-center tracking-tight">
              Our Valued Partners
            </h1>
            <p className="text-lg text-gray-600 mb-12 text-center leading-relaxed max-w-4xl mx-auto">
              At GreenPact Consulting, collaboration drives sustainable change.
              We partner with organizations, businesses, and institutions
              committed to environmental stewardship and impactful solutions.
            </p>

            <div className="flex justify-center mb-12">
              <img
                src={partnerImage}
                alt="GreenPact Consulting Partnership"
                className="w-full max-w-[800px] h-auto rounded-2xl shadow-xl object-cover animate-[scaleIn_0.6s_ease-out]"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/800x640/e0e0e0/555555?text=Partners+Image";
                }}
              />
            </div>
          </section>
        </div>

        <AnimatedSection animation="animate-[slideInUp_0.6s_ease-out]">
          <section className="mt-12 mb-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
              Why We Partner for Impact
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Our partnerships combine our expertise with our collaborators’
              strengths to address complex environmental and social challenges
              effectively.
            </p>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              We build long-term relationships based on shared values and a
              collective vision for a sustainable future.
            </p>
            <Link
              to="/contact-us"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Become a Partner
            </Link>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="animate-[fadeIn_0.6s_ease-out]">
          <section className="bg-green-50 p-8 rounded-2xl shadow-xl mb-12 text-center">
            <p className="text-xl italic text-gray-600 mb-6">
              "GreenPact’s dedication and expertise transformed our
              sustainability goals, inspiring us to think greener."
            </p>
            <p className="font-semibold text-lg text-green-800">
              - Jane Doe, CEO of Future Eco-Innovations
            </p>
          </section>
        </AnimatedSection>

        {/* Who We Work With Section - Animated on scroll */}
        <section ref={partnersRef} className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 text-center">
            Who We Work With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {examplePartners.map((partner, index) => (
              <div
                key={partner.id}
                className={`
                  bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover
                  transition-all duration-500 ease-out
                  ${
                    partnersInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }
                `}
                style={{
                  transitionDelay: partnersInView ? `${index * 0.1}s` : "0s",
                }}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  className="w-24 h-24 rounded-full mb-4 border-2 border-green-200 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/100x100/4CAF50/FFFFFF?text=Partner";
                  }}
                />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {partner.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {partner.description}
                </p>
                <span className="text-green-600 text-sm font-medium hover:underline cursor-pointer">
                  Learn More
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Our Collaboration Principles Section - Animated on scroll */}
        <section ref={principlesRef} className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 text-center">
            Our Collaboration Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Shared Vision",
                desc: "Aligning on long-term goals for collective success.",
                color: "bg-blue-50 border-blue-100 text-blue-700",
              },
              {
                title: "Mutual Benefit",
                desc: "Ensuring partnerships foster growth for all parties.",
                color: "bg-yellow-50 border-yellow-100 text-yellow-700",
              },
              {
                title: "Innovation & Impact",
                desc: "Driving creative solutions for measurable change.",
                color: "bg-green-50 border-green-100 text-green-700",
              },
            ].map((principle, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-lg shadow-md border card-hover ${principle.color}
                  transition-all duration-500 ease-out
                  ${
                    principlesInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }
                `}
                style={{
                  transitionDelay: principlesInView ? `${index * 0.15}s` : "0s",
                }}
              >
                <h3 className="text-xl font-semibold mb-3">
                  {principle.title}
                </h3>
                <p className="text-gray-600 text-sm">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final Call to Action Section - Animated on scroll */}
        <AnimatedSection animation="animate-[scaleIn_0.6s_ease-out]">
          <section className="p-8 bg-green-800 rounded-2xl shadow-xl text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make a Difference Together?
            </h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              We’re eager to explore collaborations that align with our mission
              for sustainability and innovation.
            </p>
            <Link
              to="/contact-us"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Us to Partner
            </Link>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
