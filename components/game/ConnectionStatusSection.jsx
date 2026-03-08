'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import Link from 'next/link';

function ConnectionStatusSection({ connected }) {
  if (connected) return null;

  // Generate fixed random positions once to avoid hydration mismatch
  const floatingElements = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: [84.56, 35.45, 83.38, 90.28, 79.52, 98.78][i],
      top: [82.99, 50.37, 94.01, 98.83, 12.89, 15.98][i],
      duration: 3 + (i * 0.5),
      delay: i * 0.3,
    }))
  , []);

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
          {floatingElements.map((element) => (
            <motion.div
              key={`floating-${element.id}`}
              className="absolute w-2 h-2 bg-muted/20 rounded-full"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
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
