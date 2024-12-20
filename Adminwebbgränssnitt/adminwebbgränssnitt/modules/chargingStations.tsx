import auth from "./auths.ts";

const BASE_URL = 'http://localhost:3000/v1/chargingstations';

export const fetchStations = async () => {
    try {
        const response = await fetch(BASE_URL, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch stations");
        const data = await response.json();
        return data.chargingStations || [];
    } catch (error) {
        console.error("Failed to fetch charging stations:", error);
        return [];
    }
};

export const addStation = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to add charging station');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding charging station:', error);
        throw error;
    }
};