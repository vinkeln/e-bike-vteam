// chargingstations.ts
import { apiKey, baseURL } from "../utils.ts"; // Antag att BASE_URL och apiKey exporteras från utils.ts
import auth from "./auths.ts";

interface ChargingStation {
  latitude: string;
  longitude: string;
  city_id: string;
  total_ports: string;
}


interface ChargingStationsResponse {
  status: string;
  chargingStations: ChargingStation[];
  message?: string;
}

const chargingStations = {
  async fetchStations(): Promise<ChargingStationsResponse> {
    try {
      const response = await fetch(`${baseURL}/v1/chargingstations/?api_key=${apiKey}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { status: "success", chargingStations: data.chargingStations || [] };
    } catch (error) {
      console.error("Failed to fetch charging stations:", error);
      return { status: "error", chargingStations: [] };
    }
  },

  async addStation(cityId: string, latitude: string, longitude: string, totalPorts: string): Promise<string> {
    const station: ChargingStation = {
      latitude,
      longitude,
      city_id: cityId,
      total_ports: totalPorts,
    };

    try {
      const response = await fetch(`${BASE_URL}/v1/chargingstations/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(station),
      });

      if (!response.ok) {
        console.error(`Server responded with status ${response.status}`);
        return "Server error. Please try again later.";
      }

      const result = await response.json();
      if (result.status === "success") {
        return "ok";
      } else if (result.message === "Chargingstation exists") {
        return "Charging station already exists.";
      } else {
        return "Unexpected error occurred.";
      }
    } catch (error) {
      console.error("Error while adding station:", error);
      throw new Error("Failed to add station. Please check your network or try again.");
    }
  }
};

export default chargingStations;
