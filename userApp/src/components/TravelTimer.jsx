import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkScooterAvailability } from "./../modules/socket.js"
import { io } from "socket.io-client";

// Our server
const socket = io("http://localhost:3000");

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 since months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

const TravelTimer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const { startTime, rideId, scooterId, startLocationId } = location.state || {};
  const [elapsedTime, setElapsedTime] = useState(0);
  const [parkChecker, setParkChecker] = useState(false);
 // Uppdatera parkChecker när startLocationId ändras
 useEffect(() => {
    if (startLocationId > 1) {
      setParkChecker(true);
    }
  }, [startLocationId]);
  // Start timer
  useEffect(() => {
    const startTimestamp = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTimestamp) / 1000));
    }, 1000);

    return () => clearInterval(interval); // Rensa intervallet vid avmontering
  }, [startTime]);

  const handleTravelEnd = async () => {
    const apiUrl = `http://localhost:3000/v1/travels`;
    const token = localStorage.getItem("token");
    const now = new Date();
    const endTime = formatDate(now);

    
    // Räkna ut kostnaden baserat på tid
    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = now.getTime();
    const durationInMinutes = Math.ceil((endTimestamp - startTimestamp) / (1000 * 60)); // Antal minuter
    let cost = durationInMinutes * 10; // 10 kronor per minut
    // Kontrollera om scootern är tillgänglig när användaren klickar på knappen för att avsluta
    if (parkChecker) {
        try {
          const response = await checkScooterAvailability(scooterId); // Anropar funktionen från socketService
          if (response.available) {
            cost -= 10; // Rabatt om cykeln är parkerad på rätt plats
          }
        } catch (error) {
          console.error("Fel vid kontroll av cykelns tillgänglighet:", error);
        }
      }
    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              ride_id: rideId,
              scooter_id: scooterId,
              end_location_id: "1", 
              end_time: endTime,
              cost: cost.toString(), 
              api_key: "key123",
            }),
          });
      
          console.log("user_id:", userId,
            "ride_id:", rideId,
            "scooter_id:", scooterId,
            "end_location_id:", "15", 
            "end_time:", endTime,
            "cost:", cost, 
            "api_key: ","key123")
      const result = await response.json();

      if (response.ok) {
        alert("Resa avslutad!");
        navigate("/MapRender"); // Navigera tillbaka till startsidan
      } else {
        alert(`Fel: ${result.error}`);
      }
    } catch (error) {
      console.error("Serverfel vid avslutande av resa:", error);
      alert("Ett serverfel uppstod. Försök igen senare.");
    }
  };

  return (
    <div>
      <h1>Resan pågår</h1>
      <p>Starttid: {startTime}</p>
      <p>Gått tid: {Math.floor(elapsedTime / 60)} minuter {elapsedTime % 60} sekunder</p>
      <button onClick={handleTravelEnd}>Avsluta resa</button>
    </div>
  );
};

export default TravelTimer;
