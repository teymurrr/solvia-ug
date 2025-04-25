
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type Message = {
  id?: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  created_at?: string;
  read?: boolean;
};

export type Conversation = {
  id: string;
  institution_id: string;
  professional_id: string;
  last_message?: string;
  last_message_date?: string;
  unread_count: number;
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  };

  const fetchConversations = async () => {
    if (!user) return;
    
    // This is a simplified approach. In a production environment,
    // you might want to use a database view or function to get conversations
    // with participant details, last message, etc.
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
      
    if (messagesError) {
      console.error('Error fetching conversations:', messagesError);
      toast.error('Failed to load conversations');
      return;
    }

    // Process messages into conversations
    const conversationMap: Record<string, Conversation> = {};
    
    for (const message of messagesData || []) {
      const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      const conversationKey = [user.id, otherUserId].sort().join('-');
      
      if (!conversationMap[conversationKey]) {
        conversationMap[conversationKey] = {
          id: conversationKey,
          institution_id: userType === 'institution' ? user.id : otherUserId,
          professional_id: userType === 'professional' ? user.id : otherUserId,
          last_message: message.content,
          last_message_date: message.created_at,
          unread_count: message.recipient_id === user.id && !message.read ? 1 : 0
        };
      } else {
        // Count unread messages
        if (message.recipient_id === user.id && !message.read) {
          conversationMap[conversationKey].unread_count += 1;
        }
        
        // Update last message if this one is newer
        const lastDate = new Date(conversationMap[conversationKey].last_message_date!);
        const currentDate = new Date(message.created_at!);
        if (currentDate > lastDate) {
          conversationMap[conversationKey].last_message = message.content;
          conversationMap[conversationKey].last_message_date = message.created_at;
        }
      }
    }
    
    setConversations(Object.values(conversationMap));
  };

  const addMessage = async (newMessage: Omit<Message, 'id' | 'created_at'>) => {
    if (!user) return null;
    
    // Ensure user can only send messages as themselves
    if (newMessage.sender_id !== user.id) {
      console.error('Cannot send message as another user');
      toast.error('Authentication error');
      return null;
    }
    
    // Check if professional is trying to initiate conversation
    if (userType === 'professional' && !messages.some(m => 
      (m.sender_id === newMessage.recipient_id && m.recipient_id === user.id) ||
      (m.sender_id === user.id && m.recipient_id === newMessage.recipient_id)
    )) {
      console.error('Professionals cannot initiate conversations');
      toast.error('Only institutions can start new conversations');
      return null;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
    }

    toast.success('Message sent');
    await fetchMessages();
    await fetchConversations();
    return data;
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .eq('recipient_id', user.id);

    if (error) {
      console.error('Error marking message as read:', error);
      return;
    }

    // Update messages locally to avoid refetching
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
    
    await fetchConversations(); // Refresh conversation counts
  };
  
  const markConversationAsRead = async (otherUserId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('recipient_id', user.id)
      .eq('sender_id', otherUserId);
      
    if (error) {
      console.error('Error marking conversation as read:', error);
      toast.error('Failed to update message status');
      return;
    }
    
    // Update messages locally
    setMessages(prev => prev.map(msg => 
      msg.recipient_id === user.id && msg.sender_id === otherUserId 
        ? { ...msg, read: true } 
        : msg
    ));
    
    await fetchConversations(); // Refresh conversation counts
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchConversations();
      
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('messages-changes')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `recipient_id=eq.${user.id}` 
          },
          (payload) => {
            const newMessage = payload.new as Message;
            
            // Update messages
            setMessages(prev => [newMessage, ...prev]);
            
            // Update conversations
            fetchConversations();
            
            // Show notification
            toast.info('New message received');
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { 
    messages, 
    conversations,
    loading,
    addMessage, 
    markAsRead,
    markConversationAsRead,
    fetchMessages,
    fetchConversations,
    unreadCount: messages.filter(m => !m.read && m.recipient_id === user?.id).length 
  };
};
