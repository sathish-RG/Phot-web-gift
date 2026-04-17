import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/FilterBar";
import GalleryGrid from "./components/GalleryGrid";
import FloatingAddButton from "./components/FloatingAddButton";
import LevelBanner from "./components/LevelBanner";
import LoadingBar from "./components/LoadingBar";
import PointsPopup, { usePointsPopup } from "./components/PointsPopup";
import ComboTracker, { useComboTracker } from "./components/ComboTracker";
import ConfettiBackground from "./components/ConfettiBackground";

// Store
import { useGameStore } from "./store/gameStore";

// Data
import { photos as initialPhotos } from "./data/photos";

export default function App() {
  const [photos, setPhotos] = useState(initialPhotos);
  const [activeTag, setActiveTag] = useState("All");
  const [popups, setPopups] = useState([]);
  const isProd = import.meta.env.PROD;

  // ── LoadingBar state ──────────────────────────────────────────────────────
  // Track settled images (loaded OR errored) vs total visible cards
  const [loadedCount, setLoadedCount] = useState(0);
  const totalRef = useRef(initialPhotos.length);

  const handleImageLoad = useCallback(() => {
    setLoadedCount((n) => n + 1);
  }, []);

  // Reset count when filter changes (new set of cards renders)
  const handleTagChange = useCallback((tag) => {
    setActiveTag(tag);
    setLoadedCount(0);
  }, []);

  // ── Zustand store ─────────────────────────────────────────────────────────
  const {
    points,
    streak,
    level,
    toggleLike,
    isLiked,
    checkStreak,
    addPoints,
  } = useGameStore();

  useEffect(() => { checkStreak(); }, []);

  // ── Points popup helpers ──────────────────────────────────────────────────
  const { spawnPopup, removePopup } = usePointsPopup();
  const handleRemovePopup = useCallback((id) => removePopup(setPopups)(id), []);

  // ── Combo tracker ─────────────────────────────────────────────────────────
  const handleCombo = useCallback((count) => { addPoints(count * 5); }, [addPoints]);
  const { registerHeart, comboCount, comboVisible } = useComboTracker({ onCombo: handleCombo });

  const handleLikeEvent = useCallback((event) => {
    spawnPopup(popups, setPopups)(10, event);
    registerHeart();
  }, [registerHeart]);

  // ── Filtered photos ───────────────────────────────────────────────────────
  const filteredPhotos = useMemo(() => {
    if (activeTag === "All") return photos;
    return photos.filter((p) => p.tag === activeTag);
  }, [photos, activeTag]);

  // Keep total in sync with filtered count (after filter changes)
  useEffect(() => {
    totalRef.current = filteredPhotos.length;
  }, [filteredPhotos.length]);

  const handleAddPhoto = useCallback((newPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    totalRef.current = filteredPhotos.length + 1;
  }, [filteredPhotos.length]);

  const handleDeletePhoto = useCallback(async (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  }, []);

  const handleReorderPhotos = useCallback((newOrder) => {
    if (activeTag === "All") setPhotos(newOrder);
  }, [activeTag]);

  const latestPhotosRef = useRef(photos);
  useEffect(() => { latestPhotosRef.current = photos; }, [photos]);

  const handleSaveOrder = useCallback(async () => {
    if (activeTag !== "All") return;
    try {
      await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOrder: latestPhotosRef.current })
      });
    } catch (e) {
      console.error("Reorder save failed:", e);
    }
  }, [activeTag]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Background mesh */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 10% 20%, rgba(139,92,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(236,72,153,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(61,219,217,0.04) 0%, transparent 60%),
            #0d0714
          `,
        }}
      />
      <ConfettiBackground />

      {/* ── Top loading bar (above everything) ── */}
      <LoadingBar loaded={loadedCount} total={totalRef.current} />

      {/* Navbar */}
      <Navbar points={points} streak={streak} level={level} />

      {/* Combo banner */}
      <ComboTracker comboCount={comboCount} visible={comboVisible} />

      {/* Floating points popups */}
      <PointsPopup popups={popups} onDone={handleRemovePopup} />

      <main className="relative z-10">
        <HeroSection totalPhotos={photos.length} filteredCount={filteredPhotos.length} />

        {/* Level progress banner */}
        <LevelBanner points={points} />

        {/* ── Main Gallery Content ── */}
        <div className="w-full box-border pb-[80px]">
          <FilterBar activeTag={activeTag} onTagChange={handleTagChange} />
          
          {/* The Grid Component */}
          <GalleryGrid
            photos={filteredPhotos}
            isLiked={isLiked}
            onToggleLike={toggleLike}
            onLikeEvent={handleLikeEvent}
            onImageLoad={handleImageLoad}
            onDeleteEvent={handleDeletePhoto}
            onReorderEvent={handleReorderPhotos}
            onSaveOrderEvent={handleSaveOrder}
            isDraggable={!isProd && activeTag === "All"}
          />
        </div>
      </main>

      {!isProd && <FloatingAddButton onAddPhoto={handleAddPhoto} />}

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-purple-500/10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-body text-purple-400/50 text-sm"
        >
          Made with ❤️ & 🎂 — Birthday Wishes Gallery
        </motion.p>
      </footer>
    </div>
  );
}
