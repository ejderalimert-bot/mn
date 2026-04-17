"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Star, Users, Zap, Download } from 'lucide-react';

export default function HomeStatsBar() {
  return (
    <div className="w-full bg-[#0E0E12] border-y border-white/[0.05] py-4 relative z-20 overflow-hidden hidden md:block">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPgo8L3JlY3Q+Cjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex items-center justify-around">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-dublio-purple/10 border border-dublio-purple/20 flex items-center justify-center group-hover:bg-dublio-purple/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Activity className="w-5 h-5 text-dublio-purple" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white leading-none tracking-tight">450K+</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Aylık Etkileşim</span>
            </div>
          </div>

          <div className="w-px h-10 bg-white/[0.05]"></div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-dublio-cyan/10 border border-dublio-cyan/20 flex items-center justify-center group-hover:bg-dublio-cyan/20 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Download className="w-5 h-5 text-dublio-cyan" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white leading-none tracking-tight">85+</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Aktif Mod Yayınlandı</span>
            </div>
          </div>

          <div className="w-px h-10 bg-white/[0.05]"></div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              <Users className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white leading-none tracking-tight">12K+</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Kayıtlı Kullanıcı</span>
            </div>
          </div>

          <div className="w-px h-10 bg-white/[0.05]"></div>

          {/* Stat 4 */}
          <div className="flex items-center gap-4 group">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Star className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <div>
              <span className="block text-2xl font-black text-white leading-none tracking-tight">4.9/5</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Oyuncu Memnuniyeti</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
