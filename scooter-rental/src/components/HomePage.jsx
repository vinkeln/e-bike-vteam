import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to the Scooter Rental Service</h1>
            <button onClick={() => navigate('/register')}>Create Account</button>
            <button onClick={() => navigate('/login')}>Login</button>
        </div>
    );
};

export default HomePage;
