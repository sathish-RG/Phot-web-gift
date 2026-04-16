import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingBar — thin 3px progress bar fixed to the very top of the page.
 * Props:
 *   loaded  — number of images that have finished loading
 *   total   — total number of images to load
 */
export default function LoadingBar({ loaded, total }) {
  const pct = total === 0 ? 100 : Math.round((loaded / total) * 100);
  const allDone = loaded >= total && total > 0;

  return (
    <AnimatePresence>
      {!allDone && (
        <motion.div
          key="loading-bar-track"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
          className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-white/5"
          aria-hidden
        >
          <motion.div
            layoutId="loading-bar-fill"
            className="h-full relative overflow-hidden"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, #a855f7, #ec4899, #fbbf24)",
              boxShadow: "0 0 8px rgba(232,121,249,0.8)",
            }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Travelling glow dot at the leading edge */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm"
              style={{ background: "#f0abfc" }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
