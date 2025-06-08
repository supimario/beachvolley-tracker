import React, { useState } from "react";

function GameList({ games, onEditGame, onDeleteGame }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedGame, setEditedGame] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // NEW: track the actual game ID

  const countSetWins = (sets) => {
    let team1Wins = 0;
    let team2Wins = 0;
    sets.forEach(({ team1, team2 }) => {
      if (team1 > team2) team1Wins++;
      else if (team2 > team1) team2Wins++;
    });
    return { team1Wins, team2Wins };
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedGame(JSON.parse(JSON.stringify(games[index])));
  };

  const handleInputChange = (value, setIndex, teamKey) => {
    const updated = { ...editedGame };
    updated.sets[setIndex][teamKey] = Number(value);
    setEditedGame(updated);
  };

  const saveEdit = () => {
    onEditGame(editedGame, editingIndex);
    setEditingIndex(null);
    setEditedGame(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedGame(null);
  };

  const confirmDelete = (index, id) => {
    setDeleteIndex(index);
    setDeleteId(id); // NEW: store the game ID too
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
    setDeleteId(null); // NEW: reset game ID
  };

  const handleDelete = () => {
    onDeleteGame(deleteId); // FIXED: use ID instead of index-based lookup
    setDeleteIndex(null);
    setDeleteId(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Games Played</h2>
      {games.length === 0 ? (
        <p className="text-center text-gray-600">No games recorded yet.</p>
      ) : (
        games.map((game, index) => {
          const isEditing = editingIndex === index;
          const currentGame = isEditing ? editedGame : game;
          const { team1Wins, team2Wins } = countSetWins(currentGame.sets);
          const winner =
            team1Wins > team2Wins
              ? "Team 1"
              : team2Wins > team1Wins
              ? "Team 2"
              : "Draw";

          return (
            <div key={index} className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(currentGame.date).toLocaleDateString()}
                </div>
                <div className="italic text-sm text-gray-600">
                  Added by: {currentGame.addedBy}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Team 1</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {currentGame.teams[0].map((player, i) => (
                      <li key={i}>{player}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Team 2</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {currentGame.teams[1].map((player, i) => (
                      <li key={i}>{player}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Set Scores</h4>
                <div className="grid grid-cols-4 gap-4 text-center font-mono text-lg">
                  <div>Set</div>
                  <div className="text-blue-700">Team 1</div>
                  <div>-</div>
                  <div className="text-red-700">Team 2</div>
                </div>

                {currentGame.sets.map((set, i) => {
                  const team1Won = set.team1 > set.team2;
                  const team2Won = set.team2 > set.team1;

                  return (
                    <div
                      key={i}
                      className={`grid grid-cols-4 gap-4 text-center py-1 ${
                        i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      }`}
                    >
                      <div>#{i + 1}</div>
                      <div>
                        {isEditing ? (
                          <input
                            type="number"
                            value={set.team1}
                            onChange={(e) =>
                              handleInputChange(e.target.value, i, "team1")
                            }
                            className="w-12 text-center border rounded"
                          />
                        ) : (
                          <span
                            className={
                              team1Won ? "font-bold text-green-600" : ""
                            }
                          >
                            {set.team1}
                          </span>
                        )}
                      </div>
                      <div>-</div>
                      <div>
                        {isEditing ? (
                          <input
                            type="number"
                            value={set.team2}
                            onChange={(e) =>
                              handleInputChange(e.target.value, i, "team2")
                            }
                            className="w-12 text-center border rounded"
                          />
                        ) : (
                          <span
                            className={
                              team2Won ? "font-bold text-green-600" : ""
                            }
                          >
                            {set.team2}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 font-semibold">
                Winner:{" "}
                <span
                  className={
                    winner === "Team 1"
                      ? "text-blue-700"
                      : winner === "Team 2"
                      ? "text-red-700"
                      : "text-gray-600"
                  }
                >
                  {winner}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 text-white bg-green-600 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 text-white bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(index)}
                      className="px-3 py-1 text-white bg-blue-600 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(index, game.id)}
                      className="px-3 py-1 text-white bg-red-600 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {deleteIndex === index && (
                <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded">
                  <p className="text-sm font-semibold text-red-700 mb-2">
                    Are you sure you want to delete this game?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 text-white bg-red-700 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="px-3 py-1 text-white bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default GameList;
