import React from "react";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: "10px 16px",
        borderRadius: "6px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};
