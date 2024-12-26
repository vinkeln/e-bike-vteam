import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import auth from "../../modules/auths.ts";
import parkings from '../../modules/parkings.ts';
import chargingStations from '../../modules/chargingStations.ts';
import { MapMarkers, Bike, ChargingStation, ParkingZone } from '../components/MapMarkers.tsx';

const ChargingStationsMap = () => {
    const [stations, setStations] = useState<ChargingStation[]>([
        { 
            station_id: 3, 
            latitude: 59.3273, 
            longitude: 18.0666, 
            total_ports: 10, 
            available_ports: 5 
        }
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
    }, []);

    const fetchStations = async () => {
        try {
            const response = await chargingStations.fetchStations(); // Use fetchStations from chargingStations module
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

    return (
        <>
            <MapContainer center={defaultCenter} zoom={13} style={{ height: '80vh', width: '80%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapMarkers bikes={bikes} chargingStations={stations} parkingZones={parkingZones} />
            </MapContainer>
        </>
    );
};

export default ChargingStationsMap;
