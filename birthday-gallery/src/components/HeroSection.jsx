import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import useTypewriter from "../hooks/useTypewriter";
import { useMemo } from "react";

function Balloon({ emoji, delay, left, duration }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{ duration, delay, ease: "easeInOut", repeat: Infinity }}
      style={{ left: `${left}%`, willChange: "transform" }}
      className="absolute text-5xl pointer-events-none drop-shadow-md z-0"
    >
      {emoji}
    </motion.div>
  );
}

function SparkleStar({ delay, left, top }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ left: `${left}%`, top: `${top}%` }}
      className="absolute pointer-events-none text-yellow-300 z-0 text-xl"
    >
      ✨
    </motion.div>
  );
}

export default function HeroSection({ totalPhotos, filteredCount }) {
  const typedText = useTypewriter("Happy Birthday!", 100);

  const balloons = useMemo(() => [
    { emoji: "🎈", left: 15, delay: 0, duration: 3.2 },
    { emoji: "🎈", left: 80, delay: 1.5, duration: 2.5 },
    { emoji: "🎈", left: 30, delay: 0.5, duration: 4 },
    { emoji: "🎈", left: 70, delay: 2, duration: 3 },
    { emoji: "🎈", left: 50, delay: 1, duration: 3.8 },
  ], []);

  const sparkles = useMemo(() => [
    { left: 10, top: 20, delay: 0 },
    { left: 85, top: 40, delay: 1 },
    { left: 20, top: 70, delay: 0.5 },
    { left: 75, top: 80, delay: 1.5 },
    { left: 40, top: 10, delay: 0.8 },
  ], []);

  return (
    <div className="relative py-6 px-4 text-center overflow-hidden w-full max-w-[100vw] box-border min-h-[300px]">
      {/* Background balloons and sparkles */}
      {balloons.map((b, i) => (
        <Balloon key={`b-${i}`} {...b} />
      ))}
      {sparkles.map((s, i) => (
        <SparkleStar key={`s-${i}`} {...s} />
      ))}

      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,121,249,0.15) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full"
      >
        {/* Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-purple-900/50 border border-purple-500/40 rounded-full px-4 min-h-[44px] mb-6 text-sm font-body font-semibold text-purple-300"
        >
          <Sparkles size={14} className="text-yellow-400" />
          Celebrate Together
          <Heart size={14} className="text-pink-400 fill-pink-400" />
        </motion.div>

        {/* Headline */}
        <h2 
          className="font-display font-extrabold leading-tight mb-4 min-h-[1.2em] break-words"
          style={{ fontSize: "clamp(1.4rem, 5vw, 2.5rem)" }}
        >
          <span className="shimmer-text">{typedText}</span>
          <span className="animate-pulse ml-1 text-pink-400" style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)" }}>|</span>
          <br />
          <span className="text-white">Wishes Gallery</span>
        </h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-body text-purple-200/80 max-w-xl mx-auto leading-relaxed mb-8 break-words"
          style={{ fontSize: "clamp(0.85rem, 3vw, 1.1rem)" }}
        >
          A heartfelt collection of birthday wishes, memories, and love for the
          special people in your life. ❤️
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 sm:gap-10"
        >
          <div className="text-center">
            <div className="font-display font-bold text-3xl shimmer-text">
              {filteredCount}
            </div>
            <div className="text-xs text-purple-300/60 font-body mt-0.5">Shown</div>
          </div>
          <div className="w-px h-10 bg-purple-500/30" />
          <div className="text-center">
            <div className="font-display font-bold text-3xl text-white">
              {totalPhotos}
            </div>
            <div className="text-xs text-purple-300/60 font-body mt-0.5">Total Wishes</div>
          </div>
          <div className="w-px h-10 bg-purple-500/30" />
          <div className="text-center">
            <div className="text-2xl">🎂</div>
            <div className="text-xs text-purple-300/60 font-body mt-0.5">Celebrate</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
