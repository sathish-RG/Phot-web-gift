import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMBO_WINDOW_MS = 5000; // 5 seconds
const COMBO_THRESHOLD = 3;    // 3 hearts

const COMBO_MESSAGES = [
  { count: 3,  label: "COMBO",        emoji: "🔥", suffix: "x3!",  color: "#f97316" },
  { count: 5,  label: "ON FIRE",      emoji: "🎯", suffix: "x5!!",  color: "#ec4899" },
  { count: 10, label: "LEGENDARY",    emoji: "🌟", suffix: "x10!!!",color: "#fbbf24" },
];

function getComboMeta(count) {
  return [...COMBO_MESSAGES].reverse().find((m) => count >= m.count) ?? COMBO_MESSAGES[0];
}

/**
 * ComboTracker
 * Place this inside App. Pass `onExtraPoints` to award bonus when combo fires.
 * Externally, call the returned `registerHeart()` on each heart click.
 */
export default function ComboTracker({ comboCount, visible }) {
  const meta = getComboMeta(comboCount);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="combo-banner"
          initial={{ opacity: 0, scale: 0.5, y: -40 }}
          animate={{
            opacity: 1,
            scale: [1, 1.12, 1],
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.4, y: -30 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="fixed top-20 left-1/2 z-[90] pointer-events-none"
          style={{ transform: "translateX(-50%)" }}
        >
          <div
            className="relative flex flex-col items-center px-6 py-3 rounded-2xl shadow-2xl select-none"
            style={{
              background: `linear-gradient(135deg, ${meta.color}30, ${meta.color}15)`,
              border: `2px solid ${meta.color}60`,
              boxShadow: `0 0 30px ${meta.color}40, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Pulsing glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ border: `2px solid ${meta.color}` }}
            />

            <motion.span
              animate={{ rotate: [-5, 5, -5], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-3xl mb-1"
            >
              {meta.emoji}
            </motion.span>

            <div className="flex items-center gap-2">
              <span
                className="font-display font-extrabold text-xl tracking-wider"
                style={{ color: meta.color, textShadow: `0 0 12px ${meta.color}` }}
              >
                {meta.label}
              </span>
              <span
                className="font-display font-black text-2xl"
                style={{ color: "#fff" }}
              >
                {meta.suffix}
              </span>
            </div>

            <p className="font-body text-xs text-white/60 mt-0.5">
              +{comboCount * 5} bonus points!
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * useComboTracker
 * Hook that manages the heart-tap timestamps and fires combo events.
 * Returns { registerHeart, comboCount, comboVisible }
 */
export function useComboTracker({ onCombo }) {
  const timestampsRef = useRef([]);
  const [comboCount, setComboCount] = useState(0);
  const [comboVisible, setComboVisible] = useState(false);
  const hideTimerRef = useRef(null);

  const registerHeart = useCallback(() => {
    const now = Date.now();
    // Keep only timestamps within the window
    timestampsRef.current = [
      ...timestampsRef.current.filter((t) => now - t < COMBO_WINDOW_MS),
      now,
    ];

    const count = timestampsRef.current.length;
    if (count >= COMBO_THRESHOLD) {
      setComboCount(count);
      setComboVisible(true);
      onCombo?.(count);

      // Auto-hide after 2s
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setComboVisible(false);
        setComboCount(0);
        timestampsRef.current = [];
      }, 2000);
    }
  }, [onCombo]);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  return { registerHeart, comboCount, comboVisible };
}
