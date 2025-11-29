import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Bonjour. I am your personal concierge at Lumière & Stone. How may I assist you with your selection today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a digital concierge for 'Lumière & Stone', an ultra-luxury jewelry maison similar to Cartier or Van Cleef & Arpels. Your tone is sophisticated, polite, elegant, and concise. You help customers with inquiries about diamonds (4Cs), ring sizing, and styling advice. Never break character. Keep responses relatively short (under 50 words) unless detailed technical explanation is asked.",
            }
        });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      const text = response.text;
      if (text) {
          setMessages(prev => [...prev, { role: 'model', text }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "My apologies, I am momentarily unable to access the archives. Please try again shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-100 animate-slide-up origin-bottom-right flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-stone-900 p-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-serif text-sm tracking-wide">Concierge Service</h3>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">Lumière & Stone</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-stone-200 text-stone-800 rounded-br-none' 
                    : 'bg-white border border-stone-100 text-stone-700 shadow-sm rounded-bl-none font-serif'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 p-3 rounded-lg rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-100">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your enquiry..." 
                className="flex-1 bg-stone-50 border-none text-sm text-stone-800 placeholder-stone-400 focus:ring-1 focus:ring-gold-400 rounded-sm px-3 py-2"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-stone-900 text-white hover:bg-gold-500 transition-colors rounded-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-stone-900 hover:bg-gold-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};