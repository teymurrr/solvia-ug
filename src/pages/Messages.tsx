
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

// Mock data for messages - in a real app, this would come from a database
const mockMessages = [
  {
    id: '1',
    senderId: 'institution1',
    recipientId: 'professional1',
    senderName: 'Berlin Medical Center',
    subject: 'Job Opportunity',
    message: 'We were impressed by your profile and would like to discuss potential opportunities at our institution.',
    timestamp: '2025-04-16T10:30:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: 'institution2',
    recipientId: 'professional1',
    senderName: 'Vienna General Hospital',
    subject: 'Interview Request',
    message: 'Based on your qualifications, we would like to invite you for an interview for the Cardiology position.',
    timestamp: '2025-04-15T14:45:00Z',
    read: false,
  }
];

const Messages = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userType } = useAuth();
  const [messages, setMessages] = useState(mockMessages);
  const [activeMessage, setActiveMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessageData, setNewMessageData] = useState({
    recipientId: '',
    subject: '',
    message: '',
  });
  
  // Parse recipient ID from URL if it exists
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const recipientId = searchParams.get('recipientId');
    if (recipientId) {
      setNewMessageData(prev => ({ ...prev, recipientId }));
    }
    
    // If a message ID is provided, find and set the active message
    if (id) {
      const message = messages.find(m => m.id === id);
      if (message) {
        setActiveMessage(message);
        // Mark as read
        if (!message.read) {
          setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
        }
      }
    }
  }, [id, location.search, messages]);
  
  const handleSendMessage = () => {
    // In a real app, this would send to the database
    if (!newMessageData.recipientId || !newMessageData.subject || !newMessageData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Add new message to the list (mock implementation)
    const newMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      recipientId: newMessageData.recipientId,
      senderName: userType === 'institution' ? 'Your Institution' : 'You',
      subject: newMessageData.subject,
      message: newMessageData.message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages([...messages, newMessage]);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
    
    // Reset form
    setNewMessageData({
      recipientId: '',
      subject: '',
      message: '',
    });
    
    // Navigate back to inbox
    navigate('/messages');
  };
  
  const handleSendReply = () => {
    if (!replyText || !activeMessage) return;
    
    // Create a reply message
    const replyMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      recipientId: activeMessage.senderId,
      senderName: userType === 'institution' ? 'Your Institution' : 'You',
      subject: `Re: ${activeMessage.subject}`,
      message: replyText,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages([...messages, replyMessage]);
    setReplyText('');
    
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully",
    });
  };
  
  // Filter messages for the current user
  const userMessages = messages.filter(message => 
    userType === 'professional' ? message.recipientId === 'professional1' : message.recipientId === user?.id
  );
  
  // Count unread messages
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
              {location.pathname === '/messages' && (
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
            {/* New Message Form */}
            {location.pathname === '/messages/new' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient ID</label>
                  <Input 
                    value={newMessageData.recipientId}
                    onChange={(e) => setNewMessageData({...newMessageData, recipientId: e.target.value})}
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
                    value={newMessageData.message}
                    onChange={(e) => setNewMessageData({...newMessageData, message: e.target.value})}
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
            
            {/* Message Detail */}
            {activeMessage && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{activeMessage.subject}</h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    <span>From: {activeMessage.senderName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(activeMessage.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 border rounded-md bg-muted/10">
                  <p>{activeMessage.message}</p>
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
            
            {/* Message List */}
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
                        }}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">
                            {!message.read && <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>}
                            {message.subject}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>From: {message.senderName}</span>
                        </div>
                        <p className="text-sm mt-1 truncate">{message.message}</p>
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
