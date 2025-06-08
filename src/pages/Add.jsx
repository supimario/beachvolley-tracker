import React from "react";
import GameForm from "../components/GameForm";
import GameList from "../components/GameList";

function Add({ players, games, addGame, deleteGame, onEditGame }) {
  return (
    <div className="space-y-8">
      <GameForm players={players} addGame={addGame} />
      <GameList games={games} deleteGame={deleteGame} onEditGame={onEditGame} />
    </div>
  );
}

export default Add;
