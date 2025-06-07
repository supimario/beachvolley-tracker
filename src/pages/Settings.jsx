import React, { useState } from "react";

const Settings = ({ loggedInUser, players, setPlayers, setLoggedInUser }) => {
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = () => {
    if (!newPassword.trim()) {
      alert("Password cannot be empty");
      return;
    }

    const updatedPlayers = players.map((p) =>
      p.email === loggedInUser.email ? { ...p, password: newPassword } : p
    );
    setPlayers(updatedPlayers);
    const updatedUser = { ...loggedInUser, password: newPassword };
    setLoggedInUser(updatedUser);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    alert("Password updated successfully.");
    setNewPassword("");
  };

  return (
  <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>

    {/* Profile Picture */}
    <div className="mb-4 text-center">
      <img
       src={loggedInUser.profilePic || "/default-avatar.jpg"}
        className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const updatedUser = { ...loggedInUser, profilePic: reader.result };
              const updatedPlayers = players.map((p) =>
                p.email === loggedInUser.email ? updatedUser : p
              );
              setPlayers(updatedPlayers);
              setLoggedInUser(updatedUser);
              localStorage.setItem("players", JSON.stringify(updatedPlayers));
              localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>

    {/* Change Name */}
    <div className="mb-4">
      <label className="block mb-1">Change Display Name:</label>
      <input
        type="text"
        value={loggedInUser.name}
        onChange={(e) => {
          const updatedUser = { ...loggedInUser, name: e.target.value };
          setLoggedInUser(updatedUser);
        }}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={() => {
          const updatedPlayers = players.map((p) =>
            p.email === loggedInUser.email ? { ...p, name: loggedInUser.name } : p
          );
          setPlayers(updatedPlayers);
          localStorage.setItem("players", JSON.stringify(updatedPlayers));
          localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
          alert("Name updated successfully.");
        }}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Confirm Name Change
      </button>
    </div>

    {/* Change Password */}
    <div className="mb-4">
      <label className="block mb-1">Change Password:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handlePasswordChange}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
      >
        Confirm Password Change
      </button>
    </div>
  </div>
);
};

export default Settings;
