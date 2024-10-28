import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received data:", data); // Log the received data
    const locations = data.locations; // Array of location names
    if (!locations || locations.length < 2) {
      return NextResponse.json({ error: "Please provide at least two locations." }, { status: 400 });
    }

    // Construct query strings for a complete graph
    const locationsStr = locations.map(location => encodeURIComponent(location)).join('|');
    const apiKey = process.env.API_KEY; // Replace with your actual API key
    const apiUrl = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${locationsStr}&destinations=${locationsStr}&key=5E0NxVZQge2ywMIUlQ2tLimpvyRZ0IS5cydpTbAO6ebhVgQgSuDeINDu4GsVBmw1`;

    // Fetch distance data
    const response = await fetch(apiUrl);
    const apiData = await response.json();
    console.log("API data received:", apiData);
  

    // Validate API response
    if (apiData.status !== "OK" || !apiData.rows || apiData.rows.length === 0) {
      console.error("Distance Matrix API error:", apiData.error_message || "Invalid response format.");
      throw new Error(`Distance Matrix API error: ${apiData.error_message}`);
    }

    // Construct the distance matrix (2D array) based on distance data
    const dist = apiData.rows.map(row => {
      return row.elements.map(element => {
        return element.status === "OK" ? element.distance.value : Infinity;
      });
    });

    // Prepare data for TSP algorithm API
    const requestBody = {
      graph: dist,  // Ensure you're sending the graph
    };
    
    // Call TSP algorithm server
    const tspResponse = await fetch('https://dsa-server-rmnd.onrender.com/api/tsp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    if (!tspResponse.ok) {
      const errorBody = await tspResponse.text();
      console.error("TSP server error:", tspResponse.statusText, errorBody);
      throw new Error("Failed to get shortest paths from TSP server.");
    }

    const tspData = await tspResponse.json();
    return NextResponse.json({tspData,dist,apiData});
  } catch (error) {
    console.error("Error in /api/distance:", error); // Log any errors encountered
    return NextResponse.json({ error: error.message || "Error fetching distance data" }, { status: 500 });
  }
}
