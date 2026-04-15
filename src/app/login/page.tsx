"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Magic Link Gönderme İşlemi
    await signIn('resend', { email: formData.email, redirect: false });
    setSuccess(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-dublio-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-dublio-purple/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-dublio-cyan/10 blur-[100px] rounded-full animate-pulse-slow"></div>

      <div className="w-full max-w-md relative z-10 glass-panel p-10 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <img 
             src="/logo.png" 
             alt="Star Dublaj Logo" 
             className="w-16 h-16 object-contain inline-block mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all hover:scale-110" 
             onError={(e) => {
               (e.target as HTMLImageElement).style.display = 'none';
               const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLDivElement;
               if (fallback) {
                 fallback.classList.remove('hidden');
                 fallback.classList.add('inline-flex');
               }
             }}
          />
          {/* Fallback if logo.png is missing */}
          <div className="hidden items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[20px] mb-6 shadow-xl">
            <span className="text-white font-black text-3xl">S</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter mb-2 text-center">Tekrar Hoşgeldin.</h1>
          <p className="text-dublio-text-dark font-medium">Kaldığın yerden devam et.</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">E-posta</label>
              <input 
                type="email" 
                placeholder="ornek@mail.com" 
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-dublio-purple transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <p className="text-xs text-white/30 px-2 mt-2">Şifre gerekmez, size sihirli bir bağlantı göndereceğiz.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:bg-gray-200 transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,255,255,0.1)] mt-4 disabled:opacity-50 disabled:cursor-wait"
            >
              {loading ? "Bağlantı Gönderiliyor..." : "Giriş Linki Gönder"}
            </button>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
            <h3 className="text-green-400 font-black text-xl mb-2">Posta Kutunuzu Kontrol Edin!</h3>
            <p className="text-white/60 text-sm">Giriş yapmanız için <b>{formData.email}</b> adresine sihirli bir bağlantı gönderdik.</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4">
           <div className="flex items-center gap-4 text-white/10">
             <div className="h-px bg-white/5 flex-grow"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Veya</span>
             <div className="h-px bg-white/5 flex-grow"></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="flex items-center justify-center gap-2 py-3 bg-[#2f2f38]/50 border border-white/10 rounded-xl text-xs font-bold hover:bg-[#2f2f38] transition-all"
              >
                 GOOGLE
              </button>
              <button 
                onClick={() => signIn('discord', { callbackUrl: '/' })}
                className="flex items-center justify-center gap-2 py-3 bg-[#2f2f38]/50 border border-white/10 rounded-xl text-xs font-bold hover:bg-dublio-purple/80 hover:text-white transition-all"
              >
                 DISCORD
              </button>
           </div>
        </div>

        <p className="mt-8 text-center text-sm text-dublio-text-dark">
          Hesabın yok mu? <Link href="/register" className="text-white hover:text-dublio-purple transition-colors font-bold">Hemen Oluştur</Link>
        </p>
      </div>
    </main>
  );
}
