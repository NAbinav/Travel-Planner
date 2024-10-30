"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import Map from "@/components/Map";

const Page = () => {
  const [places, setPlaces] = useState(["Source", "Destination"]);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [edge, setEdge] = useState(null);
  const [stdLoc, setStdLoc] = useState(null);
  const [stdOrd, setStdOrd] = useState(null);
  const [time, setTime] = useState(null);

  const handleInputChange = (index, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value,
    }));
  };

  const handleSubmit = async () => {
    const locations = Object.values(inputs);
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locations }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setEdge(data.tspData.edges); // Set edges correctly
        setTime(data.tspData.times); // Store travel times
        setStdLoc(data.apiData.destination_addresses);

        // Combine coordinates with names for each point
        const namedCoordinates = data.co_ordinate_list.map((coord, index) => ({
          lat: coord.lat,
          lon: coord.lon,
          name: data.apiData.destination_addresses[index],
        }));
        setStdOrd(namedCoordinates); // Set named coordinates
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  const pathsList =
    edge &&
    edge.map((e, index) => {
      // Ensure that time and distance are defined before accessing
      const distance = result?.dist[e[0]][e[1]];
      const travelTime = result.time?.[e[0]]?.[e[1]]; // Use optional chaining to avoid undefined access

      return (
        <li key={index}>
          {`${stdLoc[e[0]]} - ${stdLoc[e[1]]} - ${
            distance ? (distance / 1000).toFixed(2) : "N/A"
          } km ( ${travelTime ? Math.floor(travelTime / 3600) : "N/A"} hrs ${
            travelTime ? Math.floor((travelTime % 3600) / 60) : "N/A"
          } min)`}
        </li>
      );
    });

  return (
    <div className="my-16">
      <div className="flex-col gap-12 text-center">
        <div className="text-center justify-center">
          {places.map((place, index) => (
            <motion.div
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: -400, opacity: 0.2 }}
              key={index}
              className="flex justify-center"
            >
              <Card
                input={place}
                text={index !== 0 ? `Destination ${index}: ` : "Source"}
                onInputChange={(value) => handleInputChange(index, value)}
                value={inputs[index] || ""}
              />
            </motion.div>
          ))}
        </div>
        <div className="justify-center align-bottom top-3/4">
          <button
            onClick={() => {
              setPlaces((prevPlaces) => [...prevPlaces, ""]);
            }}
            className="w-8 h-8 text-center justify-center rounded-full border-[1px] hover:bg-white hover:text-black transition-all duration-300 border-white"
          >
            +
          </button>
          <button
            onClick={handleSubmit}
            className="m-5 w-max p-3 h-max border-[1px] border-white rounded-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Calculate
          </button>
        </div>
        {pathsList && (
          <div>
            <h3>Paths:</h3>
            <ul>{pathsList}</ul>
          </div>
        )}
      </div>
      {stdOrd && <Map points={stdOrd} edges={edge} />}
    </div>
  );
};

export default Page;
