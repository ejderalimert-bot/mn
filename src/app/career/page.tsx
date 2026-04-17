"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import HomeFooter from "@/components/HomeFooter";

const CareerPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-dublio-cyan/30 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-12 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Arka plan efektleri */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] mix-blend-screen rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-400 to-green-600 tracking-tighter mb-8"
          >
            KARİYER
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 leading-relaxed font-medium mb-12"
          >
            Vizyonumuzun bir parçası olmak, dublaj ve yazılım yeteneklerini on binlere ulaştırmak ister misin? Aramıza katıl.
          </motion.p>

          <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="px-10 py-5 bg-white text-black font-black rounded-2xl md:text-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              AÇIK POZİSYONLARI GÖR
          </motion.button>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

export default CareerPage;
