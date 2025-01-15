import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        
        try {
            const apiKey = "key123"; // API-nyckel
            const response = await axios.post("http://localhost:3000/v1/user/signup", {
                name: name,
                mail: mail,
                password: password,
                role: role,
                api_key: apiKey,
                
            });

            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to register. Please try again.");
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/')}>Back to Homepage</button>

            <h2>Create an Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
};

export default Register;