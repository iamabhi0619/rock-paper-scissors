// Game choices
const CHOICES = ["rock", "paper", "scissors"];

// Game logic
function getWinner(choice1, choice2) {
  if (choice1 === choice2) return "tie";

  const winConditions = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  return winConditions[choice1] === choice2 ? "player1" : "player2";
}

function createRoom(roomId, player1) {
  return {
    id: roomId,
    players: {
      player1: {
        ...player1,
        choice: null,
        ready: false,
        score: 0,
      },
      player2: null,
    },
    state: "waiting",
    round: 0,
    maxRounds: 5,
    winner: null,
    lastResult: null,
  };
}

function resetGameState(room) {
  room.round = 0;
  room.state = "playing";
  room.winner = null;
  room.lastResult = null;
  room.players.player1.score = 0;
  room.players.player1.choice = null;
  room.players.player1.ready = false;

  if (room.players.player2) {
    room.players.player2.score = 0;
    room.players.player2.choice = null;
    room.players.player2.ready = false;
  }
}

function processRoundResult(room) {
  const player1Choice = room.players.player1.choice;
  const player2Choice = room.players.player2.choice;

  const result = getWinner(player1Choice, player2Choice);
  room.round++;

  // Update scores
  if (result === "player1") {
    room.players.player1.score++;
  } else if (result === "player2") {
    room.players.player2.score++;
  }

  const roundResult = {
    round: room.round,
    player1: {
      name: room.players.player1.name,
      choice: player1Choice,
      score: room.players.player1.score,
    },
    player2: {
      name: room.players.player2.name,
      choice: player2Choice,
      score: room.players.player2.score,
    },
    winner: result,
    message:
      result === "tie"
        ? "It's a tie!"
        : result === "player1"
          ? `${room.players.player1.name} wins this round!`
          : `${room.players.player2.name} wins this round!`,
  };

  room.lastResult = roundResult;

  // Reset choices for next round
  room.players.player1.choice = null;
  room.players.player1.ready = false;
  room.players.player2.choice = null;
  room.players.player2.ready = false;

  return roundResult;
}

function checkGameFinished(room) {
  if (room.round >= room.maxRounds) {
    room.state = "finished";

    let gameWinner = "tie";
    if (room.players.player1.score > room.players.player2.score) {
      gameWinner = "player1";
    } else if (room.players.player2.score > room.players.player1.score) {
      gameWinner = "player2";
    }

    room.winner = gameWinner;
    return {
      isFinished: true,
      gameWinner,
      finalMessage:
        gameWinner === "tie"
          ? "Game ended in a tie!"
          : gameWinner === "player1"
            ? `🎉 ${room.players.player1.name} wins the game!`
            : `🎉 ${room.players.player2.name} wins the game!`,
    };
  }

  return { isFinished: false };
}

module.exports = {
  CHOICES,
  getWinner,
  createRoom,
  resetGameState,
  processRoundResult,
  checkGameFinished,
};
