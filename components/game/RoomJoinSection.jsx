'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { IconPlus, IconLock, IconWorld } from '@tabler/icons-react';
import AvailableRoomsSection from './AvailableRoomsSection';

function RoomJoinSection({ onJoinRoom, onCreateRoom, availableRooms, joinRoom, getAvailableRooms }) {
  const [roomInput, setRoomInput] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      onJoinRoom(roomInput.trim().toUpperCase());
      setRoomInput('');
    }
  };

  const handleCreate = (isPrivate) => {
    onCreateRoom(isPrivate);
    setCreateDialogOpen(false);
  };

  return (
    <Card className={"shadow-lg gap-1 p-3 px-0"}>
      <CardHeader className={'text-xl'}>
        <CardTitle>Play with Friends - Join Room</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter room ID..."
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
          <Button onClick={handleJoinRoom}>Join</Button>
        </div>

        <div className='gap-2 grid grid-cols-1 md:grid-cols-2'>
          {/* Create Room Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer w-full">
                <IconPlus className="mr-2 h-4 w-4" />
                Create New Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Create Game Room</DialogTitle>
                <DialogDescription>
                  Choose who can find and join your room.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Public Room */}
                <button
                  onClick={() => handleCreate(false)}
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="rounded-full bg-green-500/10 p-3">
                    <IconWorld className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-sm">
                      Public
                      <Badge variant="secondary" className="text-xs ml-1">Open</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Anyone can find and join via Browse Rooms
                    </p>
                  </div>
                </button>

                {/* Private Room */}
                <button
                  onClick={() => handleCreate(true)}
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="rounded-full bg-orange-500/10 p-3">
                    <IconLock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-sm">
                      Private
                      <Badge variant="outline" className="text-xs ml-1">Invite</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only joinable via shared link or room ID
                    </p>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>

          <AvailableRoomsSection
            availableRooms={availableRooms}
            onJoinRoom={joinRoom}
            onRefreshRooms={getAvailableRooms}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default RoomJoinSection;
