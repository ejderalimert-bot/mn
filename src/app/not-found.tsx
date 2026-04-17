"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Home, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import HomeFooter from "@/components/HomeFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center relative px-6 py-20 mt-20">
        {/* Background Glitch Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div 
            animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0], opacity: [0.1, 0.3, 0.1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 blur-[100px] rounded-full"
          />
          <motion.div 
            animate={{ x: [0, -20, 20, 0], y: [0, 20, -20, 0], opacity: [0.1, 0.2, 0.1] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-dublio-cyan/10 blur-[150px] rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-3xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-[#121318]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-[0_0_80px_rgba(255,0,0,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
            
            <div className="flex justify-center mb-8">
              <motion.div 
                animate={{ rotateZ: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.2)]"
              >
                <AlertCircle className="w-12 h-12 text-red-500" />
              </motion.div>
            </div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter mb-4"
            >
              404
            </motion.h1>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-black uppercase text-red-500 tracking-widest mb-6"
            >
              SİSTEMDE KIRIK LİNK
            </motion.h2>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/50 text-lg mb-12 max-w-lg mx-auto"
            >
              Aradığınız sayfa matrix'te kaybolmuş veya hiç var olmamış olabilir. Kodu kırmadan ana üsse dönün.
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center"
            >
              <Link 
                href="/" 
                className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
              >
                <Home className="w-5 h-5" />
                Ana Üsse Dön
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10"
              >
                <Terminal className="w-5 h-5" />
                Geri Çık
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
