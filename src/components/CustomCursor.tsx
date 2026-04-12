"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const innerSpringConfig = { damping: 15, stiffness: 800, mass: 0.1 };
  const innerXSpring = useSpring(cursorX, innerSpringConfig);
  const innerYSpring = useSpring(cursorY, innerSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const mouseOut = () => setIsVisible(false);
    const mouseOver = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", mouseOut);
    document.addEventListener("mouseenter", mouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", mouseOut);
      document.removeEventListener("mouseenter", mouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-[3px] border-dublio-cyan pointer-events-none z-[99999] shadow-[0_0_15px_#6affeb] blur-[1px]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-dublio-purple pointer-events-none z-[99999] shadow-[0_0_20px_10px_rgba(168,85,247,0.8)]"
        style={{
          x: innerXSpring,
          y: innerYSpring,
          translateX: "10px",
          translateY: "10px",
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
