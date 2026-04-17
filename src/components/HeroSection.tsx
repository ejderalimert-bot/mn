"use client";
import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";
import { Play, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const { performanceMode } = usePerformance();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleText = useTransform(scrollY, [0, 500], [1, 0.95]);

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0c] selection:bg-dublio-cyan/30">
      
      {/* Zarif Arka Plan Işıkları */}
      {performanceMode === 'ultra' && (
        <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-dublio-purple/10 blur-[150px] rounded-full mix-blend-screen opacity-70"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-dublio-cyan/10 blur-[150px] rounded-full mix-blend-screen opacity-70"></div>
          
          {/* İnce ızgara (Grid) */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{ 
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          />
        </motion.div>
      )}

      {/* Merkeze Odaklı İçerik (Apple / Vercel Tarzı Modern Yaklaşım) */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{ opacity: opacityText, scale: scaleText }}
        variants={{ visible: { transition: { staggerChildren: performanceMode === 'ultra' ? 0.1 : 0 } } }}
        className="container relative z-10 flex flex-col items-center text-center px-6 md:px-12 mt-16"
      >
        
        {/* İnce Rozet / Tag */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-full mb-10 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-dublio-cyan animate-pulse" />
          <span className="text-xs font-semibold text-white/80 tracking-[0.2em] uppercase">Star Dublaj Studios</span>
        </motion.div>

        {/* Ana Başlık */}
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }} 
          className="text-5xl md:text-7xl lg:text-[6rem] font-bold text-white leading-[1.05] tracking-tight mb-8 max-w-5xl"
        >
          Sesin ve oyunun
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-dublio-cyan via-white to-dublio-purple drop-shadow-sm"> kusursuz uyumu</span>
        </motion.h1>

        {/* Alt Metin */}
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } } }} 
          className="text-lg md:text-xl text-white/50 max-w-2xl font-medium leading-relaxed mb-14"
        >
          Türkiye'nin lider dublaj merkezi. Profesyonel Türkçe dublaj projeleri ve özel oyun modlarıyla hikayenin gerçek derinliğini keşfedin.
        </motion.p>

        {/* Butonlar */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } } }} 
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <Link href="/projects" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <Play className="w-5 h-5 fill-current" />
              <span>Projeleri İncele</span>
            </button>
          </Link>
          
          <Link href="/news" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white/80 border border-white/10 font-semibold rounded-2xl hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm">
              Gelişmeleri Oku
            </button>
          </Link>
        </motion.div>

      </motion.div>

      {/* Modern ve Sade Alt Çizgi Geçişi */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
};

export default HeroSection;
