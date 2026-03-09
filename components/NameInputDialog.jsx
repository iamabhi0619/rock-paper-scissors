"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/user";

export default function NameInputDialog({ isOpen, onClose }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { user, setUserName } = useUserStore();

  // Sync external open state
  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
      if (isOpen) {
        setName(""); // Reset input when opening
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Check if user has already set their name
    const hasSetName = localStorage.getItem("hasSetName");
    const savedName = localStorage.getItem("userName");
    
    // Only show dialog if never prompted before (and not controlled externally)
    if (!hasSetName && isOpen === undefined) {
      setOpen(true);
    }
    
    // Pre-fill with saved name if exists
    if (savedName && savedName !== user.name) {
      setName(savedName);
    }
  }, [user.name, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name);
      localStorage.setItem("userName", name.trim());
    }
    // Mark that the user has been prompted
    localStorage.setItem("hasSetName", "true");
    setOpen(false);
    if (onClose) onClose();
  };

  const handleSkip = () => {
    // Keep the random guest name but save it
    localStorage.setItem("userName", user.name);
    localStorage.setItem("hasSetName", "true");
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only prevent closing if it's the initial welcome dialog
      if (!newOpen && isOpen === undefined) {
        // Initial dialog - don't allow closing without action
        return;
      }
      setOpen(newOpen);
      if (!newOpen && onClose) {
        onClose();
      }
    }}>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => {
          // Only prevent outside clicks for initial dialog
          if (isOpen === undefined) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{isOpen ? "Change Your Name" : "Welcome to Rock Paper Scissors!"}</DialogTitle>
          <DialogDescription>
            {isOpen 
              ? "Enter a new name to update your profile."
              : "Enter your name to personalize your gaming experience. If you skip, you'll be assigned a random guest name."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder={user.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Current name: {user.name}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleSkip}>
              {isOpen ? "Cancel" : "Skip"}
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
