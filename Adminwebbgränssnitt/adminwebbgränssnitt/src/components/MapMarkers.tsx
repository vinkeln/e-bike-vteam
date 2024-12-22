import React from 'react';
import { Marker, Popup } from 'react-leaflet';

export interface Bike {
    id: number;
    latitude: number;
    longitude: number;
    status: string;
}

export interface ChargingStation {
    station_id: number;
    latitude: number;
    longitude: number;
    total_ports: number
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
    return (
        <>
            {bikes.map(bike => (
                <Marker key={bike.id} position={[bike.latitude, bike.longitude]}>
                    <Popup>Bike ID: {bike.id}<br />Status: {bike.status}</Popup>
                </Marker>
            ))}
           {chargingStations.map(station => (
                <Marker key={station.station_id} position={[station.latitude, station.longitude]}>
                    <Popup>Station ID: {station.station_id}<br />Available Ports: {station.available_ports}</Popup>
                </Marker>
            ))}
            {parkingZones.map(zone => (
                <Marker key={zone.zone_id} position={[zone.latitude, zone.longitude]}>
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