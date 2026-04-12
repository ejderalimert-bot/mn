"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [userInfo, setUserInfo] = React.useState<{name: string, image: string, id: string} | null>(null);
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [likes, setLikes] = React.useState<any[]>([]);
  const [userCommentsCount, setUserCommentsCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // We fetch user info from the comments they've posted across all projects
    const fetchData = async () => {
       try {
         // Fake endpoint logic executed here simply to harvest their display name and avatar since there's no DB
         const commentsRes = await fetch('/api/comments');
         const allComments = await commentsRes.json();
         let foundName = "Kullanıcı";
         let foundImage = "";
         let count = 0;

         for (const projectId in allComments) {
            allComments[projectId].forEach((c: any) => {
               if (c.userId === id || String(c.userId) === id) {
                  foundName = c.userName;
                  foundImage = c.userAvatar;
                  count++;
               }
            });
         }
         
         setUserInfo({ name: foundName, image: foundImage, id });
         setUserCommentsCount(count);

         // Fetch favorites and likes
         const favsRes = await fetch(`/api/favorites?userId=${id}`);
         const favIds = await favsRes.json();

         const likesRes = await fetch(`/api/likes?userId=${id}`);
         const likeIds = await likesRes.json();
         
         const projectsRes = await fetch('/api/projects');
         const projects = await projectsRes.json();

         if (favIds.length > 0) {
            setFavorites(projects.filter((p: any) => favIds.includes(String(p.id))));
         } else {
            setFavorites([]);
         }

         if (likeIds.length > 0) {
            setLikes(projects.filter((p: any) => likeIds.includes(String(p.id))));
         } else {
            setLikes([]);
         }
       } catch (err) {
         console.error(err);
       }
       setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111115] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dublio-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#111115] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-[#1a1c23] p-10 rounded-[40px] border border-white/5 relative overflow-hidden mb-10 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-dublio-purple/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] border-4 border-white/10 overflow-hidden shadow-2xl bg-black/40">
                 {userInfo?.image ? (
                   <img src={userInfo.image} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-5xl font-black italic text-dublio-purple">
                      {userInfo?.name?.charAt(0) || '?'}
                   </div>
                 )}
              </div>
              
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                  <span className="w-2 h-2 bg-dublio-cyan rounded-full"></span>
                  <span className="text-[10px] font-black tracking-widest uppercase">STAR DUBLAJ ÜYESİ</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">
                  {userInfo?.name}
                </h1>
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Kullanıcı ID: {id?.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          {/* Profile Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                 {/* Likes */}
                 <div className="bg-[#1a1c23] p-8 rounded-[32px] border border-white/5 shadow-lg">
                    <h3 className="text-xl font-black italic uppercase mb-6 tracking-widest text-[#3b82f6]">BAYILDIKLARI</h3>
                    {likes.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {likes.map((like) => (
                            <Link href={`/project/${like.slug || like.id}`} key={like.id} className="flex items-center gap-4 bg-[#23262f] p-4 rounded-2xl hover:bg-[#3b82f6]/10 transition-colors border border-white/5 hover:border-[#3b82f6]/50 shadow-sm">
                              <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                                 {like.image ? <img src={like.image} className="w-full h-full object-cover" /> : <span className="text-white/20 text-[10px] font-bold uppercase">{like.category}</span>}
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-white font-bold truncate">{like.title}</span>
                                <span className="text-white/40 text-[10px] tracking-wider uppercase">{like.category}</span>
                              </div>
                            </Link>
                         ))}
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center py-10 text-white/10 border-2 border-dashed border-white/5 rounded-2xl">
                          <span className="text-sm font-bold uppercase tracking-widest">Henüz hiçbir projeye bayılmadı</span>
                       </div>
                    )}
                 </div>

                 {/* Favorites */}
                 <div className="bg-[#1a1c23] p-8 rounded-[32px] border border-white/5 shadow-lg">
                    <h3 className="text-xl font-black italic uppercase mb-6 tracking-widest text-[#ef4444]">FAVORİ PROJELERİ</h3>
                    {favorites.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {favorites.map((fav) => (
                            <Link href={`/project/${fav.slug || fav.id}`} key={fav.id} className="flex items-center gap-4 bg-[#23262f] p-4 rounded-2xl hover:bg-[#ef4444]/10 transition-colors border border-white/5 hover:border-[#ef4444]/50 shadow-sm">
                              <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                                 {fav.image ? <img src={fav.image} className="w-full h-full object-cover" /> : <span className="text-white/20 text-[10px] font-bold uppercase">{fav.category}</span>}
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-white font-bold truncate">{fav.title}</span>
                                <span className="text-white/40 text-[10px] tracking-wider uppercase">{fav.category}</span>
                              </div>
                            </Link>
                         ))}
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center py-10 text-white/10 border-2 border-dashed border-white/5 rounded-2xl">
                          <span className="text-sm font-bold uppercase tracking-widest">Henüz favori projesi yok</span>
                       </div>
                    )}
                 </div>
              </div>

             <div className="space-y-8">
                {/* Stats */}
                <div className="bg-[#1a1c23] p-8 rounded-[32px] border border-white/5 shadow-lg">
                   <h3 className="text-xl font-black italic uppercase mb-6 tracking-widest text-white/40">İSTATİSTİKLER</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">YORUMLAR</span>
                         <span className="text-3xl font-black italic text-dublio-purple">{userCommentsCount}</span>
                      </div>
                      <div className="flex flex-col p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">FAVORİLER</span>
                         <span className="text-3xl font-black italic text-dublio-cyan">{favorites.length}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
