export default async function handler(req, res) {
    const { places } = req.body; // Get the array of places from the request body
    const apiKey = process.env.GEOAPIFY_API_KEY; // Store your Geoapify API key in .env
  
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found' });
    }
  
    try {
      const coordinates = await Promise.all(
        places.map(async (place) => {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
              place
            )}&apiKey=${apiKey}`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const { lat, lon } = data.features[0].geometry.coordinates;
            return { place, coordinates: { lat, lon } };
          } else {
            return { place, coordinates: null };
          }
        })
      );
  
      res.status(200).json({ coordinates });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch coordinates' });
    }
  }
  