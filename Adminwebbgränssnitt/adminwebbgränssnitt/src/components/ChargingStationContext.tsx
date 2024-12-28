import React, { createContext, useContext, useState, useEffect } from 'react';

const ChargingStationContext = createContext();

export const ChargingStationProvider = ({ children }) => {
  const [stations, setStations] = useState([]);

  const fetchStations = async () => {
    try {
      const response = await fetch('api/path/to/stations');
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const addStation = async (station) => {
    // Lägg till station logik här
    setStations(prevStations => [...prevStations, station]);
  };

  return (
    <ChargingStationContext.Provider value={{ stations, addStation }}>
      {children}
    </ChargingStationContext.Provider>
  );
};

export const useChargingStations = () => useContext(ChargingStationContext);
