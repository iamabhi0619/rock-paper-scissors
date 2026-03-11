"use client";

import { useCallback } from "react";

export function useSocketActions(socket) {
  const joinRoom = useCallback((roomId, isPrivate = false) => {
    if (socket) {
      socket.emit("join_room", { roomId, isPrivate });
    } else {
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit("leave_room");
    }
  }, [socket]);

  const makeChoice = useCallback((choice) => {
    if (socket) {
      // console.log('Emitting make_choice:', choice);
      socket.emit("make_choice", choice);
    } else {
      console.error('Cannot make choice - socket not connected');
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
    if (socket) {
      socket.emit("test_event", { message: "Hello from client", timestamp: Date.now() });
    } else {
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
