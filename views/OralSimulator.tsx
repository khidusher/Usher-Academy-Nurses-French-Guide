
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AppView } from '../types.ts';

interface OralSimulatorProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const OralSimulator: React.FC<OralSimulatorProps> = ({ addXP, setView }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are a patient in a Ghanaian hospital. Speak English with a local accent or occasionally simple French. 
        Scenario: You have come to the clinic with symptoms. Let the student nurse triage you. 
        Be realistic, occasionally express pain (e.g., 'Aie!', 'Ça fait mal!'). 
        Goal: Help the student practice clinical French. Keep responses concise and clinical.`,
      },
    });

    // Initial greeting from patient
    setMessages([{ role: 'model', text: "Bonjour Nurse... Oh, j'ai mal... I don't feel well today." }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const response = await chatRef.current.sendMessage({ message: userMsg });
        setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
        addXP(5);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm feeling too weak to speak right now. (Connection issue)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <button onClick={() => setView(AppView.DASHBOARD)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xs font-bold uppercase tracking-wider">Clinical Chat Lab</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 pb-24">
        <div className="w-full text-center mb-2">
          <h2 className="text-lg font-black text-slate-800">Ghana Health Simulation</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Triage Practice (Text Only)</p>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white border-emerald-500 rounded-br-none' 
                : 'bg-white text-slate-700 border-slate-100 rounded-bl-none'
            }`}>
              <p className={`text-[8px] uppercase font-black mb-1 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {msg.role === 'user' ? 'Nurse (You)' : 'Patient'}
              </p>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-bl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Patient is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-slate-200 p-3 flex gap-2 z-50">
        <form onSubmit={handleSend} className="w-full flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your clinical assessment..."
            className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              !input.trim() || isLoading ? 'bg-slate-100 text-slate-300' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
            }`}
          >
            <span className="text-xl">🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OralSimulator;
