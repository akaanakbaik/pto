import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Settings } from '@shared/schema';

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  useEffect(() => {
    if (audioRef.current && settings?.backgroundAudioUrl) {
      audioRef.current.src = settings.backgroundAudioUrl;
    }
  }, [settings?.backgroundAudioUrl]);

  const toggleAudio = async () => {
    if (!audioRef.current || !settings?.backgroundAudioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  // Hide on admin page
  if (location.includes('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={toggleAudio}
        disabled={!settings?.backgroundAudioUrl}
        className="w-14 h-14 rounded-full bg-gold/90 hover:bg-gold border-2 border-white/20 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xl transition-transform duration-300 group-hover:scale-110 ${isPlaying ? 'animate-pulse' : ''}`} />
      </Button>
      
      {settings?.backgroundAudioUrl && (
        <audio
          ref={audioRef}
          loop
          preload="none"
          onEnded={handleAudioEnd}
          onError={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
