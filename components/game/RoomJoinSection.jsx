'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AvailableRoomsSection from './AvailableRoomsSection';

function RoomJoinSection({ onJoinRoom, onCreateRoom, availableRooms, joinRoom, getAvailableRooms }) {
  const [roomInput, setRoomInput] = useState('');

  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      onJoinRoom(roomInput.trim());
      setRoomInput('');
    }
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
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
          <Button onClick={handleJoinRoom}>Join</Button>
        </div>

        <div className='gap-2 grid grid-cols-1 md:grid-cols-2'>
          <Button
            onClick={onCreateRoom}
            className="cursor-pointer w-full"
          >
            Create New Room
          </Button>
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
