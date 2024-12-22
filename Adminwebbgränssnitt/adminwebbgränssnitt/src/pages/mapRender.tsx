import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import auth from "../../modules/auths.ts";
import { MapMarkers, Bike, ChargingStation, ParkingZone } from '../components/MapMarkers.tsx'; // Säkerställ att sökvägarna är korrekta

const ChargingStationsMap = () => {
    const [stations, setStations] = useState<ChargingStation[]>([
        { 
            station_id: 3, 
            latitude: 59.3273, 
            longitude: 18.0666, 
            total_ports: 10, 
            available_ports: 5 
        } // Coded chargingStation object on to the map.
    ]);
    const [bikes, setBikes] = useState<Bike[]>([
        { id: 1, latitude: 59.3294, longitude: 18.0687, status: 'Ledig' },
        { id: 2, latitude: 59.3396, longitude: 18.0690, status: 'Upptagen' }
    ]); // Coded bike object on to the map.
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

    const fetchStations = () => {
        fetch('http://localhost:3000/v1/chargingstations', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.chargingStations && data.chargingStations.length > 0) {
                setStations(data.chargingStations); // Data from the API
            } else {
                console.error("Inga stationer hittades");
            }
        })
        .catch(err => {
            console.error("Misslyckades med att hämta laddningsstationer:", err);
            setStations([]);
        });
    };
    const fetchParkingZones = () => {
        fetch('http://localhost:3000/v1/parkingzones', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.parkingZones && data.parkingZones.length > 0) {
                setParkingZones(data.parkingZones);
            } else {
                console.error("Inga parkeringszoner hittades");
            }
        })
        .catch(err => {
            console.error("Misslyckades med att hämta parkeringszoner:", err);
            setParkingZones([]);
        });
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
