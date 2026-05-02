import React, { useState } from 'react';
import { 
  Plus, ExternalLink, MessageSquare, Settings, Menu, 
  Paperclip, Sparkles, Send, Bot, User
} from 'lucide-react';

const ChatInterface = ({ onNavigate }) => {
  // LLM System Prompt (Backend Persona)
  // "Your name is AskMNIT. Act as a super chill, helpful, and street-smart senior B.Tech student from MNIT. You are NOT a robotic AI assistant. You must ONLY communicate in 'WhatsApp Language' (Hinglish - Hindi written in English alphabet mixed with English). Use words like 'bhai', 'yaar', 'jugaad', 'chill maar'. Keep sentences short, conversational, and punchy. Never break character or apologize like an AI model."

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content: 'Aur bhai! Kya scene hai? How can AskMNIT help you today? Chill maar aur puch jo puchna hai.',
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newChat = [...chat, { role: 'user', content: message }];
    setChat(newChat);
    setMessage('');
    
    // Mock bot response (simulate the persona)
    setTimeout(() => {
      setChat([...newChat, { 
        role: 'assistant', 
        content: 'Sahi hai bhai! Main dekhta hu iska kya jugaad ho sakta hai. Thoda wait kar...' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-dark-900 text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-white/5 bg-dark-800/50 flex flex-col justify-between hidden md:flex">
        <div className="p-4 flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(157,78,221,0.5)]">
              M
            </div>
            <h1 className="text-xl font-display font-bold tracking-wide">AskMNIT</h1>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium border border-white/10">
              <Plus size={18} className="text-brand-green" />
              New Chat
            </button>
            <button 
              onClick={onNavigate}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 hover:from-brand-pink/30 hover:to-brand-purple/30 transition-colors text-sm font-medium border border-brand-purple/30 text-white"
            >
              <span className="flex items-center gap-2">DASHBOARD</span>
              <ExternalLink size={16} className="text-brand-pink" />
            </button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6">
            <div>
              <h3 className="px-2 text-xs font-semibold text-gray-500 mb-2 tracking-wider">TODAY</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 text-left">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="truncate">Hostel curfew timings?</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 text-left">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="truncate">Syllabus for CS 2nd Sem</span>
                </button>
              </div>
            </div>
            <div>
              <h3 className="px-2 text-xs font-semibold text-gray-500 mb-2 tracking-wider">YESTERDAY</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 text-left">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="truncate">How to apply for leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t border-white/5 bg-dark-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-green to-brand-purple p-0.5">
                <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center">
                  <User size={18} className="text-gray-300" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">MNIT Student</h4>
                <p className="text-xs text-gray-400">1st Year, B.Tech</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Settings size={18} />
            </button>
          </div>
          
          <div className="mt-2 py-2 px-3 border border-white/10 rounded-lg text-center bg-white/5">
            <span className="text-[10px] tracking-widest font-display font-bold text-gray-500">
              DESIGNED BY <span className="text-brand-purple">SUMIT CHAUDHARY</span>
            </span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative dotted-bg">
        {/* Top Nav */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass-panel z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 text-gray-400">
              <Menu size={20} />
            </button>
            <h2 className="font-display font-semibold text-lg hidden sm:block">AskMNIT Assistant</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            <span className="text-xs font-medium text-brand-green">API Online</span>
          </div>
        </header>

        {/* Chat Flow */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-6 pb-32 hide-scrollbar">
          {chat.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'assistant' 
                    ? 'bg-transparent border border-brand-purple/30 text-brand-purple' 
                    : 'bg-dark-600 text-gray-300'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                
                {/* Message Bubble */}
                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-dark-700 text-gray-100 rounded-tr-none' 
                    : 'bg-transparent text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent pt-10 pb-6 px-4 md:px-10">
          <div className="max-w-3xl mx-auto">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-dark-700/50 hover:bg-dark-600 border border-white/5 text-gray-300 transition-colors">
                Syllabus for 1st Year
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-dark-700/50 hover:bg-dark-600 border border-white/5 text-gray-300 transition-colors">
                Download Lab Manuals
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-dark-700/50 hover:bg-dark-600 border border-white/5 text-gray-300 transition-colors hidden sm:block">
                Mid-Term Dates
              </button>
            </div>

            {/* Input Box */}
            <div className="relative flex items-center glass-card p-1 pr-2">
              <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-3 text-brand-purple hover:text-brand-pink transition-colors">
                <Sparkles size={20} />
              </button>
              
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="How AskMNIT can help you today?"
                className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder-gray-500"
              />
              
              <button 
                onClick={handleSend}
                className={`p-2 rounded-xl transition-colors flex items-center justify-center ${
                  message.trim() 
                    ? 'bg-brand-purple text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]' 
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            
            <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">
              AskMNIT can make mistakes. Consider verifying important academic information.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ChatInterface;
