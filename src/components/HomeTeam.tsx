"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeTeam({ teamMembers }: { teamMembers: any[] }) {
  if (!teamMembers || teamMembers.length === 0) return null;

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#161313] border-t border-white/5">
      <div className="container mx-auto relative z-10 max-w-6xl text-center">
        <div className="flex flex-col items-center justify-center text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dublio-cyan/20 blur-[100px] pointer-events-none rounded-full" />
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-dublio-cyan to-dublio-purple tracking-tighter mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4">
            <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-dublio-cyan" />
            EKİBİMİZ
          </h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={{ hidden: { opacity: 0, scale: 0.4, y: 150, rotateX: -90 }, visible: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { type: "spring", bounce: 0.6, duration: 2 } } }}
              whileHover={{ y: -10, rotateX: 5, rotateY: 10, scale: 1.1 }}
              className="[perspective:1500px]"
            >
            <Link href={`/user/${member.userId}`} className="bg-[#1a1c23] border border-white/10 hover:border-dublio-cyan rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg transition-colors group relative overflow-hidden h-full">
               <div className="absolute inset-0 bg-gradient-to-b from-dublio-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <img 
                 src={member.user?.image || '/globe.svg'} 
                 alt={member.user?.name} 
                 className="w-24 h-24 rounded-full object-cover bg-black p-1 border-2 border-white/10 group-hover:border-dublio-cyan transition-colors mb-4 relative z-10"
               />
               <span className="text-lg font-black text-white relative z-10 truncate w-full group-hover:text-dublio-cyan transition-colors">{member.user?.name}</span>
               
               <div className="flex flex-wrap items-center justify-center gap-2 mt-2 max-w-full">
                 {member.roleTitle?.split(',').map((role: string, idx: number) => (
                   <span key={idx} className="text-[10px] font-black text-dublio-cyan/80 tracking-widest uppercase relative z-10 border border-dublio-cyan/30 bg-dublio-cyan/10 px-2 py-1 rounded truncate max-w-full">
                     {role.trim()}
                   </span>
                 ))}
               </div>
             </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
