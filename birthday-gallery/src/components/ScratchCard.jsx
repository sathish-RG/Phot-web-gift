import { useRef, useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function ScratchCard({ onComplete, width, height }) {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    // Fill with gold gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#fbbf24"); // Amber-400
    gradient.addColorStop(0.5, "#fef3c7"); // Amber-50
    gradient.addColorStop(1, "#f59e0b"); // Amber-500
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some random "glitter" dots
    for (let i = 0; i < 200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#fcd34d";
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
  }, []);

  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    let transparentCount = 0;
    // Check alpha values (every 4th value)
    for (let i = 3; i < imgData.length; i += 4) {
      if (imgData[i] < 10) transparentCount++; // Almost fully transparent
    }
    
    const totalPixels = imgData.length / 4;
    const percentage = (transparentCount / totalPixels) * 100;
    
    if (percentage > 70) {
      setIsScratched(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#e879f9", "#3ddbd9"]
      });
      if (onComplete) onComplete();
    }
  };

  const handlePointerDown = (e) => {
    if (isScratched) return;
    setIsDrawing(true);
    const { x, y } = getPointerPos(e);
    scratch(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || isScratched) return;
    // Prevent scrolling when scratching on touch
    if (e.cancelable && e.type === "touchmove") e.preventDefault();
    const { x, y } = getPointerPos(e);
    scratch(x, y);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    checkScratchPercentage();
  };

  return (
    <AnimatePresence>
      {!isScratched && (
        <motion.canvas
          ref={canvasRef}
          width={width || 300}
          height={height || 300}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.6 } }}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-[15]"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
          style={{ objectFit: 'cover' }}
        />
      )}
    </AnimatePresence>
  );
}
