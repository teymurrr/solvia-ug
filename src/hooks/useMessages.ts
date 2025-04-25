
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Message = {
  id?: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  created_at?: string;
  read?: boolean;
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (newMessage: Omit<Message, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // No need to update state here as the subscription will handle it
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state to reflect the change immediately
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Subscribe to message changes
  useEffect(() => {
    if (!user) return;

    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}|recipient_id=eq.${user.id}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Avoid duplicates
          setMessages(prev => {
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [newMessage, ...prev];
          });

          // Show toast notification for new incoming messages
          if (newMessage.recipient_id === user.id && newMessage.sender_id !== user.id) {
            toast({
              title: "New message",
              description: `You have received a new message: ${newMessage.subject || 'No subject'}`,
            });
          }
        })
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}|recipient_id=eq.${user.id}`
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          
          // Update message in state
          setMessages(prev => 
            prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
          );
        })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { 
    messages, 
    addMessage, 
    markAsRead,
    unreadCount: messages.filter(m => m.recipient_id === user?.id && !m.read).length,
    loading
  };
};
