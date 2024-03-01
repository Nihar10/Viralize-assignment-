import React, { useState, useEffect } from "react";
import "./App.css";
import GameRankings from "./GameRankings";

function App() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayerGames, setSelectedPlayerGames] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerRatings, setSelectedPlayerRatings] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://lichess.org/api/tv/channels", {
          headers: {
            Authorization: "Bearer lip_4ffbyo0fRI4ncX47AU34",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch live games");
        }
        const data = await response.json();
        const gamesArray = Object.values(data);
        setGames(gamesArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching live games:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const fetchPlayerGames = async (username) => {
    try {
      const response = await fetch(
        `https://lichess.org/api/user/${username}/rating-history`,
        {
          headers: {
            Authorization: "Bearer lip_4ffbyo0fRI4ncX47AU34",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch player's games");
      }
      const data = await response.json();
      setSelectedPlayerRatings(data);
    } catch (error) {
      console.error(`Error fetching ${username}'s games:`, error);
      setError(error.message);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredGames = games.filter((game) => {
    const playerName = game.user.name.toLowerCase();
    return playerName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="title">Live Games</h1>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <input
        type="text"
        className="search-input"
        placeholder="Search by player's name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="game-list">
        {filteredGames.map((game, index) => (
          <li key={index} className="game-item">
            <strong>Game ID: {game.gameId}</strong>
            <p>Player: {game.user.name}</p>
            <p>Status: {game.color}</p>
            <button
              onClick={() => {
                fetchPlayerGames(game.user.name);
                setSelectedPlayer(game.user.name);
              }}
            >
              Get Player’s Games
            </button>
          </li>
        ))}
      </ul>

      {selectedPlayer && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedPlayer(null)}>
              ×
            </span>
            <h2>{selectedPlayer}'s Rating History</h2>
            <GameRankings ratings={selectedPlayerRatings} />
          </div>
        </div>
      )}

      {loading && <div className="loader">Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default App;
