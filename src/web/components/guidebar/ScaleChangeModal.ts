import React, { useEffect } from 'react';
import { useCanvasToolsContext } from "../../CanvasToolsContext";
import { useScaleModalWindowContext } from './ScaleModalWindowContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


export const useScaleChangeModal = (setSelectedScale: React.Dispatch<React.SetStateAction<number>>) => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag  } = useCanvasToolsContext();
  const { scaleModalMode } = useScaleModalWindowContext();
  const { setResizeRatio } = useSidebarStateContext();

  // scaleの大きさが更新されるとradioの入力値を更新する
  useEffect(() => {
    setSelectedScale(scale);
  }, [scale]);

  // モーダルを開いて画像をリサイズするときは、ラジオボタンの初期値を1にする（選択されていない状態にする）
  useEffect(() => {
    if (scaleModalMode === 'image-scaling') {
      setSelectedScale(1);
    }
  }, [scaleModalMode]); 

  const applyScaleChange = (selectedScale: number) => {
    if (selectedScale === scale) return;

    setZoomScaleValue(selectedScale / Math.max(1, scale));
    setScale(selectedScale);
    setScaleUpdateFlag((flag: boolean) => !flag);
  };

  const applyResizeCanvas = (selectedScale: number) => {
    setResizeRatio(selectedScale);
  };

  return { applyScaleChange, applyResizeCanvas };
}
