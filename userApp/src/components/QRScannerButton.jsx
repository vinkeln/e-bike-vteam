import React from "react";
import { useNavigate } from "react-router-dom";

const QRScannerButton = ({ userId, scooterId, startLocationId, cost }) => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    navigate("/QRScanner", {
      state: {
        userId,
        scooterId,
        startLocationId,
        cost,
      },
    });
  };

  return (
    <button
      onClick={handleButtonClick}
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
      start
    </button>
  );
};

export default QRScannerButton;
