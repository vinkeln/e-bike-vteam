import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import PreviousTravels from './components/PreviousTravels';



function App() {
    const userId = localStorage.getItem('userId');
    return (
        <Router>
            <Routes>
            <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/travels" element={<PreviousTravels userId={userId} />} />
            </Routes>
        </Router>
    );
}

export default App;
