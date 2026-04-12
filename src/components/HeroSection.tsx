"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden pt-10 px-8">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center -space-y-32">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-[1200px] h-[600px] bg-dublio-purple/20 blur-[150px] rounded-full absolute -top-1/4 -right-1/4"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full absolute -bottom-1/4 -left-1/4 opacity-50"
        ></motion.div>

        {/* Floating 3D Objects */}
        <motion.div animate={{ y: [0, -50, 0], rotateX: [0, 360], rotateY: [0, 180] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute left-[10%] top-[20%] w-32 h-32 border-[1px] border-dublio-cyan/20 rounded-3xl [transform-style:preserve-3d] shadow-[0_0_50px_rgba(106,255,235,0.1)]"></motion.div>
        <motion.div animate={{ y: [0, 60, 0], rotateX: [0, -360], rotateZ: [0, 180] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute right-[15%] bottom-[30%] w-24 h-24 border-[1px] border-dublio-purple/20 rounded-full [transform-style:preserve-3d] shadow-[0_0_50px_rgba(168,85,247,0.1)]"></motion.div>

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="container relative z-10 flex flex-col items-center text-center max-w-5xl [perspective:2000px]"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } } }} className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-dublio-cyan rounded-full shadow-[0_0_8px_#6affeb] animate-pulse"></span>
          <span className="text-[11px] font-bold text-dublio-text-dark tracking-[0.2em] uppercase">Star Dublaj Studios</span>
        </motion.div>

        <motion.h1 variants={{ hidden: { opacity: 0, scale: 0.6, rotateX: 90 }, visible: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 100, damping: 10 } } }} className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter uppercase italic drop-shadow-2xl">
          TÜRKİYENİN<br />
          <span className="dublio-gradient-text drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">DUBLAJ&nbsp; MERKEZİ</span>
        </motion.h1>

        <motion.p variants={{ hidden: { opacity: 0, y: 30, rotateX: -45 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 120 } } }} className="text-xl md:text-2xl text-dublio-text-dark max-w-3xl mb-12 font-medium">
          Video Dublajları tek çatı altında. <br />
          Oyun modlarını keşfetmeye hazırlan!!!
        </motion.p>

        <motion.div variants={{ hidden: { opacity: 0, y: 40, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.7 } } }} className="flex flex-col sm:flex-row gap-5 mb-24 min-w-[300px]">
          <button className="relative overflow-hidden group px-10 py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-110 active:scale-95 transition-[transform] shadow-[0_10px_50px_rgba(255,255,255,0.4)]">
            <span className="relative z-10 w-full flex items-center justify-center">VİDEOLARI KEŞFET</span>
            <div className="absolute inset-0 h-full w-0 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full"></div>
          </button>
          <button className="relative overflow-hidden group px-10 py-5 bg-dublio-light/50 border border-white/10 text-white font-black text-xl rounded-2xl hover:scale-110 transition-[transform] backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="relative z-10 w-full flex items-center justify-center">MODLARI KEŞFET</span>
            <div className="absolute inset-0 h-full w-0 bg-dublio-purple/30 transition-all duration-300 ease-out group-hover:w-full"></div>
          </button>
        </motion.div>

      </motion.div>

      {/* Marquee effect at bottom */}
      <div className="w-full bg-[#1d1d1f] border-y border-white/5 py-8 mt-32 overflow-hidden whitespace-nowrap">
        <div className="animate-float flex gap-20">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-8xl font-black text-white/5 tracking-widest uppercase italic">
              STAR DUBLAJ • MODS • DUBLAJ • SEO • AI • GEMINI • STAR DUBLAJ •
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
