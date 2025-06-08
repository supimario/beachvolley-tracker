import React from "react";
import GameForm from "../components/GameForm";
import GameList from "../components/GameList";

export default function Games({ players, addGame, games, setGames, loggedInUser }) {
  const handleDeleteGame = (idToDelete) => {
    const updatedGames = games.filter((game) => game.id !== idToDelete);
    setGames(updatedGames);
  };

  return (
    <div>
      {loggedInUser ? (
        <>
          <GameForm players={players} addGame={addGame} loggedInUser={loggedInUser} />
          <GameList games={games} onDeleteGame={handleDeleteGame} />
        </>
      ) : (
        <p className="text-center text-red-700">Please log in to add/view games.</p>
      )}
    </div>
  );
}
