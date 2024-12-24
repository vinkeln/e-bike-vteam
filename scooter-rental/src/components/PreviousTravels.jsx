import React, { useEffect, useState } from "react";
import axios from "axios";

const PreviousTravels = ({ userId }) => {
    const [travels, setTravels] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTravels = async () => {
            try {
                const token = localStorage.getItem("token"); // Hämta token från localStorage
                const response = await axios.get(`http://localhost:3000/v1/travels/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTravels(response.data.rides);
            } catch (err) {
                setError("Failed to fetch travels.");
                console.error(err);
            }
        };

        fetchTravels();
    }, [userId]);

    return (
        <div>
            <h2>Your Previous Travels</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {travels.map((travel) => (
                    <li key={travel.ride_id}>
                        Start: {travel.start_time} - End: {travel.end_time || "Ongoing"}
                        <br />
                        Cost: {travel.cost} SEK
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PreviousTravels;
