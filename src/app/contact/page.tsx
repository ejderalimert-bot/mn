"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import HomeFooter from "@/components/HomeFooter";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-dublio-cyan/30 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-12 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Arka plan efektleri */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 blur-[150px] mix-blend-screen rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-400 to-indigo-600 tracking-tighter mb-8"
          >
            İLETİŞİM
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 leading-relaxed font-medium mb-12 max-w-2xl mx-auto"
          >
            İş birlikleri, projeler ve sorularınız için bizimle her zaman bağlantıya geçebilirsiniz. Sinyallerini bekliyoruz.
          </motion.p>
          
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto"
          >
             <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center">
                <h3 className="text-xl font-black mb-2 uppercase tracking-wider text-blue-400">E-Posta</h3>
                <p className="text-white/60">iletisim@stardublaj.com</p>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center">
                <h3 className="text-xl font-black mb-2 uppercase tracking-wider text-dublio-purple">Discord</h3>
                <p className="text-white/60">discord.gg/stardublaj</p>
             </div>
          </motion.div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

export default ContactPage;
