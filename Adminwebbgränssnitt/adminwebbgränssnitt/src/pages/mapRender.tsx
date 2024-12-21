import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import auth from "../../modules/auths.ts";

const ChargingStationsMap = () => {
    const [stations, setStations] = useState([]); // Säkerställ att stations är en tom lista initialt
    const [formData, setFormData] = useState({ latitude: '', longitude: '', city_id: '', total_ports: '', api_key: 'key123' });
    const defaultCenter = [59.3293, 18.0686];

    useEffect(() => {
        setFormData(prev => ({ ...prev, city_id: '1' }));
        fetchStations();
    }, []);

    const fetchStations = () => {
        fetch('http://localhost:3000/v1/chargingstations', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`  // Använder token från auth-modulen
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.chargingStations) {
                setStations(data.chargingStations);
            } else {
                console.error("No stations data found");
            }
        })
        .catch(err => {
            console.error("Failed to fetch charging stations:", err);
            setStations([]);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/v1/chargingstations/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`  // Inkludera tokenen här
            },
            body: JSON.stringify(formData) // inkludera api key i body
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server responded with an error!');
            }
        })
        .then(data => {
            console.log(data);
            fetchStations();  // Uppdatera laddningsstationerna på kartan
        })
        .catch(error => {
            console.error('Error adding charging station:', error);
            setStations([]);
        });
    };

    return (
        <>
            <MapContainer center={defaultCenter} zoom={13} style={{ height: '80vh', width: '80%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {stations.map(station => (
                    <Marker key={station.station_id} position={[station.latitude, station.longitude]}>
                        <Popup>
                            Station ID: {station.station_id}<br />
                            Total Ports: {station.total_ports}<br />
                            Available Ports: {station.available_ports}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <form onSubmit={handleSubmit}>
                <input type="text" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} placeholder="Latitude" />
                <input type="text" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} placeholder="Longitude" />
                <input type="text" value={formData.city_id} onChange={(e) => setFormData({...formData, city_id: e.target.value})} placeholder="City ID" />
                <input type="number" value={formData.total_ports} onChange={(e) => setFormData({...formData, total_ports: e.target.value})} placeholder="Total Ports" />
                <button type="submit">Add Charging Station</button>
            </form>
        </>
    );
};

export default ChargingStationsMap;