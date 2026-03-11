const RoomManager = require('../utils/roomManager');
const { 
  CHOICES, 
  processRoundResult, 
  checkGameFinished, 
  resetGameState,
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
function handleChoiceNotifications(socket, io, room, choice) {
  // Notify player their choice was recorded
  socket.emit('choice_made', { choice });

  // Clear last result when first player makes a choice in new round
  if (room.players.player1.ready && !room.players.player2.ready || 
      !room.players.player1.ready && room.players.player2.ready) {
    room.lastResult = null;
  }

  // Notify other player that opponent made a choice (without revealing it)
  socket.broadcast.to(socket.currentRoom).emit('opponent_chose', {
    message: 'Your opponent has made their choice!'
  });
  
  // Update game state to clear last result for all clients
  io.to(socket.currentRoom).emit('game_state_updated', { room });
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

  handleChoiceNotifications(socket, io, room, choice);
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

// Handle choice timeout - timed-out player forfeits the round (opponent wins the round)
function handleChoiceTimeout(socket, io) {
  if (!socket.currentRoom) return;

  const room = RoomManager.getRoom(socket.currentRoom);
  if (!room || room.state !== 'playing') return;

  const isPlayer1 = room.players.player1._id === socket.user._id;
  const isPlayer2 = room.players.player2?._id === socket.user._id;
  if (!isPlayer1 && !isPlayer2) return;

  const playerData = isPlayer1 ? room.players.player1 : room.players.player2;
  const opponentData = isPlayer1 ? room.players.player2 : room.players.player1;

  // Only valid when the timed-out player hasn't chosen but opponent already has
  if (playerData.ready || !opponentData.ready) return;

  // Timed-out player forfeits — opponent wins this round
  room.round++;
  if (isPlayer1) {
    room.players.player2.score++;
  } else {
    room.players.player1.score++;
  }

  const roundResult = {
    round: room.round,
    player1: {
      name: room.players.player1.name,
      choice: room.players.player1.choice,
      score: room.players.player1.score,
    },
    player2: {
      name: room.players.player2.name,
      choice: room.players.player2.choice,
      score: room.players.player2.score,
    },
    winner: isPlayer1 ? 'player2' : 'player1',
    timeout: true,
    message: `${playerData.name} ran out of time! ${opponentData.name} wins this round.`,
  };

  room.lastResult = roundResult;

  // Reset choices for the next round
  room.players.player1.choice = null;
  room.players.player1.ready = false;
  room.players.player2.choice = null;
  room.players.player2.ready = false;

  const gameFinished = checkGameFinished(room);

  if (gameFinished.isFinished) {
    io.to(socket.currentRoom).emit('game_finished', {
      ...roundResult,
      gameWinner: gameFinished.gameWinner,
      finalMessage: gameFinished.finalMessage,
      room,
    });
  } else {
    io.to(socket.currentRoom).emit('round_result', {
      ...roundResult,
      room,
    });

    setTimeout(() => {
      io.to(socket.currentRoom).emit('game_state_updated', {
        room,
        message: `Round ${room.round + 1} - Make your choices!`,
      });
    }, 2000);
  }
}

module.exports = {
  handleMakeChoice,
  handleRestartGame,
  handleChoiceTimeout,
};
