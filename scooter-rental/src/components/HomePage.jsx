import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importera FontAwesomeIcon
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'; // Importera frågeteckensikonen

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Scooter Rental Service</h1>
            <p>
                Welcome to our e-bike rental application! We are committed to providing a sustainable and eco-friendly way to explore your city.
            </p>
            <button onClick={() => navigate('/register')}>Create Account</button>
            <button onClick={() => navigate('/login')}>Login</button>
        
            <p onClick={() => navigate('/about')}>
                <FontAwesomeIcon icon={faQuestionCircle} /> About
            </p>
        </div>
    );
};

export default HomePage;
