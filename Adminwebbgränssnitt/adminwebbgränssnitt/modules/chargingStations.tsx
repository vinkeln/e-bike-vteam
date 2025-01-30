import auth from "./auths.ts";
import { apiKey } from "../utils.ts";

const baseURL = "http://localhost:3000/v1/chargingstations";

interface ChargingStation {
  location_id?: string;
  latitude: string;
  longitude: string;
  api_key?: string;
  city_id: string;
  total_ports: string;
}

// interface ChargingStationsResponse {
//   status: string;
//   parkings_zones: ChargingStation;
//   message?: string;
// }

export const fetchStations = async () => {
  try {
    const response = await fetch(baseURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch stations");
    const data = await response.json();
    return data.chargingStations || [];
  } catch (error) {
    console.error("Failed to fetch charging stations:", error);
    return [];
  }
};

export const addStation = async (
  cityId: string,
  latitude: string,
  longitude: string,
  totalPorts: string
): Promise<string> => {
  const station: ChargingStation = {
    latitude,
    longitude,
    city_id: cityId,
    total_ports: totalPorts,
    api_key: apiKey,
  };

  try {
    const response = await fetch(`${baseURL}/add`, {
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
    throw new Error(
      "Failed to add station. Please check your network or try again."
    );
  }
};
