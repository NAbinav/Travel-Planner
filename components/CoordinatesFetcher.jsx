// components/CoordinatesFetcher.js
"use client";
import React, { useState } from "react";

const CoordinatesFetcher = () => {
  const [places, setPlaces] = useState([
    "38 Upper Montagu Street, Westminster W1H 1LJ, United Kingdom",
    // Add more addresses here
  ]);
  const [coordinates, setCoordinates] = useState(null);

  const fetchCoordinates = async () => {
    try {
      const response = await fetch("/api/coordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ places }), // Send places as request body
      });

      const data = await response.json();
      setCoordinates(data.coordinates);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchCoordinates}>Fetch Coordinates</button>
      {coordinates && (
        <ul>
          {coordinates.map((item, index) => (
            <li key={index}>
              {item.place}:{" "}
              {item.coordinates
                ? `Lat: ${item.coordinates.lat}, Lon: ${item.coordinates.lon}`
                : "Not found"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoordinatesFetcher;
