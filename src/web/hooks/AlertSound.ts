import { useRef, useEffect, useCallback } from 'react';
import alertSound from '../components/assets/wav/Windows_Background.wav';

// カスタムフックの定義
export const useAlertSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(alertSound);

    return () => {
      audioRef.current = null;
    };
  }, []);

  const playAlertSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  }, []);

  return playAlertSound;
};
