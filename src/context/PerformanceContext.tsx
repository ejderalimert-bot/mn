"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Feather } from "lucide-react";

export type PerformanceMode = "ultra" | "potato" | null;

interface PerformanceContextProps {
  performanceMode: PerformanceMode;
  setPerformanceMode: (mode: PerformanceMode) => void;
}

const PerformanceContext = createContext<PerformanceContextProps>({
  performanceMode: "ultra",
  setPerformanceMode: () => {},
});

export const usePerformance = () => useContext(PerformanceContext);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [performanceMode, setPerformanceModeState] = useState<PerformanceMode>("ultra");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dublio_perf_mode") as PerformanceMode;
    if (saved) {
      setPerformanceModeState(saved);
    } else {
      setPerformanceModeState(null); // Force selection on first visit
    }
    setIsReady(true);
  }, []);

  const setPerformanceMode = (mode: PerformanceMode) => {
    setPerformanceModeState(mode);
    localStorage.setItem("dublio_perf_mode", mode as string);
  };

  if (!isReady) return null; // Avoid hydration mismatch

  return (
    <PerformanceContext.Provider value={{ performanceMode, setPerformanceMode }}>
      {children}
      
      {/* Global Setting Modal */}
      <AnimatePresence>
        {performanceMode === null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-3xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-[#0b0c10] border border-dublio-purple/30 rounded-[2rem] p-8 md:p-12 shadow-[0_0_100px_rgba(168,85,247,0.3)] max-w-2xl w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-dublio-purple/20 blur-[100px] pointer-events-none rounded-full"></div>
              
              <h1 className="text-3xl md:text-5xl font-black italic text-dublio-purple uppercase tracking-tighter mb-4">
                Sistem Konfigürasyonu
              </h1>
              <p className="text-white/60 mb-10 text-sm md:text-base leading-relaxed">
                Star Dublaj platformu ağır sinematik 3D görselleştirmeler barındırır. 
                Cihazınızın donanımına göre deneyimi nasıl yaşamak istediğinizi seçin.
                (Bunu daha sonra değiştirebilirsiniz)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <button 
                  onClick={() => setPerformanceMode("ultra")}
                  className="group relative bg-[#1a1c23] border border-dublio-purple/50 rounded-2xl p-8 hover:bg-dublio-purple/10 transition-all text-left flex flex-col items-center justify-center overflow-hidden h-64"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-dublio-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="w-16 h-16 text-dublio-purple mb-6 group-hover:scale-125 transition-transform" />
                  <h3 className="text-xl font-black text-white uppercase text-center">SİNEMATİK MOD</h3>
                  <p className="text-dublio-purple text-xs font-bold mt-2 text-center">YÜKSEK PERFORMANSLI PC'LER</p>
                  <p className="text-white/40 text-[10px] mt-4 text-center">Tüm Parçacık Efektleri, 3D Blur Işıklar, Parallax Animasyonları, 60 FPS Render</p>
                </button>

                <button 
                  onClick={() => setPerformanceMode("potato")}
                  className="group relative bg-[#1a1c23] border border-[#ff0000]/30 rounded-2xl p-8 hover:bg-[#ff0000]/10 transition-all text-left flex flex-col items-center justify-center overflow-hidden h-64"
                >
                   <div className="absolute inset-0 bg-gradient-to-t from-[#ff0000]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Feather className="w-16 h-16 text-[#ff0000] mb-6 group-hover:scale-125 transition-transform" />
                  <h3 className="text-xl font-black text-white uppercase text-center">Optİmİze MOD</h3>
                  <p className="text-[#ff0000] text-xs font-bold mt-2 text-center">DÜŞÜK DONANIM / MOBİL</p>
                  <p className="text-white/40 text-[10px] mt-4 text-center">Statik Arka Plan, Blur Kapatılmış, Sadece Temel Arayüz Akıcılığı</p>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PerformanceContext.Provider>
  );
}
