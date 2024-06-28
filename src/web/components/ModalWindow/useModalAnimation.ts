import { useState, useCallback, useEffect } from 'react';
import { useModalWindowContext } from './ModalWindowContext';
import { useAlertSound } from '../../hooks/useAlertSound';


export const useModalAnimation = () => {
  const { ModalMode } = useModalWindowContext();
  const playAlertSound = useAlertSound();

  const [animationKey, setAnimationKey] = useState(0); 

  // モーダルを閉じた際、アニメーションキーをリセット
  useEffect(() => {
    if (ModalMode === '') {
      setAnimationKey(0);
    }
  }, [ModalMode]); 

  // モーダルウィンドウの領域外をクリック時、ウィンドウをハイライトする処理
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playAlertSound();
    setAnimationKey(prevKey => prevKey + 1);
  }, []);


  return { animationKey, handleOverlayClick };
}
