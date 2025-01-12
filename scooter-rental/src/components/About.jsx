import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importera useNavigate

const About = () => {
    const navigate = useNavigate(); // Definiera navigate

    return (
        <div className="about-container">
            <button onClick={() => navigate('/')}>Back to Homepage</button>

            <h1>About Us</h1>

            <p>
                Our mission is to make transportation accessible, fun, and environmentally friendly. Thank you for choosing us as your travel partner.
            </p>
            <h2>Why Choose Us?</h2>
            <ul>
                <li>Convenient and affordable rentals</li>
                <li>Eco-friendly transportation</li>
                <li>Easy-to-use platform</li>
                <li>24/7 customer support</li>
            </ul>
        </div>
    );
};

export default About;
