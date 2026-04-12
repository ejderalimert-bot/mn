"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import ReactPlayer from 'react-player';

export default function CustomVideoPlayer({ src, autoPlay = false }: { src: string, autoPlay?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getYoutubeId = (url: string) => {
    const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const ytId = getYoutubeId(src);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleProgress = (state: { playedSeconds: number, loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
    if (duration > 0) setProgress((state.playedSeconds / duration) * 100);
  };

  const handleDuration = (dur: number) => setDuration(dur);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = (Number(e.target.value) / 100) * duration;
    playerRef.current?.seekTo(seekTo, 'seconds');
    setProgress(Number(e.target.value));
  };
  
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (!mounted) {
    return <div className="w-full h-full bg-[#1a1c23] border border-white/5 rounded-lg animate-pulse" />;
  }

  // GUARANTEED STABLE URL FOR REACT PLAYER -> Normalizes ANY weird youtube URL into standard watch link
  const finalSrc = ytId 
    ? `https://www.youtube.com/watch?v=${ytId}` 
    : (src?.startsWith('http') ? src : `/api/stream?f=${typeof window !== 'undefined' ? btoa(src || '') : ''}`);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black group overflow-hidden flex items-center justify-center absolute inset-0 select-none ${isFullscreen ? '' : 'rounded-lg border border-white/5'}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="absolute inset-x-0 inset-y-0 w-full h-full z-0 overflow-hidden pointer-events-none" style={{ minHeight: '100%' }}>
        <ReactPlayer
          ref={playerRef}
          url={finalSrc}
          playing={isPlaying}
          muted={isMuted}
          controls={false}
          width="100%"
          height={ytId ? '135%' : '100%'} // Massive scale to hide youtube title bars/watermarks top & bottom
          style={ytId ? { position: 'absolute', top: '-17.5%' } : {}}
          // @ts-ignore
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={() => setIsPlaying(false)}
          playsinline
          config={{
            youtube: {
              playerVars: { 
                showinfo: 0, 
                rel: 0, 
                modestbranding: 1,
                iv_load_policy: 3,
                disablekb: 1,
                fs: 0
              }
            }
          } as any}
        />
      </div>
      
      {/* Heavy click shield MUST handle togglePlay to intercept YouTube's internal pausing mechanism */}
      <div 
        className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
      >
        {!isPlaying && (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-dublio-purple to-pink-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-transform hover:scale-110">
             <Play className="w-10 h-10 ml-2 fill-current" />
          </div>
        )}
      </div>

      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-50 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-3">
            <span className="text-white font-bold text-xs w-10 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-3 group/slider flex items-center cursor-pointer">
              <div className="absolute w-full h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                 <div 
                   className="h-full bg-gradient-to-r from-cyan-400 via-dublio-purple to-pink-500 shadow-[0_0_15px_rgba(168,85,247,1)] relative transition-all duration-75" 
                   style={{ width: `${progress}%` }}
                 />
              </div>
              <input 
                type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer z-[60]"
              />
            </div>
            <span className="text-white/50 font-bold text-xs w-10">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between px-1 relative z-[60]">
           <div className="flex items-center gap-5">
              <button onClick={togglePlay} className="text-white hover:text-dublio-purple transition-transform hover:scale-110 outline-none focus:outline-none">
                 {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <button onClick={toggleMute} className="text-white hover:text-dublio-purple transition-transform hover:scale-110 outline-none focus:outline-none">
                 {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 fill-current" />}
              </button>
           </div>
           <div>
              <button onClick={handleFullscreen} className="text-white hover:text-dublio-purple transition-transform hover:scale-110 outline-none focus:outline-none">
                 {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
