"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MonitorPlay, Users, Gamepad2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K or CTRL+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions = [
    { id: 1, title: "Projeleri Keşfet", icon: <Gamepad2 className="w-5 h-5" />, path: "/#projects" },
    { id: 2, title: "Haberlere Göz At", icon: <MonitorPlay className="w-5 h-5" />, path: "/#news" },
    { id: 3, title: "Star Ekibiyle Tanış", icon: <Users className="w-5 h-5" />, path: "/team" },
    { id: 4, title: "Yönetici Paneline Geç", icon: <AlertCircle className="w-5 h-5 text-red-500" />, path: "/admin" },
  ];

  const filteredActions = actions.filter(action => action.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Palette */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-[#121318] border border-white/10 shadow-[0_0_80px_rgba(168,85,247,0.2)] rounded-3xl overflow-hidden"
          >
             <div className="flex items-center px-6 py-4 border-b border-white/10">
               <Search className="w-6 h-6 text-white/50 mr-4" />
               <input 
                 autoFocus
                 type="text" 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Sitede gezin (örn: projeler, admin...)" 
                 className="flex-1 bg-transparent outline-none text-white text-lg font-medium placeholder:text-white/30"
               />
               <div className="px-2 py-1 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white/50">
                 ESC
               </div>
             </div>

             <div className="max-h-96 overflow-y-auto p-4">
               {filteredActions.length > 0 ? (
                 <div className="space-y-2">
                   <p className="text-xs font-bold text-dublio-cyan uppercase tracking-widest px-2 mb-2">Hızlı İşlemler</p>
                   {filteredActions.map((action, i) => (
                     <button
                       key={action.id}
                       onClick={() => handleSelect(action.path)}
                       className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-white/5 data-[active=true]:bg-dublio-purple/20 transition-all text-left group"
                     >
                       <div className="w-10 h-10 rounded-lg border border-white/10 bg-black/50 flex items-center justify-center group-hover:border-dublio-cyan group-hover:text-dublio-cyan transition-colors text-white/70">
                         {action.icon}
                       </div>
                       <span className="text-white font-medium group-hover:text-dublio-cyan transition-colors">{action.title}</span>
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 text-center text-white/40">
                   Sonuç bulunamadı "{query}"
                 </div>
               )}
             </div>
             
             <div className="px-6 py-3 bg-[#0a0a0c] border-t border-white/5 flex gap-4 text-xs font-medium text-white/30">
               <span className="flex items-center gap-2">
                 <kbd className="px-2 py-1 bg-white/5 rounded">↑↓</kbd> Gezin
               </span>
               <span className="flex items-center gap-2">
                 <kbd className="px-2 py-1 bg-white/5 rounded">Enter</kbd> Seç
               </span>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
