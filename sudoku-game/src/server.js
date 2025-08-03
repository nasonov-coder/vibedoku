const { Server, Origins } = require('boardgame.io/server');
const { Sudoku } = require('./Game');

const server = Server({
  games: [Sudoku],
  origins: [
    // Allow localhost connections in development
    Origins.LOCALHOST,
    // Add your production domain here when deploying
    // 'https://yourdomain.com'
  ],
});

const PORT = process.env.PORT || 8000;

server.run(PORT, () => {
  console.log(`Sudoku server running on port ${PORT}`);
});