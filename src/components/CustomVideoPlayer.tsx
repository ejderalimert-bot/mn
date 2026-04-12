"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

export default function CustomVideoPlayer({ src, autoPlay = true }: { src: string, autoPlay?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    if (autoPlay && videoRef.current) {
        // Mute autoplay initially if it gets blocked to ensure it plays, or simply catch error.
        videoRef.current.play().catch(() => {
            console.log("Autoplay blocked, user interaction required");
            setIsPlaying(false);
        });
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [src, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => console.log(e));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(current);
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = (Number(e.target.value) / 100) * duration;
    videoRef.current.currentTime = seekTo;
    setProgress(Number(e.target.value));
  };
  
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const finalSrc = `/api/stream?f=${typeof window !== 'undefined' ? btoa(src) : ''}`;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black group overflow-hidden flex items-center justify-center absolute inset-0 select-none ${isFullscreen ? '' : 'rounded-lg'}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video is at the absolute bottom layer */}
      <video
        ref={videoRef}
        src={finalSrc}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0" 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        playsInline
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
      />
      
      {/* Heavy Invisible Click Shield covering the entire active video area */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
      >
        {!isPlaying && (
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-dublio-purple to-pink-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-transform hover:scale-110">
             <Play className="w-8 h-8 ml-1 fill-current" />
          </div>
        )}
      </div>

      {/* Controls Bar completely shielded with absolute top Z-Index */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-50 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Progress Bar Container */}
        <div className="flex items-center gap-4 mb-3">
            <span className="text-white font-bold text-xs w-10 text-right">{formatTime(currentTime)}</span>
            
            <div className="relative flex-1 h-3 group/slider flex items-center cursor-pointer">
              {/* Background track */}
              <div className="absolute w-full h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                 {/* Colorful progress */}
                 <div 
                   className="h-full bg-gradient-to-r from-cyan-400 via-dublio-purple to-pink-500 shadow-[0_0_15px_rgba(168,85,247,1)] relative transition-all duration-75" 
                   style={{ width: `${progress}%` }}
                 >
                 </div>
              </div>
              
              {/* Invisible native range input for easy sliding */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer z-[60]"
              />
            </div>
            
            <span className="text-white/50 font-bold text-xs w-10">{formatTime(duration)}</span>
        </div>

        {/* Action Buttons */}
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
