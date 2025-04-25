import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, User, ArrowLeft, Search, Inbox, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMessages, type Message } from '@/hooks/useMessages';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userType } = useAuth();
  const { messages, addMessage, markAsRead, markConversationAsRead, unreadCount } = useMessages();
  
  const [activeConversation, setActiveConversation] = useState<{
    partnerId: string;
    messages: Message[];
  } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageDialog, setNewMessageDialog] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    recipient_id: '',
    subject: '',
    content: '',
  });
  
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Set active conversation if ID is provided in URL
  useEffect(() => {
    if (id && user) {
      setActiveConversation({
        partnerId: id,
        messages: messages.filter(msg => 
          (msg.sender_id === id && msg.recipient_id === user.id) ||
          (msg.sender_id === user.id && msg.recipient_id === id)
        ).sort((a, b) => 
          new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        )
      });
      
      // Mark conversation as read
      markConversationAsRead(id);
    }
  }, [id, messages, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && activeConversation) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation]);

  // Get unique conversation partners
  const conversationPartners = React.useMemo(() => {
    if (!user) return [];
    
    const partners = new Map<string, Message>();
    
    // Group by partner and keep the latest message
    messages.forEach(message => {
      const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      
      if (!partners.has(partnerId) || 
          new Date(message.created_at || '') > new Date(partners.get(partnerId)?.created_at || '')) {
        partners.set(partnerId, message);
      }
    });
    
    return Array.from(partners.entries())
      .map(([id, message]) => ({
        id, 
        lastMessage: message,
        hasUnread: messages.some(m => m.sender_id === id && m.recipient_id === user.id && !m.read)
      }))
      .filter(partner => {
        if (!searchQuery) return true;
        // Simple filter by message content
        return partner.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [messages, user, searchQuery]);

  const handleSendMessage = () => {
    if (!newMessageData.recipient_id || !newMessageData.content) {
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
    
    setNewMessageDialog(false);
  };
  
  const handleSendReply = () => {
    if (!replyText || !activeConversation || !user) {
      toast.error("Cannot send empty message");
      return;
    }
    
    addMessage({
      sender_id: user.id,
      recipient_id: activeConversation.partnerId,
      content: replyText,
    });
    
    setReplyText('');
  };
  
  const handleSelectConversation = (partnerId: string) => {
    const conversationMessages = messages
      .filter(msg => 
        (msg.sender_id === partnerId && msg.recipient_id === user?.id) ||
        (msg.sender_id === user?.id && msg.recipient_id === partnerId)
      )
      .sort((a, b) => 
        new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      );
    
    setActiveConversation({
      partnerId,
      messages: conversationMessages
    });
    
    // Mark all messages from this sender as read
    markConversationAsRead(partnerId);
    
    // Update URL without reloading
    navigate(`/messages/${partnerId}`);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <Card className="overflow-hidden">
          <CardHeader className="bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeConversation && (
                  <Button variant="ghost" size="icon" onClick={() => {
                    setActiveConversation(null);
                    navigate('/messages');
                  }}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <CardTitle>
                    {activeConversation ? 'Conversation' : 'Messages'}
                  </CardTitle>
                  <CardDescription>
                    {activeConversation ? 
                      'Your conversation history' : 
                      userType === 'professional' 
                        ? "Messages from institutions interested in your profile" 
                        : "Communicate with healthcare professionals"
                    }
                  </CardDescription>
                </div>
              </div>
              {!activeConversation && userType !== 'professional' && (
                <Button onClick={() => setNewMessageDialog(true)}>
                  <Mail className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-240px)]">
              
              {/* Conversation List Sidebar */}
              {!activeConversation && (
                <div className="md:col-span-3">
                  {/* Search Bar */}
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search messages..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {conversationPartners.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-320px)]">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                        {conversationPartners.map(({ id, lastMessage, hasUnread }) => (
                          <Card 
                            key={id}
                            className={`cursor-pointer hover:shadow-md transition-all ${
                              hasUnread ? 'border-primary' : ''
                            }`}
                            onClick={() => handleSelectConversation(id)}
                          >
                            <div className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    <User className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium flex items-center gap-2">
                                      {hasUnread && (
                                        <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                                      )}
                                      {lastMessage.sender_id === user?.id ? 'You' : 'User'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(lastMessage.created_at || '').toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm truncate mt-1">{lastMessage.content}</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-320px)] text-center p-4">
                      <Inbox className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                      <p className="text-muted-foreground max-w-md">
                        {searchQuery ? 'No messages match your search.' : userType === 'professional' 
                          ? 'When institutions contact you, their messages will appear here.' 
                          : 'Start conversations with healthcare professionals to build connections.'}
                      </p>
                      {userType !== 'professional' && !searchQuery && (
                        <Button className="mt-6" onClick={() => setNewMessageDialog(true)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Start a Conversation
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Active Conversation */}
              {activeConversation && (
                <div className="md:col-span-3 flex flex-col h-full">
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4 max-w-4xl mx-auto">
                      {activeConversation.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[80%] ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div 
                              className={`p-3 rounded-lg ${
                                message.sender_id === user?.id 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs mt-1 opacity-70 text-right">
                                {new Date(message.created_at || '').toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t bg-background">
                    <div className="max-w-4xl mx-auto flex gap-2">
                      <Textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your message..."
                        className="min-h-[80px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                      />
                      <Button onClick={handleSendReply} size="lg" className="self-end">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={newMessageDialog} onOpenChange={setNewMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a message to a healthcare professional
            </DialogDescription>
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
            <Button variant="outline" onClick={() => setNewMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="ml-2">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Messages;
