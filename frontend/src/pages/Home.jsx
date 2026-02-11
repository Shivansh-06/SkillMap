import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const startAssessment = () => {
    navigate("/assessment", {
      state: { career: "Data Analyst" }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 text-center">

      <h1 className="text-5xl font-bold mb-6">
        SkillMap AI
      </h1>

      <p className="text-gray-400 text-lg max-w-xl mb-10">
        Stop chasing trends. Start building what you actually need.
        <br />
        Diagnose your skill gaps before investing time in learning.
      </p>

      <button
        onClick={startAssessment}
        className="bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"

        
      >
        Start Skill Diagnosis
      </button>

      <div className="mt-16 text-gray-500 text-sm">
        <p>✔ Skill DNA Profile</p>
        <p>✔ Career Alignment Score</p>
        <p>✔ Personalized Learning Roadmap</p>
      </div>

    </div>
  );
}
