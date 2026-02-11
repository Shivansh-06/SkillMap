import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../api/backend";
import StepProgress from "../components/StepProgress";


export default function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();

  const career = location.state?.career;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);



  // Fetch questions on load
  useEffect(() => {
    if (!career) return;

    fetchQuestions(career)
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [career]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };
  const allAnswered = questions.length === Object.keys(answers).length;


  const handleSubmit = async () => {
  setSubmitting(true);

    const payload = {
      career,
      answers: Object.entries(answers).map(([qid, selected]) => ({
        question_id: Number(qid),
        selected,
      })),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Small delay for smoother UX
      setTimeout(() => {
        navigate("/result", { state: result });
      }, 600);

    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };


 // Guard states
if (!career) return <p>No career selected.</p>;
if (loading) return <p>Loading questions...</p>;
if (error) return <p>Error: {error}</p>;
if (!questions.length) return null;

const currentQuestion = questions[currentIndex];

return (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
    <StepProgress currentStep={2} />

    <h2 className="text-3xl font-bold mb-6">
      {career} Skill Assessment
    </h2>

    {/* Progress Bar */}
    <div className="w-full max-w-2xl mb-8">
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
      <p className="text-sm mt-2 text-gray-400">
        Question {currentIndex + 1} of {questions.length}
      </p>
    </div>

    <div className="w-full max-w-2xl">

      {/* Single Question Card */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300">
        <p className="text-lg font-semibold mb-4">
          {currentQuestion.question}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt) => (
            <label
              key={opt}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                answers[currentQuestion.id] === opt
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={opt}
                checked={answers[currentQuestion.id] === opt}
                onChange={() => handleSelect(currentQuestion.id, opt)}
                className="hidden"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">

        <button
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          disabled={currentIndex === 0}
          className={`px-5 py-2 rounded-lg ${
            currentIndex === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Back
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={!answers[currentQuestion.id]}
            className={`px-5 py-2 rounded-lg ${
              answers[currentQuestion.id]
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id] || submitting}
            className={`px-5 py-2 rounded-lg ${
              answers[currentQuestion.id]
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {submitting ? "Analyzing..." : "Submit"}
          </button>
        )}

      </div>
    </div>

    {/* Loading Overlay */}
    {submitting && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">
            Generating your Skill DNA...
          </p>
        </div>
      </div>
    )}
  </div>
);
}