import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PointsPopup
 * Renders a floating "+N pts" label at a specific screen position.
 * Props:
 *   popups: Array<{ id, amount, x, y }>
 *   onDone: (id) => void  — called when animation completes
 */
export default function PointsPopup({ popups, onDone }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden>
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 1, y: 0, scale: 0.8, x: "-50%" }}
            animate={{ opacity: 0, y: -80, scale: 1.1, x: "-50%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            onAnimationComplete={() => onDone(popup.id)}
            style={{
              position: "fixed",
              left: popup.x,
              top: popup.y,
            }}
            className="select-none"
          >
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-display font-extrabold text-sm px-3 py-1 rounded-full shadow-xl shadow-yellow-500/40 whitespace-nowrap">
              <span>⭐</span>
              <span>+{popup.amount} pts</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook to manage popup queue — call spawnPopup(amount, event) to trigger.
 */
export function usePointsPopup() {
  const counterRef = useRef(0);

  const spawnPopup = (popups, setPopups) => (amount, event) => {
    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top : window.innerHeight / 2;
    const id = ++counterRef.current;
    setPopups((prev) => [...prev, { id, amount, x, y }]);
  };

  const removePopup = (setPopups) => (id) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  return { spawnPopup, removePopup };
}
