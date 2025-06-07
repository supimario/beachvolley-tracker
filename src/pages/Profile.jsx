import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
} from "recharts";

function Profile({ loggedInUser, players, games }) {
  const { email: playerEmail } = useParams();
  const [showAllGames, setShowAllGames] = useState(false);

  const playerToShow = playerEmail
    ? players.find((p) => p.email === playerEmail)
    : loggedInUser;

  if (!playerToShow) return <p>Player not found.</p>;

  const playerGames = games.filter(
    (g) => g.playerEmail === playerToShow.email
  );

  const lastFiveGames = playerGames
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const wins = playerGames.filter((g) => g.result === "win").length;
  const losses = playerGames.filter((g) => g.result === "loss").length;
  const draws = playerGames.filter((g) => g.result === "draw").length;

  const pieData = [
    { name: "Wins", value: wins, color: "#4caf50" },
    { name: "Losses", value: losses, color: "#f44336" },
    { name: "Draws", value: draws, color: "#ffc107" },
  ].filter((entry) => entry.value > 0);

  const calculateAge = (dobStr) => {
    if (!dobStr) return "N/A";
    const dob = new Date(dobStr);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const age = calculateAge(playerToShow.dob);

  return (
    <div className="profile-page max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{playerToShow.name}'s Profile</h1>

      <img
       src={playerToShow.avatarUrl || "/default-avatar.jpg"}
        alt="User Avatar"
        style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "1rem" }}
      />

      <p><strong>Email:</strong> {playerToShow.email}</p>
      <p><strong>Date of Birth:</strong> {playerToShow.dob || "N/A"}</p>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Height:</strong> {playerToShow.height ? `${playerToShow.height} cm` : "N/A"}</p>

      <hr className="my-4" />

      <h2 className="text-2xl font-semibold mb-2">Last 5 Games</h2>
      {lastFiveGames.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <ul className="mb-4">
          {lastFiveGames.map((game) => (
            <li key={game.id || game.date}>
              <strong>{new Date(game.date).toLocaleDateString()}</strong>: {game.opponent} — {game.result}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-semibold mb-2">Overall Performance</h2>
      {pieData.length === 0 ? (
        <p>No game results to display.</p>
      ) : (
        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowAllGames((prev) => !prev)}
      >
        {showAllGames ? "Hide Game History" : "Show Full Game History"}
      </button>

      {showAllGames && (
        <>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Full Game History</h2>
          {playerGames.length === 0 ? (
            <p>No games found.</p>
          ) : (
            <ul>
              {playerGames
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((game) => (
                  <li key={game.id || game.date}>
                    <strong>{new Date(game.date).toLocaleDateString()}</strong>: {game.opponent} — {game.result}
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;