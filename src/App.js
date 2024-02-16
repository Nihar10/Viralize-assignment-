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
        const playerNames = game.user.name.toLowerCase();
        return playerNames.includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="App">
            <h1>Live Games</h1>
            <input
                type="text"
                placeholder="Search by player's name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredGames.map((game, index) => (
                    <li key={index}>
                        <strong>Game ID: {game.gameId}</strong>
                        <ul>
                            <li>
                                Player: {game.user.name}, Status: {game.color}
                            </li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
