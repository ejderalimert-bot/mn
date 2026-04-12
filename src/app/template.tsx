"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePerformance } from "@/context/PerformanceContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { performanceMode } = usePerformance();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-dublio-cyan via-pink-500 to-dublio-purple origin-left z-[99999] shadow-[0_0_20px_#ec4899] mix-blend-screen"
        style={{ scaleX }}
      />
      
      {performanceMode === 'ultra' && (
        <>
          <motion.div initial={{ height: "100vh", bottom: 0 }} animate={{ height: 0, bottom: "100vh" }} transition={{ duration: 1.2, ease: [0.77, 0, 0.17, 1], delay: 0.0 }} className="fixed left-0 w-1/3 bg-dublio-purple z-[99998] shadow-2xl" />
          <motion.div initial={{ height: "100vh", bottom: 0 }} animate={{ height: 0, bottom: "100vh" }} transition={{ duration: 1.2, ease: [0.77, 0, 0.17, 1], delay: 0.1 }} className="fixed left-[33.33%] w-1/3 bg-pink-500 z-[99998] shadow-[0_0_50px_#ec4899]" />
          <motion.div initial={{ height: "100vh", bottom: 0 }} animate={{ height: 0, bottom: "100vh" }} transition={{ duration: 1.2, ease: [0.77, 0, 0.17, 1], delay: 0.2 }} className="fixed right-0 w-1/3 bg-dublio-cyan z-[99998] shadow-[0_0_50px_#6affeb]" />
        </>
      )}

      {performanceMode === 'ultra' ? (
        <motion.div
          initial={{ opacity: 0, y: 150, filter: "blur(30px)", scale: 0.8, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1, rotateX: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="w-full min-h-screen [perspective:3000px] overflow-hidden"
        >
          {children}
        </motion.div>
      ) : (
        <div className="w-full min-h-screen">
          {children}
        </div>
      )}
    </>
  );
}
