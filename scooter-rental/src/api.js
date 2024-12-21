import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/v1',
});

export const registerUser = async (userData) => {
    return api.post('/user/signup', userData); // Skicka registreringsdata till backend
};


export const loginUser = async (credentials) => {
    return api.post('/user/login', credentials); // Skicka login-data till backend
};

export default api;
