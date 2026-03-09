'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function CircularTimer({ timeLeft, totalTime = 10, onTimeout }) {
  const [displayTime, setDisplayTime] = useState(timeLeft);

  useEffect(() => {
    setDisplayTime(timeLeft);
    
    if (timeLeft <= 0 && onTimeout) {
      onTimeout();
    }
  }, [timeLeft, onTimeout]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayTime / totalTime) * circumference;
  
  // Color changes based on time left
  const getColor = () => {
    if (displayTime <= 3) return '#ef4444'; // red
    if (displayTime <= 6) return '#f59e0b'; // orange
    return '#10b981'; // green
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-muted"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke={getColor()}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
            animate={{ 
              strokeDasharray: circumference,
              strokeDashoffset: circumference - progress 
            }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>
        
        {/* Timer text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayTime}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold"
            style={{ color: getColor() }}
          >
            {displayTime}
          </motion.span>
          <span className="text-xs text-muted-foreground">seconds</span>
        </div>
      </div>
      
      <motion.p
        className="text-sm font-medium text-center"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ color: getColor() }}
      >
        Make your choice!
      </motion.p>
    </div>
  );
}

export default CircularTimer;
