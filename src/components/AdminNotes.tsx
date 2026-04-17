"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNotes() {
  const [notes, setNotes] = useState<{ id: number, text: string, status: 'todo' | 'doing' | 'done', timestamp: string }[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dublio_admin_kanban");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveNotes = (updated: any) => {
    setNotes(updated);
    localStorage.setItem("dublio_admin_kanban", JSON.stringify(updated));
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const item = {
      id: Date.now(),
      text: newNote,
      status: 'todo' as const,
      timestamp: new Date().toLocaleString()
    };
    saveNotes([...notes, item]);
    setNewNote("");
  };

  const updateStatus = (id: number, status: 'todo' | 'doing' | 'done') => {
    const updated = notes.map(n => n.id === id ? { ...n, status } : n);
    saveNotes(updated);
  };

  const deleteNote = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  const renderColumn = (statusValue: 'todo' | 'doing' | 'done', title: string, colorClass: string, bgClass: string) => (
    <div className={`flex flex-col gap-3 rounded-2xl p-4 bg-black/40 border border-white/5 h-[400px] overflow-y-auto ${bgClass} shadow-inner`}>
      <h4 className={`text-sm font-black uppercase tracking-widest ${colorClass} sticky top-0 bg-black/60 backdrop-blur-md p-2 rounded-lg text-center shadow-md`}>{title}</h4>
      <AnimatePresence>
        {notes.filter(n => n.status === statusValue).map(note => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 rounded-xl bg-[#1a1c23] border border-white/10 relative group hover:border-white/30 transition-all shadow-md"
          >
            <p className="text-white text-sm font-medium pr-6 leading-relaxed bg-transparent border-none focus:outline-none resize-none">{note.text}</p>
            <span className="text-[10px] text-white/30 font-bold mt-2 block">{note.timestamp}</span>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
              <button onClick={() => deleteNote(note.id)} className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40"><Trash2 className="w-3 h-3" /></button>
            </div>

            <div className="mt-4 flex gap-2 w-full justify-between border-t border-white/5 pt-3">
              {statusValue !== 'todo' && <button onClick={() => updateStatus(note.id, 'todo')} className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 hover:text-white font-bold transition">Todo</button>}
              {statusValue !== 'doing' && <button onClick={() => updateStatus(note.id, 'doing')} className="text-xs px-2 py-1 rounded bg-dublio-cyan/10 text-dublio-cyan hover:bg-dublio-cyan/20 font-bold transition flex items-center gap-1"><Clock className="w-3 h-3"/> Doing</button>}
              {statusValue !== 'done' && <button onClick={() => updateStatus(note.id, 'done')} className="text-xs px-2 py-1 rounded bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20 font-bold transition flex items-center gap-1"><Check className="w-3 h-3"/> Done</button>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-black/50 backdrop-blur-3xl border-2 border-pink-500/20 rounded-[2rem] p-8 md:p-12 shadow-[0_0_80px_rgba(236,72,153,0.05)] mt-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-500 uppercase tracking-wide">Yönetici Planlayıcı & To-Do</h3>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Sisteminiz için kişisel görev takip ekranı (Local)</p>
        </div>
      </div>

      <form onSubmit={addNote} className="mb-8 flex gap-4 relative z-10">
        <input 
          type="text" 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Yeni bir görev veya not yazın... (Örn: RDR2 fragmanı eklenecek)" 
          className="flex-1 bg-white/5 backdrop-blur-xl border border-pink-500/30 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all font-medium placeholder:text-white/30"
        />
        <button 
          type="submit" 
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 text-white font-black italic tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> EKLE
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {renderColumn('todo', '⏳ Bekliyor', 'text-white', 'border-white/10')}
        {renderColumn('doing', '⚙️ Yapılıyor', 'text-dublio-cyan', 'border-dublio-cyan/20')}
        {renderColumn('done', '✅ Tamamlandı', 'text-[#00ff00]', 'border-[#00ff00]/20')}
      </div>
    </div>
  );
}
