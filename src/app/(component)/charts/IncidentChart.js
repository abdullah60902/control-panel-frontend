"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const IncidentChart = ({ open, underInvestigation, resolved }) => {
  const total = open + underInvestigation + resolved;
  const resolvedPercentage = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

  const data = {
    datasets: [
      {
        data: [resolved, underInvestigation, open],
        backgroundColor: ["#22c55e", "#facc15", "#4a48d4"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    plugins: { tooltip: { enabled: true } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="relative w-full h-full">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-semibold text-white">{resolvedPercentage}%</p>
        <p className="text-xs text-gray-400">Resolved</p>
      </div>
    </div>
  );
};

export default IncidentChart;
