"use client";

import { createContext, useContext } from "react";
import { useUserStore } from "@/store/user";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useSocketRoomEvents } from "@/hooks/useSocketRoomEvents";
import { useSocketGameEvents } from "@/hooks/useSocketGameEvents";
import { useSocketChatEvents } from "@/hooks/useSocketChatEvents";
import { useSocketActions } from "@/hooks/useSocketActions";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

function Socket({ children }) {
  const { user, isAuthenticated } = useUserStore();

  // Socket connection
  const { socket, connected } = useSocketConnection(isAuthenticated, user);

  // Room events and state
  const {
    currentRoom,
    gameState,
    availableRooms,
    setCurrentRoom,
    setGameState,
  } = useSocketRoomEvents(socket);

  // Game events
  useSocketGameEvents(socket, user, setGameState);

  // Chat events and state
  const { messages, clearMessages } = useSocketChatEvents(socket);

  // Socket actions
  const socketActions = useSocketActions(socket);

  // Enhanced actions that include state management
  const enhancedActions = {
    ...socketActions,
    joinRoom: (roomId) => {
      clearMessages(); // Clear messages when joining new room
      socketActions.joinRoom(roomId);
    },
    leaveRoom: () => {
      setCurrentRoom(null);
      setGameState(null);
      clearMessages();
      socketActions.leaveRoom();
    },
  };

  const value = {
    socket,
    connected,
    currentRoom,
    gameState,
    messages,
    availableRooms,
    ...enhancedActions,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default Socket;
