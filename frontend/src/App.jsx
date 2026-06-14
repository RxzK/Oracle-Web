import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles, Command, Shield, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Identity verified. Oracle Web Edition online. How shall we proceed today?' }
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
      setMessages(prev => [...prev, { role: 'assistant', text: 'Protocol error detected. Connection to core unstable.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      {/* Background Layer */}
      <div className="hologram-bg" />
      <div className="hologram-grid" />

      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-sky-500/10 blur-[150px] rounded-full animate-pulse" />

      {/* Main App Pod */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-5xl h-[85vh] glass-panel rounded-[2rem] flex flex-col shadow-2xl overflow-hidden border border-white/10"
      >
        {/* Futuristic Header */}
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-gradient-to-tr from-indigo-500/20 to-sky-400/20 rounded-2xl border border-indigo-400/30"
            >
              <Bot size={24} className="text-sky-400 glow-text" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ORACLE <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30 uppercase tracking-widest font-bold">Cloud V3</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <Globe size={10} /> Network Optimized
                </span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                  <Activity size={10} className="animate-pulse" /> Active Link
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex gap-4">
            {['Status', 'Nodes', 'Secure'].map((label, i) => (
              <div key={label} className="flex flex-col items-end">
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter mb-0.5">{label}</span>
                <span className="text-[10px] text-slate-300 font-mono">
                  {i === 0 ? 'ONLINE' : i === 1 ? '12.4ms' : 'SSLv3'}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* Messaging Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center glass-card ${msg.role === 'user' ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-slate-800/30 border-white/10'
                  }`}>
                  {msg.role === 'user' ? (
                    <User size={22} className="text-indigo-400" />
                  ) : (
                    <Bot size={22} className="text-sky-400" />
                  )}
                  {msg.role === 'assistant' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full blur-[4px] animate-pulse" />
                  )}
                </div>

                <div className={`relative max-w-[80%] p-5 rounded-[1.5rem] glass-card ${msg.role === 'user'
                    ? 'bg-indigo-600/10 border-indigo-500/20 rounded-tr-none'
                    : 'bg-white/[0.03] border-white/5 rounded-tl-none'
                  }`}>
                  <p className="text-[0.95rem] leading-relaxed text-slate-200 font-light">
                    {msg.text}
                  </p>
                  <div className="absolute top-2 right-4 opacity-10">
                    <Command size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </main>

        {/* Futuristic Input Bar */}
        <footer className="p-8 pt-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-[1.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex gap-1 bg-[#1e293b]/40 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white/10 shadow-2xl shadow-black/50">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Initialize instruction set..."
                className="flex-1 bg-transparent border-none outline-none px-6 text-sm text-white placeholder:text-slate-500 placeholder:uppercase placeholder:tracking-widest placeholder:font-bold"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={loading}
                className={`p-4 rounded-xl transition-all flex items-center gap-2 ${loading
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  }`}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </motion.button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6 px-2">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                <Shield size={12} /> Encryption Level 5
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                <Sparkles size={12} /> AI Powered
              </span>
            </div>
            <p className="text-[10px] text-slate-600 uppercase font-medium tracking-[0.3em]">
              Antigravity <span className="text-slate-800">//</span> Core
            </p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

export default App;
