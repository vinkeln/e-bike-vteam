import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './src/components/HomePage';
import UserProfile from './src/components/UserProfile';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<UserProfile />} />

            </Routes>
        </Router>
    );
};

export default App;
