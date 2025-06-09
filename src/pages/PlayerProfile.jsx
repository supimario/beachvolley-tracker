import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function PlayerProfile({ players, games }) {
  const { email: playerEmail } = useParams();
  const [showAllGames, setShowAllGames] = useState(false);

  const playerToShow = players.find((p) => p.email === playerEmail);

  if (!playerToShow) return <p>Player not found.</p>;

  const isPlayerInGame = (game) =>
    game.teams?.some((team) =>
      team.some((p) => p.toLowerCase() === playerToShow.email.toLowerCase())
    );

  const playerGames = games
    .filter(isPlayerInGame)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastFiveGames = playerGames.slice(0, 5);

  let wins = 0, losses = 0;

  const getGameResult = (game) => {
    let team1Wins = 0, team2Wins = 0;

    game.sets.forEach(({ team1, team2 }) => {
      if (team1 > team2) team1Wins++;
      else if (team2 > team1) team2Wins++;
    });

    const onTeam1 = game.teams[0].some((p) => p.includes(playerToShow.email));
    const onTeam2 = game.teams[1].some((p) => p.includes(playerToShow.email));

    if (team1Wins === team2Wins) return "draw";
    return (onTeam1 && team1Wins > team2Wins) || (onTeam2 && team2Wins > team1Wins)
      ? "win"
      : "loss";
  };

  const enrichedGames = playerGames.map((game) => {
    const result = getGameResult(game);
    if (result === "win") wins++;
    else if (result === "loss") losses++;
    const opponentTeam = game.teams.find((team) => !team.some((p) => p.includes(playerToShow.email)));
    return {
      ...game,
      result,
      opponent: opponentTeam ? opponentTeam.join(", ") : "Unknown",
    };
  });

  const pieData = [
    { name: "Wins", value: wins, color: "#4caf50" },
    { name: "Losses", value: losses, color: "#f44336" },
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
        className="w-24 h-24 rounded-full mb-4"
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
          {enrichedGames.slice(0, 5).map((game, index) => (
            <li key={`${game.date}-${index}`}>
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
          {enrichedGames.length === 0 ? (
            <p>No games found.</p>
          ) : (
            <ul>
              {enrichedGames.map((game, index) => (
                <li key={`${game.date}-${index}`}>
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

export default PlayerProfile;
