"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Shield, Plus, Pencil, Trash2, LayoutGrid, Users, Newspaper, ListTree, Gamepad2, ArrowLeft, Search, Download, Activity, Eye, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";
import CloudinaryUploader from '@/components/CloudinaryUploader';

// Local data is fetched now

const tabs = [
  { id: 'Analizler', icon: Activity, label: 'Site Analizleri' },
  { id: 'Projeler', icon: LayoutGrid, label: 'Projeler' },
  { id: 'Oyun Ekle', icon: Download, label: 'Oyun Dublajı Ekle' },
  { id: 'Ekip', icon: Users, label: 'Ekip' },
  { id: 'Haberler', icon: Newspaper, label: 'Haberler' },
  { id: 'Seriler', icon: ListTree, label: 'Seriler' },
  { id: 'Oyun Türleri', icon: Gamepad2, label: 'Oyun Türleri' },
];

export default function AdminDashboardPage() {
  const { performanceMode } = usePerformance();
  const { data: session, status } = useSession();
  
  const [activeTab, setActiveTab] = useState('Analizler');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const navRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [view, setView] = useState('list'); // 'list', 'form'
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [steamQuery, setSteamQuery] = useState('');
  const [steamResults, setSteamResults] = useState<any[]>([]);
  const [steamLoading, setSteamLoading] = useState(false);
  const [steamAdding, setSteamAdding] = useState<string | null>(null);

  // Users & Team
  const [usersList, setUsersList] = useState<any[]>([]);
  const [teamFormLoading, setTeamFormLoading] = useState(false);

  // News
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsVideo, setNewsVideo] = useState('');
  const [newsAdding, setNewsAdding] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formCategory, setFormCategory] = useState<string>('Oyunlar');
  const [formTrailer, setFormTrailer] = useState<string>('');
  const [formGeminiLink, setFormGeminiLink] = useState<string>('');
  const [formFocusKeyword, setFormFocusKeyword] = useState<string>('');
  const [formSeoTitle, setFormSeoTitle] = useState<string>('');
  const [formSeoDesc, setFormSeoDesc] = useState<string>('');
  const [formSlug, setFormSlug] = useState<string>('');
  const [geminiEnhancing, setGeminiEnhancing] = useState(false);
  
  const [stats, setStats] = useState({
    totalAccounts: 0,
    activeUsers: 0,
    totalViews: 0,
    totalDownloads: 0,
    monthlyTraffic: Array(12).fill(0)
  });

  React.useEffect(() => {
    if (status === "unauthenticated" || (session && (session.user as any).role !== "admin")) {
      redirect('/');
    }
  }, [session, status]);

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(() => {});

    fetch('/api/team?action=users').then(res => res.json()).then(data => setUsersList(data)).catch(()=>{});
    fetch('/api/news').then(res => res.json()).then(data => setNewsList(data)).catch(()=>{});
  }, []);

  React.useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.id === activeTab);
    const el = navRefs.current[activeIndex];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
        opacity: 1
      });
    }
  }, [activeTab]);

  React.useEffect(() => {
    if (!steamQuery.trim()) {
      setSteamResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSteamLoading(true);
      try {
        const res = await fetch(`/api/steam?action=search&q=${encodeURIComponent(steamQuery)}`);
        const data = await res.json();
        setSteamResults(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSteamLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [steamQuery]);

  const handleGeminiEnhance = async () => {
    if (!formTitle) {
      alert("Gemini SEO için Başlık zorunludur!");
      return;
    }
    setGeminiEnhancing(true);
    try {
      const res = await fetch('/api/gemini/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, description: formDescription, category: formCategory, trailer: formGeminiLink, focusKeyword: formFocusKeyword })
      });
      const data = await res.json();
      if (data.description) setFormDescription(data.description);
      if (data.tags) setFormTags(data.tags);
      if (data.seoTitle) setFormSeoTitle(data.seoTitle);
      if (data.seoDesc) setFormSeoDesc(data.seoDesc);
      if (data.slug) setFormSlug(data.slug);
    } catch (err) {
      alert("Gemini bağlantısında hata oluştu.");
    } finally {
      setGeminiEnhancing(false);
    }
  };

  if (status === "loading" || loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0f14]">
        <div className="w-8 h-8 rounded-full border-4 border-t-white border-white/20 animate-spin"></div>
      </div>
    );
  }

  const handleAddNew = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Oyunlar');
    setFormTrailer('');
    setFormGeminiLink('');
    setFormTags([]);
    setFormFocusKeyword('');
    setFormSeoTitle('');
    setFormSeoDesc('');
    setFormSlug('');
    setView('form');
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormTitle(project.title || '');
    setFormDescription(project.description || '');
    setFormCategory(project.category || 'Oyunlar');
    setFormTrailer(project.trailer || '');
    setFormGeminiLink('');
    setFormTags(project.tags || []);
    setFormFocusKeyword(project.focusKeyword || '');
    setFormSeoTitle(project.seoTitle || '');
    setFormSeoDesc(project.seoDesc || '');
    setFormSlug(project.slug || '');
    setView('form');
  };

  const handleDelete = async (id: number) => {
    if(confirm("Projeyi silmek istediğinize emin misiniz?")) {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => String(p.id) !== String(id)));
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const projData = {
      title: formData.get('title'),
      category: formData.get('category'),
      status: formData.get('status'),
      description: formData.get('description'),
      retention: formData.get('retention') ? formData.get('retention') + '%' : '0%',
      views: '0', swiped: '0%', stayed: '0%', downloads: '0', 
      team: 'Star Dublaj', 
      image: formData.get('image') || editingProject?.image || '',
      image2: formData.get('image2') || editingProject?.image2 || '', 
      coverImage: formData.get('coverImage') || editingProject?.coverImage || '',
      coverImage2: formData.get('coverImage2') || editingProject?.coverImage2 || '',
      trailer: formData.get('trailer') || editingProject?.trailer || '',
      gallery: (formData.get('gallery') as string)?.split('\n').filter(l => l.trim().length > 0) || editingProject?.gallery || [],
      audioDemos: (formData.get('audioDemos') as string)?.split('\n').filter(l => l.trim().length > 0) || editingProject?.audioDemos || [],
      videoDemos: (formData.get('videoDemos') as string)?.split('\n').filter(l => l.trim().length > 0) || editingProject?.videoDemos || [],
      tags: formTags,
      focusKeyword: formFocusKeyword,
      seoTitle: formSeoTitle,
      seoDesc: formSeoDesc,
      slug: formSlug,
      progressTranslation: formData.get('progressTranslation')?.toString() || '0',
      progressVoice: formData.get('progressVoice')?.toString() || '0',
      progressMix: formData.get('progressMix')?.toString() || '0',
      modLink: formData.get('modLink')?.toString() || ''
    };

    if (editingProject) {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingProject, ...projData })
      });
      const updated = await res.json();
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
    } else {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projData)
      });
      const added = await res.json();
      setProjects([...projects, added]);
    }

    setView('list');
  };

  const searchSteam = async (e: React.FormEvent) => {
    e.preventDefault();
    // Arama işlemi artık useEffect içerisinde otomatik (harf girildikçe) yapılıyor.
  };

  const addFromSteam = async (item: any) => {
    setSteamAdding(item.id.toString());
    try {
      const res = await fetch(`/api/steam?action=details&appid=${item.id}`);
      const data = await res.json();
      const details = data[item.id]?.data;
      
      const image = details?.header_image || item.tiny_image;
      let description = details?.short_description || item.name;
      const gallery = details?.screenshots?.map((s: any) => s.path_full) || [];
      // Trailer verisi Steam'den çekilmeyecek, kullanıcı manuel ekleyecek
      let trailer = '';
      let tags: string[] = [];
      let seoTitle = '';
      let seoDesc = '';
      let slug = '';
      let focusKeyword = item.name;

      const customTitle = `${item.name} Türkçe Dublaj`;

      try {
        const geminiRes = await fetch('/api/gemini/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: customTitle, description, category: 'Oyunlar', trailer: '', focusKeyword })
        });
        
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          if (geminiData.description) description = geminiData.description;
          if (geminiData.tags) tags = geminiData.tags;
          if (geminiData.seoTitle) seoTitle = geminiData.seoTitle;
          if (geminiData.seoDesc) seoDesc = geminiData.seoDesc;
          if (geminiData.slug) slug = geminiData.slug;
        }
      } catch (geminiErr) {
        console.error("Gemini enhance failed during steam add:", geminiErr);
      }

      const projData = {
        title: customTitle,
        category: 'Oyunlar',
        status: 'Devam Ediyor',
        description,
        retention: '0%',
        views: '0', 
        swiped: '0%', 
        stayed: '0%', 
        downloads: '0', 
        team: 'Star Dublaj', 
        image,
        trailer,
        gallery,
        tags,
        focusKeyword,
        seoTitle,
        seoDesc,
        slug
      };

      const addRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projData)
      });
      const added = await addRes.json();
      setProjects([...projects, added]);

      alert(item.name + ' başarıyla eklendi!');
    } catch (err) {
      console.error(err);
      alert('Eklenirken bir hata oluştu');
    } finally {
      setSteamAdding(null);
    }
  };

  const handleToggleTeamMember = async (userId: string, roleTitle: string, isCurrentlyMember: boolean, memberId?: string) => {
    setTeamFormLoading(true);
    try {
      if (isCurrentlyMember && memberId) {
        await fetch(`/api/team?id=${memberId}`, { method: 'DELETE' });
        setUsersList(usersList.map(u => u.id === userId ? { ...u, teamMember: null } : u));
      } else {
        const title = prompt("Ekip görevini yazınız (Örn: Çevirmen, Kodlayan, Seslendirmen)", roleTitle || "Ekip Üyesi");
        if (!title) return;
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roleTitle: title })
        });
        const newMember = await res.json();
        setUsersList(usersList.map(u => u.id === userId ? { ...u, teamMember: newMember } : u));
      }
    } finally {
      setTeamFormLoading(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      alert("Lütfen başlık ve içerik giriniz.");
      return;
    }
    setNewsAdding(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const imgLink = formData.get('image') as string;
      const vidLink = formData.get('video') as string;

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newsTitle, content: newsContent, image: imgLink, video: vidLink })
      });
      const added = await res.json();
      if (!added.error) {
        setNewsList([added, ...newsList]);
        setNewsTitle('');
        setNewsContent('');
        alert("Haber başarıyla eklendi! Kullanıcılara bildirim gidebilir.");
      } else {
        alert(added.error);
      }
    } catch {
      alert("Hata");
    } finally {
      setNewsAdding(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("Haberi silmek istediğinize emin misiniz?")) {
      await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      setNewsList(newsList.filter(n => n.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* SİNEMATİK ARKA PLAN */}
      <div className="absolute inset-0 pointer-events-none z-0 fixed">
         <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-dublio-cyan/20 blur-[200px] mix-blend-screen rounded-full" />
         <motion.div animate={{ rotate: -360, scale: [1.2, 1, 1.2] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-dublio-purple/20 blur-[250px] mix-blend-screen rounded-full" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-3xl">
        <Navbar />
      </div>
      
      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-12">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }} 
            className="p-4 bg-dublio-cyan/5 rounded-[2rem] border-2 border-dublio-cyan/50 shadow-[0_0_50px_rgba(106,255,235,0.4)] backdrop-blur-xl"
          >
             <Shield className="w-12 h-12 text-dublio-cyan" />
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-dublio-cyan to-dublio-purple uppercase drop-shadow-[0_0_30px_rgba(106,255,235,0.5)] leading-none mb-2">MERKEZİ YÖNETİM</h1>
            <p className="text-dublio-cyan font-bold tracking-[0.3em] uppercase text-xs md:text-sm">Star Dublaj System Core v3.0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative flex flex-wrap items-center gap-2 mb-10 bg-black/40 backdrop-blur-3xl p-3 rounded-2xl border border-dublio-cyan/30 shadow-[0_0_50px_rgba(106,255,235,0.1)] inline-flex w-full overflow-x-auto">
          
          {/* Sliding Indicator */}
          <div 
             className="absolute bg-gradient-to-r from-dublio-cyan to-[#00bfff] rounded-xl shadow-[0_0_20px_cyan] pointer-events-none transition-all duration-300 ease-in-out"
             style={{ 
               left: `${indicatorStyle.left}px`, 
               top: `${indicatorStyle.top}px`,
               width: `${indicatorStyle.width}px`, 
               height: `${indicatorStyle.height}px`,
               opacity: indicatorStyle.opacity 
             }}
          />

          {tabs.map((tab, idx) => (
            <button
               key={tab.id}
               ref={(el) => { navRefs.current[idx] = el; }}
               onClick={() => { setActiveTab(tab.id); setView('list'); }}
               className={`relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                 activeTab === tab.id 
                   ? 'text-black mix-blend-difference' 
                   : 'text-white/50 hover:text-white hover:bg-white/5'
               }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="relative">
          <AnimatePresence mode="wait">
        
        {activeTab === 'Projeler' && view === 'list' && (
          <motion.div key="proj-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="bg-[#15171e] border border-dublio-purple rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.05)] relative">
             
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-[#00ff00]">Projeler ({projects.length})</h2>
                <button 
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d946ef] to-[#a855f7] hover:to-[#9333ea] text-white font-bold text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Proje
                </button>
             </div>

             {/* Project List */}
             <div className="p-6 space-y-4">
                {projects.map((project, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    key={project.id} 
                    className="flex flex-col md:flex-row items-center justify-between p-4 bg-[#1a1c23] border border-white/5 hover:border-dublio-purple hover:scale-[1.01] rounded-xl transition-all gap-4 shadow-lg group"
                  >
                     <div className="flex items-center gap-4 w-full md:w-auto">
                        {project.image || project.coverImage ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/50 border border-white/10 shrink-0 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow">
                            <img src={project.image || project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                        ) : (
                          <div className="w-20 h-10 rounded shadow-inner bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center border border-white/10 shrink-0">
                          </div>
                        )}
                        <div className="flex flex-col">
                           <h3 className="text-[#e2b714] font-bold text-lg mb-1">{project.title}</h3>
                           <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white/80">{project.category}</span>
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                project.status === 'Tamamlandı' ? 'bg-[#00ff00]/20 text-[#00ff00]' : 'bg-[#e2b714]/20 text-[#e2b714]'
                              }`}>
                                {project.status}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button onClick={() => handleEdit(project)} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="w-10 h-10 flex items-center justify-center bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </motion.div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-10 text-white/30 font-medium">Kayıtlı proje bulunamadı.</div>
                )}
             </div>
          </motion.div>
        )}

        {/* Form View (Add / Edit) */}
        {activeTab === 'Projeler' && view === 'form' && (
           <motion.div key="proj-form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="bg-[#15171e] border border-dublio-purple/50 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(168,85,247,0.05)] relative">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                 <button onClick={() => setView('list')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                   <ArrowLeft className="w-5 h-5" />
                 </button>
                 <h2 className="text-2xl font-black italic tracking-tight text-dublio-purple uppercase">
                   {editingProject ? 'PROJEYİ DÜZENLE' : 'YENİ PROJE EKLE'}
                 </h2>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Video URL'si (YouTube / Shorts)</label>
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="https://www.youtube.com..." 
                        className="flex-1 bg-[#1a1c23] border border-white/10 rounded-l-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple"
                      />
                      <button type="button" className="bg-white text-black font-bold px-6 rounded-r-lg text-sm transition-colors hover:bg-gray-200">
                        Kapak Çek
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Proje Başlığı <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      placeholder="Proje başlığı" 
                      className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-dublio-purple text-sm font-bold tracking-wide">SEO Odak Anahtar Kelime <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="focusKeyword"
                    value={formFocusKeyword}
                    onChange={(e) => setFormFocusKeyword(e.target.value)}
                    required
                    placeholder="Örn: The Witcher 3" 
                    className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Açıklama</label>
                    <button 
                      type="button"
                      onClick={handleGeminiEnhance}
                      disabled={geminiEnhancing}
                      className="flex items-center gap-2 bg-gradient-to-r from-dublio-purple to-[#9333ea] px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:scale-105 transition-all w-fit"
                    >
                      {geminiEnhancing ? 'Gemini Düşünüyor...' : '✨ Gemini ile Düzenle'}
                    </button>
                  </div>
                  <textarea 
                    name="description"
                    rows={6}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Projeler hakkında detaylı bilgi"
                    className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple resize-none"
                  ></textarea>
                  <p className={`text-[10px] text-right mt-1 font-bold ${formDescription.length < 600 ? 'text-red-500' : 'text-green-400'}`}>
                    {formDescription.length} / 600
                  </p>
                </div>
                
                {formTags && formTags.length > 0 && (
                  <div className="space-y-2">
                     <label className="text-dublio-purple text-sm font-bold tracking-wide">Gemini Tarafından Üretilen Etiketler</label>
                     <div className="flex flex-wrap gap-2 p-3 bg-[#1a1c23] border border-white/10 rounded-lg">
                        {formTags.map((t, i) => (
                           <span key={i} className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-md">{t}</span>
                        ))}
                     </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1a1c23]/50 p-4 rounded-xl border border-dublio-purple/20">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">SEO Başlığı</label>
                    <input type="text" value={formSeoTitle} onChange={(e) => setFormSeoTitle(e.target.value)} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple" />
                    <p className={`text-[10px] text-right mt-1 ${formSeoTitle.length > 60 ? 'text-red-500' : 'text-white/40'}`}>
                      {formSeoTitle.length} / 60
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">SEO URL (Slug)</label>
                    <input type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">SEO Meta Açıklaması</label>
                    <textarea value={formSeoDesc} onChange={(e) => setFormSeoDesc(e.target.value)} rows={2} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple resize-none"></textarea>
                    <p className={`text-[10px] text-right mt-1 ${formSeoDesc.length > 150 ? 'text-red-500' : 'text-white/40'}`}>
                      {formSeoDesc.length} / 150
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Yatay Ana Sayfa Görseli 1 (URL veya Yükle)</label>
                    <input id="inp_img1" type="text" name="image" defaultValue={editingProject?.image} placeholder="https://..." className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mb-2" />
                    <CloudinaryUploader resourceType="image" label="1. Yatay Resim Yükle" onUploadSuccess={(url) => { (document.getElementById('inp_img1') as HTMLInputElement).value = url; }} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Yatay Ana Sayfa Görseli 2 (URL veya Yükle)</label>
                    <input id="inp_img2" type="text" name="image2" defaultValue={editingProject?.image2} placeholder="https://..." className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mb-2" />
                    <CloudinaryUploader resourceType="image" label="2. Yatay Resim Yükle" onUploadSuccess={(url) => { (document.getElementById('inp_img2') as HTMLInputElement).value = url; }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Dikey Kapak Görseli 1 (URL veya Yükle)</label>
                    <input id="inp_cov1" type="text" name="coverImage" defaultValue={editingProject?.coverImage} placeholder="https://..." className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mb-2" />
                    <CloudinaryUploader resourceType="image" label="1. Dikey Kapak Yükle" onUploadSuccess={(url) => { (document.getElementById('inp_cov1') as HTMLInputElement).value = url; }} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Dikey Kapak Görseli 2 (URL veya Yükle)</label>
                    <input id="inp_cov2" type="text" name="coverImage2" defaultValue={editingProject?.coverImage2} placeholder="https://..." className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mb-2" />
                    <CloudinaryUploader resourceType="image" label="2. Dikey Kapak Yükle" onUploadSuccess={(url) => { (document.getElementById('inp_cov2') as HTMLInputElement).value = url; }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Kategori</label>
                    <select name="category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple appearance-none">
                      <option value="Oyunlar">Oyunlar</option>
                      <option value="Videolar">Videolar</option>
                      <option value="Yamalar">Yamalar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Durum</label>
                    <select name="status" defaultValue={editingProject?.status || 'Devam Ediyor'} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple appearance-none">
                      <option>Devam Ediyor</option>
                      <option>Tamamlandı</option>
                      <option>İptal Edildi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Seri</label>
                    <select className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple appearance-none">
                      <option>Seçilmedi</option>
                      <option>GTA Serisi</option>
                      <option>Witcher Serisi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Gemini YouTube Analiz Linki</label>
                    <input type="text" value={formGeminiLink} onChange={(e) => setFormGeminiLink(e.target.value)} placeholder="YouTube linkini yapıştırın (Sadece YZ analizi için)" className="mb-2 w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Ana Fragman (YouTube Linki veya .MP4 Yükle)</label>
                    <input id="inp_trailer" type="text" name="trailer" defaultValue={editingProject?.trailer} placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mb-2" />
                    <CloudinaryUploader resourceType="video" label="Fragman Videosu Yükle (.mp4)" onUploadSuccess={(url) => { (document.getElementById('inp_trailer') as HTMLInputElement).value = url; }} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Ek Videolar (Alt alta URL'ler)</label>
                    <textarea id="inp_vdemos" name="videoDemos" defaultValue={editingProject?.videoDemos?.join('\n')} rows={3} placeholder="Her satıra URL" className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple resize-none mb-2" />
                    <CloudinaryUploader resourceType="video" label="Ekstra Video Yükle" onUploadSuccess={(url) => { 
                      const el = document.getElementById('inp_vdemos') as HTMLTextAreaElement;
                      el.value = el.value ? el.value + '\n' + url : url;
                    }} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Ses Örnekleri (Alt alta URL'ler)</label>
                    <textarea id="inp_ademos" name="audioDemos" defaultValue={editingProject?.audioDemos?.join('\n')} rows={3} placeholder="Her satıra Ses URL" className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple resize-none mb-2" />
                    <CloudinaryUploader resourceType="video" label="Ses Dosyası Yükle (.mp3)" onUploadSuccess={(url) => { 
                      const el = document.getElementById('inp_ademos') as HTMLTextAreaElement;
                      el.value = el.value ? el.value + '\n' + url : url;
                    }} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Oyun İçi Görseller (Galeri)</label>
                    <textarea id="inp_gal" name="gallery" defaultValue={editingProject?.gallery?.join('\n')} rows={3} placeholder="Her satıra Resim URL" className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple resize-none mb-2" />
                    <CloudinaryUploader resourceType="image" label="Galeriye Resim Ekle" onUploadSuccess={(url) => { 
                      const el = document.getElementById('inp_gal') as HTMLTextAreaElement;
                      el.value = el.value ? el.value + '\n' + url : url;
                    }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Tarih</label>
                    <input type="date" className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dublio-purple text-sm font-bold tracking-wide">Mod İndirme Linki (URL)</label>
                    <input name="modLink" type="text" defaultValue={editingProject?.modLink || ''} placeholder="https://..." className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple" />
                  </div>
                </div>
                
                <h3 className="text-white mt-8 mb-4 font-bold border-b border-white/5 pb-2">Proje Mod İlerlemesi (%)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-dublio-cyan text-xs font-bold tracking-wide uppercase">Çeviri Yüzdesi</label>
                    <input name="progressTranslation" type="number" min="0" max="100" defaultValue={editingProject?.progressTranslation || 0} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-cyan" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-green-500 text-xs font-bold tracking-wide uppercase">Dublaj Yüzdesi</label>
                    <input name="progressVoice" type="number" min="0" max="100" defaultValue={editingProject?.progressVoice || 0} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-green-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-purple-500 text-xs font-bold tracking-wide uppercase">Miksaj Yüzdesi</label>
                    <input name="progressMix" type="number" min="0" max="100" defaultValue={editingProject?.progressMix || 0} className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
                
                <div className="pt-8 flex justify-end gap-4">
                   <button type="button" onClick={() => setView('list')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold">
                      İPTAL
                   </button>
                   <button type="submit" className="px-10 py-4 bg-gradient-to-r from-dublio-purple to-[#9333ea] hover:scale-105 text-white font-black italic tracking-widest rounded-xl transition-all shadow-lg shadow-dublio-purple/20">
                      {editingProject ? 'GÜNCELLE' : 'KAYDET'}
                   </button>
                </div>
              </form>
           </motion.div>
        )}

        {/* Steam Integration Tab */}
        {activeTab === 'Oyun Ekle' && (
          <motion.div key="oyun-ekle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="bg-[#15171e] border border-dublio-purple/50 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(168,85,247,0.05)] relative">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              <Gamepad2 className="w-8 h-8 text-dublio-purple" />
              <h2 className="text-2xl font-black italic tracking-tight text-dublio-purple uppercase">
                STEAM'DEN OYUN ÇEK
              </h2>
            </div>

            <form onSubmit={searchSteam} className="mb-8 flex gap-4">
              <input 
                type="text" 
                value={steamQuery}
                onChange={(e) => setSteamQuery(e.target.value)}
                placeholder="Oyun adı ara (örn: The Witcher 3)" 
                className="flex-1 bg-[#1a1c23] border border-white/10 rounded-lg py-4 px-6 text-white focus:outline-none focus:border-dublio-purple"
              />
              <button 
                type="submit" 
                disabled={steamLoading}
                className="px-8 py-4 bg-gradient-to-r from-dublio-purple to-[#9333ea] hover:scale-105 text-white font-bold rounded-lg transition-all shadow-lg shadow-dublio-purple/20 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {steamLoading ? 'Aranıyor...' : 'Ara'}
              </button>
            </form>

            <div className="space-y-4">
              {steamResults.map((item: any) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-[#1a1c23] border border-white/5 rounded-xl gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <img src={item.tiny_image} alt={item.name} className="w-24 h-12 object-cover rounded" />
                    <div>
                      <h3 className="text-white font-bold">{item.name}</h3>
                      <p className="text-white/50 text-sm">App ID: {item.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addFromSteam(item)}
                    disabled={steamAdding === item.id.toString()}
                    className="w-full md:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    {steamAdding === item.id.toString() ? 'Ekleniyor...' : 'Kayıt Ekle'}
                  </button>
                </div>
              ))}
              
              {!steamLoading && steamResults.length === 0 && steamQuery && (
                 <div className="text-center py-10 text-white/30 font-medium">Oyun bulunamadı veya arama yapmadınız.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Site Analytics Tab */}
        {activeTab === 'Analizler' && (
          <motion.div key="analizler" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="space-y-6">
             <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: performanceMode === 'ultra' ? 'spring' : 'tween', bounce: performanceMode === 'ultra' ? 0.4 : 0, duration: 0.3 } } }} className="bg-[#15171e] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:scale-[1.05] transition-transform cursor-default">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00ff00]/10 rounded-full blur-3xl group-hover:bg-[#00ff00]/30 transition-all duration-500"></div>
                   <h3 className="text-white/50 font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-[#00ff00]" /> Toplam Görüntülenme</h3>
                   <p className="text-4xl text-white font-black">{stats.totalViews}</p>
                   <p className="text-[#00ff00] text-sm font-bold mt-2">Sitenin Toplam Trafiği</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: performanceMode === 'ultra' ? 'spring' : 'tween', bounce: performanceMode === 'ultra' ? 0.4 : 0, duration: 0.3 } } }} className="bg-[#15171e] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:scale-[1.05] transition-transform cursor-default">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-dublio-purple/10 rounded-full blur-3xl group-hover:bg-dublio-purple/30 transition-all duration-500"></div>
                   <h3 className="text-white/50 font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-dublio-purple" /> Aktif Ziyaretçi</h3>
                   <p className="text-4xl text-white font-black flex items-center gap-3">
                     <span className="w-3 h-3 rounded-full bg-dublio-purple animate-[pulse_1.5s_infinite]"></span>
                     {stats.activeUsers}
                   </p>
                   <p className="text-white/30 text-sm font-bold mt-2">Şu an sitede gezenler</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: performanceMode === 'ultra' ? 'spring' : 'tween', bounce: performanceMode === 'ultra' ? 0.4 : 0, duration: 0.3 } } }} className="bg-[#15171e] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:scale-[1.05] transition-transform cursor-default">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all duration-500"></div>
                   <h3 className="text-white/50 font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-pink-500" /> Kayıtlı Hesap</h3>
                   <p className="text-4xl text-white font-black">{stats.totalAccounts}</p>
                   <p className="text-pink-500 text-sm font-bold mt-2">Gerçek kayıtlı üyeler</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: performanceMode === 'ultra' ? 'spring' : 'tween', bounce: performanceMode === 'ultra' ? 0.4 : 0, duration: 0.3 } } }} className="bg-[#15171e] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:scale-[1.05] transition-transform cursor-default">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#e2b714]/10 rounded-full blur-3xl group-hover:bg-[#e2b714]/30 transition-all duration-500"></div>
                   <h3 className="text-white/50 font-bold mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-[#e2b714]" /> Toplam Mod/Yama Oynatma</h3>
                   <p className="text-4xl text-white font-black">{stats.totalDownloads}</p>
                   <p className="text-[#e2b714] text-sm font-bold mt-2">Kayıtlı tıklanmalar</p>
                </motion.div>
             </motion.div>
             
             {/* Extended Dummy Chart Area */}
             <div className="bg-[#15171e] border border-white/5 rounded-2xl p-6 md:p-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] mt-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white">Yıllık Trafik İstatistiği</h3>
                  <select className="bg-white/5 border border-white/10 text-white text-sm font-bold rounded-lg px-4 py-2 outline-none">
                     <option>2026 Yılı</option>
                     <option>2025 Yılı</option>
                  </select>
                </div>
                <div className="w-full h-64 flex items-end justify-between gap-1 md:gap-4 border-b border-white/10 pb-4">
                  {stats.monthlyTraffic.map((h, i) => (
                     <div key={i} className="w-full bg-gradient-to-t from-dublio-purple/20 to-dublio-purple hover:to-pink-500 rounded-t-md transition-all duration-300 relative group cursor-pointer" style={{ height: `${Math.max(h > 0 ? (h / Math.max(...stats.monthlyTraffic)) * 100 : 5, 5)}%` }}>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                         {h} Ziyaret
                       </div>
                     </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-white/40 text-xs md:text-sm font-bold px-2">
                   <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span><span>Ağu</span><span>Eyl</span><span>Eki</span><span>Kas</span><span>Ara</span>
                </div>
             </div>
          </motion.div>
        )}

        {/* Tab Placeholder */}
        {activeTab === 'Ekip' && (
          <motion.div key="ekip" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="bg-[#15171e] border border-dublio-purple/50 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(168,85,247,0.05)] relative">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              <Users className="w-8 h-8 text-dublio-purple" />
              <div className="flex flex-col">
                <h2 className="text-2xl font-black italic tracking-tight text-dublio-purple uppercase">
                  EKİBİMİZİ YÖNET
                </h2>
                <p className="text-white/40 text-sm font-bold">Kayıtlı kullanıcılara tıklayarak onları ekip üyesi yapabilirsiniz.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersList.length === 0 ? <p className="text-white/30 text-sm font-bold p-4">Hiç kayıtlı kullanıcı yok.</p> : usersList.map(u => (
                <div 
                  key={u.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border ${u.teamMember ? 'bg-dublio-purple/10 border-dublio-purple' : 'bg-[#1a1c23] border-white/5'} transition-all`}
                >
                  <img src={u.image || '/globe.svg'} alt={u.name} className="w-12 h-12 rounded-full object-cover shrink-0 bg-black/50" />
                  <div className="flex flex-col flex-1 min-w-0 cursor-pointer" onClick={() => handleToggleTeamMember(u.id, u.teamMember?.roleTitle, !!u.teamMember, u.teamMember?.id)}>
                    <span className="font-bold text-white truncate">{u.name}</span>
                    <span className="text-xs text-white/50 truncate w-full">{u.email}</span>
                    {u.teamMember && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {u.teamMember.roleTitle.split(',').map((role: string, idx: number) => (
                          <span key={idx} className="text-[10px] font-black uppercase text-dublio-purple border border-dublio-purple/30 bg-dublio-purple/10 px-2 py-0.5 rounded">
                            {role.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {u.teamMember && (
                    <a href={`/user/${u.id}`} target="_blank" rel="noopener noreferrer" className="ml-2 w-8 h-8 rounded-full bg-dublio-cyan/10 border border-dublio-cyan/30 flex items-center justify-center hover:bg-dublio-cyan hover:text-black text-dublio-cyan transition-colors" title="Profile Git">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'Haberler' && (
          <motion.div key="haberler" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="bg-[#15171e] border border-dublio-purple/50 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(168,85,247,0.05)] relative flex flex-col md:flex-row gap-6">
            
            {/* Ekleme Formu */}
            <div className="md:w-1/2 flex flex-col space-y-6">
              <div className="flex items-center gap-4 mb-2 pb-6 border-b border-white/5">
                <Newspaper className="w-8 h-8 text-dublio-purple" />
                <h2 className="text-2xl font-black italic tracking-tight text-dublio-purple uppercase">Haber Ekle</h2>
              </div>
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div>
                  <label className="text-dublio-purple text-sm font-bold tracking-wide">Haber Başlığı</label>
                  <input type="text" value={newsTitle} onChange={e=>setNewsTitle(e.target.value)} required className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mt-1" />
                </div>
                <div>
                  <label className="text-dublio-purple text-sm font-bold tracking-wide">Haber İçeriği</label>
                  <textarea rows={5} value={newsContent} onChange={e=>setNewsContent(e.target.value)} required className="w-full resize-none bg-[#1a1c23] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple mt-1" />
                </div>
                <div>
                  <label className="text-dublio-purple text-sm font-bold tracking-wide">Görsel Yükle (İsteğe Bağlı)</label>
                  <input type="file" name="newsImageFile" accept="image/*" className="w-full bg-[#1a1c23] border border-white/10 rounded-lg text-sm text-[#848496] file:mr-4 file:py-3 file:px-4 file:border-0 file:bg-white/5 file:text-white file:font-bold hover:file:bg-white/10 cursor-pointer mt-1" />
                </div>
                <div>
                  <label className="text-dublio-purple text-sm font-bold tracking-wide">Video Yükle (İsteğe Bağlı)</label>
                  <input type="file" name="newsVideoFile" accept="video/mp4" className="w-full bg-[#1a1c23] border border-white/10 rounded-lg text-sm text-[#848496] file:mr-4 file:py-3 file:px-4 file:border-0 file:bg-white/5 file:text-white file:font-bold hover:file:bg-white/10 cursor-pointer mt-1" />
                </div>
                <button type="submit" disabled={newsAdding} className="w-full py-4 mt-2 bg-gradient-to-r from-dublio-purple to-[#9333ea] hover:scale-105 text-white font-black italic tracking-widest rounded-xl transition-all shadow-lg shadow-dublio-purple/20">
                  {newsAdding ? 'EKLENİYOR...' : 'HABERİ YAYINLA'}
                </button>
              </form>
            </div>

            {/* Mevcut Haberler */}
            <div className="md:w-1/2 flex flex-col space-y-4">
              <h3 className="text-xl font-bold text-white mb-2 pt-8 md:pt-0">Yayınlanmış Haberler</h3>
              <div className="flex flex-col space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {newsList.map(n => (
                  <div key={n.id} className="bg-[#1a1c23] border border-white/5 rounded-xl p-4 flex gap-4 items-start group hover:border-dublio-purple/30 transition-colors">
                    {n.image && <img src={n.image} className="w-20 h-16 object-cover rounded bg-black/50 shrink-0" />}
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">{n.title}</h4>
                      <p className="text-white/40 text-xs mt-1 line-clamp-2">{n.content}</p>
                      <span className="text-[10px] text-white/20 mt-2 font-bold">{new Date(n.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <button onClick={() => handleDeleteNews(n.id)} className="w-8 h-8 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {newsList.length === 0 && <p className="text-white/30 text-xs font-bold text-center py-4">Henüz haber yok.</p>}
              </div>
            </div>

          </motion.div>
        )}

        {activeTab !== 'Projeler' && activeTab !== 'Oyun Ekle' && activeTab !== 'Analizler' && activeTab !== 'Ekip' && activeTab !== 'Haberler' && (
          <motion.div key="yakinda" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: performanceMode === 'ultra' ? 'spring' : 'tween', duration: 0.3 }} className="bg-[#15171e] border border-white/5 rounded-2xl p-20 text-center shadow-xl flex flex-col items-center justify-center gap-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
               <h3 className="text-white/20">Yakında</h3>
             </div>
             <p className="text-white/40"><strong className="text-white">{activeTab}</strong> bölümü yapım aşamasında.</p>
          </motion.div>
        )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
