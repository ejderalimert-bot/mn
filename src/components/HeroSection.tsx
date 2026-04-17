"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { usePerformance } from "@/context/PerformanceContext";
import { Sparkles, Gamepad2, Mic2, PlayCircle } from 'lucide-react';

const HeroSection = () => {
  const { performanceMode } = usePerformance();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, -400]);
  const yText = useTransform(scrollY, [0, 800], [0, 600]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 2,
        color: ['#ff00ff', '#00ffff', '#7000ff', '#ffffff'][Math.floor(Math.random() * 4)]
      }))
    );
  }, []);

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-[120vh] w-full flex flex-col items-center justify-center overflow-hidden bg-black [perspective:1000px]">
      
      {/* AGRESİF MOUSE SPOTLIGHT */}
      <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-red-500/30 blur-[200px] rounded-full pointer-events-none z-10 mix-blend-screen"
        style={{ x: spotlightX, y: spotlightY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* DEVASA NEON ORBLAR */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.5, 1] }} 
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-dublio-cyan/20 blur-[250px] mix-blend-screen rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1.5, 1, 1.5] }} 
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute bottom-[-30%] right-[-10%] w-[1500px] h-[1500px] bg-dublio-purple/30 blur-[300px] mix-blend-screen rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/30 blur-[200px] mix-blend-screen rounded-full"
        />
      </motion.div>

      {/* AŞIRI DÖNEN 3D KÜPLER VE OBJELER */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 [transform-style:preserve-3d]">
        <motion.div 
          animate={{ rotateX: 360, rotateY: 360, rotateZ: 360 }} 
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute top-[20%] left-[10%] w-48 h-48 border-[4px] border-dublio-cyan/40 shadow-[0_0_100px_cyan] rounded-[3rem] bg-cyan-500/10 backdrop-blur-3xl"
        />
        <motion.div 
          animate={{ rotateX: -360, rotateY: 360, scale: [1, 1.5, 1] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute bottom-[20%] right-[15%] w-64 h-64 border-[4px] border-dublio-purple/40 shadow-[0_0_150px_purple] rounded-full bg-purple-500/10 backdrop-blur-3xl flex items-center justify-center"
        >
           <Gamepad2 className="w-32 h-32 text-dublio-purple opacity-50" />
        </motion.div>
        <motion.div 
          animate={{ rotateX: 360, rotateZ: -360 }} 
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute top-[40%] right-[30%] w-32 h-32 border-[2px] border-pink-500/60 shadow-[0_0_80px_#ec4899] rounded-lg bg-pink-500/5 backdrop-blur-md"
        />
      </motion.div>

      {/* AGRESİF PARÇACIK FIRTINASI */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden [perspective:500px]">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ 
              width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 5}px ${p.color}, 0 0 ${p.size * 10}px ${p.color}`
            }}
            animate={{
              z: [0, 1000],
              y: [0, -1500],
              opacity: [0, 1, 0],
              rotateX: [0, 360]
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          />
        ))}
      </div>

      {/* MERKEZ METİNLER VE 3D TİLT */}
      <motion.div
        style={{ y: yText, rotateX: 15 }}
        className="container relative z-20 flex flex-col items-center text-center [transform-style:preserve-3d]"
      >
        <motion.div 
          animate={{ rotateY: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="inline-flex items-center gap-3 px-8 py-3 bg-black/50 border-[2px] border-dublio-cyan/50 rounded-full mb-12 shadow-[0_0_50px_cyan] backdrop-blur-xl"
        >
          <Sparkles className="w-6 h-6 text-dublio-cyan animate-spin" />
          <span className="text-lg font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_0_10px_white]">Star Dublaj Stüdyo</span>
        </motion.div>

        <motion.h1 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-[6rem] md:text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-dublio-cyan to-dublio-purple leading-[0.9] tracking-tighter mb-8 drop-shadow-[0_20px_100px_rgba(106,255,235,0.8)] [transform:translateZ(100px)]"
        >
          MAKSİMUM
          <br />
          <span className="text-white drop-shadow-[0_0_50px_purple] italic">DENEYİM</span>
        </motion.h1>

        <p className="text-2xl md:text-4xl text-white font-black max-w-4xl leading-relaxed mb-16 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] [transform:translateZ(50px)]">
          BEYNİNİZİ YAKACAK DUBLAJ MODLARI VE <span className="text-dublio-cyan animate-pulse">AĞIR NEON</span> PERFORMANSI BURADA.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 [transform:translateZ(150px)]">
          <Link href="/mods">
            <motion.button 
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.8, rotate: 10 }}
              animate={{ boxShadow: ["0px 0px 0px cyan", "0px 0px 100px cyan", "0px 0px 0px cyan"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-12 py-6 bg-dublio-cyan text-black text-2xl font-black rounded-3xl uppercase tracking-widest flex items-center gap-4 relative overflow-hidden"
            >
              <Mic2 className="w-8 h-8 animate-bounce" />
              SİSTEME GİRİŞ YAP
            </motion.button>
          </Link>
          
          <Link href="/news">
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.8, rotate: -10 }}
              animate={{ boxShadow: ["0px 0px 0px purple", "0px 0px 100px purple", "0px 0px 0px purple"] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
              className="px-12 py-6 bg-transparent border-4 border-dublio-purple text-dublio-purple text-2xl font-black rounded-3xl uppercase tracking-widest flex items-center gap-4 backdrop-blur-xl"
            >
              <PlayCircle className="w-8 h-8 animate-pulse" />
              YIKICI HABERLER
            </motion.button>
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default HeroSection;
