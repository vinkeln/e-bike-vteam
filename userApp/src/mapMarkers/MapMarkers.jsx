import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import parkingIconUrl from '../icons/parking.png';
import stationIconUrl from '../icons/station.png';
import availableBike from '../icons/availablebike.png';
import L from 'leaflet';
import QRScannerButton from '../components/QRScannerButton';


const availableBikeIcon = new L.icon({
    iconUrl: availableBike,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
})

const parkingIcon = new L.Icon({
    iconUrl: parkingIconUrl,
    iconSize: [30, 30], // Size of icon
    iconAnchor: [15, 30] // Icon centered correct by its position
  });
  
  const stationIcon = new L.Icon({
    iconUrl: stationIconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

// Component to render bikes
export const MapMarkers = ({ bikes, chargingStations, parkings_zones }) => {
    const userId = localStorage.getItem('user_id');

    return (
        <>
            {Object.values(bikes).map(bike => (
                <Marker key={bike.scooter_id} position={[bike.current_latitude, bike.current_longitude]} icon={availableBikeIcon}>
                    <Popup>
                        Bike ID: {bike.scooter_id}<br />
                        Status: {bike.status}<br />
                        Battery level: {bike.batteryLevel ? `${bike.batteryLevel.toFixed(2)}%` : 'N/A'}<br />
                        Speed: {bike.speed ? `${bike.speed} km/h` : 'N/A'}<br />
                        <QRScannerButton
                            userId={userId}
                            scooterId={bike.bike_serial_number}
                            startLocationId={bike.current_location_id}
                            cost={"15"} />
                    </Popup>
                </Marker>
            ))}
            {chargingStations?.map(station => (
                <Marker key={station.station_id} position={[station.latitude, station.longitude]} icon={stationIcon}>
                    <Popup>
                        Chargingstation ID: {station.station_id}<br />
                        Total ports: {station.total_ports}<br />
                        Available ports: {station.available_ports}
                    </Popup>
                </Marker>
            ))}
            {parkings_zones?.map(zone => (
                <Marker key={zone.zone_id} position={[zone.latitude, zone.longitude]} icon={parkingIcon}>
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
    bikes: PropTypes.objectOf(PropTypes.shape({
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