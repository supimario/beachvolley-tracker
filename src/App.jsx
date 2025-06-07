// App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import PlayerSignup from "./pages/PlayerSignup";
import LoginForm from "./components/LoginForm";
import GameForm from "./components/GameForm";
import GameList from "./components/GameList";
import Add from "./pages/Add";
import Players from "./pages/Players";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import PlayerProfile from "./pages/PlayerProfile";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import WithBackButton from "./components/WithBackButton";
import { Routes, Route, useNavigate } from "react-router-dom";

function App({ currentPath }) {
  const navigate = useNavigate();

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : [];
  });
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem("games");
    return saved ? JSON.parse(saved) : [];
  });
  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem("blogPosts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  }, [loggedInUser]);

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  }, [blogPosts]);

  const registerPlayer = (player) => {
    if (players.some((p) => p.email.toLowerCase() === player.email.toLowerCase())) {
      alert("Email already registered");
      return false;
    }
    setPlayers((prev) => [...prev, player]);
    setLoggedInUser(player);
    navigate("/");
    return true;
  };

  const loginPlayer = (email, password) => {
    const user = players.find(
      (p) => p.email.toLowerCase() === email.toLowerCase() && p.password === password
    );
    if (user) {
      setLoggedInUser(user);
      navigate("/");
      return true;
    } else {
      alert("Invalid credentials.");
      return false;
    }
  };

  const logout = () => {
    setLoggedInUser(null);
    navigate("/login");
  };

  const addGame = (newGame) => {
    setGames((prev) => [...prev, newGame]);
  };

  const addBlogPost = (newPost) => {
    setBlogPosts((prev) => [newPost, ...prev]);
  };
  
  const [games, setGames] = useState([...]); // existing line

function deleteGame(id) => {
  setGames((prevGames) => prevGames.filter((game) => game.id !== id));
  };

  const deleteBlogPost = (postId) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  if (!loggedInUser && currentPath !== "/signup") {
    return <LoginForm loginPlayer={loginPlayer} navigate={navigate} />;
  }

  return (
    <div className="App">
      <Header loggedInUser={loggedInUser} logout={logout} />
      {loggedInUser && <NavBar navigate={navigate} loggedInUser={loggedInUser} />}
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <GameForm players={players} addGame={addGame} loggedInUser={loggedInUser} />
                <GameList games={games} />
              </>
            }
          />
          <Route path="/signup" element={<PlayerSignup registerPlayer={registerPlayer} navigate={navigate} />} />
          <Route
            path="/players"
            element={
              <WithBackButton>
                <Players players={players} games={games} navigate={navigate} />
              </WithBackButton>
            }
          />
          <Route
            path="/player/:email"
            element={
              <WithBackButton>
                <PlayerProfile players={players} games={games} />
              </WithBackButton>
            }
          />
          <Route
            path="/blog"
            element={
              <WithBackButton>
                <Blog blogPosts={blogPosts} addBlogPost={addBlogPost} deleteBlogPost={deleteBlogPost} loggedInUser={loggedInUser} />
              </WithBackButton>
            }
          />
          <Route
            path="/profile"
            element={
              <WithBackButton>
                <Profile loggedInUser={loggedInUser} players={players} games={games} navigate={navigate} />
              </WithBackButton>
            }
          />
          <Route
            path="/stats"
            element={
              <WithBackButton>
                <Stats players={players} games={games} />
              </WithBackButton>
            }
          />
          <Route
            path="/settings"
            element={
              <WithBackButton>
                <Settings loggedInUser={loggedInUser} players={players} setPlayers={setPlayers} setLoggedInUser={setLoggedInUser} />
              </WithBackButton>
            }
          />
          <Route
             path="/add"
            element={
             <WithBackButton>
             <Add players={players} games={games} addGame={addGame} deleteGame={deleteGame} />
             </WithBackButton>
            }
          />

        </Routes>
      </main>
    </div>
  );
}

export default App;
