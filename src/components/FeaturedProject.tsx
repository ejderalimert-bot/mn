"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";
import { Play, ArrowRight } from 'lucide-react';

export default function FeaturedProject({ featuredProject }: { featuredProject: any }) {
  const { performanceMode } = usePerformance();

  if (!featuredProject) return null;

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#0A0A0C]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none overflow-hidden z-0">
         <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="w-[800px] h-[800px] bg-dublio-purple/10 blur-[150px] rounded-full"></motion.div>
         <motion.div animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="w-[600px] h-[600px] bg-dublio-cyan/10 blur-[120px] rounded-full absolute mix-blend-screen"></motion.div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="flex items-center gap-4 mb-12">
          <motion.div 
            initial={{ width: 0 }} 
            whileInView={{ width: "4rem" }} 
            viewport={{ once: true }} 
            className="h-[2px] bg-gradient-to-r from-dublio-cyan to-transparent"
          ></motion.div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.3em]">Haftanın <span className="text-dublio-cyan">Seçimi</span></h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#121318] border border-white/10 rounded-[3rem] p-8 md:p-12 items-center relative overflow-hidden ${performanceMode === 'ultra' ? 'shadow-[0_0_80px_rgba(6,182,212,0.15)] [perspective:1500px]' : ''}`}
        >
           {/* Decorator Grid */}
           <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

           {/* Image Frame */}
           <motion.div 
             whileHover={performanceMode === 'ultra' ? { rotateY: 15, rotateX: 5, scale: 1.02 } : { scale: 1.02 }}
             className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/5 group bg-black/50"
           >
             <img src={featuredProject.image || featuredProject.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} alt={featuredProject.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
             
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={`/project/${featuredProject.slug || featuredProject.id}`} className="w-20 h-20 rounded-full bg-dublio-cyan/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_cyan] hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-black fill-current ml-1" />
                </Link>
             </div>
             
             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white">{featuredProject.category || 'Özel Yapım'}</span>
             </div>
           </motion.div>

           {/* Content */}
           <div className="z-10 relative">
              <span className="text-dublio-cyan font-black tracking-widest text-sm uppercase mb-4 block animate-pulse">Yeni Çıktı</span>
              <h3 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-dublio-cyan to-dublio-purple tracking-tighter mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                 {featuredProject.title}
              </h3>
              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg line-clamp-3">
                 {featuredProject.description || "Bu muhteşem proje için hazırlanan detayları keşfet ve hemen yeni bir maceraya atıl. Star Dublaj kalitesiyle en iyi deneyimi yaşa."}
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                 <Link href={`/project/${featuredProject.slug || featuredProject.id}`} className="flex items-center gap-3 px-8 h-14 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                   Hemen İncele <ArrowRight className="w-5 h-5" />
                 </Link>
                 <div className="flex -space-x-3">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#121318] bg-black overflow-hidden flex items-center justify-center">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+featuredProject.id}`} className="w-full h-full object-cover opacity-80" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#121318] bg-[#2a2c36] overflow-hidden flex items-center justify-center text-[10px] font-black text-white">+2K</div>
                 </div>
              </div>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
