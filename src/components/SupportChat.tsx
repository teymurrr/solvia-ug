import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUPABASE_URL = "https://ehrxpaxvyuwiwqclqkyh.supabase.co";

const welcomeMessages: Record<string, string> = {
  es: "¡Hola! Soy el Asistente de Soporte de Solvia. Puedo ayudarte con preguntas generales sobre la reubicación a Alemania, Austria, Italia o España como profesional médico. ¿En qué puedo ayudarte?",
  en: "Hello! I'm Solvia's Support Assistant. I can help answer general questions about relocating to Germany, Austria, Italy, or Spain as a medical professional. How can I help you today?",
  de: "Hallo! Ich bin der Support-Assistent von Solvia. Ich kann allgemeine Fragen zur Umsiedlung nach Deutschland, Österreich, Italien oder Spanien als medizinische Fachkraft beantworten. Wie kann ich Ihnen helfen?",
  fr: "Bonjour! Je suis l'Assistant Support de Solvia. Je peux répondre aux questions générales sur la relocalisation en Allemagne, Autriche, Italie ou Espagne en tant que professionnel médical. Comment puis-je vous aider?",
  ru: "Здравствуйте! Я Ассистент поддержки Solvia. Я могу ответить на общие вопросы о переезде в Германию, Австрию, Италию или Испанию в качестве медицинского специалиста. Чем я могу вам помочь?"
};

const SupportChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { t, currentLanguage } = useLanguage();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = welcomeMessages[currentLanguage] || welcomeMessages.en;
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
    }
  }, [isOpen, messages.length, currentLanguage]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message immediately
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    let assistantResponse = '';

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/support-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId,
          language: currentLanguage,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
          return;
        }
        throw new Error('Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                assistantResponse += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: assistantResponse
                  };
                  return newMessages;
                });
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Something went wrong. Please try again.");
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/4915259018297', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="relative rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[380px] sm:w-[440px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-primary-foreground">Solvia Support</SheetTitle>
                  <p className="text-xs text-primary-foreground/80">We typically reply instantly</p>
                </div>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-md' 
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4 space-y-3">
            <div className="flex gap-2">
              <Textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-[120px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={isLoading || !inputText.trim()}
                className="h-[44px] w-[44px] shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
              onClick={handleWhatsAppClick}
            >
              <Phone className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SupportChat;
