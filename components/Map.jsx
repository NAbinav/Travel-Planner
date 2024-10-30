import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const Map = ({ points, edges = [] }) => {
  // Provide a default empty array for edges
  // Extract points for the Scatter plot with names as tooltips
  const scatterData = points.map((point) => ({
    x: point.lon,
    y: point.lat,
    label: point.name,
  }));

  // Check if edges are defined before proceeding
  const lineData = edges.map(([fromIndex, toIndex]) => ({
    x: [points[fromIndex].lon, points[toIndex].lon],
    y: [points[fromIndex].lat, points[toIndex].lat],
  }));

  const data = {
    datasets: [
      {
        label: "Locations",
        data: scatterData,
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        borderColor: "blue",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      // Add a separate dataset for each line between points
      ...lineData.map((line, idx) => ({
        label: `Path ${idx + 1}`,
        data: [
          { x: line.x[0], y: line.y[0] },
          { x: line.x[1], y: line.y[1] },
        ],
        borderColor: "rgba(255, 0, 0, 0.7)",
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        showLine: true,
        fill: false,
      })),
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: { display: true, text: "Longitude" },
      },
      y: {
        type: "linear",
        title: { display: true, text: "Latitude" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw.label}`;
          },
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default Map;
