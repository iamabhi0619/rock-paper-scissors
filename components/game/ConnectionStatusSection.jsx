'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import Link from 'next/link';

function ConnectionStatusSection({ connected }) {
  if (connected) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const waveVariants = {
    animate: (index) => ({
      y: [0, -10, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.10, // Creates flowing wave effect
      }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-4"
            >
              <motion.div
                animate="pulse"
                className="w-24 h-24 sm:w-32 sm:h-32"
              >
                <Logo
                  width="100%"
                  height="100%"
                  className="drop-shadow-lg fill-foreground"
                  duration={3}
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="mb-3">
                Connection Status
              </Badge>
            </motion.div>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Connecting to Game Server
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-muted-foreground text-sm sm:text-base">
                Please wait while we establish a secure connection to the multiplayer game server
              </p>
            </motion.div>

            {/* <motion.div 
              variants={itemVariants}
              className="flex justify-center items-center space-x-2 py-6"
            >
              {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                  key={`wave-dot-${index}`}
                  className="w-3 h-3 bg-primary rounded-full"
                  custom={index}
                  variants={waveVariants}
                  animate="animate"
                />
              ))}
            </motion.div> */}

            <motion.div variants={itemVariants}>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>Initializing WebSocket</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3].map((index) => (
                      <motion.div
                        key={`mini-wave-${index}`}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                        custom={index}
                        variants={waveVariants}
                        animate="animate"
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  className="w-full bg-muted rounded-full h-2"
                  variants={itemVariants}
                >
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pt-2 space-y-1"
            >
              <p className="text-xs text-muted-foreground">
                A personal project by <Link className="text-primary font-medium" href={'https://iamabhi.tech'} rel='noopener noreferrer' target='_blank'>Abhishek Kumar</Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Having trouble? Check your connection
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Floating background elements */}
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          variants={itemVariants}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`floating-${i}-${Math.random()}`}
              className="absolute w-2 h-2 bg-muted/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ConnectionStatusSection;
