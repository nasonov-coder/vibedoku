import { 
  generateSudokuPuzzle, 
  isValidMove, 
  isBoardComplete, 
  getPossibleValues,
  countEmptyCells 
} from './sudokuGenerator';

// Sudoku game definition for boardgame.io
export const Sudoku = {
  name: 'sudoku',
  
  setup: ({ ctx }, setupData) => {
    const difficulty = setupData?.difficulty || 'medium';
    const { puzzle, solution } = generateSudokuPuzzle(difficulty);
    
    return {
      cells: puzzle,
      solution: solution,
      initialBoard: puzzle.map(row => [...row]), // Keep track of initial state
      selectedCell: null,
      notes: Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => new Set())
      ),
      hints: 3, // Number of hints available
      mistakes: 0,
      startTime: Date.now(),
      endTime: null,
      difficulty: difficulty,
      history: [], // For undo functionality
      noteMode: false,
      highlightNumber: null,
      paused: false
    };
  },
  
  moves: {
    selectCell: ({ G }, row, col) => {
      if (G.paused || G.endTime) return;
      
      G.selectedCell = { row, col };
      
      // Highlight all instances of the number in the selected cell
      if (G.cells[row][col] !== null) {
        G.highlightNumber = G.cells[row][col];
      } else {
        G.highlightNumber = null;
      }
    },
    
    placeNumber: ({ G, events }, number) => {
      if (G.paused || G.endTime || !G.selectedCell) return;
      
      const { row, col } = G.selectedCell;
      
      // Can't modify initial cells
      if (G.initialBoard[row][col] !== null) return;
      
      // Save state for undo
      G.history.push({
        cells: G.cells.map(row => [...row]),
        notes: G.notes.map(row => row.map(cell => new Set(cell))),
        mistakes: G.mistakes
      });
      
      if (G.noteMode) {
        // Toggle note
        if (G.notes[row][col].has(number)) {
          G.notes[row][col].delete(number);
        } else {
          G.notes[row][col].add(number);
        }
        // Clear the cell value when adding notes
        G.cells[row][col] = null;
      } else {
        // Place number
        if (isValidMove(G.cells, row, col, number)) {
          G.cells[row][col] = number;
          // Clear notes for this cell
          G.notes[row][col].clear();
          
          // Clear this number from notes in same row, column, and box
          clearNotesForPlacedNumber(G.notes, row, col, number);
        } else {
          // Invalid move
          G.mistakes++;
          G.cells[row][col] = number; // Still place it to show the mistake
        }
      }
      
      // Check if game is complete
      if (isBoardComplete(G.cells)) {
        G.endTime = Date.now();
        events.endGame({ winner: true });
      }
    },
    
    clearCell: ({ G }) => {
      if (G.paused || G.endTime || !G.selectedCell) return;
      
      const { row, col } = G.selectedCell;
      
      // Can't clear initial cells
      if (G.initialBoard[row][col] !== null) return;
      
      // Save state for undo
      G.history.push({
        cells: G.cells.map(row => [...row]),
        notes: G.notes.map(row => row.map(cell => new Set(cell))),
        mistakes: G.mistakes
      });
      
      G.cells[row][col] = null;
      G.notes[row][col].clear();
    },
    
    toggleNoteMode: ({ G }) => {
      if (G.paused || G.endTime) return;
      G.noteMode = !G.noteMode;
    },
    
    useHint: ({ G }) => {
      if (G.paused || G.endTime || G.hints <= 0 || !G.selectedCell) return;
      
      const { row, col } = G.selectedCell;
      
      // Can't hint on filled cells
      if (G.cells[row][col] !== null) return;
      
      // Save state for undo
      G.history.push({
        cells: G.cells.map(row => [...row]),
        notes: G.notes.map(row => row.map(cell => new Set(cell))),
        mistakes: G.mistakes
      });
      
      // Place the correct number from solution
      G.cells[row][col] = G.solution[row][col];
      G.notes[row][col].clear();
      G.hints--;
      
      // Clear notes for this number
      clearNotesForPlacedNumber(G.notes, row, col, G.solution[row][col]);
    },
    
    undo: ({ G }) => {
      if (G.paused || G.endTime || G.history.length === 0) return;
      
      const previousState = G.history.pop();
      G.cells = previousState.cells;
      G.notes = previousState.notes;
      G.mistakes = previousState.mistakes;
    },
    
    togglePause: ({ G }) => {
      if (G.endTime) return;
      G.paused = !G.paused;
    },
    
    newGame: ({ G, random, events }, difficulty) => {
      const { puzzle, solution } = generateSudokuPuzzle(difficulty || G.difficulty);
      
      G.cells = puzzle;
      G.solution = solution;
      G.initialBoard = puzzle.map(row => [...row]);
      G.selectedCell = null;
      G.notes = Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => new Set())
      );
      G.hints = 3;
      G.mistakes = 0;
      G.startTime = Date.now();
      G.endTime = null;
      G.difficulty = difficulty || G.difficulty;
      G.history = [];
      G.noteMode = false;
      G.highlightNumber = null;
      G.paused = false;
    },
    
    // Keyboard shortcuts
    handleKeyPress: ({ G, moves }, key) => {
      if (G.paused || G.endTime) return;
      
      if (key >= '1' && key <= '9') {
        moves.placeNumber(parseInt(key));
      } else if (key === '0' || key === 'Delete' || key === 'Backspace') {
        moves.clearCell();
      } else if (key === 'n' || key === 'N') {
        moves.toggleNoteMode();
      } else if (key === 'h' || key === 'H') {
        moves.useHint();
      } else if (key === 'u' || key === 'U') {
        moves.undo();
      } else if (key === 'p' || key === 'P') {
        moves.togglePause();
      }
    }
  },
  
  endIf: ({ G, ctx }) => {
    if (G.endTime) {
      const time = Math.floor((G.endTime - G.startTime) / 1000);
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      
      return {
        winner: ctx.currentPlayer,
        time: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        mistakes: G.mistakes,
        hintsUsed: 3 - G.hints,
        difficulty: G.difficulty,
        score: calculateScore(G)
      };
    }
  }
};

// Helper function to clear notes when a number is placed
function clearNotesForPlacedNumber(notes, row, col, number) {
  // Clear from row
  for (let c = 0; c < 9; c++) {
    notes[row][c].delete(number);
  }
  
  // Clear from column
  for (let r = 0; r < 9; r++) {
    notes[r][col].delete(number);
  }
  
  // Clear from 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      notes[boxRow + i][boxCol + j].delete(number);
    }
  }
}

// Calculate score based on difficulty, time, mistakes, and hints
function calculateScore(G) {
  const baseScore = {
    easy: 1000,
    medium: 2000,
    hard: 3000,
    expert: 5000
  }[G.difficulty] || 2000;
  
  const time = Math.floor((G.endTime - G.startTime) / 1000);
  const timeBonus = Math.max(0, 1000 - time);
  const mistakePenalty = G.mistakes * 50;
  const hintPenalty = (3 - G.hints) * 100;
  
  return Math.max(0, baseScore + timeBonus - mistakePenalty - hintPenalty);
}