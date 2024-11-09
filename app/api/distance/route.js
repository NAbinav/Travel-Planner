import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received data:", data);
    const locations = data.locations;

    if (!locations || locations.length < 2) {
      return NextResponse.json({ error: "Please provide at least two locations." }, { status: 400 });
    }

    const locationsStr = locations.map(location => encodeURIComponent(location)).join('|');

    const apiUrl = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${locationsStr}&destinations=${locationsStr}&key=tFO49e3wDTc6Bb9Ujyorj7j0kR4xL6rcFvAcXhGeN25NOlPcyMURZUjjrD2RCiCS`;

    // Fetch distance data
    const response = await fetch(apiUrl);
    const apiData = await response.json();
    console.log("API data received:", apiData);

    // Validate API response
    if (apiData.status !== "OK" || !apiData.rows || apiData.rows.length === 0) {
      console.error("Distance Matrix API error:", apiData.error_message || "Invalid response format.");
      throw new Error(`Distance Matrix API error: ${apiData.error_message}`);
    }

    // Construct the distance matrix (2D array)
    const dist = apiData.rows.map(row => {
      return row.elements.map(element => {
        return element.status === "OK" ? element.distance.value : Infinity;
      });
    });
    const time = apiData.rows.map(row => {
      return row.elements.map(element => {
        return element.status === "OK" ? element.duration.value : Infinity;
      });
    });

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

    // Fetch coordinates
    const co_ordinate_list = [];
    for (let i = 0; i < locations.length; i++) {
      const co_ord_api = `https://api.opencagedata.com/geocode/v1/json?q=${apiData.destination_addresses[i]}&key=a2ad2f19711443fda963c386ccf6d2ff`;
      const co_ord = await fetch(co_ord_api);
      const co_ord_data = await co_ord.json();
      co_ordinate_list.push({ "lat": co_ord_data.results[0].geometry.lat, "lon": co_ord_data.results[0].geometry.lng });
    }

    return NextResponse.json({ tspData, dist, apiData, co_ordinate_list,time });
  } catch (error) {
    console.error("Error in /api/distance:", error); // Log any errors encountered
    return NextResponse.json({ error: error.message || "Error fetching distance data" }, { status: 500 });
  }
}
