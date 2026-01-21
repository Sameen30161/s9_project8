import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Temperature = () => {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState("");

  const fetchTemperature = async () => {
    try {
      setError("");
      setTemp(null);

      // City → Lat/Lon
      const geoRes = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
          params: { name: city, count: 1 },
        }
      );

      if (!geoRes.data.results) {
        setError("City not found");
        return;
      }

      const { latitude, longitude } = geoRes.data.results[0];

      // Weather
      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude,
            longitude,
            current_weather: true,
          },
        }
      );

      setTemp(weatherRes.data.current_weather.temperature);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  // Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && city.trim() !== "") {
      fetchTemperature();
    }
  };

  // Reset button
  const handleReset = () => {
    setCity("");
    setTemp(null);
    setError("");
  };

  return (
    <div>
      <div className="head">
        <Link to="/">Main Page</Link>
        <Link to="/temperature">Weather Page</Link>
        <h3>Welcome to API access via Axios</h3>
      </div>

      <br />

      {/* Input Box */}
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <button onClick={fetchTemperature} disabled={!city}>
        Get Temperature
      </button>

      <button onClick={handleReset}>Reset</button>

      <br /><br />

      {/* Output */}
      {temp !== null && <h1>Temperature in {city} is {temp} °C</h1>}
      {error && <h2 style={{ color: "red" }}>{error}</h2>}
    </div>
  );
};

export default Temperature;
