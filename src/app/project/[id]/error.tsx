"use client";

import { useEffect } from "react";

export default function ErrorBoundaryPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Sadece konsola da logluyoruz.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111115] text-[#d1d5db] font-sans p-10">
      <h2 className="text-4xl text-red-500 font-black mb-4 tracking-tighter uppercase italic">Sistem Bir Hata Yakaladı</h2>
      <p className="mb-4 text-white/50">Lütfen aşağıdaki hata kodunu kopyalayıp bana gönder:</p>
      <div className="text-left bg-black/50 p-6 rounded-2xl w-full max-w-4xl overflow-auto border border-red-500/30 shadow-2xl space-y-4">
        <div className="font-bold text-red-400 font-mono text-lg">{error.name}: {error.message}</div>
        <pre className="text-white/60 font-mono whitespace-pre-wrap text-sm leading-relaxed">
          {error.stack}
        </pre>
      </div>
      <button 
        onClick={() => reset()} 
        className="mt-8 px-8 py-4 bg-dublio-purple/20 hover:bg-dublio-purple/40 border border-dublio-purple transition-all text-white rounded-xl font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.3)]"
      >
        Ana Ekrandan Tekrar Dene
      </button>
    </div>
  );
}
