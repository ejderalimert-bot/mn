"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Phone, Gamepad2, Search, Settings, Network } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CommunityPage({ searchParams }: any) {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans overflow-hidden">
      <Navbar />

      <main className="flex-1 flex mt-20 h-[calc(100vh-5rem)]">
        {/* Left Sidebar */}
        <div className="w-20 md:w-64 bg-[#121318] border-r border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-center md:justify-start gap-3">
             <div className="bg-dublio-purple/20 p-2 rounded-lg text-dublio-purple flex shrink-0">
               <Network className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             <h1 className="font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-dublio-purple uppercase tracking-widest hidden md:block">
               AĞ
             </h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
             <button 
                onClick={() => setActiveTab('friends')}
                className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 mx-2 my-1 rounded-xl transition-all ${activeTab === 'friends' ? 'bg-white/10 text-white shadow-inner' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
             >
               <Users className="w-5 h-5 shrink-0" />
               <span className="font-bold hidden md:block">Arkadaşlarım</span>
             </button>
             <button 
                onClick={() => setActiveTab('add')}
                className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 mx-2 my-1 rounded-xl transition-all ${activeTab === 'add' ? 'bg-dublio-cyan/20 text-dublio-cyan shadow-inner' : 'text-dublio-cyan/50 hover:bg-dublio-cyan/10 hover:text-dublio-cyan'}`}
             >
               <Search className="w-5 h-5 shrink-0" />
               <span className="font-bold hidden md:block">Yeni Kişi Ekle</span>
             </button>

             <div className="my-4 mx-4 h-[1px] bg-white/5"></div>
             <p className="px-4 text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 hidden md:block">Direkt Mesajlar</p>

             {/* Dummy recent DMs */}
             <button className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 mx-2 my-1 rounded-xl hover:bg-white/5 transition-all text-white/70 hover:text-white group">
               <div className="relative">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=alimert" className="w-8 h-8 rounded-full bg-black shrink-0" />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121318]"></div>
               </div>
               <span className="font-bold text-sm hidden md:block truncate">Ali Mert</span>
             </button>

             <button className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 mx-2 my-1 rounded-xl hover:bg-white/5 transition-all text-white/70 hover:text-white group">
               <div className="relative">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=joker" className="w-8 h-8 rounded-full bg-black shrink-0" />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-500 rounded-full border-2 border-[#121318]"></div>
               </div>
               <span className="font-bold text-sm hidden md:block truncate">Joker</span>
             </button>
          </div>

          <div className="p-4 border-t border-white/5 flex items-center gap-3 bg-black/20">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=me" className="w-10 h-10 bg-white/10 rounded-full shrink-0" />
             <div className="flex-1 min-w-0 hidden md:block">
               <p className="text-sm font-bold text-white truncate">Benim Hesabım</p>
               <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Çevrimiçi</p>
             </div>
             <button className="text-white/40 hover:text-white transition-colors hidden md:block shrink-0">
               <Settings className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-black/60 relative">
          <div className="absolute top-4 right-4 z-50">
             <div className="px-4 py-1.5 bg-pink-500/20 border border-pink-500/50 text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse">
               PRE-ALPHA TEST
             </div>
          </div>

          {activeTab === 'friends' && (
             <div className="p-8">
               <h2 className="text-2xl font-black uppercase tracking-wider border-b border-white/5 pb-4 mb-6">Tüm Arkadaşlar</h2>
               <div className="bg-[#121318] border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="relative">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=alimert" className="w-12 h-12 rounded-full bg-black shrink-0" />
                       <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#121318]"></div>
                     </div>
                     <div>
                       <p className="font-bold text-lg">Ali Mert</p>
                       <p className="text-xs text-white/40 font-medium">Şu an Witcher 3 oynuyor</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors tooltip-trigger relative group">
                        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-black text-xs font-bold px-2 py-1 rounded">Mesaj</span>
                        <Gamepad2 className="w-5 h-5 text-white/70 group-hover:text-white" />
                     </button>
                     <button className="w-10 h-10 rounded-full bg-dublio-cyan/10 hover:bg-dublio-cyan/20 flex items-center justify-center transition-colors tooltip-trigger relative group text-dublio-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-dublio-cyan text-black px-2 py-1 rounded text-xs font-bold">Sesli Ara</span>
                        <Phone className="w-5 h-5" />
                     </button>
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'add' && (
             <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="w-full max-w-lg text-center">
                  <Search className="w-16 h-16 text-dublio-cyan mx-auto mb-6 opacity-80 shadow-[0_0_30px_cyan] rounded-full p-2 bg-dublio-cyan/10" />
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Arkadaş Ekle</h2>
                  <p className="text-white/50 text-sm mb-8">Dublaj severleri bulmak için sadece kullanıcı adlarını girmeniz yeterli.</p>
                  
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Arkadaş ara..." 
                      className="w-full bg-[#121318] border border-dublio-cyan/30 rounded-2xl py-4 px-6 text-white outline-none focus:border-dublio-cyan shadow-inner text-lg placeholder:text-white/20"
                    />
                    <button className="absolute right-2 top-2 bottom-2 px-6 bg-dublio-cyan text-black font-black uppercase text-sm rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_cyan]">
                      İstek Gönder
                    </button>
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
