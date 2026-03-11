"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function useSocketRoomEvents(socket) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);

  // Persist the last joined room so we can auto-rejoin after a transient disconnect
  const pendingRejoinRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Room events
    socket.on("room_joined", (data) => {
      setCurrentRoom(data.room.id);
      setGameState(data.room);
      pendingRejoinRef.current = { roomId: data.room.id, isPrivate: data.room.isPrivate ?? false };
    });

    socket.on("room_rejoined", (data) => {
      setCurrentRoom(data.room.id);
      setGameState(data.room);
      pendingRejoinRef.current = { roomId: data.room.id, isPrivate: data.room.isPrivate ?? false };
    });

    socket.on("room_error", (data) => {
      toast.error(data.message || "Cannot join the room");
      // If rejoin failed, the room no longer exists — clear persisted state
      pendingRejoinRef.current = null;
      setCurrentRoom(null);
      setGameState(null);
    });

    // Intentional leave confirmed by server
    socket.on("room_left", () => {
      pendingRejoinRef.current = null;
      setCurrentRoom(null);
      setGameState(null);
    });

    socket.on("player_left", (data) => {
      setGameState(data.room);
    });

    socket.on("player_disconnected", (data) => {
      setGameState(data.room);
    });

    socket.on("room_created", () => {
      socket.emit("get_rooms");
    });

    // Rooms list
    socket.on("rooms_list", (data) => {
      setAvailableRooms(data.rooms);
    });

    // Transient disconnect — preserve room state so we can rejoin on reconnect
    socket.on("disconnect", () => {
      setAvailableRooms([]);
      // Do NOT clear currentRoom/gameState here; auto-rejoin on reconnect handles it
    });

    // On (re)connect: auto-rejoin previous room if we were in one
    socket.on("connect", () => {
      if (pendingRejoinRef.current) {
        socket.emit("join_room", {
          roomId: pendingRejoinRef.current.roomId,
          isPrivate: pendingRejoinRef.current.isPrivate,
        });
      } else {
        socket.emit("get_rooms");
      }
    });

    return () => {
      socket.off("room_joined");
      socket.off("room_rejoined");
      socket.off("room_error");
      socket.off("room_left");
      socket.off("player_left");
      socket.off("player_disconnected");
      socket.off("room_created");
      socket.off("rooms_list");
      socket.off("disconnect");
      socket.off("connect");
    };
  }, [socket]);

  const clearPendingRejoin = () => {
    pendingRejoinRef.current = null;
  };

  return {
    currentRoom,
    gameState,
    availableRooms,
    setCurrentRoom,
    setGameState,
    setAvailableRooms,
    clearPendingRejoin,
  };
}
