import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";

const EMOJIS = ["🎂", "😍", "🥳", "💖"];

export default function ReactionBar({ photoId }) {
  const { reactions, addReaction } = useGameStore();
  const photoReactions = reactions[photoId] || {};
  
  // Track flying emojis: { id, emoji }
  const [flyingEmojis, setFlyingEmojis] = useState([]);
  const [flyCounter, setFlyCounter] = useState(0);

  const handleReact = (e, emoji) => {
    e.stopPropagation(); // prevent flipping the card
    addReaction(photoId, emoji);
    
    // Spawn a flying emoji
    const id = flyCounter;
    setFlyCounter(c => c + 1);
    setFlyingEmojis(prev => [...prev, { id, emoji }]);
    
    // Remove it after animation
    setTimeout(() => {
      setFlyingEmojis(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  return (
    <div className="relative mt-2 flex items-center justify-between bg-purple-950/40 rounded-xl p-1 sm:p-1.5 border border-purple-500/20 w-full overflow-hidden">
      {/* Flying emojis layer */}
      <div className="absolute inset-x-0 bottom-full pointer-events-none h-24 overflow-visible">
        <AnimatePresence>
          {flyingEmojis.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0, 
                y: -60 - Math.random() * 20, 
                x: (Math.random() - 0.5) * 30,
                scale: 1.5 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-2xl"
            >
              {f.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {EMOJIS.map(emoji => {
        const count = photoReactions[emoji] || 0;
        return (
          <motion.button
            key={emoji}
            onClick={(e) => handleReact(e, emoji)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            className="flex items-center justify-center min-w-[36px] min-h-[36px] px-1 rounded-lg hover:bg-purple-800/40 transition-colors cursor-pointer select-none shrink-0"
          >
            <span className="text-[16px] sm:text-xl leading-none">{emoji}</span>
            <motion.span 
              key={count} // re-animate on change
              initial={{ scale: 1.5, color: "#fbbf24" }}
              animate={{ scale: 1, color: "#e9d5ff" }}
              className="text-xs font-body font-bold text-purple-200"
            >
              {count > 0 ? count : ""}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}
