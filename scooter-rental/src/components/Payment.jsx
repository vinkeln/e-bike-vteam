import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('prepaid');
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            const user_id = localStorage.getItem('userId');

            const data = {
                user_id,
                // method,
                amount,
                api_key: 'key123',
            };
            console.log(data);

            const response = await axios.put('http://localhost:3000/v1/user/update/balance', data, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
            });
            console.log('Backend response:', response.data);


            setMessage('Payment successful');
        } catch (err) {
          console.log(err);
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/profile')}>Back to Profile</button>

            <h1>Payment</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        value="prepaid"
                        checked={method === 'prepaid'}
                        onChange={() => setMethod('prepaid')}
                    />
                    Prepaid
                </label>
            </div>
            <div>
                <label>
                    Amount:
                    <input
                        type="text" placeholder="Enter a number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handlePayment}>Submit</button>
            {message && <p>Success: {message}</p>}
            {error && <p style={{ color: 'red' }}>Payment failed: {error}</p>}
        </div>
    );
};

export default Payment;
