import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Ortak Ekibimiz: Korsan Kayıtlar Stüdyosu | Star Dublaj',
  description: 'Dublaj denizinin asi korsanları ile tanışın. Film, dizi, animasyon ve oyun sahnelerini Türkçe dublajla yeniden yorumluyorlar.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-pink-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 bg-[#0a0a0c]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          {/* Animated Sea Waves */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-50 z-10 translate-y-2">
            <svg className="relative block w-[200%] h-[150px] animate-wave-slide" fill="none" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" fill="rgba(6, 182, 212, 0.2)"></path>
                <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5v-74.81z" fill="rgba(8, 145, 178, 0.4)"></path>
                <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" fill="#0891b2"></path>
            </svg>
          </div>
          
          {/* Deep dark gradient from bottom to blend the waves */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-20 pointer-events-none h-full"></div>
        </div>

        <div className="container relative z-30 mx-auto px-6 max-w-5xl text-center">
            
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dublio-cyan/10 border border-dublio-cyan/20 text-dublio-cyan text-xs font-black tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-float">
             <span className="w-2 h-2 rounded-full bg-dublio-cyan animate-pulse"></span>
             STAR DUBLAJ PARTNERİ
             <span className="w-2 h-2 rounded-full bg-dublio-cyan animate-pulse"></span>
          </div>

          {/* Epic Logo & Wave Animation Wrapper */}
          <div className="animate-wave-crash mx-auto mb-16 mt-8 relative flex justify-center items-center">
             <div className="animate-ship-rocking relative flex flex-col items-center">
                
                {/* Neon Sea Glow behind logo! */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dublio-cyan opacity-40 blur-[80px] rounded-full w-full h-full scale-150 z-0"></div>
                
                {/* Korsan Logo (Behind the wave) */}
                <img 
                   src="/korsan-logo.png" 
                   alt="Korsan Kayıtlar Stüdyosu Logo" 
                   className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]" 
                />

                {/* Deniz (Wave) under the logo, overlapping it slightly */}
                <img 
                   src="/dalga.png" 
                   alt="Deniz Dalgaları" 
                   className="w-[120%] max-w-[450px] object-contain absolute -bottom-16 z-20 drop-shadow-2xl" 
                />
                
             </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 text-xl md:text-2xl font-medium text-white/70 leading-relaxed mb-16 relative z-30">
            <p>
              🎙️ <strong className="text-white">Dublaj denizinde bazen büyük tufanlar kopar…</strong>
            </p>
            <p>
              Biz ise o tufana karşı kendi yolunu çizen korsanlarız. ⛵🏴‍☠️
            </p>
            <p className="text-lg md:text-xl text-white/50">
              Korsan Kayıtlar Stüdyosu, film, dizi, animasyon ve oyun sahnelerini Türkçe dublajla yeniden yorumlayan bağımsız bir dublaj ekibidir. 🎙️🎧
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-30">
            <a 
              href="https://www.youtube.com/@KorsanKayıtlarStüdyosu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-8 py-5 bg-dublio-cyan text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-dublio-cyan to-[#0891b2] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YOUTUBE KANALINA GİT
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Details */}
      <section className="pb-32 relative z-10">
         <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-[#141416] border border-white/5 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none"></div>
               <h2 className="text-3xl font-black italic tracking-widest uppercase mb-6 text-white text-center">Dublaj Denizinin Asi Korsanları ⛵🏴‍☠️</h2>
               <p className="text-white/50 text-center leading-relaxed">
                 Star Dublaj Studios olarak seslendirme dünyasında ortak vizyonları paylaştığımız ve desteklediğimiz partnerimiz Korsan Kayıtlar Stüdyosu'nun harika animasyon, dizi ve oyun dublajlarını kendi Youtube kanallarından takip edebilirsiniz.
               </p>
            </div>
         </div>
      </section>
    </main>
  );
}
