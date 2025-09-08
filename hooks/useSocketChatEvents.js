"use client";

import { useState, useEffect } from "react";

export function useSocketChatEvents(socket) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Chat events
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clear messages on disconnect
    socket.on("disconnect", () => {
      setMessages([]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket]);

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    setMessages,
    clearMessages,
  };
}
