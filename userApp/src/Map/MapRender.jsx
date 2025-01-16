import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarkers } from '../mapMarkers/MapMarkers';
import { io } from "socket.io-client";

// Our server
const socket = io("http://localhost:3000");

const MapRender = () => {
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        socket.on("updateBikes", (newBikes) => {
            setBikes(newBikes);
        });

        return () => socket.off("updateBikes");
    }, []);

    const position = [59.3293, 18.0686]; // Stockholm coordinates

    return (
        <>
            <div style={{ padding: '10px' }}>
                {/* Placeholder for any additional UI controls like a city selector */}
            </div>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '500px', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
             <MapMarkers bikes={bikes} />
             </MapContainer>
        </>
    );
}

export default MapRender;