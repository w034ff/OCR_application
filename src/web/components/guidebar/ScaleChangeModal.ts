import React, { useEffect } from 'react';
import { useCanvasToolsContext } from "../../CanvasToolsContext";


export const useScaleChangeModal = (setSelectedScale: React.Dispatch<React.SetStateAction<number>>) => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag  } = useCanvasToolsContext();

  // scaleの大きさが更新されるとradioの入力値を更新する
  useEffect(() => {
    setSelectedScale(scale);
  }, [scale]);

  const applyScaleChange = (selectedScale: number) => {
    if (selectedScale === scale) return;

    setZoomScaleValue(selectedScale / Math.max(1, scale));
    setScale(selectedScale);
    setScaleUpdateFlag(flag => !flag);
  };

  return applyScaleChange;
}
