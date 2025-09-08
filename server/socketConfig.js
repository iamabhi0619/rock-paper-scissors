const { Server } = require("socket.io");
const { authMiddleware } = require("./middleware/auth");
const { setupRoomHandlers } = require("./handlers/roomHandlers");
const { setupGameHandlers } = require("./handlers/gameHandlers");
const { setupChatHandlers } = require("./handlers/chatHandlers");
const RoomManager = require("./utils/roomManager");

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? [process.env.NEXT_PUBLIC_BASE_URL]
          : ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Apply authentication middleware
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    console.log(`🔌 User ${socket.user.name} connected with socket ${socket.id}`);
    console.log(`📝 User object:`, JSON.stringify(socket.user, null, 2));

    RoomManager.addUserSocket(socket.user._id, socket.id);

    // Send user their current state
    socket.emit("user_connected", {
      user: socket.user,
      socketId: socket.id,
    });

    console.log(`🎮 Setting up event handlers for ${socket.user.name}`);
    
    // Setup event handlers
    setupRoomHandlers(socket, io);
    setupGameHandlers(socket, io);
    setupChatHandlers(socket, io);

    console.log(`✅ Event handlers setup complete for ${socket.user.name}`);
  });

  return io;
}

module.exports = { setupSocketIO };
