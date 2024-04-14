import { useEffect } from 'react';

// trimDetailsVisibleが変更された際、edit-canvasにおけるupper-canvasのZ-Indexの値を調整
export const useAdjustEditCanvasZIndex = (trimDetailsVisible: boolean) => {
  useEffect(() => {
    const editLowerCanvas = document.getElementById('edit-canvas');
    const editCanvasContainer = editLowerCanvas?.parentElement;
    const editUpperCanvas = editCanvasContainer?.querySelector('.upper-canvas');
    if (editUpperCanvas instanceof HTMLElement) {
      editUpperCanvas.style.zIndex = trimDetailsVisible ? "10" : "-1";
    }
  }, [trimDetailsVisible]);
};
