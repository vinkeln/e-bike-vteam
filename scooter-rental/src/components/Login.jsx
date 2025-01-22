import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // const token = localStorage.getItem('token');
            const apiKey = "key123"; // API-nyckel
            const response = await axios.post("http://localhost:3000/v1/user/login", {
                mail: email,
                password: password,
                api_key: apiKey,
            });

            if (!response.data.user_id) {
                throw new Error("Invalid API response: Missing user ID");
            }

            console.log("userId", response.data.user_id);
            localStorage.setItem("userId", response.data.user_id);
            localStorage.setItem("token", response.data.token);
            console.log("Login successful. Token:", response.data.token);
            navigate("/profile");
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/')}>Back to Homepage</button>

            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>Don&apos;t have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

export default Login;
