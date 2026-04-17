"use client";

import { motion } from "framer-motion";

const QUOTES = [
  "Bir adamın kaderi, kendi yolunda yürümektir. - Witcher 3",
  "Savaş... Savaş hiç değişmez. - Fallout",
  "Uyan samuray! Yakacak bir şehrimiz var. - Cyberpunk 2077",
  "Güç, sana ne yapacağını söylemez. Sadece ne yapabileceğini gösterir. - Dishonored",
  "Zamanında orada olsaydın, her şey farklı olurdu. - Max Payne",
  "Sadece cesareti olanlar efsane olur. - Assassin's Creed"
];

export default function QuoteCarousel() {
  return (
    <div className="w-full bg-dublio-purple/10 border-b border-dublio-purple/20 overflow-hidden relative z-40 h-10 flex items-center">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="flex whitespace-nowrap gap-16 px-4"
      >
        {/* Repeat the quotes a few times to create infinite loop effect */}
        {[...QUOTES, ...QUOTES, ...QUOTES].map((quote, i) => (
          <div key={i} className="text-dublio-purple text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-dublio-cyan animate-pulse"></span>
            {quote}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
