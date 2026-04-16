import { useState, useEffect } from "react";

const STORAGE_KEY = "birthday_gallery_game";

const defaultState = {
  points: 0,
  streak: 0,
  level: 1,
  likedCards: [],
  lastInteraction: null,
};

export function useGameStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addPoints = (amount = 10) => {
    setState((prev) => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        streak: prev.streak + 1,
        lastInteraction: Date.now(),
      };
    });
  };

  const toggleLike = (photoId) => {
    setState((prev) => {
      const isLiked = prev.likedCards.includes(photoId);
      const newLiked = isLiked
        ? prev.likedCards.filter((id) => id !== photoId)
        : [...prev.likedCards, photoId];

      const pointDelta = isLiked ? -10 : 10;
      const newPoints = Math.max(0, prev.points + pointDelta);
      const newLevel = Math.floor(newPoints / 100) + 1;

      return {
        ...prev,
        likedCards: newLiked,
        points: newPoints,
        level: newLevel,
        streak: isLiked ? Math.max(0, prev.streak - 1) : prev.streak + 1,
      };
    });
  };

  const isLiked = (photoId) => state.likedCards.includes(photoId);

  const resetGame = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    points: state.points,
    streak: state.streak,
    level: state.level,
    likedCards: state.likedCards,
    addPoints,
    toggleLike,
    isLiked,
    resetGame,
  };
}
