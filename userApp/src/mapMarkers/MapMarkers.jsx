import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

// Komponenten som renderar markers för cyklar
export const MapMarkers = ({ bikes, chargingStations, parkings_zones }) => {
    return (
        <>
            {bikes.map(bike => (
                <Marker key={bike.scooter_id} position={[bike.current_latitude, bike.current_longitude]}>
                    <Popup>
                        Bike ID: {bike.scooter_id}<br />
                        Status: {bike.status}<br />
                        Battery level: {bike.battery_level ? `${bike.battery_level.toFixed(2)}%` : 'N/A'}<br />
                        Speed: {bike.speed ? `${bike.speed} km/h` : 'N/A'}
                    </Popup>
                </Marker>
            ))}
            {chargingStations?.map(station => (
                <Marker key={station.station_id} position={[station.latitude, station.longitude]}>
                    <Popup>
                        Chargingstation ID: {station.station_id}<br />
                        Total ports: {station.total_ports}<br />
                        Available ports: {station.available_ports}
                    </Popup>
                </Marker>
            ))}
            {parkings_zones?.map(zone => (
                <Marker key={zone.zone_id} position={[zone.latitude, zone.longitude]}>
                    <Popup>
                        Parking Zone ID: {zone.zone_id}<br />
                        Max Speed: {zone.max_speed} km/h<br />
                        Capacity: {zone.capacity}
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

MapMarkers.propTypes = {
    bikes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        batteryLevel: PropTypes.number,
        speed: PropTypes.number
    })).isRequired,

    chargingStations: PropTypes.arrayOf(PropTypes.shape({
        station_id: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        total_ports: PropTypes.number.isRequired,
        available_ports: PropTypes.number.isRequired,
    })).isRequired,

    parkings_zones: PropTypes.arrayOf(PropTypes.shape({
        zone_id: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        max_speed: PropTypes.number.isRequired,
        capacity: PropTypes.number.isRequired,
    })).isRequired,    
};