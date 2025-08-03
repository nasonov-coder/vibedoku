// Sudoku board generator and validation functions

// Check if a number is valid in a specific position
export function isValidMove(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

// Solve sudoku using backtracking
function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generate a complete sudoku board
function generateCompleteBoard() {
  const board = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Fill diagonal 3x3 boxes first (they don't interfere with each other)
  for (let box = 0; box < 9; box += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle numbers
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[box + i][box + j] = nums[idx++];
      }
    }
  }
  
  // Solve the rest
  solveSudoku(board);
  return board;
}

// Remove cells to create puzzle
export function generateSudokuPuzzle(difficulty = 'medium') {
  const board = generateCompleteBoard();
  const solution = board.map(row => [...row]);
  
  // Determine how many cells to remove based on difficulty
  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55,
    expert: 64
  }[difficulty] || 45;
  
  let removed = 0;
  const attempts = [];
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (board[row][col] !== null) {
      const backup = board[row][col];
      board[row][col] = null;
      removed++;
      attempts.push({ row, col, value: backup });
    }
  }
  
  return {
    puzzle: board,
    solution: solution,
    difficulty: difficulty
  };
}

// Check if the board is complete and valid
export function isBoardComplete(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return false;
    }
  }
  return isBoardValid(board);
}

// Check if the current board state is valid
export function isBoardValid(board) {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (val !== null) {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const val = board[row][col];
      if (val !== null) {
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }
  }
  
  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const val = board[boxRow + i][boxCol + j];
          if (val !== null) {
            if (seen.has(val)) return false;
            seen.add(val);
          }
        }
      }
    }
  }
  
  return true;
}

// Get possible values for a cell
export function getPossibleValues(board, row, col) {
  if (board[row][col] !== null) return [];
  
  const possible = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      possible.push(num);
    }
  }
  return possible;
}

// Count empty cells
export function countEmptyCells(board) {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) count++;
    }
  }
  return count;
}