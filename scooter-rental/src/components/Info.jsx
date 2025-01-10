import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importera FontAwesomeIcon
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Importera info-ikonen
import { useNavigate } from 'react-router-dom';

const Info = () => {
        const navigate = useNavigate();
    
    return (
        <div className="info-container">
                        <button onClick={() => navigate('/profile')}>Back to Profile</button>

            <h1 className="info-header">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                Information
            </h1>

            <h2 className="info-subheader">Before Riding an E-Scooter</h2>
            <ul className="info-list">
                <li>Always wear a helmet for your safety.</li>
                <li>Check the brakes and tires before you start riding.</li>
                <li>Follow traffic rules and respect pedestrians.</li>
                <li>Use bike lanes where possible.</li>
                <li>Never ride on sidewalks.</li>
                <li>Adjust your speed to the environment and weather conditions.</li>
                <li>Park responsibly without blocking pathways or roads.</li>
            </ul>
        </div>
    );
};

export default Info;
