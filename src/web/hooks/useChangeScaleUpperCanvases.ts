import { useEffect } from 'react';
import { useCanvasToolsContext } from '../CanvasToolsContext';

// scaleが変更された際、edit-canvasとdrawing-canvasにおけるupper-canvasのscale値を変更
export const useChangeScaleUpperCanvases = () => {
  const { scale } = useCanvasToolsContext();
  useEffect(() => {
    const scaleStyle = `scale(${scale})`;
    // 複数のupper-canvasに対応(3つ以上のcanvasを追加する際は注意が必要)
    document.querySelectorAll('.upper-canvas').forEach(upperCanvas => {
      if (upperCanvas instanceof HTMLElement) {
        upperCanvas.style.transform = scaleStyle;
      }
    });
  }, [scale]);
};
