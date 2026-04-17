"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Minus } from "lucide-react";

export default function SocialChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Sistem", text: "Mesajlaşma servisi (Pusher) entegrasyonu tamamlanana kadar çevrimdışı moddasınız.", time: "Bugün", isMe: false }
  ]);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const handleOpenChat = (e: any) => {
       setTargetUser(e.detail);
       setIsOpen(true);
       setIsMinimized(false);
       setMessages([
         { id: 1, sender: e.detail.username || "Oyuncu", text: "Selam! Naber?", time: "Az önce", isMe: false }
       ]);
    };
    
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      sender: "Ben", 
      text: inputVal, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      isMe: true 
    }]);
    setInputVal("");
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={`fixed bottom-8 left-8 z-[9000] w-14 h-14 bg-dublio-purple hover:bg-[#9333ea] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 ${isOpen && !isMinimized ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0a0a0c]"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isMinimized ? { opacity: 1, y: 0, scale: 1, height: "48px" } : { opacity: 1, y: 0, scale: 1, height: "450px" }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-8 left-8 z-[9001] w-[340px] bg-[#121318] border border-white/10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div 
              onClick={() => setIsMinimized(!isMinimized)}
              className="bg-[#1a1c23] hover:bg-[#22242d] transition-colors p-3 flex items-center justify-between cursor-pointer border-b border-white/5 select-none"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img src={targetUser?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser?.username || 'alimert'}`} className="w-6 h-6 rounded-full bg-black shrink-0" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#1a1c23]"></div>
                </div>
                <span className="font-bold text-sm text-white">{targetUser?.username || 'Topluluk Sohbeti'}</span>
                <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded ml-2 font-black uppercase">PRE-ALPHA</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1 hover:bg-red-500/20 rounded text-white/50 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#121318] to-black">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 mt-1 max-w-[85%] text-sm rounded-2xl leading-relaxed ${
                        msg.isMe 
                          ? 'bg-dublio-purple text-white rounded-tr-sm' 
                          : 'bg-white/10 text-white rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] font-bold text-white/30 mt-1">{msg.time}</span>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">BUGÜN</span>
                  </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-[#1a1c23] border-t border-white/5 flex gap-2">
                  <input 
                    type="text" 
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Mesaj gönder..." 
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-dublio-purple placeholder:text-white/30"
                  />
                  <button type="submit" disabled={!inputVal.trim()} className="bg-dublio-purple hover:bg-[#9333ea] disabled:opacity-50 disabled:hover:bg-dublio-purple text-white p-2 rounded-xl transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
