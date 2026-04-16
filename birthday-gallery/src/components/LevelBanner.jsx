import { motion } from "framer-motion";
import { LEVELS, getLevelInfo } from "../store/gameStore";

export default function LevelBanner({ points }) {
  const { label, emoji, color, progress, pointsToNext, nextLvl } = getLevelInfo(points);
  const levelIndex = LEVELS.findIndex((l) => l.label === label);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
    >
      <div
        className="relative rounded-2xl p-4 sm:p-5 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}18 0%, rgba(13,7,20,0.6) 100%)`,
          border: `1px solid ${color}35`,
          boxShadow: `0 4px 24px ${color}15`,
        }}
      >
        {/* Background glow blob */}
        <div
          className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ background: `${color}20` }}
        />

        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left side — level info */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
              className="text-3xl sm:text-4xl select-none"
            >
              {emoji}
            </motion.div>
            <div>
              <p className="text-xs font-body font-semibold text-white/40 uppercase tracking-widest mb-0.5">
                Current Level
              </p>
              <h3
                className="font-display font-extrabold text-lg sm:text-xl leading-tight"
                style={{ color }}
              >
                {label}
              </h3>
            </div>
          </div>

          {/* Right side — points */}
          <div className="text-right">
            <motion.p
              key={points}
              initial={{ scale: 1.3, color: "#fbbf24" }}
              animate={{ scale: 1, color: "#fff" }}
              transition={{ duration: 0.4 }}
              className="font-display font-bold text-2xl text-white"
            >
              {points}
              <span className="text-sm font-body font-normal text-white/40 ml-1">pts</span>
            </motion.p>
            {pointsToNext > 0 && (
              <p className="text-xs font-body text-white/40">
                {pointsToNext} to {nextLvl?.label}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex gap-1.5">
              {LEVELS.map((l, i) => (
                <div
                  key={l.label}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i <= levelIndex ? "scale-110" : "opacity-20"
                  }`}
                  style={{ background: i <= levelIndex ? color : "#fff" }}
                  title={l.label}
                />
              ))}
            </div>
            <span className="text-xs font-body font-semibold" style={{ color }}>
              {progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full relative"
              style={{ background: `linear-gradient(90deg, ${color}90, ${color})` }}
            >
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
            </motion.div>
          </div>
          {nextLvl && (
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/30 font-body">{label}</span>
              <span className="text-xs text-white/30 font-body">
                {nextLvl.emoji} {nextLvl.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
