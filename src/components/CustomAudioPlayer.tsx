"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function CustomAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(current);
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTo = (Number(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTo;
    setProgress(Number(e.target.value));
  };

  return (
    <div 
      className="relative w-full bg-[#1a1c23] border border-white/5 rounded-xl p-4 flex items-center gap-4 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Hidden audio element without controls to bypass IDM hooks */}
      <audio
        ref={audioRef}
        src={`/api/stream?f=${typeof window !== 'undefined' ? btoa(src) : ''}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-dublio-purple to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform hover:scale-105"
      >
         {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
      </button>

      {/* Progress Bar Container */}
      <div className="flex-1 flex items-center gap-3">
          <span className="text-white/60 font-bold text-xs w-10 text-right">{formatTime(currentTime)}</span>
          
          <div className="relative flex-1 h-2 group flex items-center cursor-pointer">
            {/* Background track */}
            <div className="absolute w-full h-full bg-white/10 rounded-full overflow-hidden pointer-events-none">
               {/* Colorful progress */}
               <div 
                 className="h-full bg-gradient-to-r from-dublio-purple to-pink-500 relative transition-all duration-75" 
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
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          
          <span className="text-white/40 font-bold text-xs w-10">{formatTime(duration)}</span>
      </div>

      {/* Mute Button */}
      <button 
        onClick={toggleMute} 
        className="text-white/60 hover:text-white transition-colors flex-shrink-0"
      >
         {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
