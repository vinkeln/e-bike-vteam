import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarkers } from '../mapMarkers/MapMarkers';
import chargingStationModule from '../modules/chargingStations';
import parkingModule from '../modules/parkings';
import { fetchBikes } from '../modules/bikes';
import { io } from "socket.io-client";

// Our server
const socket = io("http://localhost:3000");

const MapRender = () => {
    const [bikes, setBikes] = useState([]);
    const [chargingStations, setChargingStations] = useState([]);
    const [parkings_zones, setParkingZones] = useState([]);

    useEffect(() => {
        // Fetch bikes
        fetchBikes('key123').then(data => {
            if (data.Message === 'Success' && data.bikes) {
                setBikes(data.bikes);
            }
        }).catch(error => {
            console.error('Error fetching bikes:', error);
        });

        // Fetch charging stations
        chargingStationModule.fetchStations().then(response => {
            if (response.status === 'success' && Array.isArray(response.chargingStations)) {
                setChargingStations(response.chargingStations);
            } else {
                console.error('Failed to load charging stations:', response.message);
                setChargingStations([]); // Ensure it's always an array
            }
        }).catch(error => {
            console.error('Error fetching charging stations:', error);
            setChargingStations([]); // Ensure it's always an array
        });

        // Fetch parking zones
        parkingModule.getparkings().then(response => {
            console.log("Fetched Parking Zones:", response.parkings_zones);
            const parkingsZones = response?.parkings_zones; // Använd optional chaining här
            if (response.parkings_zones && response.parkings_zones.length > 0) {
                setParkingZones(response.parkings_zones);
            } else {
                console.error('Failed to load parking zones:', response.message);
                setParkingZones([]);
            }
        }).catch(error => {
            console.error('Error fetching parking zones:', error);
            setParkingZones([]);
        });

        // Setup socket listeners
        socket.on("updateBikes", (newBikes) => {
            setBikes(newBikes);
        });
        socket.on("updateParkingZones", (newZones) => {
            setParkingZones(newZones);
        });

        // Cleanup function
        return () => {
            socket.off("updateBikes");
            socket.off("updateParkingZones");
            socket.close();
        };
    }, []); // Ensure this runs only once

    const position = [59.3293, 18.0686]; // Stockholm coordinates
    console.log("Charging Stations:", chargingStations);
    console.log("Parkings:", parkings_zones );

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
                <MapMarkers bikes={bikes} chargingStations={chargingStations} parkings_zones={parkings_zones} />
            </MapContainer>
        </>
    );
}

export default MapRender;