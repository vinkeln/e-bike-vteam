import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import PreviousTravels from './components/PreviousTravels';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("No user ID found in localStorage.");
    }
    
    return (
        <Router>
            <Routes>
            <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/travels" element={<ProtectedRoute><PreviousTravels /></ProtectedRoute>} />
                </Routes>
        </Router>
    );
}

export default App;
