'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Icons from '@/components/utility/Icons';

const CHOICE_CONFIG = {
    rock: {
        label: 'Rock',
        emoji: '🪨',
        color: 'text-slate-600'
    },
    paper: {
        label: 'Paper',
        emoji: '📄',
        color: 'text-blue-600'
    },
    scissors: {
        label: 'Scissors',
        emoji: '✂️',
        color: 'text-red-600'
    }
};

function BotGameControls({ onPlayerChoice, disabled, isPlaying }) {
    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
        disabled: { scale: 1, opacity: 0.6 }
    };

    return (
        <Card className={'w-full h-full gap-2 p-2'}>
            <CardHeader>
                <CardTitle className="text-center">
                    {isPlaying ? 'Bot turn' : 'Make your choice!'}
                </CardTitle>
            </CardHeader>
            <CardContent className={'flex justify-between items-center px-16'}>
                <motion.div
                    className="text-center mb-2 rotate-90 origin-[left center]"
                    // animate={{
                    //     rotate: [0, 10, -10, 5, -5, 0]
                    // }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                >
                    <Icons className='fill-primary size-30' />
                </motion.div>
                <motion.div
                    className='flex justify-center mb-2 -rotate-90 transform rotate-y-180'
                    // animate={{
                    //     rotate: [90, 100, -100, 95, 85, 90]
                    // }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                >
                    <Icons className='fill-primary size-30' />
                </motion.div>
            </CardContent>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(CHOICE_CONFIG).map(([choice]) => {
                        return (
                            <motion.div
                                key={choice}
                                variants={buttonVariants}
                                whileHover={disabled ? "disabled" : "hover"}
                                whileTap={disabled ? "disabled" : "tap"}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full h-24 flex flex-col gap-1 hover:border-primary"
                                    onClick={() => onPlayerChoice(choice)}
                                    disabled={disabled}
                                >
                                    <Icons icon={choice} type="outline" className="fill-primary size-10 hover:fill-accent" />
                                    <span className="text-lg font-semibold">{CHOICE_CONFIG[choice].label}</span>
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>

                {isPlaying && (
                    <div className="flex justify-center mt-4">
                        <div className="flex space-x-1">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={`thinking-${index}`}
                                    className="w-2 h-2 bg-primary rounded-full"
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: index * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default BotGameControls;
