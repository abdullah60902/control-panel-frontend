import { useEffect, useRef } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController, // 🔹 Required for doughnut chart
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function OccupancyChart({ occupancyPercentage }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy old chart instance if exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Occupied", "Available"],
        datasets: [
          {
            data: [occupancyPercentage, 100 - occupancyPercentage],
            backgroundColor: ["#3B82F6", "#EEEEFF"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "75%",
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          tooltip: {
            enabled: false, // Hide tooltip
          },
        },
      },
      plugins: [
        {
          id: "centerText",
          beforeDraw: (chart) => {
            const { width } = chart;
            const { height } = chart;
            const ctx = chart.ctx;
            ctx.restore();
            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#fff";
            ctx.textBaseline = "middle";
            const text = `${occupancyPercentage}%`;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
          },
        },
      ],
    });
  }, [occupancyPercentage]);

  return <canvas ref={chartRef} />;
}
