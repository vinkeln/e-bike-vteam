import { apiKey, baseURL } from "../utils.ts";
import auth from "./auths.ts"

interface Parking {
    capacity: string;
    location_id?: string;
    latitude: string;
    longitude: string;
    api_key?: string;
    type?: string;
    zone_id?: number;
    max_speed: string;
    city_id: string;

}

interface ParkingsResponse {
    status: string;
    parkings_zones: Parking;
    message?: string;
}

const parkings = {
    async getparkings(): Promise<ParkingsResponse> {
        try {
            const response = await fetch(`${baseURL}/v1/parking/?api_key=${apiKey}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching parkings:", error);
            throw error;
        }
    },
   
    async addParking(cityId:string, latitude:string, longitude:string, maxSpeed:string,capacity:string ): Promise<string>{
        const parking: Parking = {
            capacity: capacity,
            latitude: latitude,
            longitude: longitude,
            max_speed: maxSpeed,
            city_id: cityId,
            api_key: apiKey,
          };
      
        try {
            const response = await fetch(`${baseURL}/v1/parking/add`, {
                body:JSON.stringify(parking),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                },
                
                method: "POST",
            });
           

            const result = await response.json();
            console.log(result.message);

            if (result.message === 'parkingzone has been added') {
                return "ok";
              } else if (result.message === 'parkingzone exists') {
                
                
                return result.message;
              } else {
                return "Unexpected error occurred.";
              }
            
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    }
};

export default parkings;
