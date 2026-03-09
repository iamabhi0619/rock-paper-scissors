const {
  handleMakeChoice,
  handleRestartGame,
  handleChoiceTimeout,
} = require('./gameHandlerFunctions');

function setupGameHandlers(socket, io) {
  // Make a choice
  socket.on('make_choice', (choice) => {
    handleMakeChoice(socket, io, choice);
  });

  // Restart game
  socket.on('restart_game', () => {
    handleRestartGame(socket, io);
  });

  // Handle choice timeout
  socket.on('choice_timeout', () => {
    handleChoiceTimeout(socket, io);
  });
}

module.exports = { setupGameHandlers };
