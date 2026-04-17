"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { Bell, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";

const Navbar = () => {
  const { performanceMode } = usePerformance();
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
    <header className={`sticky top-0 h-16 z-[100] w-full transition-colors duration-300 ${isMobileMenuOpen ? 'bg-[#0A0A0C]' : 'bg-[#1d1d1f]/80 backdrop-blur-md border-b border-[#2f2f38]/30'}`}>
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4 lg:gap-8">
          
          <button 
            className="md:hidden text-white hover:text-dublio-cyan focus:outline-none z-[110]" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group relative z-[110]" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.img 
               src="/logo.png" 
               alt="Star Dublaj Logo" 
               whileHover={performanceMode === 'ultra' ? { rotate: 360, scale: 1.2 } : { scale: 1.05 }}
               transition={performanceMode === 'ultra' ? { type: "spring", stiffness: 100, damping: 10 } : { duration: 0.2 }}
               className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLDivElement;
                 if (fallback) fallback.classList.remove('hidden');
               }}
            />
            {/* Fallback if logo.png is missing */}
            <motion.div whileHover={{ rotate: 180, scale: 1.2 }} className="hidden w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg md:text-xl">S</span>
            </motion.div>
            <span className="font-bold text-lg md:text-xl text-white tracking-tight group-hover:text-dublio-cyan transition-colors hidden sm:block">STAR DUBLAJ</span>
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
            <Link href="/partners" className={`relative text-sm font-medium transition-colors pb-1 ${pathname?.startsWith('/partners') ? 'text-white text-pink-500' : 'text-pink-400/80 hover:text-pink-400'}`}>
              Ortak Ekibimiz
              {pathname?.startsWith('/partners') && <motion.span layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[2px] rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.7)]"></motion.span>}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 relative z-[110]">
          {/* Search System (Desktop & Tablet) */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className={`flex items-center gap-2 px-4 py-1.5 ${isSearchOpen ? 'bg-[#2f2f38] ring-1 ring-dublio-cyan text-white' : 'bg-[#2f2f38]/50 text-white/60 hover:bg-[#2f2f38] hover:text-white'} transition-all rounded-full border border-white/5`}>
              <Search className="w-4 h-4 shrink-0" />
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
              <div className="absolute top-12 right-0 w-[calc(100vw-2rem)] max-w-80 sm:w-96 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-[9999] origin-top-right">
                <div className="px-4 py-3 text-xs font-black italic tracking-widest text-white/40 uppercase border-b border-white/5 bg-black/20 flex items-center justify-between">
                  BİLDİRİMLER
                </div>
                <div className="flex flex-col max-h-[60vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
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

          <div className="h-8 w-px bg-white/5 mx-1 sm:mx-2 hidden sm:block"></div>

          {session ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Check if user is admin */}
              {(session.user as any)?.role === "admin" && (
               <Link
                 href="/admin"
                 className="hidden lg:flex px-4 py-2 bg-dublio-purple/20 border border-dublio-purple/50 text-dublio-purple hover:bg-dublio-purple hover:text-white rounded-lg text-xs font-black italic tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
               >
                 YÖNETİCİ PANELİ
               </Link>
              )}
              
              <div className="flex flex-col items-end hidden lg:flex border-l border-white/10 pl-4 ml-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Hoşgeldin</span>
                <span className="text-xs font-bold text-white leading-none">{session.user?.name}</span>
              </div>
              <Link
                href="/profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 overflow-hidden hover:border-dublio-purple transition-all ring-2 ring-transparent hover:ring-dublio-purple/30 shrink-0"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-dublio-light flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0)}
                  </div>
                )}
              </Link>
              <div className="flex flex-col gap-1 ml-1 sm:ml-2 hidden sm:flex">
                <Link
                  href="/profile?tab=settings"
                  className="text-[10px] font-black text-white/40 hover:text-dublio-cyan uppercase tracking-widest transition-colors"
                >
                  AYARLAR
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-[10px] font-black text-white/20 hover:text-red-500 uppercase tracking-widest transition-colors text-left"
                >
                  ÇIKIŞ
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login" className="hidden sm:block text-sm font-bold text-white/70 hover:text-white transition-colors">
                Giriş Yap
              </Link>

              <Link href="/register" className="px-4 py-1.5 sm:px-5 sm:py-2 bg-white text-black font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                Katıl
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Mobile Full Screen Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 top-16 z-[90] bg-[#0A0A0C] border-t border-white/5 md:hidden overflow-y-auto"
        >
           <div className="flex flex-col p-6 gap-6">
              
              {/* Mobile Search */}
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Projelerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-dublio-cyan"
                />
              </div>

               {/* Mobile Search Results */}
              {searchTerm.length > 1 && searchResults.length > 0 && (
                <div className="bg-[#1a1c23] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                   {searchResults.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/project/${p.slug || p.id}`} 
                        onClick={() => { setIsMobileMenuOpen(false); setSearchTerm(''); }}
                        className="flex items-center gap-4 p-3 border-b border-white/5 last:border-0"
                      >
                         {p.image && <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />}
                         <div className="flex flex-col">
                           <span className="text-white font-bold">{p.title}</span>
                           <span className="text-[10px] text-white/50 uppercase">{p.category}</span>
                         </div>
                      </Link>
                   ))}
                </div>
              )}

              <div className="h-px w-full bg-white/5"></div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-4">
                 <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-widest ${pathname?.startsWith('/news') ? 'text-dublio-cyan' : 'text-white'}`}>
                   Haberler
                 </Link>
                 <Link href="/mods" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-widest ${pathname?.startsWith('/mods') ? 'text-dublio-cyan' : 'text-white'}`}>
                   Modlar
                 </Link>
                 <Link href="/dubbing" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-widest ${pathname?.startsWith('/dubbing') ? 'text-dublio-cyan' : 'text-white'}`}>
                   Seslendirme
                 </Link>
                 <Link href="/partners" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-black uppercase tracking-widest ${pathname?.startsWith('/partners') ? 'text-pink-500' : 'text-white'}`}>
                   Ortak Ekibimiz
                 </Link>
              </nav>

              <div className="h-px w-full bg-white/5"></div>

              {/* Mobile Account / Auth */}
              {session ? (
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                       <img src={session.user?.image || ''} className="w-14 h-14 rounded-full border border-white/20" />
                       <div className="flex flex-col">
                          <span className="text-white font-bold text-lg">{session.user?.name}</span>
                          <span className="text-white/50 text-xs">{session.user?.email}</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                       {(session.user as any)?.role === "admin" && (
                         <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="col-span-2 py-3 bg-dublio-purple/20 border border-dublio-purple/50 text-dublio-purple rounded-xl text-center font-black uppercase tracking-widest text-xs">
                           Yönetim Paneli
                         </Link>
                       )}
                       <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="py-3 bg-white/5 border border-white/10 rounded-xl text-center font-bold text-white">Profilim</Link>
                       <Link href="/profile?tab=settings" onClick={() => setIsMobileMenuOpen(false)} className="py-3 bg-white/5 border border-white/10 rounded-xl text-center font-bold text-white">Ayarlar</Link>
                       <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="col-span-2 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold uppercase tracking-widest text-sm">
                         Çıkış Yap
                       </button>
                    </div>
                 </div>
              ) : (
                 <div className="flex flex-col gap-4 mt-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-center font-bold text-white">
                      Hesabına Giriş Yap
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-white text-black rounded-xl text-center font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      Aramıza Katıl
                    </Link>
                 </div>
              )}
           </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
