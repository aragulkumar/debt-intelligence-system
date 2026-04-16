import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, Sparkles } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

const STARTER_PROMPTS = [
  'What is the best strategy to pay off my debt?',
  'How can I improve my financial health score?',
  'Explain the avalanche vs snowball method',
  'How do BNPL loans affect my credit score?',
];

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI financial coach powered by Claude. Ask me anything about your debt — repayment strategies, budgeting tips, or how to improve your financial health score." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: msg });
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 fade-in flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" /> AI Financial Coach
        </h1>
        <p className="text-muted-foreground">Personalised debt guidance powered by Claude AI.</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 border-b shrink-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-500" /> DebtHelper Coach
          </CardTitle>
          <CardDescription>Always available · Powered by Anthropic Claude</CardDescription>
        </CardHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className={msg.role === 'user' ? 'bg-indigo-500 text-white text-xs' : 'bg-purple-600 text-white text-xs'}>
                    {msg.role === 'user' ? 'U' : <Bot className="w-3 h-3" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className="bg-purple-600 text-white text-xs"><Bot className="w-3 h-3" /></AvatarFallback>
                </Avatar>
                <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-muted text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Starter prompts (only on first load) */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
            {STARTER_PROMPTS.map(p => (
              <Button key={p} variant="outline" size="sm" className="text-xs h-7" onClick={() => send(p)}>
                {p}
              </Button>
            ))}
          </div>
        )}

        <div className="p-4 border-t shrink-0">
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <Input
              placeholder="Ask your financial question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
