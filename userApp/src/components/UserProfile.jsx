import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons'; // Imports History-icon
import { faMapMarkedAlt, faSignOutAlt, faQuestionCircle  } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    const user_id = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleLogout = () => {
        // clear local Storage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        console.log('User logged out');
        navigate('/login');
    };
    return (
        <div>
            <h1>Welcome User!</h1>
            <h2>From here you can rent bikes with our map or find information about us:</h2>
            <div className="button-container">
                <button onClick={() => navigate('/MapRender')}>
                    <FontAwesomeIcon icon={faMapMarkedAlt}  /> Show Map
                </button>
                <button onClick={handleLogout} className="logout">
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
                </button>
                <button onClick={() => navigate('/about')}>
                    <FontAwesomeIcon icon={faQuestionCircle} /> About Us!
                </button>
            </div>
        </div>
    );
};

export default UserProfile;