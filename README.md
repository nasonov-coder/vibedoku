# Vibedoku 🎮

An emoji-based Sudoku game with minesweeper-style gameplay. Click cells to reveal emojis and complete the puzzle using as few clicks as possible!

🎮 **Play now at: https://nasonov-coder.github.io/vibedoku/**

## Features

- 🎨 45+ emoji themes (animals, food, space, and more!)
- 🎯 Minesweeper-style reveal mechanics
- 🤖 AI helpers that automatically solve parts of the puzzle
- 📱 Mobile-friendly with swipe support
- 📊 Score tracking based on moves used

## Quick Start

### Local Development

```bash
# Run directly with Node.js
npm start

# Or use Docker
docker-compose up
```

The game will be available at `http://localhost:3456`

### Deployment with Coolify

1. Fork or import this repository
2. In Coolify, create a new application
3. Select "Docker Compose" as the build pack
4. Connect your GitHub repository
5. Deploy!

Coolify will automatically detect the `docker-compose.yml` and deploy the application.

### Environment Variables

- `PORT` - The port to run the server on (default: 3456)
- `NODE_ENV` - Set to `production` for production deployments

## Game Rules

1. Click any gray cell to reveal its emoji
2. Each row, column, and 3x3 box must contain all 9 unique emojis
3. AI helpers automatically fill obvious cells
4. Goal: Complete the puzzle using as few clicks as possible!

## Scoring

- Start with 1000 points
- Lose 30 points per click
- ≤25 moves: Amazing! 🎯
- ≤35 moves: Great job! 👍
- ≤45 moves: Good work! 😊
- >45 moves: You did it! ✅

## Tech Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- Node.js server for serving static files
- Docker for containerization

## License

MIT