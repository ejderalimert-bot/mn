"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [news, setNews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch projects for global search cache
    fetch('/api/projects').then(r => r.json()).then(data => setProjects(data)).catch(() => {});
    
    // Fetch recent news for notifications
    fetch('/api/news?limit=3').then(r => r.json()).then(data => setNews(data)).catch(() => {});
    
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Combine projects and news into a unified notifications array
    const combined = [
       ...projects.map(p => ({ type: 'project', date: parseInt(p.id) || 0, data: p })),
       ...news.map(n => ({ type: 'news', date: new Date(n.createdAt).getTime(), data: n }))
    ].sort((a,b) => b.date - a.date).slice(0, 5);
    setNotifications(combined);
  }, [projects, news]);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const results = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setSearchResults(results.slice(0, 5)); // show top 5
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchTerm, projects]);

  return (
    <header className="sticky top-0 h-16 bg-[#1d1d1f]/80 backdrop-blur-md border-b border-[#2f2f38]/30 z-[100] w-full">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
               src="/logo.png" 
               alt="Star Dublaj Logo" 
               className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform" 
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLDivElement;
                 if (fallback) fallback.classList.remove('hidden');
               }}
            />
            {/* Fallback if logo.png is missing */}
            <div className="hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">STAR DUBLAJ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/news" className={`relative text-sm font-medium transition-colors pb-1 ${pathname?.startsWith('/news') ? 'text-white' : 'text-white/70 hover:text-white'}`}>
              Haberler
              {pathname?.startsWith('/news') && <motion.span layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] rounded-full bg-dublio-cyan shadow-[0_0_10px_rgba(106,255,235,0.7)]"></motion.span>}
            </Link>
            <Link href="/mods" className={`relative text-sm font-medium transition-colors pb-1 ${pathname?.startsWith('/mods') ? 'text-white' : 'text-white/70 hover:text-white'}`}>
              Modlar
              {pathname?.startsWith('/mods') && <motion.span layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] rounded-full bg-dublio-cyan shadow-[0_0_10px_rgba(106,255,235,0.7)]"></motion.span>}
            </Link>
            <Link href="/dubbing" className={`relative text-sm font-medium transition-colors pb-1 ${pathname?.startsWith('/dubbing') ? 'text-white' : 'text-white/70 hover:text-white'}`}>
              Seslendirme
              {pathname?.startsWith('/dubbing') && <motion.span layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] rounded-full bg-dublio-cyan shadow-[0_0_10px_rgba(106,255,235,0.7)]"></motion.span>}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search System */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <div className={`flex items-center gap-2 px-4 py-1.5 ${isSearchOpen ? 'bg-[#2f2f38] ring-1 ring-dublio-cyan text-white' : 'bg-[#2f2f38]/50 text-white/60 hover:bg-[#2f2f38] hover:text-white'} transition-all rounded-full border border-white/5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if(searchTerm.length > 1) setIsSearchOpen(true); }}
                className="bg-transparent border-none outline-none text-sm w-48 placeholder-white/40 font-medium z-10" 
              />
            </div>

            {/* Dropdown Menu */}
            {isSearchOpen && (
              <div className="absolute top-12 right-0 w-80 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-[9999]">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 text-[10px] font-black italic tracking-widest text-white/30 uppercase border-b border-white/5 bg-black/20">
                      Sonuçlar ({searchResults.length})
                    </div>
                    {searchResults.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/project/${p.slug || p.id}`} 
                        onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 relative bg-black">
                           {p.image || p.thumbnail ? (
                              <img src={p.image || p.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           ) : (
                              <span className="text-[10px] font-bold text-white/30 absolute inset-0 flex items-center justify-center">{p.category?.substring(0,3)}</span>
                           )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate group-hover:text-dublio-cyan transition-colors">{p.title}</span>
                          <span className="text-[10px] text-white/40 tracking-widest uppercase">{p.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm font-bold text-white/40">
                    Sonuç bulunamadı.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications System */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-white/70" />
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-dublio-purple rounded-full shadow-[0_0_10px_purple] animate-pulse"></span>}
            </button>
            
            {isNotifOpen && (
              <div className="absolute top-12 right-0 w-80 sm:w-96 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-[9999]">
                <div className="px-4 py-3 text-xs font-black italic tracking-widest text-white/40 uppercase border-b border-white/5 bg-black/20 flex items-center justify-between">
                  BİLDİRİMLER
                </div>
                <div className="flex flex-col max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((item, idx) => {
                      if (item.type === 'project') {
                        const p = item.data;
                        return (
                        <Link key={`p-${p.id}`} href={`/project/${p.slug || p.id}`} onClick={() => setIsNotifOpen(false)} className="flex items-center gap-4 p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10 group-hover:border-dublio-purple/50 shadow-inner transition-colors">
                              {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs font-bold text-white/20 uppercase">{p.category}</span>}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-bold text-white group-hover:text-dublio-cyan transition-colors truncate mb-1">{p.title}</span>
                              <span className="text-[10px] text-dublio-cyan font-bold tracking-wide uppercase mb-0.5">YENİ PROJE YAYINLANDI</span>
                              <span className="text-xs text-white/50 tracking-wide leading-snug truncate">Projeyi incelemeye başla.</span>
                            </div>
                          </Link>
                        )
                      } else {
                        const n = item.data;
                        return (
                          <Link key={`n-${n.id}`} href={`/news/${n.id}`} onClick={() => setIsNotifOpen(false)} className="flex items-center gap-4 p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10 group-hover:border-pink-500/50 shadow-inner transition-colors">
                              {n.image ? <img src={n.image} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs font-bold text-white/20 uppercase">HABER</span>}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-bold text-white group-hover:text-pink-500 transition-colors truncate mb-1">{n.title}</span>
                              <span className="text-[10px] text-pink-500 font-bold tracking-wide uppercase mb-0.5">YENİ HABER</span>
                              <span className="text-xs text-white/50 tracking-wide leading-snug truncate">Tıklayıp hemen oku.</span>
                            </div>
                          </Link>
                        )
                      }
                    })
                  ) : (
                    <div className="p-6 text-center text-sm font-bold text-white/40">
                      Henüz bildirim yok.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/5 mx-2"></div>

          {session ? (
            <div className="flex items-center gap-4">
              {/* Check if user is admin */}
              {(session.user as any)?.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden md:flex px-4 py-2 bg-dublio-purple/20 border border-dublio-purple/50 text-dublio-purple hover:bg-dublio-purple hover:text-white rounded-lg text-xs font-black italic tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                  YÖNETİCİ PANELİ
                </Link>
              )}
              
              <div className="flex flex-col items-end hidden sm:flex border-l border-white/10 pl-4 ml-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Hoşgeldin</span>
                <span className="text-xs font-bold text-white leading-none">{session.user?.name}</span>
              </div>
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-dublio-purple transition-all ring-2 ring-transparent hover:ring-dublio-purple/30"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-dublio-light flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0)}
                  </div>
                )}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-[10px] font-black text-white/20 hover:text-red-500 uppercase tracking-widest transition-colors ml-2"
              >
                ÇIKIŞ
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                Giriş Yap
              </Link>

              <Link href="/register" className="px-5 py-2 bg-white text-black font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors">
                Katıl
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
