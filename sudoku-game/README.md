# Sudoku Game with boardgame.io

A fully-featured Sudoku game built with [boardgame.io](https://boardgame.io/) and React. This implementation includes puzzle generation, validation, hints, notes, undo functionality, and multiplayer support.

## Features

- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert modes
- **Smart Puzzle Generation**: Generates valid Sudoku puzzles with unique solutions
- **Interactive Gameplay**:
  - Click or keyboard navigation
  - Number highlighting
  - Cell relationships visualization
  - Invalid move detection
- **Helper Features**:
  - Notes/pencil marks for tracking possibilities
  - Hint system (3 hints per game)
  - Undo functionality
  - Mistake counter
- **Timer and Scoring**: Track your solving time and earn points based on performance
- **Keyboard Shortcuts**:
  - 1-9: Place numbers
  - 0/Delete: Clear cell
  - N: Toggle notes mode
  - H: Use hint
  - U: Undo last move
  - P: Pause game
- **Responsive Design**: Works on desktop and mobile devices
- **Multiplayer Ready**: Server included for online play

## Installation

1. Clone this repository:
```bash
cd sudoku-game
```

2. Install dependencies:
```bash
npm install
```

## Running the Game

### Single Player Mode (Local)

To run the game in single-player mode:

```bash
npm start
```

The game will open at [http://localhost:3000](http://localhost:3000)

### Multiplayer Mode

To enable multiplayer functionality:

1. Start the game server:
```bash
npm run server
```

2. In a separate terminal, start the client:
```bash
npm start
```

3. In `src/App.js`, uncomment the multiplayer configuration:
```javascript
multiplayer: SocketIO({ server: 'localhost:8000' }),
```

The server will run on port 8000 by default.

### Development Mode

To run both client and server concurrently:

```bash
npm run dev
```

## How to Play

1. **Objective**: Fill the 9×9 grid so that each row, column, and 3×3 box contains all digits from 1 to 9.

2. **Controls**:
   - Click a cell to select it
   - Click a number button or press 1-9 to place a number
   - Use the Notes button to switch to pencil mark mode
   - Click Clear or press 0/Delete to remove a number

3. **Features**:
   - **Notes Mode**: Toggle to add multiple possible numbers to a cell
   - **Hints**: Use one of your 3 hints to reveal the correct number for the selected cell
   - **Undo**: Revert your last move
   - **Pause**: Pause the timer and hide the board

4. **Scoring**: Points are awarded based on:
   - Difficulty level (higher difficulty = more base points)
   - Completion time (faster = more bonus points)
   - Mistakes made (fewer = higher score)
   - Hints used (fewer = higher score)

## Project Structure

```
sudoku-game/
├── public/
│   └── index.html
├── src/
│   ├── App.js           # Main app component with difficulty selection
│   ├── App.css          # App styling
│   ├── Board.js         # Sudoku board React component
│   ├── Board.css        # Board styling
│   ├── Game.js          # boardgame.io game logic
│   ├── sudokuGenerator.js # Puzzle generation and validation
│   ├── server.js        # Multiplayer server
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── package.json
└── README.md
```

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `build/` directory.

## Customization

### Difficulty Settings

You can adjust the difficulty by modifying the number of cells removed in `sudokuGenerator.js`:

```javascript
const cellsToRemove = {
  easy: 35,
  medium: 45,
  hard: 55,
  expert: 64
}
```

### Styling

The game uses CSS modules for styling. You can customize the appearance by modifying:
- `Board.css` for game board styling
- `App.css` for welcome screen and overall layout

### Game Rules

Modify `Game.js` to add new features or change game rules:
- Add more hints
- Change scoring system
- Add time limits
- Implement different game modes

## Technologies Used

- [boardgame.io](https://boardgame.io/) - Game state management and multiplayer framework
- [React](https://reactjs.org/) - UI library
- [Node.js](https://nodejs.org/) - Server runtime

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Troubleshooting

### Port Already in Use

If you get an error about port 3000 or 8000 being in use, you can change the ports:

- For the client: Set the `PORT` environment variable
- For the server: Modify the PORT constant in `src/server.js`

### Build Errors

Make sure you have Node.js version 14 or higher installed.

### Game Not Loading

Check the browser console for errors and ensure all dependencies are installed correctly.

## Future Enhancements

- Save/load game progress
- User profiles and statistics
- Daily challenges
- Puzzle sharing
- More visual themes
- Sound effects
- Tutorial mode