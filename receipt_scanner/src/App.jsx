// Language: JavaScript + JSX (React)
import { useState } from 'react';

function App() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [stores, setStores] = useState([]); // to store nearby places
  const [error, setError] = useState(null); // To store errors 

  const GOOGLE_API_KEY = 'xxxxxxxxxxxxxxxxxxxx'; 

  // Function to get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        // After getting location, fetch nearby stores
        fetchNearbyStores(lat, lon);
      }, (err) => {
        console.error("Error getting location:", err);
        setError("Failed to get your location");
      });
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  // Function to fetch nearby stores using Google Places API
  const fetchNearbyStores = async (lat, lon) => {
    try {
      const radius = 5000; // 5km
      const type = "supermarket"; 

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;

      const proxyUrl = 'https://corsproxy.io/?'; // to avoid CORS issues during development

      const response = await fetch(proxyUrl + encodeURIComponent(url));
      const data = await response.json();
      console.log("API Response:", data);

      if (data.results) {
        setStores(data.results);
      } else {
        setError("No stores found");
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to fetch stores");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Store Price App</h1>

      <button onClick={getLocation}>Get My Location and Find Stores</button>

      {location.lat && location.lon && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lon}</p>
        </div>
      )}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {stores.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Nearby Stores:</h2>
          <ul>
            {stores.map((store) => (
              <li key={store.place_id}>{store.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
