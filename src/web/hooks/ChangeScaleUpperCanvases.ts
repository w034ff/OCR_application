import { useEffect } from 'react';

// scaleが変更された際、edit-canvasとdrawing-canvasにおけるupper-canvasのscale値を変更
export const useChangeScaleUpperCanvases = (scale: number) => {
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
