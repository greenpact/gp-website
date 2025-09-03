import React from "react";

export default function CommunityServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <section className="animate-[scaleIn_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Community Service & Scientific Contribution
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Engaging communities and advancing scientific knowledge for
            sustainable impact.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-left animate-[slideInUp_0.6s_ease-out]">
          <p className="text-gray-600 mb-4 leading-relaxed">
            Beyond research, data collection, and training, Greenpact Consulting
            contributes to the scientific community through high-quality reports
            and publications.
          </p>
          <p className="text-gray-600 leading-relaxed">
            As part of our commitment to community service, we offer free
            training to public institutions, including universities, Technical
            and Vocational Education Institutes, and government organizations.
          </p>
        </section>
      </div>
    </div>
  );
}
