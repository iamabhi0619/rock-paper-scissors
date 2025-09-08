function setupChatHandlers(socket, io) {
  // Chat functionality
  socket.on('send_message', (message) => {
    if (!socket.currentRoom) return;
    
    const chatMessage = {
      id: Date.now(),
      user: socket.user.name,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    io.to(socket.currentRoom).emit('new_message', chatMessage);
  });
}

module.exports = { setupChatHandlers };
