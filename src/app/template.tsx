"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(15px)", scale: 0.95, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1, rotateX: 0 }}
      transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.4 }}
      className="w-full min-h-screen [perspective:2000px]"
    >
      {children}
    </motion.div>
  );
}
