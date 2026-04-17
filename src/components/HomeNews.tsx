"use client";

import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeNews({ news }: { news: any[] }) {
  if (!news || news.length === 0) return null;

  return (
    <section className="py-24 px-8 relative overflow-hidden text-center bg-[#0d0d12]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#161313] via-[#0d0d12] to-[#161313]"></div>
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="flex flex-col items-center justify-center text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 blur-[100px] pointer-events-none rounded-full" />
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-dublio-cyan to-dublio-purple tracking-tighter mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4">
            <Newspaper className="w-12 h-12 md:w-16 md:h-16 text-pink-500" />
            GÜNCEL HABERLER
          </h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
        >
          {news.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, scale: 0.5, rotateY: -90, y: 150 }, visible: { opacity: 1, scale: 1, rotateY: 0, y: 0, transition: { type: "spring", stiffness: 40, damping: 20, duration: 2.5 } } }}
              whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.05 }}
              className="[perspective:1500px]"
            >
            <Link href={`/news/${item.id}`} className="group relative bg-[#1a1c23] rounded-3xl overflow-hidden border border-white/5 hover:border-pink-500/50 transition-colors shadow-xl h-96 flex flex-col cursor-pointer">
              <div className="h-[55%] w-full bg-black relative overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-pink-900/30 to-purple-900/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Newspaper className="w-16 h-16 text-pink-500/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-black/80 to-transparent relative -top-10 -mb-10 w-full h-[45%]">
                <span className="text-xs font-bold text-pink-500 tracking-wider mb-2">{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-pink-500 transition-colors">{item.title}</h3>
                <p className="text-sm font-medium text-white/50 line-clamp-2">{item.content}</p>
                <div className="mt-auto pt-4 flex items-center gap-2 text-white/70 group-hover:text-pink-500 font-bold text-sm uppercase tracking-wide transition-colors">
                  Haberi Oku <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {news.length > 3 && (
          <div className="mt-12 flex justify-center">
            <Link href="/news" className="px-8 py-4 bg-transparent border border-white/20 text-white hover:border-pink-500 hover:text-pink-500 font-bold uppercase tracking-widest text-sm rounded-full transition-all">
              Tüm Haberleri Gör
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
