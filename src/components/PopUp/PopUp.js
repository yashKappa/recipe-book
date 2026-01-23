import React, { useEffect } from "react";
import "./PopUp.css";

const PopUp = ({ show, message, onClose }) => {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto-close after 4 seconds

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PopUp;
