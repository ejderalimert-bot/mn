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
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center justify-center min-h-[70vh]">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-5xl text-center">
            
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-float">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
             ORTAK EKİBİMİZ
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 drop-shadow-lg">
            KORSAN KAYITLAR<br/>
            <span className="text-4xl md:text-6xl text-white">STÜDYOSU</span>
          </h1>

          <div className="max-w-3xl mx-auto space-y-6 text-xl md:text-2xl font-medium text-white/70 leading-relaxed mb-16">
            <p>
              🎙️ <strong className="text-white">Dublaj denizinde bazen büyük tufanlar kopar…</strong>
            </p>
            <p>
              Biz ise o tufana karşı kendi yolunu çizen korsanlarız. ⛵🏴‍☠️
            </p>
            <p className="text-lg md:text-xl text-white/50">
              Korsan Kayıtlar Stüdyosu, film, dizi, animasyon ve oyun sahnelerini Türkçe dublajla yeniden yorumlayan bağımsız bir dublaj ekibidir. 🎙️🎧
            </p>
            <p className="text-lg md:text-xl text-red-200/60 font-black italic tracking-widest uppercase border-t border-red-500/20 pt-8 mt-8">
              "Tutku, emek ve yaratıcılıkla hazırladığımız projeleri sizlerle paylaşarak dublaj dünyasında kendi izimizi bırakmayı hedefliyoruz." ⚓
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://www.youtube.com/@KorsanKayıtlarStüdyosu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-8 py-5 bg-red-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YOUTUBE KANALINA GİT
              </span>
            </a>
          </div>

          <div className="mt-28 flex justify-center">
             <div className="h-32 w-px bg-gradient-to-b from-red-500/50 to-transparent"></div>
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
