import React, { useState } from "react";

function PlayerForm({ onAddPlayer }) {
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() === "") return;
    onAddPlayer(playerName.trim());
    setPlayerName("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Player
      </button>
    </form>
  );
}

export default PlayerForm;
