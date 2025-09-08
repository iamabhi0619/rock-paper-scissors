"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

export function useSocketConnection(isAuthenticated, user) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Create socket connection
    const newSocket = io(
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "http://localhost:3000",
      {
        auth: {
          token: localStorage.getItem("token"),
          user: user,
        },
        transports: ["websocket", "polling"],
      },
    );

    // Connection events
    newSocket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
      toast.success("Connected to game server!");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
      toast.error("Disconnected from game server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Failed to connect to game server");
    });

    newSocket.on("user_connected", (data) => {
      console.log("User connected:", data);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Handle socket cleanup when auth changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated, user, socket]);

  return { socket, connected };
}
