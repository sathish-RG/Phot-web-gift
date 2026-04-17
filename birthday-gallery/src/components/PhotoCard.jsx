import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Quote, Lock, Unlock, X, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import SkeletonCard from "./SkeletonCard";
import useInView from "../hooks/useInView";
import ScratchCard from "./ScratchCard";
import ReactionBar from "./ReactionBar";
import Toast, { ToastContainer } from "./Toast";
import { useGameStore } from "../store/gameStore";

// ─── Tag styles ──────────────────────────────────────────────────────────────
const TAG_COLORS = {
  "Best Friend": { bg: "bg-purple-900/50", text: "text-purple-300", border: "border-purple-500/40" },
  Family:        { bg: "bg-pink-900/50",   text: "text-pink-300",   border: "border-pink-500/40"   },
  Colleague:     { bg: "bg-blue-900/50",   text: "text-blue-300",   border: "border-blue-500/40"   },
};

const TAG_ICONS = { "Best Friend": "💜", Family: "🏠", Colleague: "💼" };

// ─── Birthday-cake error fallback (pure CSS/Tailwind) ────────────────────────
function CakeFallback({ name }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-950/80 gap-3 p-4">
      {/* Illustration */}
      <div className="flex flex-col items-center gap-1 select-none">
        {/* Candles */}
        <div className="flex gap-2">
          {["#e879f9", "#fbbf24", "#f472b6"].map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div
                className="w-1.5 h-2.5 rounded-full"
                style={{ background: `radial-gradient(circle, #ffe066 30%, ${c} 100%)`, filter: "blur(0.5px)" }}
              />
              <div className="w-0.5 h-2 rounded-full bg-gray-600" />
            </div>
          ))}
        </div>
        {/* Cake body */}
        <div className="flex flex-col items-center mt-1">
          <div
            className="w-20 h-8 rounded-t-xl flex items-center justify-center text-white/80 text-xs font-body font-bold"
            style={{ background: "linear-gradient(135deg, #9333ea, #c026d3)" }}
          >
            🎂
          </div>
          <div
            className="w-28 h-10 rounded-b-xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a21caf)" }}
          />
          <div className="w-32 h-2 rounded-full bg-purple-800/60 mt-0.5" />
        </div>
      </div>
      <p className="font-body text-purple-300/80 text-xs text-center">
        {name ? `Couldn't load ${name}'s photo` : "Couldn't load photo"}
      </p>
      <p className="text-lg">🎈</p>
    </div>
  );
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────
export default function PhotoCard({ photo, isLiked, onToggleLike, onLikeEvent, onImageLoad, onDeleteEvent, index }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError]   = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZoomed, setIsZoomed]   = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const isProd = import.meta.env.PROD;
  
  // Game state for mystery logic
  const { points, unlockedCards, unlockCard } = useGameStore();
  const isUnlocked = unlockedCards.includes(photo.id);
  const isMystery = photo.mystery && !isUnlocked;
  const [unlockBurst, setUnlockBurst] = useState(false);

  // Only inject <img> src once the card is near the viewport
  const [cardRef, inView] = useInView({ rootMargin: "250px 0px" });

  const tagStyle = TAG_COLORS[photo.tag] ?? {
    bg: "bg-gray-900/50", text: "text-gray-300", border: "border-gray-500/40",
  };

  // ── Handlers ──
  const handleLoad = () => {
    setIsLoading(false);
    onImageLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onImageLoad?.();
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isLiked) onLikeEvent?.(e);
    onToggleLike(photo.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: `Happy Birthday ${photo.name}!`, text: photo.wish, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Happy Birthday ${photo.name}! "${photo.wish}"`).catch(() => {});
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this photo?")) {
      onDeleteEvent?.(photo.id);
    }
  };

  const handleFlip = () => {
    // Only allow flip if not a mystery card
    if (!isMystery) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleUnlockClick = (e) => {
    e.stopPropagation();
    if (points >= 50) {
      // Trigger unlock logic
      const success = unlockCard(photo.id);
      if (success) {
        setUnlockBurst(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#fbbf24"]
        });
        setTimeout(() => setUnlockBurst(false), 1000);
      }
    }
  };

  // ── Render skeleton while not in view yet ──
  if (!inView) {
    return (
      <div ref={cardRef}>
        <SkeletonCard />
      </div>
    );
  }

  // ── Render normal static image if type is normal ──
  if (photo.type === "normal") {
    return (
      <motion.article
        ref={cardRef}
        id={`photo-card-${photo.id}`}
        layout
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        whileHover={{ y: -6, scale: 1.015 }}
        className="relative group w-full min-w-0 box-border cursor-pointer aspect-square rounded-2xl overflow-hidden glass-card flex flex-col"
        style={{ 
          boxShadow: isLiked ? `0 0 30px ${photo.color}30, 0 4px 24px rgba(0,0,0,0.4)` : "0 4px 24px rgba(0,0,0,0.4)",
          border: isLiked ? `1px solid ${photo.color}40` : "1px solid rgba(232, 121, 249, 0.15)",
        }}
        onClick={() => setIsZoomed(true)}
      >
        <div className="relative flex-1 bg-purple-950/50 overflow-hidden">
          <AnimatePresence>
            {isLoading && !hasError && (
              <motion.div key="skeleton" className="absolute inset-0 z-10" exit={{ opacity: 0, transition: { duration: 0.35 } }}>
                <SkeletonCard />
              </motion.div>
            )}
          </AnimatePresence>

          {hasError && <CakeFallback name={photo.name} />}

          {!hasError && (
            <motion.img
              src={photo.image}
              alt={`Photo for ${photo.name}`}
              loading="lazy"
              decoding="async"
              onLoad={handleLoad}
              onError={handleError}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {!isLoading && !hasError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          )}

          {!isLoading && (
            <>
              <div className="absolute top-2 left-2 z-[20] pr-12">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-body font-semibold ${tagStyle.bg} ${tagStyle.text} border ${tagStyle.border} backdrop-blur-sm truncate max-w-full`}>
                  <span className="text-[10px] shrink-0">{TAG_ICONS[photo.tag]}</span>
                  <span className="truncate">{photo.tag}</span>
                </span>
              </div>

              <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-[20]">
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                    isLiked ? "bg-pink-500/80 border-pink-400/50 shadow-lg shadow-pink-500/40" : "bg-black/40 border-white/20 hover:bg-pink-500/40"
                  }`}
                  aria-label={isLiked ? "Unlike" : "Like"}
                >
                  <Heart size={18} className={`transition-all duration-300 ${isLiked ? "fill-white text-white" : "text-white"}`} />
                </motion.button>

                {!isProd && (
                  <motion.button
                    onClick={handleDelete}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 border border-white/20 backdrop-blur-sm hover:bg-red-500/80 transition-all duration-300 cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} className="text-white" />
                  </motion.button>
                )}
              </div>

              <div className="absolute bottom-2 left-2 right-2 z-[20] flex items-center justify-between pointer-events-none gap-2">
                <p className="font-display font-bold text-base sm:text-lg text-white drop-shadow-md truncate">
                  {photo.name}
                </p>
              </div>
            </>
          )}
          
          {isLiked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: `inset 0 0 20px ${photo.color}20` }}
            />
          )}
        </div>

        {/* Lightbox / Zoom Modal for Normal Card */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isZoomed && (
              <motion.div
                key={`zoom-modal-${photo.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 cursor-default"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              >
                <button 
                  className="absolute top-4 right-4 sm:top-8 sm:right-8 w-11 h-11 bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors cursor-pointer z-[10000]"
                  onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                >
                  <X size={22} />
                </button>
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={photo.image}
                  alt={photo.name}
                  className="max-w-full max-h-[85dvh] object-contain rounded-xl shadow-2xl relative z-50"
                  onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={cardRef}
      id={`photo-card-${photo.id}`}
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="flip-wrapper group w-full min-w-0 box-border cursor-pointer"
    >
      <div 
        className="flip-inner"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)" }}
      >
        {/* =========================================================================
            FRONT FACE 
            ========================================================================= */}
        <div 
          className="flip-front glass-card rounded-2xl overflow-hidden flex flex-col"
          style={{ 
            boxShadow: isLiked ? `0 0 30px ${photo.color}30, 0 4px 24px rgba(0,0,0,0.4)` : "0 4px 24px rgba(0,0,0,0.4)",
            border: isLiked ? `1px solid ${photo.color}40` : "1px solid rgba(232, 121, 249, 0.15)",
          }}
          onClick={handleFlip}
        >
          {/* Image container - fills the rest of the space */}
          <div className="relative flex-1 bg-purple-950/50 overflow-hidden">
            
            <AnimatePresence>
              {isLoading && !hasError && (
                <motion.div key="skeleton" className="absolute inset-0 z-10" exit={{ opacity: 0, transition: { duration: 0.35 } }}>
                  <SkeletonCard />
                </motion.div>
              )}
            </AnimatePresence>

            {hasError && <CakeFallback name={photo.name} />}

            {!hasError && (
              <motion.img
                src={photo.image}
                alt={`Birthday photo for ${photo.name}`}
                loading="lazy"
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isLoading ? 0 : 1,
                  filter: isMystery ? "blur(12px) brightness(0.6)" : "blur(0px) brightness(1)"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {!isLoading && !hasError && !isMystery && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            )}

            {/* Overlaid UI */}
            {!isLoading && (
              <>
                {/* Scratch Card Overlay (only if not a mystery and not showing wish side) */}
                {!isMystery && <ScratchCard />}

                {/* Tag badge */}
                <div className="absolute top-2 left-2 z-[20] pr-12">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-body font-semibold ${tagStyle.bg} ${tagStyle.text} border ${tagStyle.border} backdrop-blur-sm truncate max-w-full`}>
                    <span className="text-[10px] shrink-0">{TAG_ICONS[photo.tag]}</span>
                    <span className="truncate">{photo.tag}</span>
                  </span>
                </div>

                {/* Mystery Lock Overlay */}
                {isMystery && (
                  <div className="absolute inset-0 z-[20] flex flex-col items-center justify-center p-4">
                    <motion.div
                      animate={unlockBurst ? { scale: [1, 1.5, 0], opacity: [1, 0, 0] } : {}}
                      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center border border-purple-500/30"
                    >
                      <Lock className="w-12 h-12 text-purple-400 mb-3" />
                      <h3 className="font-display font-bold text-xl text-white mb-2">Secret Wish</h3>
                      <button
                        onClick={handleUnlockClick}
                        className={`px-4 py-2 rounded-full font-body font-bold text-sm flex items-center gap-2 transition-all ${
                          points >= 50 
                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg cursor-pointer" 
                            : "bg-gray-800 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Unlock size={16} />
                        Unlock for 50 pts
                      </button>
                    </motion.div>
                  </div>
                )}

                {/* Action buttons */}
                {!isMystery && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-[20]">
                    <motion.button
                      onClick={handleLike}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                        isLiked ? "bg-pink-500/80 border-pink-400/50 shadow-lg shadow-pink-500/40" : "bg-black/40 border-white/20 hover:bg-pink-500/40"
                      }`}
                      aria-label={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart size={18} className={`transition-all duration-300 ${isLiked ? "fill-white text-white" : "text-white"}`} />
                    </motion.button>

                    <motion.button
                      onClick={handleShare}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 border border-white/20 backdrop-blur-sm hover:bg-purple-500/40 transition-all duration-300 cursor-pointer"
                      aria-label="Share"
                    >
                      <Share2 size={18} className="text-white" />
                    </motion.button>

                    {!isProd && (
                      <motion.button
                        onClick={handleDelete}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 border border-white/20 backdrop-blur-sm hover:bg-red-500/80 transition-all duration-300 cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} className="text-white" />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Name */}
                <div className="absolute bottom-2 left-2 right-2 z-[20] flex items-center justify-between pointer-events-none gap-2">
                  <p className="font-display font-bold text-base sm:text-lg text-white drop-shadow-md truncate">
                    {photo.name}
                  </p>
                  {!isMystery && (
                    <span className="text-[9px] sm:text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full text-white/80 font-body backdrop-blur-sm pointer-events-auto shrink-0 whitespace-nowrap">
                      Flip ⤾
                    </span>
                  )}
                </div>
              </>
            )}
            
            {/* Liked glow ringlet */}
            {isLiked && !isMystery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: `inset 0 0 20px ${photo.color}20` }}
              />
            )}
          </div>
        </div>

        {/* =========================================================================
            BACK FACE 
            ========================================================================= */}
        <div 
          className="flip-back glass-card flex flex-col justify-center px-4"
          style={{ 
            background: "linear-gradient(180deg, rgba(88, 28, 135, 0.9) 0%, rgba(30, 27, 75, 0.95) 100%)",
          }}
          onClick={handleFlip}
        >
          {/* Decorative background elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-600/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full" />

          {/* Wish content */}
          <div className="flex-1 relative z-10 flex flex-col text-center pt-2 overflow-hidden h-full">
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-center items-center w-full px-1">
              <Quote className="text-purple-400 mb-1.5 opacity-70 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <p className="font-display font-bold text-xs sm:text-sm text-purple-50 leading-snug drop-shadow-sm mb-1.5 break-words w-full text-center">
                "{photo.wish}"
              </p>
              <p className="text-[9px] sm:text-[10px] text-pink-300 font-semibold tracking-wider shrink-0">
                {photo.tag.toUpperCase()}
              </p>
            </div>
            
            {/* Stop propagation so reaction clicks don't flip the card */}
            <div onClick={e => e.stopPropagation()} className="pt-1 border-t border-white/10 shrink-0 w-full mb-1">
              <ReactionBar photoId={photo.id} />
            </div>

            <div className="flex items-center justify-between shrink-0 mb-1 w-full gap-2">
              <button className="text-[10px] font-body font-normal text-white/50 hover:text-white/80 transition-colors pointer-events-auto min-w-[44px] min-h-[36px]">
                ⤿ Back
              </button>
              
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center gap-1.5 px-2 py-1 bg-purple-800/40 hover:bg-purple-700/50 rounded-lg text-[10px] font-body text-purple-200 transition-colors pointer-events-auto min-w-[44px] min-h-[36px]"
              >
                <Share2 size={12} /> Share
              </motion.button>
            </div>
          </div>
        </div>

      </div>

      {/* Share toast */}
      <ToastContainer>
        {showShareToast && (
          <Toast message="Copied to clipboard!" onDismiss={() => setShowShareToast(false)} />
        )}
      </ToastContainer>

    </motion.article>
  );
}
