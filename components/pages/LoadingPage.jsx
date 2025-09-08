"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Logo from "../Logo";

const LoadingPage = ({ className, children, ...props }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {/* Background animated patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full animate-pulse blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full animate-pulse blur-3xl animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-muted/5 rounded-full animate-spin-slow blur-2xl" />
      </div>

      {/* Main loading content */}
      <Card className="relative z-10 w-full max-w-md mx-4 flex flex-col items-center justify-center p-8 space-y-6 bg-card/95 backdrop-blur-md border-border/50 shadow-2xl">
        {/* Logo container with multiple animations */}

        <Logo
          className="relative text-primary fill-muted-foreground animate-fade-in"
          height="40%"
          width="40%"
          duration={2}
          strokeWidth={1}
        />

        {/* Loading text with typewriter effect */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground animate-fade-in">
            Rock Paper Scissors
          </h2>
          <p className="text-sm text-muted-foreground animate-fade-in-delay">
            Loading your game{dots}
          </p>
        </div>

        {/* Animated progress indicators */}
        <div className="w-full space-y-4">
          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={`dot-${i}`}
                className={cn(
                  "w-2 h-2 rounded-full bg-primary animate-pulse",
                  `animation-delay-${i * 200}`,
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Animated progress bar */}
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-loading-bar" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => {
            const particleId = `particle-${Math.random().toString(36).substr(2, 9)}-${i}`;
            return (
              <div
                key={particleId}
                className={cn(
                  "absolute w-1 h-1 bg-primary/30 rounded-full animate-float",
                  `animation-delay-${i * 1000}`,
                )}
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + i * 8}%`,
                  animationDelay: `${i * 1}s`,
                }}
              />
            );
          })}
        </div>
      </Card>

      {children}
    </div>
  );
};

export default LoadingPage;
