'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/user';

function ChatSection({ messages, onSendMessage }) {
  const [chatMessage, setChatMessage] = useState('');
  const scrollAreaRef = useRef(null);
  const { user } = useUserStore();

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      onSendMessage(chatMessage);
      setChatMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  });

  const isCurrentUser = (msgUser) => {
    console.log(msgUser)
    return user && msgUser === user.name;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chat</CardTitle>
          <Badge variant="outline" className="text-xs">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        {/* Messages Area */}
        <div className="flex-1 px-4">
          <ScrollArea ref={scrollAreaRef} className="h-full w-full max-h-[400px]">
            <div className="space-y-2 py-4 px-2">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">No messages yet</p>
                    <p className="text-muted-foreground text-xs">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = isCurrentUser(msg.user);
                  const showAvatar = index === 0 || messages[index - 1].user !== msg.user;
                  const isLastInGroup = index === messages.length - 1 || messages[index + 1].user !== msg.user;

                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
                      <div className={`flex flex-col max-w-[75%] min-w-[50%] ${isOwn ? 'items-end' : 'items-start'}`}>
                        {showAvatar && (
                          <div className={`flex items-center gap-2 mb-1.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                              }`}>
                              {msg.user.charAt(0).toUpperCase()}
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 font-medium"
                            >
                              {msg.user}
                            </Badge>
                          </div>
                        )}
                        <div
                          className={`relative px-4 py-1 w-full -space-y-2 text-sm break-words shadow-sm transition-all duration-200 group-hover:shadow-md ${isOwn
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                            : 'bg-card border text-card-foreground rounded-2xl rounded-bl-md'
                            } ${!showAvatar && isOwn ? '' : ''} ${!showAvatar && !isOwn ? '' : ''}`}
                        >
                          <p className="leading-relaxed">{msg.message}</p>
                          {isLastInGroup && (
                            <div className={`text-xs opacity-70 mt-1 ${isOwn ? 'text-left' : 'text-right'}`}>
                              {msg.timestamp 
                                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0  px-3 pt-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={!user}
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              disabled={!chatMessage.trim() || !user}
              className="px-4"
            >
              Send
            </Button>
          </div>
          {!user && (
            <p className="text-muted-foreground text-xs mt-2 text-center">
              Connect to start chatting
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ChatSection;
