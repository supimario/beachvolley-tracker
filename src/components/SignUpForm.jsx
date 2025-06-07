import React, { useState } from "react";

const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    height: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.height || isNaN(formData.height)) {
      alert("Please enter a valid numeric height in cm.");
      return;
    }

    onSubmit(formData); // Pass data to PlayerSignup
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      <div className="mb-3">
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border mt-1"
        />
      </div>

      <div className="mb-3">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border mt-1"
        />
      </div>

      <div className="mb-3">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border mt-1"
        />
      </div>

      <div className="mb-3">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          className="w-full p-2 border mt-1"
        />
      </div>

      <div className="mb-3">
        <label>Height (cm):</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
          min="50"
          max="300"
          className="w-full p-2 border mt-1"
        />
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
