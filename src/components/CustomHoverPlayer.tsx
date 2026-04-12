"use client";

import React, { useEffect, useState } from 'react';

export default function CustomHoverPlayer({ src }: { src: string }) {
  const [streamUrl, setStreamUrl] = useState<string>('');

  useEffect(() => {
    if (!src) return;
    try {
      // Obfuscate the URL via base64 encoded parameter so IDM can't sniff the .mp4 extension natively
      setStreamUrl(`/api/stream?f=${btoa(src)}`);
    } catch(e) {
      console.error(e);
      setStreamUrl(src);
    }
  }, [src]);

  if (!streamUrl) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-black/50 z-0 pointer-events-none select-none">
       {/* UI-Free, Isolated Silent Player tailored for Hover Cards */}
       <video 
         src={streamUrl}
         className="w-full h-full object-cover pointer-events-none" 
         autoPlay 
         muted 
         loop 
         playsInline
         disablePictureInPicture
         disableRemotePlayback
         controlsList="nodownload nofullscreen noremoteplayback"
         onContextMenu={(e) => e.preventDefault()}
       />
       {/* Thick invisible click shield just in case */}
       <div className="absolute inset-0 z-50 bg-transparent pointer-events-none" />
    </div>
  );
}
