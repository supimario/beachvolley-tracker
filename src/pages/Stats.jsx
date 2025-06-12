import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from "recharts";

export default function Stats({ games }) {
  const [showCurrentSeason, setShowCurrentSeason] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const isCurrentSeason = (dateStr) =>
    new Date(dateStr).getFullYear() === new Date().getFullYear();

  const filteredGames = useMemo(
    () => games.filter(g => !showCurrentSeason || isCurrentSeason(g.date)),
    [games, showCurrentSeason]
  );

  const allPlayers = useMemo(() => {
    const setP = new Set();
    filteredGames.forEach(g => g.teams.flat().forEach(p => setP.add(p)));
    return Array.from(setP);
  }, [filteredGames]);

  const playerStats = useMemo(() => {
    const s = {};
    allPlayers.forEach(p => {
      s[p] = { wins: 0, losses: 0, setsWon: 0, setsLost: 0, teammates: {} };
    });
    filteredGames.forEach(g => {
      const [t1, t2] = g.teams;
      let t1s = 0, t2s = 0;
      g.sets.forEach(o => {
        if (o.team1 > o.team2) t1s++;
        if (o.team2 > o.team1) t2s++;
      });
      const t1won = t1s > t2s, t2won = t2s > t1s;
      t1.forEach(p => {
        s[p].setsWon += t1s; s[p].setsLost += t2s;
        if (t1won) s[p].wins++; else if (t2won) s[p].losses++;
        t1.forEach(mate => {
          if (mate !== p) s[p].teammates[mate] = (s[p].teammates[mate] || 0) + 1;
        });
      });
      t2.forEach(p => {
        s[p].setsWon += t2s; s[p].setsLost += t1s;
        if (t2won) s[p].wins++; else if (t1won) s[p].losses++;
        t2.forEach(mate => {
          if (mate !== p) s[p].teammates[mate] = (s[p].teammates[mate] || 0) + 1;
        });
      });
    });
    return s;
  }, [filteredGames, allPlayers]);

  const comboData = useMemo(() =>
    Object.entries(
      filteredGames.reduce((acc, g) => {
        const key = `${g.teams[0].length}v${g.teams[1].length}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    ).map(([combo, games]) => ({ combo, games })),
    [filteredGames]
  );

  const winsData = useMemo(() =>
    Object.entries(playerStats).map(([name, st]) => ({
      name, Wins: st.wins
    })),
    [playerStats]
  );

  const lossesData = useMemo(() =>
    Object.entries(playerStats).map(([name, st]) => ({
      name, Losses: st.losses
    })),
    [playerStats]
  );

  const setsData = useMemo(() =>
    Object.entries(playerStats).map(([name, st]) => ({
      name, "Sets Won": st.setsWon, "Sets Lost": st.setsLost
    })),
    [playerStats]
  );

  const winRateData = useMemo(() =>
    Object.entries(playerStats).map(([name, st]) => {
      const total = st.wins + st.losses;
      const winRate = total > 0 ? ((st.wins / total) * 100).toFixed(1) : "0.0";
      return { name, "Win %": parseFloat(winRate) };
    }),
    [playerStats]
  );

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold">Statistics</h2>

      <label>
        <input
          type="checkbox"
          checked={showCurrentSeason}
          onChange={() => setShowCurrentSeason(v => !v)}
        />
        <span className="ml-2">Show Only Current Season</span>
      </label>

      <label className="block mt-4">
        Player vs Player:
        <select
          value={selectedPlayers.join(",")}
          onChange={(e) => {
            const [p1, p2] = e.target.value.split(",");
            setSelectedPlayers([p1, p2]);
          }}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value="">-- Select Two Players --</option>
          {allPlayers.flatMap((p1) =>
            allPlayers.filter((p2) => p2 !== p1).map((p2) => (
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
              .filter((g) =>
                g.teams.flat().includes(selectedPlayers[0]) &&
                g.teams.flat().includes(selectedPlayers[1])
              )
              .map((g) => (
                <li key={g.id}>
                  {g.date}: {g.teams[0].join(", ")} vs {g.teams[1].join(", ")} – Sets: {g.sets.map(s => `${s.team1}-${s.team2}`).join(", ")}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Team combo usage */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Team Combinations Played</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comboData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="combo" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="games" name="Games" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wins, Losses, Win % */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Wins by Player</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={winsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Wins" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Losses by Player</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lossesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Losses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Win Rate %</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={winRateData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Win %" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sets Won vs Lost */}
      <div>
        <h3 className="text-lg font-semibold">Sets Won / Lost by Player</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={setsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sets Won" fill="#3B82F6" />
            <Bar dataKey="Sets Lost" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Player Summary List */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Player Stats Table</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-1 text-left">Player</th>
              <th className="px-2 py-1">Wins</th>
              <th className="px-2 py-1">Losses</th>
              <th className="px-2 py-1">Win %</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(playerStats).map(([name, st]) => {
              const total = st.wins + st.losses;
              const winRate = total > 0 ? ((st.wins / total) * 100).toFixed(1) : "0.0";
              return (
                <tr key={name} className="border-t">
                  <td className="px-2 py-1">{name}</td>
                  <td className="px-2 py-1 text-center">{st.wins}</td>
                  <td className="px-2 py-1 text-center">{st.losses}</td>
                  <td className="px-2 py-1 text-center">{winRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
