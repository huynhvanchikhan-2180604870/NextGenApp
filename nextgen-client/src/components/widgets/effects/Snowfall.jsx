import React from "react";
import "./Snowfall.css";

const Snowfall = ({ flakes = 50 }) => {
  return (
    <div className="snowfall-container">
      {[...Array(flakes)].map((_, i) => {
        const size = 15 + Math.random() * 10; // 5–15px
        const delay = Math.random() * 10; // 0–10s
        const duration = 5 + Math.random() * 5; // 5–10s
        const startX = Math.random() * 100; // 0–100%
        const hue = 200 + Math.random() * 40; // 200–240°
        const color = `hsl(${hue}, 100%, 85%)`; // light blue

        return (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${startX}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              background: color,
              boxShadow: `0 0 ${size / 2}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Snowfall;
