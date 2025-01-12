import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PreviousTravels = () => {
    const [rides, setRides] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRides = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                setError('User ID or token is missing. Please log in again.');
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:3000/v1/travels/user/${userId}?api_key=key123`,
                    {
                        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                    } 
                );

                console.log("Rides fetched:", response.data.Ride);
                // console.log(response, "testt")
                setRides(response.data.Ride);
            } catch (err) {
                setError("Failed to fetch rides. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRides();
    }, []);

    return (
        <div>
            <button onClick={() => navigate('/profile')}>Back to Profile</button>

            <h2>Previous Rides</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : rides.length === 0 ? (
                <p>No rides found.</p>
            ) : (
                <ul>
                    {rides.map((ride) => (
                        <li key={ride.ride_id}>
                            Ride ID: {ride.ride_id}, Cost: {ride.cost} SEK
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PreviousTravels;