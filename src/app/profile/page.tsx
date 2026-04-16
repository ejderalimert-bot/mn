"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Camera, Save, X, Settings, User as UserIcon, Heart, Shield } from 'lucide-react';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [likes, setLikes] = React.useState<any[]>([]);
  const [loadingFavs, setLoadingFavs] = React.useState(true);
  const [loadingLikes, setLoadingLikes] = React.useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'genel' | 'ayarlar'>('genel');

  // Edit State
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPublicFavorites, setEditPublicFavorites] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    // Determine the tab from URL query params (e.g. ?tab=settings)
    if (typeof window !== 'undefined') {
       const urlParams = new URLSearchParams(window.location.search);
       if (urlParams.get('tab') === 'settings') {
          setActiveTab('ayarlar');
       }
       if (localStorage.getItem('theme') === 'light') {
          setThemeMode('light');
       }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  React.useEffect(() => {
    if (session?.user) {
       setEditName(session.user.name || "");
       setEditImage(session.user.image || "");
       setEditPublicFavorites(session.user.publicFavorites ?? true);
       
       const userId = session.user.id;
       // Fetch all projects to map easily
       fetch('/api/projects')
         .then(res => res.json())
         .then(projects => {
            // Fetch Favorites
            fetch(`/api/favorites?userId=${userId}`)
              .then(res => res.json())
              .then(favIds => {
                 setFavorites(projects.filter((p: any) => favIds.includes(String(p.id))));
                 setLoadingFavs(false);
              })
              .catch(() => setLoadingFavs(false));
              
            // Fetch Likes
            fetch(`/api/likes?userId=${userId}`)
              .then(res => res.json())
              .then(likeIds => {
                 setLikes(projects.filter((p: any) => likeIds.includes(String(p.id))));
                 setLoadingLikes(false);
              })
              .catch(() => setLoadingLikes(false));
         })
         .catch(() => {
            setLoadingFavs(false);
            setLoadingLikes(false);
         });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dublio-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dublio-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
    return null;
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName, 
          image: editImage, 
          publicFavorites: editPublicFavorites 
        })
      });

      if (res.ok) {
        await update({ 
          name: editName, 
          image: editImage, 
          publicFavorites: editPublicFavorites 
        });
        // Force hard reload to guarantee session sync and clear query params
        window.location.href = '/profile';
      } else {
        alert("Profil güncellenirken hata oluştu.");
        setIsSaving(false);
      }
    } catch {
      alert("Ağ hatası!");
      setIsSaving(false);
    }
  };

  const displayName = session.user?.name || "YENİ ÜYE";

  return (
    <main className="min-h-screen bg-[#0E0E12] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-28 pb-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Menu */}
          <div className="md:col-span-1 space-y-4 relative z-10">
            <div className="bg-[#14151a] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
               {/* Decorative glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-dublio-cyan/10 blur-[50px] rounded-full pointer-events-none"></div>

               <div className="flex flex-col items-center mb-8 relative z-10">
                 <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/50 border-2 border-white/10 mb-4 shadow-xl">
                   {session.user?.image ? (
                     <img src={session.user.image} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center font-black text-3xl text-dublio-cyan">
                       {displayName.charAt(0)}
                     </div>
                   )}
                 </div>
                 <h2 className="font-black text-lg text-center uppercase tracking-wider">{displayName}</h2>
                 <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{session.user?.email}</span>
               </div>

               <nav className="flex flex-col gap-2 relative z-10">
                 <button 
                   onClick={() => setActiveTab('genel')}
                   className={`flex items-center gap-3 w-full p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'genel' ? 'bg-dublio-cyan text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}
                 >
                   <UserIcon className="w-5 h-5" /> Genel Bakış
                 </button>
                 <button 
                   onClick={() => setActiveTab('ayarlar')}
                   className={`flex items-center gap-3 w-full p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'ayarlar' ? 'bg-dublio-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}
                 >
                   <Settings className="w-5 h-5" /> Profil Ayarları
                 </button>
               </nav>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="bg-[#14151a] p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Sohbet & İstatistik</h3>
              <div className="space-y-4 text-sm font-bold">
                 <div className="flex justify-between items-center text-white/70">
                   <span>Kayıt Olma Tarihi</span>
                   <span className="text-white">Bugün</span>
                 </div>
                 <div className="flex justify-between items-center text-white/70">
                   <span>Bayıldıkları</span>
                   <span className="text-dublio-cyan">{likes.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-white/70">
                   <span>Favorileri</span>
                   <span className="text-dublio-purple">{favorites.length}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'genel' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#14151a] p-8 rounded-3xl border border-white/5 shadow-2xl">
                     <h2 className="text-2xl font-black italic uppercase tracking-widest text-dublio-cyan mb-8 flex items-center gap-3">
                       <Heart className="w-6 h-6" /> BAYILDIKLARIM
                     </h2>
                     
                     {loadingLikes ? (
                        <div className="flex justify-center py-10 opacity-50">Yükleniyor...</div>
                     ) : likes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {likes.map((like) => (
                             <Link href={`/project/${like.slug || like.id}`} key={like.id} className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl hover:bg-dublio-cyan/10 transition-colors border border-white/5 hover:border-dublio-cyan/50 group">
                               <div className="w-20 h-20 bg-[#1a1c23] rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner w-full sm:w-20">
                                  {like.image ? <img src={like.image} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" /> : <span className="text-white/20 text-[10px] font-bold">{like.category}</span>}
                               </div>
                               <div className="flex flex-col overflow-hidden text-center sm:text-left w-full">
                                 <span className="text-white font-black uppercase tracking-wider truncate">{like.title}</span>
                                 <span className="text-dublio-cyan text-xs font-bold uppercase">{like.category}</span>
                               </div>
                             </Link>
                          ))}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-white/20 border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
                           <span className="text-sm font-bold uppercase tracking-widest">Henüz hiçbir projeye bayılmadın</span>
                        </div>
                     )}
                  </div>

                  <div className="bg-[#14151a] p-8 rounded-3xl border border-white/5 shadow-2xl">
                     <h2 className="text-2xl font-black italic uppercase tracking-widest text-dublio-purple mb-8 flex items-center gap-3">
                       <Heart className="w-6 h-6" /> FAVORİ PROJELERİM
                     </h2>
                     
                     {loadingFavs ? (
                        <div className="flex justify-center py-10 opacity-50">Yükleniyor...</div>
                     ) : favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {favorites.map((fav) => (
                             <Link href={`/project/${fav.slug || fav.id}`} key={fav.id} className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl hover:bg-dublio-purple/10 transition-colors border border-white/5 hover:border-dublio-purple/50 group">
                               <div className="w-20 h-20 bg-[#1a1c23] rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner w-full sm:w-20">
                                  {fav.image ? <img src={fav.image} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" /> : <span className="text-white/20 text-[10px] font-bold">{fav.category}</span>}
                               </div>
                               <div className="flex flex-col overflow-hidden text-center sm:text-left w-full">
                                 <span className="text-white font-black uppercase tracking-wider truncate">{fav.title}</span>
                                 <span className="text-dublio-purple text-xs font-bold uppercase">{fav.category}</span>
                               </div>
                             </Link>
                          ))}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-white/20 border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
                           <span className="text-sm font-bold uppercase tracking-widest">Henüz favori proje eklenmedi</span>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'ayarlar' && (
               <div className="bg-[#14151a] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-dublio-purple/5 blur-[100px] rounded-full pointer-events-none"></div>
                  
                  <div className="flex items-center gap-4 mb-10 relative z-10 border-b border-white/10 pb-6">
                    <button className="p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                       <Settings className="w-6 h-6 text-white" />
                    </button>
                    <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-widest text-white">Profil Ayarları</h2>
                      <p className="text-white/40 text-sm font-medium mt-1">Kimliğini kişiselleştir ve gizliliğini yönet.</p>
                    </div>
                  </div>

                  <div className="space-y-10 relative z-10">
                     {/* IMAGE EDIT */}
                     <div>
                       <label className="text-xs font-black text-dublio-cyan tracking-[0.2em] uppercase mb-4 block">Avatarını Değiştir</label>
                       <div className="flex flex-col sm:flex-row items-center gap-8 bg-black/20 p-6 rounded-2xl border border-white/5">
                          <div className="w-32 h-32 shrink-0 bg-black rounded-2xl border-2 border-white/10 overflow-hidden shadow-xl">
                             {editImage ? (
                               <img src={editImage} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/20 uppercase">{editName.charAt(0) || '?'}</div>
                             )}
                          </div>
                          <div className="flex-1 w-full max-w-sm h-32">
                             <CloudinaryUploader 
                               onUploadSuccess={(url) => setEditImage(url)} 
                               resourceType="image" 
                               label="YENİ GÖRSEL YÜKLE"
                             />
                          </div>
                       </div>
                     </div>

                     {/* NAME EDIT */}
                     <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <label className="text-xs font-black text-dublio-cyan tracking-[0.2em] uppercase mb-4 block">Kullanıcı Adı</label>
                        <input 
                           type="text" 
                           value={editName}
                           onChange={(e) => setEditName(e.target.value)}
                           placeholder="Kendine destansı bir isim koy..."
                           className="w-full bg-black border border-white/10 rounded-xl py-4 px-5 text-xl font-bold text-white focus:outline-none focus:border-dublio-cyan focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
                        />
                        <p className="text-xs text-white/30 font-medium mt-3">Bu isim projelerdeki yorumlarında ve takım sayfanızda görünecektir.</p>
                     </div>

                     {/* PRIVACY SETTING */}
                     <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                        <div>
                           <label className="text-xs font-black text-dublio-purple tracking-[0.2em] uppercase mb-2 block flex items-center gap-2"><Shield className="w-4 h-4"/> Gizlilik</label>
                           <h4 className="text-white font-bold text-lg">Favorilerimi Herkese Açık Yap</h4>
                           <p className="text-xs text-white/40 mt-1 max-w-sm">Ekiplerden birisi profilinize baktığında favorilediğiniz ve bayıldığınız projeleri görebilsin.</p>
                        </div>
                        <button 
                           onClick={() => setEditPublicFavorites(!editPublicFavorites)}
                           className={`w-14 h-8 rounded-full border-2 transition-colors relative shrink-0 ${editPublicFavorites ? 'bg-dublio-cyan border-dublio-cyan' : 'bg-black border-white/20'}`}
                        >
                           <div className={`w-6 h-6 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${editPublicFavorites ? 'left-6.5 translate-x-[22px]' : 'left-0.5'}`}></div>
                        </button>
                     </div>

                     {/* THEME SETTING */}
                     <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                        <div>
                           <label className="text-xs font-black text-gray-400 tracking-[0.2em] uppercase mb-2 block flex items-center gap-2">Görünüm</label>
                           <h4 className="text-white font-bold text-lg">Mod Seçimi</h4>
                           <p className="text-xs text-white/40 mt-1 max-w-sm">Uygulamayı açık veya karanlık modda (önerilen) kullanın.</p>
                        </div>
                        <div className="bg-black border border-white/10 rounded-xl p-1 flex">
                          <button 
                            onClick={() => themeMode !== 'dark' && toggleTheme()}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${themeMode === 'dark' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                          >
                            KARANLIK
                          </button>
                          <button 
                            onClick={() => themeMode !== 'light' && toggleTheme()}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${themeMode === 'light' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                          >
                            AÇIK
                          </button>
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10">
                        <button 
                           onClick={handleSaveProfile} 
                           disabled={isSaving}
                           className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] disabled:opacity-50 hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                           {isSaving ? "KAYDEDİLİYOR..." : <><Save className="w-5 h-5"/> AYARLARI KAYDET</>}
                        </button>
                        <button 
                           onClick={() => setActiveTab('genel')}
                           disabled={isSaving}
                           className="w-full sm:w-auto px-8 py-5 bg-transparent text-white/50 border-2 border-white/10 font-black text-sm uppercase tracking-[0.2em] rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                        >
                           <X className="w-5 h-5"/> İPTAL ET
                        </button>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
