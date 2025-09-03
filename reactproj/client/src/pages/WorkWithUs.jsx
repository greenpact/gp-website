// src/pages/WorkWithUs.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function WorkWithUs() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      setError(null);
      try {
        // This endpoint should now be returning data with title, description, location, type, closingDate, requirements, numberOfEmployees
        const res = await api.get("/vacancies");
        setVacancies(res.data);
      } catch (err) {
        console.error("Error fetching vacancies:", err);
        setError(err.response?.data?.message || "Failed to load vacancies.");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center">
        Loading vacancies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 pt-28 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 pt-28">
      <h1 className="text-4xl font-bold text-greenpact-green-dark mb-8 text-center">
        Work With Us
      </h1>
      <p className="text-lg text-greenpact-text mb-12 text-center max-w-3xl mx-auto">
        Join our team and contribute to a greener future! Explore our current
        job openings below.
      </p>

      {vacancies.length === 0 ? (
        <p className="text-gray-600 text-center">
          No job openings available at the moment. Please check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <h2 className="text-2xl font-semibold text-greenpact-green-dark mb-2">
                  {vacancy.title}
                </h2>
                <p className="text-gray-700 mb-4">{vacancy.description}</p>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Location:</span>{" "}
                  {vacancy.location}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Type:</span> {vacancy.type}
                </p>
                {/* Display Number of Employees */}
                {vacancy.numberOfEmployees && (
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Employees Needed:</span>{" "}
                    {vacancy.numberOfEmployees}
                  </p>
                )}
                {/* Display Requirements */}
                {vacancy.requirements && vacancy.requirements.length > 0 && (
                  <div className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Requirements:</span>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {vacancy.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Display Closing Date */}
                {vacancy.closingDate && (
                  <p className="text-gray-600 text-sm mt-4 mb-4">
                    <span className="font-medium">Closing Date:</span>{" "}
                    {new Date(vacancy.closingDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
              <Link
                to={`/apply/${vacancy._id}`} // Pass vacancy._id in the URL
                className="mt-4 bg-greenpact-orange text-white px-6 py-2 rounded-full hover:bg-greenpact-orange-dark transition-colors self-start text-center"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
