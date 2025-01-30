import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importera FontAwesomeIcon
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'; // Importera frågeteckensikonen

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Scooter Rental Service App</h1>
            <p>
                Welcome to our e-bike rental application! We are committed to providing a sustainable and eco-friendly way to explore your city.
            </p>
            <div className="button-container">
                <button onClick={() => navigate('/register')}>Create Account</button>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/about')}>
                    <FontAwesomeIcon icon={faQuestionCircle} /> About Us!
                </button>
            </div>
        </div>
    );
};

export default Home;