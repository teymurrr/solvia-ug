
import { useState } from 'react';

export type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  subject?: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
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
  ]);

  const addMessage = (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
    const message: Message = {
      ...newMessage,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => msg.id === messageId ? { ...msg, read: true } : msg)
    );
  };

  return {
    messages,
    addMessage,
    markAsRead,
  };
};
