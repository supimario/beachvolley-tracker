import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ navigate, loggedInUser }) {
  return (
    <nav className="flex justify-around bg-blue-600 text-white p-4 rounded-b-2xl shadow-md">
      <NavLink to="/" className="hover:underline">
        Home
      </NavLink>
      <NavLink to="/add" className="hover:underline">
        Games
      </NavLink>
      <NavLink to="/players" className="hover:underline">
        Players
      </NavLink>
      <NavLink to="/blog" className="hover:underline">
        Blog
      </NavLink>
      <NavLink to="/stats" className="hover:underline">
        Stats
      </NavLink>
      <NavLink to="/profile" className="hover:underline">
        Profile
      </NavLink>
      <NavLink to="/settings" className="hover:underline">
        Settings
      </NavLink>
    </nav>
  );
}

export default NavBar;
