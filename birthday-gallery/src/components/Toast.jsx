import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ToastContainer({ children }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none">
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </div>
  );
}

export default function Toast({ message, onDismiss, duration = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-purple-700 text-white text-xs font-body font-semibold px-4 py-2 rounded-full shadow-xl whitespace-nowrap mb-2 pointer-events-auto"
    >
      ✅ {message}
    </motion.div>
  );
}
