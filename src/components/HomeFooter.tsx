"use client";

import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Youtube, Mail, MapPin, Gamepad2, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomeFooter() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightStyle = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(168, 85, 247, 0.15), transparent 80%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const socialLinks = {
    youtube: "https://www.youtube.com/@StarDublajStudiosoffical",
    discord: "https://discord.gg/Sghsbk5RbF"
  };

  return (
    <footer 
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#0A0A0C] border-t border-white/5 pt-24 pb-12 group"
    >
      <motion.div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition duration-500 will-change-transform mix-blend-screen" style={{ background: spotlightStyle }} />
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-dublio-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-dublio-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-block relative">
               <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1c23] to-black border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-dublio-purple/20 to-dublio-cyan/20 opacity-50"></div>
                   <Zap className="w-6 h-6 text-white relative z-10" />
                 </div>
                 <span className="text-2xl font-black italic uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">STAR<br/><span className="text-dublio-cyan">DUBLAJ</span></span>
               </motion.div>
            </Link>
            <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs">
              Türkiye'nin lider dublaj merkezi. Oyun modları, seslendirme projeleri ve sürükleyici yeni dünyalar inşa etmeye devam ediyoruz.
            </p>
            <div className="flex gap-4 pt-4">
               <motion.a whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(255,0,0,0.3)" }} href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 hover:border-red-500/50 group/social">
                 <Youtube className="w-5 h-5 text-white/70 group-hover/social:text-red-500 transition-colors" />
               </motion.a>
               <motion.a whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(88,101,242,0.3)" }} href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 hover:border-[#5865F2]/50 group/social">
                 <Gamepad2 className="w-5 h-5 text-white/70 group-hover/social:text-[#5865F2] transition-colors" />
               </motion.a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-black text-white/90 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-dublio-purple"></span> Keşfet</h4>
            <ul className="space-y-4">
              {[
                { name: 'Tüm Modlar', path: '/mods' },
                { name: 'Tüm Videolar', path: '/projects' },
                { name: 'Haberler', path: '/news' },
                { name: 'Projeler', path: '/projects' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.path} className="text-white/50 hover:text-white font-medium text-sm transition-colors flex items-center gap-2 group/link">
                    <ArrowUpRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-dublio-purple" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-black text-white/90 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-dublio-cyan"></span> Kurumsal</h4>
            <ul className="space-y-4">
              {[
                { name: 'Hakkımızda', path: '/about' },
                { name: 'Ekibimiz', path: '/team' },
                { name: 'Kariyer', path: '/career' },
                { name: 'İletişim', path: '/contact' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.path} className="text-white/50 hover:text-white font-medium text-sm transition-colors flex items-center gap-2 group/link">
                    <ArrowUpRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-dublio-cyan" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status Panel Col */}
          <div>
            <h4 className="font-black text-white/90 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span> Sistem</h4>
            <div className="bg-[#14151a] border border-white/[0.05] rounded-2xl p-6 relative overflow-hidden group/status">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-[30px] rounded-full group-hover/status:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <span className="block text-xs font-black tracking-widest text-white/50 uppercase">Sunucu Durumu</span>
                  <span className="block text-sm font-bold text-green-400">Tüm Sistemler Aktif</span>
                </div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 font-medium">Uptime</span>
                  <span className="text-white font-bold">%99.98</span>
                </div>
                <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="w-[99%] h-full bg-gradient-to-r from-green-500 to-green-300"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} Star Dublaj Studios. Tüm Hakları Saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-white/30 hover:text-white/60 text-xs font-bold tracking-widest uppercase transition-colors">Gizlilik Politikası</Link>
            <span className="text-white/10">•</span>
            <Link href="#" className="text-white/30 hover:text-white/60 text-xs font-bold tracking-widest uppercase transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
