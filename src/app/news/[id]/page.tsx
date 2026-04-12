import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await prisma.news.findUnique({
    where: { id: params.id },
    include: { author: true }
  });

  if (!news) return notFound();

  return (
    <main className="min-h-screen bg-[#0b0c10] text-white selection:bg-pink-500/30">
      <Navbar />

      <div className="container mx-auto p-6 md:p-12 mb-20 max-w-4xl mt-8">
        <Link href="/news" className="inline-flex items-center gap-2 text-white/50 hover:text-pink-500 transition-colors uppercase font-bold text-xs tracking-widest mb-10">
          <ArrowLeft className="w-4 h-4" /> Haberlere Dön
        </Link>
        
        <article className="flex flex-col">
          {news.image && (
             <div className="w-full h-[400px] mb-10 rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl relative">
                <img src={news.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] to-transparent"></div>
             </div>
          )}

          <div className="flex items-center gap-6 mb-6">
            <span className="flex items-center gap-2 text-pink-500 font-bold text-sm tracking-widest uppercase border border-pink-500/30 bg-pink-500/10 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" /> {new Date(news.createdAt).toLocaleDateString('tr-TR')}
            </span>
            <span className="flex items-center gap-2 text-white/50 font-bold text-sm tracking-widest uppercase items-center">
              <img src={news.author?.image || '/globe.svg'} className="w-6 h-6 rounded-full grayscale" />
              {news.author?.name || 'Admin'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white italic capitalize mb-8 leading-tight">
            {news.title}
          </h1>

          {news.video && (
             <div className="w-full mb-10 rounded-2xl overflow-hidden bg-black/50 border border-white/5 shadow-lg">
                <video src={news.video} controls className="w-full rounded-2xl" />
             </div>
          )}

          <div className="prose prose-invert prose-pink max-w-none prose-lg">
            {news.content.split('\n').map((par, i) => (
               <p key={i} className="text-white/80 leading-relaxed font-medium mb-6">{par}</p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
