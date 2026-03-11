"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useSocketRoomEvents(socket) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Room events
    socket.on("room_joined", (data) => {
      setCurrentRoom(data.room.id);
      setGameState(data.room);
      // console.log("Joined room:", data.message);
    });

    socket.on("room_rejoined", (data) => {
      setCurrentRoom(data.room.id);
      setGameState(data.room);
      // console.log("Rejoined room:", data.message);
    });

    socket.on("room_error", (data) => {
      // console.error("Room error:", data.message);
      toast.error(data.message || "Cannot join the room");
      // Keep toast for errors as they need immediate attention
    });

    socket.on("player_left", (data) => {
      setGameState(data.room);
      // console.log("Player left:", data.message);
    });

    socket.on("player_disconnected", (data) => {
      setGameState(data.room);
      // console.log("Player disconnected:", data.message);
    });

    socket.on("room_created", () => {
      // Refresh available rooms when a new room is created
      socket.emit("get_rooms");
    });

    // Rooms list
    socket.on("rooms_list", (data) => {
      setAvailableRooms(data.rooms);
    });

    // Cleanup when socket disconnects
    socket.on("disconnect", () => {
      setCurrentRoom(null);
      setGameState(null);
      setAvailableRooms([]);
    });

    return () => {
      socket.off("room_joined");
      socket.off("room_rejoined");
      socket.off("room_error");
      socket.off("player_left");
      socket.off("player_disconnected");
      socket.off("room_created");
      socket.off("rooms_list");
    };
  }, [socket]);

  return {
    currentRoom,
    gameState,
    availableRooms,
    setCurrentRoom,
    setGameState,
    setAvailableRooms,
  };
}
