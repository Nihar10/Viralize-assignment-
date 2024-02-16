// App.js

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(
                    "https://lichess.org/api/tv/channels",
                    {
                        headers: {
                            Authorization: "Bearer lip_ty6IlivtURd1PB7rkHRu",
                        },
                    }
                );
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

    const filteredGames = games.filter((game) => {
        const playerName = game.user.name.toLowerCase();
        return playerName.includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div className="loader">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1 className="title">Live Games</h1>
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
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
