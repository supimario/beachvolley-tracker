import React from "react";

export default function PlayerList({ players }) {
  if (!players || players.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        No registered players yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Registered Players</h2>
      <ul className="list-disc list-inside space-y-2">
        {players.map((player) => (
          <li key={player.email} className="flex justify-between items-center border-b border-gray-200 py-2">
            <div>
              <span className="font-semibold">{player.name}</span>{" "}
              <span className="text-gray-500 text-sm">({player.email})</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
