"use client";

import { useCallback } from "react";

export function useSocketActions(socket) {
  const joinRoom = useCallback((roomId) => {
    console.log(`🎯 Client: Attempting to join room ${roomId}`);
    console.log(`🔌 Socket connected:`, !!socket);
    if (socket) {
      console.log(`📤 Emitting join_room event for room: ${roomId}`);
      socket.emit("join_room", roomId);
    } else {
      console.log(`❌ Socket not available for joining room ${roomId}`);
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit("leave_room");
    }
  }, [socket]);

  const makeChoice = useCallback((choice) => {
    if (socket) {
      socket.emit("make_choice", choice);
    }
  }, [socket]);

  const restartGame = useCallback(() => {
    if (socket) {
      socket.emit("restart_game");
    }
  }, [socket]);

  const getAvailableRooms = useCallback(() => {
    if (socket) {
      socket.emit("get_rooms");
    }
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && message.trim()) {
      socket.emit("send_message", message);
    }
  }, [socket]);

  const testConnection = useCallback(() => {
    console.log(`🧪 Testing socket connection...`);
    if (socket) {
      console.log(`📤 Sending test event`);
      socket.emit("test_event", { message: "Hello from client", timestamp: Date.now() });
    } else {
      console.log(`❌ No socket available for test`);
    }
  }, [socket]);

  return {
    joinRoom,
    leaveRoom,
    makeChoice,
    restartGame,
    getAvailableRooms,
    sendMessage,
    testConnection,
  };
}
