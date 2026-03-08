"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useSocketGameEvents(socket, user, setGameState) {
  useEffect(() => {
    if (!socket) return;

    // Game events
    socket.on("game_start", (data) => {
      setGameState(data.room);
      console.log("Game started:", data);
    });

    socket.on("choice_made", (data) => {
      console.log("Choice made:", data.choice);
    });

    socket.on("opponent_chose", (data) => {
      console.log("Opponent chose:", data.message);
    });

    socket.on("round_result", (data) => {
      setGameState(data.room);
      console.log("Round result:", data.message);
    });

    socket.on("game_state_updated", (data) => {
      setGameState(data.room);
      if (data.message) {
        console.log("Game state updated:", data.message);
      }
    });

    socket.on("game_finished", (data) => {
      setGameState(data.room);
      console.log("Game finished:", data.finalMessage);
    });

    socket.on("game_restarted", (data) => {
      setGameState(data.room);
      console.log("Game restarted:", data.message);
    });

    socket.on("game_error", (data) => {
      toast.error(data.message);
    });

    return () => {
      socket.off("game_start");
      socket.off("choice_made");
      socket.off("opponent_chose");
      socket.off("round_result");
      socket.off("game_state_updated");
      socket.off("game_finished");
      socket.off("game_restarted");
      socket.off("game_error");
    };
  }, [socket, user, setGameState]);
}
