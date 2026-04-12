"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CustomHoverPlayer from './CustomHoverPlayer';

const VideoCard = ({ project }: { project: any }) => {
  const displayImage = project.displayImage || project.image || project.thumbnail;
  const fallbackImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop";
  const finalImage = displayImage ? displayImage : fallbackImage;
  const [isHovered, setIsHovered] = useState(false);

  // Parse and extract up to 3 distinct snippet images from gallery, fallbacking to main image
  let snippets: string[] = [];
  const gallery = project.gallery;
  if (Array.isArray(gallery) && gallery.length > 0) {
    snippets = Array.from(new Set(gallery));
  } else if (typeof gallery === 'string' && gallery.startsWith('[')) {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) snippets = Array.from(new Set(parsed));
    } catch (e) { }
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
      href={`/project/${project.slug || project.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-[#1a1c23] border border-transparent rounded-xl overflow-hidden hover:scale-[1.03] hover:border-white/10 transition-all duration-300 shadow-md hover:shadow-2xl relative z-0 hover:z-10"
    >
      <div className="w-full h-48 bg-[#15151a] relative overflow-hidden shrink-0">
        <img 
          src={finalImage} 
          alt={project.title} 
          suppressHydrationWarning
          className={`w-full h-full object-cover transition-all duration-[600ms] ease-out ${
            isHovered ? 'scale-110 blur-sm opacity-60' : 'scale-100 blur-0 opacity-100'
          }`} 
        />
        {isHovered && project.trailer && (
          project.trailer.includes('youtube.com') || project.trailer.includes('youtu.be') ? (
            <iframe
              src={`${project.trailer}${project.trailer.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0&loop=1`}
              className="w-full h-full object-cover pointer-events-none absolute inset-0 border-0"
              allow="autoplay; encrypted-media"
            />
          ) : (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <CustomHoverPlayer src={project.trailer} />
            </div>
          )
        )}
      </div>

      <div className="p-5 flex flex-col">
        <h3 className="text-[17px] font-bold text-white/90 group-hover:text-white transition-colors leading-tight line-clamp-1">
          {project.title}
        </h3>

        {/* Accordion Expand on Hover Container */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
          <div className="overflow-hidden">
            <div className="pt-4 flex flex-col gap-4">
              {/* Tags/Genres */}
              <div className="flex flex-wrap gap-2">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.slice(0, 3).map((tag: string, i: number) => (
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

const VideoProjects = ({ projects }: { projects: any[] }) => {
  return (
    <section className="py-24 px-8 bg-dublio-dark/50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-red-500/5 blur-[120px] rounded-full z-0"></div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></span>
              <span className="text-[10px] font-black text-red-500 tracking-[0.3em] uppercase">STÜDYO OPERASYONLARI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Video Projeleri</h2>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-white/40 text-[10px] font-black tracking-widest uppercase mb-1">TOTAL ETKİLEŞİM</span>
            <span className="text-3xl font-black italic text-white">370K+ İZLENME</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <VideoCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoProjects;
