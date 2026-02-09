import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ArrowLeft, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMessages, type Message } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

const ChatPopupContent = () => {
  const [replyText, setReplyText] = useState('');
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [activeSenderId, setActiveSenderId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user, userType, isLoggedIn } = useAuth();
  const { handleProtectedAction } = useProtectedAction();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const messagesHook = useMessages();
  
  const { 
    messages = [], 
    addMessage = async () => null, 
    markAsRead = async () => {}, 
    markConversationAsRead = async () => {},
    unreadCount = 0,
    fetchMessages = async () => {}
  } = isOpen && isLoggedIn ? messagesHook : {
    messages: [],
    unreadCount: 0,
  };
  
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessage, isOpen]);
  
  const handleOpenChat = (senderId: string) => {
    if (!isLoggedIn) {
      handleProtectedAction();
      return;
    }
    
    setActiveSenderId(senderId);
    markConversationAsRead(senderId);
    
    const conversationMessages = messages.filter(message => 
      (message.sender_id === senderId && message.recipient_id === user?.id) ||
      (message.sender_id === user?.id && message.recipient_id === senderId)
    ).sort((a, b) => {
      return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
    });
    
    if (conversationMessages.length > 0) {
      setActiveMessage(conversationMessages[conversationMessages.length - 1]);
    }
    
    setIsOpen(true);
  };
  
  const handleCloseChat = () => {
    setActiveSenderId(null);
    setActiveMessage(null);
    setIsOpen(false);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeSenderId || !user) {
      toast.error(t?.chat?.emptyMessage || "Cannot send empty message");
      return;
    }
    
    const result = await addMessage({
      sender_id: user.id,
      recipient_id: activeSenderId,
      content: replyText,
    });
    
    if (result) {
      setReplyText('');
      fetchMessages();
    }
  };
  
  const conversationPartners = React.useMemo(() => {
    if (!user || !messages.length) return [];
    
    const partners = new Map<string, Message>();
    
    messages.forEach(message => {
      const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      
      if (!partners.has(partnerId) || 
          new Date(message.created_at || '') > new Date(partners.get(partnerId)?.created_at || '')) {
        partners.set(partnerId, message);
      }
    });
    
    return Array.from(partners.entries()).map(([id, message]) => ({
      id, 
      lastMessage: message,
      hasUnread: messages.some(m => m.sender_id === id && m.recipient_id === user.id && !m.read)
    }));
  }, [messages, user]);
  
  const conversationMessages = React.useMemo(() => {
    if (!user || !activeSenderId || !messages.length) return [];
    
    return messages
      .filter(message => 
        (message.sender_id === activeSenderId && message.recipient_id === user.id) ||
        (message.sender_id === user.id && message.recipient_id === activeSenderId)
      )
      .sort((a, b) => 
        new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      );
  }, [messages, user, activeSenderId]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open && isLoggedIn) {
          fetchMessages();
        }
      }}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="relative rounded-full h-12 w-12 shadow-md"
            onClick={() => handleProtectedAction(() => setIsOpen(true))}
          >
            <MessageCircle className="h-6 w-6" />
            {isLoggedIn && unreadCount > 0 && (
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
          {isLoggedIn ? (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeSenderId && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                        setActiveSenderId(null);
                        setActiveMessage(null);
                      }}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <SheetTitle>
                      {activeSenderId ? "Chat" : (t?.chat?.messages || "Messages")}
                    </SheetTitle>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCloseChat}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>
              
              <div className="flex-1 overflow-hidden">
                {activeSenderId ? (
                  <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {conversationMessages.map((message) => (
                          <div 
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-lg ${
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
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t flex gap-2">
                      <Textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t?.chat?.typeMessagePlaceholder || "Type a message..."}
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                      />
                      <Button onClick={handleSendReply} className="self-end">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-2">
                      {conversationPartners.length > 0 ? (
                        conversationPartners.map(({ id, lastMessage, hasUnread }) => (
                          <Card 
                            key={id}
                            className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                              hasUnread ? 'border-primary bg-muted/10' : ''
                            }`}
                            onClick={() => handleOpenChat(id)}
                          >
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
                                    {lastMessage.sender_id === user?.id ? (t?.chat?.you || 'You') : (t?.chat?.user || 'User')}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(lastMessage.created_at || '').toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm truncate mt-1">{lastMessage.content}</p>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>{t?.chat?.noMessages || 'No messages yet'}</p>
                          <p className="text-sm">
                            {userType === 'professional' 
                              ? (t?.chat?.institutionsContact || 'Institutions will contact you here')
                              : (t?.chat?.startConversation || 'Start a conversation from professional profiles')}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
              
              <div className="p-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/messages');
                  }}
                >
                  {t?.chat?.viewInbox || 'View All in Inbox'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{t?.chat?.signInRequired || 'Sign in to access messaging'}</h3>
              <p className="text-muted-foreground mb-6">{t?.chat?.signInDescription || 'You need an account to send and receive messages'}</p>
              <div className="space-x-4">
                <Button onClick={() => {
                  setIsOpen(false);
                  navigate('/login');
                }}>
                  {t?.common?.login || 'Login'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsOpen(false);
                  navigate('/signup');
                }}>
                  {t?.common?.signup || 'Sign Up'}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ChatPopup = () => {
  return <ChatPopupContent />;
};

export default ChatPopup;
