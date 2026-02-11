import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState(null);

  const careers = [
    {
      name: "Data Analyst",
      description: "Focus on SQL, Excel, and Data Visualization."
    },
    {
      name: "Data Scientist",
      description: "Statistics, Machine Learning, and modeling expertise."
    },
    {
      name: "ML Engineer",
      description: "Production ML systems and deployment."
    }
  ];

  const handleStart = () => {
    if (!selectedCareer) return;
    navigate("/assessment", { state: { career: selectedCareer } });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold mb-6">SkillMap AI</h1>
      <p className="text-gray-400 mb-12 text-center max-w-xl">
        Stop chasing trends. Start building what you actually need.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10 w-full max-w-5xl">
        {careers.map((career) => (
          <div
            key={career.name}
            onClick={() => setSelectedCareer(career.name)}
            className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
              selectedCareer === career.name
                ? "border-blue-500 bg-blue-900/40"
                : "border-gray-700 bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">
              {career.name}
            </h2>
            <p className="text-gray-400 text-sm">
              {career.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!selectedCareer}
        className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${
          selectedCareer
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        Start Assessment
      </button>
    </div>
  );
}
