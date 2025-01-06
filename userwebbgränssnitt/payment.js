import React, { useState } from 'react';

API_KEY=key123
JWT_KEY=secret

//kontrollera beloppet innan förfrågan till backend
let handlePayment = async () => {
    // Kontrollera att beloppet är giltigt
    if (!amount || parseFloat(amount) <= 0) {
        setMessage("Please enter a valid amount.");
        return;
    }

    //skapa betalningsdata
    let createPayment = {
        userId,
        amount: parseFloat(amount),
        paymentType,
        status: "pending",
    };

    try {
        let response = await fetch("http://localhost:3000/api/payment", { // kontrollera routen
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api_key": API_KEY, // Lägg till API-nyckeln i headern ska denna vara med?
            },
            body: JSON.stringify(createPayment),
        });
        if (response.ok) {
            let data = await response.json();
            setMessage(`Payment successful! Payment ID: ${data.paymentId}`);
        } else {
            let error = await response.json();
            setMessage(`Payment failed: ${error.error}`);
        }
    };



    let Payment = () => {
    let [paymentType, setPaymentType] = useState("prepaid"); // Kontrollerar vilken betalningsmetod som är vald
    let [amount, setAmount] = useState(""); // Beloppet användaren vill fylla på
    let [userId, setUserId] = useState("12345"); // Hårdkodat: användar-ID (Ska hämtas dynamiskt)
    let [message, setMessage] = useState(""); //Visar meddelande

    let handlePayment = async () => {
        let paymentData = {
        userId,
        amount: parseFloat(amount),
        paymentType,
        status: "pending", 
        };

        try {
        let response = await fetch("http://localhost:5000/api/payment", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
        });

        if (response.ok) {
            let data = await response.json();
            setMessage(`Payment successful! Payment ID: ${data.paymentId}`);
        } else {
            let error = await response.json();
            setMessage(`Payment failed: ${error.error}`);
        }
        } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div>
        <h1>Choose Payment Option</h1>
        <div>
            <label>
            <input
                type="radio"
                value="prepaid"
                checked={paymentType === "prepaid"}
                onChange={(e) => setPaymentType(e.target.value)}
            />
            Prepaid (Fill Balance)
            </label>
            <label>
            <input
                type="radio"
                value="subscription"
                checked={paymentType === "subscription"}
                onChange={(e) => setPaymentType(e.target.value)}
            />
            Monthly Subscription
            </label>
        </div>

        <div>
            <label>
            Amount:{" "}
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            </label>
        </div>

        <button onClick={handlePayment}>Proceed</button>

        {message && <p>{message}</p>}
        </div>
    );
};

export default Payment;



// felsökning för api-key
/*fetch('http://localhost:3000/v1/chargingstations?api_key=key123')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));*/


