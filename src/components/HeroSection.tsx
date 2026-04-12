import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden pt-10 px-8">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center">
        <div className="w-[1200px] h-[600px] bg-dublio-purple/20 blur-[150px] rounded-full absolute -top-1/4 -right-1/4 animate-pulse-slow"></div>
        <div className="w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full absolute -bottom-1/4 -left-1/4 animate-pulse-slow opacity-50"></div>

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 flex flex-col items-center text-center max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-dublio-cyan rounded-full shadow-[0_0_8px_#6affeb]"></span>
          <span className="text-[11px] font-bold text-dublio-text-dark tracking-[0.2em] uppercase">Star Dublaj Studios</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter uppercase italic">
          TÜRKİYENİN<br />
          <span className="dublio-gradient-text">DUBLAJ&nbsp; MERKEZİ</span>
        </h1>

        <p className="text-xl md:text-2xl text-dublio-text-dark max-w-3xl mb-12 font-medium">
          Video Dublajları tek çatı altında. <br />
          Oyun modlarını keşfetmeye hazırlan!!!
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-24 min-w-[300px]">
          <button className="px-10 py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.2)]">
            VİDEOLARI KEŞFET
          </button>
          <button className="px-10 py-5 bg-dublio-light/50 border border-white/10 text-white font-black text-xl rounded-2xl hover:bg-dublio-light transition-all backdrop-blur-md">
            MODLARI KEŞFET
          </button>
        </div>

      </div>

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
