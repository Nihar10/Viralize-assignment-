import React from "react";

function GameRankings({ gameData }) {
  return (
    <div>
      <h2>Game Rankings</h2>
      {gameData.map((gameType, index) => (
        <div key={index}>
          <h3>{gameType.name}</h3>
          <ul>
            {gameType.points.map((point, idx) => (
              <li key={idx}>
                {`${point[1]}/${point[2]}/${point[0]} - ${point[3]} points`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default GameRankings;
