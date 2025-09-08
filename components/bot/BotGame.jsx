'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconTrophy, IconRefresh, IconRobotFace } from '@tabler/icons-react';
import BotGameControls from './BotGameControls';
import BotGameResult from './BotGameResult';
import BotGameScore from './BotGameScore';

const CHOICES = ['rock', 'paper', 'scissors'];
const MAX_ROUNDS = 5;

function BotGame() {
    const [gameState, setGameState] = useState({
        currentRound: 1,
        playerScore: 0,
        botScore: 0,
        playerChoice: null,
        botChoice: null,
        roundResult: null,
        gameFinished: false,
        gameResult: null
    });

    const [isPlaying, setIsPlaying] = useState(false);

    const getBotChoice = () => {
        return CHOICES[Math.floor(Math.random() * CHOICES.length)];
    };

    const determineWinner = (playerChoice, botChoice) => {
        if (playerChoice === botChoice) return 'tie';

        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        return winConditions[playerChoice] === botChoice ? 'player' : 'bot';
    };

    const handlePlayerChoice = (choice) => {
        if (gameState.gameFinished || isPlaying) return;

        setIsPlaying(true);
        const botChoice = getBotChoice();
        const result = determineWinner(choice, botChoice);

        setGameState(prev => {
            const newPlayerScore = prev.playerScore + (result === 'player' ? 1 : 0);
            const newBotScore = prev.botScore + (result === 'bot' ? 1 : 0);
            const newRound = prev.currentRound + 1;
            const gameFinished = newRound > MAX_ROUNDS;

            let gameResult = null;
            if (gameFinished) {
                if (newPlayerScore > newBotScore) gameResult = 'player';
                else if (newBotScore > newPlayerScore) gameResult = 'bot';
                else gameResult = 'tie';
            }

            return {
                ...prev,
                playerChoice: choice,
                botChoice,
                roundResult: result,
                playerScore: newPlayerScore,
                botScore: newBotScore,
                currentRound: gameFinished ? prev.currentRound : newRound,
                gameFinished,
                gameResult
            };
        });
        setIsPlaying(false);
    };

    const resetGame = () => {
        setGameState({
            currentRound: 1,
            playerScore: 0,
            botScore: 0,
            playerChoice: null,
            botChoice: null,
            roundResult: null,
            gameFinished: false,
            gameResult: null
        });
        setIsPlaying(false);
    };

    const progressValue = gameState.gameFinished ? 100 : ((gameState.currentRound - 1) / MAX_ROUNDS) * 100;
    const displayRound = gameState.gameFinished ? MAX_ROUNDS : gameState.currentRound - 1;

    return (
        <Card className="gap-2 w-full">
            {/* Game Header */}
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <IconRobotFace className="h-6 w-6 text-primary" />
                        Want to kill some time? Play against the bot!
                    </div>
                    <div className='flex gap-4 items-center'>
                        <div className="flex items-center gap-2 min-w-[120px]">
                            <Progress value={progressValue} className="w-full h-2" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {Math.round(progressValue)}%
                            </span>
                        </div>
                        <Badge variant="outline">
                            Round {displayRound} of {MAX_ROUNDS}
                        </Badge>
                    </div>

                </CardTitle>

            </CardHeader>
            <CardContent className="grid gap-4 w-full grid-cols-1 md:grid-cols-7 ">
                <div className='w-full flex flex-col gap-4 col-span-5'>
                    {/* Game Controls */}
                    {!gameState.gameFinished && (
                        <BotGameControls
                            onPlayerChoice={handlePlayerChoice}
                            disabled={isPlaying}
                            isPlaying={isPlaying}
                        />
                    )}

                    {/* Game Finished */}
                    {gameState.gameFinished && (
                        <Card>
                            <CardContent className="text-center py-8">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <IconTrophy className="h-12 w-12 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">
                                            {gameState.gameResult === 'player' && 'Congratulations! 🎉'}
                                            {gameState.gameResult === 'bot' && 'Bot Wins! 🤖'}
                                            {gameState.gameResult === 'tie' && "It's a Tie! 🤝"}
                                        </h3>
                                        <p className="text-muted-foreground mt-2">
                                            Final Score: You {gameState.playerScore} - {gameState.botScore} Bot
                                        </p>
                                    </div>
                                    <Button onClick={resetGame} className="mt-4">
                                        <IconRefresh className="mr-2 h-4 w-4" />
                                        Play Again
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className='w-full flex flex-col gap-2 col-span-2'>
                    <BotGameScore
                        playerScore={gameState.playerScore}
                        botScore={gameState.botScore}
                    />
                    {/* Round Result */}
                    {(gameState.playerChoice && gameState.botChoice) && (
                        <BotGameResult
                            playerChoice={gameState.playerChoice}
                            botChoice={gameState.botChoice}
                            roundResult={gameState.roundResult}
                            gameFinished={gameState.gameFinished}
                            gameResult={gameState.gameResult}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default BotGame;
