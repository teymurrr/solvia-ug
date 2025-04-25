
import React, { useState } from 'react';
import { MessageCircle, Send, ArrowLeft, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMessages, type Message } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ChatPopup = () => {
  const [replyText, setReplyText] = useState('');
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    recipient_id: '',
    subject: '',
    content: '',
  });
  const { messages, addMessage, markAsRead, unreadCount } = useMessages();
  const { user, userType } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleMessageClick = (message: Message) => {
    setActiveMessage(message);
    if (!message.read && message.id) {
      markAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeMessage || !user) return;
    
    const result = await addMessage({
      sender_id: user.id,
      recipient_id: activeMessage.sender_id === user.id ? activeMessage.recipient_id : activeMessage.sender_id,
      subject: `Re: ${activeMessage.subject || 'No subject'}`,
      content: replyText,
    });
    
    if (result) {
      toast({
        title: "Message sent",
        description: "Your reply has been sent successfully",
      });
    }
    
    setReplyText('');
  };

  const handleComposeMessage = () => {
    if (!user || userType !== 'institution') return;
    
    setIsComposing(true);
  };

  const handleSendNewMessage = async () => {
    if (!newMessageData.recipient_id || !newMessageData.subject || !newMessageData.content || !user) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addMessage({
      sender_id: user.id,
      recipient_id: newMessageData.recipient_id,
      subject: newMessageData.subject,
      content: newMessageData.content,
    });
    
    if (result) {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });

      setNewMessageData({
        recipient_id: '',
        subject: '',
        content: '',
      });

      setIsComposing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" className="relative rounded-full h-12 w-12 shadow-lg">
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
              <div className="flex justify-between items-center">
                <SheetTitle>
                  {activeMessage ? activeMessage.subject : 'Messages'}
                </SheetTitle>
                {!activeMessage && userType === 'institution' && (
                  <Button size="sm" variant="outline" onClick={handleComposeMessage}>
                    New Message
                  </Button>
                )}
                {activeMessage && (
                  <Button size="sm" variant="outline" onClick={() => setActiveMessage(null)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
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
                messages.length > 0 ? (
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
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {message.sender_id === user?.id 
                            ? `You to ${userType === 'professional' ? 'Institution' : 'Professional'}` 
                            : `${userType === 'professional' ? 'Institution' : 'Professional'} to You`
                          }
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No messages yet</p>
                    <p className="text-sm">
                      {userType === 'professional' 
                        ? "Institutions will contact you here" 
                        : "Start a conversation with professionals"
                      }
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/messages')}
              >
                Go to Inbox
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isComposing} onOpenChange={setIsComposing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient ID</label>
              <Input 
                value={newMessageData.recipient_id}
                onChange={(e) => setNewMessageData({...newMessageData, recipient_id: e.target.value})}
                placeholder="Enter recipient ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input 
                value={newMessageData.subject}
                onChange={(e) => setNewMessageData({...newMessageData, subject: e.target.value})}
                placeholder="Enter message subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea 
                value={newMessageData.content}
                onChange={(e) => setNewMessageData({...newMessageData, content: e.target.value})}
                placeholder="Type your message here"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposing(false)}>Cancel</Button>
            <Button onClick={handleSendNewMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPopup;
