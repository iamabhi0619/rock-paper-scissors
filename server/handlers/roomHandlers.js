const {
  handleJoinRoom,
  handleLeaveRoom,
  handleGetRooms,
  handleDisconnect,
} = require("./roomHandlerFunctions");

function setupRoomHandlers(socket, io) {

  // Test event to verify socket communication
  socket.on("test_event", (data) => {
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
