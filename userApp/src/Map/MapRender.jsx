import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarkers } from '../mapMarkers/MapMarkers';
import chargingStationModule from '../modules/chargingStations';
import parkingModule from '../modules/parkings';
import { fetchBikes } from '../modules/bikes';
import { io } from "socket.io-client";

// Our server
const socket = io("http://localhost:3000");

const MapRender = () => {
    const [position, setPosition] = useState([59.3293, 18.0686]); // Default to Stockholm coordinates
    const [bikes, setBikes] = useState({
        1: { id: 1, latitude: 59.3293, longitude: 18.0686, status: 'ledig', batteryLevel: 85, speed: 12.5 },
        2: { id: 2, latitude: 57.7089, longitude: 11.9746, status: 'upptagen', batteryLevel: 65, speed: 10.0 }
    });
    const [chargingStations, setChargingStations] = useState([]);
    const [parkings_zones, setParkingZones] = useState([]);

    useEffect(() => {
        // Fetch bikes
        fetchBikes('key123').then(data => {
            if (data.Message === 'Success' && data.bikes) {
                const newBikes = {};
                data.bikes.forEach(bike => {
                    newBikes[bike.bike.id] = bike;
                });
                setBikes(newBikes);
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
        socket.on("updateBikes", (bike) => {
            setBikes(prevBikes => {
                const updatedBikes = {...prevBikes};
                updatedBikes[bike.id] = bike;
                return updatedBikes;
            });
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

    const cities = {
        Stockholm: [59.3293, 18.0686],
        Göteborg: [57.7089, 11.9746],
        Malmö: [55.6050, 13.0038]
    };

    const handleCityChange = (event) => {
        const city = event.target.value;
        setPosition(cities[city]);
    };

    console.log("Charging Stations:", chargingStations);
    console.log("Parkings:", parkings_zones );

    return (
        <>
            <div style={{ padding: '10px' }}>
                <select onChange={handleCityChange} defaultValue="Stockholm">
                    {Object.keys(cities).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
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
                <ChangeMapView center={position} />
            </MapContainer>
        </>
    );
}

const ChangeMapView = ({ center }) => {
    const map = useMap(); // Hook to access the map instance
    map.setView(center, map.getZoom());

    return null; // Component does not render anything
};

export default MapRender;