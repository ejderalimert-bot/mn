"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp, Terminal } from "lucide-react";

export default function SiteInnovations() {
  // 1. Scroll Indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 2. Dynamic Tab Title
  useEffect(() => {
    let originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Geri Dön, Kayıt Başlıyor! 🎙️";
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 3. Back to Top Button
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // 4. Matrix Easter Egg (Konami Code)
  const [matrixMode, setMatrixMode] = useState(false);
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setMatrixMode(prev => !prev);
          konamiIndex = 0;
          // Trigger a global glow
          if (!matrixMode) {
            document.body.style.filter = "hue-rotate(90deg) contrast(1.2)";
            document.body.style.transition = "filter 0.5s ease";
          } else {
            document.body.style.filter = "none";
          }
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [matrixMode]);

  // 5. Global Hover Sounds
  useEffect(() => {
    const playHoverSound = () => {
       // A very gentle, quiet tick (synthesized via Web Audio API)
       try {
         const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
         const oscillator = audioCtx.createOscillator();
         const gainNode = audioCtx.createGain();
         
         oscillator.type = "sine";
         oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // high pitch tick
         oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
         
         gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime); // super quiet
         gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
         
         oscillator.connect(gainNode);
         gainNode.connect(audioCtx.destination);
         
         oscillator.start();
         oscillator.stop(audioCtx.currentTime + 0.05);
       } catch(e) {}
    };

    const addHoverToLinksAndButtons = () => {
      const elements = document.querySelectorAll('a, button');
      elements.forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
      });
    };

    // run once after render
    setTimeout(addHoverToLinksAndButtons, 1000);

    return () => {
      const elements = document.querySelectorAll('a, button');
      elements.forEach(el => {
        el.removeEventListener('mouseenter', playHoverSound);
      });
    };
  }, []);

  return (
    <>
      {/* Top Scroll Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-dublio-cyan to-dublio-purple z-[9999] origin-left shadow-[0_0_15px_cyan]"
        style={{ scaleX }}
      />

      {/* Back to Top */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            whileHover={{ scale: 1.1, y: -5, boxShadow: "0 0 20px cyan" }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[9000] p-4 bg-black/80 backdrop-blur-md border border-white/10 text-dublio-cyan rounded-full hover:text-white transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Secret Matrix Indicator */}
      <AnimatePresence>
        {matrixMode && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-2 bg-green-500/20 border border-green-500 text-green-500 font-mono font-bold rounded-full backdrop-blur-md flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> SYSTEM OVERRIDE: MATRIX MODE ACTIVE
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
