import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Level Thresholds ────────────────────────────────────────────────────────
export const LEVELS = [
  { min: 0,   max: 50,  label: "Party Starter",   emoji: "🎈", color: "#a855f7" },
  { min: 51,  max: 150, label: "Confetti King",    emoji: "🎉", color: "#ec4899" },
  { min: 151, max: 300, label: "Birthday Legend",  emoji: "👑", color: "#f59e0b" },
  { min: 301, max: Infinity, label: "Galaxy Star", emoji: "🌟", color: "#06b6d4" },
];

export function getLevelInfo(points) {
  const lvl = LEVELS.find((l) => points >= l.min && points <= l.max) ?? LEVELS[LEVELS.length - 1];
  // next level progress
  const nextLvl = LEVELS[LEVELS.indexOf(lvl) + 1];
  const progress = nextLvl
    ? Math.min(100, Math.round(((points - lvl.min) / (nextLvl.min - lvl.min)) * 100))
    : 100;
  const pointsToNext = nextLvl ? nextLvl.min - points : 0;
  return { ...lvl, progress, pointsToNext, nextLvl };
}

// ─── Store ───────────────────────────────────────────────────────────────────
export const useGameStore = create(
  persist(
    (set, get) => ({
      points: 0,
      level: "Party Starter",
      streak: 0,
      lastVisit: null,
      unlockedCards: [],

      // Add points and recalculate level
      addPoints: (amount = 10) => {
        const newPoints = get().points + amount;
        const { label } = getLevelInfo(newPoints);
        set({ points: newPoints, level: label });
      },

      // Call on app mount — compare today vs lastVisit
      checkStreak: () => {
        const today = new Date().toISOString().slice(0, 10);
        const { lastVisit, streak } = get();
        if (!lastVisit) {
          set({ streak: 1, lastVisit: today });
          return;
        }
        const last = new Date(lastVisit);
        const diff = Math.floor(
          (new Date(today) - last) / (1000 * 60 * 60 * 24)
        );
        if (diff === 0) return; // same day
        if (diff === 1) {
          set({ streak: streak + 1, lastVisit: today });
        } else {
          set({ streak: 1, lastVisit: today }); // reset
        }
      },

      // Spend 50 pts to unlock a locked card
      unlockCard: (id) => {
        const { points, unlockedCards } = get();
        if (points < 50 || unlockedCards.includes(id)) return false;
        const newPoints = points - 50;
        const { label } = getLevelInfo(newPoints);
        set({
          points: newPoints,
          level: label,
          unlockedCards: [...unlockedCards, id],
        });
        return true;
      },

      // Liked card ids (for heart tracking)
      likedCards: [],
      toggleLike: (id) => {
        const { likedCards, addPoints } = get();
        const isLiked = likedCards.includes(id);
        if (!isLiked) addPoints(10);
        set({
          likedCards: isLiked
            ? likedCards.filter((c) => c !== id)
            : [...likedCards, id],
        });
      },
      isLiked: (id) => get().likedCards.includes(id),

      // Reactions: photoId -> { "🎂": count, "😍": count, ... }
      reactions: {},
      addReaction: (photoId, emoji) => {
        const { reactions } = get();
        const photoReactions = reactions[photoId] || {};
        const count = photoReactions[emoji] || 0;
        set({
          reactions: {
            ...reactions,
            [photoId]: {
              ...photoReactions,
              [emoji]: count + 1,
            },
          },
        });
      },
    }),
    {
      name: "birthday-gallery-game-v2",
    }
  )
);
