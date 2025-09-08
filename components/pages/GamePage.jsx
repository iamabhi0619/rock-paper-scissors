"use client";

import { useEffect } from "react";
import { useSocket } from "@/context/Socket";
import { useUserStore } from "@/store/user";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Badge } from "@/components/ui/badge";

// Import game components
import ConnectionStatusSection from "@/components/game/ConnectionStatusSection";
import RoomJoinSection from "@/components/game/RoomJoinSection";
import AvailableRoomsSection from "@/components/game/AvailableRoomsSection";
import RoomInfoSection from "@/components/game/RoomInfoSection";
import GameControlsSection from "@/components/game/GameControlsSection";
import GameFinishedSection from "@/components/game/GameFinishedSection";
import ChatSection from "@/components/game/ChatSection";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BotGame } from "../bot";

function GamePage() {
  const { user } = useUserStore();
  const {
    connected,
    currentRoom,
    gameState,
    messages,
    availableRooms,
    joinRoom,
    leaveRoom,
    makeChoice,
    restartGame,
    getAvailableRooms,
    sendMessage,
  } = useSocket();

  // Game logic hook
  const { userChoice, isMyTurn, canMakeChoice, handleMakeChoice } =
    useGameLogic(gameState, user);

  useEffect(() => {
    if (connected) {
      getAvailableRooms();
    }
  }, [connected, getAvailableRooms]);

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = () => {
    const roomId = generateRoomId();
    joinRoom(roomId);
  };

  const onMakeChoice = (choice) => {
    handleMakeChoice(choice, makeChoice);
  };

  // Show connection status if not connected
  if (!connected) {
    return <ConnectionStatusSection connected={connected} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col pb-3">
        {/* Header */}
        <div className="text-center py-4 flex-shrink-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
            Rock Paper Scissors
          </h1>
          <p className="text-muted-foreground">Multiplayer Online Game - Want to make any decision?</p>
          <Tooltip >
            <TooltipTrigger>
              <Badge
                variant={connected ? "default" : "destructive"}
                className="cursor-help"
              >
                {connected ? "Connected" : "Disconnected"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {connected
                ? "You are connected to the game server."
                : "You are disconnected. Please check your internet connection."}
            </TooltipContent>

          </Tooltip>
        </div>

        {/* Main Content Area - Takes remaining height */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {!currentRoom ? (
            /* Room Selection */
            <div className="h-full flex flex-col space-y-4 overflow-hidden">
              <div className="flex-shrink-0">
                <RoomJoinSection
                  onJoinRoom={joinRoom}
                  onCreateRoom={handleCreateRoom}
                  availableRooms={availableRooms}
                  joinRoom={joinRoom}
                  getAvailableRooms={getAvailableRooms}
                />
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <BotGame />
              </div>
            </div>
          ) : (
            /* Game Room */
            <div className="h-full grid grid-cols-7 gap-2 overflow-hidden">
              <div className="col-span-5 flex flex-col space-y-2 overflow-hidden">
                <div className="flex-shrink-0">
                  <RoomInfoSection
                    currentRoom={currentRoom}
                    gameState={gameState}
                    onLeaveRoom={leaveRoom}
                  />
                </div>

                <div className="flex-shrink-0">
                  <GameControlsSection
                    gameState={gameState}
                    userChoice={userChoice}
                    canMakeChoice={canMakeChoice}
                    isMyTurn={isMyTurn}
                    onMakeChoice={onMakeChoice}
                  />
                </div>

                <div className="flex-shrink-0">
                  <GameFinishedSection
                    gameState={gameState}
                    onRestartGame={restartGame}
                  />
                </div>
              </div>

              <div className="col-span-2 h-full overflow-hidden">
                <ChatSection messages={messages} onSendMessage={sendMessage} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
