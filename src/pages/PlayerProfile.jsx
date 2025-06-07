import React from "react";
import { useParams, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

const PlayerProfile = ({ players, games }) => {
  const { email } = useParams();

  const player = players.find((p) => p.email === email);
  if (!player) return <p>Player not found</p>;

  const playerGames = games
    .filter(
      (g) => g.player1Email === email || g.player2Email === email
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const lastFiveGames = playerGames.slice(0, 5);

  let wins = 0,
    losses = 0;
  playerGames.forEach((game) => {
    if (game.winner === email) wins++;
    else losses++;
  });

  const pieData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  return (
    <div>
      <h2>{player.name}’s Profile</h2>

      <img
        src={player.avatarUrl || "/default-avatar.jpg"}
        alt="User Avatar"
        style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "1rem" }}
      />

      <p>Email: {player.email}</p>
      <p>Date of Birth: {player.dob || "N/A"}</p>
      <p>Height: {player.height || "N/A"} cm</p>

      <h3>Last 5 Games</h3>
      {lastFiveGames.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <ul>
          {lastFiveGames.map((game) => {
            const opponentEmail =
              game.player1Email === email ? game.player2Email : game.player1Email;
            const opponentName =
              game.player1Email === email ? game.player2Name : game.player1Name;
            const result = game.winner === email ? "Won" : "Lost";
            return (
              <li key={game.id}>
                {new Date(game.date).toLocaleDateString()}: {result} against {opponentName}
              </li>
            );
          })}
        </ul>
      )}

      <h3>Win/Loss Record</h3>
      {wins + losses === 0 ? (
        <p>No games played yet.</p>
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
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      <Link to="/players" style={{ display: "block", marginTop: "1rem" }}>
        Back to Players
      </Link>
    </div>
  );
};

export default PlayerProfile;