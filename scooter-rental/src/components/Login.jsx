import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const apiKey = "key123";
            const response = await loginUser({ mail: email, password, api_key: apiKey });
            console.log("API Response:", response.data);
    
            if (!response.data.user_id) {
                throw new Error("Invalid API response: Missing user ID");
            }
    
            localStorage.setItem("userId", response.data.user_id);
            navigate("/travels");
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError("Invalid email or password. Please try again.");
        }
    };
    
    
    

    return (
        <div>
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
        </div>
    );
};

export default Login;
