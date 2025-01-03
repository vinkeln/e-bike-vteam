import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/v1',
});

export const registerUser = async (userData) => {
    return api.post('/user/signup', userData); // Skicka registreringsdata till backend
};


export const loginUser = async (data) => {
    try {
        const response = await axios.post("http://localhost:3000/v1/user/login", data);
        return response; // Returnera hela svaret
    } catch (err) {
        console.error("API error:", err.response?.data || err.message);
        throw err;
    }
};

export const getTravels = async (token) => {
    return api.get('/v1/travels?api_key=key123', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};



export default api;
