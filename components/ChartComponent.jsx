"use client";
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

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const ChartComponent = ({ points }) => {
  const data = {
    datasets: [
      {
        label: "Path",
        data: points.map((point) => ({
          x: point.lon,
          y: point.lat,
          label: point.name, // Include label for tooltips
        })),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        showLine: false,
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: { display: true, text: "Longitude" },
      },
      y: { type: "linear", title: { display: true, text: "Latitude" } },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.raw.label} (${context.raw.x}, ${context.raw.y})`, // Display name and coordinates
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default ChartComponent;
