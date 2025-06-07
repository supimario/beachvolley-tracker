import React from "react";

function GameList({ games }) {
  // Helper to count sets won by each team
  const countSetWins = (sets) => {
    let team1Wins = 0;
    let team2Wins = 0;
    sets.forEach(({ team1, team2 }) => {
      if (team1 > team2) team1Wins++;
      else if (team2 > team1) team2Wins++;
    });
    return { team1Wins, team2Wins };
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Games Played</h2>
      {games.length === 0 ? (
        <p className="text-center text-gray-600">No games recorded yet.</p>
      ) : (
        games.map((game, index) => {
          const { team1Wins, team2Wins } = countSetWins(game.sets);

          const winner =
            team1Wins > team2Wins
              ? "Team 1"
              : team2Wins > team1Wins
              ? "Team 2"
              : "Draw";

          return (
            <div
              key={index}
              className="bg-white p-4 rounded shadow border"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(game.date).toLocaleDateString()}
                </div>
                <div className="italic text-sm text-gray-600">
                  Added by: {game.addedBy}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Team 1</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {game.teams[0].map((player, i) => (
                      <li key={i}>{player}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Team 2</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {game.teams[1].map((player, i) => (
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
                {game.sets.map((set, i) => {
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
                      <div
                        className={
                          team1Won ? "font-bold text-green-600" : ""
                        }
                      >
                        {set.team1}
                      </div>
                      <div>-</div>
                      <div
                        className={
                          team2Won ? "font-bold text-green-600" : ""
                        }
                      >
                        {set.team2}
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
            </div>
          );
        })
      )}
    </div>
  );
}

export default GameList;


