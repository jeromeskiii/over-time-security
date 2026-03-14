export const signatureEase = [0.16, 1, 0.3, 1] as const;

export function revealUp(reduced: boolean | null, distance = 28) {
  return reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
}

export function revealSide(reduced: boolean | null, distance = 36, direction: 1 | -1 = 1) {
  return reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, x: distance * direction },
        visible: { opacity: 1, x: 0 },
      };
}

export const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

// NumberFlow - Animated number counters

import { useEffect, useState, useRef } from 'react';

interface NumberFlowProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export function useNumberFlow({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    
    const animate = (currentTime: number) => {
      if (!startTime.current) return;
      
      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * value);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    rafId.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration]);

  return displayValue;
}

export function NumberFlow({ value, duration = 1500, format, className }: NumberFlowProps) {
  const displayValue = useNumberFlow({ value, duration });
  const formatted = format ? format(displayValue) : displayValue;
  
  return <span className={className}>{formatted}</span>;
}

export function TypingText({ text, speed = 40, delay = 0, className }: { text: string; speed?: number; delay?: number; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setDisplayed('');
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);
  
  return <span className={className}>{displayed}</span>;
}
