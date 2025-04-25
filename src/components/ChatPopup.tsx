
import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMessages, type Message } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

const ChatPopup = () => {
  const [replyText, setReplyText] = useState('');
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const { messages, addMessage, markAsRead, unreadCount } = useMessages();
  const { user, userType } = useAuth();
  
  const handleMessageClick = (message: Message) => {
    setActiveMessage(message);
    if (!message.read && message.id) {
      markAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeMessage || !user) return;
    
    await addMessage({
      sender_id: user.id,
      recipient_id: activeMessage.sender_id === user.id ? activeMessage.recipient_id : activeMessage.sender_id,
      subject: `Re: ${activeMessage.subject || 'No subject'}`,
      content: replyText,
    });
    
    setReplyText('');
    setActiveMessage(null);
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
                {activeMessage ? activeMessage.subject : 'Messages'}
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessage ? (
                <div className="space-y-4">
                  <Card className="p-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">
                          {activeMessage.sender_id === user?.id 
                            ? 'You' 
                            : (userType === 'professional' ? 'Institution' : 'Professional')
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activeMessage.created_at || '').toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{activeMessage.content}</p>
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
                          {message.subject}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at || '').toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm truncate">{message.content}</p>
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
