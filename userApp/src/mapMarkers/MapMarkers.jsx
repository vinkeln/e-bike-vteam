import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

// Komponenten som renderar markers för cyklar
export const MapMarkers = ({ bikes }) => {
    return (
        <>
            {bikes.map(bike => (
                <Marker key={bike.id} position={[bike.latitude, bike.longitude]}>
                    <Popup>
                        Cykel ID: {bike.id}<br />
                        Status: {bike.status}<br />
                        Batterinivå: {bike.batteryLevel ? `${bike.batteryLevel.toFixed(2)}%` : 'N/A'}<br />
                        Hastighet: {bike.speed ? `${bike.speed} km/h` : 'N/A'}
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
    })).isRequired
};