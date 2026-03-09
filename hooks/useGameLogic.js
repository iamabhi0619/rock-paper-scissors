"use client";

import { useState, useEffect, useCallback } from "react";

const TIMER_DURATION = 10; // 10 seconds

export function useGameLogic(gameState, user, socket) {
  const [userChoice, setUserChoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Reset user choice when new round starts or game is reset
  useEffect(() => {
    // console.log('Game state changed - player1 ready:', gameState?.players?.player1?.ready, 'player2 ready:', gameState?.players?.player2?.ready, 'round:', gameState?.round);
    if (gameState?.players?.player1?.ready === false && gameState?.players?.player2?.ready === false) {
      // console.log('Both players not ready - clearing user choice');
      setUserChoice(null);
      setTimeLeft(null);
      setTimerActive(false);
    }
  }, [gameState?.players?.player1?.ready, gameState?.players?.player2?.ready, gameState?.round]);

  // Determine if opponent has made choice
  const isPlayer1 = gameState?.players?.player1?._id === user?._id;
  const isPlayer2 = gameState?.players?.player2?._id === user?._id;

  const opponentReady = isPlayer1
    ? gameState?.players?.player2?.ready
    : gameState?.players?.player1?.ready;

  // Calculate if it's user's turn
  const isMyTurn = gameState?.state === 'playing' &&
    ((isPlayer1 && !gameState?.players?.player1?.ready) ||
      (isPlayer2 && !gameState?.players?.player2?.ready));

  const canMakeChoice = isMyTurn && !userChoice && gameState?.state === 'playing';

  // Timer logic - start when opponent makes choice
  useEffect(() => {
    if (gameState?.state === 'playing' && opponentReady && !userChoice && isMyTurn) {
      // Opponent has chosen, user hasn't - start timer
      setTimeLeft(TIMER_DURATION);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      setTimeLeft(null);
    }
  }, [gameState?.state, opponentReady, userChoice, isMyTurn]);

  // Countdown timer
  useEffect(() => {
    // Check for timeout FIRST, before checking if timer is active
    if (timeLeft === 0 && !timerActive) {
      // Timer expired - emit timeout event
      if (socket) {
        socket.emit('choice_timeout');
      } else {
        console.error('No socket available to emit timeout event');
      }
      setTimeLeft(null);
      setUserChoice(null); // Reset user choice on timeout
      return;
    }

    if (!timerActive || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft, socket]);

  const handleMakeChoice = useCallback((choice, makeChoiceCallback) => {
    if (gameState?.state === 'playing' && !userChoice) {
      setUserChoice(choice);
      setTimerActive(false);
      setTimeLeft(null);
      makeChoiceCallback(choice);
    }
  }, [gameState?.state, userChoice]);

  return {
    userChoice,
    setUserChoice,
    isMyTurn,
    canMakeChoice,
    handleMakeChoice,
    timeLeft,
    timerActive,
  };
}
