import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Radar } from "react-chartjs-2";
import StepProgress from "../components/StepProgress";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";




ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


export default function Result() {
    const { state } = useLocation();
    const [displayScore, setDisplayScore] = useState(0);
    const insights = state.insights;


    useEffect(() => {
      if (!state) return;

      let start = 0;
      const end = state.career_alignment;
      const duration = 800; // milliseconds
      const increment = end / (duration / 16);

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayScore(end);
          clearInterval(counter);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, [state]);


  

    if (!state) return <p>No results found.</p>;
    const levelToScore = {
    Strong: 80,
    Weak: 50,
    Missing: 20,
    };
    const labels = Object.keys(state.skill_dna);
    const dataValues = labels.map(
        (skill) => levelToScore[state.skill_dna[skill]]
        );
    const radarData = {
        labels,
        datasets: [
            {
            label: "Skill DNA",
            data: dataValues,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            },
        ],
        };
    const radarOptions = {
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                stepSize: 20,
                },
            },
        },
    };


return (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
    <StepProgress currentStep={3} />
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-semibold mb-3">Diagnostic Summary</h3>

      {insights.primary_gap ? (
        <p className="mb-2">
          🔎 Your biggest bottleneck is <strong>{insights.primary_gap}</strong>.
        </p>
      ) : (
        <p className="mb-2">
          🎯 You are strongly aligned with this career path.
        </p>
      )}

      {insights.high_impact_gap && (
        <p className="text-red-500 mb-2">
          ⚠ Fixing {insights.high_impact_gap} unlocks multiple downstream skills.
        </p>
      )}

      <div className="flex gap-4 mt-3 text-sm">
        <span>Missing: {insights.missing_count}</span>
        <span>Weak: {insights.weak_count}</span>
        <span>Strong: {insights.strong_count}</span>
      </div>
    </div>




    <h2 className="text-4xl font-bold mb-8">Skill DNA</h2>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <Radar data={radarData} options={radarOptions} />
    </motion.div>


    <div className="mt-8 w-full max-w-md space-y-6">

      <div>
        <h3 className="text-xl font-semibold mb-2">Career Alignment Score</h3>
        <p className="text-3xl font-bold text-blue-400">
          {displayScore}%
        </p>

      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">
          Recommended Learning Order
        </h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {state.roadmap.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 text-red-400">
          What NOT to Learn Right Now
        </h3>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
          {state.avoid_for_now.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

    </div>
  </div>
);
}
