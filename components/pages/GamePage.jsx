"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/context/Socket";
import { useUserStore } from "@/store/user";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconMessageCircle } from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Import game components
import ConnectionStatusSection from "@/components/game/ConnectionStatusSection";
import RoomJoinSection from "@/components/game/RoomJoinSection";
import RoomInfoSection from "@/components/game/RoomInfoSection";
import GameControlsSection from "@/components/game/GameControlsSection";
import GameFinishedSection from "@/components/game/GameFinishedSection";
import ChatSection from "@/components/game/ChatSection";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BotGame } from "../bot";

function GamePage() {
  const { user } = useUserStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  // Close mobile chat when leaving room
  useEffect(() => {
    if (!currentRoom) {
      setIsChatOpen(false);
    }
  }, [currentRoom]);

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
    <div className="min-h-dvh flex flex-col w-full">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col pb-3">
        {/* Header */}
        <div className="text-center py-4 shrink-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
            Rock Paper Scissors
          </h1>
          <div className="flex items-center flex-col sm:flex-row w-full justify-center gap-0 sm:gap-2">
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
        </div>

        {/* Main Content Area - Takes remaining height */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {!currentRoom ? (
            /* Room Selection */
            <div className="h-full flex flex-col space-y-4 overflow-hidden">
              <div className="shrink-0">
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
            <div className="h-full grid grid-cols-1 md:grid-cols-7 gap-2 overflow-hidden">
              <div className="col-span-1 md:col-span-5 flex flex-col space-y-2 overflow-hidden">
                <div className="shrink-0">
                  <RoomInfoSection
                    currentRoom={currentRoom}
                    gameState={gameState}
                    onLeaveRoom={leaveRoom}
                  />
                </div>

                <div className="shrink-0">
                  <GameControlsSection
                    gameState={gameState}
                    userChoice={userChoice}
                    canMakeChoice={canMakeChoice}
                    isMyTurn={isMyTurn}
                    onMakeChoice={onMakeChoice}
                  />
                </div>

                <div className="shrink-0">
                  <GameFinishedSection
                    gameState={gameState}
                    onRestartGame={restartGame}
                  />
                </div>
              </div>

              {/* Desktop Chat - Hidden on Mobile */}
              <div className="hidden md:block col-span-2 h-full overflow-hidden">
                <ChatSection messages={messages} onSendMessage={sendMessage} />
              </div>

              {/* Mobile Chat - Sheet */}
              <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                <SheetContent
                  side="bottom"
                  className="max-h-[85dvh] min-h-[50dvh] h-auto p-0 md:hidden flex flex-col"
                  showCloseButton={false}
                >
                  <SheetHeader className="p-4 border-b shrink-0">
                    <SheetTitle>Chat</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ChatSection messages={messages} onSendMessage={sendMessage} isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Chat Toggle Button - Only show when in a room */}
              {currentRoom && (
                <div
                  onClick={() => setIsChatOpen(true)}
                  className="md:hidden fixed bottom-7 right-4 z-40 h-14 w-14 rounded-full shadow flex items-center justify-center bg-primary text-primary-foreground cursor-pointer"
                >
                  <div className="relative">
                    <IconMessageCircle className="h-7 w-7" />
                    {messages.length > 0 && (
                      <span className="absolute -top-5 -right-3 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                        {messages.length > 9 ? '9+' : messages.length}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
