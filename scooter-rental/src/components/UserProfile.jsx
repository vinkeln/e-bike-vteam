import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome, User {userId}</h1>
            <p>Choose what you want to do:</p>
            <button onClick={() => navigate('/travels')}>View Previous Travels</button>
            <button onClick={() => navigate('/payment')}>Make a Payment</button>
        </div>
    );
};

export default UserProfile;
