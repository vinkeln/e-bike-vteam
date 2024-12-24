import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const Register = () => {
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const apiKey = 'key123'; 
            console.log({ name, mail, password, role, api_key: apiKey }); // Logga data som skickas
            const response = await registerUser({ name, mail, password, role, api_key: apiKey });
            console.log('Registration response:', response.data);
            navigate('/login'); 
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message); // Logga exakt fel
            setError('Failed to register. Please try again.');
        }
    };
    
    

    return (
        <div>
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
        </div>
    );
};

export default Register;
