import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am Oracle Web Edition. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: input,
        history: messages
      });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans">
      <header className="p-6 border-b border-white/5 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-sky-400 rounded-xl shadow-lg shadow-indigo-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Oracle Web</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cloud Extension</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Online</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl h-fit ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-white/5'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                  ? 'bg-indigo-600/10 border border-indigo-500/20 rounded-tr-none'
                  : 'bg-slate-800/50 border border-white/5 rounded-tl-none'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </main>

      <footer className="p-6 bg-gradient-to-t from-[#020617] to-transparent sticky bottom-0">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex gap-2 bg-[#1e293b] p-2 rounded-2xl border border-white/10 shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Oracle Web..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`p-3 rounded-xl transition-all ${loading ? 'bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                }`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-medium">Powered by Antigravity Intelligence</p>
      </footer>
    </div>
  );
}

export default App;
