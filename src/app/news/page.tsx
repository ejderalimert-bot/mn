import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <main className="min-h-screen bg-[#0b0c10] text-white selection:bg-pink-500/30">
      <Navbar />

      {/* Header */}
      <section className="py-20 px-6 relative bg-[#15171e] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white flex items-center gap-6">
            <Newspaper className="w-16 h-16 md:w-20 md:h-20 text-pink-500" />
            Bütün Haberler
          </h1>
          <p className="mt-6 text-xl text-white/50 max-w-2xl font-bold">
            Star Dublaj'dan en son güncellemeler, duyurular ve yenilikler.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {news.length === 0 ? (
            <div className="py-20 text-center">
               <Newspaper className="w-16 h-16 text-white/10 mx-auto mb-4" />
               <p className="text-white/40 font-bold">Henüz hiç haber yayınlanmamış.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map(item => (
                <Link key={item.id} href={`/news/${item.id}`} className="group bg-[#15171e] rounded-3xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-colors shadow-2xl flex flex-col h-[450px]">
                  <div className="h-56 w-full bg-black relative overflow-hidden shrink-0 border-b border-white/5">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-pink-900/30 to-black flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-pink-500/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-pink-500 tracking-widest uppercase mb-3">
                       <Calendar className="w-3.5 h-3.5" />
                       {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <h3 className="text-xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-pink-500 transition-colors uppercase italic">{item.title}</h3>
                    <p className="text-sm font-medium text-white/50 line-clamp-3 leading-relaxed hidden md:block">{item.content}</p>
                    <div className="mt-auto pt-4 flex items-center gap-2 text-white/70 group-hover:text-pink-500 font-bold text-xs uppercase tracking-widest transition-colors">
                      OKUMAYA DEVAM ET <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
