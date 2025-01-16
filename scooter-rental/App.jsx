import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import PreviousTravels from './components/PreviousTravels';
import Payment from './components/Payment';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Info from './components/Info';
import About from './components/About';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/travels" element={<ProtectedRoute><PreviousTravels /></ProtectedRoute>} />
                <Route path="/payment" element={ <ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/info" element={ <ProtectedRoute><Info /></ProtectedRoute>} />
                <Route path="/about" element={ <ProtectedRoute><About /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
