import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';  // Import Leaflet
import chargingStationIcon from '../icons/station.png';
import parkingZoneIcon from '../icons/parking.png';

export interface Bike {
    id: number;
    latitude: number;
    longitude: number;
    status: string;
    batteryLevel?: number;
    speed?: number;
}

export interface ChargingStation {
    station_id: number;
    latitude: number;
    longitude: number;
    total_ports: number;
    available_ports: number;
}

export interface ParkingZone {
    zone_id: number;
    latitude: number;
    longitude: number;
    max_speed: number;
    capacity: number;
}

interface MapMarkersProps {
    bikes: Bike[];
    chargingStations: ChargingStation[];
    parkingZones: ParkingZone[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ bikes, chargingStations, parkingZones }) => {
    const chargingStationMarkerIcon = new L.Icon({
        iconUrl: chargingStationIcon,
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    });

    const parkingZoneMarkerIcon = new L.Icon({
        iconUrl: parkingZoneIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    return (
        <>
            {bikes.map((bike) => (
                <Marker key={bike.id} position={[bike.latitude, bike.longitude]}>
                    <Popup>
                        Status: {bike.status}<br />
                        Battery Level: {bike.batteryLevel !== undefined ? `${bike.batteryLevel.toFixed(2)}%` : 'N/A'}<br />
                        Speed: {bike.speed !== undefined ? `${bike.speed} km/h` : 'N/A'}
                    </Popup>
                </Marker>
            ))}
            {chargingStations.map(station => (
                <Marker key={station.station_id} position={[station.latitude, station.longitude]} icon={chargingStationMarkerIcon}>
                    <Popup>Station ID: {station.station_id}<br />Available Ports: {station.available_ports}</Popup>
                </Marker>
            ))}
            {parkingZones.map(zone => (
                <Marker key={zone.zone_id} position={[zone.latitude, zone.longitude]} icon={parkingZoneMarkerIcon}>
                    <Popup>
                        Zone ID: {zone.zone_id}<br />
                        Max Speed: {zone.max_speed} km/h<br />
                        Capacity: {zone.capacity}
                    </Popup>
                </Marker>
            ))}
        </>
    );
};