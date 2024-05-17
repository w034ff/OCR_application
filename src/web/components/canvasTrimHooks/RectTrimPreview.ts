import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/IsNumber';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


// Rectオブジェクトのスケールが1を超えないよう調整
const adjustScale = (newScale: number) => Math.min(newScale, 1);

export const useRectTrimPreview = (
  fabricEditCanvas: fabric.Canvas | null,
  MIN_LEFT_TOP: number,
  EDGE_OFFSET: number,
  STROKE_WIDTH: number,
) => {
  const { isTrimAspectRatioLocked, setTrimRegionWidth, setTrimRegionHeight } = useGuideBarToolsContext();
  const { trimModeActive } = useSidebarStateContext();

  // isAspectRatioCheckedがtrueのとき、アスペクト比を維持しながら切り取り領域を操作する
  useEffect(() => {
    if (fabricEditCanvas) {
      if (isTrimAspectRatioLocked) {
        fabricEditCanvas.uniformScaling = true; // uniformScalingは角のコントロールにのみアスペクト比の維持を適応する
      } else {
        fabricEditCanvas.uniformScaling = false;
      }
    }
  }, [isTrimAspectRatioLocked]);

  
  useEffect(() => {
    if (!fabricEditCanvas) return;

    const handleFabricRectScaling = (e: fabric.IEvent) => {
      const rect = e.target;
      if (!(rect instanceof fabric.Rect)) return;

      if (isNumber(rect.top) && isNumber(rect.width) && isNumber(rect.left) && isNumber(rect.height)) {
        let newScaleX = rect.scaleX || 1;
        let newScaleY = rect.scaleY || 1;
        const right_bottom  = rect.getPointByOrigin('right', 'bottom');

        if (rect.left < MIN_LEFT_TOP) {
          // rectが左の境界を超えた場合、左端に合わせてスケール調整
          newScaleX = adjustScale((right_bottom.x - EDGE_OFFSET) / rect.width);
          rect.set ({ left: MIN_LEFT_TOP, scaleX: newScaleX });
        } else if (right_bottom.x > rect.width + EDGE_OFFSET) {
          // rectが右の境界を超えた場合、右端に合わせてスケール調整
          newScaleX = adjustScale((rect.width + MIN_LEFT_TOP - rect.left) / rect.width);
          rect.set ({ scaleX: newScaleX });
        }

        if (rect.top < MIN_LEFT_TOP) {
          // rectが上の境界を超えた場合、上端に合わせてスケール調整
          newScaleY = adjustScale((right_bottom.y - EDGE_OFFSET) / rect.height);
          rect.set ({ top: MIN_LEFT_TOP, scaleY: newScaleY });
        } else if (right_bottom.y > rect.height + EDGE_OFFSET){
          // rectが下の境界を超えた場合、下端に合わせてスケール調整
          newScaleY = adjustScale((rect.height + MIN_LEFT_TOP - rect.top) / rect.height);
          rect.set ({ scaleY: newScaleY });
        }

        setTrimRegionWidth(Math.round((rect.width - STROKE_WIDTH) * newScaleX));
        setTrimRegionHeight(Math.round((rect.height - STROKE_WIDTH) * newScaleY));
        rect.setCoords(); // オブジェクトの座標情報を更新
        fabricEditCanvas.renderAll(); // キャンバスの再描画
      }
    };

    const handleFabricRectMoving = (e: fabric.IEvent) => {
      const rect = e.target;
      if (!(rect instanceof fabric.Rect)) return;

      const adjustPoint = (newPoint: number) => Math.max(newPoint, MIN_LEFT_TOP);
      if (isNumber(rect.top) && isNumber(rect.width) &&
        isNumber(rect.left) && isNumber(rect.height) &&
        isNumber(rect.scaleX) && isNumber(rect.scaleY)) {

        const newLeft = adjustPoint(Math.min(rect.left, rect.width + MIN_LEFT_TOP - rect.width * rect.scaleX));
        const newTop = adjustPoint(Math.min(rect.top, rect.height + MIN_LEFT_TOP - rect.height * rect.scaleY));

        rect.set({ left: newLeft, top: newTop });
        rect.setCoords(); // オブジェクトの座標情報を更新
        fabricEditCanvas.renderAll(); // 移動時にキャンバスを再描画
      }
    }
    
    if (trimModeActive) {
      fabricEditCanvas.on('object:scaling', handleFabricRectScaling);
      fabricEditCanvas.on('object:moving', handleFabricRectMoving);
    }

    return () => {
      fabricEditCanvas.off('object:scaling', handleFabricRectScaling);
      fabricEditCanvas.off('object:moving', handleFabricRectMoving);
    }
  }, [fabricEditCanvas, trimModeActive]);

}
