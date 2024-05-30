import React from "react";

interface RadialProgressProps {
  percentage: number;
  color: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  percentage,
  color,
}) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute top-0 left-0 w-full h-full">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className="transition-all duration-300"
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <span className="text-lg font-semibold text-gray-800">{percentage}%</span>
    </div>
  );
};

export default RadialProgress;
