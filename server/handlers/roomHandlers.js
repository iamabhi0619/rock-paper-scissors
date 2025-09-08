const {
  handleJoinRoom,
  handleLeaveRoom,
  handleGetRooms,
  handleDisconnect,
} = require("./roomHandlerFunctions");

function setupRoomHandlers(socket, io) {
  console.log(`Setting up room handlers for user: ${socket.user.name}`);

  // Test event to verify socket communication
  socket.on("test_event", (data) => {
    console.log(`📨 Test event received from ${socket.user.name}:`, data);
  });

  // Room event handlers
  socket.on("join_room", (roomId) => {
    handleJoinRoom(socket, io, roomId);
  });

  socket.on("leave_room", () => {
    handleLeaveRoom(socket);
  });

  socket.on("get_rooms", () => {
    handleGetRooms(socket);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });
}

module.exports = { setupRoomHandlers };
