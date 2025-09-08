'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconUser, IconTrophy, IconUsers, IconSwords } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Icons from '@/components/utility/Icons';
import { useUserStore } from '@/store/user';

const CHOICE_CONFIG = {
  rock: { emoji: '🪨', label: 'Rock' },
  paper: { emoji: '📄', label: 'Paper' },
  scissors: { emoji: '✂️', label: 'Scissors' }
};

function RoomInfoSection({ currentRoom, gameState, onLeaveRoom }) {
  const user = useUserStore((state) => state.user);
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const getGameStateVariant = (state) => {
    switch (state) {
      case 'playing': return 'default';
      case 'waiting': return 'secondary';
      case 'finished': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Room Header */}
      <Card className="overflow-hidden p-0 py-1">
        <CardHeader className="">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <IconUsers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Room {currentRoom}</CardTitle>
                <p className="text-sm text-muted-foreground">Multiplayer Battle</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLeaveRoom} className="shrink-0">
              Leave Room
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Players & Game Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Player 1 */}
        <motion.div variants={itemVariants}>
          <Card className="h-full p-0">
            <CardContent className="p-2">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <div className="p-1 rounded-full text-primary">
                    <IconUser className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">{'Player 1'}</Badge>
                </div>

                <div>
                  <p className="font-semibold text-lg">
                    {gameState?.players?.player1?.name || 'Waiting...'}
                  </p>
                  {gameState?.players?.player1?.ready && (
                    <Badge variant="default" className="mt-1 text-xs">Ready</Badge>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <IconTrophy className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {gameState?.players?.player1?.score || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Status */}
        <motion.div variants={itemVariants}>
          <Card className="h-full p-0">
            <CardContent className="p-2">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="p-2 rounded-full bg-primary/20">
                    <IconSwords className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">Game Status</Badge>
                </div>

                <Badge
                  variant={getGameStateVariant(gameState?.state)}
                  className="text-sm px-4 py-1"
                >
                  {gameState?.state === 'waiting' && 'Waiting for players'}
                  {gameState?.state === 'playing' && `Round ${(gameState?.round || 0) + 1} of ${gameState?.maxRounds || 5}`}
                  {gameState?.state === 'finished' && 'Game Finished'}
                </Badge>

                {gameState?.state === 'playing' && (
                  <div className="text-xs text-muted-foreground">
                    Battle in progress
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Player 2 */}
        <motion.div variants={itemVariants}>
          <Card className="h-full p-0">
            <CardContent className="p-2">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="p-1 rounded-full">
                    <IconUser className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <Badge variant="outline" className="text-xs">Player 2</Badge>
                </div>

                <div>
                  <p className="font-semibold text-lg">
                    {gameState?.players?.player2?.name || 'Waiting...'}
                  </p>
                  {gameState?.players?.player2?.ready && (
                    <Badge variant="default" className="mt-1 text-xs">Ready</Badge>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <IconTrophy className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">
                    {gameState?.players?.player2?.score || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Last Result Section */}
      {gameState?.lastResult && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-muted/50 to-muted/30 p-0 py-1 gap-0">
            <CardHeader className="">
              <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                <IconSwords className="h-5 w-5" />
                Last Round Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Choices Display */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Player 1 Choice */}
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {gameState.lastResult.player1.name}
                      </Badge>
                      {gameState.lastResult.player1.choice && (
                        <>
                          <Icons
                            icon={gameState.lastResult.player1.choice}
                            type="outline"
                            className="fill-primary h-8 w-8 sm:h-10 sm:w-10"
                          />
                          <p className="text-xs font-medium">
                            {CHOICE_CONFIG[gameState.lastResult.player1.choice]?.label}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-muted-foreground">VS</div>
                  </div>

                  {/* Player 2 Choice */}
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {gameState.lastResult.player2.name}
                      </Badge>
                      {gameState.lastResult.player2.choice && (
                        <>
                          <Icons
                            icon={gameState.lastResult.player2.choice}
                            type="outline"
                            className="fill-red-600 h-8 w-8 sm:h-10 sm:w-10"
                          />
                          <p className="text-xs font-medium">
                            {CHOICE_CONFIG[gameState.lastResult.player2.choice]?.label}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Result Message */}
                <div className="text-center">
                  <p className="font-semibold text-primary">
                    {gameState.lastResult.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export default RoomInfoSection;
