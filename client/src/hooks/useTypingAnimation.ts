import { useState, useEffect, useRef } from 'react';
import { type Language } from '@/lib/translations';

interface UseTypingAnimationProps {
  texts: {
    id: string[];
    en: string[];
  };
  currentLang: Language;
  speed?: number;
}

export function useTypingAnimation({ texts, currentLang, speed = 3000 }: UseTypingAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const currentTexts = texts[currentLang];
    setDisplayText(currentTexts[currentIndex]);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentTexts.length);
      setIsTyping(true);
      
      // Reset typing animation
      setTimeout(() => setIsTyping(false), 100);
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [texts, currentLang, speed, currentIndex]);

  return {
    displayText,
    isTyping
  };
}
