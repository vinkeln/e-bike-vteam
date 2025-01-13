import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import auth from "../../modules/auths.ts";
import parkings from '../../modules/parkings.ts';
import chargingStations from '../../modules/chargingStations.ts';
import { MapMarkers, Bike, ChargingStation, ParkingZone } from '../components/MapMarkers.tsx';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const cities = {
    Stockholm: { lat: 59.3293, lng: 18.0686 },
    Göteborg: { lat: 57.7089, lng: 11.9746 },
    Malmö: { lat: 55.6050, lng: 13.0038 }
};

const ChargingStationsMap = () => {
    const [currentCity, setCurrentCity] = useState('Stockholm');
    const [stations, setStations] = useState<ChargingStation[]>([
        { station_id: 3, latitude: 59.3273, longitude: 18.0666, total_ports: 10, available_ports: 5 },
        { station_id: 4, latitude: 59.3273, longitude: 59.3073, total_ports: 10, available_ports: 10 } // Hårdkodad station
    ]);

    const [bikes, setBikes] = useState<Bike[]>([
        { id: 1, latitude: 59.3294, longitude: 18.0687, status: 'Ledig' },
        { id: 2, latitude: 59.3396, longitude: 18.0690, status: 'Upptagen' }
    ]);
    const [parkingZones, setParkingZones] = useState<ParkingZone[]>([
        {
            zone_id: 4,
            latitude: 59.3170,
            longitude: 18.0665,
            max_speed: 20,
            capacity: 25
        }
    ]);
    const defaultCenter = [59.3293, 18.0686];

    useEffect(() => {
        fetchStations();
        fetchParkingZones();
        socket.on("bikeNotification", (bike) => {
            console.log("Received bike data:", bike);
            setBikes(prevBikes => {
                const existingBikeIndex = prevBikes.findIndex(b => b.id === bike.id);
                if (existingBikeIndex >= 0) {
                    const newBikes = [...prevBikes];
                    newBikes[existingBikeIndex] = { ...bike, batteryLevel: bike.batteryLevel, speed: bike.speed };
                    return newBikes;
                } else {
                    return [...prevBikes, bike];
                }
            });
        });
        return () => {
            socket.off("bikeNotification");
        };
    }, []);

    const fetchStations = async () => {
        try {
            const response = await chargingStations.fetchStations(); // Use fetchStations from chargingStations module
            console.log("Fetched Stations:", response);
            if (response.chargingStations && response.chargingStations.length > 0) {
                setStations(response.chargingStations); // Update state with stations from API
            } else {
                console.error("No stations found");
            }
        } catch (error) {
            console.error("Failed to fetch stations:", error);
            setStations([]);
        }
    };

    const fetchParkingZones = async () => {
        try {
            const response = await parkings.getparkings(); // Use getparkings from parkings module
            if (response.parkings_zones && response.parkings_zones.length > 0) {
                setParkingZones(response.parkings_zones);
            } else {
                console.error("No parking zones found");
            }
        } catch (error) {
            console.error("Failed to fetch parking zones:", error);
            setParkingZones([]);
        }
    };

    const handleCityChange = (event) => {
        setCurrentCity(event.target.value);
    };

    function SetCenter({ city }) {
        const map = useMap();
        map.setView(cities[city], map.getZoom());
        return null;
    }

    return (
        <>
            <div style={{ padding: '10px' }}>
                <select value={currentCity} onChange={handleCityChange}>
                    <option value="Stockholm">Stockholm</option>
                    <option value="Göteborg">Göteborg</option>
                    <option value="Malmö">Malmö</option>
                </select>
            </div>
            <MapContainer center={cities[currentCity]} zoom={13} style={{ height: '80vh', width: '80%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapMarkers bikes={bikes} chargingStations={stations} parkingZones={parkingZones} />
                <SetCenter city={currentCity} />
            </MapContainer>
        </>
    );
};

export default ChargingStationsMap;
