import React from "react";
import { useNavigate } from "react-router-dom";

const WithBackButton = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      {children}
    </div>
  );
};

export default WithBackButton;
