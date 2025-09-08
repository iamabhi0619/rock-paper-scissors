'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconUser, IconRobot } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Icons from '@/components/utility/Icons';

const CHOICE_CONFIG = {
    rock: { emoji: '🪨', label: 'Rock' },
    paper: { emoji: '📄', label: 'Paper' },
    scissors: { emoji: '✂️', label: 'Scissors' }
};

function BotGameResult({ playerChoice, botChoice, roundResult, gameFinished }) {
    const getResultColor = (result) => {
        switch (result) {
            case 'player': return 'text-green-600';
            case 'bot': return 'text-red-600';
            case 'tie': return 'text-yellow-600';
            default: return 'text-muted-foreground';
        }
    };

    const getResultText = (result) => {
        switch (result) {
            case 'player': return 'You Win This Round!';
            case 'bot': return 'Bot Wins This Round!';
            case 'tie': return "It's a Tie!";
            default: return '';
        }
    };

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
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className={'w-full h-fit gap-2 p-2 max-w-sm'}>
                <CardHeader>
                    <CardTitle className="text-center">
                        {gameFinished ? 'Final Round Result' : 'Round Result'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {/* Choices Display */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            {/* Player Choice */}
                            <motion.div variants={itemVariants} className="text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <Badge variant="outline"><IconUser className="h-6 w-6 text-primary" /> <span>You </span></Badge>
                                    <Icons icon={playerChoice} type="outline" size="xl" className="fill-primary h-12 w-12" />
                                    <p className="text-sm font-medium">{CHOICE_CONFIG[playerChoice]?.label}</p>
                                </div>
                            </motion.div>

                            {/* VS */}
                            <motion.div variants={itemVariants} className="text-center">
                                <div className="text-2xl font-bold text-muted-foreground">VS</div>
                            </motion.div>

                            {/* Bot Choice */}
                            <motion.div variants={itemVariants} className="text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <Badge variant="outline"><IconRobot className="h-6 w-6 text-primary" /> <span>Bot</span></Badge>
                                    <Icons icon={botChoice} type="outline" className="fill-primary h-12 w-12" />
                                    <p className="text-sm font-medium">{CHOICE_CONFIG[botChoice]?.label}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Result */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center"
                        >
                            <div className={`text-xl font-bold ${getResultColor(roundResult)}`}>
                                {getResultText(roundResult)}
                            </div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default BotGameResult;
