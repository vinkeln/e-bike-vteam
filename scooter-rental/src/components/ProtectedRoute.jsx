import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />; // Omdirigera till login om token saknas
    }
    return children;
};

export default ProtectedRoute;
