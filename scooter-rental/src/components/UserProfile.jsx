import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons'; // Importera wallet-ikonen
import { faHistory } from '@fortawesome/free-solid-svg-icons'; // Importera History-ikonen
import { faInfoCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importera SignOut-ikonen

const UserProfile = () => {
    const user_id = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Rensa localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        console.log('User logged out');
        // Navigera till login-sidan
        navigate('/login');
    };
    return (
        <div>
            <h1>Welcome!</h1>
            <p>Where do you want to go for a walk today?</p>
            <h4>Choose what you want to do:</h4>
            <p onClick={() => navigate('/travels')}>
                <FontAwesomeIcon icon={faHistory}  /> View Previous Travels
            </p>
            <p onClick={() => navigate('/payment')}>
                <FontAwesomeIcon icon={faWallet}  /> Wallet
            </p>
            <p onClick={() => navigate('/info')}>
                <FontAwesomeIcon icon={faInfoCircle}  /> Info
            </p>

            <button onClick={handleLogout} className="logout">
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
            </button>
        </div>
    );
};

export default UserProfile;