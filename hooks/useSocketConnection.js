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
        // Keep reconnection enabled (default) — let socket.io handle it
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: Infinity,
      },
    );

    // Connection events
    newSocket.on("connect", () => {
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
    });

    newSocket.on("user_connected", (data) => {
    });

    setSocket(newSocket);

    // When the page becomes visible again (e.g. returning from share sheet or
    // switching back from another app), ensure the socket is still connected.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !newSocket.connected) {
        newSocket.connect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
