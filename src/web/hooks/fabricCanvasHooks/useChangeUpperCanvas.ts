import { useEffect } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';

export const useChangeUpperCanvas = (listenerRegistered: boolean) => {
  const { scale } = useCanvasToolsContext();

  // scaleが変更された際、edit-canvasとdrawing-canvasにおけるupper-canvasのscale値を変更
  useEffect(() => {
    const scaleStyle = `scale(${scale})`;
    const upperCanvases = document.querySelectorAll('.upper-canvas, .upper-edit-canvas');
    // 複数のupper-canvasのscaleを変更
    upperCanvases.forEach(canvas => {
      if (canvas instanceof HTMLElement) {
        canvas.style.transform = scaleStyle;
      }
    });
  }, [scale]);

  // イベント登録後upper-canvasのopacityを1に変更（変更しなければドラッグ領域が非表示になる）
  useEffect(() => {
    const upperCanvas = document.querySelector('.upper-canvas');
    if (upperCanvas instanceof HTMLElement) {
      upperCanvas.style.opacity = listenerRegistered ? '1' : '0';
    }
  }, [listenerRegistered]);
};
