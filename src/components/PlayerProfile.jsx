import React from "react";

const PlayerProfile = ({ player, games }) => {
  const playerGames = games.filter(
    (game) =>
      game.team1.players.some((p) => p.email === player.email) ||
      game.team2.players.some((p) => p.email === player.email)
  );

  const wins = playerGames.filter((game) => {
    const isTeam1 = game.team1.players.some((p) => p.email === player.email);
    return (isTeam1 && game.team1.score > game.team2.score) ||
           (!isTeam1 && game.team2.score > game.team1.score);
  });

  const winRate = playerGames.length > 0 ? (wins.length / playerGames.length) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{player.name}'s Profile</h2>
      <p className="mb-2"><strong>Email:</strong> {player.email}</p>
      <p className="mb-2"><strong>Games Played:</strong> {playerGames.length}</p>
      <p className="mb-4"><strong>Win Rate:</strong> {winRate.toFixed(1)}%</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Game History</h3>
      {playerGames.length === 0 ? (
        <p className="text-gray-500">No games played yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {playerGames.map((game, index) => (
            <li key={index} className="mb-1">
              {game.team1.players.map(p => p.name).join(" & ")} ({game.team1.score}) vs{" "}
              {game.team2.players.map(p => p.name).join(" & ")} ({game.team2.score})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerProfile;
