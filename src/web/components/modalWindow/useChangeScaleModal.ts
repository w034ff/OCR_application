import { useEffect } from 'react';
import { useCanvasToolsContext } from "../../CanvasToolsContext";
import { useCanvasModalWindowContext } from './CanvasModalWindowContext';


export const useChangeScaleModal = (setSelectedScale: React.Dispatch<React.SetStateAction<number>>) => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag  } = useCanvasToolsContext();
  const { canvasModalMode, setResizeRatio } = useCanvasModalWindowContext();

  // scaleの大きさが更新されるとradioの入力値を更新する
  useEffect(() => {
    setSelectedScale(scale);
  }, [scale]);

  // モーダルを開いて画像をリサイズするときは、ラジオボタンの初期値を1にする（選択されていない状態にする）
  useEffect(() => {
    if (canvasModalMode === 'resize-canvas') {
      setSelectedScale(1);
    }
  }, [canvasModalMode]); 

  const applyZoomCanvas = (selectedScale: number) => {
    if (selectedScale === scale) return;

    setZoomScaleValue(selectedScale / Math.max(1, scale));
    setScale(selectedScale);
    setScaleUpdateFlag(flag => !flag);
  };

  const applyResizeCanvas = (selectedScale: number) => {
    setResizeRatio(selectedScale);
  };

  return { applyZoomCanvas, applyResizeCanvas };
}
