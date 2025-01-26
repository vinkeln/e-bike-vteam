import React from 'react';
import PropTypes from 'prop-types'; // Lägg till denna import
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired // Definiera prop types för children
};

export default ProtectedRoute;
