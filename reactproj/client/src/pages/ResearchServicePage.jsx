import React from "react";

export default function ResearchServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <section className="animate-[scaleIn_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Research Services
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conducting in-depth studies and analysis to provide actionable
            insights for sustainable outcomes.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-left animate-[slideInUp_0.6s_ease-out]">
          <p className="text-gray-600 mb-4 leading-relaxed">
            Greenpact Consulting excels in managing complex panel data sets to
            produce high-quality scientific papers and client-focused reports.
            Our expertise extends to systematic reviews and meta-analyses using
            secondary data from journals and reports.
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-800 mb-4 mt-6">
            Areas of Research
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {[
              "Impact/program evaluation",
              "Experimental economics",
              "Economic valuation",
              "Value chain analysis",
              "Nutrition and food security",
              "Adoption of technologies/practices",
              "Risk and livelihood",
              "Farming system analysis",
            ].map((item, index) => (
              <li
                key={index}
                className="animate-[slideInUp_0.6s_ease-out_0.2s]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
