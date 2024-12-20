import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const ParkedBikesMap = () => {
  // Positionen för kartans initiala vy över Stockholm
  const initialPosition = [59.3293, 18.0686];
  const [bikes, setBikes] = useState([]);

  // Ansluta till WebSocket-servern och lyssna på cykeluppdateringar
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("bikeStatusUpdated", (updatedBike) => {
      // Uppdatera cyklarnas lista med den nya positionen eller statusen
      setBikes(prevBikes => {
        const existingIndex = prevBikes.findIndex(b => b.id === updatedBike.bikeSerialNumber);
        if (existingIndex > -1) {
          // Uppdatera befintlig cykel
          const newBikes = [...prevBikes];
          newBikes[existingIndex] = {...prevBikes[existingIndex], ...updatedBike};
          return newBikes;
        } else {
          // Lägg till ny cykel om den inte finns i listan
          return [...prevBikes, updatedBike];
        }
      });
    });

    // Städa upp WebSocket-anslutningen när komponenten avmonteras
    return () => {
      socket.disconnect();
    };
  }, []);
};

export default ParkedBikesMap;
