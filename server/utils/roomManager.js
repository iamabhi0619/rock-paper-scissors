// Game state management
const rooms = new Map();
const userSockets = new Map();

const RoomManager = {
  getRooms() {
    return rooms;
  },

  getUserSockets() {
    return userSockets;
  },

  addRoom(roomId, room) {
    rooms.set(roomId, room);
  },

  getRoom(roomId) {
    return rooms.get(roomId);
  },

  deleteRoom(roomId) {
    rooms.delete(roomId);
  },

  addUserSocket(userId, socketId) {
    userSockets.set(userId, socketId);
  },

  removeUserSocket(userId) {
    userSockets.delete(userId);
  },

  getAvailableRooms() {
    return Array.from(rooms.values())
      .filter(room => room.state === 'waiting')
      .map(room => ({
        id: room.id,
        creator: room.players.player1.name,
        playersCount: room.players.player2 ? 2 : 1
      }));
  },

  handlePlayerLeave(roomId, userId) {
    const room = rooms.get(roomId);
    if (!room) return null;

    // If only one player left, reset room state
    if (room.players.player1._id === userId) {
      if (room.players.player2) {
        room.players.player1 = room.players.player2;
        room.players.player2 = null;
        room.state = 'waiting';
      } else {
        rooms.delete(roomId);
        return { deleted: true };
      }
    } else {
      room.players.player2 = null;
      room.state = 'waiting';
    }

    return { room, deleted: false };
  },

  cleanup() {
    // Remove empty rooms periodically
    for (const [roomId, room] of rooms.entries()) {
      if (!room.players.player1 && !room.players.player2) {
        rooms.delete(roomId);
      }
    }
  }
};

// Cleanup empty rooms every 5 minutes
setInterval(() => {
  RoomManager.cleanup();
}, 5 * 60 * 1000);

module.exports = RoomManager;
