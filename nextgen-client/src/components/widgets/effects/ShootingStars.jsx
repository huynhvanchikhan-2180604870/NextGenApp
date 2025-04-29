import React from "react";
import "./ShootingStars.css";

const ShootingStars = ({ count = 15 }) => {
  return (
    <div className="shooting-stars-container">
      {[...Array(count)].map((_, i) => {
        const delay = Math.random() * 5; // random delay 0–5s
        const duration = 0.8 + Math.random() * 1.2; // random duration 0.8–2s
        // random start position on top half
        const startX = Math.random() * 100;
        const startY = Math.random() * 40;
        return (
          <div
            key={i}
            className="shooting-star"
            style={{
              "--delay": `${delay}s`,
              "--duration": `${duration}s`,
              top: `${startY}%`,
              left: `${startX}%`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ShootingStars;
