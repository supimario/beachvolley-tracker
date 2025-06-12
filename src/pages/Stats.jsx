import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

function Stats({ players = [], games = [] }) {
  const [primaryPlayer, setPrimary] = useState("");
  const [comparePlayer, setCompare] = useState("");
  const seasons = useMemo(
    () => Array.from(new Set(games.map(g => new Date(g.date).getFullYear()))).sort(),
    [games]
  );
  const [season, setSeason] = useState(seasons[0] || new Date().getFullYear());

  const seasonGames = useMemo(
    () => games.filter(g => new Date(g.date).getFullYear() === season),
    [games, season]
  );

  const compute = (email) => {
    const relevant = seasonGames.filter(g =>
      g.team1.some(p => p.email === email) || g.team2.some(p => p.email === email)
    );
    let wins = 0, losses = 0, pf = 0, pa = 0;
    const teammate = {}, opponent = {};
    const byMonth = {};

    relevant.forEach(g => {
      const isT1 = g.team1.some(p => p.email === email);
      const myTeam = isT1 ? g.team1 : g.team2;
      const oppTeam = isT1 ? g.team2 : g.team1;
      const myScore = isT1 ? g.score1 : g.score2;
      const oppScore = isT1 ? g.score2 : g.score1;

      if (myScore > oppScore) wins++; else losses++;
      pf += myScore; pa += oppScore;

      myTeam.forEach(p => {
        if (p.email !== email) {
          teammate[p.email] = (teammate[p.email] || 0) + (myScore > oppScore ? 1 : 0);
        }
      });
      oppTeam.forEach(p => {
        opponent[p.email] = (opponent[p.email] || 0) + 1;
      });

      const m = new Date(g.date).getMonth();
      byMonth[m] = (byMonth[m] || 0) + 1;
    });

    const bestMate = Object.entries(teammate).sort((a,b)=>b[1]-a[1])[0] || [];
    const chart = Object.entries(byMonth).map(([m,c]) => ({ month: parseInt(m)+1, games: c }));

    return {
      total: wins+losses, wins, losses,
      winRate: total?((wins/(wins+losses))*100).toFixed(1):0,
      pf, pa,
      bestMateEmail: bestMate[0], bestMateWins: bestMate[1],
      opponentCount: opponent,
      chart,
    };
  };

  const p1Stats = primaryPlayer ? compute(primaryPlayer) : null;
  const p2Stats = comparePlayer ? compute(comparePlayer) : null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <select value={season} onChange={e=>setSeason(+e.target.value)}>
          {seasons.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {[primaryPlayer, comparePlayer].map((sel, idx) => (
          <select key={idx} value={sel} onChange={e=>idx?setCompare(e.target.value):setPrimary(e.target.value)}>
            <option value="">Select player...</option>
            {players.map(p => <option key={p.email} value={p.email}>{p.name}</option>)}
          </select>
        ))}
      </div>

      {/* Summary Charts */}
      {[{stats:p1Stats, name:"Primary"}, {stats:p2Stats, name:"Compare"}].map((u, i) => u.stats && (
        <div key={i} className="p-4 border rounded">
          <h2>{i? "Comparison":"Player"}: {players.find(p=>p.email==(i?comparePlayer:primaryPlayer))?.name}</h2>
          <p>Games: {u.stats.total}</p>
          <p>Wins/Losses: {u.stats.wins}/{u.stats.losses}</p>
          <p>Win Rate: {u.stats.winRate}%</p>
          <p>Points For/Against: {u.stats.pf}/{u.stats.pa}</p>

          {/* Best Teammate */}
          {u.stats.bestMateEmail && (
            <p>Best teammate: {players.find(p=>p.email===u.stats.bestMateEmail)?.name} ({u.stats.bestMateWins} wins)</p>
          )}

          {/* Month Chart */}
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={u.stats.chart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="games" stroke={i?"#f59e0b":"#3b82f6"} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      {/* Comparison Table if both players selected */}
      {p1Stats && p2Stats && (
        <div className="p-4 border rounded">
          <h3>Head-to-Head</h3>
          <p>{players.find(p=>p.email===primaryPlayer).name} played { (p1Stats.opponentCount[comparePlayer]||0)} games vs {players.find(p=>p.email===comparePlayer)?.name}</p>
        </div>
      )}
    </div>
  );
}

export default Stats;
