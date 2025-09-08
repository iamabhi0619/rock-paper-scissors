'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Icons from '@/components/utility/Icons';
import { cn } from '@/lib/utils';

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

function GameControlsSection({ 
  gameState, 
  userChoice, 
  canMakeChoice, 
  isMyTurn, 
  onMakeChoice 
}) {
  if (gameState?.state !== 'playing') return null;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { scale: 1, opacity: 0.6 }
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full p-3 gap-1">
        <CardHeader className="">
          <CardTitle className="text-center text-lg">
            {!canMakeChoice && userChoice ? 'Waiting for opponent...' : 'Make your choice!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(CHOICE_CONFIG).map(([choice, config]) => (
              <motion.div
                key={choice}
                variants={buttonVariants}
                whileHover={!canMakeChoice ? "disabled" : "hover"}
                whileTap={!canMakeChoice ? "disabled" : "tap"}
              >
                <Button
                  variant={userChoice === choice ? "default" : "outline"}
                  className={cn(
                    "w-full h-20 flex flex-col gap-2 hover:border-primary transition-all duration-200",
                    userChoice === choice && "ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground",
                    !canMakeChoice && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => onMakeChoice(choice)}
                  disabled={!canMakeChoice}
                >
                  <Icons 
                    icon={choice} 
                    type="outline" 
                    className={cn(
                      "size-8 transition-colors duration-200",
                      userChoice === choice ? "fill-primary-foreground" : "fill-primary"
                    )} 
                  />
                  <span className="text-sm font-semibold">{config.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
          
          {/* Status Messages */}
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {!canMakeChoice && userChoice && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✅
                </motion.div>
                <span>Choice made! Waiting for opponent...</span>
                <div className="flex space-x-1 ml-2">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={`waiting-${index}`}
                      className="w-1.5 h-1.5 bg-green-600 rounded-full"
                      animate={{
                        y: [0, -8, 0],
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
            
            {!canMakeChoice && !userChoice && !isMyTurn && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full"
                />
                <span>Waiting for your turn...</span>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default GameControlsSection;
