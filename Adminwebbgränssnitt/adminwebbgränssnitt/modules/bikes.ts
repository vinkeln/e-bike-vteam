import { apiKey, baseURL } from "../utils.ts";
import auth from "./auths.ts"

interface City {
    city_id?: number;
    name: string;
    country: string;
    api_key?: string;

}

interface CitiesResponse {
    status: string;
    cities: City[];
    message: string;
}

const cities = {
    async getcities(): Promise<CitiesResponse> {
        try {
            const response = await fetch(`${baseURL}/v1/cities/?api_key=${apiKey}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result as CitiesResponse;
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    },
    async addCity(name:string, country:string): Promise<string>{
        const city: City = {
            name: name,
            country: country,
            api_key: apiKey,
          };
      
        try {
            const response = await fetch(`${baseURL}/v1/cities/add`, {
                body:JSON.stringify(city),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                },
                
                method: "POST",
            });
           

            const result = await response.json();
            console.log(result.message);

            if (result.status === 'success') {
                return "ok";
              } else if (result.message === 'city exists') {
                
                
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

export default cities;
