'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { IconRefresh, IconUsers, IconPlus } from '@tabler/icons-react';
import { ScrollArea } from '../ui/scroll-area';

function AvailableRoomsSection({ availableRooms, onJoinRoom, onRefreshRooms }) {
  const [open, setOpen] = useState(false);

  const handleRefresh = () => {
    onRefreshRooms();
  };

  const handleJoinRoom = (roomId) => {
    onJoinRoom(roomId);
    setOpen(false); // Close dialog after joining
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={handleRefresh}>
          <IconUsers className="mr-2 h-4 w-4" />
          Browse Available Rooms
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={'mt-3 gap-0'}>
          <DialogTitle className="flex items-center justify-between">
            Available Game Rooms
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 cursor-pointer"
            >
              <IconRefresh className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Select a room to join or create a new one
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {availableRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="rounded-full bg-muted p-3">
                <IconPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">No rooms available</p>
                <p className="text-xs text-muted-foreground">
                  Be the first to create a game room!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {availableRooms.map((room) => (
                <Card key={room.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{room.id}</p>
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created by: {room.creator}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinRoom(room.id)}
                      className="shrink-0"
                    >
                      Join
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AvailableRoomsSection;
