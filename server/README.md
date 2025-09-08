# Server Structure

This document explains the modular server structure for the Rock Paper Scissors multiplayer game.

## Folder Structure

```
server/
├── handlers/           # Event handlers for different features
│   ├── roomHandlers.js    # Room join/leave/management events
│   ├── gameHandlers.js    # Game logic events (choices, restart)
│   └── chatHandlers.js    # Chat functionality
├── middleware/         # Socket.IO middleware
│   └── auth.js           # Authentication middleware
├── utils/             # Utility functions and game logic
│   ├── gameLogic.js     # Core game logic and rules
│   └── roomManager.js   # Room state management
└── socketConfig.js    # Socket.IO server configuration
```

## File Descriptions

### `server.js` (Main Server)
- Entry point for the application
- Sets up Next.js server and Socket.IO
- Minimal and clean - all logic moved to modules

### `server/socketConfig.js`
- Configures Socket.IO server
- Sets up CORS and authentication
- Connects all event handlers

### `server/middleware/auth.js`
- Authentication middleware for Socket.IO
- Validates user tokens and user objects
- Adds user data to socket object

### `server/utils/gameLogic.js`
- Core game logic functions
- Game state management functions
- Winner determination logic
- Room creation and reset functions

### `server/utils/roomManager.js`
- Room state management
- Player join/leave logic
- Available rooms listing
- Automatic cleanup of empty rooms

### `server/handlers/roomHandlers.js`
- Handles room-related events:
  - `join_room` - Join or create a room
  - `leave_room` - Leave current room
  - `get_rooms` - Get list of available rooms
  - `disconnect` - Handle user disconnection

### `server/handlers/gameHandlers.js`
- Handles game-related events:
  - `make_choice` - Player makes rock/paper/scissors choice
  - `restart_game` - Restart the current game

### `server/handlers/chatHandlers.js`
- Handles chat functionality:
  - `send_message` - Send chat message to room

## Key Features

### 🔐 Authentication
- Token-based authentication for Socket.IO connections
- User object validation
- Secure room access

### 🏠 Room Management
- Create and join rooms with custom IDs
- Automatic room creation
- Room state management (waiting/playing/finished)
- Player reconnection support

### 🎮 Game Logic
- Rock Paper Scissors game rules
- Score tracking (best of 5 rounds)
- Round-by-round results
- Game winner determination

### 💬 Real-time Chat
- Room-based chat system
- Message history
- User identification

### 🧹 Automatic Cleanup
- Empty rooms are automatically cleaned up every 5 minutes
- Disconnected users are properly handled
- Memory-efficient state management

## Usage

To start the server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` with Socket.IO enabled.

## Adding New Features

1. **New Event Handlers**: Add them to the appropriate handler file in `server/handlers/`
2. **New Middleware**: Add to `server/middleware/`
3. **New Utilities**: Add to `server/utils/`
4. **Game Logic Changes**: Modify `server/utils/gameLogic.js`

## Environment Variables

- `NODE_ENV`: Set to 'production' for production environment
- `PORT`: Server port (default: 3000)

## Security Considerations

- CORS is configured for development and production
- Authentication middleware validates all connections
- Room access is controlled and validated
- No sensitive data is exposed through Socket.IO events
