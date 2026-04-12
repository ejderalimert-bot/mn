import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import { ShieldCheck, Newspaper, Star, UserCheck } from "lucide-react";
import Link from "next/link";

export default async function PublicUserProfile({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { teamMember: true, news: { orderBy: { createdAt: 'desc' } } }
  });

  if (!user) return notFound();

  const isTeam = !!user.teamMember;

  return (
    <main className={`min-h-screen ${isTeam ? 'bg-[#050b14]' : 'bg-[#0b0c10]'} text-white selection:bg-dublio-cyan/30`}>
      <Navbar />

      {/* Banner / Header */}
      <section className="relative w-full h-64 md:h-80 overflow-hidden border-b border-white/5">
        <div className={`absolute inset-0 ${isTeam ? 'bg-gradient-to-br from-[#0c1829] via-[#050b14] to-dublio-cyan/20' : 'bg-gradient-to-r from-dublio-purple/20 to-transparent'} z-0`}></div>
        {isTeam && (
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
        )}
        
        <div className="container mx-auto h-full flex flex-col items-center justify-end pb-12 relative z-10">
          <div className="relative group">
            <div className={`absolute -inset-2 ${isTeam ? 'bg-dublio-cyan' : 'bg-dublio-purple'} rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity`}></div>
            <img 
              src={user.image || '/globe.svg'} 
              className={`w-32 h-32 md:w-40 md:h-40 rounded-full object-cover relative z-10 border-4 ${isTeam ? 'border-dublio-cyan shadow-[0_0_30px_cyan]' : 'border-[#1a1c23]'}`}
            />
            {isTeam && (
              <div className="absolute -bottom-2 -right-2 bg-dublio-cyan rounded-full p-2 text-[#050b14] shadow-lg z-20" title="Star Dublaj Yetkili Ekibi">
                <ShieldCheck className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Info & Badges */}
      <section className="container mx-auto px-6 py-8 flex flex-col items-center text-center -mt-6 relative z-20">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg mb-2">
          {user.name}
        </h1>
        {isTeam ? (
          <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-xl">
             {user.teamMember?.roleTitle.split(',').map((role, i) => (
                <span key={i} className="text-xs font-black uppercase tracking-widest text-dublio-cyan border border-dublio-cyan/50 bg-dublio-cyan/10 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  {role.trim()}
                </span>
             ))}
          </div>
        ) : (
          <span className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 mt-2">
            <UserCheck className="w-4 h-4" /> Topluluk Üyesi
          </span>
        )}
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Left Column - Stats / About */}
        <div className="flex flex-col gap-6">
          <div className={`rounded-3xl p-8 border ${isTeam ? 'bg-gradient-to-br from-dublio-cyan/5 to-transparent border-dublio-cyan/20' : 'bg-[#15171e] border-white/5'}`}>
             <h3 className={`text-xl font-black italic uppercase mb-6 flex items-center gap-2 ${isTeam ? 'text-dublio-cyan' : 'text-dublio-purple'}`}>
                Kullanıcı İstatistikleri
             </h3>
             <ul className="space-y-4">
               <li className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-2">
                 <span className="text-white/50">Kayıt Tarihi</span>
                 <span className="text-white">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
               </li>
               <li className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-2">
                 <span className="text-white/50">Gönderilen Haber</span>
                 <span className="text-white">{user.news.length}</span>
               </li>
               <li className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-2">
                 <span className="text-white/50">Favori Projeler</span>
                 <span className="text-white">Gizli</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Right Column - Activity (News if Team Member) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {isTeam && user.news.length > 0 ? (
            <div className="bg-[#15171e] rounded-3xl p-8 border border-white/5">
              <h3 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3 text-white">
                 <Newspaper className="w-6 h-6 text-pink-500" /> Yayınladığı Haberler
              </h3>
              <div className="flex flex-col gap-4">
                {user.news.map(n => (
                  <Link href={`/news/${n.id}`} key={n.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-pink-500/30 transition-colors group">
                    <div className="w-full sm:w-32 h-20 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                       {n.image ? <img src={n.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <div className="w-full h-full flex items-center justify-center bg-pink-900/20 text-pink-500"><Newspaper className="w-6 h-6"/></div>}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="font-bold text-white group-hover:text-pink-500 transition-colors text-lg uppercase mb-1 line-clamp-1">{n.title}</h4>
                      <p className="text-xs font-medium text-white/40 line-clamp-2 leading-relaxed">{n.content}</p>
                      <span className="text-[10px] text-pink-500/70 font-black tracking-widest mt-auto pt-2">{new Date(n.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#15171e] rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Star className="w-12 h-12 text-white/10 mb-4" />
              <h3 className="text-xl font-bold text-white/30 mb-2">Henüz Aktivite Yok</h3>
              <p className="text-sm font-medium text-white/20 max-w-sm">
                Bu kullanıcı şu anda herhangi bir herkese açık aktiviteye veya yayına sahip değil.
              </p>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
