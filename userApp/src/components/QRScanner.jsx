import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import TravelButton from "./TravelButton"; // Importera TravelButton-komponenten
import { useLocation} from "react-router-dom";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const QRScanner = () => {
  const location = useLocation();
  const { userId, scooterId, startLocationId, cost  } = location.state || {};
  const [scanResult, setScanResult] = useState("");

  const generateStartTime = () => {
    const now = new Date();
    return formatDate(now);
  };

  const handleScan = (data) => {
    if (data) {
      setScanResult(data.text); // QR-data hittas här
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  const handleSubmit = () => {
    const input = scanResult;
    console.log(input)
    console.log(scooterId)

    if (input === scooterId) {
      console.log(scooterId)
      alert("Scooter ID matched! Starting the trip...");
      // Render TravelButton or perform any other action
    } else {
      alert("Scooter ID does not match.");
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
     
      <div>
        <h2>Scan QR Code</h2>
        <QrReader
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      </div>

      <div>
        <h2>Bike Id</h2>
        <h3>{scooterId}</h3>
        <input
          type="text"
          placeholder="Enter Scooter ID"
          value={scanResult}
          onChange={(e) => setScanResult(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            margin: "10px 0",
            width: "100%",
          }}
        />
      </div>

      {/* <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Submit
      </button> */}

      {/* Om ID matchar, visa TravelButton */}
      {(scanResult === scooterId) && (
        <TravelButton
          userId={userId}
          scooterId={scooterId}
          startLocationId={startLocationId}
          generateStartTime={generateStartTime}
          cost={cost}
        />
      )}
    </div>
  );
};

export default QRScanner;
