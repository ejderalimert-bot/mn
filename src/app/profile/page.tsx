"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Camera, Save, X } from 'lucide-react';
import CloudinaryUploader from '@/components/CloudinaryUploader';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [likes, setLikes] = React.useState<any[]>([]);
  const [loadingFavs, setLoadingFavs] = React.useState(true);
  const [loadingLikes, setLoadingLikes] = React.useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (session?.user) {
       setEditName(session.user.name || "");
       setEditImage(session.user.image || "");
       
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
        <div className="w-12 h-12 border-4 border-dublio-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, image: editImage })
    });

    if (res.ok) {
      await update({ name: editName, image: editImage });
      setIsEditing(false);
    } else {
      alert("Profil güncellenirken hata oluştu.");
    }
    setIsSaving(false);
  };

  const displayName = session.user?.name || "Yeni Üye";

  return (
    <main className="min-h-screen bg-dublio-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-panel p-10 rounded-[40px] border border-white/5 relative overflow-hidden mb-10 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full -mr-20 -mt-20 transition-all duration-1000 pointer-events-none ${isEditing ? 'bg-dublio-cyan/20' : 'bg-dublio-purple/10'}`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              
              {/* Avatar Section */}
              <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[40px] border-4 border-white/10 overflow-hidden shadow-2xl relative group shrink-0 ${isEditing ? 'border-dublio-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)]' : ''}`}>
                 {(isEditing ? editImage : session.user?.image) ? (
                   <img src={isEditing ? editImage : (session.user?.image || '')} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-dublio-light flex items-center justify-center text-5xl font-black italic">
                      {displayName.charAt(0)}
                   </div>
                 )}
                 
                 {isEditing && (
                   <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-full h-full p-4">
                       <CloudinaryUploader 
                         onUploadSuccess={(url) => setEditImage(url)} 
                         resourceType="image" 
                         label="Değiştir"
                       />
                     </div>
                   </div>
                 )}
              </div>
              
              {/* Info Section */}
              <div className="text-center md:text-left flex-1 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                  <span className="w-2 h-2 bg-dublio-cyan rounded-full"></span>
                  <span className="text-[10px] font-black tracking-widest uppercase">AKTİF ÜYE</span>
                </div>

                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <div>
                      <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Kullanıcı Adı</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Örn: DublajUstası99"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xl font-bold text-white focus:outline-none focus:border-dublio-cyan transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2 break-all">
                      {displayName}
                    </h1>
                    <p className="text-dublio-text-dark text-lg font-medium">{session.user?.email}</p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="shrink-0">
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleSaveProfile} 
                      disabled={isSaving}
                      className="px-6 py-3 bg-dublio-cyan text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? "Kaydediliyor..." : <><Save className="w-4 h-4" /> Kaydet</>}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      disabled={isSaving}
                      className="px-6 py-3 bg-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> İptal
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:rotate-12 transition-all tooltip-trigger"
                    title="Profili Düzenle"
                  >
                    <Camera className="w-5 h-5 text-white/70" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-8">
                <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                   <h3 className="text-xl font-black italic uppercase mb-6 tracking-widest text-[#3b82f6]">BAYILDIKLARIM</h3>
                   {loadingLikes ? (
                      <div className="flex justify-center py-6 text-white/30">Yükleniyor...</div>
                   ) : likes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {likes.map((like) => (
                           <Link href={`/project/${like.slug || like.id}`} key={like.id} className="flex items-center gap-4 bg-[#1a1c23] p-4 rounded-2xl hover:bg-[#3b82f6]/10 transition-colors border border-white/5 hover:border-[#3b82f6]/50">
                             <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                                {like.image ? <img src={like.image} className="w-full h-full object-cover rounded-lg" /> : <span className="text-white/20 text-xs font-bold">{like.category}</span>}
                             </div>
                             <div className="flex flex-col overflow-hidden">
                               <span className="text-white font-bold truncate">{like.title}</span>
                               <span className="text-white/40 text-xs tracking-wider uppercase">{like.category}</span>
                             </div>
                           </Link>
                        ))}
                      </div>
                   ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-white/10 border-2 border-dashed border-white/5 rounded-2xl">
                         <span className="text-sm font-bold uppercase tracking-widest">Henüz hiçbir projeye bayılmadın</span>
                      </div>
                   )}
                </div>

                <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                   <h3 className="text-xl font-black italic uppercase mb-6 tracking-widest text-[#ef4444]">FAVORİ PROJELERİM</h3>
                   {loadingFavs ? (
                      <div className="flex justify-center py-6 text-white/30">Yükleniyor...</div>
                   ) : favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((fav) => (
                           <Link href={`/project/${fav.slug || fav.id}`} key={fav.id} className="flex items-center gap-4 bg-[#1a1c23] p-4 rounded-2xl hover:bg-[#ef4444]/10 transition-colors border border-white/5 hover:border-[#ef4444]/50">
                             <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                                {fav.image ? <img src={fav.image} className="w-full h-full object-cover rounded-lg" /> : <span className="text-white/20 text-xs font-bold">{fav.category}</span>}
                             </div>
                             <div className="flex flex-col overflow-hidden">
                               <span className="text-white font-bold truncate">{fav.title}</span>
                               <span className="text-white/40 text-xs tracking-wider uppercase">{fav.category}</span>
                             </div>
                           </Link>
                        ))}
                      </div>
                   ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-white/10 border-2 border-dashed border-white/5 rounded-2xl">
                         <span className="text-sm font-bold uppercase tracking-widest">Henüz favori proje eklenmedi</span>
                      </div>
                   )}
                </div>
             </div>

             <div className="space-y-8">
                <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                   <h3 className="text-xl font-black italic uppercase mb-6 tracking-widest text-white/40">İSTATİSTİKLER</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">BEĞENİ GÜCÜ</span>
                         <span className="text-2xl font-black italic">{likes.length * 10}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">PROJE AŞKI</span>
                         <span className="text-2xl font-black italic">{favorites.length * 50}</span>
                      </div>
                   </div>
                </div>
                
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1">
                    PROFİLİ DÜZENLE
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
