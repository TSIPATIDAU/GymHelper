import React, { useState, useRef, useEffect } from 'react';
import { AppState, Message, ChatSession } from '../types';
import { Send, Sparkles, Plus, ChevronDown, MessageSquare } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Simple paragraph split
  const paragraphs = text.split('\n');
  
  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => {
        if (!para.trim()) return null;
        
        // Simple bold parser for **text**
        const parts = para.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <b key={j} className="font-black text-blue-900">{part.slice(2, -2)}</b>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

const Chat: React.FC<Props> = ({ state, setState }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatSelector, setShowChatSelector] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = state.chats.find(c => c.id === state.activeChatId) || state.chats[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat.messages, isTyping]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat: ChatSession = {
      id: newId,
      title: 'Keskustelu ' + (state.chats.length + 1),
      messages: [{ role: 'model', text: 'Tervehdys! Aloitetaanko uusi aihe?', timestamp: new Date().toISOString() }]
    };
    setState(prev => ({ 
      ...prev, 
      chats: [newChat, ...prev.chats],
      activeChatId: newId 
    }));
    setShowChatSelector(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const lowerInput = input.toLowerCase();
    let updatedProfile = { ...state.profile };

    if (lowerInput.includes("arnold golden six")) {
      updatedProfile = { ...updatedProfile, coachType: 'arnold', coachName: 'Arnold' };
      setState(prev => ({ ...prev, profile: updatedProfile }));
    } else if (lowerInput.includes("lopetin arnold")) {
      updatedProfile = { ...updatedProfile, coachType: 'aino', coachName: 'Aino' };
      setState(prev => ({ ...prev, profile: updatedProfile }));
    }

    const userMessage: Message = { role: 'user', text: input, timestamp: new Date().toISOString() };
    
    const updatedChats = state.chats.map(c => 
      c.id === state.activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c
    );
    
    setState(prev => ({ ...prev, chats: updatedChats }));
    setInput('');
    setIsTyping(true);

    const aiResponse = await getChatResponse(
      updatedProfile,
      state.sessions.filter(s => s.finished),
      activeChat.messages,
      input
    );

    const modelMessage: Message = { role: 'model', text: aiResponse, timestamp: new Date().toISOString() };

    setState(prev => ({ 
      ...prev, 
      chats: prev.chats.map(c => c.id === prev.activeChatId ? { ...c, messages: [...c.messages, modelMessage] } : c)
    }));
    setIsTyping(false);
  };

  const coachNameDisplay = state.profile.coachType === 'arnold' ? "Arnold Schwarzenegger" : `${state.profile.coachName}-Valmentaja`;

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-white shadow-xl rotate-3 transition-colors ${state.profile.coachType === 'arnold' ? 'bg-amber-600' : 'bg-slate-900'}`}>
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{coachNameDisplay}</h1>
            <button onClick={() => setShowChatSelector(!showChatSelector)} className="flex items-center gap-1 mt-1 text-[10px] text-blue-600 font-black uppercase tracking-widest">
              {activeChat.title} <ChevronDown size={14} />
            </button>
          </div>
        </div>
        <button onClick={createNewChat} className="p-4 bg-slate-50 text-slate-900 rounded-2xl active:scale-90 transition-all shadow-sm">
          <Plus size={20} />
        </button>
      </header>

      {showChatSelector && (
        <div className="absolute top-24 left-6 right-6 z-40 bg-white border-4 border-slate-50 rounded-[32px] shadow-2xl p-4 animate-in fade-in slide-in-from-top-4">
          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
            {state.chats.map(chat => (
              <button 
                key={chat.id} 
                onClick={() => { setState(p => ({ ...p, activeChatId: chat.id })); setShowChatSelector(false); }}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 font-black text-sm transition-all ${state.activeChatId === chat.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}
              >
                <MessageSquare size={16} /> {chat.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 pb-4">
        {activeChat.messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-[32px] p-6 text-[15px] font-medium shadow-sm leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border-2 border-slate-50 rounded-tl-none'
            }`}>
              <FormattedText text={m.text} />
            </div>
          </div>
        ))}
        {isTyping && <div className="bg-white border-2 border-slate-50 rounded-[24px] p-4 w-16 flex gap-1 animate-pulse"><div className="w-2 h-2 bg-blue-400 rounded-full"/><div className="w-2 h-2 bg-blue-400 rounded-full"/><div className="w-2 h-2 bg-blue-400 rounded-full"/></div>}
      </div>

      <div className="mt-6 flex gap-3">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Kysy treenistä..." className="flex-1 bg-white border-2 border-slate-600 rounded-[32px] px-6 py-5 text-base font-bold outline-none text-slate-900 focus:border-blue-600" />
        <button onClick={handleSend} disabled={!input.trim() || isTyping} className="w-16 h-16 bg-slate-900 rounded-[28px] flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"><Send size={24} /></button>
      </div>
    </div>
  );
};

export default Chat;