import React, { useEffect, useState } from 'react';
import './Board.css';
import { getPossibleValues } from './sudokuGenerator';

export function SudokuBoard({ ctx, G, moves }) {
  const [timer, setTimer] = useState(0);
  
  useEffect(() => {
    // Handle keyboard input
    const handleKeyDown = (e) => {
      moves.handleKeyPress(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moves]);
  
  useEffect(() => {
    // Timer
    if (!G.endTime && !G.paused) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - G.startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [G.startTime, G.endTime, G.paused]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCellClass = (row, col) => {
    const classes = ['cell'];
    
    // Selected cell
    if (G.selectedCell?.row === row && G.selectedCell?.col === col) {
      classes.push('selected');
    }
    
    // Initial cells (given numbers)
    if (G.initialBoard[row][col] !== null) {
      classes.push('initial');
    }
    
    // Highlighted cells (same number)
    if (G.cells[row][col] !== null && G.cells[row][col] === G.highlightNumber) {
      classes.push('highlighted');
    }
    
    // Invalid cells
    if (G.cells[row][col] !== null && !isValidInCurrentPosition(G.cells, row, col)) {
      classes.push('invalid');
    }
    
    // Related cells (same row, column, or box)
    if (G.selectedCell) {
      const { row: selectedRow, col: selectedCol } = G.selectedCell;
      if (row === selectedRow || col === selectedCol) {
        classes.push('related');
      }
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const selectedBoxRow = Math.floor(selectedRow / 3);
      const selectedBoxCol = Math.floor(selectedCol / 3);
      if (boxRow === selectedBoxRow && boxCol === selectedBoxCol) {
        classes.push('related');
      }
    }
    
    // Box borders
    if (col % 3 === 2 && col !== 8) classes.push('box-right');
    if (row % 3 === 2 && row !== 8) classes.push('box-bottom');
    
    return classes.join(' ');
  };
  
  const renderCell = (row, col) => {
    const value = G.cells[row][col];
    const notes = G.notes[row][col];
    
    return (
      <div
        key={`${row}-${col}`}
        className={getCellClass(row, col)}
        onClick={() => moves.selectCell(row, col)}
      >
        {value !== null ? (
          <span className="value">{value}</span>
        ) : notes.size > 0 ? (
          <div className="notes">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <span key={num} className={notes.has(num) ? 'note' : ''}>
                {notes.has(num) ? num : ''}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  };
  
  const renderNumberPad = () => {
    return (
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const count = countNumberOccurrences(G.cells, num);
          const disabled = count >= 9;
          
          return (
            <button
              key={num}
              className={`number-button ${disabled ? 'disabled' : ''} ${G.highlightNumber === num ? 'highlighted' : ''}`}
              onClick={() => moves.placeNumber(num)}
              disabled={disabled}
            >
              <span className="number">{num}</span>
              <span className="count">{9 - count}</span>
            </button>
          );
        })}
      </div>
    );
  };
  
  if (G.paused) {
    return (
      <div className="game-container">
        <div className="paused-screen">
          <h2>Game Paused</h2>
          <button className="control-button" onClick={() => moves.togglePause()}>
            Resume
          </button>
        </div>
      </div>
    );
  }
  
  if (ctx.gameover) {
    return (
      <div className="game-container">
        <div className="game-over">
          <h2>Congratulations!</h2>
          <div className="stats">
            <p>Time: {ctx.gameover.time}</p>
            <p>Mistakes: {ctx.gameover.mistakes}</p>
            <p>Hints Used: {ctx.gameover.hintsUsed}</p>
            <p>Difficulty: {ctx.gameover.difficulty}</p>
            <p>Score: {ctx.gameover.score}</p>
          </div>
          <div className="difficulty-buttons">
            <button onClick={() => moves.newGame('easy')}>New Easy Game</button>
            <button onClick={() => moves.newGame('medium')}>New Medium Game</button>
            <button onClick={() => moves.newGame('hard')}>New Hard Game</button>
            <button onClick={() => moves.newGame('expert')}>New Expert Game</button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Sudoku</h1>
        <div className="game-info">
          <span>Difficulty: {G.difficulty}</span>
          <span>Time: {formatTime(timer)}</span>
          <span>Mistakes: {G.mistakes}/3</span>
        </div>
      </div>
      
      <div className="board">
        {Array(9).fill(null).map((_, row) => (
          <div key={row} className="row">
            {Array(9).fill(null).map((_, col) => renderCell(row, col))}
          </div>
        ))}
      </div>
      
      <div className="controls">
        <div className="control-row">
          <button 
            className={`control-button ${G.noteMode ? 'active' : ''}`}
            onClick={() => moves.toggleNoteMode()}
          >
            Notes {G.noteMode ? 'ON' : 'OFF'}
          </button>
          <button 
            className="control-button"
            onClick={() => moves.clearCell()}
            disabled={!G.selectedCell || G.initialBoard[G.selectedCell.row][G.selectedCell.col] !== null}
          >
            Clear
          </button>
          <button 
            className="control-button"
            onClick={() => moves.useHint()}
            disabled={G.hints <= 0 || !G.selectedCell || G.cells[G.selectedCell.row][G.selectedCell.col] !== null}
          >
            Hint ({G.hints})
          </button>
          <button 
            className="control-button"
            onClick={() => moves.undo()}
            disabled={G.history.length === 0}
          >
            Undo
          </button>
        </div>
        
        {renderNumberPad()}
        
        <div className="control-row">
          <button className="control-button" onClick={() => moves.togglePause()}>
            Pause
          </button>
          <button className="control-button" onClick={() => {
            if (window.confirm('Start a new game?')) {
              moves.newGame(G.difficulty);
            }
          }}>
            New Game
          </button>
        </div>
      </div>
      
      <div className="keyboard-shortcuts">
        <h3>Keyboard Shortcuts:</h3>
        <ul>
          <li>1-9: Place number</li>
          <li>0/Delete: Clear cell</li>
          <li>N: Toggle notes mode</li>
          <li>H: Use hint</li>
          <li>U: Undo</li>
          <li>P: Pause</li>
        </ul>
      </div>
    </div>
  );
}

// Helper functions
function isValidInCurrentPosition(board, row, col) {
  const num = board[row][col];
  if (num === null) return true;
  
  // Temporarily remove the number to check validity
  board[row][col] = null;
  
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) {
      board[row][col] = num;
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) {
      board[row][col] = num;
      return false;
    }
  }
  
  // Check box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) {
        board[row][col] = num;
        return false;
      }
    }
  }
  
  board[row][col] = num;
  return true;
}

function countNumberOccurrences(board, num) {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === num) count++;
    }
  }
  return count;
}