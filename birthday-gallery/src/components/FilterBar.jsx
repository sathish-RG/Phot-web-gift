import { motion } from "framer-motion";
import { tags } from "../data/photos";

const TAG_ICONS = {
  All: "✨",
  "Best Friend": "💜",
  Family: "🏠",
  Colleague: "💼",
};

export default function FilterBar({ activeTag, onTagChange }) {
  return (
    <div className="sticky top-[60px] z-[40] glass border-b border-purple-500/10 mb-8 w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="flex flex-nowrap items-center gap-2 px-4 py-3 w-max mx-auto md:mx-0">
        <span className="text-xs font-body font-semibold text-purple-400/70 mr-2 whitespace-nowrap shrink-0">
          Filter by:
        </span>
          {tags.map((tag) => (
            <motion.button
              key={tag}
              id={`filter-btn-${tag.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => onTagChange(tag)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative shrink-0 flex items-center justify-center min-h-[44px] gap-1.5 px-4 rounded-full text-sm font-body font-semibold
                transition-all duration-300 whitespace-nowrap cursor-pointer
                ${
                  activeTag === tag
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
                    : "bg-white/5 text-purple-300 hover:bg-white/10 border border-purple-500/20"
                }
              `}
            >
              <span>{TAG_ICONS[tag] || "🏷️"}</span>
              <span>{tag}</span>
              {activeTag === tag && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-purple-600 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
  );
}
