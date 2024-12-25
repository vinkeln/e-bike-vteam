import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Anslut till Socket.IO-servern
const socket = io("http://localhost:3000");

function SocketTest() {
  const [bikeData, setBikeData] = useState({}); // Dict för cykeldata

  useEffect(() => {
    // Lyssna på cykeldatan från servern
    socket.on("bikeNotification", (data) => {
      console.log("Received data:", data);

      // Uppdatera state baserat på bikeSerialNumber
      setBikeData((prev) => ({
        ...prev,
        [data.bikeSerialNumber]: data, // Uppdatera eller lägg till cykeln
      }));
    });

    return () => {
      socket.off("bikeNotification");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Bike Data</h1>

      {/* Visa cykeldata */}
      <h2>Current Bikes:</h2>
      <ul>
        {Object.keys(bikeData).map((bikeSerialNumber) => {
          const bike = bikeData[bikeSerialNumber];
          return (
            <li key={bikeSerialNumber}>
              <strong>Bike {bikeSerialNumber}</strong>:<br />
              Status: {bike.status} <br />
              Battery Level: {bike.batteryLevel.toFixed(2)}% <br />
              Speed: {bike.speed} km/h <br />
              latitude: {bike.latitude}
              <br />
              longitude: {bike.longitude}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SocketTest;
