'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconConfetti, IconHeartHandshake } from '@tabler/icons-react';

function GameFinishedSection({ gameState, onRestartGame }) {
  if (gameState?.state !== 'finished') return null;

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
          {gameState.winner === 'tie' ?
            "It's a tie!" :
            gameState.winner === 'player1' ?
              `${gameState.players.player1?.name} wins!` :
              `${gameState.players.player2?.name} wins!`
          }
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
