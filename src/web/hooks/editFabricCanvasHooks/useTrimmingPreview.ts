import { useEffect } from 'react';
import { fabric } from 'fabric';
import { MIN_LEFT_TOP, EDGE_OFFSET, STROKE_WIDTH } from './editCanvasConstants';
import { isRectPropsNumber } from '../../utils/validators';
import { adjustScale } from '../../utils/fabricEditCanvasUtils';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';
import { useSidebarStateContext } from '../../components/Sidebar/SidebarStateContext';


// rectがfabricCanvasの領域（左・上方向）を超えて移動しないよう制限する関数
const adjustPoint = (newPoint: number) => Math.max(newPoint, MIN_LEFT_TOP);

export const useTrimmingPreview = (fabricEditCanvas: fabric.Canvas | null) => {
  const { setTrimRegionWidth, setTrimRegionHeight } = useEditCanvasToolsContext();
  const { trimModeActive } = useSidebarStateContext();

  
  const handleFabricRectMoving = (e: fabric.IEvent) => {
    const rect = e.target;
    if (!(rect instanceof fabric.Rect) || !isRectPropsNumber(rect)) return;

    rect.set({
      left: adjustPoint(Math.min(rect.left, rect.width + MIN_LEFT_TOP - rect.width * rect.scaleX)),
      top: adjustPoint(Math.min(rect.top, rect.height + MIN_LEFT_TOP - rect.height * rect.scaleY))
    });
  }

  const handleFabricRectScaling = (e: fabric.IEvent) => {
    const rect = e.target;
    if (!(rect instanceof fabric.Rect) || !isRectPropsNumber(rect)) return;

    const right_bottom  = rect.getPointByOrigin('right', 'bottom');

    if (rect.left < MIN_LEFT_TOP) {
      // rectが左の境界を超えた場合、左端に合わせてスケール調整
      rect.scaleX = adjustScale((right_bottom.x - EDGE_OFFSET) / rect.width);
      rect.set ({ left: MIN_LEFT_TOP, scaleX: rect.scaleX });
    } else if (right_bottom.x > rect.width + EDGE_OFFSET) {
      // rectが右の境界を超えた場合、右端に合わせてスケール調整
      rect.scaleX = adjustScale((rect.width + MIN_LEFT_TOP - rect.left) / rect.width);
      rect.set ({ scaleX: rect.scaleX });
    }

    if (rect.top < MIN_LEFT_TOP) {
      // rectが上の境界を超えた場合、上端に合わせてスケール調整
      rect.scaleY = adjustScale((right_bottom.y - EDGE_OFFSET) / rect.height);
      rect.set ({ top: MIN_LEFT_TOP, scaleY: rect.scaleY });
    } else if (right_bottom.y > rect.height + EDGE_OFFSET){
      // rectが下の境界を超えた場合、下端に合わせてスケール調整
      rect.scaleY = adjustScale((rect.height + MIN_LEFT_TOP - rect.top) / rect.height);
      rect.set ({ scaleY: rect.scaleY });
    }

    setTrimRegionWidth(Math.round((rect.width - STROKE_WIDTH) * rect.scaleX));
    setTrimRegionHeight(Math.round((rect.height - STROKE_WIDTH) * rect.scaleY));
  };
  

  useEffect(() => {
    if (!fabricEditCanvas || !trimModeActive) return;

    fabricEditCanvas.on('object:scaling', handleFabricRectScaling);
    fabricEditCanvas.on('object:moving', handleFabricRectMoving);

    return () => {
      fabricEditCanvas.off('object:scaling', handleFabricRectScaling);
      fabricEditCanvas.off('object:moving', handleFabricRectMoving);
    }
  }, [fabricEditCanvas, trimModeActive]);

}
