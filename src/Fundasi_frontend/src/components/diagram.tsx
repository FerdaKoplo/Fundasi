import React from "react";

interface CircularProgressBarProps {
  value: number;
  total: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ value, total }) => {
  const radius = 45;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / total) * circumference;

  const percentage = (value / total) * 100;

  // Color logic
  let strokeColor = "#ef6464"; // default merah
  if (value >= 100) {
    strokeColor = "url(#darkGreenGradient)";
  } else if (value >= 50) {
    strokeColor = "url(#darkYellowGradient)";
  } else {
    strokeColor = "url(#darkRedGradient)";
  }

  return (
    <svg height={radius * 2} width={radius * 2}>
      <defs>
        <linearGradient id="darkGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a5d4b" />
          <stop offset="100%" stopColor="#7a9b5f" />
        </linearGradient>
        <linearGradient id="darkYellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b88b00" />
          <stop offset="100%" stopColor="#d1b758" />
        </linearGradient>
        <linearGradient id="darkRedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b2d2d" />
          <stop offset="100%" stopColor="#d66565" />
        </linearGradient>
      </defs>
      <circle
        stroke="#1a1a1a"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={strokeColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fill="white"
        fontSize="12"
      >
        Trust{"\n"}points
      </text>
    </svg>
  );
};

export default CircularProgressBar;