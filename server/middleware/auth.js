// Middleware to check authentication
function authMiddleware(socket, next) {
  const token = socket.handshake.auth.token;
  const user = socket.handshake.auth.user;
  const isGuest = socket.handshake.auth.isGuest;

  // Allow guest users or authenticated users
  if (!user) {
    return next(new Error("User information required"));
  }

  socket.user = user;
  socket.token = token || null;
  socket.isGuest = isGuest || false;
  next();
}

module.exports = { authMiddleware };
