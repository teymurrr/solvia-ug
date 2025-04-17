
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeChat?: {
    id: string;
    title: string;
    messages: Message[];
  };
}

const ChatDialog: React.FC<ChatDialogProps> = ({ open, onOpenChange, activeChat }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!activeChat) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] h-[500px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{activeChat.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {activeChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.senderId === 'current-user'
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.senderId === 'current-user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSendMessage}
          className="border-t p-4 flex items-center gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;

