import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/IsNumber';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


// Rectオブジェクトのスケールが1を超えないよう調整
const adjustScale = (newScale: number) => Math.min(newScale, 1);

export const useExecuteResize = (
	fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
	MIN_LEFT_TOP: number,
  STROKE_WIDTH: number,
) => {
  const { trimRegionWidth, trimRegionHeight, setTrimRegionWidth, setTrimRegionHeight } = useGuideBarToolsContext();
  const { resizeModeActive, isResizeAspectRatioLocked } = useSidebarStateContext();

  // isAspectRatioCheckedがtrueのとき、アスペクト比を維持しながら切り取り領域を操作する
  useEffect(() => {
    if (fabricEditCanvas) {
      if (isResizeAspectRatioLocked) {
        fabricEditCanvas.uniformScaling = true; // uniformScalingは角のコントロールにのみアスペクト比の維持を適応する
      } else {
        fabricEditCanvas.uniformScaling = false;
      }
    }
  }, [isResizeAspectRatioLocked]);

  
  useEffect(() => {
    if (!fabricEditCanvas) return;

    const handleFabricRectScaling = (e: fabric.IEvent) => {
      const rect = e.target;
      if (!(rect instanceof fabric.Rect)) return;

      if (isNumber(rect.top) && isNumber(rect.width) && isNumber(rect.left) && isNumber(rect.height)) {
        let newScaleX = rect.scaleX || 1;
        let newScaleY = rect.scaleY || 1;

        setTrimRegionWidth(Math.round((rect.width - STROKE_WIDTH) * newScaleX));
        setTrimRegionHeight(Math.round((rect.height - STROKE_WIDTH) * newScaleY));
        rect.setCoords(); // オブジェクトの座標情報を更新
        fabricEditCanvas.renderAll(); // キャンバスの再描画
      }
    };

		const finishDrawing = () => {
			if (fabricCanvas && fabricEditCanvas) {
				const rect = fabricEditCanvas.getObjects()[0];
      	if (!(rect instanceof fabric.Rect)) return;

				if (rect.left !== MIN_LEFT_TOP) {
					const shiftAmountX = MIN_LEFT_TOP - rect.left;
		
					// rect.leftをMIN_LEFT_TOPに設定
					rect.left = MIN_LEFT_TOP;
		
					// すべてのオブジェクトを右方向に移動
					fabricCanvas.getObjects().forEach((obj:fabric.Object) => {
						obj.set('left', obj.left + shiftAmountX);
						obj.setCoords(); // オブジェクトの座標情報を更新
					});
		
					rect.setCoords(); // rectの座標情報を更新
				}

				if (rect.top !== MIN_LEFT_TOP) {
					const shiftAmountY = MIN_LEFT_TOP - rect.top;
		
					// rect.leftをMIN_LEFT_TOPに設定
					rect.top = MIN_LEFT_TOP;
		
					// すべてのオブジェクトを右方向に移動
					fabricCanvas.getObjects().forEach((obj:fabric.Object) => {
						obj.set('left', obj.top + shiftAmountY);
						obj.setCoords(); // オブジェクトの座標情報を更新
					});
		
					rect.setCoords(); // rectの座標情報を更新
				}

				fabricCanvas.setWidth(Math.round(rect.width * (rect.scaleX || 1) - STROKE_WIDTH));
				fabricCanvas.setHeight(Math.round(rect.height * (rect.scaleY || 1) - STROKE_WIDTH));
				fabricCanvas.renderAll();
			}
    };
    
    if (resizeModeActive) {
      fabricEditCanvas.on('object:scaling', handleFabricRectScaling);
			fabricEditCanvas.on('mouse:up', finishDrawing);
    }

    return () => {
      fabricEditCanvas.off('object:scaling', handleFabricRectScaling);
			fabricEditCanvas.off('mouse:up', finishDrawing);
    }
  }, [fabricEditCanvas, resizeModeActive]);

}
