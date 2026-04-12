"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import CustomHoverPlayer from './CustomHoverPlayer';

const getYoutubeEmbedUrl = (url: string, autoPlaySnippet: boolean = false) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^"&?\/\s]{11})/);
  const id = match ? match[1] : '';
  if (!id) return url;
  if (autoPlaySnippet) {
     return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&playlist=${id}`;
  }
  return `https://www.youtube.com/embed/${id}`;
};

const ModCard = ({ id, slug, title, category, team, downloads, thumbnail, image, image2, displayImage, gallery, trailer, tags }: any) => {
  const fallbackImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop";
  const finalImage = displayImage ? displayImage : fallbackImage;
  const [isHovered, setIsHovered] = useState(false);

  // Parse and extract up to 3 distinct snippet images from gallery, fallbacking to main image
  let snippets: string[] = [];
  if (Array.isArray(gallery) && gallery.length > 0) {
    snippets = Array.from(new Set(gallery));
  } else if (typeof gallery === 'string' && gallery.startsWith('[')) {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) snippets = Array.from(new Set(parsed));
    } catch(e) {}
  }
  // Remove finalImage if it's already there to ensure we grab distinct items
  snippets = snippets.filter(s => s !== finalImage);
  
  // Ensure we have exactly 3 slots to render
  const top3 = [];
  for (let i = 0; i < 3; i++) {
     top3.push(snippets[i] || finalImage);
  }

  return (
    <Link 
      href={`/project/${slug || id}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-[#1a1c23] border border-transparent rounded-xl overflow-hidden hover:scale-[1.03] hover:border-white/10 transition-all duration-300 shadow-md hover:shadow-2xl relative z-0 hover:z-10"
    >
      <div className="w-full h-48 bg-[#15151a] relative overflow-hidden shrink-0">
        <img 
          src={finalImage} 
          alt={title} 
          suppressHydrationWarning
          className={`w-full h-full object-cover transition-all duration-[600ms] ease-out ${
            isHovered ? 'scale-110 blur-sm opacity-60' : 'scale-100 blur-0 opacity-100'
          }`}
        />
        {isHovered && trailer && (
           <div className="absolute inset-0 z-0">
             <CustomHoverPlayer src={trailer} />
           </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col">
        <h3 className="text-[17px] font-bold text-white/90 group-hover:text-white transition-colors leading-tight line-clamp-1">
          {title}
        </h3>
        
        {/* Accordion Expand on Hover Container */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
          <div className="overflow-hidden">
            <div className="pt-4 flex flex-col gap-4">
              {/* Tags/Genres */}
              <div className="flex flex-wrap gap-2">
                {tags && tags.length > 0 ? (
                  tags.slice(0, 3).map((tag: string, i: number) => (
                     <span key={i} className="px-3 py-1.5 bg-white/5 rounded-full text-[11px] font-medium text-white/70 tracking-wide">{tag}</span>
                  ))
                ) : (
                  <>
                    <span className="px-3 py-1.5 bg-white/5 rounded-full text-[11px] font-medium text-white/70 tracking-wide">Aksiyon</span>
                    <span className="px-3 py-1.5 bg-white/5 rounded-full text-[11px] font-medium text-white/70 tracking-wide">Macera</span>
                  </>
                )}
              </div>
              
              {/* Snippet Images */}
              <div className="flex gap-2 h-14">
                {top3.map((src, idx) => {
                  const delayClass = idx === 0 ? "delay-100" : idx === 1 ? "delay-150" : "delay-200";
                  return (
                    <div key={idx} className={`flex-1 bg-black/40 rounded-md overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity duration-500 ${delayClass}`}>
                      <img src={src} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProjectsSection = ({ mods }: { mods: any[] }) => {
  return (
    <section className="py-32 px-8 container mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-dublio-purple rounded-full"></div>
            <span className="text-[12px] font-black text-dublio-purple tracking-[0.4em] uppercase">KEŞFET</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-tight">
            Geleceğin <br /> <span className="dublio-gradient-text">Projelerini</span> Yakala
          </h2>
        </div>

        <div className="flex flex-col gap-4 items-end">
          <p className="text-dublio-text-dark font-medium text-right max-w-sm mb-4 leading-relaxed">
            Star Dublaj Studios Burada.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-[#2f2f38]/50 border border-white/5 rounded-2xl font-bold text-sm text-white/50 hover:text-white transition-all backdrop-blur-xl">
              TÜMÜNÜ FİLTRELE
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mods.map(mod => (
          <ModCard key={mod.id} {...mod} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
