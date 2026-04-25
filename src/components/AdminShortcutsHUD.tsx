"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Shield, Plus, Save, Gamepad2, Search } from "lucide-react";

export default function AdminShortcutsHUD() {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);

  const isEjderAlimert = 
    session?.user?.name?.toLowerCase().includes("ejderalimert") || 
    session?.user?.name?.toLowerCase().includes("ejder alimert") ||
    session?.user?.email?.toLowerCase().includes("admin@stardublaj") ||
    session?.user?.email?.toLowerCase() === "ejderalimert@gmail.com";

  useEffect(() => {
    if (!isEjderAlimert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Sadece tek başına CTRL'ye basıldığında (ve basılı tutulduğunda)
      if (e.key === "Control") {
        setShow(true);
      }
    };
    
    // CTRL tuşu bırakılınca ya da odak kaybedilince kapat
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setShow(false);
      }
    };
    
    const handleBlur = () => setShow(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isEjderAlimert]);

  if (!isEjderAlimert) return null;

  const shortcuts = [
    { label: "Komut Paleti / Arama", keys: ["CTRL", "K"], icon: <Search className="w-4 h-4" /> },
    { label: "Yönetici Paneline Git (Komut paletinden)", keys: ["CTRL", "K", "Enter"], icon: <Shield className="w-4 h-4" /> },
    { label: "Yeni Proje Ekle (Admin sayfasındayken)", keys: ["ALT", "N"], icon: <Plus className="w-4 h-4" /> },
    { label: "Oyun Ekle Sekmesi (Admin sayfasındayken)", keys: ["ALT", "S"], icon: <Gamepad2 className="w-4 h-4" /> },
    { label: "Formu Kaydet (Admin formundayken)", keys: ["CTRL", "S"], icon: <Save className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-3xl border border-stardublajweb-cyan/40 p-6 rounded-2xl shadow-[0_0_80px_rgba(106,255,235,0.2)] min-w-[400px]">
             
             <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-stardublajweb-cyan/20 border-2 border-stardublajweb-cyan flex items-center justify-center animate-pulse shadow-[0_0_20px_cyan]">
                      <Command className="w-5 h-5 text-stardublajweb-cyan" />
                   </div>
                   <div className="flex flex-col">
                     <span className="font-black italic uppercase text-lg text-white drop-shadow-[0_0_10px_white]">SYSTEM OVERRIDE</span>
                     <span className="text-[10px] text-stardublajweb-cyan font-bold tracking-[0.2em] uppercase">Hoşgeldin Ejder Alimert</span>
                   </div>
                </div>
             </div>

             <div className="space-y-3">
               {shortcuts.map((s, i) => (
                 <div key={i} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="text-white/50">{s.icon}</div>
                      <span className="text-sm font-medium text-white/80">{s.label}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     {s.keys.map((k, kidx) => (
                       <kbd key={kidx} className="bg-white/10 border border-white/20 text-white font-bold text-xs px-2 py-1 rounded shadow-inner">
                         {k}
                       </kbd>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-4 text-center">
                <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Kapatmak için CTRL tuşunu bırakın</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
