import React, { useMemo, useState } from "react";

export default function Stats({ games, loggedInUser }) {
  const [showCurrentSeason, setShowCurrentSeason] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const isCurrentSeason = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
  };

  const filteredGames = useMemo(
    () => games.filter((g) => !showCurrentSeason || isCurrentSeason(g.date)),
    [games, showCurrentSeason]
  );

  const allPlayers = useMemo(() => {
    const players = new Set();
    filteredGames.forEach((g) => {
      g.teams.flat().forEach((p) => players.add(p));
    });
    return Array.from(players);
  }, [filteredGames]);

  const playerStats = useMemo(() => {
    const stats = {};
    allPlayers.forEach((p) => {
      stats[p] = { wins: 0, losses: 0, setsWon: 0, setsLost: 0, teammates: {} };
    });

    filteredGames.forEach((g) => {
      const [team1, team2] = g.teams;
      let team1Sets = 0,
        team2Sets = 0;
      g.sets.forEach((s) => {
        if (s.team1 > s.team2) team1Sets++;
        else if (s.team2 > s.team1) team2Sets++;
      });

      const team1Won = team1Sets > team2Sets;
      const team2Won = team2Sets > team1Sets;

      team1.forEach((p) => {
        if (!stats[p]) return;
        stats[p].setsWon += team1Sets;
        stats[p].setsLost += team2Sets;
        if (team1Won) stats[p].wins++;
        else if (team2Won) stats[p].losses++;
        team1.forEach((mate) => {
          if (mate !== p) {
            stats[p].teammates[mate] = (stats[p].teammates[mate] || 0) + 1;
          }
        });
      });

      team2.forEach((p) => {
        if (!stats[p]) return;
        stats[p].setsWon += team2Sets;
        stats[p].setsLost += team1Sets;
        if (team2Won) stats[p].wins++;
        else if (team1Won) stats[p].losses++;
        team2.forEach((mate) => {
          if (mate !== p) {
            stats[p].teammates[mate] = (stats[p].teammates[mate] || 0) + 1;
          }
        });
      });
    });

    return stats;
  }, [filteredGames, allPlayers]);

  const mostUsedTeamCombo = useMemo(() => {
    const comboCounts = {};
    filteredGames.forEach((g) => {
      const combo = `${g.teams[0].length}v${g.teams[1].length}`;
      comboCounts[combo] = (comboCounts[combo] || 0) + 1;
    });
    return Object.entries(comboCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [filteredGames]);

  const totalGames = filteredGames.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>

      <label className="block mb-4">
        <input
          type="checkbox"
          checked={showCurrentSeason}
          onChange={() => setShowCurrentSeason((prev) => !prev)}
        />
        <span className="ml-2">Show Only Current Season</span>
      </label>

      <label className="block mt-4">
        Player vs Player:
        <select
          value={selectedPlayers.join(",")}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              setSelectedPlayers([]);
              return;
            }
            const [p1, p2] = val.split(",");
            setSelectedPlayers([p1, p2]);
          }}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value="">-- Select Two Players --</option>
          {allPlayers.flatMap((p1, i) =>
            allPlayers.slice(i + 1).map((p2) => (
              <option key={`${p1}-${p2}`} value={`${p1},${p2}`}>
                {p1} vs {p2}
              </option>
            ))
          )}
        </select>
      </label>

      {selectedPlayers.length === 2 && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h3 className="font-semibold mb-2">
            Head to Head: {selectedPlayers[0]} vs {selectedPlayers[1]}
          </h3>
          <ul className="list-disc list-inside">
            {filteredGames
              .filter(
                (g) =>
                  g.teams.flat().includes(selectedPlayers[0]) &&
                  g.teams.flat().includes(selectedPlayers[1])
              )
              .map((g) => (
                <li key={g.id}>
                  {g.date}: {g.teams[0].join(", ")} vs{" "}
                  {g.teams[1].join(", ")} – Sets:{" "}
                  {g.sets.map((s) => `${s.team1}-${s.team2}`).join(", ")}
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-2">General Stats</h3>
        <p>Total Games: {totalGames}</p>
        <p>Most Used Team Combination: {mostUsedTeamCombo || "N/A"}</p>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-2">Players</h3>
        {allPlayers.map((p) => (
          <div key={p} className="border-b py-2">
            <h4 className="font-semibold">{p}</h4>
            <p>
              Wins: {playerStats[p].wins}, Losses: {playerStats[p].losses},
              Sets: {playerStats[p].setsWon}–{playerStats[p].setsLost}
            </p>
            <p>
              Frequent Teammates:{" "}
              {Object.entries(playerStats[p].teammates)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([mate, count]) => `${mate} (${count})`)
                .join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
