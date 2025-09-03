import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const [displayTitle, setDisplayTitle] = useState("");

  useEffect(() => {
    if (serviceName) {
      const formattedName = serviceName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setDisplayTitle(formattedName);
    }
  }, [serviceName]);

  const serviceContent = {
    Research: {
      title: "In-depth Research Services",
      description:
        "Our research services encompass quantitative, qualitative, and mixed-methods approaches. Specializing in market research, feasibility studies, and impact assessments, we deliver reliable data and actionable insights to drive your success.",
    },
    "Data Management": {
      title: "Comprehensive Data Management",
      description:
        "We provide end-to-end data management solutions, from collection and cleaning to storage, analysis, and visualization. Our secure systems ensure data integrity and compliance with global privacy standards.",
    },
    Training: {
      title: "Expert Training Programs",
      description:
        "Enhance your team's skills with tailored training in research methods, statistical software (e.g., SPSS, R, Python), and advanced methodologies. Our practical workshops empower real-world application.",
    },
    "Community Service & Scientific Contribution": {
      title: "Engaging for Impact",
      description:
        "Greenpact is committed to community service and scientific advancement through impactful publications and collaborations. We foster sustainable development through meaningful engagement.",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <section className="animate-[scaleIn_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            {displayTitle || "Service Details"}
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explore our {displayTitle || "service"} offerings, designed to
            deliver tailored solutions for sustainable impact.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-left animate-[slideInUp_0.6s_ease-out]">
          {serviceContent[displayTitle] ? (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold text-green-800 mb-4">
                {serviceContent[displayTitle].title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {serviceContent[displayTitle].description}
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              Please select a specific service from the navigation to view its
              details.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
