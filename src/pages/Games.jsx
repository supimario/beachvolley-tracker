import React from "react";
import GameForm from "../components/GameForm";
import GameList from "../components/GameList";

export default function Games({ players, addGame, games, loggedInUser }) {
  return (
    <div>
      {loggedInUser ? (
        <>
          <GameForm players={players} addGame={addGame} loggedInUser={loggedInUser} />
          <GameList games={games} />
        </>
      ) : (
        <p className="text-center text-red-700">Please log in to add/view games.</p>
      )}
    </div>
  );
}
