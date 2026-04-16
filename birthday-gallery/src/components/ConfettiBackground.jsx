import { useMemo } from "react";

const COLORS = ["#f472b6", "#e879f9", "#fbbf24"]; // pink, purple, yellow

export default function ConfettiBackground() {
  // Generate 20 random confetti configs on mount, avoid changing them on every render
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 6 + 6}px`, // 6px to 12px
      height: `${Math.random() * 6 + 6}px`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 6}s`, // 6s to 10s
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute opacity-80"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            top: "-20px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration} linear infinite`,
            animationDelay: piece.delay,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px", // mix of circles and squares
          }}
        />
      ))}
    </div>
  );
}
