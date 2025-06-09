import React from "react";
import { usePlayer } from "../contexts/PlayerContext";
import EventCalendar from "../components/EventCalendar";

function Home() {
  const { player } = usePlayer();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Beachvolley Tracker</h1>

      {player ? (
        <p className="mb-4">Logged in as: <strong>{player.name}</strong></p>
      ) : (
        <p className="mb-4 text-gray-600">You are not logged in.</p>
      )}

      <img
        src="/beachvolley-sunset.jpg"
        alt="Beach Volleyball Sunset"
        className="w-full h-auto rounded shadow mb-6"
      />

      <EventCalendar />
    </div>
  );
}

export default Home;
