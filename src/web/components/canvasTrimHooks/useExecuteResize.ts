import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';
import { isNumber, isRectValid } from '../../utils/validators';
import { shiftObjects, resizeAndMoveObjects } from '../../utils/fabricEditCanvasUtils';
import { MIN_LEFT_TOP, STROKE_WIDTH } from './editCanvasConstants';


export const useExecuteResize = (
	fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null
) => {
	const { setIsSaveState } = useHistoryContext();
  const { setTrimRegionWidth, setTrimRegionHeight } = useGuideBarToolsContext();
  const { resizeModeActive } = useSidebarStateContext();

	const initialScalingFlag = useRef<boolean>(false);

  
  useEffect(() => {
    if (!fabricEditCanvas) return;

    const handleFabricRectScaling = (e: fabric.IEvent) => {
      const rect = e.target;
			if (!(rect instanceof fabric.Rect)) return;

			if (!initialScalingFlag.current) {
				setIsSaveState((flag: boolean) => !flag);
				initialScalingFlag.current = true;
			}

      if (isNumber(rect.width) && isNumber(rect.scaleX) && isNumber(rect.height) && isNumber(rect.scaleY)) {
        setTrimRegionWidth(Math.round((rect.width - STROKE_WIDTH) * rect.scaleX));
        setTrimRegionHeight(Math.round((rect.height - STROKE_WIDTH) * rect.scaleY));
        rect.setCoords(); // オブジェクトの座標情報を更新
        fabricEditCanvas.renderAll(); // キャンバスの再描画
      }
    };

		const finishDrawing = () => {
			if (fabricCanvas && fabricEditCanvas) {
				const rect = fabricEditCanvas.getObjects()[0];
      	if (!(rect instanceof fabric.Rect)) return;

				if (isRectValid(rect)) {
					if (rect.left !== MIN_LEFT_TOP) {
						const shiftAmountX = MIN_LEFT_TOP - rect.left;
						rect.left = MIN_LEFT_TOP;
						shiftObjects(fabricCanvas, shiftAmountX, 0);
						rect.setCoords(); // rectの座標情報を更新
					}

					if (rect.top !== MIN_LEFT_TOP) {
						const shiftAmountY = MIN_LEFT_TOP - rect.top;
						rect.top = MIN_LEFT_TOP;
						shiftObjects(fabricCanvas, 0, shiftAmountY);
						rect.setCoords(); // rectの座標情報を更新
					}

					// 切り取りの実行及び切り取り領域内のオブジェクトを切り取り後のキャンバスに複製する
					resizeAndMoveObjects(
						fabricCanvas, rect,
						Math.round((rect.width - STROKE_WIDTH) * rect.scaleX),
						Math.round((rect.height - STROKE_WIDTH) * rect.scaleY)
					)
				}
				
				fabricCanvas.renderAll();
				initialScalingFlag.current = false;
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
