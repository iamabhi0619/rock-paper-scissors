const RoomManager = require("../utils/roomManager");
const { createRoom } = require("../utils/gameLogic");

// Handle joining a room
function handleJoinRoom(socket, io, roomId) {
  console.log(`User ${socket.user.name} is trying to join room ${roomId}`);
  
  try {
    const room = RoomManager.getRoom(roomId);
    console.log(room);

    if (!room) {
      return handleCreateNewRoom(socket, roomId);
    } else if (canJoinAsPlayer2(room, socket.user._id)) {
      return handleJoinAsPlayer2(socket, io, roomId, room);
    } else if (canRejoinRoom(room, socket.user._id)) {
      return handleRejoinRoom(socket, roomId, room);
    } else {
      return socket.emit("room_error", {
        message: "Room is full or you cannot join this room.",
      });
    }
  } catch (error) {
    console.error("Error joining room:", error);
    socket.emit("room_error", {
      message: "Failed to join room. Please try again.",
    });
  }
}

// Create a new room
function handleCreateNewRoom(socket, roomId) {
  const room = createRoom(roomId, socket.user);
  RoomManager.addRoom(roomId, room);
  socket.join(roomId);
  socket.currentRoom = roomId;

  socket.emit("room_joined", {
    room,
    position: "player1",
    message: "Room created successfully. Waiting for another player...",
  });

  // Broadcast room created
  socket.broadcast.emit("room_created", {
    roomId,
    creator: socket.user.name,
  });
}

// Check if user can join as player2
function canJoinAsPlayer2(room, userId) {
  return !room.players.player2 && room.players.player1._id !== userId;
}

// Handle joining as player2
function handleJoinAsPlayer2(socket, io, roomId, room) {
  room.players.player2 = {
    ...socket.user,
    choice: null,
    ready: false,
    score: 0,
  };
  room.state = "playing";

  socket.join(roomId);
  socket.currentRoom = roomId;

  // Notify both players
  io.to(roomId).emit("room_joined", {
    room,
    message: "Game is starting! Both players connected.",
  });

  io.to(roomId).emit("game_start", { room });
}

// Check if user can rejoin room
function canRejoinRoom(room, userId) {
  return (
    room.players.player1._id === userId ||
    (room.players.player2 && room.players.player2._id === userId)
  );
}

// Handle rejoining existing room
function handleRejoinRoom(socket, roomId, room) {
  socket.join(roomId);
  socket.currentRoom = roomId;

  socket.emit("room_rejoined", {
    room,
    message: "Rejoined the game successfully!",
  });
}

// Handle leaving a room
function handleLeaveRoom(socket) {
  if (socket.currentRoom) {
    socket.leave(socket.currentRoom);

    const result = RoomManager.handlePlayerLeave(
      socket.currentRoom,
      socket.user._id,
    );
    
    if (result && !result.deleted) {
      // Notify other player
      socket.broadcast.to(socket.currentRoom).emit("player_left", {
        message: `${socket.user.name} left the game.`,
        room: result.room,
      });
    }

    socket.currentRoom = null;
  }
}

// Handle getting available rooms
function handleGetRooms(socket) {
  const availableRooms = RoomManager.getAvailableRooms();
  socket.emit("rooms_list", { rooms: availableRooms });
}

// Handle disconnect for rooms
function handleDisconnect(socket) {
  console.log(`User ${socket.user.name} disconnected`);

  // Remove from user mapping
  RoomManager.removeUserSocket(socket.user._id);

  // Handle room cleanup
  if (socket.currentRoom) {
    const room = RoomManager.getRoom(socket.currentRoom);
    if (room) {
      socket.broadcast.to(socket.currentRoom).emit("player_disconnected", {
        message: `${socket.user.name} disconnected from the game.`,
        room,
      });
    }
  }
}

module.exports = {
  handleJoinRoom,
  handleLeaveRoom,
  handleGetRooms,
  handleDisconnect,
};
