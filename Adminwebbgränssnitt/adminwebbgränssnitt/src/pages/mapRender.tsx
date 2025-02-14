import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import auth from "../../modules/auths.ts";
import parkings from "../../modules/parkings.ts";
import chargingStations from "../../modules/chargingStations.ts";
import AddButtons from "../components/AddButtons.tsx";
import { useNavigate } from "react-router-dom";

import {
  MapMarkers,
  ChargingStation,
  ParkingZone,
} from "../components/MapMarkers.tsx";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const cities = {
  Stockholm: { lat: 59.3293, lng: 18.0686 },
  Göteborg: { lat: 57.7089, lng: 11.9746 },
  Malmö: { lat: 55.605, lng: 13.0038 },
};

const ChargingStationsMap = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
    }
  }, []);

  const [currentCity, setCurrentCity] = useState("Stockholm");
  const [stations, setStations] = useState<ChargingStation[]>([]);

  const [bikeData, setBikeData] = useState({}); // Dict för cykeldata

  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([
    {
      zone_id: 4,
      latitude: 59.317,
      longitude: 18.0665,
      max_speed: 20,
      capacity: 25,
    },
  ]);

  // const defaultCenter = [59.3293, 18.0686];
  useEffect(() => {
    fetchStations();
    fetchParkingZones();

    socket.on("bikeNotification", (data: any) => {
      console.log("Received data:", data);

      if (data && data.length > 0) {
        data.forEach((bike: any) => {
          setBikeData((prev) => ({
            ...prev,
            [bike.bikeSerialNumber]: bike, // Uppdatera eller lägg till cykeln
          }));
        });
      }
    });

    return () => {
      socket.off("bikeNotification");
    };
  }, []);

  // useEffect(() => {
  //   fetchStations();
  //   fetchParkingZones();
  //   socket.on("bikeNotification", (data: any) => {
  //     console.log("Received data:", data);

  //     // Uppdatera state baserat på bikeSerialNumber
  //     setBikeData(
  //       (prev) => ({
  //       ...prev,
  //       [data.bikeSerialNumber]: data, // Uppdatera eller lägg till cykeln
  //     }));
  //   });
  //   return () => {
  //     socket.off("bikeNotification");
  //   };
  // }, []);

  const fetchStations = async () => {
    try {
      const response = await chargingStations.fetchStations(); // Use fetchStations from chargingStations module
      console.log("Fetched Stations:", response);
      if (response.chargingStations && response.chargingStations.length > 0) {
        // @ts-ignore
        setStations(response.chargingStations); // Update state with stations from API
      } else {
        console.error("No stations found");
        setStations([]);
      }
    } catch (error) {
      console.error("Failed to fetch stations:", error);
      setStations([]);
    }
  };

  const fetchParkingZones = async () => {
    try {
      const response = await parkings.getparkings(); // Use getparkings from parkings module
      // @ts-ignore
      if (response.parkings_zones && response.parkings_zones.length > 0) {
        // @ts-ignore

        setParkingZones(response.parkings_zones);
      } else {
        console.error("No parking zones found");
      }
    } catch (error) {
      console.error("Failed to fetch parking zones:", error);
      setParkingZones([]);
    }
  };
  // @ts-ignore
  const handleCityChange = (event) => {
    setCurrentCity(event.target.value);
  };

  // @ts-ignore
  function SetCenter({ city }) {
    const map = useMap();
    // @ts-ignore
    map.setView(cities[city], map.getZoom());
    return null;
  }

  return (
    <>
      <div style={{ padding: "10px" }}>
        <select value={currentCity} onChange={handleCityChange}>
          <option value="Stockholm">Stockholm</option>
          <option value="Göteborg">Göteborg</option>
          <option value="Malmö">Malmö</option>
        </select>
      </div>
      <MapContainer
        // @ts-ignore
        center={cities[currentCity]}
        zoom={13}
        style={{ height: "80vh", width: "80%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapMarkers
          bikes={bikeData}
          chargingStations={stations}
          parkingZones={parkingZones}
        />
        <SetCenter city={currentCity} />
      </MapContainer>
      <AddButtons page="addcity" text="city" />
      <AddButtons page="addparking" text="parking" />
      <AddButtons page="addstation" text="charging station" />
    </>
  );
};

export default ChargingStationsMap;
