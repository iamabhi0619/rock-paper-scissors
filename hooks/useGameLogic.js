"use client";

import { useState, useEffect } from "react";

export function useGameLogic(gameState, user) {
  const [userChoice, setUserChoice] = useState(null);

  // Reset user choice when new round starts
  useEffect(() => {
    if (gameState?.players?.player1?.ready === false && gameState?.players?.player2?.ready === false) {
      setUserChoice(null);
    }
  }, [gameState?.players?.player1?.ready, gameState?.players?.player2?.ready]);

  // Calculate if it's user's turn
  const isMyTurn = gameState?.state === 'playing' && 
    ((gameState?.players?.player1?._id === user?._id && !gameState?.players?.player1?.ready) ||
     (gameState?.players?.player2?._id === user?._id && !gameState?.players?.player2?.ready));

  const canMakeChoice = isMyTurn && !userChoice && gameState?.state === 'playing';

  const handleMakeChoice = (choice, makeChoiceCallback) => {
    if (gameState?.state === 'playing' && !userChoice) {
      setUserChoice(choice);
      makeChoiceCallback(choice);
    }
  };

  return {
    userChoice,
    setUserChoice,
    isMyTurn,
    canMakeChoice,
    handleMakeChoice,
  };
}
