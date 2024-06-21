import { useState } from 'react';
import { useCanvasToolsContext } from '../CanvasToolsContext';


export const useScaleUpdateOnWheel = () => {
  const { scale, setScale, setZoomScaleValue } = useCanvasToolsContext();
  const [isWheelScaleUpdate, setIsWheelScaleUpdate] = useState<boolean>(false);
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);


  const updateScaleOnWheel = (newScale: number, e: WheelEvent) => {
    setZoomScaleValue(newScale / Math.max(1, scale));
    setScale(newScale);
    setIsWheelScaleUpdate(flag => !flag); // レンダリングトリガー用のフラグを反転
    setClientX(e.clientX);
    setClientY(e.clientY);
  };

  return { isWheelScaleUpdate, clientX, clientY, updateScaleOnWheel };
};
