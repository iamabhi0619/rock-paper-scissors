"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export function useSocketConnection(user) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Create socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL,
      {
        auth: {
          user: user,
        },
        transports: ["websocket", "polling"],
      },
    );

    // Connection events
    newSocket.on("connect", () => {
      setConnected(true);
      // console.log("Connected to game server");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      // console.log("Disconnected from game server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
    });

    newSocket.on("user_connected", (data) => {
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Handle socket cleanup when user changes
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user, socket]);

  return { socket, connected };
}
