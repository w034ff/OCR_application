import { useEffect } from 'react';
import { useSidebarStateContext } from '../components/sidebar/SidebarStateContext';

// trimDetailsVisibleが変更された際、edit-canvasにおけるupper-canvasのZ-Indexの値を調整
export const useAdjustEditCanvasZIndex = () => {
  const { trimModeActive, resizeModeActive} = useSidebarStateContext();

  useEffect(() => {
    const editLowerCanvas = document.getElementById('edit-canvas');
    const editCanvasContainer = editLowerCanvas?.parentElement;
    const editUpperCanvas = editCanvasContainer?.querySelector('.upper-canvas');
    if (editUpperCanvas instanceof HTMLElement) {
      if (trimModeActive || resizeModeActive) {
        editUpperCanvas.style.zIndex = "10";
      } else {
        editUpperCanvas.style.zIndex = "-1";
      }
    }
  }, [trimModeActive, resizeModeActive]);
};
