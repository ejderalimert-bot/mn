"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Bookmark, Heart, ThumbsUp, MoreVertical, Play, Pause, Video as VideoIcon, Music, Image as ImageIcon, Download } from 'lucide-react';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import CustomAudioPlayer from '@/components/CustomAudioPlayer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring, AnimatePresence, useMotionValue } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^"&?\/\s]{11})/);
  const id = match ? match[1] : '';
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}`;
};

const MarkdownVideo = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full rounded-xl my-6 shadow-2xl border border-white/10 group overflow-hidden bg-black/40">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto max-h-[500px] object-contain"
      />
      <button
        onClick={togglePlay}
        className="absolute top-4 right-4 bg-black/60 hover:bg-dublio-purple/80 text-white p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl border border-white/10 hover:scale-110 z-10"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
    </div>
  );
};

export default function ProjectDetailPage() {
  const { performanceMode } = usePerformance();
  const params = useParams();
  // Cinematic scroll values
  const { scrollY } = useScroll();
  const yCover = useTransform(scrollY, [0, 1000], [0, 500]);
  const scaleCover = useTransform(scrollY, [0, 1000], [1, 1.3]);
  const yText = useTransform(scrollY, [0, 800], [0, 200]);
  const rotateXText = useTransform(scrollY, [0, 800], [0, -30]);
  const id = params?.id as string;
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('genel'); // 'genel', 'lokalizasyon'
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'image', url: string } | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'audio' | 'image'>('video');
  const [animatedProgress, setAnimatedProgress] = useState(false);

  // Mouse Tracking for Extreme Relativistic Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightStyle = useMotionTemplate`radial-gradient(1000px circle at ${mouseX}px ${mouseY}px, rgba(168, 85, 247, 0.15), transparent 80%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Add random particle mapping for the background
  const [particles, setParticles] = useState([...Array(30)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  })));

  useEffect(() => {
    if (activeTab === 'mod') {
      const timer = setTimeout(() => setAnimatedProgress(true), 150);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(false);
    }
  }, [activeTab]);

  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [displayCover, setDisplayCover] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const [removeOverlay, setRemoveOverlay] = useState(false);
  const [minimumWaitDone, setMinimumWaitDone] = useState(false);

  useEffect(() => {
    // 5000ms = 5 seconds. Tick every 50ms, adding 1% each time.
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setMinimumWaitDone(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && minimumWaitDone) {
      const t1 = setTimeout(() => setFadeOverlay(true), 200);
      const t2 = setTimeout(() => setRemoveOverlay(true), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [loading, minimumWaitDone]);

  const isVideo = project?.category === 'Videolar' || project?.category === 'Video';

  useEffect(() => {
    // Fetch project
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => String(p.id) === id || (p.slug && p.slug === id));
        setProject(found);

        if (found) {
          let selectedCover = null;
          if (found.coverImage && found.coverImage2) {
            selectedCover = Math.random() > 0.5 ? found.coverImage : found.coverImage2;
          } else {
            selectedCover = found.coverImage || found.coverImage2 || found.image;
          }
          setDisplayCover(selectedCover);

          if (found.trailer) setActiveMedia({ type: 'video', url: found.trailer });
          else if (found.gallery?.length > 0) setActiveMedia({ type: 'image', url: found.gallery[0] });
          else if (found.image) setActiveMedia({ type: 'image', url: found.image });

          if (selectedCover) {
            const img = new window.Image();
            img.src = selectedCover;
            img.onload = () => setLoading(false);
            img.onerror = () => setLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
  }, [id]);

  useEffect(() => {
    // Check if favorited and liked
    if (session?.user?.id) {
      fetch(`/api/favorites?userId=${session.user.id}`)
        .then(res => res.json())
        .then(favs => {
          if (favs.includes(id)) setIsFavorite(true);
        }).catch(() => { });

      fetch(`/api/likes?userId=${session.user.id}`)
        .then(res => res.json())
        .then(likes => {
          if (likes.includes(id)) setIsLiked(true);
        }).catch(() => { });
    }

    // Fetch comments
    fetch(`/api/comments?projectId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      });
  }, [id, session?.user?.id]);

  const toggleFavorite = async () => {
    if (!session?.user?.id) {
      alert("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }

    const action = isFavorite ? 'remove' : 'add';
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, projectId: id, action })
    });

    if (res.ok) {
      setIsFavorite(!isFavorite);
    }
  };

  const toggleLike = async () => {
    if (!session?.user?.id) {
      alert("Buna bayılmak için giriş yapmalısınız.");
      return;
    }

    const action = isLiked ? 'remove' : 'add';
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, projectId: id, action })
    });

    if (res.ok) {
      setIsLiked(!isLiked);
    }
  };

  const handleCommentSubmit = async () => {
    if (!session?.user?.id) {
      alert("Yorum yapmak için giriş yapmalısınız.");
      return;
    }
    if (!commentText.trim()) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project?.id, // Ensure we send the actual ID, not the slug
        userId: session.user.id,
        userName: session.user.name,
        userAvatar: session.user.image,
        text: commentText
      })
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setCommentText('');
    }
  };

  return (
    <main className="min-h-screen bg-[#111115] text-[#d1d5db] font-sans relative">
      {!removeOverlay && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0d12] transition-opacity duration-[1000ms] pointer-events-none ${fadeOverlay ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-11/12 max-w-2xl">
            <div className="flex justify-between items-end mb-6 px-1 relative">
              <h2 className="text-white font-black tracking-[0.4em] text-2xl md:text-4xl uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">YÜKLENİYOR</h2>
              <span className="text-pink-500 text-2xl font-black drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">{Math.round(progress)}%</span>
            </div>
            <div className="h-4 md:h-6 w-full bg-[#1a1c23] border border-white/10 rounded-full overflow-hidden p-0.5 shadow-2xl relative">
              <div
                className="h-full bg-gradient-to-r from-dublio-purple via-pink-500 to-dublio-cyan rounded-full relative overflow-hidden"
                style={{
                  width: `${Math.max(2, progress)}%`,
                  transition: `width 50ms linear`
                }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(!loading && minimumWaitDone) && (
        !project ? (
          <div className={`transition-opacity duration-[1500ms] ease-out ${fadeOverlay ? 'opacity-100' : 'opacity-0'}`}>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <h1 className="text-4xl font-black mt-20 text-white">Proje Bulunamadı</h1>
              <p className="mt-4 text-white/50">Bu proje silinmiş veya hiç var olmamış olabilir.</p>
            </div>
          </div>
        ) : (
          <div onMouseMove={performanceMode === 'ultra' ? handleMouseMove : undefined} className={`group/spotlight transition-opacity duration-[1500ms] ease-out ${fadeOverlay ? 'opacity-100' : 'opacity-0'} relative`}>
            
            {/* DYNAMIC GLOBAL SPOTLIGHT EFFECT */}
            {performanceMode === 'ultra' && (
              <motion.div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/spotlight:opacity-100 transition duration-500 will-change-transform mix-blend-screen" style={{ background: spotlightStyle }} />
            )}
            
            {/* BACKGROUND CINEMATIC PARTICLES */}
            {performanceMode === 'ultra' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 fixed h-screen w-full">
               {particles.map((p, i) => (
                 <motion.div
                   key={i}
                   className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                   style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
                   animate={{ 
                     y: [0, -1000],
                     opacity: [0, 0.8, 0],
                     scale: [1, 2, 1]
                   }}
                   transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                 />
               ))}
              </div>
            )}

            <Navbar />
            <div className="w-full relative pb-12 z-10">
              {/* Cinematic Header Section (Full Width Bleed) */}
              <motion.div style={{ perspective: 1000 }} className="relative w-full h-[55vh] min-h-[450px] shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0a0a0c]">
                {displayCover && (
                  <motion.img style={{ y: yCover, scale: scaleCover, filter: "brightness(0.5) blur(2px)" }} src={displayCover} alt={project.title} className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#111115] via-transparent to-transparent"></div>
                
                {/* Header Content constrained to container */}
                <motion.div style={{ y: yText, rotateX: rotateXText }} className="absolute bottom-0 left-0 w-full [transform-style:preserve-3d]">
                  <div className="container mx-auto px-6 lg:px-12 max-w-7xl flex flex-col md:flex-row items-end gap-10 pb-12">
                    <motion.div 
                      variants={{ hidden: { y: 150, rotateY: 90, scale: 0.5, opacity: 0 }, visible: { y: 0, rotateY: 0, scale: 1, opacity: 1, transition: { duration: 2, ease: [0.22, 1, 0.36, 1] } } }}
                      initial="hidden" animate="visible"
                      whileHover={{ scale: 1.1, rotateY: 15, rotateX: 10, y: -20 }}
                      className="w-48 h-72 md:w-64 md:h-96 rounded-[2rem] overflow-hidden shrink-0 shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-[3px] border-white/5 relative bg-[#1a1c23] z-20 group"
                    >
                      <img src={project.image || displayCover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                    
                    <motion.div 
                      variants={{ hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                      initial="hidden" animate="visible"
                      className="flex-1 z-10 w-full pb-4"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <motion.span animate={{ boxShadow: ["0px 0px 0px rgba(6,182,212,0)", "0px 0px 30px rgba(6,182,212,0.8)", "0px 0px 0px rgba(6,182,212,0)"] }} transition={{ duration: 3, repeat: Infinity }} className="px-4 py-1.5 bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 rounded-full text-xs font-black uppercase tracking-widest">{project.category}</motion.span>
                            <span className="text-white/30 text-xs font-bold tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">RC-104710 ˅</span>
                        </div>
                        <motion.h1 style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }} className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 tracking-tight mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:skew-x-3 hover:drop-shadow-[0_0_80px_rgba(255,255,255,0.8)] transition-all duration-500">
                          {project.title}
                        </motion.h1>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: -2 }}
                            whileTap={{ scale: 0.9, rotate: 2 }}
                            onClick={toggleLike}
                            className={`flex items-center justify-center gap-3 px-8 h-14 rounded-2xl font-black text-sm transition-all duration-300 relative overflow-hidden group ${isLiked ? 'bg-[#3b82f6] text-white shadow-[0_0_40px_rgba(59,130,246,0.6)]' : 'bg-white/5 text-white backdrop-blur-xl border border-white/10'}`}
                          >
                            <span className="absolute w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></span>
                            <ThumbsUp className={`w-5 h-5 relative z-10 ${isLiked ? 'fill-current' : ''}`} /> <span className="relative z-10">BUNA BAYILDIM</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            whileTap={{ scale: 0.9, rotate: -2 }}
                            onClick={toggleFavorite}
                            className={`flex items-center justify-center gap-3 px-8 h-14 rounded-2xl font-black text-sm transition-all duration-300 relative overflow-hidden group ${isFavorite ? 'bg-gradient-to-r from-dublio-purple to-pink-500 text-white shadow-[0_0_40px_rgba(236,72,153,0.5)]' : 'bg-white/5 text-white backdrop-blur-xl border border-white/10'}`}
                          >
                            <span className="absolute w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></span>
                            <Heart className={`w-5 h-5 relative z-10 ${isFavorite ? 'fill-current' : ''}`} /> <span className="relative z-10">FAVORİLERE EKLE</span>
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.8 }} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-white/20 backdrop-blur-xl transition-colors">
                            <MoreVertical className="w-6 h-6" />
                          </motion.button>
                        </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Main App Container */}
              <div className="container mx-auto px-6 lg:px-12 pt-24 pb-12 max-w-7xl relative z-10">
                 
                 {/* Quick Stats Banner */}
                 <motion.div 
                   initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                   variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                   className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 bg-gradient-to-r from-white/[0.03] to-transparent p-6 rounded-3xl border border-white/[0.05] shadow-2xl relative overflow-hidden"
                 >
                    <div className="absolute -inset-x-20 -top-20 -bottom-20 bg-gradient-to-r from-dublio-purple/5 to-transparent blur-3xl pointer-events-none"></div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } } }} className="p-5 rounded-2xl bg-black/40 border border-white/[0.02] relative z-10 hover:bg-white/[0.05] hover:scale-105 transition-all">
                       <span className="block text-dublio-cyan/80 text-xs font-black tracking-[0.2em] uppercase mb-2">Geliştirici</span>
                       <span className="text-white font-bold text-lg">{project.team || 'Star Dublaj'}</span>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } } }} className="p-5 rounded-2xl bg-black/40 border border-white/[0.02] relative z-10 hover:bg-white/[0.05] hover:scale-105 transition-all">
                       <span className="block text-dublio-purple/80 text-xs font-black tracking-[0.2em] uppercase mb-2">Yayımcı</span>
                       <span className="text-white font-bold text-lg">{project.team || 'Star Dublaj'}</span>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } } }} className="p-5 rounded-2xl bg-black/40 border border-white/[0.02] relative z-10 hover:bg-white/[0.05] hover:scale-105 transition-all">
                       <span className="block text-pink-500/80 text-xs font-black tracking-[0.2em] uppercase mb-2">Çıkış Tarihi</span>
                       <span className="text-white font-bold text-lg">18 Feb, 2026</span>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } } }} className="p-5 rounded-2xl bg-black/40 border border-white/[0.02] relative z-10 hover:bg-white/[0.05] hover:scale-105 transition-all">
                       <span className="block text-white/40 text-xs font-black tracking-[0.2em] uppercase mb-3">Etiketler</span>
                       <div className="flex flex-wrap gap-2">
                         {(project.tags && project.tags.length > 0 ? project.tags : ['Aksiyon', 'Türkçe Dublaj', 'Macera']).slice(0, 3).map((tag: string, index: number) => (
                           <span key={index} className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">{tag}</span>
                         ))}
                       </div>
                    </motion.div>
                 </motion.div>

                 {/* Media Player Showcase - FULL HORIZONTAL REDESIGN */}
                 <motion.div 
                   initial={{ opacity: 0, rotateX: 60, scale: 0.8 }}
                   whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ type: "spring", bounce: 0.4, duration: 2 }}
                   className="w-full bg-[#0a0a0c] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.5)] mb-20 relative group [transform-style:preserve-3d] [perspective:1500px]"
                 >
                    {/* The Player Area */}
                    <div className="w-full h-[350px] md:h-[550px] lg:h-[700px] relative bg-black">
                      {activeMedia?.type === 'video' ? (
                        (activeMedia.url.includes('youtube.com') || activeMedia.url.includes('youtu.be')) ? (
                          <iframe src={`${getYoutubeEmbedUrl(activeMedia.url)}?autoplay=1&mute=0`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="w-full h-full border-none"></iframe>
                        ) : (
                          <CustomVideoPlayer src={activeMedia.url} autoPlay />
                        )
                      ) : activeMedia?.type === 'image' ? (
                        <img src={activeMedia.url} className="w-full h-full object-contain absolute inset-0 bg-[#0a0a0c]" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/50">
                          <Play className="w-24 h-24 text-white/5" />
                        </div>
                      )}
                    </div>
                    
                    {/* Horizontal Gallery Strip (Replaces Side Column) */}
                    <div className="w-full p-6 bg-[#0E0E12] flex gap-4 overflow-x-auto custom-scrollbar items-center border-t border-white/5 relative z-10">
                       {project.trailer && (
                          <div 
                            onClick={() => setActiveMedia({ type: 'video', url: project.trailer })} 
                            className={`w-64 h-36 shrink-0 bg-black rounded-2xl relative overflow-hidden group/thumb cursor-pointer border-[3px] transition-all duration-300 ${activeMedia?.url === project.trailer ? 'border-dublio-purple shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'border-transparent hover:border-white/20 hover:-translate-y-1 shadow-lg'}`}
                          >
                             <img src={project.image || project.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/thumb:opacity-90 transition-opacity" />
                             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent group-hover/thumb:opacity-0 transition-opacity"></div>
                             <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-dublio-purple/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_purple] group-hover/thumb:scale-110 transition-transform">
                               <Play className="w-4 h-4 text-white ml-0.5 fill-current" />
                             </div>
                             <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider">Fragman</span>
                          </div>
                       )}
                       {project.gallery?.map((imgUrl: string, i: number) => (
                          <div 
                            key={i}
                            onClick={() => setActiveMedia({ type: 'image', url: imgUrl })} 
                            className={`w-64 h-36 shrink-0 bg-black rounded-2xl relative overflow-hidden cursor-pointer border-[3px] transition-all duration-300 ${activeMedia?.url === imgUrl ? 'border-dublio-cyan shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'border-transparent hover:border-white/20 hover:-translate-y-1 shadow-lg'}`}
                          >
                             <img src={imgUrl} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                             <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded opacity-0 transition-opacity duration-300">Görüntüle</span>
                          </div>
                       ))}
                       {(!project.gallery?.length && !project.trailer) && [1, 2, 3].map((i) => (
                          <div key={i} className="w-64 h-36 shrink-0 bg-white/5 rounded-2xl relative overflow-hidden border border-white/5 border-dashed flex items-center justify-center">
                             <ImageIcon className="w-8 h-8 text-white/10" />
                          </div>
                        ))}
                    </div>
                 </motion.div>

                 {/* Content & Layout Grid */}
                 <motion.div 
                   initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                   variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
                   className="grid grid-cols-1 lg:grid-cols-3 gap-16"
                 >
                   {/* Left 2 Columns: Description & Media Tabs */}
                   <motion.div variants={{ hidden: { opacity: 0, x: -100, rotateY: 30 }, visible: { opacity: 1, x: 0, rotateY: 0, transition: { type: "spring", stiffness: 40, damping: 15, duration: 2 } } }} className="lg:col-span-2 space-y-16 [perspective:2000px]">
                      
                      <div className="bg-[#14151a] rounded-[2rem] p-8 md:p-12 border border-white/[0.05] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-dublio-purple/20 blur-[100px] pointer-events-none rounded-full"></div>
                        
                        {/* Tabs */}
                        <div className="flex items-center gap-10 border-b border-white/10 pb-6 mb-10 relative z-10">
                          <button onClick={() => setActiveTab('genel')} className={`text-sm md:text-base font-black transition-all uppercase tracking-[0.2em] relative ${activeTab === 'genel' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
                            Hikaye & Detaylar
                            {activeTab === 'genel' && <motion.span layoutId="tab-underline" className="absolute -bottom-[25px] left-0 w-full h-[4px] rounded-t-full bg-gradient-to-r from-dublio-purple to-dublio-cyan shadow-[0_0_20px_rgba(168,85,247,0.8)]"></motion.span>}
                          </button>
                          {!isVideo && (
                            <button onClick={() => setActiveTab('mod')} className={`text-sm md:text-base font-black transition-all uppercase tracking-[0.2em] relative ${activeTab === 'mod' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
                              MOD / İNDİR
                              {activeTab === 'mod' && <motion.span layoutId="tab-underline" className="absolute -bottom-[25px] left-0 w-full h-[4px] rounded-t-full bg-gradient-to-r from-dublio-purple to-dublio-cyan shadow-[0_0_20px_rgba(168,85,247,0.8)]"></motion.span>}
                            </button>
                          )}
                        </div>

                        <div className="relative z-10 min-h-[400px]">
                          <AnimatePresence mode="wait">
                            {/* Markdown Content (Genel) */}
                            {activeTab === 'genel' && (
                              <motion.div 
                                key="genel"
                                initial={{ opacity: 0, x: -50, rotateY: 30 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                exit={{ opacity: 0, x: 50, rotateY: -30 }}
                                transition={{ type: "spring", bounce: 0.3 }}
                                className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h3:text-dublio-purple prose-a:text-dublio-cyan hover:prose-a:text-pink-500 prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10 prose-p:text-white/70 prose-p:leading-relaxed"
                              >
                                 <ReactMarkdown
                                   remarkPlugins={[remarkGfm]}
                                   components={{
                                     a: ({ node, href, ...props }) => {
                                       const isInternal = href?.startsWith('/');
                                       return <Link href={href || '#'} target={isInternal ? undefined : "_blank"} rel={isInternal ? undefined : "noopener noreferrer"} className="font-bold underline underline-offset-4 decoration-dublio-cyan tooltip-trigger hover:text-white" {...props} />;
                                     },
                                     img: ({ node, src, alt, ...props }) => {
                                       if (typeof src === 'string' && src.match(/\.(mp4|webm|ogg|mkv|avi)(\?.*)?(#.*)?$/i)) {
                                         return <MarkdownVideo src={src} />;
                                       }
                                       return <img src={src} alt={alt} {...props} className="hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" />;
                                     },
                                   }}
                                 >
                                   {project.description || 'Bu proje için henüz detaylı bir açıklama girilmemiş.'}
                                 </ReactMarkdown>
                              </motion.div>
                            )}

                            {/* Mod & Progress Content */}
                            {activeTab === 'mod' && (
                               <motion.div 
                                 key="mod"
                                 initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: -50, scale: 0.9 }}
                                 transition={{ type: "spring", bounce: 0.4 }}
                                 className="space-y-12"
                               >
                                {/* Download Section */}
                                <div className="bg-gradient-to-r from-dublio-purple/20 to-dublio-cyan/20 p-[1px] rounded-3xl">
                                  <div className="bg-[#14151a] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-dublio-cyan/10 to-transparent pointer-events-none"></div>
                                    <div className="relative z-10 flex-1">
                                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-wide">TÜRKÇE DUBLAJ MODU</h3>
                                      <p className="text-white/60 font-medium">Büyük ustalıkla hazırlanan Türkçe Dublaj mod dosyasını şimdi indir ve oyununa entegre et.</p>
                                    </div>
                                    {project.modLink ? (
                                      <a href={project.modLink} target="_blank" rel="noopener noreferrer" className="shrink-0 relative z-10 group overflow-hidden bg-white text-black font-black text-lg px-8 py-5 rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] block">
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-dublio-cyan via-[#60a5fa] to-dublio-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                                          <Download className="w-6 h-6" /> DOSYAYI İNDİR
                                        </span>
                                      </a>
                                    ) : (
                                      <button disabled className="shrink-0 relative z-10 opacity-60 cursor-not-allowed bg-white/10 text-white/50 font-black text-lg px-8 py-5 rounded-2xl border border-white/10 flex items-center justify-center">
                                        LİNK BEKLENİYOR
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Progress Bars */}
                                <div>
                                  <h3 className="text-white font-black text-xl uppercase tracking-wider mb-8">Proje İlerlemesi</h3>
                                  <div className="bg-[#0e0e12] border border-white/[0.05] p-8 rounded-[2rem] space-y-8 shadow-inner relative overflow-hidden">
                                    <div className="absolute -inset-20 bg-gradient-to-br from-[#1d4ed8]/5 to-[#a855f7]/5 blur-3xl pointer-events-none"></div>
                                    
                                    {/* Bar 1 */}
                                    <div className="space-y-3 relative z-10 group/bar">
                                      <div className="flex justify-between items-end">
                                        <span className="text-white font-bold text-xs md:text-sm tracking-widest uppercase transition-colors group-hover/bar:text-white/80">Metin Yerelleştirme & Senaryo Çevirisi</span>
                                        <span className="text-[#3b82f6] font-black text-lg drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{project?.progressTranslation || '0'}%</span>
                                      </div>
                                      <div className="w-full h-4 bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
                                        <div className="h-full bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-full relative transition-all duration-[1500ms] ease-out flex items-center justify-end pr-2 overflow-hidden" style={{ width: animatedProgress ? `${project?.progressTranslation || 0}%` : '0%' }}>
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-50 mix-blend-overlay mix-blend-mode-overlay mix-blend-color-dodge animate-pulse"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/50 blur-sm shadow-[0_0_10px_white]"></div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Bar 2 */}
                                    <div className="space-y-3 relative z-10 group/bar">
                                      <div className="flex justify-between items-end">
                                        <span className="text-white font-bold text-xs md:text-sm tracking-widest uppercase transition-colors group-hover/bar:text-white/80">Dublaj & Stüdyo Kayıtları</span>
                                        <span className="text-[#10b981] font-black text-lg drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{project?.progressVoice || '0'}%</span>
                                      </div>
                                      <div className="w-full h-4 bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
                                        <div className="h-full bg-gradient-to-r from-[#047857] to-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.6)] rounded-full relative transition-all duration-[1800ms] ease-out flex items-center justify-end pr-2 overflow-hidden" style={{ width: animatedProgress ? `${project?.progressVoice || 0}%` : '0%' }}>
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-50 mix-blend-overlay mix-blend-mode-overlay mix-blend-color-dodge animate-pulse"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/50 blur-sm shadow-[0_0_10px_white]"></div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Bar 3 */}
                                    <div className="space-y-3 relative z-10 group/bar">
                                      <div className="flex justify-between items-end">
                                        <span className="text-white font-bold text-xs md:text-sm tracking-widest uppercase transition-colors group-hover/bar:text-white/80">Post-Prodüksiyon & Miksaj</span>
                                        <span className="text-dublio-purple font-black text-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{project?.progressMix || '0'}%</span>
                                      </div>
                                      <div className="w-full h-4 bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
                                        <div className="h-full bg-gradient-to-r from-[#7e22ce] to-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.6)] rounded-full relative transition-all duration-[2100ms] ease-out flex items-center justify-end pr-2 overflow-hidden" style={{ width: animatedProgress ? `${project?.progressMix || 0}%` : '0%' }}>
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-50 mix-blend-overlay mix-blend-mode-overlay mix-blend-color-dodge animate-pulse"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/50 blur-sm shadow-[0_0_10px_white]"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                               </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Media Extra Demos */}
                      <div className="bg-[#14151a] rounded-[2rem] p-8 md:p-12 border border-white/[0.05] shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 blur-[100px] pointer-events-none rounded-full"></div>
                        
                        <div className="flex gap-8 border-b border-white/10 pb-6 mb-10 relative z-10">
                          <button onClick={() => setActiveMediaTab('video')} className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-all relative ${activeMediaTab === 'video' ? 'text-white' : 'text-white/30 hover:text-white/70'}`}>
                            <VideoIcon className="w-5 h-5 relative z-10" /> <span className="relative z-10">Videolar</span> <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] relative z-10">{project.videoDemos?.length || 0}</span>
                            {activeMediaTab === 'video' && <motion.span layoutId="media-tab-underline" className="absolute -bottom-[25px] left-0 w-full h-[4px] rounded-t-full bg-white"></motion.span>}
                          </button>
                          <button onClick={() => setActiveMediaTab('audio')} className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-all relative ${activeMediaTab === 'audio' ? 'text-white' : 'text-white/30 hover:text-white/70'}`}>
                            <Music className="w-5 h-5 relative z-10" /> <span className="relative z-10">Sesler</span> <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] relative z-10">{project.audioDemos?.length || 0}</span>
                            {activeMediaTab === 'audio' && <motion.span layoutId="media-tab-underline" className="absolute -bottom-[25px] left-0 w-full h-[4px] rounded-t-full bg-white"></motion.span>}
                          </button>
                        </div>

                        <div className="relative z-10">
                          {activeMediaTab === 'video' && (
                            <div className="flex flex-col gap-8">
                              {project.videoDemos?.length > 0 ? project.videoDemos.map((url: string, i: number) => (
                                  <div key={i} className="bg-black rounded-3xl overflow-hidden border border-white/10 aspect-video relative shadow-2xl">
                                    {(url.includes('youtube.com') || url.includes('youtu.be')) ? (
                                      <iframe src={getYoutubeEmbedUrl(url)} allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="w-full h-full border-none absolute inset-0"></iframe>
                                    ) : (
                                      <CustomVideoPlayer src={url} autoPlay={false} />
                                    )}
                                  </div>
                                )) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                  <VideoIcon className="w-16 h-16 mb-6 text-white/50" />
                                  <p className="text-lg font-black tracking-widest uppercase">Video Demo Bulunamadı</p>
                                </div>
                              )}
                            </div>
                          )}

                          {activeMediaTab === 'audio' && (
                            <div className="flex flex-col gap-6">
                              {project.audioDemos?.length > 0 ? project.audioDemos.map((url: string, i: number) => (
                                  <CustomAudioPlayer key={i} src={url} />
                                )) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                  <Music className="w-16 h-16 mb-6 text-white/50" />
                                  <p className="text-lg font-black tracking-widest uppercase">Ses Kaydı Bulunamadı</p>
                                </div>
                              )}
                            </div>
                          )}
                       </div>
                     </div>
                   </motion.div>

                   {/* Sidebar Info (Right Column) */}
                   <motion.div 
                     initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                     variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
                     className="space-y-8"
                   >
                      {/* Requirements Panel */}
                      <motion.div variants={{ hidden: { opacity: 0, x: 50, rotateY: -30 }, visible: { opacity: 1, x: 0, rotateY: 0, transition: { type: "spring", bounce: 0.5 } } }} className="bg-[#14151a] border border-white/[0.05] rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group/req">
                        <div className="absolute -inset-20 bg-gradient-to-tr from-dublio-cyan/5 to-transparent pointer-events-none group-hover/req:opacity-100 transition-opacity opacity-0 duration-500 blur-xl"></div>
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                           <motion.div whileHover={{ rotate: 180, scale: 1.2 }} className="w-12 h-12 rounded-xl bg-gradient-to-br from-dublio-cyan to-blue-600 flex items-center justify-center shadow-lg">
                             <MoreVertical className="w-6 h-6 text-white" />
                           </motion.div>
                           <h3 className="text-white font-black text-xl uppercase tracking-wider">Sistem Gereksinimleri</h3>
                        </div>

                        <div className="space-y-10 relative z-10">
                          <motion.div whileHover={{ x: 10 }} className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-default">
                            <strong className="text-dublio-cyan mb-4 block tracking-[0.2em] font-black uppercase text-xs">Minimum</strong>
                            <ul className="space-y-3 text-sm text-white/70">
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">İşletim Sistemi</span> <span>Windows 10/11</span></li>
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">İşlemci</span> <span>Intel Core i3 / AMD Ryzen 5</span></li>
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Bellek</span> <span>8 GB RAM</span></li>
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Ekran Kartı</span> <span>Nvidia GTX 1650</span></li>
                            </ul>
                          </motion.div>
                          
                          <motion.div whileHover={{ x: 10 }} className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-default">
                            <strong className="text-dublio-purple mb-4 block tracking-[0.2em] font-black uppercase text-xs">Önerilen</strong>
                            <ul className="space-y-3 text-sm text-white/70">
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">İşletim Sistemi</span> <span>Windows 10/11</span></li>
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">İşlemci</span> <span>Intel Core i9 / AMD Ryzen 9</span></li>
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Bellek</span> <span>16 GB RAM</span></li>
                              <li className="flex flex-col"><span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Ekran Kartı</span> <span>Nvidia RTX 3060</span></li>
                            </ul>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Comments Section moved to Sidebar for better dynamic layout */}
                      <motion.div variants={{ hidden: { opacity: 0, x: 50, rotateY: -30 }, visible: { opacity: 1, x: 0, rotateY: 0, transition: { type: "spring", bounce: 0.5 } } }} className="bg-[#14151a] border border-white/[0.05] rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col h-[600px] relative overflow-hidden group/comments">
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-dublio-purple/10 pointer-events-none group-hover/comments:scale-150 transition-transform duration-1000 blur-3xl rounded-full"></div>
                        <h3 className="text-white font-black text-xl uppercase tracking-wider mb-8 relative z-10">Oyuncu Yorumları <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-dublio-purple bg-dublio-purple/20 px-3 py-1 rounded-lg ml-2 inline-block">{comments.length}</motion.span></h3>
                        
                        <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar mb-8 relative z-10">
                          {comments.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className="h-full flex flex-col items-center justify-center text-center">
                               <p className="text-sm font-bold uppercase tracking-widest">Hiç Yorum Yok</p>
                               <span className="text-xs">İlk yorumu ateşle!</span>
                            </motion.div>
                          ) : (
                            <AnimatePresence>
                              {comments.map((c: any, index: number) => (
                                <motion.div 
                                  key={c.id} 
                                  initial={{ opacity: 0, y: 20, scale: 0.8 }} 
                                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                                  transition={{ delay: index * 0.1, type: "spring" }}
                                  className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.05] hover:scale-105 transition-all shadow-md group/comment"
                                >
                                  <Link href={`/profile/${c.userId}`} className="w-10 h-10 rounded-xl bg-gradient-to-tr from-dublio-purple to-dublio-cyan overflow-hidden shrink-0 shadow-lg group-hover/comment:shadow-[0_0_20px_purple] transition-shadow">
                                    {c.userAvatar ? <img src={c.userAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center font-black text-white">{c.userName?.charAt(0) || '?'}</div>}
                                  </Link>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <Link href={`/profile/${c.userId}`} className="text-white text-sm font-black hover:text-dublio-cyan transition-colors group-hover/comment:text-pink-500">{c.userName || 'Anonim'}</Link>
                                      <span className="text-white/30 text-[10px] font-bold">{new Date(c.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed">{c.text}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          )}
                        </div>

                        <div className="mt-auto relative z-10">
                          <input
                            type="text"
                            placeholder="Mekana bir yorum bırak..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                            className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl py-4 pl-5 pr-24 text-sm text-white font-medium focus:outline-none focus:border-dublio-cyan/50 shadow-inner focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-shadow"
                          />
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={handleCommentSubmit} className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-dublio-cyan to-blue-600 hover:from-blue-500 hover:to-dublio-cyan text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md">Fırlat</motion.button>
                        </div>
                      </motion.div>
                   </motion.div>
                 </motion.div>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
}
