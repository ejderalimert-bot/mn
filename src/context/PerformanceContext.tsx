"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Feather } from "lucide-react";

export type PerformanceMode = "ultra" | "potato" | "patoto" | null;

interface PerformanceContextProps {
  performanceMode: PerformanceMode;
  setPerformanceMode: (mode: PerformanceMode) => void;
}

const PerformanceContext = createContext<PerformanceContextProps>({
  performanceMode: "ultra",
  setPerformanceMode: () => { },
});

export const usePerformance = () => useContext(PerformanceContext);

export function PerformanceProvider({ children, defaultMode }: { children: React.ReactNode, defaultMode?: PerformanceMode }) {
  const [performanceMode, setPerformanceModeState] = useState<PerformanceMode>(defaultMode || null);
  const [isReady, setIsReady] = useState(true); // SSR makes it instantly ready from server defaultMode
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const setPerformanceMode = (mode: PerformanceMode) => {
    setPerformanceModeState(mode);
    if (dontShowAgain && mode) {
      document.cookie = `stardublajweb_perf_v3=${mode}; path=/; max-age=31536000`; // Updated cookie version
    }
  };

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
              className="bg-[#0b0c10] border border-stardublajweb-purple/30 rounded-[2rem] p-8 md:p-12 shadow-[0_0_100px_rgba(168,85,247,0.3)] max-w-4xl w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-stardublajweb-purple/20 blur-[100px] pointer-events-none rounded-full"></div>

              <h1 className="text-3xl md:text-5xl font-black italic text-stardublajweb-purple uppercase tracking-tighter mb-4">
                Sistem Konfigürasyonu
              </h1>
              <p className="text-white/60 mb-8 text-sm md:text-base leading-relaxed">
                Star Dublaj platformu ağır sinematik 3D görselleştirmeler barındırır.
                Cihazınızın donanımına göre deneyimi nasıl yaşamak istediğinizi seçin.
                (Bunu daha sonra değiştirebilirsiniz)
              </p>

              <div className="flex items-center justify-center gap-3 mb-8 relative z-10" onClick={() => setDontShowAgain(!dontShowAgain)}>
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${dontShowAgain ? 'bg-stardublajweb-purple border-stardublajweb-purple' : 'bg-[#1a1c23] border-white/20'}`}>
                  {dontShowAgain && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <label className="text-white/80 font-bold text-sm tracking-wide select-none cursor-pointer">
                  Bir daha gösterme ve seçimimi hatırla
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <button
                  onClick={() => setPerformanceMode("ultra")}
                  className="group relative bg-[#1a1c23] border border-stardublajweb-purple/50 rounded-2xl p-6 hover:bg-stardublajweb-purple/10 transition-all text-left flex flex-col items-center justify-center overflow-hidden h-72"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-stardublajweb-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="w-12 h-12 text-stardublajweb-purple mb-6 group-hover:scale-125 transition-transform" />
                  <h3 className="text-xl font-black text-white uppercase text-center">SİNEMATİK MOD</h3>
                  <p className="text-stardublajweb-purple text-xs font-bold mt-2 text-center">YÜKSEK PERFORMANSLI PC</p>
                  <p className="text-white/40 text-[10px] mt-4 text-center">Tüm Parçacık Efektleri, 3D Blur Işıklar, Parallax Animasyonları, 60 FPS Render</p>
                </button>

                <button
                  onClick={() => setPerformanceMode("potato")}
                  className="group relative bg-[#1a1c23] border border-yellow-500/30 rounded-2xl p-6 hover:bg-yellow-500/10 transition-all text-left flex flex-col items-center justify-center overflow-hidden h-72"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Feather className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-125 transition-transform" />
                  <h3 className="text-xl font-black text-white uppercase text-center">Optİmİze MOD</h3>
                  <p className="text-yellow-500 text-xs font-bold mt-2 text-center">ORTA / DÜŞÜK DONANIM</p>
                  <p className="text-white/40 text-[10px] mt-4 text-center">Statik Arka Plan, Blur Kapatılmış, Sadece Temel Arayüz Akıcılığı</p>
                </button>

                <button
                  onClick={() => setPerformanceMode("patoto")}
                  className="group relative bg-[#1a1c23] border border-red-600/30 rounded-2xl p-6 hover:bg-red-600/10 transition-all text-left flex flex-col items-center justify-center overflow-hidden h-72"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-125 transition-transform">🥔</div>
                  <h3 className="text-xl font-black text-white uppercase text-center">PATOTO MOD</h3>
                  <p className="text-red-600 text-xs font-bold mt-2 text-center">SADECE İŞLEVSİLLİK</p>
                  <p className="text-white/40 text-[10px] mt-4 text-center">Tüm Animasyonlar Kapatılır, Geçiş Efektleri Devre Dışı, Maksimum Statik Hız</p>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PerformanceContext.Provider>
  );
}
