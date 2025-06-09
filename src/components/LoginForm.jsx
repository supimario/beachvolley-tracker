import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";

function LoginForm({ loginPlayer, registerPlayer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginPlayer(email, password);
    if (success) {
      navigate("/"); // Go to homepage
    }
  };

  const handleSignUp = (formData) => {
    const success = registerPlayer(formData);
    if (success) {
      alert("Signup successful! You are now logged in.");
      setShowSignUp(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {showSignUp ? (
        <>
          <SignUpForm onSubmit={handleSignUp} />
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <button
              onClick={() => setShowSignUp(false)}
              className="text-blue-600 underline"
            >
              Log In
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Log In
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <button
              onClick={() => setShowSignUp(true)}
              className="text-blue-600 underline"
            >
              Sign Up
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default LoginForm;
