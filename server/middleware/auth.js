// Middleware to check authentication
function authMiddleware(socket, next) {
  const token = socket.handshake.auth.token;
  const user = socket.handshake.auth.user;

  if (!token || !user) {
    return next(new Error("Authentication error"));
  }

  socket.user = user;
  socket.token = token;
  next();
}

module.exports = { authMiddleware };
