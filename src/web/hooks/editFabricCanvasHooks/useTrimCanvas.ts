import { useEffect } from 'react';
import { fabric } from 'fabric';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';
import { useSidebarStateContext } from '../../components/Sidebar/SidebarStateContext';
import { isFabricRect, resizeAndMoveObjects } from '../../utils/fabricEditCanvasUtils';


export const useTrimCanvas = (
  fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
) => {
  const { isTrimCanvas, trimRegionWidth, trimRegionHeight } = useEditCanvasToolsContext();
  const { setTrimModeActive } = useSidebarStateContext();

  // drawing-canvasの切り取りを実行する処理
  useEffect(() => {
    if (fabricCanvas && fabricEditCanvas) {
      const rect = fabricEditCanvas.getObjects()[1];
      if (!isFabricRect(rect)) return;

      fabricCanvas.renderOnAddRemove = false;

      // 切り取りの実行及び切り取り領域内のオブジェクトを切り取り後のキャンバスに複製する
      resizeAndMoveObjects(fabricCanvas, rect, trimRegionWidth, trimRegionHeight);

      fabricCanvas.renderAll();
      fabricCanvas.renderOnAddRemove = true;
      setTrimModeActive(false); //トリミングモードを解除する
    }
  }, [isTrimCanvas]);

}
