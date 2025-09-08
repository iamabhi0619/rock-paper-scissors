'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function GameFinishedSection({ gameState, onRestartGame }) {
  if (gameState?.state !== 'finished') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Over!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-6xl mb-4">
          {gameState.winner === 'tie' ? '🤝' : '🎉'}
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {gameState.winner === 'tie' ? 
            "It's a tie!" :
            gameState.winner === 'player1' ?
              `${gameState.players.player1.name} wins!` :
              `${gameState.players.player2.name} wins!`
          }
        </h2>
        <p className="text-lg mb-4">
          Final Score: {gameState.players.player1.score} - {gameState.players.player2.score}
        </p>
        <Button onClick={onRestartGame} size="lg">
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}

export default GameFinishedSection;
