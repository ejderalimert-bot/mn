"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import CustomHoverPlayer from './CustomHoverPlayer';
import { motion } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";

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

  const { performanceMode } = usePerformance();

  return (
    <motion.div
      variants={performanceMode === 'ultra' ? { hidden: { opacity: 0, rotateY: 60, scale: 0.9, x: -100, filter: "blur(15px)" }, visible: { opacity: 1, rotateY: 0, scale: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 30, damping: 15, duration: 2.5 } } } : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
      whileHover={performanceMode === 'ultra' ? { y: -15, rotateX: 5, rotateY: -10, scale: 1.05, boxShadow: "0px 30px 60px rgba(0,0,0,0.8)" } : { y: -5, scale: 1.02, boxShadow: "0px 10px 30px rgba(0,0,0,0.5)" }}
      className={performanceMode === 'ultra' ? "[perspective:2000px]" : ""}
    >
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
            isHovered && performanceMode === 'ultra' ? 'scale-110 blur-sm opacity-60' : isHovered ? 'scale-105 opacity-80' : 'scale-100 blur-0 opacity-100'
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
    </motion.div>
  );
};

const ProjectsSection = ({ mods }: { mods: any[] }) => {
  const { performanceMode } = usePerformance();
  return (
    <section className="py-32 px-8 container mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.5, type: "spring" }}>
          <motion.div initial={{ width: 0 }} whileInView={{ width: "3rem" }} transition={{ delay: 0.5, duration: 1 }} className="flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-dublio-purple rounded-full shrink-0"></div>
            <span className="text-[12px] font-black text-dublio-purple tracking-[0.4em] uppercase whitespace-nowrap">KEŞFET</span>
          </motion.div>
          <motion.h2 initial={performanceMode === 'ultra' ? { opacity: 0, y: 50, filter: "blur(10px)" } : { opacity: 0, y: 20 }} whileInView={performanceMode === 'ultra' ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1.5, type: "spring", bounce: 0.5 }} className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-dublio-cyan to-dublio-purple tracking-tighter mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            GELECEĞİN <br /> PROJELERİNİ YAKALA
          </motion.h2>
        </motion.div>

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

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.4 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {mods.map(mod => (
          <ModCard key={mod.id} {...mod} />
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
