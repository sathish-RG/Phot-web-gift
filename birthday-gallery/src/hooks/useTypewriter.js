import { useState, useEffect } from "react";

export default function useTypewriter(text, delay = 100) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentString = "";
    let i = 0;
    setDisplayedText(""); 
    
    const intervalId = setInterval(() => {
      currentString += text.charAt(i);
      setDisplayedText(currentString);
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return displayedText;
}
