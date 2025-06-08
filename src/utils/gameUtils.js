// src/utils/gameUtils.js

export const getGamesForPlayer = (games, playerEmail) => {
  return games
    .filter((game) =>
      game.teams.some((team) =>
        team.some((player) =>
          player.toLowerCase().includes(playerEmail.toLowerCase())
        )
      )
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
};
