import React from "react";
import { Link } from "react-router-dom";

const PlayerList = ({ players, games }) => {
  // Get all games a player participated in (by name or email, case-insensitive)
  const getGamesPlayedByPlayer = (player) => {
    return games.filter((game) =>
      game.teams?.some((team) =>
        team.some(
          (p) =>
            p?.toLowerCase() === player.name.toLowerCase() ||
            p?.toLowerCase() === player.email.toLowerCase()
        )
      )
    );
  };

  return (
    <div className="player-list">
      <h2>All Players</h2>
      <ul>
        {players.map((player) => {
          const playerGames = getGamesPlayedByPlayer(player);

          return (
            <li key={player.email} className="player-list-item">
              <Link to={`/player/${encodeURIComponent(player.email)}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={player.avatar}
                    alt={`${player.name}'s avatar`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                  <div>
                    <div>
                      <strong>{player.name}</strong>
                    </div>
                    <div>Total games played: {playerGames.length}</div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlayerList;
