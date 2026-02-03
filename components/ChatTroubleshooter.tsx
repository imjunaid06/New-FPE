
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, TicketPlus } from 'lucide-react';
import { ChatMessage } from '../types';
import { troubleshootChat } from '../services/geminiService';
// Fix: Import GenerateContentResponse for proper typing in the streaming loop
import { GenerateContentResponse } from "@google/genai";

const ChatTroubleshooter: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am your AI Support Specialist. Describe the technical issue you are facing, and I will help you troubleshoot it step-by-step.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Fix: Ensure correct history format with typed roles for Gemini API
      const history = messages.map(m => ({
        role: m.role as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const stream = await troubleshootChat(history, input);
      
      const assistantMessageId = `a-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'model',
        text: '',
        timestamp: new Date().toISOString()
      }]);

      let fullText = '';
      // Fix: Use GenerateContentResponse for chunks and access the .text property
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId ? { ...m, text: fullText } : m
        ));
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`,
        role: 'model',
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Enterprise AI Troubleshooter</h3>
            <p className="text-xs text-slate-500 font-medium">Powered by Gemini Flash 3</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-slate-400 hover:text-slate-600 p-2 transition-colors"
          title="Reset Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-blue-600 shadow-sm'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none flex items-center space-x-2 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type your issue here (e.g., 'Server latency high in production')..."
            className="w-full pl-4 pr-24 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          For critical infrastructure issues, please proceed to create a formal ticket.
        </p>
      </form>
    </div>
  );
};

export default ChatTroubleshooter;
