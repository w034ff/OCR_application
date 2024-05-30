import { useEffect } from 'react';
import { fabric } from 'fabric';
import { MIN_LEFT_TOP, EDGE_OFFSET, STROKE_WIDTH, TOTAL_STROKE_WIDTH } from './editCanvasConstants';
import { isRectPropsNumber } from '../../utils/validators';
import { adjustScale, isFabricRect } from '../../utils/fabricEditCanvasUtils';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


export const useTrimmingPreviewFromSidebar = (fabricEditCanvas: fabric.Canvas | null) => {
  const { trimRegionChanged, trimRegionWidth, trimRegionHeight } = useEditCanvasToolsContext();
  const { trimModeActive} = useSidebarStateContext();

  useEffect(() => {
    if (!fabricEditCanvas || !trimModeActive) return;

    // キャンバスのオブジェクトリストからrectオブジェクトを取得
    const rect = fabricEditCanvas.getObjects()[1];
    if (!isFabricRect(rect) || !isRectPropsNumber(rect)) return;

    rect.scaleX = adjustScale((trimRegionWidth + STROKE_WIDTH) / rect.width);
    rect.scaleY = adjustScale((trimRegionHeight + STROKE_WIDTH) / rect.height);

    let newLeft = rect.left + (rect.getScaledWidth() - (trimRegionWidth + TOTAL_STROKE_WIDTH)) / 2;
    let newTop = rect.top + (rect.getScaledHeight() - (trimRegionHeight + TOTAL_STROKE_WIDTH)) / 2;

    if (rect.left + (trimRegionWidth + TOTAL_STROKE_WIDTH) > rect.width + EDGE_OFFSET) {
      newLeft = rect.width + EDGE_OFFSET - trimRegionWidth - TOTAL_STROKE_WIDTH;
    }

    if (rect.top + (trimRegionHeight + TOTAL_STROKE_WIDTH) > rect.height + EDGE_OFFSET) {
      newTop = rect.height + EDGE_OFFSET - trimRegionHeight - TOTAL_STROKE_WIDTH;
    }
    
    rect.set({
      scaleX: rect.scaleX,
      scaleY: rect.scaleY,
      left: Math.max(MIN_LEFT_TOP, newLeft),
      top: Math.max(MIN_LEFT_TOP, newTop)
    });
    rect.setCoords(); // オブジェクトの座標情報を更新
    fabricEditCanvas.renderAll(); // キャンバスの再描画
  }, [fabricEditCanvas, trimRegionChanged]);
  
}
