import React from "react";

const Spinner = ({ size = 40, color = "#3498db" }) => {
  const spinnerSize = `${size}px`;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: spinnerSize, height: spinnerSize }}
    >
      <div
        className="rounded-full border-t-transparent animate-spin"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `${size / 10}px solid ${color}`, 
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
};

export default Spinner;
