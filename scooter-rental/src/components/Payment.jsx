import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('prepaid');
  const [message, setMessage] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handlePayment = async () => {
    const data = {
      amount: amount,
      paymentType: paymentType,
    };

    if (!userId || !token) {
      setMessage('User ID or token is missing. Please log in again.');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/payment/${userId}?api_key=key123`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Payment successful!');
    } catch (error) {
      console.log(`Payment failed: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <div>
        <label>
          <input
            type="radio"
            value="prepaid"
            checked={paymentType === 'prepaid'}
            onChange={() => setPaymentType('prepaid')}
          />
          Prepaid (Top-up balance)
        </label>
        <label>
          <input
            type="radio"
            value="subscription"
            checked={paymentType === 'subscription'}
            onChange={() => setPaymentType('subscription')}
          />
          Monthly Subscription
        </label>
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handlePayment}>Submit</button>
      <p>{message}</p>
    </div>
  );
};

export default Payment;
