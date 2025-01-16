import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            <h1>Welcome User!</h1>
            <h4>Choose what you want to do:</h4>
            <p onClick={() => navigate('/MapRender')}>
                <FontAwesomeIcon icon={faHistory}  /> Show Map
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