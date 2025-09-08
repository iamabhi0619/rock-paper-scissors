const RoomManager = require('../utils/roomManager');
const { 
  CHOICES, 
  processRoundResult, 
  checkGameFinished, 
  resetGameState 
} = require('../utils/gameLogic');

// Validate choice and room
function validateChoiceAndRoom(socket, choice) {
  if (!socket.currentRoom || !CHOICES.includes(choice)) {
    socket.emit('game_error', { message: 'Invalid choice or room.' });
    return false;
  }

  const room = RoomManager.getRoom(socket.currentRoom);
  if (!room || room.state !== 'playing') {
    socket.emit('game_error', { message: 'Game is not in playing state.' });
    return false;
  }

  // Check if player already made a choice this round
  if (room.players.player1._id === socket.user._id && room.players.player1.ready) {
    socket.emit('game_error', { message: 'You have already made your choice this round.' });
    return false;
  }
  
  if (room.players.player2?._id === socket.user._id && room.players.player2.ready) {
    socket.emit('game_error', { message: 'You have already made your choice this round.' });
    return false;
  }

  return room;
}

// Update player choice in room
function updatePlayerChoice(room, socket, choice) {
  if (room.players.player1._id === socket.user._id) {
    room.players.player1.choice = choice;
    room.players.player1.ready = true;
    return true;
  } else if (room.players.player2 && room.players.player2._id === socket.user._id) {
    room.players.player2.choice = choice;
    room.players.player2.ready = true;
    return true;
  }
  return false;
}

// Handle notifications after choice is made
function handleChoiceNotifications(socket, choice) {
  // Notify player their choice was recorded
  socket.emit('choice_made', { choice });

  // Notify other player that opponent made a choice (without revealing it)
  socket.broadcast.to(socket.currentRoom).emit('opponent_chose', {
    message: 'Your opponent has made their choice!'
  });
}

// Process round if both players are ready
function processRound(room, socket, io) {
  if (room.players.player1.ready && room.players.player2?.ready) {
    const roundResult = processRoundResult(room);
    const gameFinished = checkGameFinished(room);
    
    if (gameFinished.isFinished) {
      room.state = 'finished';
      io.to(socket.currentRoom).emit('game_finished', {
        ...roundResult,
        gameWinner: gameFinished.gameWinner,
        finalMessage: gameFinished.finalMessage,
        room
      });
    } else {
      // Continue to next round - emit round result first
      io.to(socket.currentRoom).emit('round_result', {
        ...roundResult,
        room
      });
      
      // Then emit updated game state for next round
      setTimeout(() => {
        io.to(socket.currentRoom).emit('game_state_updated', {
          room,
          message: `Round ${room.round + 1} - Make your choices!`
        });
      }, 2000); // 2 second delay to show results
    }
  } else {
    // Just update the room state if only one player has chosen
    io.to(socket.currentRoom).emit('game_state_updated', { room });
  }
}

// Handle player making a choice
function handleMakeChoice(socket, io, choice) {
  const room = validateChoiceAndRoom(socket, choice);
  if (!room) return;

  const choiceUpdated = updatePlayerChoice(room, socket, choice);
  if (!choiceUpdated) return;

  handleChoiceNotifications(socket, choice);
  processRound(room, socket, io);
}

// Handle game restart
function handleRestartGame(socket, io) {
  if (!socket.currentRoom) return;
  
  const room = RoomManager.getRoom(socket.currentRoom);
  if (!room) return;
  
  // Reset game state
  resetGameState(room);
  
  io.to(socket.currentRoom).emit('game_restarted', {
    room,
    message: 'Game has been restarted!'
  });
}

module.exports = {
  handleMakeChoice,
  handleRestartGame,
};
