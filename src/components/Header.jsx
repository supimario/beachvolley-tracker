import React from "react";

function Header({ loggedInUser, logout }) {
  return (
    <header className="bg-orange-300 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🏆 Beachvolley Tracker</h1>
      <div className="flex items-center space-x-4">
        {loggedInUser ? (
          <>
            <span>Welcome, {loggedInUser.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
