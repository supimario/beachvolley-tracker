import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Players", path: "/players" },
    { label: "Blog", path: "/blog" },
    { label: "My Profile", path: "/profile" },
    { label: "Stats", path: "/stats" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <ul className="flex justify-center space-x-6 p-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => navigate(item.path)}
              className="text-blue-700 hover:text-blue-900 font-semibold"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
