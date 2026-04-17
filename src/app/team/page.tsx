"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import HomeFooter from "@/components/HomeFooter";

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-dublio-cyan/30 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-12 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Arka plan efektleri */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-500/20 blur-[150px] mix-blend-screen rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-red-500 to-pink-500 tracking-tighter mb-8"
          >
            EKİBİMİZ
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 leading-relaxed font-medium"
          >
            Mikrofon başında bir araya gelen, ses telleriyle karakterlere can veren devasa bir yetenek ordusuyuz. En iyi kalite için durmaksızın üretiyoruz. (Geçek ekip üyeleri daha sonra veritabanından buraya eklenecektir.)
          </motion.p>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

export default TeamPage;
