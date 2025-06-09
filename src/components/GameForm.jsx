import React, { useState } from "react";

const teamOptions = [
  "2v2",
  "2v3",
  "3v3",
  "3v4",
  "4v4",
  "4v5",
  "5v5",
  "5v6",
  "6v6",
];

// Helper: get number of players per team from option string
const getTeamSizes = (option) => {
  const parts = option.split("v");
  return [+parts[0], +parts[1]];
};

export default function GameForm({ players, addGame, loggedInUser }) {
  const [teamCombo, setTeamCombo] = useState(teamOptions[0]);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [manualTeam1, setManualTeam1] = useState([]);
  const [manualTeam2, setManualTeam2] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sets, setSets] = useState([
    { team1: 0, team2: 0 },
    { team1: 0, team2: 0 },
    { team1: 0, team2: 0 },
  ]);

  React.useEffect(() => {
    const [t1, t2] = getTeamSizes(teamCombo);
    setManualTeam1(Array(t1).fill(""));
    setManualTeam2(Array(t2).fill(""));
    setTeam1Players(Array(t1).fill(""));
    setTeam2Players(Array(t2).fill(""));
  }, [teamCombo]);

  const handlePlayerSelect = (team, idx, val) => {
    if (team === 1) {
      const newArr = [...team1Players];
      newArr[idx] = val;
      setTeam1Players(newArr);
    } else {
      const newArr = [...team2Players];
      newArr[idx] = val;
      setTeam2Players(newArr);
    }
  };

  const handleManualChange = (team, idx, val) => {
    if (team === 1) {
      const newArr = [...manualTeam1];
      newArr[idx] = val;
      setManualTeam1(newArr);
    } else {
      const newArr = [...manualTeam2];
      newArr[idx] = val;
      setManualTeam2(newArr);
    }
  };

  const handleSetScoreChange = (setIdx, team, val) => {
    const newSets = [...sets];
    newSets[setIdx][team === 1 ? "team1" : "team2"] = Number(val);
    setSets(newSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [t1Count, t2Count] = getTeamSizes(teamCombo);

    for (let i = 0; i < t1Count; i++) {
      if (!team1Players[i] && manualTeam1[i].trim() === "") {
        alert(`Please enter or select player #${i + 1} for Team 1`);
        return;
      }
    }
    for (let i = 0; i < t2Count; i++) {
      if (!team2Players[i] && manualTeam2[i].trim() === "") {
        alert(`Please enter or select player #${i + 1} for Team 2`);
        return;
      }
    }

    const team1Final = team1Players.map((p, i) => manualTeam1[i].trim() || p);
    const team2Final = team2Players.map((p, i) => manualTeam2[i].trim() || p);

    if (team1Final.some((p) => !p)) {
      alert("All Team 1 players must have a name");
      return;
    }
    if (team2Final.some((p) => !p)) {
      alert("All Team 2 players must have a name");
      return;
    }

    let team1SetsWon = 0,
      team2SetsWon = 0;
    for (const set of sets) {
      if (set.team1 === 0 && set.team2 === 0) continue;
      if (set.team1 === set.team2) {
        alert("Set scores cannot be tied");
        return;
      }
      if (set.team1 > set.team2) team1SetsWon++;
      else team2SetsWon++;
    }
    if (team1SetsWon < 2 && team2SetsWon < 2) {
      alert("A team must win at least 2 sets to win the game");
      return;
    }

    const filteredSets = sets.filter(
      (set) => set.team1 !== 0 || set.team2 !== 0
    );

    const newGame = {
      id: Date.now(), // ✅ Unique ID to avoid deleting all games by date
      date,
      teams: [team1Final, team2Final],
      sets: filteredSets,
      addedBy: loggedInUser?.name || "Unknown",
      playerEmail: loggedInUser?.email || "unknown@example.com",
    };

    addGame(newGame);

    setTeamCombo(teamOptions[0]);
    setManualTeam1([]);
    setManualTeam2([]);
    setTeam1Players([]);
    setTeam2Players([]);
    setSets([
      { team1: 0, team2: 0 },
      { team1: 0, team2: 0 },
      { team1: 0, team2: 0 },
    ]);
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-4 bg-white rounded shadow max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Add New Game</h2>

      <label className="block mb-3">
        Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </label>

      <label className="block mb-3">
        Team Combination:
        <select
          className="ml-2 border rounded px-2 py-1"
          value={teamCombo}
          onChange={(e) => setTeamCombo(e.target.value)}
        >
          {teamOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-8 mb-4">
        <div>
          <h3 className="font-semibold mb-2 text-blue-700">Team 1 Players</h3>
          {team1Players.map((selected, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select
                value={selected || ""}
                onChange={(e) => handlePlayerSelect(1, i, e.target.value)}
                className="border rounded px-2 py-1 flex-grow"
              >
                <option value="">-- Select Player --</option>
                {players.map((p) => (
                  <option key={p.email} value={p.name}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or enter name"
                value={manualTeam1[i] || ""}
                onChange={(e) => handleManualChange(1, i, e.target.value)}
                className="border rounded px-2 py-1 flex-grow"
              />
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-red-700">Team 2 Players</h3>
          {team2Players.map((selected, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select
                value={selected || ""}
                onChange={(e) => handlePlayerSelect(2, i, e.target.value)}
                className="border rounded px-2 py-1 flex-grow"
              >
                <option value="">-- Select Player --</option>
                {players.map((p) => (
                  <option key={p.email} value={p.name}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or enter name"
                value={manualTeam2[i] || ""}
                onChange={(e) => handleManualChange(2, i, e.target.value)}
                className="border rounded px-2 py-1 flex-grow"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Set Scores (up to 3 sets)</h3>
        {[0, 1, 2].map((setIdx) => (
          <div key={setIdx} className="flex items-center gap-4 mb-2 max-w-sm">
            <span className="w-10 font-semibold">Set {setIdx + 1}</span>
            <input
              type="number"
              min={0}
              max={30}
              value={sets[setIdx].team1}
              onChange={(e) =>
                handleSetScoreChange(setIdx, 1, e.target.value)
              }
              className="w-16 border rounded px-2 py-1 text-center"
              required={setIdx === 0}
            />
            <span className="font-bold">-</span>
            <input
              type="number"
              min={0}
              max={30}
              value={sets[setIdx].team2}
              onChange={(e) =>
                handleSetScoreChange(setIdx, 2, e.target.value)
              }
              className="w-16 border rounded px-2 py-1 text-center"
              required={setIdx === 0}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
      >
        Add Game
      </button>
    </form>
  );
}
