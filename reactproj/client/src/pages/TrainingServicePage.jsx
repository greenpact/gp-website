import React from "react";

export default function TrainingServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <section className="animate-[scaleIn_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Training Services
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Specialized training in research methods, statistical software, and
            methodologies for practical impact.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-left animate-[slideInUp_0.6s_ease-out]">
          <p className="text-gray-600 mb-4 leading-relaxed">
            With over 15 years of experience in research, teaching, and
            consultancy, our certified trainers deliver practical, hands-on
            training in:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            {[
              "Research methods",
              "Data analysis using software",
              "Impact evaluation and choice experiment tools",
            ].map((item, index) => (
              <li
                key={index}
                className="animate-[slideInUp_0.6s_ease-out_0.2s]"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Our research methods training covers foundational principles in
            social and agricultural economics, designed for real-world
            application.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Data analysis training is offered at two levels: Basics of
            STATA/SPSS and Advanced STATA/SPSS, using real data for practical
            learning.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our impact evaluation and choice experiment training covers the
            latest tools and methodologies, backed by proven expertise.
          </p>
        </section>
      </div>
    </div>
  );
}
