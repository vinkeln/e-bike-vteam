export const apiKey: string = "key123";
export const baseURL: string = "http://localhost:3000";
import auth from "./auths.ts"

export const fetchBikes = async (apiKey: string) => {
    try {
        const response = await fetch(`${baseURL}/v1/bikes?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching bikes:", error);
        throw error;
    }
}
