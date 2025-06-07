import React from 'react';
import GameForm from '../components/GameForm';
import GameList from '../components/GameList';

const Add = ({ players, games, addGame, deleteGame }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Game</h1>
      <GameForm players={players} addGame={addGame} />
      <hr className="my-6" />
      <GameList games={games} players={players} deleteGame={deleteGame} />
    </div>
  );
};

export default Add;
