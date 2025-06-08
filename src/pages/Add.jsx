// Add.jsx
import React from "react";
import GameForm from "../components/GameForm";
import GameList from "../components/GameList";

function Add({ players, games, addGame, deleteGame }) {
  return (
    <div>
      <GameForm players={players} addGame={addGame} />
      <GameList games={games} onEditGame={() => {}} onDeleteGame={deleteGame} />
    </div>
  );
}

export default Add;
