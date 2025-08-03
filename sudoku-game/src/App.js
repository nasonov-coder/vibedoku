import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Sudoku } from './Game';
import { SudokuBoard } from './Board';
import './App.css';

// Create the boardgame.io client
const SudokuClient = Client({
  game: Sudoku,
  board: SudokuBoard,
  // Enable multiplayer - comment out for local play only
  // multiplayer: SocketIO({ server: 'localhost:8000' }),
});

function App() {
  const [showGame, setShowGame] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');

  if (!showGame) {
    return (
      <div className="app">
        <div className="welcome-screen">
          <h1>Sudoku</h1>
          <p>Challenge yourself with the classic number puzzle game!</p>
          
          <div className="difficulty-selection">
            <h2>Select Difficulty</h2>
            <div className="difficulty-options">
              <label>
                <input
                  type="radio"
                  value="easy"
                  checked={difficulty === 'easy'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Easy
                <span className="difficulty-description">35 cells removed</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="medium"
                  checked={difficulty === 'medium'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Medium
                <span className="difficulty-description">45 cells removed</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="hard"
                  checked={difficulty === 'hard'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Hard
                <span className="difficulty-description">55 cells removed</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="expert"
                  checked={difficulty === 'expert'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Expert
                <span className="difficulty-description">64 cells removed</span>
              </label>
            </div>
          </div>
          
          <button 
            className="start-button"
            onClick={() => setShowGame(true)}
          >
            Start Game
          </button>
          
          <div className="how-to-play">
            <h3>How to Play</h3>
            <ul>
              <li>Fill the grid so that every row, column, and 3x3 box contains the digits 1-9</li>
              <li>Click a cell to select it, then click a number or use keyboard</li>
              <li>Use Notes mode to pencil in possibilities</li>
              <li>You have 3 hints to help you when stuck</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <SudokuClient 
        gameID="sudoku-game" 
        setupData={{ difficulty }}
      />
    </div>
  );
}

export default App;