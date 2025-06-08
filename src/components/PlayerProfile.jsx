import React from "react";
import { useParams, Link } from "react-router-dom";
import { getGamesForPlayer } from "../utils/gameUtils";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

const PlayerProfile = ({ players, games }) => {
  const { email } = useParams();
  const player = players.find((p) => p.email === email);

  if (!player) return <p>Player not found</p>;

  // Find games where player is in either team
  const playerGames = games
    .filter((game) =>
      game.teams.some((team) => team.includes(email))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const lastFiveGames = playerGames.slice(0, 5);

  // Count wins and losses
  let wins = 0, losses = 0;

  playerGames.forEach((game) => {
    const { team1Wins, team2Wins } = game.sets.reduce(
      (acc, set) => {
        if (set.team1 > set.team2) acc.team1Wins++;
        else if (set.team2 > set.team1) acc.team2Wins++;
        return acc;
      },
      { team1Wins: 0, team2Wins: 0 }
    );

    const playerOnTeam1 = game.teams[0].includes(email);
    const playerOnTeam2 = game.teams[1].includes(email);

    if ((team1Wins > team2Wins && playerOnTeam1) || (team2Wins > team1Wins && playerOnTeam2)) {
      wins++;
    } else {
      losses++;
    }
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
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />

      <h3>Overall Performance</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h3>Recent Games</h3>
      {lastFiveGames.length === 0 ? (
        <p>No games found for this player.</p>
      ) : (
        <ul>
          {lastFiveGames.map((game, i) => (
            <li key={i}>
              {new Date(game.date).toLocaleDateString()} - vs.{" "}
              {game.teams[0].includes(email)
                ? game.teams[1].join(", ")
                : game.teams[0].join(", ")}
            </li>
          ))}
        </ul>
      )}

      <h3>All Games</h3>
      {playerGames.length === 0 ? (
        <p>No game history available.</p>
      ) : (
        <ul>
          {playerGames.map((game, i) => (
            <li key={i}>
              {new Date(game.date).toLocaleDateString()} -{" "}
              {game.teams[0].join(" & ")} vs. {game.teams[1].join(" & ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerProfile;
