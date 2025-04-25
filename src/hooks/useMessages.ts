
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, userType } = useAuth();

  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const addMessage = async (newMessage: Omit<Message, 'id' | 'created_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    fetchMessages();
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

    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  return { 
    messages, 
    addMessage, 
    markAsRead,
    unreadCount: messages.filter(m => !m.read).length 
  };
};
