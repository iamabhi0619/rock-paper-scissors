"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useSocketGameEvents(socket, user, setGameState) {
  useEffect(() => {
    if (!socket) return;

    // Game events
    socket.on("game_start", (data) => {
      setGameState(data.room);
      toast.success("Game started! Make your choice.");
    });

    socket.on("choice_made", (data) => {
      toast.success(`You chose ${data.choice}!`);
    });

    socket.on("opponent_chose", (data) => {
      toast.info(data.message);
    });

    socket.on("round_result", (data) => {
      setGameState(data.room);

      if (data.winner === "tie") {
        toast.info(data.message);
      } else {
        const isWinner =
          (data.winner === "player1" && data.player1.name === user.name) ||
          (data.winner === "player2" && data.player2.name === user.name);

        if (isWinner) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    });

    socket.on("game_state_updated", (data) => {
      setGameState(data.room);
      if (data.message) {
        toast.info(data.message);
      }
    });

    socket.on("game_finished", (data) => {
      setGameState(data.room);

      if (data.gameWinner === "tie") {
        toast.info(data.finalMessage);
      } else {
        const isGameWinner =
          (data.gameWinner === "player1" && data.player1.name === user.name) ||
          (data.gameWinner === "player2" && data.player2.name === user.name);

        if (isGameWinner) {
          toast.success(data.finalMessage);
        } else {
          toast.error(data.finalMessage);
        }
      }
    });

    socket.on("game_restarted", (data) => {
      setGameState(data.room);
      toast.success(data.message);
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
