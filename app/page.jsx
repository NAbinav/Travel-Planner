"use client"; // Indicates this is a client-side component
import React, { useState } from "react";
import Card from "@/components/Card"; // Importing a custom Card component
import { motion } from "framer-motion";

const Page = () => {
  const [places, setPlaces] = useState(["Source", "Destination"]); // Initial places
  const [inputs, setInputs] = useState({}); // To store user inputs
  const [result, setResult] = useState(null); // To store results
  const [edge, setEdge] = useState(null); // To store edges

  const handleInputChange = (index, value) => {
    // Update inputs based on the index of the place
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value,
    }));
  };

  const handleSubmit = async () => {
    const locations = Object.values(inputs); // Convert inputs to an array
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locations }), // Pass locations in the request body
      });
      const data = await res.json(); // Parse the response

      if (res.ok) {
        setResult(data); // Set the result state
        console.log("Distance and shortest path data:", data.tspData);
        setEdge(data.tspData.edges); // Assuming edges is returned in tspData
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  // Create a separate variable to map the edges and display the paths
  const pathsList =
    edge &&
    edge.map((e, index) => (
      <li key={index}>
        {`${inputs[e[0]]} - ${inputs[e[1]]} - ${
          result.dist[e[0]][e[1]] / 1000
        } km`}{" "}
        {/* Format: from_name - to_name - distance in km */}
      </li>
    ));

  return (
    <div className="my-16">
      <div className="flex-col gap-12 text-center">
        <div className="text-center justify-center">
          {places.map((place, index) => (
            <motion.div
              animate={{
                x: 0,
                opacity: 1,
                onBlur: 0,
              }}
              initial={{ x: -400, opacity: 0.2, onBlur: 100 }}
              key={index}
              className="flex justify-center"
            >
              <Card
                input={place}
                text={index !== 0 ? `Destination ${index}: ` : "Source"}
                onInputChange={(value) => handleInputChange(index, value)}
                value={inputs[index] || ""} // Ensure value is reflected
              />
            </motion.div>
          ))}
        </div>
        <div className="justify-center align-bottom top-3/4">
          <button
            onClick={() => {
              setPlaces((prevPlaces) => [...prevPlaces, ""]); // Add a new empty input
            }}
            className="w-8 h-8 text-center justify-center rounded-full border-[1px] hover:bg-white hover:text-black transition-all duration-300 border-white"
          >
            +
          </button>
          <div>
            <button
              onClick={handleSubmit}
              className="m-5 w-max p-3 h-max border-[1px] border-white rounded-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              Calculate
            </button>{" "}
            {/* Trigger handleSubmit */}
          </div>
        </div>
        {pathsList && (
          <div>
            <h3>Paths:</h3>
            <ul>{pathsList}</ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
