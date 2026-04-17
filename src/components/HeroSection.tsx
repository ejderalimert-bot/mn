"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";
import { Play, ThumbsUp, Heart } from 'lucide-react';

const HeroSection = () => {
  const { performanceMode } = usePerformance();
  const { scrollY } = useScroll();
  const yCover = useTransform(scrollY, [0, 1000], [0, 400]);
  const scaleCover = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const yText = useTransform(scrollY, [0, 800], [0, 150]);

  // Mouse Tracking for Radial Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      }))
    );
  }, []);

  return (
    <div onMouseMove={performanceMode === 'ultra' ? handleMouseMove : undefined} className="relative w-full z-10 transition-opacity duration-[1500ms] group/spotlight bg-[#111115]">
      
      {/* Cinematic Particles Layer */}
      {performanceMode === 'ultra' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 fixed h-[100vh] w-full">
         {particles.map((p) => (
           <motion.div
             key={p.id}
             className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
             style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
             animate={{ 
               y: [0, -1000],
               opacity: [0, 0.8, 0],
               scale: [1, 2, 1]
             }}
             transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
           />
         ))}
        </div>
      )}

      {/* Extreme Cinematic Bleed Cover Area */}
      <motion.div style={{ perspective: 1000 }} className="relative w-full h-[70vh] min-h-[600px] shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0a0a0c]">
        {/* Background Base Image */}
        <motion.img 
          style={performanceMode === 'ultra' ? { y: yCover, scale: scaleCover, filter: "brightness(0.3) blur(2px)" } : { filter: "brightness(0.3)" }} 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f" 
          alt="Star Dublaj Studio Hero" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
        />
        
        {/* Giant Blurred Color Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-dublio-cyan/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-dublio-purple/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-transparent to-transparent"></div>
        
        {/* Foreground Content container */}
        <motion.div style={performanceMode === 'ultra' ? { y: yText } : {}} className="absolute bottom-0 left-0 w-full [transform-style:preserve-3d]">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl flex flex-col lg:flex-row items-end gap-10 lg:gap-16 pb-16">
            
            {/* The Poster Card (Project Page Style) */}
            <motion.div 
              variants={{ hidden: { y: 150, rotateY: 90, scale: 0.5, opacity: 0 }, visible: { y: 0, rotateY: 0, scale: 1, opacity: 1, transition: { duration: 2, ease: [0.22, 1, 0.36, 1] } } }}
              initial="hidden" animate="visible"
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5, y: -10 }}
              className="w-56 h-80 md:w-72 md:h-[26rem] rounded-[2rem] overflow-hidden shrink-0 shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-[3px] border-white/5 relative bg-[#1a1c23] z-20 group cursor-pointer hidden sm:block"
            >
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" alt="Showcase" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <div className="w-16 h-16 rounded-full bg-dublio-cyan text-black flex items-center justify-center shadow-[0_0_30px_cyan] scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 ml-1 fill-current" />
                 </div>
              </div>
            </motion.div>
            
            {/* The Huge Text Block */}
            <motion.div 
              variants={{ hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              initial="hidden" animate="visible"
              className="flex-1 w-full pb-4 relative z-20"
            >
                {/* Badges */}
                <div className="flex items-center gap-3 mb-5">
                    <motion.span animate={performanceMode === 'ultra' ? { boxShadow: ["0px 0px 0px rgba(6,182,212,0)", "0px 0px 30px rgba(6,182,212,0.8)", "0px 0px 0px rgba(6,182,212,0)"] } : {}} transition={{ duration: 3, repeat: Infinity }} className="px-4 py-1.5 bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 rounded-full text-xs font-black uppercase tracking-widest">
                       TÜRKİYE'NİN MERKEZİ
                    </motion.span>
                    <span className="text-white/30 text-xs font-bold tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">EDİTÖRÜN SEÇİMİ ˅</span>
                </div>

                {/* Main Titles */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 tracking-tight mb-4 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                  Star Dublaj<br/>Studios
                </h1>
                
                <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8">
                  Profesyonel Türkçe dublaj projeleri, eşsiz yerelleştirme modları ve nefes kesen oyun içerikleriyle yepyeni bir dünyaya hazırlanın.
                </p>

                {/* Call To Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/mods">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-3 px-8 h-14 rounded-2xl font-black text-sm transition-all duration-300 relative overflow-hidden group bg-gradient-to-r from-dublio-cyan to-blue-600 text-white shadow-[0_0_40px_rgba(6,182,212,0.5)] border border-white/10"
                    >
                      <Play className="w-5 h-5 relative z-10 fill-current" /> <span className="relative z-10">TÜM MODLARI KEŞFET</span>
                    </motion.button>
                  </Link>

                  <Link href="/news">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="flex items-center justify-center gap-3 px-8 h-14 rounded-2xl font-black text-sm transition-all duration-300 relative overflow-hidden group bg-white/5 text-white backdrop-blur-xl border border-white/10 hover:bg-white/10"
                     >
                       <span className="relative z-10 text-white/80 group-hover:text-white">SON HABERLER</span>
                     </motion.button>
                  </Link>
                </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
