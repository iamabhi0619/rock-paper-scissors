'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconConfetti, IconHeartHandshake } from '@tabler/icons-react';
import { useUserStore } from '@/store/user';

function GameFinishedSection({ gameState, onRestartGame }) {
  const user = useUserStore((state) => state.user);
  
  if (gameState?.state !== 'finished') return null;
  
  // Determine if current user won
  const isPlayer1 = gameState?.players?.player1?._id === user?._id;
  const isPlayer2 = gameState?.players?.player2?._id === user?._id;
  const userWon = (gameState.winner === 'player1' && isPlayer1) || (gameState.winner === 'player2' && isPlayer2);
  
  // Get winner message
  let winnerMessage;
  if (gameState.winner === 'tie') {
    winnerMessage = "It's a tie!";
  } else if (userWon) {
    winnerMessage = "You win!";
  } else {
    const winnerName = gameState.winner === 'player1' ? 
      gameState.players.player1?.name : 
      gameState.players.player2?.name;
    winnerMessage = `${winnerName} wins!`;
  }

  return (
    <Card className={'p-0 py-2'}>
      <CardHeader>
        <CardTitle>Game Over!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-4xl mb-4 text-center flex justify-center text-primary">
          {gameState.winner === 'tie' ? <IconHeartHandshake size={50}/> : <IconConfetti size={50}/>}
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {winnerMessage}
        </h2>
        <p className="text-lg mb-4">
          Final Score: {gameState.players.player1?.score} - {gameState.players.player2?.score}
        </p>
        <Button onClick={onRestartGame} size="lg">
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}

export default GameFinishedSection;
