"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { Bookmark, Heart, ThumbsUp, MoreVertical, Play, Pause, Video as VideoIcon, Music, Image as ImageIcon } from 'lucide-react';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import CustomAudioPlayer from '@/components/CustomAudioPlayer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('genel'); // 'genel', 'lokalizasyon'
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'image', url: string } | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'audio' | 'image'>('video');
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
        projectId: id,
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
          <div className={`transition-opacity duration-[1500ms] ease-out ${fadeOverlay ? 'opacity-100' : 'opacity-0'}`}>
            <Navbar />
            <div className="container mx-auto px-6 py-12 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-16 items-center md:items-start">
              <div className="w-80 h-[28rem] rounded-xl overflow-hidden shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative bg-[#1a1c23]">
                {displayCover ? (
                  <img src={displayCover} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/10 uppercase italic">
                    {project.category}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-end h-full pt-10">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                  {project.title} <span className="text-white/20 text-xl font-medium tracking-normal align-top">RC-104710 ˅</span>
              </h1>
                <p className="text-white/70 max-w-2xl text-lg mb-8 leading-relaxed line-clamp-3">
                  {project.description || 'Bu proje için henüz detaylı bir açıklama girilmemiş.'}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-6 h-11 border transition-all rounded-lg font-bold text-sm ${isLiked ? 'bg-[#3b82f6]/20 border-[#3b82f6]/50 text-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-[#2a2d36] border-white/10 text-white/70 hover:text-white hover:bg-[#343843]'}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> Buna Bayıldım
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-6 h-11 border transition-all rounded-lg font-bold text-sm ${isFavorite ? 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-[#2a2d36] border-white/10 text-white/70 hover:text-white hover:bg-[#343843]'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} /> Favorilere Ekle
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#2a2d36] border border-white/10 text-white hover:bg-[#343843] transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>


                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-white/10 mb-8 px-2">
              <button
                onClick={() => setActiveTab('genel')}
                className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'genel' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                Genel Bakış
                {activeTab === 'genel' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-dublio-purple/80 shadow-[0_0_10px_purple]"></span>}
              </button>
              {!isVideo && (
                <button
                  onClick={() => setActiveTab('lokalizasyon')}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'lokalizasyon' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  Lokalizasyon
                  {activeTab === 'lokalizasyon' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-dublio-purple/80 shadow-[0_0_10px_purple]"></span>}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area (Left 2 columns) */}
              <div className={`space-y-8 ${isVideo ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                {/* Media Player Showcase */}
                <div className="flex bg-[#1a1c23] rounded-xl overflow-hidden p-2 border border-white/5 shadow-lg h-[400px]">
                  <div className="w-1/4 pr-2 space-y-2 overflow-y-auto custom-scrollbar">
                    {/* Trailer Thumbnail */}
                    {project.trailer && (
                      <div
                        onClick={() => setActiveMedia({ type: 'video', url: project.trailer })}
                        className={`w-full h-20 bg-[#15151a] rounded-lg relative overflow-hidden group cursor-pointer border ${activeMedia?.url === project.trailer ? 'border-dublio-purple' : 'border-transparent hover:border-dublio-purple/50'} transition-all`}
                      >
                        <img
                          src={project.image || project.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"}
                          alt="Fragman Thumbnail"
                          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 transition-all group-hover:bg-black/20 backdrop-blur-[2px] group-hover:backdrop-blur-none">
                          <Play className="w-8 h-8 text-white opacity-90 drop-shadow-md group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    )}
                    {/* Gallery Thumbnails */}
                    {project.gallery?.map((imgUrl: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => setActiveMedia({ type: 'image', url: imgUrl })}
                        className={`w-full h-20 bg-black/40 rounded-lg relative overflow-hidden cursor-pointer border ${activeMedia?.url === imgUrl ? 'border-dublio-purple' : 'border-transparent hover:border-dublio-purple/50'} transition-all`}
                      >
                        <img src={imgUrl} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {/* If nothing exists, show mock */}
                    {(!project.gallery?.length && !project.trailer) && [1, 2, 3].map((i) => (
                      <div key={i} className="w-full h-20 bg-black/40 rounded-lg relative overflow-hidden border border-transparent">
                      </div>
                    ))}
                  </div>
                  <div className="w-3/4 bg-black rounded-lg relative overflow-hidden">
                    {activeMedia?.type === 'video' ? (
                      <CustomVideoPlayer src={activeMedia.url} autoPlay />
                    ) : activeMedia?.type === 'image' ? (
                      <img src={activeMedia.url} className="w-full h-full object-contain absolute inset-0" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-20" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Content */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Genel Bakış</h2>
                  <div className="text-sm text-white/70 leading-relaxed space-y-4 prose prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-dublio-purple mt-5 mb-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-extrabold text-[#3b82f6]" {...props} />,
                        p: ({ node, ...props }) => <div className="mb-4 text-white/80 leading-relaxed" {...props} />,
                        a: ({ node, href, ...props }) => {
                          const isInternal = href?.startsWith('/');
                          const target = isInternal ? undefined : "_blank";
                          const rel = isInternal ? undefined : "noopener noreferrer";
                          return (
                            <Link href={href || '#'} target={target} rel={rel} className="text-dublio-purple hover:text-[#3b82f6] underline underline-offset-4 transition-colors font-semibold" {...props} />
                          );
                        },
                        img: ({ node, src, alt, ...props }) => {
                          if (typeof src === 'string' && src.match(/\.(mp4|webm|ogg|mkv|avi)(\?.*)?(#.*)?$/i)) {
                            return (
                              <MarkdownVideo src={src} />
                            );
                          }
                          return (
                            <img src={src} alt={alt} className="w-full h-auto max-h-[500px] object-cover rounded-xl my-6 shadow-2xl border border-white/10" {...props} />
                          );
                        },
                      }}
                    >
                      {project.description || 'Bu proje için henüz detaylı bir açıklama girilmemiş.'}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Media Tabs (Screenshots style) */}
                <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-8 shadow-sm">
                  <div className="flex gap-6 border-b border-white/10 pb-4 mb-8">
                    <button
                      onClick={() => setActiveMediaTab('video')}
                      className={`flex items-center gap-2 text-sm font-bold transition-all ${activeMediaTab === 'video' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                      <VideoIcon className="w-4 h-4" /> Videolar ({project.videoDemos?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveMediaTab('audio')}
                      className={`flex items-center gap-2 text-sm font-bold transition-all ${activeMediaTab === 'audio' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                      <Music className="w-4 h-4" /> Sesler ({project.audioDemos?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveMediaTab('image')}
                      className={`flex items-center gap-2 text-sm font-bold transition-all ${activeMediaTab === 'image' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                      <ImageIcon className="w-4 h-4" /> Resimler ({project.gallery?.length || 0})
                    </button>
                  </div>

                  {activeMediaTab === 'video' && (
                    <div className="flex flex-col gap-6">
                      {project.videoDemos?.length > 0 ? (
                        project.videoDemos.map((url: string, i: number) => (
                          <div key={i} className="mb-4 bg-black rounded-lg overflow-hidden border border-white/5 aspect-video relative">
                            <CustomVideoPlayer src={url} autoPlay={false} />
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-40">
                          <VideoIcon className="w-10 h-10 mb-4" />
                          <p className="text-sm font-bold">Henüz Hiç Video Demo Eklenmemiş</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeMediaTab === 'audio' && (
                    <div className="flex flex-col gap-4">
                      {project.audioDemos?.length > 0 ? (
                        project.audioDemos.map((url: string, i: number) => (
                          <CustomAudioPlayer key={i} src={url} />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-40">
                          <Music className="w-10 h-10 mb-4" />
                          <p className="text-sm font-bold">Henüz Hiç Ses Kaydı Eklenmemiş</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeMediaTab === 'image' && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.gallery?.length > 0 ? (
                        project.gallery.map((url: string, i: number) => (
                          <img key={i} src={url} className="w-full h-32 object-cover rounded-lg border border-white/5 hover:scale-105 transition-transform" />
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-40">
                          <ImageIcon className="w-10 h-10 mb-4" />
                          <p className="text-sm font-bold">Henüz Hiç Resim Eklenmemiş</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-8 shadow-sm">
                  <h3 className="text-white font-bold mb-4">Yorumlar ({comments.length})</h3>
                  <div className="flex items-start gap-4 mb-8">
                    <input
                      type="text"
                      placeholder="Bir yorum yaz..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                      className="flex-1 bg-[#23262f] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-dublio-purple/50"
                    />
                    <button onClick={handleCommentSubmit} className="px-6 py-3 bg-[#2a2d36] hover:bg-[#343843] text-white font-bold text-sm rounded-lg transition-colors border border-white/10">Gönder</button>
                  </div>

                  {comments.length === 0 ? (
                    <div className="text-center py-16 text-white/30 text-sm">
                      Henüz hiç yorum yapılmamış. İlk yorumu sen yap!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments.map((c: any) => (
                        <div key={c.id} className="flex gap-4">
                          <Link href={`/profile/${c.userId}`} className="w-10 h-10 rounded-full bg-dublio-purple/20 overflow-hidden shrink-0 border border-white/10 hover:border-dublio-purple transition-all cursor-pointer">
                            {c.userAvatar ? <img src={c.userAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center font-bold text-dublio-purple text-xs">{c.userName?.charAt(0) || '?'}</div>}
                          </Link>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link href={`/profile/${c.userId}`} className="text-white text-sm font-bold hover:text-dublio-cyan transition-colors">{c.userName || 'Anonim'}</Link>
                              <span className="text-white/30 text-[10px]">{new Date(c.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap break-words">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info (Right Column) */}
              {!isVideo && (
                <div className="space-y-4">
                  <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-6 text-sm">
                    <div className="space-y-4">
                      <div>
                        <span className="text-white/40 block text-xs tracking-wider mb-1">Geliştirici</span>
                        <strong className="text-white">{project.team || 'Star Dublaj'}</strong>
                      </div>
                      <div>
                        <span className="text-white/40 block text-xs tracking-wider mb-1">Yayımcı</span>
                        <strong className="text-white">{project.team || 'Star Dublaj'}</strong>
                      </div>
                      <div>
                        <span className="text-white/40 block text-xs tracking-wider mb-1">Çıkış Tarihi</span>
                        <strong className="text-white">18 Feb, 2026</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-3 text-sm">Türler</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#23262f] rounded border border-white/5 text-xs text-white/70">Aksiyon</span>
                      <span className="px-3 py-1 bg-[#23262f] rounded border border-white/5 text-xs text-white/70">Macera</span>
                      <span className="px-3 py-1 bg-[#23262f] rounded border border-white/5 text-xs text-white/70">Bağımsız Yapımcı</span>
                    </div>
                  </div>

                  <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-3 text-sm">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags && project.tags.length > 0 ? (
                        project.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-[#23262f] rounded border border-white/5 text-xs text-white/70">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-[#23262f] rounded border border-white/5 text-xs text-white/70">Tek Oyunculu</span>
                          <span className="px-3 py-1 bg-[#23262f] rounded border border-white/5 text-xs text-white/70">Aksiyon</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-6 text-sm">Sistem Gereksinimleri</h3>

                    <div className="space-y-6 text-xs text-white/70">
                      <div>
                        <strong className="text-white mb-2 block tracking-wider uppercase">Minimum</strong>
                        <ul className="space-y-1">
                          <li><strong className="text-white/50">OS:</strong> Windows 10/11</li>
                          <li><strong className="text-white/50">Processor:</strong> Intel Core i3 9100 / AMD Ryzen 5 3500</li>
                          <li><strong className="text-white/50">Memory:</strong> 8 GB RAM</li>
                          <li><strong className="text-white/50">Graphics:</strong> Nvidia GeForce GTX 1650</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-white mb-2 block tracking-wider uppercase">Önerilen</strong>
                        <ul className="space-y-1">
                          <li><strong className="text-white/50">OS:</strong> Windows 10/11</li>
                          <li><strong className="text-white/50">Processor:</strong> Intel Core i9-11900K / AMD Ryzen 9 5900X</li>
                          <li><strong className="text-white/50">Memory:</strong> 16 GB RAM</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
        )
      )}
    </main>
  );
}
