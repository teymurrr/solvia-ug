
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
  const [messages, setMessages] = useState(mockMessages);
  const [activeMessage, setActiveMessage] = useState<typeof mockMessages[0] | null>(null);
  
  const unreadCount = messages.filter(m => !m.read).length;

  const handleMessageClick = (message: typeof mockMessages[0]) => {
    setActiveMessage(message);
    if (!message.read) {
      setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !activeMessage) return;
    
    // Add reply logic here
    setReplyText('');
  };

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
              <SheetTitle>
                {activeMessage ? activeMessage.senderName : 'Messages'}
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessage ? (
                <div className="space-y-4">
                  <Card className="p-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{activeMessage.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activeMessage.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{activeMessage.message}</p>
                    </div>
                  </Card>
                  <div className="flex gap-2">
                    <Textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="min-h-[80px]"
                    />
                    <Button size="icon" className="h-10 w-10" onClick={handleSendReply}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${!message.read ? 'border-primary bg-muted/10' : ''}`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">
                          {!message.read && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                          )}
                          {message.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {!activeMessage && (
              <div className="p-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveMessage(null)}
                >
                  Back to Messages
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatPopup;
