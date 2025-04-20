
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useMessages, type Message } from '@/hooks/useMessages';

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userType } = useAuth();
  const { messages, addMessage, markAsRead } = useMessages();
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessageData, setNewMessageData] = useState({
    recipient_id: '',
    subject: '',
    content: '',
  });
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const recipient_id = searchParams.get('recipient_id');
    if (recipient_id) {
      setNewMessageData(prev => ({ ...prev, recipient_id }));
    }

    if (id) {
      const message = messages.find(m => m.id === id);
      if (message) {
        setActiveMessage(message);
        if (!message.read && message.id) {
          markAsRead(message.id);
        }
      }
    }
  }, [id, location.search, messages, markAsRead]);

  const handleSendMessage = () => {
    if (!newMessageData.recipient_id || !newMessageData.subject || !newMessageData.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addMessage({
      sender_id: user?.id || '',
      recipient_id: newMessageData.recipient_id,
      subject: newMessageData.subject,
      content: newMessageData.content,
    });

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });

    setNewMessageData({
      recipient_id: '',
      subject: '',
      content: '',
    });

    navigate('/messages');
  };
  
  const handleSendReply = () => {
    if (!replyText || !activeMessage || !user) return;
    
    addMessage({
      sender_id: user.id,
      recipient_id: activeMessage.sender_id === user.id ? activeMessage.recipient_id : activeMessage.sender_id,
      subject: `Re: ${activeMessage.subject || 'No subject'}`,
      content: replyText,
    });
    
    setReplyText('');
    
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully",
    });
  };
  
  // Filter messages for the current user
  const userMessages = messages.filter(message => 
    message.sender_id === user?.id || message.recipient_id === user?.id
  );
  
  const unreadCount = userMessages.filter(message => !message.read).length;
  
  return (
    <MainLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  {userType === 'professional' 
                    ? "Messages from institutions interested in your profile" 
                    : "Communicate with healthcare professionals"}
                </CardDescription>
              </div>
              {!activeMessage && userType !== 'professional' && (
                <Button onClick={() => navigate('/messages/new')}>
                  <Mail className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              )}
              {location.pathname === '/messages/new' && (
                <Button variant="outline" onClick={() => navigate('/messages')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Inbox
                </Button>
              )}
              {activeMessage && (
                <Button variant="outline" onClick={() => {
                  setActiveMessage(null);
                  navigate('/messages');
                }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Inbox
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {location.pathname === '/messages/new' && userType !== 'professional' && (
              <div className="space-y-4">
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
                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            )}
            
            {activeMessage && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{activeMessage.subject}</h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    <span>From: {activeMessage.sender_id === user?.id ? 'You' : (userType === 'professional' ? 'Institution' : 'Professional')}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(activeMessage.created_at || '').toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 border rounded-md bg-muted/10">
                  <p>{activeMessage.content}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Reply</h4>
                  <Textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here"
                    rows={3}
                  />
                  <Button onClick={handleSendReply}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
            
            {location.pathname === '/messages' && !activeMessage && (
              <div>
                {unreadCount > 0 && (
                  <div className="mb-4 p-2 bg-muted rounded-md flex items-center">
                    <Badge className="mr-2">{unreadCount}</Badge>
                    <span>unread {unreadCount === 1 ? 'message' : 'messages'}</span>
                  </div>
                )}
                
                {userMessages.length > 0 ? (
                  <div className="space-y-2">
                    {userMessages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${!message.read ? 'border-primary bg-muted/10' : ''}`}
                        onClick={() => {
                          setActiveMessage(message);
                          navigate(`/messages/${message.id}`);
                          if (!message.read && message.id) {
                            markAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">
                            {!message.read && <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>}
                            {message.subject}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at || '').toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>From: {message.sender_id === user?.id ? 'You' : (userType === 'professional' ? 'Institution' : 'Professional')}</span>
                        </div>
                        <p className="text-sm mt-1 truncate">{message.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No messages</h3>
                    <p className="text-muted-foreground">
                      You don't have any messages yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
