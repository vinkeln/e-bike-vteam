import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
const TravelButton = ({ userId, scooterId, startLocationId, generateStartTime, cost }) => {
    const navigate = useNavigate();

    const handleTravelStart = async () => {
    const apiUrl = "http://localhost:3000/v1/travels"; 
    const token = localStorage.getItem('token');
    const startTime = generateStartTime();
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          scooter_id: scooterId,
          start_location_id: startLocationId,
          start_time: startTime,
          cost: cost,
          api_key : "key123"
        }),
      });

      const result = await response.json();
      console.log("rideid",result.rideId)
      if (response.ok) {
        alert(`Resa skapad! Res-ID: ${result.rideId}`);
        navigate(`/travel-timer`, { state: { startTime, rideId: result.rideId, scooterId,startLocationId } });
        
      } else {
        alert(`Fel: ${result.error}`);
      }
    } catch (error) {
      console.error("Serverfel vid skapande av resa:", error);
      alert("Ett serverfel uppstod. Försök igen senare.");
    }
  };

  return <button onClick={handleTravelStart}>Start travel</button>;
};

TravelButton.propTypes = {
    userId: PropTypes.string.isRequired,
    scooterId: PropTypes.string.isRequired,
    startLocationId: PropTypes.string.isRequired,
    generateStartTime: PropTypes.func.isRequired,
    cost: PropTypes.string.isRequired,
};

export default TravelButton;
