import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Players({ players, games }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter players by search term (case insensitive)
  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  // Get last game played by player (by email)
  const getLastGame = (email) => {
    const playerGames = games
      .filter((game) => game.players && game.players.includes(email))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return playerGames.length > 0 ? playerGames[0] : null;
  };

  const onPlayerClick = (email) => {
    navigate(`/player/${email}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Players</h1>

      <input
        type="text"
        placeholder="Search players by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md"
      />

      {filteredPlayers.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <ul>
          {filteredPlayers.map((player) => {
            const lastGame = getLastGame(player.email);

            return (
              <li
                key={player.email}
                onClick={() => onPlayerClick(player.email)}
                style={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px"
                }}
              >
                <strong>{player.name}</strong> ({player.email})<br />
                Last Game:{" "}
                {lastGame ? (
                  <>
                    <span>{new Date(lastGame.date).toLocaleDateString()}</span>{" "}
                    - <span>{lastGame.result || "Result N/A"}</span>
                  </>
                ) : (
                  <span>No games played yet</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Players;
