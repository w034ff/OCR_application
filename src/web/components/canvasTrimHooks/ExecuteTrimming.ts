import { useEffect } from 'react';
import { fabric } from 'fabric';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';
import { isNumber } from '../../utils/IsNumber';


export const useExecuteTrimming = (
  fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
  MIN_LEFT_TOP: number,
  EDGE_OFFSET: number,
) => {
  const { isTrimCanvas, trimRegionWidth, trimRegionHeight } = useGuideBarToolsContext();
  const { setTrimModeActive } = useSidebarStateContext();
  // drawing-canvasの切り取りを実行する処理
  useEffect(() => {
    if (fabricCanvas && fabricEditCanvas) {
      const rect = fabricEditCanvas.getObjects()[1];
      if (!(rect instanceof fabric.Rect)) return;

      // 切り取り領域内のオブジェクトを検索
      const objectsToCopy: fabric.Object[] = [];
      fabricCanvas.forEachObject((obj: fabric.Object) => {
        const objCenter = obj.getCenterPoint();
        if (isNumber(rect.top) && isNumber(rect.width) && isNumber(rect.left) && isNumber(rect.height) && isNumber(rect.scaleX) && isNumber(rect.scaleY)) {
          if (objCenter.x + EDGE_OFFSET >= rect.left && objCenter.x + EDGE_OFFSET <=  rect.left + rect.width * rect.scaleX &&
              objCenter.y + EDGE_OFFSET >= rect.top && objCenter.y + EDGE_OFFSET <= rect.top + rect.height * rect.scaleY) {
            objectsToCopy.push(obj);
          }
        }
        fabricCanvas.remove(obj);
      });

      // fabricCanvasのサイズを更新
      fabricCanvas.setWidth(trimRegionWidth);
      fabricCanvas.setHeight(trimRegionHeight);

      // オブジェクトを新しいキャンバスに複製
      objectsToCopy.forEach((obj: fabric.Object) => {
        const clone = fabric.util.object.clone(obj);
        if (isNumber(rect.left) && isNumber(rect.top)) {
          clone.set({
            left: clone.left - rect.left + MIN_LEFT_TOP,
            top: clone.top - rect.top + MIN_LEFT_TOP,
          });
        }
        fabricCanvas.add(clone);
      });

      fabricCanvas.renderAll();
      setTrimModeActive(false);
    }
  }, [isTrimCanvas]);
}
