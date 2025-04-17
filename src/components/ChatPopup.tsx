
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const mockMessages = [
  {
    id: '1',
    senderId: 'institution1',
    recipientId: 'professional1',
    senderName: 'Berlin Medical Center',
    message: 'We were impressed by your profile and would like to discuss potential opportunities at our institution.',
    timestamp: '2025-04-16T10:30:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: 'institution2',
    recipientId: 'professional1',
    senderName: 'Vienna General Hospital',
    message: 'Based on your qualifications, we would like to invite you for an interview for the Cardiology position.',
    timestamp: '2025-04-15T14:45:00Z',
    read: false,
  }
];

const ChatPopup = () => {
  const [replyText, setReplyText] = useState('');
  const unreadCount = mockMessages.filter(m => !m.read).length;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" className="relative rounded-full h-12 w-12">
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[380px] sm:w-[440px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Messages</SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <Card key={message.id} className="p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{message.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="min-h-[80px]"
                />
                <Button size="icon" className="h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatPopup;
