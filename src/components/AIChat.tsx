import { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { WeatherData } from '@/types/weather';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  weatherData: WeatherData | null;
}

export const AIChat = ({ weatherData }: AIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || !weatherData) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage,
          weatherContext: {
            temp: weatherData.temp,
            condition: weatherData.condition,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed,
            city: weatherData.city,
          },
        },
      });

      if (error) {
        console.error('AI Chat error:', error);
        if (error.message.includes('429')) {
          toast({
            title: "Rate limit reached",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
        } else if (error.message.includes('402')) {
          toast({
            title: "Credits needed",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to get AI response. Please try again.",
            variant: "destructive",
          });
        }
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (data?.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-all"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="glass-strong border-white/30 overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-secondary p-4">
                <h3 className="text-white font-bold text-lg">Weather AI Assistant</h3>
                <p className="text-white/80 text-sm">
                  Ask me anything about the weather!
                </p>
              </div>

              <ScrollArea className="h-96 p-4">
                {messages.length === 0 && (
                  <div className="text-center text-white/60 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Start a conversation!</p>
                    <p className="text-xs mt-2">Try asking:</p>
                    <ul className="text-xs mt-2 space-y-1">
                      <li>"What should I wear today?"</li>
                      <li>"Will it rain tomorrow?"</li>
                      <li>"Can I go for a run now?"</li>
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white/20 text-white backdrop-blur-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/20 text-white backdrop-blur-sm rounded-2xl px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-white/20">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the weather..."
                    disabled={isLoading || !weatherData}
                    className="glass border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim() || !weatherData}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
