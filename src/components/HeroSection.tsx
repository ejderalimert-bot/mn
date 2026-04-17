"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";

const HeroSection = () => {
  const { performanceMode } = usePerformance();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, -300]);
  const yText = useTransform(scrollY, [0, 800], [0, 400]);
  const opacityText = useTransform(scrollY, [0, 600], [1, 0]);
  const scaleText = useTransform(scrollY, [0, 600], [1, 0.8]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
        size: Math.random() * 4 + 1
      }))
    );
  }, []);

  return (
    <div onMouseMove={performanceMode === 'ultra' ? handleMouseMove : undefined} className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden pt-10 px-8">
      {/* Interactive Spotlight Glow */}
      {performanceMode === 'ultra' && (
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-dublio-cyan/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen"
          style={{ x: spotlightX, y: spotlightY, translateX: "-50%", translateY: "-50%" }}
        />
      )}

      {/* Background Cinematic Particles */}
      {performanceMode === 'ultra' && (
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/40 shadow-[0_0_10px_white]"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>
      )}
      {/* Background elements (Parallax UP) */}
      {performanceMode === 'ultra' && (
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 bg-transparent flex items-center justify-center -space-y-32">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-[1200px] h-[600px] bg-dublio-purple/20 blur-[150px] rounded-full absolute -top-1/4 -right-1/4"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full absolute -bottom-1/4 -left-1/4 opacity-50"
        ></motion.div>

        {/* Floating 3D Objects */}
        <motion.div animate={{ y: [0, -50, 0], rotateX: [0, 360], rotateY: [0, 180] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute left-[10%] top-[20%] w-32 h-32 border-[1px] border-dublio-cyan/20 rounded-3xl [transform-style:preserve-3d] shadow-[0_0_50px_rgba(106,255,235,0.1)]"></motion.div>
        <motion.div animate={{ y: [0, 60, 0], rotateX: [0, -360], rotateZ: [0, 180] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute right-[15%] bottom-[30%] w-24 h-24 border-[1px] border-dublio-purple/20 rounded-full [transform-style:preserve-3d] shadow-[0_0_50px_rgba(168,85,247,0.1)]"></motion.div>

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>
        </motion.div>
      )}

      {/* Main Content (Parallax DOWN and Fade out) */}
      {/* Main Content (Parallax DOWN and Fade out) */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{ y: performanceMode === 'ultra' ? yText : 0, opacity: performanceMode === 'ultra' ? opacityText : 1, scale: performanceMode === 'ultra' ? scaleText : 1 }}
        variants={{ visible: { transition: { staggerChildren: performanceMode === 'ultra' ? 0.15 : 0 } } }}
        className={`container relative z-10 flex flex-col items-center text-center max-w-5xl mt-10 ${performanceMode === 'ultra' ? '[perspective:2000px]' : ''}`}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6 } } }} className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-dublio-cyan rounded-full shadow-[0_0_8px_#6affeb] animate-pulse"></span>
          <span className="text-[11px] font-bold text-dublio-text-dark tracking-[0.2em] uppercase">Star Dublaj Studios</span>
        </motion.div>

        <motion.h1 variants={{ hidden: { opacity: 0, scale: 0.6, rotateX: performanceMode === 'ultra' ? 90 : 0 }, visible: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 100, damping: 10 } } }} className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter uppercase italic drop-shadow-2xl relative group">
          TÜRKİYENİN<br />
          <motion.span
            animate={performanceMode === 'ultra' ? { skewX: [0, -10, 5, 0], x: [0, 5, -5, 0], color: ['#fff', '#ec4899', '#6affeb', '#fff'] } : {}}
            transition={{ repeat: Infinity, duration: 4, ease: "linear", repeatDelay: 2 }}
            className={`inline-block dublio-gradient-text ${performanceMode === 'ultra' ? 'drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]' : ''}`}
          >
            DUBLAJ&nbsp; MERKEZİ
          </motion.span>
        </motion.h1>

        <motion.p variants={{ hidden: { opacity: 0, y: 30, rotateX: performanceMode === 'ultra' ? -45 : 0 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 120 } } }} className="text-xl md:text-2xl text-dublio-text-dark max-w-3xl mb-12 font-medium">
          Video Dublajları tek çatı altında. <br />
          Oyun modlarını keşfetmeye hazırlan!!!
        </motion.p>

        <motion.div variants={{ hidden: { opacity: 0, y: 40, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.7 } } }} className="flex flex-col sm:flex-row gap-5 mb-24 min-w-[300px]">
          <button className="relative overflow-hidden group px-10 py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-110 active:scale-95 transition-[transform] shadow-[0_10px_50px_rgba(255,255,255,0.4)]">
            <span className="relative z-10 w-full flex items-center justify-center">VİDEOLARI KEŞFET</span>
            <div className="absolute inset-0 h-full w-0 bg-gray-300 transition-all duration-300 ease-out group-hover:w-full"></div>
          </button>
          <button className="relative overflow-hidden group px-10 py-5 bg-dublio-light/50 border border-white/10 text-white font-black text-xl rounded-2xl hover:scale-110 transition-[transform] backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="relative z-10 w-full flex items-center justify-center">MODLARI KEŞFET</span>
            <div className="absolute inset-0 h-full w-0 bg-dublio-purple/30 transition-all duration-300 ease-out group-hover:w-full"></div>
          </button>
        </motion.div>

      </motion.div>

      {/* Marquee effect at bottom (TILTED 3D) */}
      <div className={`w-full mt-32 relative flex justify-center z-10 pointer-events-none ${performanceMode === 'ultra' ? '[perspective:1000px]' : 'overflow-hidden'}`}>
        <div className={`w-[150vw] bg-[#1d1d1f] border-y-4 border-dublio-cyan py-8 overflow-hidden whitespace-nowrap ${performanceMode === 'ultra' ? 'shadow-[0_0_100px_rgba(106,255,235,0.2)]' : ''}`} style={{ transform: performanceMode === 'ultra' ? 'rotateX(50deg) rotateZ(-5deg)' : 'none' }}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-20"
          >
            {[...Array(20)].map((_, i) => (
              <span key={i} className="text-8xl font-black text-white/5 tracking-widest uppercase italic">
                STAR DUBLAJ • MODLAR • DUBLAJ • SEO • STAR DUBLAJ • MODLAR • DUBLAJ • SEO
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
