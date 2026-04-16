import { motion } from "framer-motion";
import { Star, Zap, Award } from "lucide-react";
import { getLevelInfo } from "../store/gameStore";

export default function Navbar({ points, streak, level }) {
  const { emoji, color } = getLevelInfo(points);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="navbar fixed top-0 left-0 right-0 w-full z-[1000] overflow-hidden glass border-b border-purple-500/20"
      style={{ height: "var(--navbar-height)" }}
    >
      <div className="flex items-center justify-between h-full px-4 w-full max-w-[100vw] mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink overflow-hidden">
          <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="text-2xl select-none"
            >
              🎂
            </motion.div>
          <div className="overflow-hidden">
            <h1 className="font-display font-bold text-base sm:text-lg leading-none shimmer-text truncate max-w-[120px] sm:max-w-none">
              BirthdayGallery
            </h1>
            <p className="text-[10px] sm:text-xs text-purple-300/70 font-body truncate">Wishes & Memories</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0 ml-2">

            {/* Level badge */}
            <motion.div
              key={level}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06 }}
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 border"
              style={{
                background: `${color}18`,
                borderColor: `${color}45`,
              }}
              title={level}
            >
              <span className="text-sm select-none">{emoji}</span>
              <span
                className="text-xs font-body font-bold truncate max-w-[80px]"
                style={{ color }}
              >
                {level}
              </span>
            </motion.div>

            {/* Streak flame */}
            <motion.div
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-1 shrink-0 bg-orange-900/40 border border-orange-500/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
            title={`${streak}-day streak`}
          >
              <motion.span
                animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-sm select-none"
              >
                🔥
              </motion.span>
              <span className="text-[11px] sm:text-xs font-body font-bold text-orange-200">{streak}</span>
            </motion.div>

            {/* Points */}
          <motion.div
            key={points}
            initial={{ scale: 1.25, backgroundColor: "rgba(234,179,8,0.3)" }}
            animate={{ scale: 1, backgroundColor: "rgba(113,63,18,0.4)" }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-1 shrink-0 border border-yellow-500/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
          >
            <Star size={13} className="text-yellow-400 fill-yellow-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-body font-bold text-yellow-200">
              {points}
              <span className="hidden sm:inline font-normal text-yellow-400/70"> pts</span>
            </span>
          </motion.div>

        </div>
      </div>
    </motion.nav>
  );
}
