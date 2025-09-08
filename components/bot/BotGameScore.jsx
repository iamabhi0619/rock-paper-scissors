'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconUser, IconRobot, IconTrophy } from '@tabler/icons-react';

function BotGameScore({ playerScore, botScore }) {
    const totalGames = playerScore + botScore;
    const playerWinRate = totalGames > 0 ? (playerScore / totalGames) * 100 : 0;

    return (
        <Card className={'w-full h-fit gap-2 p-2 max-w-sm'}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconTrophy className="h-5 w-5" />
                    Current Score
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {/* Player Score */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <IconUser className="h-5 w-5 text-primary" />
                            <span className="font-medium">You</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">{playerScore}</div>
                        <Badge variant={playerScore > botScore ? "default" : "secondary"}>
                            {playerScore > botScore ? "Leading" : playerScore < botScore ? "Behind" : "Tied"}
                        </Badge>
                    </div>

                    {/* Bot Score */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <IconRobot className="h-5 w-5 text-primary" />
                            <span className="font-medium">Bot</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">{botScore}</div>
                        <Badge variant={botScore > playerScore ? "default" : "secondary"}>
                            {botScore > playerScore ? "Leading" : botScore < playerScore ? "Behind" : "Tied"}
                        </Badge>
                    </div>
                </div>

                {/* Win Rate */}
                {totalGames > 0 && (
                    <div className="mt-1 border-t">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Your Win Rate</p>
                            <p className="text-lg font-semibold text-primary">
                                {playerWinRate.toFixed(0)}%
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default BotGameScore;
