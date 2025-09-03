import React from "react";

export default function DataManagementServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <section className="animate-[scaleIn_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Data Management Services
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Efficient and secure data handling for accurate, reliable reporting.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-left animate-[slideInUp_0.6s_ease-out]">
          <p className="text-gray-600 mb-4 leading-relaxed">
            Greenpact Consulting has extensive experience in data collection
            across Ethiopia, covering individual and firm-level surveys,
            community-level surveys, key informant interviews, and focus group
            discussions.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our team is certified in the Collaborative Institutional Training
            Initiative (CITI) program, ensuring compliance and expertise in
            social and behavioral surveys.
          </p>
        </section>
      </div>
    </div>
  );
}
