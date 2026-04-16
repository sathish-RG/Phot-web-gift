/**
 * useInView — lightweight IntersectionObserver hook.
 * Returns [ref, inView].
 * The image inside a card only starts loading once the card
 * scrolls within `rootMargin` of the viewport.
 */
import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Once in view → stay in view (no lazy-unload)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once only
        }
      },
      {
        rootMargin: options.rootMargin ?? "200px 0px", // pre-load 200px before visible
        threshold: options.threshold ?? 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
