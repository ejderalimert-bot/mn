"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for registration (supabase/firebase can be added here)
    console.log("Registering with:", formData);
  };

  return (
    <main className="min-h-screen bg-dublio-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-dublio-purple/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-dublio-cyan/10 blur-[100px] rounded-full animate-pulse-slow"></div>

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
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter mb-2">Aramıza Katıl</h1>
          <p className="text-dublio-text-dark font-medium">Star Dublaj topluluğuna hoş geldin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Kullanıcı Adı</label>
            <input
              type="text"
              placeholder="dublaj_ustasi"
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-dublio-purple transition-all"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">E-posta</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-dublio-purple transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Şifre</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-dublio-purple transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:bg-gray-200 transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,255,255,0.1)] mt-4"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-4 text-white/10">
            <div className="h-px bg-white/5 flex-grow"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Veya</span>
            <div className="h-px bg-white/5 flex-grow"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => signIn('google')}
              className="flex items-center justify-center gap-2 py-3 bg-[#2f2f38]/50 border border-white/10 rounded-xl text-xs font-bold hover:bg-[#2f2f38] transition-all"
            >
              GOOGLE
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-[#2f2f38]/50 border border-white/10 rounded-xl text-xs font-bold hover:bg-[#2f2f38] transition-all">
              DISCORD
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-dublio-text-dark">
          Zaten üye misin? <Link href="/login" className="text-white hover:text-dublio-purple transition-colors font-bold">Giriş Yap</Link>
        </p>
      </div>
    </main>
  );
}
