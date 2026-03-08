const { Server } = require("socket.io");
const { setupRoomHandlers } = require("./handlers/roomHandlers");
const { setupGameHandlers } = require("./handlers/gameHandlers");
const { setupChatHandlers } = require("./handlers/chatHandlers");
const RoomManager = require("./utils/roomManager");

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin:
        [process.env.NEXT_PUBLIC_BASE_URL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Basic validation middleware
  io.use((socket, next) => {
    const user = socket.handshake.auth.user;
    if (!user) {
      return next(new Error("User information required"));
    }
    socket.user = user;
    next();
  });

  io.on("connection", (socket) => {

    RoomManager.addUserSocket(socket.user._id, socket.id);

    // Send user their current state
    socket.emit("user_connected", {
      user: socket.user,
      socketId: socket.id,
    });

    // Setup event handlers
    setupRoomHandlers(socket, io);
    setupGameHandlers(socket, io);
    setupChatHandlers(socket, io);

  });

  return io;
}

module.exports = { setupSocketIO };
