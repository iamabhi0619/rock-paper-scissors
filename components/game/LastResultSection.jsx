'use client';

import { Card, CardContent } from '@/components/ui/card';

function LastResultSection({ gameState }) {
  if (!gameState?.lastResult) return null;

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">Last Round Result:</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">{gameState.lastResult.player1.name}</p>
            <p className="text-2xl">{
              gameState.lastResult.player1.choice === 'rock' ? '🪨' :
              gameState.lastResult.player1.choice === 'paper' ? '📄' : '✂️'
            }</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-semibold">VS</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{gameState.lastResult.player2.name}</p>
            <p className="text-2xl">{
              gameState.lastResult.player2.choice === 'rock' ? '🪨' :
              gameState.lastResult.player2.choice === 'paper' ? '📄' : '✂️'
            }</p>
          </div>
        </div>
        <p className="text-center mt-2 font-medium">
          {gameState.lastResult.message}
        </p>
      </CardContent>
    </Card>
  );
}

export default LastResultSection;
