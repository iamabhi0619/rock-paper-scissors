// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { createServer } = require("http");
const next = require("next");
const { setupSocketIO } = require("./server/socketConfig");

const dev = process.env.NODE_ENV !== "production";
const hostname = "10.121.162.173"; //TODO: Change this to your local IP address or "localhost" for development
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  // Setup Socket.IO
  setupSocketIO(server);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(
      `Server ready on http://${hostname}:${port} in ${process.env.NODE_ENV} mode`,
    );
    console.log(`Socket.IO server is running`);
  });
});
