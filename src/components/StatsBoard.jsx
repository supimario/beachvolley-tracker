import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Stats({ players, games }) {
  const [selectedPlayer, setSelectedPlayer] = useState("all");

  const seasons = useMemo(() => {
    const years = new Set(games.map((g) => new Date(g.date).getFullYear()));
    return Array.from(years).sort();
  }, [games]);
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear());

  const filteredGames = useMemo(() => {
    return games.filter((g) => new Date(g.date).getFullYear() === parseInt(selectedSeason));
  }, [games, selectedSeason]);

  const computeStats = (playerEmail) => {
    let wins = 0, losses = 0, pointsFor = 0, pointsAgainst = 0;
    const teammateStats = {};

    filteredGames.forEach((game) => {
      const isPlayer = game.team1.some(p => p.email === playerEmail) || game.team2.some(p => p.email === playerEmail);
      if (!isPlayer) return;

      const isTeam1 = game.team1.some(p => p.email === playerEmail);
      const myTeam = isTeam1 ? game.team1 : game.team2;
      const otherTeam = isTeam1 ? game.team2 : game.team1;
      const myPoints = isTeam1 ? game.score1 : game.score2;
      const oppPoints = isTeam1 ? game.score2 : game.score1;

      if (myPoints > oppPoints) wins++; else losses++;
      pointsFor += myPoints;
      pointsAgainst += oppPoints;

      myTeam.forEach(p => {
        if (p.email !== playerEmail) {
          teammateStats[p.email] = (teammateStats[p.email] || 0) + (myPoints > oppPoints ? 1 : 0);
        }
      });
    });

    return {
      wins,
      losses,
      totalGames: wins + losses,
      pointsFor,
      pointsAgainst,
      winRate: ((wins / (wins + losses)) * 100).toFixed(1),
      teammateStats,
    };
  };

  const playerOptions = [
    <option key="all" value="all">All Players</option>,
    ...players.map(p => <option key={p.email} value={p.email}>{p.name}</option>)
  ];

  const seasonOptions = seasons.map((year) => (
    <option key={year} value={year}>{year}</option>
  ));

  const selectedStats = selectedPlayer === "all" ? null : computeStats(selectedPlayer);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div>
          <label className="font-bold">Season:</label>
          <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="ml-2 border rounded px-2 py-1">
            {seasonOptions}
          </select>
        </div>
        <div>
          <label className="font-bold">Player:</label>
          <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="ml-2 border rounded px-2 py-1">
            {playerOptions}
          </select>
        </div>
      </div>

      {selectedPlayer !== "all" && selectedStats && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Stats for {players.find(p => p.email === selectedPlayer)?.name}</h2>
          <p>Total Games: {selectedStats.totalGames}</p>
          <p>Wins: {selectedStats.wins}</p>
          <p>Losses: {selectedStats.losses}</p>
          <p>Win Rate: {selectedStats.winRate}%</p>
          <p>Points For: {selectedStats.pointsFor}</p>
          <p>Points Against: {selectedStats.pointsAgainst}</p>

          <h3 className="font-semibold mt-4">Win Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{ name: "Wins", value: selectedStats.wins }, { name: "Losses", value: selectedStats.losses }]}> 
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {Object.keys(selectedStats.teammateStats).length > 0 && (
            <>
              <h3 className="font-semibold mt-4">Top Teammates by Wins</h3>
              <ul className="list-disc list-inside">
                {Object.entries(selectedStats.teammateStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([email, wins]) => {
                    const teammate = players.find(p => p.email === email);
                    return <li key={email}>{teammate?.name || email}: {wins} wins</li>;
                  })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Stats;
