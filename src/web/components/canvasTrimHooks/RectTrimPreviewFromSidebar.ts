import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/IsNumber';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';


// Rectオブジェクトの両側のストロークの合計太さ。サイズ計算時に枠線を考慮するために使用
const TOTAL_STROKE_WIDTH = 4;
// Rectオブジェクトのスケールが1を超えないよう調整
const adjustScale = (newScale: number) => Math.min(newScale, 1);

export const useRectTrimPreviewFromSidebar = (
  fabricEditCanvas: fabric.Canvas | null,
  MIN_LEFT_TOP: number,
  EDGE_OFFSET: number,
  STROKE_WIDTH: number,
) => {
  const { trimRegionChanged, trimRegionWidth, trimRegionHeight } = useGuideBarToolsContext();

  useEffect(() => {
    if (!fabricEditCanvas) return;

    // キャンバスのオブジェクトリストからrectオブジェクトを取得
    const rect = fabricEditCanvas.getObjects()[1];
    if (!(rect instanceof fabric.Rect)) return;
    
    if (isNumber(rect.top) && isNumber(rect.width) && isNumber(rect.left) && isNumber(rect.height)) {
      const scaleX = adjustScale((trimRegionWidth + STROKE_WIDTH) / rect.width);
      const scaleY = adjustScale((trimRegionHeight + STROKE_WIDTH) / rect.height);
      let newLeft = rect.left + (rect.getScaledWidth() - (trimRegionWidth + TOTAL_STROKE_WIDTH)) / 2;
      let newTop = rect.top + (rect.getScaledHeight() - (trimRegionHeight + TOTAL_STROKE_WIDTH)) / 2;

      if (rect.left + (trimRegionWidth + TOTAL_STROKE_WIDTH) > rect.width + EDGE_OFFSET) {
        newLeft = rect.width + EDGE_OFFSET - trimRegionWidth - TOTAL_STROKE_WIDTH;
      }

      if (rect.top + (trimRegionHeight + TOTAL_STROKE_WIDTH) > rect.height + EDGE_OFFSET) {
        newTop = rect.height + EDGE_OFFSET - trimRegionHeight - TOTAL_STROKE_WIDTH;
      }
      
      rect.set({
        scaleX: scaleX, scaleY: scaleY,
        left: Math.max(MIN_LEFT_TOP, newLeft), top: Math.max(MIN_LEFT_TOP, newTop)
      });
    }
    rect.setCoords(); // オブジェクトの座標情報を更新
    fabricEditCanvas.renderAll(); // キャンバスの再描画
  }, [fabricEditCanvas, trimRegionChanged]);
}
